// Report every auto-link linkHardwareMentions() (src/lib/hardware-links.ts) creates on
// hardware detail pages, so wrong matches can be spotted by eye.
// Fields and order mirror ComponentLayout: verdict label, pros, cons, body paragraphs.
// Usage: npm run audit:links   (run after npm run build to check hrefs against dist/)
import { existsSync } from 'node:fs';
import { ROUTE_TABLES, SKIPPED, AMBIGUOUS, LINK_INDEX, linkHardwareMentions } from '../src/lib/hardware-links.ts';
import { toSlug } from '../src/lib/slug.ts';

const lines = (v) => (typeof v === 'string' ? v : '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const paras = (v) => (typeof v === 'string' ? v : '').split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
const anchor = /<a href="([^"]+)" class="hw-mention">(.*?)<\/a>/g;

// Self-check: escaping, longest-first, word boundary, self-link, first mention only.
{
  const apus = LINK_INDEX.get('Apus')?.href, apus2 = LINK_INDEX.get('Apus 2')?.href;
  const out = linkHardwareMentions('<b>Apus 2</b> beats Apus 25, Apus 2.5 and Apus; Apus 2 again', { selfHref: apus, alreadyLinked: new Set() });
  const want = `&lt;b&gt;<a href="${apus2}" class="hw-mention">Apus 2</a>&lt;/b&gt; beats Apus 25, Apus 2.5 and Apus; Apus 2 again`;
  if (out !== want) { console.error(`linker self-check failed:\n got  ${out}\n want ${want}`); process.exit(1); }
}

const all = [], perCat = {};
for (const { file, base, records } of ROUTE_TABLES) {
  perCat[file] = 0;
  for (const r of records) {
    if (typeof r?.Name !== 'string' || !r.Name.trim()) continue;
    const page = `${base}/${toSlug(r.Name)}`;
    const opts = { selfHref: page, alreadyLinked: new Set() };
    const fields = [['verdict', r['Verdict Label'] ?? ''], ...lines(r.Pros).map((t) => ['pro', t]), ...lines(r.Cons).map((t) => ['con', t]), ...paras(r.Body).map((t) => ['body', t])];
    for (const [field, text] of fields) {
      for (const [, href, txt] of linkHardwareMentions(text, opts).matchAll(anchor)) {
        all.push({ page, field, txt, href });
        perCat[file]++;
      }
    }
  }
}

const hasDist = existsSync('dist');
const broken = hasDist ? all.filter((l) => !existsSync(`dist${l.href}/index.html`)) : [];

console.log(`HARDWARE MENTION LINKS: ${all.length} total`);
for (const [cat, n] of Object.entries(perCat)) console.log(`  ${cat.padEnd(18)} ${n}`);
console.log('\nLINKS (source page [field] -> linked text -> target)');
for (const l of all) console.log(`  ${l.page} [${l.field}] -> "${l.txt}" -> ${l.href}`);
console.log(`\nSKIPPED NAMES (${SKIPPED.length})`);
for (const s of SKIPPED) console.log(`  "${s.text}" (${s.reason}) ${s.href}`);
console.log(`\nAMBIGUOUS NAMES, not linked (${AMBIGUOUS.length})`);
for (const a of AMBIGUOUS) console.log(`  "${a.text}" -> ${a.hrefs.join(' | ')}`);
console.log(hasDist ? `\nBROKEN HREFS (not in dist): ${broken.length}` : '\nBROKEN HREFS: skipped, no dist/ (run npm run build first)');
for (const b of broken) console.log(`  ${b.page} -> ${b.href}`);
if (broken.length) process.exit(1);

// Audit hardware product images against src/data/hardware/*.json.
// Image paths come from the Airtable "Image URL" field, read via imageOf() (src/lib/hardware-image.ts);
// files live in public/media/hardware/<category>/. Matching is exact-case (GitHub Pages is Linux).
// Usage: npm run audit:images            report only, exit 0
//        npm run audit:images -- --strict exit 1 if any CASE/NAME MISMATCH exists
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { imageOf } from '../src/lib/hardware-image.ts';
import { toSlug } from '../src/lib/slug.ts';

const DATA = 'src/data/hardware';
const norm = (f) => f.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const stripPrefix = (s, p) => (p && s.startsWith(p + '-') ? s.slice(p.length + 1) : s);
const kind = (p) => (!p ? 'empty' : p.startsWith('/') ? 'local' : 'external');
const dirCache = {};
const ls = (dir) => (dirCache[dir] ??= existsSync('public' + dir) ? readdirSync('public' + dir) : []);
const pad = (rows) => {
  const w = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i]).length)));
  return rows.map((r) => r.map((c, i) => String(c).padEnd(w[i])).join('  ').trimEnd()).join('\n');
};

const summary = [['category', 'records', 'MATCH', 'MISMATCH', 'missing-file', 'external', 'empty', 'FILE-NO-RECORD']];
const mismatches = [], missing = [], noImage = [], orphans = [], problems = [];

for (const file of readdirSync(DATA).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const cat = file.replace(/\.json$/, '');
  let records;
  try { records = JSON.parse(readFileSync(`${DATA}/${file}`, 'utf8')); }
  catch (e) { problems.push(`${file}: unreadable JSON (${e.message})`); continue; }
  const c = { match: 0, mismatch: 0, missing: 0, external: 0, empty: 0, orphan: 0 };
  const claimed = new Set(); // "dir/filename" claimed by a record
  const ext = [], emp = [];

  for (const r of records) {
    const p = imageOf(r);
    const k = kind(p);
    if (k === 'external') { c.external++; ext.push(r.Name); continue; }
    if (k === 'empty') { c.empty++; emp.push(r.Name); continue; }
    const dir = p.slice(0, p.lastIndexOf('/')), base = p.slice(p.lastIndexOf('/') + 1);
    const files = ls(dir);
    if (files.includes(base)) { c.match++; claimed.add(`${dir}/${base}`); continue; }
    const b = toSlug(r.Brand), want = norm(base);
    const near = files.find((f) => { const n = norm(f); return n === want || stripPrefix(n, b) === stripPrefix(want, b); });
    if (near) { c.mismatch++; claimed.add(`${dir}/${near}`); mismatches.push([cat, r.id, r.Name, p, `${dir}/${near}`]); }
    else { c.missing++; missing.push([cat, r.id, r.Name, p]); }
  }
  if (ext.length) noImage.push(`${cat}: external ${ext.length} — ${ext.join(', ')}`);
  if (emp.length) noImage.push(`${cat}: empty ${emp.length} — ${emp.join(', ')}`);

  // Files nobody claims, with near-miss candidate records from the same category.
  const dir = `/media/hardware/${cat}`;
  const tail = cat.replace(/s$/, ''); // extruders -> extruder, hotends -> hotend, nozzles -> nozzle
  const catOrphans = [];
  for (const f of ls(dir).filter((f) => !claimed.has(`${dir}/${f}`))) {
    c.orphan++;
    const ft = new Set(norm(f).split('-').filter((t) => t && t !== tail));
    const cands = records.map((r) => {
      const nt = toSlug(r.Name).split('-').filter(Boolean);
      const bt = toSlug(r.Brand).split('-').filter(Boolean);
      const s = nt.length ? nt.filter((t) => ft.has(t)).length / nt.length : 0;
      const own = new Set([...nt, ...bt]);
      const cover = [...ft].filter((t) => own.has(t)).length / (ft.size || 1); // tie-break: BMG-X2-M beats BMG
      return { r, cover, score: s + (bt.length && bt.every((t) => ft.has(t)) ? 0.1 : 0) };
    }).filter((x) => x.score >= 0.5).sort((a, b) => b.score - a.score || b.cover - a.cover).slice(0, 3);
    catOrphans.push({ cat, f, dir, cands });
  }
  // Ambiguous: tie at top, top already has a local Image URL, or same top record wanted by 2+ files.
  const topCount = {};
  for (const o of catOrphans) if (o.cands[0]) topCount[o.cands[0].r.id] = (topCount[o.cands[0].r.id] || 0) + 1;
  for (const o of catOrphans) {
    const [t, u] = o.cands;
    o.ambiguous = !!t && ((u && u.score === t.score && u.cover === t.cover) || kind(imageOf(t.r)) === 'local' || topCount[t.r.id] > 1);
    orphans.push(o);
  }
  summary.push([cat, records.length, c.match, c.mismatch, c.missing, c.external, c.empty, c.orphan]);
}

console.log('== SUMMARY ==\n' + pad(summary));
console.log('\n== CASE/NAME MISMATCH ==');
console.log(mismatches.length ? pad([['category', 'id', 'name', 'expected (Image URL)', 'actual file'], ...mismatches]) : '(none)');
console.log('\n== RECORD WITHOUT FILE: missing-file ==');
console.log(missing.length ? pad([['category', 'id', 'name', 'Image URL'], ...missing]) : '(none)');
console.log('\n== RECORD WITHOUT FILE: external / empty ==');
console.log(noImage.join('\n') || '(none)');
console.log('\n== FILE WITHOUT RECORD ==');
if (!orphans.length) console.log('(none)');
for (const o of orphans) {
  const flag = !o.cands.length ? 'NO CANDIDATE' : o.ambiguous ? 'AMBIGUOUS' : `SET ${o.cands[0].r.id} Image URL = ${o.dir}/${o.f}`;
  console.log(`${o.cat}/${o.f}  [${flag}]`);
  for (const { r, score, cover } of o.cands) console.log(`    ${score.toFixed(2)}/${cover.toFixed(2)}  ${r.id}  ${r.Brand} | ${r.Name}  (${kind(imageOf(r))}${kind(imageOf(r)) === 'empty' ? '' : ': ' + imageOf(r)})`);
}
if (problems.length) console.log('\n== PROBLEMS ==\n' + problems.join('\n'));

process.exit(process.argv.includes('--strict') && mismatches.length ? 1 : 0);

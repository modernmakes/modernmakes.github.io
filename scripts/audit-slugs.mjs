// Slug audit. Usage: npm run audit:slugs (after npm run build for the dist checks)
// 1. The Airtable "Slug" formula, emulated in JS, must equal toSlug() for every record Name.
// 2. Stored internal paths in the hardware JSON (/hardware/..., /printers/...) must be live pages.
// 3. Every /hardware/ or /printers/ href in dist must land on a real page, not a redirect stub.
// Exit 1 on any failure.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { toSlug } from '../src/lib/slug.ts';
import { ROUTE_TABLES } from '../src/lib/hardware-links.ts';

export const FORMULA =
  'TRIM(REGEX_REPLACE(REGEX_REPLACE(REGEX_REPLACE(LOWER({Name}), "[+]", " plus "), "[^a-z0-9]+", "-"), "^-+|-+$", ""))';
// REGEX_REPLACE replaces every match (RE2); TRIM strips outer spaces.
const formula = (name) =>
  name.toLowerCase().replace(/[+]/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').trim();

const DATA = 'src/data/hardware';
const redirects = JSON.parse(readFileSync('src/data/slug-redirects.json', 'utf8'));
let fail = 0;

// Spec examples double as a self-check.
for (const [n, want] of [['Orbiter V2.5 + Smart Filament Sensor', 'orbiter-v2-5-plus-smart-filament-sensor'], ['Rapido 2 Plus UHF', 'rapido-2-plus-uhf'], ['BMG-X2-M', 'bmg-x2-m']]) {
  if (toSlug(n) !== want) { console.log(`SELF-CHECK FAIL: toSlug("${n}") = ${toSlug(n)}, want ${want}`); fail++; }
}

// 1. formula vs toSlug
const tables = readdirSync(DATA).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
const mismatches = [], staleSlugField = [];
let names = 0;
for (const f of tables) for (const r of JSON.parse(readFileSync(`${DATA}/${f}`, 'utf8'))) {
  if (typeof r?.Name !== 'string' || !r.Name.trim()) continue;
  names++;
  if (formula(r.Name) !== toSlug(r.Name)) mismatches.push(`${f} ${r.id ?? ''} "${r.Name}": formula ${formula(r.Name)} vs toSlug ${toSlug(r.Name)}`);
  if (typeof r.Slug === 'string' && r.Slug !== toSlug(r.Name)) staleSlugField.push(`${f.replace('.json', '')} | ${r.id ?? '?'} | "${r.Name}" | stored "${r.Slug}" -> ${toSlug(r.Name)}`);
}
console.log(`FORMULA vs toSlug: ${names} names, ${mismatches.length} mismatches`);
mismatches.forEach((m) => console.log('  ' + m));
fail += mismatches.length;
// Informational: the exported Airtable Slug field still holds values from the old formula
// until the formula above is pasted into each table and the nightly fetch runs.
console.log(`\nAIRTABLE Slug FIELD VALUES != toSlug (old formula, informational): ${staleSlugField.length}`);
staleSlugField.forEach((m) => console.log('  ' + m));

// 2. stored paths
const live = new Set();
for (const { base, records } of ROUTE_TABLES) for (const r of records) if (typeof r?.Name === 'string' && r.Name.trim()) live.add(`${base}/${toSlug(r.Name)}`);
const stale = [];
for (const f of tables) for (const r of JSON.parse(readFileSync(`${DATA}/${f}`, 'utf8'))) {
  for (const [field, v] of Object.entries(r)) {
    if (typeof v !== 'string') continue;
    for (const [p] of v.matchAll(/(?<![\w./-])\/(?:hardware|printers)\/[a-z0-9-]+\/?[a-z0-9-]*/g)) {
      const path = p.replace(/\/$/, '');
      if (path.split('/').length < 4 && !path.startsWith('/printers/')) continue; // category index, not a record
      if (!live.has(path)) stale.push(`${f.replace('.json', '')} | ${r.id ?? '?'} | ${field} | ${path} -> ${redirects[path] ?? '(no known new path)'}`);
    }
  }
}
console.log(`\nSTORED PATHS NOT LIVE (table | record | field | stored -> new): ${stale.length}`);
stale.forEach((s) => console.log('  ' + s));

// 3. dist hrefs
if (!existsSync('dist')) console.log('\nDIST HREFS: skipped, no dist/ (run npm run build first)');
else {
  const isStub = (file) => /http-equiv="refresh"/.test(readFileSync(file, 'utf8').slice(0, 400));
  const bad = new Map();
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith('.html') && !isStub(p)) {
        for (const [, href] of readFileSync(p, 'utf8').matchAll(/href="(?:https:\/\/modernmakes\.github\.io)?(\/(?:hardware|printers)[^"#?]*)/g)) {
          const target = join('dist', href, 'index.html');
          const why = !existsSync(target) ? 'missing' : isStub(target) ? 'redirect stub' : '';
          if (why) bad.set(`${href} (${why})`, [...(bad.get(`${href} (${why})`) ?? []), p.split(String.fromCharCode(92)).join('/')]);
        }
      }
    }
  };
  walk('dist');
  console.log(`\nDIST HREFS to /hardware or /printers not landing on a real page: ${bad.size}`);
  for (const [h, from] of bad) console.log(`  ${h} <- ${from.slice(0, 3).join(', ')}${from.length > 3 ? ` +${from.length - 3}` : ''}`);
  fail += bad.size;
}
console.log(`\nAirtable formula: ${FORMULA}`);
if (fail) process.exit(1);

// Max Flow source coverage for every hotend: what flowSourceCaption() (src/lib/hardware.ts)
// has to work with. Usage: npm run audit:flow
import { readFileSync } from 'node:fs';

const hotends = JSON.parse(readFileSync('src/data/hardware/hotends.json', 'utf8'))
  .filter((r) => typeof r?.Name === 'string' && r.Name.trim())
  .sort((a, b) => a.Name.localeCompare(b.Name));
const rows = [['Hotend', 'Max Flow', 'Max Flow Source', 'URL']];
const noUrl = [];
for (const r of hotends) {
  const src = String(r['Max Flow Source'] ?? '').trim();
  const url = String(r['Max Flow Source URL'] ?? '').trim();
  rows.push([`${r.Brand ? r.Brand + ' ' : ''}${r.Name}`, r['Max Flow (mm³/s)'] ?? '—', src || '—', url ? 'yes' : 'no']);
  if (/^(independent test|community estimate)$/i.test(src) && !url) noUrl.push(`${r.Name} (${r.id}): "${src}" with no URL, caption falls back to "Rated maximum flow."`);
}
const w = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i]).length)));
rows.forEach((r) => console.log(r.map((c, i) => String(c).padEnd(w[i])).join('  ').trimEnd()));
console.log(`\n${hotends.length} hotends; ${hotends.filter((r) => r['Max Flow Source']).length} with a source; ${hotends.filter((r) => r['Max Flow Source URL']).length} with a URL`);
console.log(`\nSOURCE TYPE WITHOUT URL: ${noUrl.length}`);
noUrl.forEach((l) => console.log('  ' + l));

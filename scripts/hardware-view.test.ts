// Self-check for the hardware sort/filter registry (src/scripts/hardware-view.ts).
// Run: npm run test:view   (Node 24 strips the types itself; no build step)
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chooseBands, inBand, parseBand, bandLabel, sortItems, matchesAll, num, type ViewItem } from '../src/scripts/hardware-view.ts';

const it = (name: string, price: number | null, rank: number, brand = '', flow: number | null = null): ViewItem =>
  ({ name, brand, price, flow, rank, verdict: '', flowClass: '', band: '' });
const names = (xs: ViewItem[]) => xs.map((x) => x.name).join('');

// Bands: lower bound inclusive, upper exclusive; bad keys rejected.
assert.ok(inBand(99.99, '50-100') && !inBand(100, '50-100') && inBand(100, '100-plus') && inBand(0.5, 'under-25'));
assert.equal(inBand(null, 'under-25'), false);
assert.equal(parseBand('100-50'), null);
assert.equal(parseBand('cheap'), null);
assert.deepEqual([bandLabel('under-50'), bandLabel('50-100'), bandLabel('100-plus')], ['Under $50', '$50–$100', '$100+']);

// Sorts: unpriced last in both directions, ties keep Recommended order, unbranded last.
const sample = () => [it('b', null, 0), it('a', 5, 1), it('c', 5, 2), it('d', 1, 3)];
assert.equal(names(sortItems(sample(), 'price-asc')), 'dacb');
assert.equal(names(sortItems(sample(), 'price-desc')), 'acdb');
assert.equal(names(sortItems([it('z', 1, 0), it('b', 1, 1, 'x'), it('a', 1, 2, 'x'), it('q', 1, 3, 'a')], 'brand')), 'qabz');
assert.equal(names(sortItems([it('V10', 1, 0), it('v2', 1, 1), it('Ab', 1, 2)], 'name')), 'Abv2V10');
assert.equal(names(sortItems([it('a', 1, 0, '', null), it('b', 1, 1, '', 80), it('c', 1, 2, '', 120)], 'flow-desc')), 'cba');
assert.equal(names(sortItems(sample(), 'nonsense')), 'bacd'); // unknown key = Recommended

// Filters stack; an empty value list means "no filter".
const x = { ...it('x', 60, 0, 'e3d'), verdict: 'contender', band: '50-100' };
assert.ok(matchesAll(x, { brand: ['e3d', 'phaetus'], price: ['50-100'], verdict: ['contender'], flow: [] }));
assert.ok(!matchesAll(x, { brand: ['phaetus'] }));
assert.ok(matchesAll(x, { brand: ['phaetus'] }, 'brand')); // a group's own counts skip itself
assert.ok(!matchesAll({ ...x, price: null, band: '' }, { price: ['50-100'] }));
assert.ok(matchesAll(x, { price: ['under-50', '50-100'] }) && !matchesAll(x, { price: ['under-50', '100-plus'] })); // bands OR together

assert.equal(num('0'), null);
assert.equal(num('12.5'), 12.5);

// Every category's real prices give 2–4 bands with no empty band.
const dir = 'src/data/hardware';
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const recs: any[] = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
  const prices = recs.map((r) => num(r['Price (USD)'] ?? r['BOM Cost'])).filter((p): p is number => p !== null);
  const bands = chooseBands(prices);
  if (prices.length < 4) { assert.equal(bands.length, 0, f); continue; }
  assert.ok(bands.length >= 2 && bands.length <= 4, `${f}: ${bands.length} bands`);
  for (const b of bands) assert.ok(prices.some((p) => inBand(p, b)), `${f}: empty band ${b}`);
  assert.equal(prices.filter((p) => bands.some((b) => inBand(p, b))).length, prices.length, `${f}: price outside every band`);
}
console.log('hardware-view: all checks passed');

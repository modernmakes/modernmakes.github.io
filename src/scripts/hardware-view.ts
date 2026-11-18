// Sort and filter registry for the hardware indexes (HardwareIndex.astro).
//
// One place defines every sort and every filter. The build uses it to write each card's data
// attributes and the per-sort ranks the pre-paint script reads; the page script uses it to match,
// count and order cards. Nothing here touches the DOM, so the build can import it too.
//
// Adding a sort or filter (Phase 5's "Fits my build" will be both) means one entry here plus, for a
// filter, its options in the component's `groups` list. The UI code reads both generically:
// URL params, chips, counts, disabled states and analytics all follow from these definitions.

/** One card, as the build describes it. The page reads the same values back from data attributes. */
export interface ViewItem {
  name: string;
  brand: string;          // brand slug, '' when the record has none
  price: number | null;   // USD, null when unlisted (missing, zero or not a number)
  flow: number | null;    // max flow mm³/s, null when unlisted
  rank: number;           // position in the Recommended (verdict) order
  verdict: string;        // verdict key, '' when none
  flowClass: string;      // flow class key, '' when none
  band: string;           // price band key from the build, '' when unpriced or outside every band
}

export interface SortDef {
  key: string;
  cmp: (a: ViewItem, b: ViewItem) => number; // ties fall back to Recommended order
  /** Offered only when this returns true for the category's items. */
  when?: (items: ViewItem[]) => boolean;
}

export interface FilterDef {
  key: string;            // URL param and data-f value
  multi: boolean;         // several values at once (OR within the filter)
  test: (item: ViewItem, values: string[]) => boolean; // values is never empty here
}

const coll = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
// Missing values go last whatever the direction.
const nullsLast = (a: number | null, b: number | null, dir: 1 | -1) =>
  a === null ? (b === null ? 0 : 1) : b === null ? -1 : dir * (a - b);

export const DEFAULT_SORT = 'recommended';

export const SORTS: SortDef[] = [
  { key: 'recommended', cmp: () => 0 },
  { key: 'price-asc', cmp: (a, b) => nullsLast(a.price, b.price, 1) },
  { key: 'price-desc', cmp: (a, b) => nullsLast(a.price, b.price, -1) },
  { key: 'name', cmp: (a, b) => coll.compare(a.name, b.name) },
  {
    key: 'brand',
    cmp: (a, b) => (a.brand ? (b.brand ? coll.compare(a.brand, b.brand) : -1) : b.brand ? 1 : 0) || coll.compare(a.name, b.name),
  },
  {
    key: 'flow-desc',
    cmp: (a, b) => nullsLast(a.flow, b.flow, -1),
    when: (items) => items.some((i) => i.flow !== null),
  },
];

// Option text and the short form used on the trigger and chip ("Sort: Lowest price"). Build only:
// the page reads both back from the rendered controls, so they never ship in the script.
export const SORT_TEXT: Record<string, [label: string, short: string]> = {
  recommended: ['Recommended', 'Recommended'],
  'price-asc': ['Price: low to high', 'Lowest price'],
  'price-desc': ['Price: high to low', 'Highest price'],
  name: ['Name A–Z', 'Name A–Z'],
  brand: ['Brand A–Z', 'Brand A–Z'],
  'flow-desc': ['Flow: highest first', 'Highest flow'],
};

/** Stable: equal items keep their Recommended order. */
export const sortItems = <T extends ViewItem>(items: T[], key: string): T[] => {
  const s = SORTS.find((d) => d.key === key) ?? SORTS[0];
  return items.slice().sort((a, b) => s.cmp(a, b) || a.rank - b.rank);
};

// ── Price bands ──────────────────────────────────────────────────────────────
// Keys: under-50, 50-100, 100-plus. Lower bound inclusive, upper exclusive ($99.99 is under $100).
export const BAND_CUTS = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000];

export const parseBand = (key: string): [number, number] | null => {
  let m = /^under-(\d+)$/.exec(key);
  if (m) return [0, +m[1]];
  m = /^(\d+)-(\d+)$/.exec(key);
  if (m && +m[1] < +m[2]) return [+m[1], +m[2]];
  m = /^(\d+)-plus$/.exec(key);
  return m ? [+m[1], Infinity] : null;
};

export const inBand = (price: number | null, key: string): boolean => {
  const b = parseBand(key);
  return price !== null && !!b && price >= b[0] && price < b[1];
};

export const bandLabel = (key: string): string => {
  const b = parseBand(key);
  if (!b) return key;
  if (b[0] === 0) return `Under $${b[1]}`;
  return b[1] === Infinity ? `$${b[0]}+` : `$${b[0]}–$${b[1]}`;
};

const bandKeys = (cuts: number[]) =>
  cuts.length ? [`under-${cuts[0]}`, ...cuts.slice(1).map((c, i) => `${cuts[i]}-${c}`), `${cuts[cuts.length - 1]}-plus`] : [];

/**
 * 2–4 bands for one category, cut at round numbers. Every band holds at least a sixth of the priced
 * items (and at least two); among the cuts that allow that, the most even split wins, with a nudge
 * towards three bands. Returns [] when fewer than 4 items are priced or nothing qualifies.
 */
export function chooseBands(prices: number[]): string[] {
  const n = prices.length;
  if (n < 4) return [];
  const floor = Math.max(2, Math.ceil(n / 6));
  let best: { score: number; cuts: number[] } | null = null;
  const tryCuts = (cuts: number[]) => {
    const counts = new Array(cuts.length + 1).fill(0);
    for (const p of prices) counts[cuts.filter((c) => p >= c).length]++;
    if (counts.some((c) => c < floor)) return;
    const score = Math.max(...counts) / n + 0.05 * Math.abs(cuts.length - 2);
    if (!best || score < best.score - 1e-9) best = { score, cuts };
  };
  const C = BAND_CUTS;
  for (let i = 0; i < C.length; i++) {
    tryCuts([C[i]]);
    for (let j = i + 1; j < C.length; j++) {
      tryCuts([C[i], C[j]]);
      for (let k = j + 1; k < C.length; k++) tryCuts([C[i], C[j], C[k]]);
    }
  }
  return best ? bandKeys((best as { cuts: number[] }).cuts) : [];
}

// ── Filters ──────────────────────────────────────────────────────────────────
export const FILTERS: FilterDef[] = [
  { key: 'verdict', multi: false, test: (i, v) => i.verdict === v[0] },
  { key: 'flow', multi: false, test: (i, v) => i.flowClass === v[0] },
  { key: 'brand', multi: true, test: (i, v) => v.includes(i.brand) },
  // The build files each priced card under one band (data-band), so the page never parses band keys.
  { key: 'price', multi: true, test: (i, v) => v.includes(i.band) },
];

export type FilterState = Record<string, string[]>;

/** Every filter except `skip` (so a group's own counts show what tapping an option would give). */
export const matchesAll = (item: ViewItem, state: FilterState, skip?: string) =>
  FILTERS.every((f) => f.key === skip || !state[f.key]?.length || f.test(item, state[f.key]));

/** A finite positive number, or null. Prices and flow arrive as numbers or numeric strings. */
export const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) && n > 0 ? n : null;
};

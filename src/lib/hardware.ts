// ─────────────────────────────────────────────────────────────────────────────
// Shared hardware helpers — single source of truth for the hotend-derived
// hardware page pattern. Index pages render via components/HardwareIndex.astro;
// detail pages render via layouts/ComponentLayout.astro and build their props
// through buildDetailProps() below. Keeping the verdict logic, vendor parsing,
// and spec mapping here means every category behaves exactly like /hardware/hotends.
// ─────────────────────────────────────────────────────────────────────────────

import { toSlug } from './slug';
export { toSlug };

import { imageOf } from './hardware-image';
import { relatedHref } from './hardware-links';
export { imageOf };

// Reader-facing singular per detail-route folder (/hardware/<folder>/, /printers/).
// Hand-picked, never a trailing-s strip: some categories have no plain singular.
export const CATEGORY_SINGULAR: Record<string, string> = {
  'hotends': 'Hotend',
  'extruders': 'Extruder',
  'nozzles': 'Nozzle',
  'probes': 'Probe',
  'build-plates': 'Build Plate',
  'mainboards': 'Mainboard',
  'toolboards': 'Toolboard',
  'part-cooling': 'Part Cooling',
  'air-filtration': 'Air Filter',
  'enclosures': 'Enclosure',
  'beds': 'Bed',
  'frame-components': 'Frame Component',
  'filament-dryers': 'Filament Dryer',
  'heaters': 'Heater',
  'psus': 'PSU',
  'gantrys': 'Gantry',
  'motion-system': 'Motion Component',
  'lighting-cameras': 'Lighting & Camera',
  'motors': 'Motor',
  'printers': 'Printer',
};

/** Compact nav title on hardware detail pages: "{Brand} {Name} - {Category}". Skips the brand when the name already starts with it. */
export const hardwareNavTitle = (brand: string, name: string, folder: string): string => {
  const b = (brand ?? '').trim();
  const full = b && !name.toLowerCase().startsWith(b.toLowerCase()) ? `${b} ${name}` : name;
  const cat = CATEGORY_SINGULAR[folder];
  return cat ? `${full} - ${cat}` : full;
};

// ── Verdict taxonomy ─────────────────────────────────────────────────────────
// Four verdicts, judged within class; source of truth BRAND.md section 5:
//   Benchmark  — the best in its class, the one everything else is compared to (one per class at most)
//   Value Pick — most of what the Benchmark gives for meaningfully less money
//   Contender  — solid and worth considering, neither the best nor the cheapest
//   Skip       — superseded, poor value, or not worth buying
// Display order everywhere (tabs, Recommended sort, legends) is the order below.
export interface VerdictBucket {
  key: string;   // stable, lowercase, hyphenated — used for filter matching and GA4
  label: string; // display text
  cls: string;   // badge css class (defined in global.css)
}

export const VERDICT_BUCKETS: VerdictBucket[] = [
  { key: 'benchmark',  label: 'Benchmark',  cls: 'verdict-benchmark' },
  { key: 'value-pick', label: 'Value Pick', cls: 'verdict-value' },
  { key: 'contender',  label: 'Contender',  cls: 'verdict-contender' },
  { key: 'skip',       label: 'Skip',       cls: 'verdict-skip' },
];

// Stored Verdict value (any casing) -> bucket key. The canonical four map to themselves.
// shortcut: the legacy rows are temporary until each category's verdict pass in Airtable;
// delete them once no table stores a legacy value (the build warns for anything unmapped).
const VERDICT_ALIAS: Record<string, string> = {
  benchmark: 'benchmark',
  'value pick': 'value-pick',
  contender: 'contender',
  skip: 'skip',
  // Legacy values, all Contender until re-rated:
  workhorse: 'contender',
  'bleeding edge': 'contender',
  buy: 'contender',
  consider: 'contender',
  'solid choice': 'contender',
  mid: 'contender',
  'niche pick': 'contender',
  'top pick': 'contender',
  top: 'contender',
  budget: 'contender',
};

const warned = new Set<string>();
export const resolveVerdict = (raw: unknown): VerdictBucket | null => {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const t = raw.trim().toLowerCase();
  let key = VERDICT_ALIAS[t];
  if (!key) {
    // Any other value is legacy too: Contender, and say so in the build log.
    if (!warned.has(t)) { warned.add(t); console.warn(`[verdict] unmapped value "${raw.trim()}" shown as Contender: add it to VERDICT_ALIAS in src/lib/hardware.ts`); }
    key = 'contender';
  }
  return VERDICT_BUCKETS.find((b) => b.key === key)!;
};

// ── Hand-written badges on the Voron pages ──────────────────────────────────
// Product lists on /voron/* carry hand-written labels (RECOMMENDED, TOP PICK ...).
// They route through resolveVerdict so the badge is always one of the shared
// classes. A product that has a hardware record with a verdict shows that
// verdict. Otherwise: RECOMMENDED / TOP PICK / COMMUNITY STANDARD / ENTHUSIAST -> Contender,
// SITUATIONAL / BUDGET (PICK) / POPULAR / COMMUNITY FAV / BAMBU ONLY -> no badge. Nothing
// maps to Benchmark or Value Pick: those are only ever set deliberately in Airtable.
import bedProbes from '../data/hardware/bed-probes.json';
import extruders from '../data/hardware/extruders.json';
import mainboards from '../data/hardware/mainboards.json';
import toolboards from '../data/hardware/toolboards.json';
import psus from '../data/hardware/psus.json';
import enclosures from '../data/hardware/enclosures.json';
import hotends from '../data/hardware/hotends.json';
import buildPlates from '../data/hardware/build-plates.json';

const RECORD_TABLES: Record<string, any[]> = { bedProbes, extruders, mainboards, toolboards, psus, enclosures, hotends, buildPlates };
export type RecordRef = [keyof typeof RECORD_TABLES, string];

const HAND_LABEL: Record<string, string | null> = {
  RECOMMENDED: 'Contender',
  'TOP PICK': 'Contender',
  'COMMUNITY STANDARD': 'Contender',
  ENTHUSIAST: 'Contender',
  SITUATIONAL: null,
  'BUDGET PICK': null,
  BUDGET: null,
  POPULAR: null,
  'COMMUNITY FAV': null,
  'BAMBU ONLY': null, // shown as a plain spec chip, not a verdict
};

export const handBadge = (label: string, ref?: RecordRef): VerdictBucket | null => {
  if (ref) {
    const rec = RECORD_TABLES[ref[0]]?.find((r) => r.Name === ref[1]);
    const fromData = resolveVerdict(rec?.Verdict);
    if (fromData) return fromData;
  }
  const key = label.trim().toUpperCase();
  return resolveVerdict(key in HAND_LABEL ? HAND_LABEL[key] : label);
};

// Ordered, counted verdict tabs present in a record set, in VERDICT_BUCKETS order.
export const buildVerdictTabs = (records: any[]): (VerdictBucket & { count: number })[] => {
  const seen = new Map<string, VerdictBucket & { count: number }>();
  for (const r of records) {
    const t = resolveVerdict(r?.['Verdict']);
    if (!t) continue;
    const cur = seen.get(t.key);
    if (cur) cur.count++;
    else seen.set(t.key, { ...t, count: 1 });
  }
  const rank = (k: string) => {
    const i = VERDICT_BUCKETS.findIndex((b) => b.key === k);
    return i === -1 ? 99 : i;
  };
  return [...seen.values()].sort((a, b) => rank(a.key) - rank(b.key) || b.count - a.count);
};

// ── Hotend flow class (BRAND.md section 5) ───────────────────────────────────
// Read from Airtable "Editorial Flow Class" (Standard / High / Extreme). Empty -> null, so no chip
// and no class tab is ever invented. `min` only positions the tier marks on the detail flow diagram.
export interface FlowClass {
  key: 'standard' | 'high' | 'extreme';
  label: string;      // filter button text
  chipLabel: string;  // badge text
  min: number;        // diagram tier mark (mm³/s)
}

export const FLOW_CLASSES: FlowClass[] = [
  { key: 'standard', label: 'Standard', chipLabel: 'Standard flow', min: 0 },
  { key: 'high',     label: 'High',     chipLabel: 'High flow', min: 50 },
  { key: 'extreme',  label: 'Extreme',  chipLabel: 'Extreme flow', min: 80 },
];

export const resolveFlowClass = (editorialClass: unknown): FlowClass | null => {
  const t = String(editorialClass ?? '').trim().toLowerCase();
  return FLOW_CLASSES.find((c) => c.key === t) ?? null;
};

// ── Flow diagram caption (hotend pages) ─────────────────────────────────────
// Attribution comes from Airtable "Max Flow Source" (Manufacturer / Independent test /
// Community estimate) + "Max Flow Source URL". Third-party sources need a URL; without one
// the caption claims nothing beyond "Rated maximum flow." Returns escaped HTML.
const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const httpUrl = (v: unknown): URL | null => {
  try {
    const u = new URL(String(v ?? '').trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u : null;
  } catch { return null; }
};
const extLink = (u: URL, text: string) =>
  `<a href="${escHtml(u.href)}" class="flow-source-link" target="_blank" rel="noopener">${escHtml(text)}<span class="sr-only"> (opens in new tab)</span></a>`;
export const FLOW_CAPTION_TAIL = 'Real-world flow varies with filament, nozzle and temperature.';

export const flowSourceCaption = (record: any): string => {
  const source = String(record?.['Max Flow Source'] ?? '').trim().toLowerCase();
  const url = httpUrl(record?.['Max Flow Source URL']);
  const brand = String(record?.['Brand'] ?? '').trim();
  const host = url?.hostname.replace(/^www\./, '') ?? '';
  let lead = 'Rated maximum flow.';
  if (source === 'manufacturer' && brand) {
    const text = `${brand}'s published rating`;
    lead = `${url ? extLink(url, text) : escHtml(text)}.`;
  } else if (source === 'independent test' && url) {
    lead = `Independently tested — ${extLink(url, host)}.`;
  } else if (source === 'community estimate' && url) {
    lead = `Community estimate — ${extLink(url, host)}.`;
  }
  return `${lead} ${FLOW_CAPTION_TAIL}`;
};

// Known ecosystem links — shared by every category's sidebar chips.
export const TOOLHEAD_HREFS: Record<string, string> = {
  Stealthburner: '/voron/toolheads/stealthburner',
  StealthBurner: '/voron/toolheads/stealthburner',
  XOL: '/voron/toolheads/xol',
  'Dragon Burner': '/voron/toolheads/dragon-burner',
  Archetype: '/voron/toolheads/archetype',
};

export const PRINTER_HREFS: Record<string, string> = {
  'Voron 2.4': '/voron',
  'Voron Trident': '/voron',
  'Voron 0': '/voron',
  'Voron 0.2': '/voron',
  RatRig: '/ratrig',
  'RatRig V-Core 3': '/ratrig',
  'RatRig V-Core 4': '/ratrig',
  VZBot: '/vzbot',
  VzBot: '/vzbot',
  VzBoT: '/vzbot',
  HevORT: '/hevort',
};

// A spec definition: render `label` from the first present field in `fields`,
// optionally formatted. `fields` lets one logical spec absorb several possible
// Airtable column names so sparse / renamed tables still surface what they have.
export interface SpecDef {
  label: string;
  fields: string[];
  fmt?: (value: any) => string;
}

export interface DetailConfig {
  categoryLabel: string;   // e.g. 'EXTRUDER' — hero placeholder + schema category
  componentType: string;   // e.g. 'Extruder'
  titleNoun: string;       // e.g. 'Extruder' — used in the page <title>
  quickSpecs: SpecDef[];   // sidebar quick specs
  specs: SpecDef[];        // full specifications table
  tags?: SpecDef[];        // hero chips (e.g. printers: build volume, difficulty)
  showVerdict?: boolean;   // false: no badge, and the title drops "Verdict" (no verdict pass yet)
  priceFields?: string[];  // price source columns; defaults to ['Price (USD)']
}

const firstPresent = (record: any, fields: string[]): any => {
  for (const f of fields) {
    const v = record[f];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return undefined;
};

const resolveSpecs = (record: any, defs: SpecDef[]): { label: string; value: string }[] =>
  defs
    .map((d) => {
      const v = firstPresent(record, d.fields);
      if (v === undefined) return null;
      return { label: d.label, value: d.fmt ? d.fmt(v) : String(v) };
    })
    .filter((s): s is { label: string; value: string } => s !== null);

const splitLines = (raw: unknown): string[] =>
  (typeof raw === 'string' ? raw : '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Builds the full ComponentLayout prop bundle for one hardware record,
 * mirroring the proven /hardware/hotends/[slug] mapping exactly.
 */
export function buildDetailProps(record: any, config: DetailConfig) {
  const verdictLabel = resolveVerdict(record['Verdict'])?.label ?? 'Contender';

  const pros = splitLines(record['Pros']);
  const cons = splitLines(record['Cons']);

  // Toolhead chips + printer chips combined for the sidebar.
  const toolheadNames: string[] = Array.isArray(record['Compatible Toolheads'])
    ? record['Compatible Toolheads']
    : [];
  const toolheadLinks = toolheadNames
    .map((n: string) => n.trim())
    .filter((n) => n in TOOLHEAD_HREFS)
    .map((n) => ({ name: n, href: TOOLHEAD_HREFS[n] }));

  const printerNames: string[] = Array.isArray(record['Compatible Printers'])
    ? record['Compatible Printers']
    : [];
  const printerLinks = printerNames
    .map((n: string) => n.trim())
    .filter(Boolean)
    .map((n) => ({ name: n, href: PRINTER_HREFS[n] ?? '/hardware' }));

  const compatibleToolheads = [...toolheadLinks, ...printerLinks];

  const priceFields = config.priceFields ?? ['Price (USD)'];
  const priceRaw = firstPresent(record, priceFields);
  const priceUsd = Number(priceRaw) || 0;

  // Always end the sidebar quick specs with price when present.
  const quickSpecs = resolveSpecs(record, config.quickSpecs);
  if (priceRaw != null) {
    quickSpecs.push({ label: 'Price', value: `~$${Math.round(priceUsd)} USD` });
  }
  const specs = resolveSpecs(record, config.specs);

  // Hero tags — short badge chips (build volume, difficulty, etc.).
  const tags = config.tags
    ? resolveSpecs(record, config.tags).map((s) => s.value)
    : [];

  const { vendors, sourceUrl } = buildVendors(record);

  // Related components — Related 1 through 3, skip empty.
  type RelatedEntry = { title: string; category: string; href: string };
  const relatedComponents: RelatedEntry[] = [];
  [1, 2, 3].forEach((n) => {
    const name = record[`Related ${n} Name`] as string | undefined;
    const href = record[`Related ${n} URL`] as string | undefined;
    if (name?.trim()) {
      relatedComponents.push({ title: name.trim(), category: 'Hardware', href: relatedHref(name, href) });
    }
  });

  // Body prose — split on blank lines into paragraphs.
  const bodyParagraphs = (typeof record['Body'] === 'string' ? record['Body'] : '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  // First sentence of Description as excerpt.
  const rawDesc: string = record['Description'] ?? '';
  const m = rawDesc.match(/^[^.!?]+[.!?]/);
  const excerpt = m ? m[0] : rawDesc;

  // Same resolver as the index cards, so card and detail hero always agree.
  const heroImage = imageOf(record);

  return {
    title: record['Name'],
    category: config.categoryLabel,
    componentType: config.componentType,
    brand: record['Brand'] ?? '',
    price: { usd: priceUsd },
    verdict: record['Verdict Label'] ?? '',
    verdictLabel,
    excerpt,
    tags,
    pros,
    cons,
    quickSpecs,
    compatibleToolheads,
    specs,
    vendors,
    relatedComponents,
    pageTitle: `${record['Name']} ${config.titleNoun} — Specs, ${config.showVerdict === false ? '' : 'Verdict & '}Where to Buy`,
    primaryVendorUrl: vendors[0]?.url ?? '',
    sourceUrl,
    heroImage,
    bodyParagraphs,
  };
}

/** Community project link: "Source URL" (gantrys use "GitHub / Source URL"). */
export const getSourceUrl = (record: any): string =>
  (record?.['Source URL'] ?? record?.['GitHub / Source URL'] ?? '').toString().trim();

const hostOf = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };

// Repo / model-page hosts are source files, never shops.
const SOURCE_HOSTS = ['github.com', 'gitlab.com', 'codeberg.org', 'printables.com', 'thingiverse.com', 'vorondesign.com', 'docs.vzbot.org', 'onshape.com'];
export const isSourceHost = (url: string) => {
  const h = hostOf(url);
  return SOURCE_HOSTS.some((s) => h === s || h.endsWith('.' + s));
};

const titleCase = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();

/** Display label for a source link: { host: 'GitHub', path: 'VoronDesign/Mobius-Extruder' }. */
export function sourceLabel(url: string): { host: string; path: string } {
  const h = hostOf(url);
  let segs: string[] = [];
  try { segs = new URL(url).pathname.split('/').filter(Boolean); } catch { /* keep empty */ }
  const names: Record<string, string> = { 'github.com': 'GitHub', 'gitlab.com': 'GitLab', 'codeberg.org': 'Codeberg', 'printables.com': 'Printables', 'thingiverse.com': 'Thingiverse', 'vorondesign.com': 'Voron Design', 'docs.vzbot.org': 'VzBoT docs', 'onshape.com': 'Onshape' };
  const key = Object.keys(names).find((k) => h === k || h.endsWith('.' + k));
  const host = key ? names[key] : h;
  let path = segs.join('/');
  if (key === 'github.com' || key === 'gitlab.com' || key === 'codeberg.org') path = segs.slice(0, 2).join('/');
  else if (key === 'printables.com') {
    const i = segs.indexOf('model');
    path = titleCase((segs[i + 1] ?? '').replace(/^\d+-?/, '')); // /model/123-mobius-extruder
  } else if (key === 'thingiverse.com') path = titleCase((segs[segs.length - 1] ?? '').replace(/^thing:\d+/, ''));
  else if (key === 'vorondesign.com' || key === 'docs.vzbot.org') path = segs.join('/');
  return { host, path };
}

type VendorEntry = { name: string; url: string; price: string; region: 'us'; primary: boolean; affiliate: boolean };

/** Vendor 1 through 5, minus repo/model links, which belong under Source files. */
export function buildVendors(record: any): { vendors: VendorEntry[]; sourceUrl: string } {
  const all: Omit<VendorEntry, 'primary'>[] = [];
  [1, 2, 3, 4, 5].forEach((n) => {
    let name = (record[`Vendor ${n} Name`] as string | undefined)?.trim();
    let url = record[`Vendor ${n} URL`] as string | undefined;
    // Toolhead rows sometimes hold the URL in the Name cell; recover the shop name from its host.
    if (name && !url && /^https?:\/\//.test(name)) {
      url = name;
      name = titleCase(hostOf(name).split('.')[0]);
    }
    if (name) all.push({ name, url: url ?? '#', price: '', region: 'us', affiliate: record[`Vendor ${n} Affiliate`] === true });
  });
  const dropped = all.filter((v) => isSourceHost(v.url));
  const vendors = all.filter((v) => !isSourceHost(v.url)).map((v, i) => ({ ...v, primary: i === 0 }));
  return { vendors, sourceUrl: getSourceUrl(record) || dropped[0]?.url || '' };
}

/** getStaticPaths helper shared by every detail route. */
export function staticPathsFor(records: any[]) {
  return records
    .filter((r) => typeof r['Name'] === 'string' && r['Name'].trim())
    .map((r) => ({ params: { slug: toSlug(r['Name']) }, props: { record: r } }));
}

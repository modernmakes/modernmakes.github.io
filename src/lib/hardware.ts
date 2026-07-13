// ─────────────────────────────────────────────────────────────────────────────
// Shared hardware helpers — single source of truth for the hotend-derived
// hardware page pattern. Index pages render via components/HardwareIndex.astro;
// detail pages render via layouts/ComponentLayout.astro and build their props
// through buildDetailProps() below. Keeping the verdict logic, vendor parsing,
// and spec mapping here means every category behaves exactly like /hardware/hotends.
// ─────────────────────────────────────────────────────────────────────────────

export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── Verdict taxonomy ─────────────────────────────────────────────────────────
// The site's verdict taxonomy is Workhorse / Bleeding Edge / Skip. A record's
// stored "Verdict" may use that, the prior Buy / Consider / Skip values, or
// legacy Top Pick / Solid Choice / Niche Pick labels — across inconsistent
// casing, and only Hotends has been migrated in Airtable so far. resolveVerdict
// maps any of these (case-insensitive) onto a display bucket; any other
// non-empty token passes through as its own neutral badge/tab so categories
// with their own values (e.g. Budget / Mid / Top) still render and filter.
export interface VerdictBucket {
  key: string;   // stable, lowercase, hyphenated — used for filter matching
  label: string; // display text
  cls: string;   // badge css class (defined in global.css)
}

export const VERDICT_BUCKETS: VerdictBucket[] = [
  { key: 'workhorse',     label: 'Workhorse',     cls: 'verdict-best' },
  { key: 'bleeding-edge', label: 'Bleeding Edge', cls: 'verdict-rec' },
  { key: 'skip',          label: 'Skip',          cls: 'verdict-skip' },
];

const VERDICT_ALIAS: Record<string, string> = {
  workhorse: 'workhorse',
  buy: 'workhorse',
  'top pick': 'workhorse',
  'bleeding edge': 'bleeding-edge',
  consider: 'bleeding-edge',
  'solid choice': 'bleeding-edge',
  'niche pick': 'bleeding-edge',
  skip: 'skip',
};

const titleCase = (s: string) => s.trim().replace(/\b\w/g, (c) => c.toUpperCase());

export const resolveVerdict = (raw: unknown): VerdictBucket | null => {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const known = VERDICT_ALIAS[raw.trim().toLowerCase()];
  if (known) return VERDICT_BUCKETS.find((b) => b.key === known) ?? null;
  // Unknown but present — keep it visible rather than dropping the record.
  return { key: raw.trim().toLowerCase().replace(/\s+/g, '-'), label: titleCase(raw), cls: 'verdict-rec' };
};

// Ordered, counted verdict tabs present in a record set: canonical buckets
// first (in defined order), then any passthrough tokens by frequency.
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
  const verdictLabel = resolveVerdict(record['Verdict'])?.label ?? 'Bleeding Edge';

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
    quickSpecs.push({ label: 'Price', value: `~$${priceRaw} USD` });
  }
  const specs = resolveSpecs(record, config.specs);

  // Hero tags — short badge chips (build volume, difficulty, etc.).
  const tags = config.tags
    ? resolveSpecs(record, config.tags).map((s) => s.value)
    : [];

  // Vendors — Vendor 1 through 5, skip empty.
  type VendorEntry = { name: string; url: string; price: string; region: 'us'; primary: boolean };
  const vendors: VendorEntry[] = [];
  [1, 2, 3, 4, 5].forEach((n, idx) => {
    const name = record[`Vendor ${n} Name`] as string | undefined;
    const url = record[`Vendor ${n} URL`] as string | undefined;
    if (name?.trim()) {
      vendors.push({ name: name.trim(), url: url ?? '#', price: '', region: 'us', primary: idx === 0 });
    }
  });

  // Related components — Related 1 through 3, skip empty.
  type RelatedEntry = { title: string; category: string; href: string };
  const relatedComponents: RelatedEntry[] = [];
  [1, 2, 3].forEach((n) => {
    const name = record[`Related ${n} Name`] as string | undefined;
    const href = record[`Related ${n} URL`] as string | undefined;
    if (name?.trim()) {
      relatedComponents.push({ title: name.trim(), category: 'Hardware', href: href ?? '/hardware' });
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

  // Only feed schema an on-site image path; external Airtable image URLs would
  // break ComponentLayout's `${siteBase}${heroImageUrl}` concatenation.
  const rawImg = (record['Hero Image'] as string | undefined) ?? '';
  const heroImageUrl = rawImg.startsWith('/') ? rawImg : '';

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
    pageTitle: `${record['Name']} ${config.titleNoun} — Specs, Verdict & Where to Buy`,
    primaryVendorUrl: vendors[0]?.url ?? '',
    heroImageUrl,
    bodyParagraphs,
  };
}

/** getStaticPaths helper shared by every detail route. */
export function staticPathsFor(records: any[]) {
  return records
    .filter((r) => typeof r['Name'] === 'string' && r['Name'].trim())
    .map((r) => ({ params: { slug: toSlug(r['Name']) }, props: { record: r } }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared hardware helpers — single source of truth for the hotend-derived
// hardware page pattern. Index pages render via components/HardwareIndex.astro;
// detail pages render via layouts/ComponentLayout.astro and build their props
// through buildDetailProps() below. Keeping the verdict logic, vendor parsing,
// and spec mapping here means every category behaves exactly like /hardware/hotends.
// ─────────────────────────────────────────────────────────────────────────────

export type Verdict = 'BUY' | 'CONSIDER' | 'SKIP' | 'UPDATED';

export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// Primary Airtable verdict values, then legacy fallbacks for older records.
export const VERDICT_ORDER = ['BUY', 'CONSIDER', 'SKIP', 'UPDATED', 'Top Pick', 'Solid Choice', 'Niche Pick'];

// Maps any legacy label onto one of the four canonical verdict buckets.
const VERDICT_MAP: Record<string, Verdict> = {
  BUY: 'BUY',
  CONSIDER: 'CONSIDER',
  SKIP: 'SKIP',
  UPDATED: 'UPDATED',
  'Top Pick': 'BUY',
  'Solid Choice': 'CONSIDER',
  'Niche Pick': 'CONSIDER',
  Skip: 'SKIP',
};

export const canonicalVerdict = (raw: unknown): Verdict =>
  (typeof raw === 'string' && VERDICT_MAP[raw]) || 'CONSIDER';

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
  const verdictLabel = canonicalVerdict(record['Verdict']);

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

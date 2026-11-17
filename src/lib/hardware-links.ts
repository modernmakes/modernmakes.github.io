// Auto-links mentions of other hardware records in detail-page copy (verdict label,
// pros, cons, body). Used by layouts/ComponentLayout.astro and scripts/audit-hardware-links.mjs.
// Imports carry explicit extensions + JSON attributes so Node can load this file directly.
import { toSlug } from './slug.ts';
import airFiltration from '../data/hardware/air-filtration.json' with { type: 'json' };
import bedProbes from '../data/hardware/bed-probes.json' with { type: 'json' };
import buildPlates from '../data/hardware/build-plates.json' with { type: 'json' };
import enclosures from '../data/hardware/enclosures.json' with { type: 'json' };
import extruders from '../data/hardware/extruders.json' with { type: 'json' };
import filamentDryers from '../data/hardware/filament-dryers.json' with { type: 'json' };
import gantrys from '../data/hardware/gantrys.json' with { type: 'json' };
import heaters from '../data/hardware/heaters.json' with { type: 'json' };
import hotends from '../data/hardware/hotends.json' with { type: 'json' };
import lightingCameras from '../data/hardware/lighting-cameras.json' with { type: 'json' };
import mainboards from '../data/hardware/mainboards.json' with { type: 'json' };
import motionSystem from '../data/hardware/motion-system.json' with { type: 'json' };
import motors from '../data/hardware/motors.json' with { type: 'json' };
import nozzles from '../data/hardware/nozzles.json' with { type: 'json' };
import partCooling from '../data/hardware/part-cooling.json' with { type: 'json' };
import printers from '../data/hardware/printers.json' with { type: 'json' };
import psus from '../data/hardware/psus.json' with { type: 'json' };
import toolboards from '../data/hardware/toolboards.json' with { type: 'json' };

// Data file -> detail route base, read off the [slug].astro routes. Every one builds
// its slug with toSlug(Name) over records with a non-empty Name.
// toolheads.json has no detail route (the Voron toolhead pages read src/data/toolheads.json), so it is not indexed.
export const ROUTE_TABLES: { file: string; base: string; records: any[] }[] = [
  { file: 'air-filtration', base: '/hardware/air-filtration', records: airFiltration },
  { file: 'bed-probes', base: '/hardware/probes', records: bedProbes },
  { file: 'build-plates', base: '/hardware/build-plates', records: buildPlates },
  { file: 'enclosures', base: '/hardware/enclosures', records: enclosures },
  { file: 'extruders', base: '/hardware/extruders', records: extruders },
  { file: 'filament-dryers', base: '/hardware/filament-dryers', records: filamentDryers },
  { file: 'gantrys', base: '/hardware/gantrys', records: gantrys },
  { file: 'heaters', base: '/hardware/heaters', records: heaters },
  { file: 'hotends', base: '/hardware/hotends', records: hotends },
  { file: 'lighting-cameras', base: '/hardware/lighting-cameras', records: lightingCameras },
  { file: 'mainboards', base: '/hardware/mainboards', records: mainboards },
  { file: 'motion-system', base: '/hardware/motion-system', records: motionSystem },
  { file: 'motors', base: '/hardware/motors', records: motors },
  { file: 'nozzles', base: '/hardware/nozzles', records: nozzles },
  { file: 'part-cooling', base: '/hardware/part-cooling', records: partCooling },
  { file: 'printers', base: '/printers', records: printers },
  { file: 'psus', base: '/hardware/psus', records: psus },
  { file: 'toolboards', base: '/hardware/toolboards', records: toolboards },
];

// Names that read as ordinary words or generic parts in copy; never auto-linked.
// Lowercase; compared against the whole name/alias.
const COMMON_NAMES = new Set([
  'm4',               // extruder, but also the metric screw size
  'volcano',          // nozzle, but also the heater-block format
  'eddy',             // BTT probe, but also an SHT36 variant and "eddy current"; "BigTreeTech Eddy" still links
  'exhaust filter',
  'panel heater',
  'oldham coupler',
  'disc coupler',
  'nozzle camera',
  'panel cutting service',
  'precision motor block',
  'titanium backers',
  'activated carbon pellets',
]);

// Extra link texts for a record, keyed "<route folder>/<record Name>". The E3D Roto is
// sold as the "Revo Roto", so the full phrase links instead of the bare second word.
const ALIASES: Record<string, string[]> = {
  'extruders/Roto': ['Revo Roto'],
};

// A mention stays plain when the word right after it (one space or a hyphen, then an optional "(", any case)
// says the copy means a standard, family or ecosystem rather than the product page.
// Keyed by record Name, so aliases and "Brand Name" forms share the list; "*" applies to every name.
export const CONTEXT_EXCLUSIONS: Record<string, string[]> = {
  // "V6 nozzles", "V6 thread", "V6-style": the E3D V6 nozzle/mount standard, not the V6 hotend.
  V6: ['style', 'nozzle', 'nozzles', 'thread', 'threads', 'compatible', 'pattern', 'standard', 'mount', 'ecosystem', 'family', 'type',
    'block', 'blocks', 'm6'], // added after the first report: "V6 block", "V6 (M6) threading"
  // "Octopus ecosystem/options": BTT's board family, not the original Octopus board.
  Octopus: ['ecosystem', 'family', 'options', 'line', 'range', 'series'],
  '*': ['ecosystem', 'family', 'series', 'line', 'range', 'lineup'],
};
const excludedAfter = (name: string, next: string | undefined) =>
  !!next && [...(CONTEXT_EXCLUSIONS[name] ?? []), ...CONTEXT_EXCLUSIONS['*']].includes(next.toLowerCase());

export interface LinkTarget { name: string; href: string; folder: string }

const index = new Map<string, LinkTarget>();
export const SKIPPED: { text: string; href: string; reason: string }[] = [];
export const AMBIGUOUS: { text: string; hrefs: string[] }[] = [];
{
  const seen = new Map<string, LinkTarget[]>();
  for (const { base, records } of ROUTE_TABLES) {
    for (const r of records) {
      const name = typeof r?.Name === 'string' ? r.Name.trim() : '';
      if (!name) continue; // no detail page
      const target = { name, href: `${base}/${toSlug(r.Name)}`, folder: base.split('/').pop()! };
      const brand = typeof r.Brand === 'string' ? r.Brand.trim() : '';
      const texts = [name];
      if (brand && !name.toLowerCase().startsWith(brand.toLowerCase())) texts.push(`${brand} ${name}`);
      texts.push(...(ALIASES[`${target.folder}/${name}`] ?? []));
      for (const text of texts) {
        if (text.length < 4 && !/\d/.test(text)) { SKIPPED.push({ text, href: target.href, reason: 'under 4 chars, no digit' }); continue; }
        if (COMMON_NAMES.has(text.toLowerCase())) { SKIPPED.push({ text, href: target.href, reason: 'common word' }); continue; }
        const list = seen.get(text) ?? [];
        if (!list.some((t) => t.href === target.href)) list.push(target);
        seen.set(text, list);
      }
    }
  }
  for (const [text, list] of seen) {
    if (list.length > 1) AMBIGUOUS.push({ text, hrefs: list.map((t) => t.href) });
    else index.set(text, list[0]);
  }
}
export const LINK_INDEX: ReadonlyMap<string, LinkTarget> = index;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Matched against already-escaped text, so keys are escaped the same way.
const byEscaped = new Map([...index].map(([text, t]) => [escapeHtml(text), t]));
// Longest first so "Apus 2" wins over "Apus". Boundaries treat letters, digits and "-" as
// part of a word, and refuse a trailing "+" or ".5"-style suffix ("Apus 2" never matches "Apus 2.5").
// Multi-word prefixes of longer names: "Octopus" followed by "Pro" is a truncated mention of
// "Octopus Pro v1.1", not the base Octopus, so it stays plain.
const prefixes = new Set<string>();
for (const k of byEscaped.keys()) {
  const w = k.split(' ');
  for (let n = 2; n < w.length; n++) prefixes.add(w.slice(0, n).join(' '));
}
const pattern = new RegExp(
  `(?<![A-Za-z0-9-])(?:${[...byEscaped.keys()].sort((a, b) => b.length - a.length).map(escapeRe).join('|')})(?![A-Za-z0-9+-]|[.,]\\d)`,
  'g',
);

/** HTML-escapes `text`, then links the first mention of each other hardware record not already in `alreadyLinked` (one Set per page section). */
export function linkHardwareMentions(text: string, opts: { selfHref: string; alreadyLinked: Set<string> }): string {
  const self = opts.selfHref.replace(/\/$/, '');
  return escapeHtml(text ?? '').replace(pattern, (m, at: number, all: string) => {
    const t = byEscaped.get(m);
    const after = all.slice(at + m.length);
    const next = /^ ([^\s,;:()]+)/.exec(after)?.[1];
    const nextWord = /^[ -]\(?([A-Za-z0-9]+)/.exec(after)?.[1]; // \"V6 (M6)\" reads past the paren
    if (!t || t.href === self || opts.alreadyLinked.has(t.href) || (next && prefixes.has(`${m} ${next}`)) || excludedAfter(t.name, nextWord)) return m;
    opts.alreadyLinked.add(t.href);
    return `<a href="${t.href}" class="hw-mention">${m}</a>`;
  });
}

// Every live detail-page path, for resolving stored "Related N URL" values.
export const LIVE_PATHS: ReadonlySet<string> = new Set(
  ROUTE_TABLES.flatMap(({ base, records }) =>
    records.filter((r) => typeof r?.Name === 'string' && r.Name.trim()).map((r) => `${base}/${toSlug(r.Name)}`)),
);

/** Href for a "Related N" entry: a stored /hardware or /printers URL only when it is a live page, else the record named, else the fallback. */
export const relatedHref = (name: string, storedUrl: string | undefined, fallback = '/hardware'): string => {
  const url = (storedUrl ?? '').trim().replace(/(.)\/$/, '$1');
  const isRecordPath = /^\/(hardware|printers)\/./.test(url);
  if (url && (!isRecordPath || LIVE_PATHS.has(url))) return url;
  return LINK_INDEX.get(name.trim())?.href ?? fallback;
};

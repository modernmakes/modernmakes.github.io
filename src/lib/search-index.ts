// Build-time search index for the command palette (served at /search-index.json).
// Only the fields a palette row needs, with short keys to keep it small:
//   h  hardware  { t title, b brand, c category, v verdict, vc badge class, f flow chip, p price, u url, k spec tokens }
//   a  articles  { t title, c category, d date, u url }  (news, guides, comparisons, filament)
//   t  tools     { t title, c category, k badge, u url }
//   s  ISO time of the last Airtable sync (palette footer freshness label)
import { getCollection } from 'astro:content';
import { toSlug, resolveVerdict, resolveFlowClass } from './hardware';
import tools from '../data/tools.json';
import hotends from '../data/hardware/hotends.json';
import extruders from '../data/hardware/extruders.json';
import bedProbes from '../data/hardware/bed-probes.json';
import nozzles from '../data/hardware/nozzles.json';
import mainboards from '../data/hardware/mainboards.json';
import toolboards from '../data/hardware/toolboards.json';
import partCooling from '../data/hardware/part-cooling.json';
import buildPlates from '../data/hardware/build-plates.json';
import psus from '../data/hardware/psus.json';
import motors from '../data/hardware/motors.json';
import heaters from '../data/hardware/heaters.json';
import filamentDryers from '../data/hardware/filament-dryers.json';
import airFiltration from '../data/hardware/air-filtration.json';
import lightingCameras from '../data/hardware/lighting-cameras.json';
import gantrys from '../data/hardware/gantrys.json';
import motionSystem from '../data/hardware/motion-system.json';
import enclosures from '../data/hardware/enclosures.json';
import printers from '../data/hardware/printers.json';
import synced from '../data/hardware/_synced.json';

// [records, route base, singular label] — routes match src/pages/hardware/* and /printers.
const HARDWARE: [any[], string, string][] = [
  [hotends, '/hardware/hotends', 'Hotend'],
  [extruders, '/hardware/extruders', 'Extruder'],
  [bedProbes, '/hardware/probes', 'Bed probe'],
  [nozzles, '/hardware/nozzles', 'Nozzle'],
  [mainboards, '/hardware/mainboards', 'Mainboard'],
  [toolboards, '/hardware/toolboards', 'Toolboard'],
  [partCooling, '/hardware/part-cooling', 'Part cooling'],
  [buildPlates, '/hardware/build-plates', 'Build plate'],
  [psus, '/hardware/psus', 'Power supply'],
  [motors, '/hardware/motors', 'Stepper motor'],
  [heaters, '/hardware/heaters', 'Heater'],
  [filamentDryers, '/hardware/filament-dryers', 'Filament dryer'],
  [airFiltration, '/hardware/air-filtration', 'Air filtration'],
  [lightingCameras, '/hardware/lighting-cameras', 'Lighting & camera'],
  [gantrys, '/hardware/gantrys', 'Gantry'],
  [motionSystem, '/hardware/motion-system', 'Motion system'],
  [enclosures, '/hardware/enclosures', 'Enclosure'],
  [printers, '/printers', 'Printer'],
];

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());
const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export async function buildSearchIndex() {
  const seen = new Set<string>(); // two records with one name build one page
  const h = HARDWARE.flatMap(([records, base, label]) =>
    records
      .filter((r) => typeof r.Name === 'string' && r.Name.trim())
      .map((r) => {
        const v = resolveVerdict(r.Verdict);
        const flow = str(r['Max Flow (mm³/s)']);
        // Thread fields carry notes ('M6 (E3D V6 standard); 0.4mm…'): keep the thread itself.
        const thread = str(r['Nozzle Thread'] ?? r.Thread).split(/[(;,]/)[0].trim();
        const price = Number(r['Price (USD)']);
        const k = [flow && `${flow} mm³/s`, str(r.Thermistor), thread && `${thread} thread`].filter(Boolean).join(' · ');
        return {
          t: r.Name.trim(),
          b: str(r.Brand) || undefined,
          c: label,
          v: v?.label,
          vc: v?.cls,
          f: resolveFlowClass(r['Max Flow (mm³/s)'])?.chipLabel,
          p: Number.isFinite(price) && price > 0 ? price : undefined,
          u: `${base}/${toSlug(r.Name)}`,
          k: k || undefined,
        };
      }),
  ).filter((x) => !seen.has(x.u) && !!seen.add(x.u));

  const [news, guides, comparisons, filament] = await Promise.all([
    getCollection('news'), getCollection('guides'), getCollection('comparisons'), getCollection('filament'),
  ]);
  const byDate = (x: { date: Date }, y: { date: Date }) => +y.date - +x.date;
  const a = [
    ...news.map((e) => ({ t: e.data.title, c: 'News', date: e.data.date, u: `/news/${e.slug}` })),
    ...guides.map((e) => ({ t: e.data.title, c: 'Guide', date: e.data.date, u: `/guides/${e.slug}` })),
    ...comparisons.map((e) => ({ t: e.data.title, c: 'Comparison', date: e.data.date, u: `/comparisons/${e.slug}` })),
  ]
    .sort(byDate)
    .map(({ date, ...x }) => ({ ...x, d: fmtDate(date) }));
  for (const e of filament) a.push({ t: e.data.title, c: 'Filament', u: `/filament/${e.slug}` } as any);

  const t = tools.map((x) => ({ t: x.name, c: x.category, k: x.badge, u: x.href }));

  return { s: synced.synced, h, a, t };
}

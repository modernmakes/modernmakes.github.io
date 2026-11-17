import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { toSlug } from './src/lib/slug.ts';

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
// Old hardware/printer paths -> current toSlug paths (generated 2026-11-17 when toSlug
// changed "V2.5"/"+" handling). Every redirect target below is resolved through it, so no chains.
const slugRedirects = readJson('./src/data/slug-redirects.json');
const current = (to) => slugRedirects[to] ?? to;

// Printers moved /hardware/printers → /printers. One redirect per record, generated from the data so new printers are covered.
const printerRedirects = Object.fromEntries(
  readJson('./src/data/hardware/printers.json')
    .filter((r) => typeof r.Name === 'string' && r.Name.trim())
    .map((r) => [`/hardware/printers/${toSlug(r.Name)}`, `/printers/${toSlug(r.Name)}`]),
);

export default defineConfig({
  site: 'https://modernmakes.github.io',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/lab/') })],
  redirects: Object.fromEntries(Object.entries({
    '/hardware/printers': '/printers',
    ...printerRedirects,
    ...slugRedirects,
    // Pre-'-plus' slugs (the slug rule now maps '+' to '-plus').
    '/hardware/enclosures/micron-colony-clacker-door-kit': '/hardware/enclosures/micron-plus-colony-clacker-door-kit',
    '/hardware/enclosures/v-core-31--enclosure-20-full-kit': '/hardware/enclosures/v-core-31--plus-enclosure-20-full-kit',
    '/hardware/extruders/orbiter-v25--smart-filament-sensor': '/hardware/extruders/orbiter-v25--plus-smart-filament-sensor',
    '/printers/micron': '/printers/micron-plus',
    '/hardware/printers/micron': '/printers/micron-plus',
    '/hardware/hotends/rapido-2': '/hardware/hotends/rapido-2-uhf',
    '/news/voron-phoenix-600mm-released': '/news/voron-phoenix-idex-preview',
    '/voron/toolhead': '/voron/toolheads',
    '/hotends': '/hardware/hotends',
    '/extruders': '/hardware',
    '/electronics': '/hardware',
    '/motion-system': '/hardware/motion',
    '/build-surfaces': '/hardware',
  }).map(([from, to]) => [from, current(to)])),
});

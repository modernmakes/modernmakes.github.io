import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Printers moved /hardware/printers → /printers. One redirect per record, generated from the data so new printers are covered.
// Same slug rule as toSlug() in src/lib/hardware.ts (config can't import TS).
const printerSlug = (n) => n.toLowerCase().replace(/\+/g, '-plus').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const printerRedirects = Object.fromEntries(
  JSON.parse(readFileSync(new URL('./src/data/hardware/printers.json', import.meta.url), 'utf8'))
    .filter((r) => typeof r.Name === 'string' && r.Name.trim())
    .map((r) => [`/hardware/printers/${printerSlug(r.Name)}`, `/printers/${printerSlug(r.Name)}`]),
);

export default defineConfig({
  site: 'https://modernmakes.github.io',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/lab/') })],
  redirects: {
    '/hardware/printers': '/printers',
    ...printerRedirects,
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
  },
});

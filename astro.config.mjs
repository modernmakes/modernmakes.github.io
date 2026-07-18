import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://modernmakes.github.io',
  output: 'static',
  integrations: [sitemap()],
  redirects: {
    '/hardware/hotends/rapido-2': '/hardware/hotends/rapido-2-uhf',
    '/news/voron-phoenix-600mm-released': '/news/voron-phoenix-idex-preview',
  },
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://modernmakes.github.io',
  output: 'static',
  redirects: {
    '/hardware/hotends/rapido-2': '/hardware/hotends/rapido-2-uhf',
    '/news/voron-phoenix-600mm-released': '/news/voron-phoenix-idex-preview',
  },
});

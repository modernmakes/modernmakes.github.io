import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://modernmakes.github.io',
  output: 'static',
  redirects: {
    '/hardware/hotends/rapido-2': '/hardware/hotends/rapido-2-uhf',
  },
});

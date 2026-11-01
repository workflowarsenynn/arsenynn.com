import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arsenynn.com',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
});

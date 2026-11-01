import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arsenynn.com',
  // PAGES_BASE задаёт workflow публикации: '' для домена, '/arsenynn.com' для github.io.
  base: process.env.PAGES_BASE || '/',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  // Advisory: ru по умолчанию без префикса, en на /en/.
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});

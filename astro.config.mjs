// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkInternalLinks } from './src/plugins/remark-internal-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://imagetoolstack.com',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'pt', 'id'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  build: {
    format: 'file'
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/embed/'),
      serialize(item) {
        item.lastmod = new Date();
        const url = item.url;
        if (url.includes('/tools/')) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (url.includes('/category/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/compare/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/timezone/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/for/') || url.includes('/alternatives/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (url.endsWith('/about') || url.endsWith('/contact') || url.endsWith('/articles')) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        } else if (url.endsWith('/privacy') || url.endsWith('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'monthly';
        } else {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        return item;
      }
    })
  ],
  markdown: {
    remarkPlugins: [remarkInternalLinks],
  }
});
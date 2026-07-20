// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkInternalLinks } from './src/plugins/remark-internal-links.mjs';
import fs from 'fs';

// Read approved indexable pages directly from the JSON database
const indexableData = JSON.parse(
  fs.readFileSync('./src/data/indexable-pages.json', 'utf8')
);

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
      filter: (page) => {
        // Block all embeds
        if (page.includes('/embed/')) return false;

        const url = new URL(page);

        // Only allow English URLs in sitemap (block non-English locale prefixes)
        if (/^\/(es|fr|de|pt|id)(\/|$)/.test(url.pathname)) {
          return false;
        }

        let path = url.pathname.replace(/\/$/, '') || '/';

        // Strip locale prefix /es, /fr, /de, /pt, /id for matching
        const stripLocale = (p) => p.replace(/^\/(es|fr|de|pt|id)(?=\/|$)/, '') || '/';
        const cleanPath = stripLocale(path);

        // 1. Match static pages
        if (indexableData.staticPages.includes(cleanPath)) return true;

        // 2. Match tools router (/tools/[slug])
        if (cleanPath.startsWith('/tools/')) {
          const slug = cleanPath.replace('/tools/', '');
          return indexableData.tools.includes(slug);
        }

        // 3. Match comparisons router (/compare/[id])
        if (cleanPath.startsWith('/compare/')) {
          const id = cleanPath.replace('/compare/', '');
          return indexableData.comparisons.includes(id);
        }

        // 4. Match formats router (/formats/[slug])
        if (cleanPath.startsWith('/formats/')) {
          const slug = cleanPath.replace('/formats/', '');
          return indexableData.formats.includes(slug);
        }

        // 5. Match root-level articles (/[slug])
        const articleSlug = cleanPath.replace(/^\//, '');
        return indexableData.articles.includes(articleSlug);
      },
      serialize(item) {
        item.lastmod = new Date();
        const path = new URL(item.url).pathname;
        if (path.includes('/tools/')) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (path.includes('/compare/')) {
          item.priority = 0.9; // P0 comparisons are highly important
          item.changefreq = 'weekly';
        } else if (path.includes('/formats/') || path.includes('/what-is-')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.7; // Articles get 0.7 priority
          item.changefreq = 'monthly';
        }
        return item;
      }
    })
  ],
  markdown: {
    remarkPlugins: [remarkInternalLinks],
  }
});
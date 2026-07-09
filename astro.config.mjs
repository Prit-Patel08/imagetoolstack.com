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
      filter: (page) => {
        // Block all embeds
        if (page.includes('/embed/')) return false;

        const url = new URL(page);
        const path = url.pathname.replace(/\/$/, '') || '/';

        // Allowlisted tool slugs
        const indexableTools = [
          "image-compressor", "bulk-image-resizer", "bulk-resizer",
          "image-resizer", "heic-to-jpg", "image-to-pdf",
          "jpg-to-png", "pdf-to-jpg", "pdf-to-png",
          "png-to-jpg", "exif-remover"
        ];

        // Allowlisted article slugs
        const indexableArticles = [
          "best-bulk-image-resizer-free", "best-free-image-resizer-online",
          "best-image-compressor-online", "how-to-remove-image-metadata",
          "how-to-convert-heic-to-jpg", "how-to-convert-images-to-pdf",
          "how-to-convert-pdf-to-jpg", "how-to-save-pdf-as-png",
          "how-to-convert-png-to-jpg", "best-free-jpg-to-png-converter"
        ];

        // Allowlisted static pages
        const indexableStatic = [
          "/", "/about", "/privacy", "/terms", "/contact", "/articles",
          "/image-compressor"
        ];

        // Check static pages (exact match)
        if (indexableStatic.includes(path)) return true;

        // Check tools (match /tools/<slug> pattern)
        const toolMatch = path.match(/^\/tools\/([^/]+)$/);
        if (toolMatch && indexableTools.includes(toolMatch[1])) return true;

        // Check articles (match /<slug> pattern — articles are at root level)
        const articleSlug = path.replace(/^\//, '');
        if (indexableArticles.includes(articleSlug)) return true;

        // Block everything else
        return false;
      },
      serialize(item) {
        item.lastmod = new Date();
        const url = item.url;
        if (url.includes('/tools/')) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (url.endsWith('/about') || url.endsWith('/contact') || url.endsWith('/articles')) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        } else if (url.endsWith('/privacy') || url.endsWith('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.8;
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
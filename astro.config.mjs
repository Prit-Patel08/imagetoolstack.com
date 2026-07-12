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
        let path = url.pathname.replace(/\/$/, '') || '/';

        // Strip locale prefix /es, /fr, /de, /pt, /id for matching
        const stripLocale = (p) => p.replace(/^\/(es|fr|de|pt|id)(?=\/|$)/, '') || '/';
        const cleanPath = stripLocale(path);

        // === YOUR P1 - CORE IMAGE MONEY PAGES (12) - from all-links.txt ===
        // Removed pdf-to-jpg, pdf-to-png, image-to-pdf for image-only focus
        const P1_TOOLS = [
          "image-compressor",   // 165k
          "image-resizer",      // 201k
          "bulk-image-resizer", // ✅ done
          "bulk-resizer",      // ✅ done
          "heic-to-jpg",       // ✅ 90k
          "png-to-jpg",        // ✅ 110k
          "jpg-to-png",        // ✅ 74k
          "exif-remover",      // ✅ privacy intent
          "crop-image",        // high comp core
          "image-redactor",    // P1
          "metadata-viewer",   // P1
          "image-upscaler"
        ];

        // === YOUR P1 ARTICLES (7) - Image-only focus, removed PDF articles ===
        const P1_ARTICLES = [
          "best-bulk-image-resizer-free",
          "best-free-image-resizer-online",
          "best-image-compressor-online",
          "how-to-remove-image-metadata",
          "how-to-convert-heic-to-jpg",
          "how-to-convert-png-to-jpg",
          "best-free-jpg-to-png-converter"
        ];

        // === YOUR P0 - TOPICAL AUTHORITY BUILDERS (15) - highest GSC impression ===
        const P0_PAGES = [
          "/compare/webp-vs-png",   // High GSC, Very High
          "/compare/png-vs-jpg",    // High GSC
          "/compare/avif-vs-jpg",   // Growing
          "/compare/heic-vs-jpg",   // Very High
          "/compare/webp-vs-svg",
          "/compare/png-vs-svg",
          "/compare/jpg-vs-tiff",
          "/compare/avif-vs-webp",  // Key next-gen
          "/compare/heic-vs-png",
          "/compare/jpg-vs-jpeg",   // High vol, low diff
          "/formats/png",           // P0
          "/formats/webp",
          "/formats/heic",
          "/what-is-png",
          "/what-is-webp"
        ];

        // Static money pages
        const STATIC = ["/", "/image-compressor", "/image-tools", "/image-converter"];

        // Match static pages and P0 pages
        if (STATIC.includes(cleanPath)) return true;
        if (P0_PAGES.includes(cleanPath)) return true;

        // Match tools
        const toolMatch = cleanPath.match(/^\/tools\/([^/]+)$/);
        if (toolMatch && P1_TOOLS.includes(toolMatch[1])) return true;

        // Match root-level articles
        const articleSlug = cleanPath.replace(/^\//, '');
        if (P1_ARTICLES.includes(articleSlug)) return true;

        // Block everything else (about, privacy, terms, pdf, timezone, utility)
        return false;
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
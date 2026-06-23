# Full Site Analysis - ImageToolStack

Date: 2026-06-23

## Current State

- Local build succeeds.
- Local build output: 3,377 HTML pages.
- Indexable sitemap output: 2,391 URLs.
- Difference is mainly `/embed/` pages, which are intentionally excluded from the sitemap.
- Tools: 164.
- Comparisons: 124.
- Categories: 4.
- Locales: English/default plus `es`, `fr`, `de`, `pt`, `id`.

## Biggest Issue

The production root homepage currently redirects to itself:

- `GET https://imagetoolstack.com/` returns `301` to `https://imagetoolstack.com/`.
- `HEAD https://imagetoolstack.com/` returns `301 Location: /`.
- Following redirects hits a loop.
- Tool pages such as `/tools/png-to-jpg` return `200`.
- Localized homepages such as `/es` return `200`.

Likely cause: `public/_redirects` contains:

```txt
/index.html / 301
```

On Cloudflare Pages, `/` can internally resolve to `index.html`, so this rule can create a self-redirect loop.

Priority: remove or change the `/index.html / 301` rule and redeploy.

## SEO Health

Positive:

- `/tools/png-to-jpg` live page returns `200`.
- Canonical is correct: `https://imagetoolstack.com/tools/png-to-jpg`.
- Robots meta is `index, follow`.
- Hreflang count is 7: x-default, en, es, fr, de, pt, id.
- Cross-link block is live.
- Production sitemap is valid and exposes 2,391 URLs.
- `robots.txt` references `https://imagetoolstack.com/sitemap-index.xml`.
- Preview domain has `X-Robots-Tag: noindex`.

Problems:

- Homepage redirect loop.
- Some localized pages link back to English URLs inside supporting related-link components.
- Production headers do not show HSTS.
- Page size is heavy: homepage HTML is about 381 KB; important tool pages are about 162-168 KB.
- Build outputs large JS/WASM assets, including a 23.9 MB WASM asset for background removal.

## Localization/Internal Linking Issue

The new cross-linking strategy is directionally good, but older related blocks still hardcode English paths.

Examples:

- `RelatedTools.astro` links to `/tools/${slug}`.
- `ComparisonSection.astro` links to `/compare/${id}` and `/category/pdf`.
- `RelatedGuides.astro` links to `/${article.id}`.

Measured local output:

- Each non-English locale has 562 HTML files.
- Each non-English locale has 397 pages with English internal links.
- Each non-English locale has about 1,706 English internal links leaking from localized pages.

Priority: update these components to use `getLocalizedPath(...)` and localized display names where available.

## GSC Snapshot

GSC exports appear to come from different views/date ranges/filters, so totals should be treated directionally.

Page export:

- 313 page rows.
- 20 clicks.
- 2,443 impressions.
- 0.82% CTR.
- Average position: 63.69.

Country/device export:

- 20 clicks.
- 1,034 impressions.
- 1.93% CTR.
- Average position: 59.67.

Query export:

- 459 query rows.
- 1 click.
- 809 impressions.
- Average position: 70.3.

Best opportunity pages:

- `/image-tools`: position 5.59, 29 impressions.
- `/image-compressor`: position 9.78, 23 impressions.
- `/tools/grayscale-filter`: position 11.84, 31 impressions.
- `/tools/png-to-jpg`: position 15.38, 37 impressions.
- `/formats/png`: position 16.25, 56 impressions.
- `/tools/jpg-to-png`: position 25.51, 43 impressions.
- `/compare/webp-vs-png`: position 30.03, 31 impressions.
- `/tools/adjust-contrast`: position 31.19, 59 impressions.
- `/tools/adjust-brightness`: position 38.44, 34 impressions.
- `/compare/png-vs-jpg`: 151 impressions, but position 52.82.

## GSC Coverage Issues

- Excluded by noindex: 89 pages.
- Alternate page with proper canonical tag: 32 pages.
- Not found: 3 pages.
- Discovered currently not indexed: 204 pages.
- Crawled currently not indexed: 14 pages.
- Page with redirect: 89 pages.
- Redirect error: 1 page.

The redirect error likely matches the homepage redirect loop.

## Crawl Audit Issues

From the crawl export:

- 92 pages with uncompressed JS/CSS.
- 91 pages with low text-to-HTML ratio.
- 50 pages with only one internal link.
- 19 pages with title too long.
- 14 pages with unminified JS/CSS.
- 3 duplicate meta descriptions.
- 2 pages with no HSTS support.
- 2 low word count pages.
- 2 broken internal links.
- 2 4xx errors.

The exported 4xx examples include:

- `https://imagetoolstack.com/es/index.html`
- `https://imagetoolstack.com/pt/index.html`

The homepage had 2 broken internal links in that crawl.

## Competitor Position

ImageToolHub remains ahead on scale and age:

- ImageToolHub registered: 2025-11-18.
- ImageToolStack registered: 2026-06-01.
- ImageToolHub sitemap: 9,660 URLs.
- ImageToolStack sitemap: 2,391 URLs.
- ImageToolHub English/default URL count: 1,610.
- ImageToolStack English/default URL count: 401.

ImageToolHub's strongest public strategy is exact-intent landing pages:

- resize image to 20kb / 50kb / 100kb / 200kb
- resize image to fixed dimensions
- social media image dimensions
- format converters
- document/audio/video adjacent tools

ImageToolStack should not blindly copy the total URL count. First fix crawl/indexing quality, then add exact-intent pages in batches.

## Recommended Priority

1. Fix the homepage redirect loop.
2. Fix localized internal-link leakage by using `getLocalizedPath` in related-link components.
3. Resolve GSC 404s and redirect error.
4. Add HSTS in Cloudflare or response headers.
5. Improve pages already near page 1 or page 2.
6. Add exact-intent resize/compress pages in small batches.
7. Reduce heavy JS/WASM impact with lazy loading and chunking.
8. Submit the sitemap again in GSC after deployment.

## Fast Monetization Path

Do not overload the site with ads yet. First stabilize indexing.

Then:

- Keep AdSense light on tool pages.
- Add affiliate CTAs on relevant workflow pages.
- Create comparison/alternative pages for existing tools.
- Create embeddable widgets with attribution links.
- Build exact-intent pages that actually preconfigure the tool.

Best near-term content/tool clusters:

- PNG to JPG, JPG to PNG, WebP to PNG.
- Image compressor.
- Resize image to exact KB.
- Social media resizers.
- Passport photo resizer.
- Format comparison pages that already have impressions.


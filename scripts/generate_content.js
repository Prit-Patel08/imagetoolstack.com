import fs from 'fs';
import path from 'path';

// 1. Update comparisons.json
const comparisonsPath = path.join(process.cwd(), 'src/data/comparisons.json');
const data = JSON.parse(fs.readFileSync(comparisonsPath, 'utf8'));

const newComparisons = [
  { id: "png-vs-svg", format1: "PNG", format2: "SVG", title: "PNG vs SVG", description: "Compare pixel-based raster graphics (PNG) with math-based vector graphics (SVG).", winner: "Depends on use case", whenToUse1: "For complex images", whenToUse2: "For logos and UI", relatedToolSlug: "svg-to-png" },
  { id: "png-vs-gif", format1: "PNG", format2: "GIF", title: "PNG vs GIF", description: "Learn why PNG replaced GIF for static images.", winner: "PNG", whenToUse1: "For static transparent images", whenToUse2: "For simple animations", relatedToolSlug: "gif-to-png" },
  { id: "png-vs-avif", format1: "PNG", format2: "AVIF", title: "PNG vs AVIF", description: "Compare the legacy PNG format with the next-generation AVIF format.", winner: "AVIF for Web", whenToUse1: "For older clients", whenToUse2: "For modern web optimization", relatedToolSlug: "png-to-avif" },
  { id: "jpg-vs-avif", format1: "JPG", format2: "AVIF", title: "JPG vs AVIF", description: "Discover how AVIF offers vastly superior compression compared to JPG.", winner: "AVIF", whenToUse1: "For universal compatibility", whenToUse2: "For bandwidth savings", relatedToolSlug: "jpg-to-avif" },
  { id: "jpg-vs-heic", format1: "JPG", format2: "HEIC", title: "JPG vs HEIC", description: "Compare the standard JPG format with Apple's high-efficiency HEIC.", winner: "HEIC for storage", whenToUse1: "For sharing", whenToUse2: "For Apple devices", relatedToolSlug: "heic-to-jpg" },
  { id: "jpg-vs-tiff", format1: "JPG", format2: "TIFF", title: "JPG vs TIFF", description: "Understand the difference between compressed JPG and lossless TIFF.", winner: "TIFF for Print", whenToUse1: "For web and sharing", whenToUse2: "For professional print", relatedToolSlug: "tiff-to-jpg" },
  { id: "webp-vs-heic", format1: "WebP", format2: "HEIC", title: "WebP vs HEIC", description: "Compare Google's WebP with Apple's HEIC format.", winner: "WebP for Web", whenToUse1: "For websites", whenToUse2: "For iOS photos", relatedToolSlug: "webp-to-png" },
  { id: "webp-vs-svg", format1: "WebP", format2: "SVG", title: "WebP vs SVG", description: "Raster vs Vector: WebP compared to SVG.", winner: "Tie", whenToUse1: "For photos", whenToUse2: "For vector logos", relatedToolSlug: "svg-to-png" },
  { id: "webp-vs-gif", format1: "WebP", format2: "GIF", title: "WebP vs GIF", description: "Animated WebP compared to traditional GIF.", winner: "WebP", whenToUse1: "For modern animated images", whenToUse2: "For legacy support", relatedToolSlug: "gif-to-png" },
  { id: "avif-vs-heic", format1: "AVIF", format2: "HEIC", title: "AVIF vs HEIC", description: "The battle of the modern HEVC/AV1 based image formats.", winner: "AVIF for Web", whenToUse1: "For web delivery", whenToUse2: "For iOS ecosystems", relatedToolSlug: "avif-to-png" },
  { id: "avif-vs-png", format1: "AVIF", format2: "PNG", title: "AVIF vs PNG", description: "How AVIF is replacing PNG for transparent web graphics.", winner: "AVIF", whenToUse1: "For modern websites", whenToUse2: "For legacy compatibility", relatedToolSlug: "png-to-avif" },
  { id: "avif-vs-svg", format1: "AVIF", format2: "SVG", title: "AVIF vs SVG", description: "Compare highly compressed raster AVIF to vector SVG.", winner: "Depends", whenToUse1: "For complex graphics", whenToUse2: "For scalable UI", relatedToolSlug: "avif-to-png" },
  { id: "gif-vs-webp", format1: "GIF", format2: "WebP", title: "GIF vs WebP", description: "Why animated WebP is better than GIF.", winner: "WebP", whenToUse1: "For universal fallback", whenToUse2: "For smaller file sizes", relatedToolSlug: "gif-to-png" },
  { id: "tiff-vs-png", format1: "TIFF", format2: "PNG", title: "TIFF vs PNG", description: "Compare two of the most popular lossless formats.", winner: "PNG for Web", whenToUse1: "For print", whenToUse2: "For digital use", relatedToolSlug: "tiff-to-jpg" },
  { id: "raw-vs-heic", format1: "RAW", format2: "HEIC", title: "RAW vs HEIC", description: "Unprocessed sensor data compared to Apple's compressed format.", winner: "RAW for editing", whenToUse1: "For professional editing", whenToUse2: "For storage", relatedToolSlug: "heic-to-jpg" }
].map(c => ({
  ...c,
  seoTitle: `${c.title}: Which format is better?`,
  seoDescription: c.description,
  format1Pros: ["Great format", "Widely used"],
  format1Cons: ["Has limitations"],
  format2Pros: ["Alternative benefits"],
  format2Cons: ["Alternative limitations"]
}));

data.comparisons.push(...newComparisons);
fs.writeFileSync(comparisonsPath, JSON.stringify(data, null, 2));


// 2. Setup Directories
const contentDir = path.join(process.cwd(), 'src/content');
const articlesDir = path.join(contentDir, 'articles');
const formatsDir = path.join(contentDir, 'formats');

[contentDir, articlesDir, formatsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 3. Generate Markdown Files
const createMarkdown = (dir, slug, title, content) => {
  const frontmatter = `---
title: "${title}"
description: "Comprehensive guide and details about ${title}."
pubDate: "2024-01-01"
---
`;
  fs.writeFileSync(path.join(dir, `${slug}.md`), frontmatter + content);
};

// Format Hub Pages
const formats = ["png", "jpg", "webp", "heic", "avif", "svg", "gif", "tiff"];
formats.forEach(f => {
  createMarkdown(formatsDir, f, `${f.toUpperCase()} Format Guide`, 
    `Welcome to the ultimate guide for the ${f.toUpperCase()} image format. Learn everything about its history, technical specifications, and best use cases.\n\n## Overview\nThe ${f.toUpperCase()} format is widely used...`);
});

// Best Pages
const bestPages = [
  "best-image-format-for-websites", "best-image-format-for-social-media", "best-image-format-for-email",
  "best-image-format-for-logos", "best-image-format-for-photography", "best-image-format-for-printing",
  "best-image-format-for-transparent-images", "best-image-format-for-compression", "best-image-format-for-wordpress",
  "best-image-format-for-ecommerce"
];
bestPages.forEach(slug => {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  createMarkdown(articlesDir, slug, title, 
    `Choosing the right image format is critical. This guide breaks down the ${title}.\n\n## Recommendations\nWe recommend using modern formats like WebP or AVIF...`);
});

// How-To Guides
const howToGuides = [
  "how-to-convert-png-to-jpg", "how-to-convert-webp-to-png", "how-to-convert-heic-to-jpg",
  "how-to-convert-svg-to-png", "how-to-compress-images-without-losing-quality", "how-to-reduce-image-size-for-websites",
  "how-to-resize-images-for-instagram", "how-to-resize-images-for-facebook", "how-to-resize-images-for-linkedin",
  "how-to-create-a-favicon", "how-to-add-a-watermark-to-images", "how-to-remove-image-metadata",
  "how-to-convert-images-to-pdf", "how-to-make-images-load-faster", "how-to-optimize-images-for-seo"
];
howToGuides.forEach(slug => {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  createMarkdown(articlesDir, slug, title, 
    `In this step-by-step tutorial, you will learn ${title.toLowerCase()}.\n\n## Step 1: Upload\nStart by uploading your file...\n\n## Step 2: Process\nClick the process button...`);
});

console.log('Successfully generated all content!');

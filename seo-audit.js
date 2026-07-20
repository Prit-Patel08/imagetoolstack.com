// seo-audit.js - paste in root, run: node seo-audit.js
import fs from 'fs';
import path from 'path';

function checkFile(p) { return fs.existsSync(p) }
function read(p) { try { return fs.readFileSync(p, 'utf8') } catch (e) { return '' } }

console.log("=== ImageToolStack SEO Audit ===");
const pkg = JSON.parse(read('package.json') || '{}');
console.log("Framework:", pkg.dependencies?.next ? "Next.js" : pkg.dependencies?.vite ? "Vite (CSR risk)" : "Unknown");
console.log("Next version:", pkg.dependencies?.next || "not found");

const isAppRouter = checkFile('app/layout.tsx') || checkFile('app/layout.js');
console.log("Router:", isAppRouter ? "App Router (good for SSR)" : "Pages Router or Vite");

const compressPage = read('app/compress-image/page.tsx') || read('app/compress/page.tsx') || read('src/pages/compress.tsx') || "";
console.log("\n--- Core SEO Checks ---");
console.log("Has metadata export:", /export const metadata|generateMetadata/.test(compressPage) ? "YES" : "NO - FIX THIS, you will not rank");
console.log("Uses useEffect for H1/title:", /useEffect.*document\.title/.test(compressPage) ? "YES - BAD, Google sees blank" : "OK");
console.log("Has SoftwareApplication schema:", /SoftwareApplication/.test(compressPage) ? "YES" : "NO - Add for rich results");

console.log("\n--- Sitemap & Robots ---");
console.log("robots.txt exists:", checkFile('public/robots.txt') || checkFile('app/robots.ts') ? "YES" : "NO");
console.log("sitemap exists:", checkFile('public/sitemap-index.xml') || checkFile('app/sitemap.ts') ? "YES" : "NO - you need programmatic sitemap");

console.log("\n--- Programmatic Pages ---");
const appFiles = fs.existsSync('app') ? fs.readdirSync('app').length : 0;
console.log("Routes in /app:", appFiles, appFiles < 20 ? "(Too few - you need 100+ for high earnings)" : "(Good base)");

console.log("\nPaste this full output here and I will give you the fix list.");
# 📸 Image Tool Stack (`imagetoolstack.com`)

[![Astro](https://img.shields.io/badge/Astro-v6.4.2-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.0-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deploy-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A modern, privacy-first, zero-server-cost utility suite containing over **80+ browser-based tools** for converting, editing, resizing, and optimizing images and PDF documents. 

Designed with high-end modern aesthetics, dark mode support, and micro-animations to offer a premium, state-of-the-art user experience.

---

## 🔒 Privacy-First, Client-Side Architecture

Unlike typical online utility portals that upload your private documents to third-party cloud servers, **Image Tool Stack processes 100% of your data client-side in the browser**.
* **Zero Server Uploads:** None of your images, photos, or PDF documents ever leave your computer.
* **Wasm & JS Processing:** Heavy operations (like HEIC decoding, background removal, and PDF compression) run locally inside the browser sandbox using WebAssembly (Wasm) and JavaScript.
* **Client-Side AI Inference:** Real-time upscaling uses **TensorFlow.js** to run deep-learning models directly on your local CPU/GPU via WebGL.

---

## 🚀 Key Feature Categories

### 🔄 Format Conversion
* Lossless conversion between `PNG`, `JPG`, `WebP`, `AVIF`, `SVG`, `TIFF`, `ICO`, and `BMP`.
* High-performance browser-based **HEIC to JPG/PNG** converter.
* Bulk image conversion for large batch uploads.

### 📐 Image Editing & Resizing
* **Real AI Image Upscaler:** Genuine pixel reconstruction using ESRGAN models via TensorFlow.js.
* **Lossless EXIF Stripper:** Direct byte buffer modification to wipe camera/GPS metadata without re-compressing pixels.
* **Bulk Resizer & Compressor:** Crop, resize, pixelate, add watermarks, and compress to target sizes (e.g., *20kb, 50kb, 100kb*).
* Filter suite: Grayscale, Duotone, Sepia, Vignette, Solarize, Noise, and Contrast adjusters.

### 📄 Document & PDF Utilities
* Merge, Split, Rotate, and Remove Pages from PDF files.
* PDF security: Password protection, unlocking, and watermark overlays.
* Format conversions: Image-to-PDF, PDF-to-JPG, SVG-to-PDF, and PDF-to-Base64.

---

## 🛠️ Technology Stack

* **Framework:** [Astro v6](https://astro.build) (Static Site Generation with zero-JS by default for lightning-fast loads)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (Modern design system, custom utility classes, and dark-mode support)
* **AI Engine:** [TensorFlow.js](https://js.tensorflow.org) & [UpscalerJS](https://upscalerjs.com) (Client-side super-resolution inference)
* **PDF Engine:** [pdf-lib](https://pdf-lib.js.org) & [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Local PDF manipulation)
* **Wasm HEIC Decoder:** [heic2any](https://alexcorvi.github.io/heic2any/)
* **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com) (Distributed globally on the edge)

---

## 📂 Project Directory Structure

```text
/
├── public/                     # Static assets (Favicons, robots.txt, sitemaps)
├── scripts/                    # Build-time content and asset generation utilities
├── src/
│   ├── components/
│   │   ├── tools/              # Custom Astro components for all 80+ tools
│   │   ├── Navbar.astro        # Navigation header with token-based search index
│   │   └── Footer.astro        # Global site footer
│   ├── content/                # Content collections (Markdown metadata/articles)
│   ├── data/                   # JSON databases for tools, categories, and comparisons
│   ├── layouts/                # Base HTML Shell templates (layouts, meta headers)
│   ├── pages/                  # Static pages and routing (terms, privacy, blog, index)
│   ├── plugins/                # Custom Markdown / Remark AST plugins
│   ├── styles/                 # global.css containing custom design system variables
│   └── utils/                  # SEO and metadata generation engines
├── astro.config.mjs            # Astro configuration (trailingSlash: never, sitemap integrates)
├── package.json                # Project dependencies and build scripts
└── tsconfig.json               # TypeScript path mapping config
```

---

## ⚡ Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine:
* **Node.js:** `>=22.12.0`
* **NPM:** `>=10.0.0`

### Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Prit-Patel08/imagetoolstack.com.git
cd imagetoolstack.com
npm install
```

### Development
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser to view the application.

### Build & Preview
To compile the static pages and preview the production build locally:
```bash
# Build the production bundle into /dist
npm run build

# Preview the local build
npm run preview
```

---

## 🌐 Deployment
The site is built to be hosted on **Cloudflare Pages**. To deploy manually via the Wrangler CLI:
```bash
npm run deploy
```

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
title: "BMP File Format Standard: Binary Struct Headers & Bitmap Raster Details"
description: "BMP/Bitmap image format standard specifications. Discover the BITMAPFILEHEADER, BITMAPINFOHEADER struct layouts, scanline 4-byte padding math, and bottom-up raster mappings."
pubDate: "2026-06-08"
---

# BMP File Format Standard: Binary Struct Headers & Bitmap Raster Details

The **Bitmap (BMP)** image format, also known as the Device-Independent Bitmap (DIB) format, is a legacy raster graphics standard developed by Microsoft for the Windows operating system. Unlike modern compressed formats, BMP is designed to store uncompressed pixel data directly in memory buffers. This allows the OS to render images on any display hardware without complex decoding pipelines.

This specification document outlines the low-level **binary struct headers**, **scanline 4-byte padding formulas**, **color palette lookup tables**, and web performance guidelines for the BMP format.

---

## What is the BMP File Format Specification?

The BMP specification defines a simple, uncompressed binary layout that maps directly to the system's memory. Because the file structure matches the GDI (Graphics Device Interface) mapping in Windows, the operating system can display BMP files with minimal processing.

Key aspects of the BMP standard include:
*   **Device Independence:** The file header contains exact color space parameters to ensure colors display consistently across different screens and devices.
*   **Simple Rasterization:** Pixels are stored in a simple, flat byte array without complex compression (like JPEG's DCT or PNG's DEFLATE).
*   **Bottom-Up Storage:** By default, BMP scanlines are stored in reverse order, starting from the bottom-left corner of the image and moving up to the top-right.

---

## Binary Struct Headers of a BMP File

At the binary level, a BMP file is organized into four main sections:

```
+-----------------------------------------------------------+
| BITMAPFILEHEADER (14 bytes: Signature 'BM', File Size)     |
+-----------------------------------------------------------+
| BITMAPINFOHEADER (40 bytes: Sizing, Bit Depth, Color count)|
+-----------------------------------------------------------+
| Color Palette Table (Optional: Required for <= 8-bit)    |
+-----------------------------------------------------------+
| Pixel Array Payload (Scanlines with 4-byte padding)       |
+-----------------------------------------------------------+
```

### 1. The `BITMAPFILEHEADER` Struct (14 Bytes)
This header is located at the very start of the file and contains basic parameters to identify the file:
*   **bfType (2 bytes):** The file signature. Must be the ASCII characters `'BM'` (`0x42 0x4D` in hexadecimal).
*   **bfSize (4 bytes):** The total size of the BMP file in bytes.
*   **bfReserved1 / bfReserved2 (2 bytes each):** Reserved fields, always set to `0`.
*   **bfOffBits (4 bytes):** The byte offset from the start of the file to the beginning of the pixel data.

### 2. The `BITMAPINFOHEADER` Struct (40 Bytes)
This header defines the layout and color configuration of the image:
*   **biSize (4 bytes):** The size of the info header (must be exactly `40` bytes for standard BMPs).
*   **biWidth (4 bytes):** The width of the image in pixels.
*   **biHeight (4 bytes):** The height of the image in pixels. A positive value indicates a bottom-up bitmap, while a negative value indicates a top-down layout.
*   **biPlates (2 bytes):** The number of color planes (must always be set to `1`).
*   **biBitCount (2 bytes):** The number of bits per pixel (BPP), defining the color depth (supports 1, 4, 8, 16, 24, or 32 bits).
*   **biCompression (4 bytes):** The compression type (usually `0` for uncompressed BI_RGB, or `1`/`2` for Run-Length Encoded BI_RLE8/BI_RLE4).
*   **biSizeImage (4 bytes):** The size of the raw pixel array in bytes.
*   **biXPelsPerMeter / biYPelsPerMeter (4 bytes each):** The horizontal and vertical resolution of the target display.
*   **biClrUsed (4 bytes):** The number of color indexes in the color palette that are actually used.
*   **biClrImportant (4 bytes):** The number of important colors (usually `0` to indicate all colors are important).

---

## DIB Header Varieties (V3, V4, V5 Headers)

As Windows evolved, Microsoft extended the BITMAPINFOHEADER struct to support advanced graphics features like alpha channels and color space profiles, resulting in several header versions:

| Header Name | Size (Bytes) | Added Features |
| :--- | :---: | :--- |
| **BITMAPINFOHEADER** | 40 | Base layout, width, height, bit depth, RLE compression. |
| **BITMAPV3INFOHEADER** | 56 | Adds support for bitmask colors and alpha transparency channels. |
| **BITMAPV4HEADER** | 108 | Adds color space endpoints (defining sRGB profiles) and gamma correction values. |
| **BITMAPV5HEADER** | 124 | Adds full ICC color profile linking and color matching options. |

Graphics software must check the header size parameter (`biSize`) at the start of the info header to parse the extra fields correctly.

---

## Scanline 4-Byte Padding Mathematics

In a BMP file, the pixel data for each horizontal row (scanline) must be padded to a multiple of **4 bytes** (32 bits). This requirement aligns the data with system memory boundaries, allowing CPUs to read the pixel values more efficiently.

If a scanline's raw data size does not end on a 4-byte boundary, the encoder appends padding bytes (usually zeros) to fill the remaining space.

### The Padding Formula
The number of padding bytes ($P$) required for a single scanline is calculated as:
$$\text{Row Size (Bytes)} = \text{Width} \times \left( \frac{\text{Bits Per Pixel}}{8} \right)$$
$$\text{Padding } (P) = \left( 4 - (\text{Row Size} \pmod 4) \right) \pmod 4$$

For example, for a 24-bit RGB image (`biBitCount = 24`) that is 101 pixels wide:
1.  Calculate the raw row size:
    $$\text{Row Size} = 101 \times 3 = 303 \text{ bytes}$$
2.  Calculate the padding:
    $$303 \pmod 4 = 3$$
    $$P = (4 - 3) \pmod 4 = 1 \text{ byte}$$
3.  The encoder writes 303 bytes of RGB data followed by 1 padding byte, resulting in a total row size of 304 bytes in the file.

---

## Color Palette Tables & Bitmap Bit Depths

Depending on the bit depth (`biBitCount`), the BMP file structures its pixel data differently:

*   **1-Bit (Monochrome):** Supports only two colors (usually black and white). The file requires a 2-entry color palette, and each pixel is represented by a single bit.
*   **4-Bit (16 Colors):** Supports up to 16 colors. Requires a 16-entry color palette. Each byte contains index values for two pixels (4 bits per pixel).
*   **8-Bit (256 Colors):** Supports up to 256 colors. Requires a 256-entry color palette (RGBQUAD structs). Each byte contains a single palette index index for one pixel.
*   **24-Bit (Truecolor RGB):** Supports 16.7 million colors. Pixels are stored as 3-byte Blue-Green-Red (BGR) triplets. No color palette is used.
*   **32-Bit (RGBA):** Supports 16.7 million colors with an 8-bit alpha transparency channel. Pixels are stored as 4-byte Blue-Green-Red-Alpha (BGRA) values.

---

## Why BMP is Unsuitable for Web Publishing

While BMP was a standard format for desktop applications, it is **strictly unsuitable for modern web publishing** for several reasons:

1.  **Massive File Sizes:** Because BMP files are uncompressed, they have very large file sizes. A single 24-bit $1920\times1080$ wallpaper image takes up **6.2 MB** of space as a BMP. Compressed as a WebP or JPEG, the same image takes up only **200 KB** to **500 KB**, saving up to 95% on storage.
2.  **Core Web Vitals Impact:** Serving large BMP files on a website slows down page load speed, which hurts your site's Cumulative Layout Shift and Largest Contentful Paint scores, and lowers your SEO rankings.
3.  **Browser Support and Rendering Issues:** While modern browsers can render BMP files, they do not optimize them. Large BMPs load progressively slower, creating a poor user experience.

***

## Frequently Asked Questions About the BMP Standard

### What does the 'BM' signature mean?
The first 2 bytes of a BMP file must contain the ASCII characters `'BM'` (hexadecimal `0x42 0x4D`). This signature tells the operating system and graphics decoders that the file is a standard Windows bitmap graphic.

### How does bottom-up pixel mapping work?
In a standard bottom-up BMP (when `biHeight` is positive), the pixel data array starts with the bottom-left pixel of the image, reads horizontally to the right, and then moves up row by row to the top-right corner. This coordinate layout matches legacy Windows graphics coordinate systems.

### Why is 4-byte padding required?
Padding align each horizontal row of pixel data to a multiple of 4 bytes. This alignment matches system memory boundaries (32-bit words), allowing the CPU to read pixel data from memory much faster.

### Does the BMP format support transparency?
Yes. The 32-bit BMP standard supports **8-bit alpha transparency**. However, support for transparent BMPs is inconsistent across legacy image viewers and some web browsers, making PNG or WebP a safer choice for transparent web graphics.

### Does BMP support compression?
Yes. BMP supports **Run-Length Encoding (RLE)** compression, specifically `RLE8` (for 8-bit images) and `RLE4` (for 4-bit images). RLE is a basic lossless compression method that groups repeated color indexes, but it is not effective for complex photographic gradients.

### How can I convert a BMP to JPG or PNG?
To convert large BMP files to modern, compressed web formats (like JPEG or PNG) without uploading them to third-party servers, use our browser-based [BMP to JPG Converter](/tools/bmp-to-jpg) or [BMP to PNG Converter](/tools/bmp-to-png). The tool runs locally in your browser, keeping your files secure and private.

---
title: "HEIC File Format Standard: ISO Base Media & Apple HEIF Guide"
description: "HEIC/HEIF image format standard specifications. Discover the ISO/IEC 23008-12 container, HEVC codec H.265 compression, and Apple iOS metadata handling."
pubDate: "2026-06-08"
---

# HEIC File Format Standard: ISO Base Media & Apple HEIF Guide

The **High Efficiency Image Container (HEIC)** and **High Efficiency Image File Format (HEIF)** represent the next generation of image storage standards. Standardized under **ISO/IEC 23008-12** (MPEG-H Part 12), the HEIC format uses High Efficiency Video Coding (HEVC/H.265) compression wrapped inside the ISO Base Media File Format container. Adopted by Apple in 2017 with iOS 11, HEIC has become the standard camera capture format for mobile devices.

This specification document outlines the **ISOBMFF box container hierarchy**, the **HEVC intra-frame predictive coding architecture**, **Apple EXIF and Live Photo metadata structures**, and web compatibility guidelines.

---

## What is the HEIC File Format Specification?

The HEIC specification defines a container format designed to store individual images, image sequences (animations or bursts), and auxiliary image data (such as depth maps or alpha channels). 

The format's primary advantages over legacy standards like JPEG include:
*   **Superior Compression:** Uses HEVC/H.265 compression to reduce image file sizes by approximately 50% compared to JPEG at equivalent visual quality.
*   **Container Architecture:** Capable of storing multiple image layers, thumbnails, non-destructive editing instructions, and depth information within a single file.
*   **Extended Color Depth:** Supports up to 16-bit color depth (compared to JPEG's 8-bit limit) to capture high dynamic range (HDR) photography.

---

## The ISO Base Media File Format Container (ISOBMFF)

HEIC is built on the **ISO Base Media File Format (ISOBMFF, ISO/IEC 14496-12)**, which is the same container architecture used for MP4 video files. Instead of a linear byte stream, an ISOBMFF file is organized as a nested hierarchy of data blocks called **boxes** (also called atoms):

```
+-----------------------------------------------------------+
| ftyp (File Type Box)                                      |
+-----------------------------------------------------------+
| meta (Metadata Box)                                       |
|  +-- hdlr (Handler Box)                                   |
|  +-- pitm (Primary Item Box)                              |
|  +-- iloc (Item Location Box)                             |
|  +-- iprp (Item Properties Box)                           |
+-----------------------------------------------------------+
| mdat (Media Data Box)                                     |
|  +-- Compressed HEVC Bitstreams (Pixels)                  |
+-----------------------------------------------------------+
```

### Core Box Types in HEIC
*   **`ftyp` (File Type Box):** Located at the very start of the file. It defines the brand and compatibility parameters. For Apple HEIC files, the primary brand is typically `'heic'` or `'heix'`.
*   **`meta` (Metadata Box):** Contains metadata about the items stored in the file, including:
    *   `hdlr` (Handler Box): Declares that the metadata contains image items.
    *   `pitm` (Primary Item Box): Identifies the main image in the file (since the container can hold multiple images).
    *   `iloc` (Item Location Box): Stores byte offsets and lengths pointing to where each item's pixel data is located inside the media data box.
    *   `iprp` (Item Properties Box): Lists properties of the images, such as dimensions, color profiles (ICC), and rotational transforms.
*   **`mdat` (Media Data Box):** Stores the actual compressed HEVC bitstream data (the pixels) for the primary image, thumbnails, and other auxiliary items.

---

## High Efficiency Video Coding (HEVC / H.265) Compression

The high compression efficiency of HEIC is due to **High Efficiency Video Coding (HEVC/H.265)**. While JPEG divides images into fixed $8\times8$ pixel blocks, HEVC uses a highly flexible, tree-structured partitioning system.

### 1. Coding Tree Units (CTUs)
HEVC replaces macroblocks with **Coding Tree Units (CTUs)**. A CTU can be up to $64\times64$ pixels in size and is recursively split into smaller **Coding Units (CUs)** using a quadtree structure (from $64\times64$ down to $8\times8$ pixels). 

This allows the encoder to use large blocks for flat, uniform areas (like skies) and small blocks for highly detailed areas (like leaves or text), maximizing compression efficiency.

```
+-------------------+     +---------+---------+
|                   |     |  32x32  |  32x32  |
|                   |     +----+----+---------+
|      64x64        | --> |16x1|16x1|         |
|                   |     +----+----+  32x32  |
|                   |     |  32x32  |         |
+-------------------+     +---------+---------+
  Flat sky area             Detailed texture area
  (Single large block)      (Split recursively)
```

### 2. Advanced Intra-Prediction
To compress static frames, HEVC uses **35 intra-prediction modes** (compared to JPEG's none and WebP's 4). These modes include:
*   **DC Mode:** Fills the block with an average color value.
*   **Planar Mode:** Predicts smooth surfaces and gradients.
*   **33 Directional Modes:** Predicts sharp edges and patterns at various angles.

### 3. In-Loop Filtering & Entropy Coding
After prediction and transform coding, HEVC applies two in-loop filters to clean up compression artifacts before saving the data:
*   **Deblocking Filter (DBF):** Smooths blocky transitions at unit boundaries.
*   **Sample Adaptive Offset (SAO):** Compares the filtered image to the original and applies offset values to restore details and prevent banding.
*   **CABAC (Context-Adaptive Binary Arithmetic Coding):** The final values are compressed using CABAC, a highly efficient mathematical encoder.

---

## Apple's EXIF, Geotagging and Live Photos Metadata Handling

Apple's implementation of the HEIC standard leverages the ISOBMFF container to handle complex metadata, geolocation data, and multi-media pairings.

### 1. EXIF and Geotagging Storage
In a HEIC file, **EXIF data** (which stores camera metadata like aperture, shutter speed, ISO, timestamps, and GPS coordinates) is stored inside a dedicated metadata item. The `iloc` box lists the byte offset of the EXIF payload, and the `iref` box links the EXIF metadata to the primary image item. This separation allows the EXIF data to be read, edited, or stripped without modifying the compressed image data itself.

### 2. Live Photos Architecture
Apple's **Live Photos** feature captures a high-resolution photo along with a short video clip before and after the shutter press. 
*   **Old JPEG Implementation:** The phone saved two separate files: an `.jpg` image and a `.mov` video.
*   **Modern HEIC Container:** The image and video are stored inside a single `.heic` file. The ISOBMFF container holds the static primary image (compressed using HEVC) alongside a secondary video track (also compressed using HEVC). This packages the media assets into a single file, reducing storage space.

---

## Is HEIC Good for Web Publishing? (SEO Speed Warnings)

While HEIC is a great container for mobile storage, it is **not suitable for web publishing**.

### The Browser Compatibility Gap
As of 2026, **no major web browser natively decodes HEIC files** (`.heic` or `.heif`). This is due to licensing fees and patent royalty issues surrounding the HEVC/H.265 video codec. 
*   If you upload raw `.heic` files to a website, Google Chrome, Safari, Firefox, and Edge will display broken image icons.
*   Search engine crawlers (like Googlebot) cannot index the content of `.heic` images directly, which hurts image search visibility and SEO.

### Best Practice for the Web
If your source files are in HEIC format, you must convert them to web-compatible formats like **JPEG**, **WebP**, or **AVIF** before uploading them to your server.

---

## How to Handle HEIC Client-Side Browser Conversions

To help web users upload HEIC photos, web applications use JavaScript canvas and WebAssembly decoders (like `heic-decode` or `libde265`) to convert HEIC files to JPEG or PNG locally in the user's browser.

If you have HEIC photos from your iPhone that you need to optimize for the web, use our free, browser-based [HEIC to JPG Converter](/tools/heic-to-jpg). 

Because the converter runs entirely client-side using JavaScript, your files are processed locally on your computer and are **never uploaded to an external server**, keeping your personal photos 100% private.

---

## Frequently Asked Questions About the HEIC Standard

### What is a HEIC file?
HEIC (High Efficiency Image Container) is a file format standard adopted by Apple that stores images compressed with the HEVC (H.265) video codec inside the ISO Base Media File Format container. It allows photos to be saved at half the file size of a JPEG while maintaining equivalent or higher quality.

### How does the ISOBMFF container work?
The ISO Base Media File Format (ISOBMFF) container organizes data into nested blocks called **boxes** (atoms). Each box has a 4-character type (like `ftyp`, `meta`, or `mdat`) and a size header. This modular structure allows the container to store multiple images, thumbnails, alpha transparency channels, and video tracks within a single file.

### Why is HEIC superior to JPEG?
HEIC is superior because it uses the modern HEVC/H.265 compression standard. HEVC uses flexible Coding Tree Units (up to $64\times64$ pixels) instead of JPEG's fixed $8\times8$ blocks. It also uses 35 intra-prediction modes and in-loop filtering (SAO) to deliver 16-bit color depth, transparency, and animations at half the file size of JPEG.

### Which web browsers support HEIC?
Currently, **no major web browsers support native decoding of HEIC files** due to licensing fees and patents on the HEVC codec. To display HEIC images on a website, they must be converted to standard web formats like JPEG or WebP.

### Does HEIC support transparency?
Yes, the HEIF standard supports transparency. Inside the HEIC container, alpha channel transparency is stored as a separate auxiliary image item, which is compressed losslessly using a grayscale HEVC bitstream to provide clean, anti-aliased edges.

### How can I convert HEIC to JPG locally?
To convert HEIC images to JPG without uploading them to a third-party server, use our browser-based [HEIC to JPG Converter](/tools/heic-to-jpg). The conversion runs locally on your device, ensuring your photos remain private.
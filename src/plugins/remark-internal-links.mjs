import { findAndReplace } from 'mdast-util-find-and-replace';

// Dictionary mapping target keywords to URLs
const dictionary = [
  { pattern: /\b(compress images?|reduce image file size)\b/gi, url: '/tools/image-compressor' },
  { pattern: /\b(resize images?|bulk resize|resize photos?)\b/gi, url: '/tools/bulk-resizer' },
  { pattern: /\b(remove backgrounds?|transparent backgrounds?)\b/gi, url: '/tools/remove-bg' },
  { pattern: /\b(convert(?: to)? webp|webp format)\b/gi, url: '/tools/png-to-webp' },
  { pattern: /\b(convert(?: to)? jpg|jpg format)\b/gi, url: '/tools/png-to-jpg' },
  { pattern: /\b(convert(?: to)? png|png format)\b/gi, url: '/tools/jpg-to-png' },
  { pattern: /\b(convert heic|heic to jpg)\b/gi, url: '/tools/heic-to-jpg' },
  { pattern: /\b(compress pdfs?)\b/gi, url: '/tools/compress-pdf' },
  { pattern: /\b(merge pdfs?)\b/gi, url: '/tools/merge-pdf' },
  { pattern: /\b(split pdfs?)\b/gi, url: '/tools/split-pdf' },
  { pattern: /\b(image upscaler?|upscale images?)\b/gi, url: '/tools/image-upscaler' },
  { pattern: /\b(add watermarks?|watermark images?)\b/gi, url: '/tools/add-watermark' }
];

export function remarkInternalLinks() {
  return (tree) => {
    console.log("REMARK PLUGIN RUNNING FOR A FILE");
    // Track URLs we have already linked in this specific document.
    // This prevents the plugin from linking the same word 10 times in one article,
    // which looks spammy. It will only link the first occurrence.
    const usedUrls = new Set();

    const replacements = dictionary.map(({ pattern, url }) => {
      return [
        pattern,
        (match) => {
          if (usedUrls.has(url)) {
            return false; // Return false to mdast-util-find-and-replace to leave the text alone
          }
          usedUrls.add(url);
          return {
            type: 'link',
            url: url,
            children: [{ type: 'text', value: match }]
          };
        }
      ];
    });

    // We explicitly ignore applying replacements inside existing links or headings
    findAndReplace(tree, replacements, { ignore: ['link', 'linkReference', 'heading'] });
  };
}

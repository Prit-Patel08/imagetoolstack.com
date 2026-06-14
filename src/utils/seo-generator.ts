import comparisonsData from "../data/comparisons.json";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: string;
  inputFormats: string[];
  outputFormats: string[];
  benefits?: string[];
  useCases?: { title: string; text: string }[];
  howItWorks?: string[];
  faq?: { q: string; a: string }[];
}

export function generateSeoTitle(tool: Tool): string {
  if (tool.seoTitle) return tool.seoTitle;
  const inFmt = tool.inputFormats.join(', ') || 'Image';
  const outFmt = tool.outputFormats.join(', ') || 'Image';
  if (tool.categoryId === 'conversion') {
    return `Best ${inFmt} to ${outFmt} Converter Online | Free & No Limits`;
  }
  return `Best ${tool.name} Online | 100% Free & No Limits`;
}

export function generateSeoDescription(tool: Tool): string {
  if (tool.seoDescription) return tool.seoDescription;
  const inFmt = tool.inputFormats.join(', ') || 'image';
  const outFmt = tool.outputFormats.join(', ') || 'image';
  return `Looking for the best ${tool.name.toLowerCase()}? Process ${inFmt} files instantly in your browser without uploading to any server. 100% Free, secure, and Lightning fast.`;
}

export function generateHowItWorks(tool: Tool): string[] {
  return tool.howToSteps || [];
}

export function generateFaqs(tool: Tool): { q: string; a: string }[] {
  return tool.faqs || [];
}

export function generateComparisons(tool: Tool): { title: string; text: string; slug?: string }[] {
  // We can't return just an array of strings to the old ComparisonSection component without breaking it, 
  // unless we update ComparisonSection.astro to expect just slugs!
  // But wait, the old generator returned `{title, text, slug}`. Let me check what ComparisonSection actually expects.
  // I will refactor ComparisonSection.astro entirely instead of using this function.
  return [];
}

export function generateUseCases(tool: Tool): { title: string; text: string }[] {
  // Returning tool.useCases directly, but they are strings now. The old component expects {title, text}.
  // We will refactor UseCases.astro entirely.
  return [];
}

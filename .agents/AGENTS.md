# Agent Optimization Guidelines for ImageToolStack

Whenever the user asks to "improve" a tool, page, comparison, or article, the agent must not use generic templates or boilerplate. Instead, the agent should create high-level, human-written, premium quality content.

## Pre-Research Requirement
Before changing, creating, or proposing any SEO metadata, page copy, or new utility tools, the agent must run web searches to research and verify:
- Current target keyword demand and search volume.
- What is currently hyped/trending in the designer, developer, or consumer utility spaces.
- Deep competitor analysis (including specific platforms like Squoosh, ezgif, TinyPNG, Iloveimg, etc.) and related search queries to find high-performing long-tail keywords. Aggregate the best details, tips, and formatting guidelines from all top competitors so that our guides are the most exhaustive and authoritative resources online.

### Keyword Alignment Step
Before presenting any Phase 1 Audit or Scorecard to the user:
1. Run web searches to analyze competitor article structures and identify low-competition, high-ranking chance long-tail keyword types and query variations.
2. Stop and present these low-competition keyword candidates to the user.
3. Wait for the user to perform traffic research on these candidates and return the finalized keywords.
4. Once the user provides the final keywords, proceed to the Phase 1 Audit and optimization steps.

## Build Safeguard
Do NOT run build or dev server commands (e.g. `npm run build`, `npm run dev`) unless explicitly requested by the user, as it causes system freezes and window hangs. The user will verify compiles manually.

## Quality Standards for "Improvement" Tasks
1. **Targeted SEO Metadata**: Rewrite SEO Titles and Descriptions in `tools.json` to focus on specific high-value user intents (e.g., "without uploading", "free", "no signup", "browser-based", "private").
2. **Detailed Rich Guides**: Overhaul thin article placeholders in `src/content/articles/` with detailed, unique guides (targeting **1,500 to 2,000 words**) containing natural subheadings (`<h2>`), optimization tips, format comparisons, privacy safeguards, and a list of common mistakes to avoid.
3. **Structured Content**: Include custom-tailored FAQs, use cases, and benefits specific to the tool's core functionality (targeting **1,000 to 1,500 words** of structured copy in `tools.json` including detailed benefits, custom use cases, and 5-6 extended FAQs).
4. **Internal Linking**: Explicitly add links to related tools, comparisons, and articles at the bottom of pages to pass link equity.
5. **Localization Safeguard**: Set `preserveCustomContent: true` where applicable to keep high-quality English copy intact.

## Visual & UX Standards (Top Priority)
- **Comprehensive Typography Styling**: All content-heavy pages (articles, guides, comparisons) must render Markdown content using the custom `.prose` utility to avoid unstyled browser defaults (which occur when Tailwind resets standard typography).
- **Header & Section Sizing**: Ensure all titles, subtitles (`h1`, `h2`, `h3`), and paragraphs have explicit padding, margins, and letter spacing to feel premium and readable.
- **Lists & Code blocks**: Ensure bullet points, numbered lists, code samples, and warnings/tips are clearly indented, custom-colored, and styled rather than rendering as raw, unstyled text.
- **Dark Mode Integration**: Ensure all typography, margins, background elements, and card sections transition seamlessly between light and dark modes without contrast issues.

## IndexNow Submission Policy
When improving, creating, or updating specific pages, NEVER submit all URLs from `improved-urls.txt` or `indexable-pages.json` at once. Submit ONLY the specific URLs that were modified or newly added in that batch (e.g. `node scripts/submit-indexnow.js https://imagetoolstack.com/url1 https://imagetoolstack.com/url2`).

## Two-Phase Improvement Workflow
Whenever the user asks to improve a page/URL:
1. **Phase 1 (Audit & Score)**: Check the current files, evaluate them against the `AGENTS.md` guidelines, output the current score card, and list proposed changes. Do NOT change any code yet.
2. **Phase 2 (Confirmation)**: Wait for the user's explicit permission to implement the improvements.
3. **Phase 3 (Post-Implementation Score)**: Perform the changes, and then output the updated `AGENTS.md` score card to prove everything passes.



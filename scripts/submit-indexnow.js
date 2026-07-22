import fs from 'fs';
import path from 'path';

// 1. Configuration details
const API_KEY = "cb82a2eafdca427d957138732fb194b7";
const HOST = "imagetoolstack.com";

// 2. Read approved indexable pages
const dataPath = path.resolve('src/data/indexable-pages.json');
if (!fs.existsSync(dataPath)) {
  console.error(`❌ Could not find indexable-pages.json at: ${dataPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 3. Build URL list
let urls = [];

const cliArgs = process.argv.slice(2).filter(arg => arg.trim().length > 0);

if (cliArgs.length > 0) {
  // If specific URLs are passed via CLI, submit ONLY those URLs
  urls = cliArgs.map(arg => {
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      return arg;
    }
    const cleanPath = arg.replace(/^\//, '');
    return `https://${HOST}/${cleanPath}`;
  });
  console.log(`📌 Targeted submission mode: ${urls.length} specific URL(s) provided.`);
} else {
  console.log(`🌐 Full site mode: No specific URLs passed, reading all indexable pages...`);
  // Static pages
  if (data.staticPages) {
    data.staticPages.forEach(p => {
      const cleanPath = p === '/' ? '' : p.replace(/^\//, '');
      urls.push(`https://${HOST}/${cleanPath}`);
    });
  }

  // Tools
  if (data.tools) {
    data.tools.forEach(slug => {
      urls.push(`https://${HOST}/tools/${slug}`);
    });
  }

  // Articles
  if (data.articles) {
    data.articles.forEach(slug => {
      urls.push(`https://${HOST}/${slug}`);
    });
  }

  // Comparisons
  if (data.comparisons) {
    data.comparisons.forEach(id => {
      urls.push(`https://${HOST}/compare/${id}`);
    });
  }

  // Formats
  if (data.formats) {
    data.formats.forEach(slug => {
      urls.push(`https://${HOST}/formats/${slug}`);
    });
  }
}

// Deduplicate URLs
urls = Array.from(new Set(urls));

// 4. Send POST request to IndexNow endpoint
async function submit() {
  if (urls.length === 0) {
    console.log('⚠️ No URLs found to submit.');
    return;
  }
  
  console.log(`Submitting ${urls.length} URL(s) to IndexNow:`);
  urls.forEach(u => console.log(`  - ${u}`));
  
  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: `https://${HOST}/${API_KEY}.txt`,
    urlList: urls
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ IndexNow URL submission successful!');
    } else {
      console.error(`❌ Submission failed: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response details:', text);
    }
  } catch (error) {
    console.error('❌ Network error during submission:', error);
  }
}

submit();

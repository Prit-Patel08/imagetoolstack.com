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
const urls = [];

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

// 4. Send POST request to IndexNow endpoint
async function submit() {
  if (urls.length === 0) {
    console.log('⚠️ No URLs found to submit.');
    return;
  }
  
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  
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

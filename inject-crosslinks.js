const fs = require('fs');
const path = require('path');

const dir = 'src/pages/compare';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro') && f !== '[id].astro' && f !== 'index.astro');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('CrossLinkBlock')) {
    // Inject import
    content = content.replace('---', '---\nimport CrossLinkBlock from "../../components/seo/CrossLinkBlock.astro";');
    
    // Extract first format from filename e.g. "png-vs-jpg.astro" -> "png"
    const format1 = file.split('-')[0].toUpperCase();
    
    // Inject component before closing main div
    content = content.replace('    </div>\n  </main>', `      <!-- High-Density Internal Cross-Linking Block -->\n      <CrossLinkBlock currentFormat="${format1}" />\n\n    </div>\n  </main>`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});

const fs = require('fs');
const path = require('path');

const apiKey = 'AQ.Ab8RN6KNSNdozM8Re1n3hlbXWEpGPCIhwwjZ4fy8o3P4MBD06g';
const toolsFilePath = path.join(__dirname, 'src/data/tools.json');

const data = JSON.parse(fs.readFileSync(toolsFilePath, 'utf8'));
const tools = data.tools;

// To test or run on all
// We will process all 164 tools in batches of 10
const batchSize = 10;
const batches = [];
for (let i = 0; i < tools.length; i += batchSize) {
  batches.push(tools.slice(i, i + batchSize));
}

async function processBatch(batch) {
  const prompt = `
You are an expert SEO copywriter for a suite of browser-based image utility tools.
I am providing you with an array of tool objects.
For EACH tool, rewrite the \`benefits\`, \`howTo\`, and \`faq\` arrays so they are 100% UNIQUE and highly specific to that exact tool's function (e.g. if the tool is png-to-jpg, mention PNG and JPG specifically in the text, and talk about transparency loss vs compression. If it is adjust-contrast, talk about colors and punchiness). Remove any generic boilerplate.

Guidelines:
- benefits: Array of 3 objects with { title, description }.
- howTo: Array of 3 objects with { step, description }.
- faq: Array of 3 objects with { q, a }.

IMPORTANT: Output ONLY a pure, valid JSON array containing the updated tools. DO NOT wrap the output in \`\`\`json markdown blocks. Just output raw JSON.

Input batch:
${JSON.stringify(batch.map(t => ({ id: t.id, name: t.name, description: t.description })), null, 2)}
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      });

      const responseData = await res.json();
      
      if (responseData.error) {
        throw new Error(responseData.error.message);
      }

      const text = responseData.candidates[0].content.parts[0].text;
      
      // Parse the JSON
      const parsed = JSON.parse(text);
      return parsed;
    } catch (err) {
      console.error("Error processing batch, retrying...", err.message);
      retries--;
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log(`Starting to process ${tools.length} tools in ${batches.length} batches...`);
  
  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1} of ${batches.length}...`);
    try {
      const updatedTools = await processBatch(batches[i]);
      
      // Merge updates
      for (const updated of updatedTools) {
        const index = tools.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          tools[index].benefits = updated.benefits;
          tools[index].howTo = updated.howTo;
          tools[index].faq = updated.faq;
        }
      }
      
      // Save continuously
      fs.writeFileSync(toolsFilePath, JSON.stringify({ tools }, null, 2));
      console.log(`Successfully processed and saved batch ${i + 1}`);
      
      // Rate limiting pause
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`Failed to process batch ${i + 1}`, err);
    }
  }
  
  console.log("Finished rewriting tools data.");
}

main();

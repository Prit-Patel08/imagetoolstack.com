const apiKey = 'AQ.Ab8RN6KNSNdozM8Re1n3hlbXWEpGPCIhwwjZ4fy8o3P4MBD06g';

async function testKey() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with exactly 'hello'" }] }]
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
}
testKey();

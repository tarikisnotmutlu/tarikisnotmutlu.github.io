// api/ai.js
// OpenAI proxy — API key server'da kalır, browser'a gitmez

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Auth cookie kontrolü
  const cookies = req.headers.cookie || '';
  const authToken = process.env.AUTH_TOKEN || 'tarik_auth_2026';
  if (!cookies.includes(`skill_auth=${authToken}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { messages, jsonMode } = req.body;
  if (!messages) return res.status(400).json({ error: 'messages required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1500,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    return res.status(200).json({ content: data.choices[0].message.content });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

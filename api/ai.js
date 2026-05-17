export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Token doğrula
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const validToken = process.env.AUTH_TOKEN || 'tarik_skill_2026';
  if (token !== validToken) return res.status(401).json({ error: 'Unauthorized' });

  const { messages, jsonMode } = req.body || {};
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

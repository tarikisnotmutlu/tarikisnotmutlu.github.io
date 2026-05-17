// api/auth.js
// Vercel serverless function — şifre doğrulama
// ENV: SKILL_PASSWORD (Vercel dashboard'dan set edilir)

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const correct = process.env.SKILL_PASSWORD;

  if (!correct) {
    return res.status(500).json({ error: 'SKILL_PASSWORD env var ayarlanmamış' });
  }

  if (password === correct) {
    // Set auth cookie — 30 gün geçerli
    res.setHeader('Set-Cookie', [
      `skill_auth=${process.env.AUTH_TOKEN || 'tarik_auth_2026'}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}; Path=/`
    ]);
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Yanlış şifre' });
}

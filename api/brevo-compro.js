export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = req.body?.customer?.email;
  if (!email) return res.status(400).json({ error: 'No email' });

  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      email: email,
      attributes: { COMPRO: true },
      updateEnabled: true
    })
  });

  res.status(200).json({ ok: true });
}

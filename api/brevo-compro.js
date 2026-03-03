export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') return res.status(405).end();

  // Log completo del body para debugging (desactivar en producción)
  console.log("Webhook recibido:", JSON.stringify(req.body).substring(0, 500));

  // Email a nivel raíz del pedido (siempre presente) + fallback a customer
  const email = req.body?.email || req.body?.contact_email || req.body?.customer?.email;

  if (!email) {
    console.log("No se encontró email en el payload");
    return res.status(400).json({ error: 'No email found in order payload' });
  }

  console.log("Email extraído:", email);

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
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

    const data = await response.json();
    console.log("Brevo status:", response.status);
    console.log("Brevo response:", JSON.stringify(data));

    return res.status(200).json({ ok: true, email, brevo_status: response.status, brevo: data });
  } catch (error) {
    console.error("Error llamando a Brevo:", error.message);
    return res.status(500).json({ error: 'Brevo API call failed', detail: error.message });
  }
}

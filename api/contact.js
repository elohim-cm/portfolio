import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Méthode non autorisée.',
    });
  }

  try {
    const { name, email, subject, message, source } = req.body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim();
    const cleanSubject = subject?.trim();
    const cleanMessage = message?.trim();
    const cleanSource = source?.trim() || 'Formulaire portfolio Elohim Warren';

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires.',
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        message: 'Adresse email invalide.',
      });
    }

    const htmlMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br>');

    await resend.emails.send({
      from: 'Portfolio Elohim <onboarding@resend.dev>',
      to: process.env.TO_EMAIL,
      reply_to: cleanEmail,
      subject: `Nouveau message portfolio : ${cleanSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Nouveau message depuis ton portfolio</h2>

          <p><strong>Source :</strong> ${escapeHtml(cleanSource)}</p>
          <p><strong>Nom :</strong> ${escapeHtml(cleanName)}</p>
          <p><strong>Email :</strong> ${escapeHtml(cleanEmail)}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(cleanSubject)}</p>

          <hr>

          <h3>Message :</h3>
          <p>${htmlMessage}</p>
        </div>
      `,
      text: `
Nouveau message depuis ton portfolio

Source : ${cleanSource}
Nom : ${cleanName}
Email : ${cleanEmail}
Sujet : ${cleanSubject}

Message :
${cleanMessage}
      `,
    });

    return res.status(200).json({
      message: 'Message envoyé avec succès.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur serveur lors de l’envoi du message.',
    });
  }
}
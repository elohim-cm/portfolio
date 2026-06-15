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

function buildContactEmailTemplate({
  name,
  email,
  subject,
  message,
  source,
}) {
  const currentDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Douala',
  }).format(new Date());

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nouveau message portfolio</title>
    </head>

    <body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, Helvetica, sans-serif; color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb; padding:32px 16px;">
        <tr>
        <td align="center">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb; box-shadow:0 18px 45px rgba(15,23,42,0.08);">

            <tr>
                <td style="background:linear-gradient(135deg,#111827,#312e81); padding:32px 32px 28px;">
                <div style="font-size:13px; letter-spacing:0.08em; text-transform:uppercase; color:#93c5fd; font-weight:700; margin-bottom:12px;">
                    Portfolio Contact
                </div>

                <h1 style="margin:0; color:#ffffff; font-size:26px; line-height:1.25; font-weight:800;">
                    Nouveau message depuis ton portfolio
                </h1>

                <p style="margin:14px 0 0; color:#d1d5db; font-size:15px; line-height:1.7;">
                    Un visiteur vient de soumettre le formulaire de contact de ton site portfolio.
                </p>
                </td>
            </tr>

            <tr>
                <td style="padding:24px 32px 0;">
                <div style="display:inline-block; background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; border-radius:999px; padding:8px 14px; font-size:13px; font-weight:700;">
                    Nouveau lead entrant
                </div>
                </td>
            </tr>

            <tr>
                <td style="padding:24px 32px 0;">
                <h2 style="margin:0 0 14px; font-size:18px; color:#111827;">
                    Informations du contact
                </h2>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
                    <tr>
                    <td style="padding:14px 16px; background:#f9fafb; width:130px; color:#6b7280; font-size:14px; font-weight:700;">
                        Nom
                    </td>
                    <td style="padding:14px 16px; color:#111827; font-size:14px;">
                        ${name}
                    </td>
                    </tr>

                    <tr>
                    <td style="padding:14px 16px; background:#f9fafb; color:#6b7280; font-size:14px; font-weight:700; border-top:1px solid #e5e7eb;">
                        Email
                    </td>
                    <td style="padding:14px 16px; color:#111827; font-size:14px; border-top:1px solid #e5e7eb;">
                        <a href="mailto:${email}" style="color:#4f46e5; text-decoration:none; font-weight:700;">
                        ${email}
                        </a>
                    </td>
                    </tr>

                    <tr>
                    <td style="padding:14px 16px; background:#f9fafb; color:#6b7280; font-size:14px; font-weight:700; border-top:1px solid #e5e7eb;">
                        Sujet
                    </td>
                    <td style="padding:14px 16px; color:#111827; font-size:14px; border-top:1px solid #e5e7eb;">
                        ${subject}
                    </td>
                    </tr>

                    <tr>
                    <td style="padding:14px 16px; background:#f9fafb; color:#6b7280; font-size:14px; font-weight:700; border-top:1px solid #e5e7eb;">
                        Source
                    </td>
                    <td style="padding:14px 16px; color:#111827; font-size:14px; border-top:1px solid #e5e7eb;">
                        ${source}
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <tr>
                <td style="padding:28px 32px 0;">
                <h2 style="margin:0 0 14px; font-size:18px; color:#111827;">
                    Message
                </h2>

                <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px; padding:18px 20px; color:#374151; font-size:15px; line-height:1.8;">
                    ${message}
                </div>
                </td>
            </tr>

            <tr>
                <td style="padding:30px 32px 8px;">
                <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; font-size:15px; font-weight:800; padding:14px 22px; border-radius:10px;">
                    Répondre au contact
                </a>
                </td>
            </tr>

            <tr>
                <td style="padding:18px 32px 28px;">
                <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.7;">
                    Reçu le ${currentDate}.<br>
                    Ce message a été envoyé automatiquement depuis le formulaire de contact de ton portfolio.
                </p>
                </td>
            </tr>

            <tr>
                <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 32px; text-align:center;">
                <p style="margin:0; color:#6b7280; font-size:12px; line-height:1.6;">
                    Portfolio Elohim Warren · Développeur Full-Stack<br>
                    PHP · MySQL · Vanilla JavaScript
                </p>
                </td>
            </tr>

            </table>

        </td>
        </tr>
    </table>
    </body>
    </html>
  `;
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

    const emailHtml = buildContactEmailTemplate({
        name: escapeHtml(cleanName),
        email: escapeHtml(cleanEmail),
        subject: escapeHtml(cleanSubject),
        message: escapeHtml(cleanMessage).replace(/\n/g, '<br>'),
        source: escapeHtml(cleanSource),
    });

    await resend.emails.send({
        from: 'Portfolio Elohim <onboarding@resend.dev>',
        to: process.env.CONTACT_RECEIVER_EMAIL,
        reply_to: cleanEmail,
        subject: `[Portfolio] Nouveau message de ${cleanName}`,
        html: emailHtml,
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
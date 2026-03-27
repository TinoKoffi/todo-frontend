// mailer.js

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendCompletionEmail(to, username, todoText, customMessage) {
  await resend.emails.send({
    from: "Todo App <onboarding@resend.dev>",
    to: "koffitino59@gmail.com", // Resend plan gratuit = uniquement ton email
    subject: `✅ Tâche terminée : ${todoText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; background: #1a1a2e; color: #ffffff; border-radius: 12px;">
        <h2 style="color: #7c3aed;">✅ Tâche terminée !</h2>
        <p>Bonjour <strong>${username}</strong>,</p>
        <p>Tu as marqué la tâche suivante comme terminée :</p>
        <div style="background: #2d2d44; padding: 12px; border-radius: 8px; margin: 16px 0;">
          <strong style="color: #a78bfa;">📌 ${todoText}</strong>
        </div>
        <p style="background: #2d2d44; padding: 12px; border-radius: 8px; font-style: italic; color: #c4b5fd;">
          💬 "${customMessage}"
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          Envoyé depuis ta Todo App 🚀
        </p>
      </div>
    `,
  });
}

module.exports = { sendCompletionEmail };
// mailer.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendCompletionEmail(to, username, todoText, customMessage) {
  await transporter.sendMail({
    from: `"Todo App 📝" <${process.env.GMAIL_USER}>`,
    to,
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
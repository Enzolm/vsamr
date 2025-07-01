const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configuration du transporteur email
const createTransporter = () => {
  // Configuration pour Gmail (par défaut)
  if (process.env.EMAIL_SERVICE === "gmail" || !process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Configuration pour Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === "outlook") {
    return nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Configuration SMTP personnalisée
  if (process.env.EMAIL_SERVICE === "custom") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Configuration par défaut (Gmail)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Générer un token de réinitialisation
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Envoyer un email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: "Villeneuve sur Auvers",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Réinitialisation de votre mot de passe - Villeneuve sur Auvers",
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(178deg, rgba(108, 154, 61, 1) 0%, rgba(144, 178, 111, 1) 50%, rgba(176, 201, 152, 1) 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 15px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Réinitialisation de mot de passe</h1>
          <img src="../assets/logoclear.png" alt="Logo Villeneuve sur Auvers" style="width: 100px;">
        </div>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Bonjour,
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Villeneuve sur Auvers.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
           style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; transition: background 0.3s;">
          Réinitialiser mon mot de passe
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
          <br>
          <span style="word-break: break-all;">${resetUrl}</span>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          <br>
          © ${new Date().getFullYear()} Villeneuve sur Auvers - Tous droits réservés
        </p>
        </div>
      </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

// Tester la configuration email
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  generateResetToken,
  testEmailConnection,
};

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
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Configuration pour Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === "outlook") {
    return nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
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
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Configuration par défaut (Gmail)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
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

// Envoyer un email de confirmation de réservation au client
const sendReservationConfirmationEmail = async (reservationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservationData.email,
      subject:
        "Confirmation de votre demande de réservation - Salle Polyvalente",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2a5b32; text-align: center; margin-bottom: 30px;">
            Demande de réservation reçue
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Bonjour ${reservationData.prenom} ${reservationData.nom},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Nous avons bien reçu votre demande de réservation pour la salle polyvalente. 
            Voici un récapitulatif de votre demande :
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2a5b32;">
            <h3 style="color: #2a5b32; margin-top: 0;">Détails de la réservation</h3>
            <p><strong>Date :</strong> ${new Date(
              reservationData.dateReservation
            ).toLocaleDateString("fr-FR")}</p>
            <p><strong>Horaire :</strong> ${reservationData.heureDebut} - ${
        reservationData.heureFin
      }</p>
            <p><strong>Type d'événement :</strong> ${
              reservationData.typeReservation
            }</p>
            <p><strong>Nombre de personnes :</strong> ${
              reservationData.nombrePersonnes
            }</p>
            <p><strong>Description :</strong> ${reservationData.description}</p>
            ${
              reservationData.besoinsSpecifiques
                ? `<p><strong>Besoins spécifiques :</strong> ${reservationData.besoinsSpecifiques}</p>`
                : ""
            }
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Votre demande est actuellement <strong style="color: #f39c12;">en attente de validation</strong>.
            Nous vous contacterons dans les plus brefs délais pour confirmer votre réservation.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Si vous avez des questions, n'hésitez pas à nous contacter.
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
    console.log("Reservation confirmation email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reservation confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Envoyer un email de notification à l'administrateur
const sendReservationNotificationEmail = async (reservationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: "Nouvelle demande de réservation - Salle Polyvalente",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2a5b32; text-align: center; margin-bottom: 30px;">
            Nouvelle demande de réservation
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Une nouvelle demande de réservation a été reçue pour la salle polyvalente.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2a5b32;">
            <h3 style="color: #2a5b32; margin-top: 0;">Informations du demandeur</h3>
            <p><strong>Nom :</strong> ${reservationData.prenom} ${
        reservationData.nom
      }</p>
            <p><strong>Email :</strong> ${reservationData.email}</p>
            <p><strong>Téléphone :</strong> ${reservationData.telephone}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
            <h3 style="color: #f39c12; margin-top: 0;">Détails de la réservation</h3>
            <p><strong>Date :</strong> ${new Date(
              reservationData.dateReservation
            ).toLocaleDateString("fr-FR")}</p>
            <p><strong>Horaire :</strong> ${reservationData.heureDebut} - ${
        reservationData.heureFin
      }</p>
            <p><strong>Type d'événement :</strong> ${
              reservationData.typeReservation
            }</p>
            <p><strong>Nombre de personnes :</strong> ${
              reservationData.nombrePersonnes
            }</p>
            <p><strong>Description :</strong> ${reservationData.description}</p>
            ${
              reservationData.besoinsSpecifiques
                ? `<p><strong>Besoins spécifiques :</strong> ${reservationData.besoinsSpecifiques}</p>`
                : ""
            }
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Veuillez vous connecter à l'interface d'administration pour valider ou refuser cette demande.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Cet email a été envoyé automatiquement.
            <br>
            © ${new Date().getFullYear()} Villeneuve sur Auvers - Tous droits réservés
          </p>
        </div>
      </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Reservation notification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reservation notification email:", error);
    return { success: false, error: error.message };
  }
};

// Envoyer un email de validation de réservation
const sendReservationValidationEmail = async (reservationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservationData.email,
      subject: "Réservation validée - Salle Polyvalente",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2a5b32; text-align: center; margin-bottom: 30px;">
            ✅ Réservation validée
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Bonjour ${reservationData.prenom} ${reservationData.nom},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Bonne nouvelle ! Votre réservation pour la salle polyvalente a été <strong style="color: #2a5b32;">validée</strong>.
          </p>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2a5b32;">
            <h3 style="color: #2a5b32; margin-top: 0;">Détails de votre réservation</h3>
            <p><strong>Date :</strong> ${new Date(
              reservationData.dateReservation
            ).toLocaleDateString("fr-FR")}</p>
            <p><strong>Horaire :</strong> ${reservationData.heureDebut} - ${
        reservationData.heureFin
      }</p>
            <p><strong>Type d'événement :</strong> ${
              reservationData.typeReservation
            }</p>
            <p><strong>Nombre de personnes :</strong> ${
              reservationData.nombrePersonnes
            }</p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Nous vous contacterons prochainement pour finaliser les détails pratiques et le paiement.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Merci de votre confiance !
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
    console.log("Reservation validation email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reservation validation email:", error);
    return { success: false, error: error.message };
  }
};

// Envoyer un email d'annulation de réservation à l'utilisateur
const sendReservationCancellationEmail = async (reservationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservationData.email,
      subject: "Annulation de votre réservation - Salle Polyvalente",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #d32f2f; text-align: center; margin-bottom: 30px;">
            Réservation annulée
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Bonjour ${reservationData.prenom} ${reservationData.nom},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Nous regrettons de vous informer que votre réservation pour la salle polyvalente a été annulée.
          </p>
          
          <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h3 style="color: #d32f2f; margin-top: 0;">Détails de la réservation annulée</h3>
            <p><strong>Date :</strong> ${new Date(
              reservationData.dateReservation
            ).toLocaleDateString("fr-FR")}</p>
            <p><strong>Horaire :</strong> ${reservationData.heureDebut} - ${
        reservationData.heureFin
      }</p>
            <p><strong>Type d'événement :</strong> ${
              reservationData.typeReservation
            }</p>
            <p><strong>Nombre de personnes :</strong> ${
              reservationData.nombrePersonnes
            }</p>
          </div>
          
          ${
            reservationData.commentaire_admin
              ? `
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f57c00;">
            <h3 style="color: #f57c00; margin-top: 0;">Motif de l'annulation</h3>
            <p style="color: #333; font-style: italic;">${reservationData.commentaire_admin}</p>
          </div>
          `
              : ""
          }
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #666; font-size: 14px;">
              Cordialement,<br>
              L'équipe de la mairie de Villeneuve-sur-Auvers
            </p>
          </div>
        </div>
      </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Reservation cancellation email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reservation cancellation email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  generateResetToken,
  testEmailConnection,
  sendReservationConfirmationEmail,
  sendReservationNotificationEmail,
  sendReservationValidationEmail,
  sendReservationCancellationEmail,
};

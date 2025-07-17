const db = require("../../DataBase/db");
const {
  sendReservationConfirmationEmail,
  sendReservationNotificationEmail,
  sendReservationValidationEmail,
  sendReservationCancellationEmail,
} = require("../../services/emailService");

// Créer une nouvelle réservation
const createReservation = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      dateReservation,
      heureDebut,
      heureFin,
      typeReservation,
      nombrePersonnes,
      description,
      besoinsSpecifiques,
      statut = "en_attente",
    } = req.body;

    // Validation des données requises
    if (
      !nom ||
      !prenom ||
      !email ||
      !telephone ||
      !dateReservation ||
      !heureDebut ||
      !heureFin ||
      !typeReservation ||
      !nombrePersonnes ||
      !description
    ) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être remplis" });
    }

    // Vérifier les conflits d'horaires
    try {
      const conflitQuery = `
        SELECT * FROM reservations_salle 
        WHERE dateReservation = ? 
        AND statut NOT IN ('annulee', 'passee')
        AND NOT (heureFin <= ? OR heureDebut >= ?)
      `;

      const conflits = await db.query(conflitQuery, [
        dateReservation,
        heureDebut,
        heureFin,
      ]);

      // Les résultats sont dans le premier élément du tableau retourné
      const conflitsData = conflits[0];

      if (conflitsData && conflitsData.length > 0) {
        return res
          .status(409)
          .json({ error: "Ce créneau horaire est déjà réservé" });
      }
    } catch (conflitError) {
      console.error(
        "Erreur lors de la vérification des conflits:",
        conflitError
      );
      // Si erreur de table, on continue sans bloquer pour permettre la création
    }

    // Insérer la nouvelle réservation
    const insertQuery = `
      INSERT INTO reservations_salle (
        nom, prenom, email, telephone, dateReservation, heureDebut, heureFin,
        typeReservation, nombrePersonnes, description, besoinsSpecifiques, statut
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(insertQuery, [
      nom,
      prenom,
      email,
      telephone,
      dateReservation,
      heureDebut,
      heureFin,
      typeReservation,
      nombrePersonnes,
      description,
      besoinsSpecifiques,
      statut,
    ]);

    // Pour MySQL2, l'insertId est dans le premier élément
    const insertResult = result[0];
    const insertId = insertResult.insertId;

    // Récupérer la réservation créée
    const newReservationResult = await db.query(
      "SELECT * FROM reservations_salle WHERE id = ?",
      [insertId]
    );

    // Les données sont dans le premier élément
    const newReservation = newReservationResult[0][0];

    // Envoyer les emails
    try {
      await sendReservationConfirmationEmail(newReservation);
      await sendReservationNotificationEmail(newReservation);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi des emails:", emailError);
      // Ne pas faire échouer la création de la réservation si les emails échouent
    }

    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Récupérer toutes les réservations
const getAllReservations = async (req, res) => {
  try {
    const query = `
      SELECT * FROM reservations_salle 
      ORDER BY dateReservation DESC, heureDebut ASC
    `;

    const reservations = await db.query(query);
    res.json(reservations[0]); // Les données sont dans le premier élément
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Récupérer une réservation par ID
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM reservations_salle WHERE id = ?";
    const reservations = await db.query(query, [id]);
    const reservationData = reservations[0]; // Les données sont dans le premier élément

    if (reservationData.length === 0) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    res.json(reservationData[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Mettre à jour le statut d'une réservation
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, commentaire_admin } = req.body;

    // Vérifier que le statut est valide
    const validStatuses = ["en_attente", "validee", "annulee", "passee"];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    // Pour l'annulation, le commentaire admin est obligatoire
    if (
      statut === "annulee" &&
      (!commentaire_admin || commentaire_admin.trim() === "")
    ) {
      return res.status(400).json({
        error:
          "Un commentaire expliquant le motif d'annulation est obligatoire",
      });
    }

    // Préparer la requête de mise à jour
    let query, params;
    if (statut === "annulee") {
      query =
        "UPDATE reservations_salle SET statut = ?, commentaire_admin = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
      params = [statut, commentaire_admin, id];
    } else {
      query =
        "UPDATE reservations_salle SET statut = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
      params = [statut, id];
    }

    const result = await db.query(query, params);
    const updateResult = result[0]; // Les données sont dans le premier élément

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Récupérer la réservation mise à jour
    const updatedReservationResult = await db.query(
      "SELECT * FROM reservations_salle WHERE id = ?",
      [id]
    );
    const updatedReservation = updatedReservationResult[0][0]; // Les données sont dans le premier élément

    // Envoyer un email de validation si le statut est "validee"
    if (statut === "validee") {
      try {
        await sendReservationValidationEmail(updatedReservation);
      } catch (emailError) {
        console.error(
          "Erreur lors de l'envoi de l'email de validation:",
          emailError
        );
        // Ne pas faire échouer la mise à jour si l'email échoue
      }
    }

    // Envoyer un email d'annulation si le statut est "annulee"
    if (statut === "annulee") {
      try {
        await sendReservationCancellationEmail(updatedReservation);
      } catch (emailError) {
        console.error(
          "Erreur lors de l'envoi de l'email d'annulation:",
          emailError
        );
        // Ne pas faire échouer la mise à jour si l'email échoue
      }
    }

    res.json({
      message: "Statut de la réservation mis à jour avec succès",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Supprimer une réservation
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM reservations_salle WHERE id = ?";
    const result = await db.query(query, [id]);
    const deleteResult = result[0]; // Les données sont dans le premier élément

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    res.json({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Récupérer les réservations par statut
const getReservationsByStatus = async (req, res) => {
  try {
    const { statut } = req.params;
    const validStatuses = ["en_attente", "validee", "annulee", "passee"];

    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const query = `
      SELECT * FROM reservations_salle 
      WHERE statut = ? 
      ORDER BY dateReservation DESC, heureDebut ASC
    `;

    const reservations = await db.query(query, [statut]);
    res.json(reservations[0]); // Les données sont dans le premier élément
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des réservations par statut:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Récupérer les réservations pour une date donnée
const getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const query = `
      SELECT * FROM reservations_salle 
      WHERE dateReservation = ? AND statut != 'annulee'
      ORDER BY heureDebut ASC
    `;

    const reservations = await db.query(query, [date]);
    res.json(reservations[0]); // Les données sont dans le premier élément
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des réservations par date:",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getReservationsByStatus,
  getReservationsByDate,
};

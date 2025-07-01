const pool = require("../../DataBase/db");
const path = require("path");
const fs = require("fs");

const createAssociation = async (req, res) => {
  console.log("Creating association with data:", req.body);
  console.log("Uploaded file:", req.file);

  const { nom, description, email, telephone, facebook, instagram, whatsapp, tiktok, youtube, siteExterne } = req.body;

  // Validation des champs requis
  if (!nom || !description || !email) {
    // Supprimer le fichier uploadé si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: "Nom, description et email sont requis" });
  }

  try {
    // Vérifier si l'association existe déjà
    const [existing] = await pool.query("SELECT id FROM associations WHERE nom = ?", [nom]);
    if (existing.length > 0) {
      // Supprimer le fichier uploadé si erreur
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(409).json({ error: "Une association avec ce nom existe déjà" });
    }

    // Chemin relatif du logo (pour la BDD)
    let logoPath = null;
    if (req.file) {
      logoPath = `/uploads/associations/${req.file.filename}`;
    }

    // Insérer en base de données
    const [result] = await pool.query(
      `
      INSERT INTO associations 
      (nom, description, email, logo_path, telephone, facebook, instagram, whatsapp, tiktok, youtube, site_externe) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [nom, description, email, logoPath, telephone || null, facebook || null, instagram || null, whatsapp || null, tiktok || null, youtube || null, siteExterne || null]
    );

    // Récupérer l'association créée
    const [association] = await pool.query("SELECT * FROM associations WHERE id = ?", [result.insertId]);

    res.status(201).json({
      message: "Association créée avec succès",
      association: association[0],
    });
  } catch (error) {
    console.error("Error creating association:", error);

    // Supprimer le fichier uploadé si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getAssociations = async (req, res) => {
  try {
    const [associations] = await pool.query("SELECT * FROM associations ORDER BY created_at DESC");

    // Ajouter l'URL complète pour les logos
    const associationsWithLogos = associations.map((assoc) => ({
      ...assoc,
      logo_url: assoc.logo_path ? `${req.protocol}://${req.get("host")}${assoc.logo_path}` : null,
    }));

    res.status(200).json(associationsWithLogos);
  } catch (error) {
    console.error("Error fetching associations:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const deleteAssociation = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer l'association pour supprimer le logo
    const [association] = await pool.query("SELECT logo_path FROM associations WHERE id = ?", [id]);

    if (association.length === 0) {
      return res.status(404).json({ error: "Association non trouvée" });
    }

    // Supprimer le fichier logo s'il existe
    if (association[0].logo_path) {
      const logoFullPath = path.join(__dirname, "../../", association[0].logo_path);
      if (fs.existsSync(logoFullPath)) {
        fs.unlinkSync(logoFullPath);
      }
    }

    // Supprimer l'association de la BDD
    await pool.query("DELETE FROM associations WHERE id = ?", [id]);

    res.status(200).json({ message: "Association supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting association:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Mettre à jour une association (avec upload de logo optionnel)
const updateAssociation = async (req, res) => {
  const { id } = req.params;
  const { nom, description, email, telephone, facebook, instagram, whatsapp, tiktok, youtube, siteExterne } = req.body;

  console.log("Updating association with ID:", id);
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  // Validation des champs requis
  if (!nom || !description || !email) {
    // Supprimer le fichier uploadé si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: "Nom, description et email sont requis" });
  }

  try {
    // Vérifier si l'association existe
    const [existingAssoc] = await pool.query("SELECT * FROM associations WHERE id = ?", [id]);
    if (existingAssoc.length === 0) {
      // Supprimer le fichier uploadé si erreur
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "Association non trouvée" });
    }

    // Vérifier si une autre association a déjà ce nom
    const [duplicateName] = await pool.query("SELECT id FROM associations WHERE nom = ? AND id != ?", [nom, id]);
    if (duplicateName.length > 0) {
      // Supprimer le fichier uploadé si erreur
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(409).json({ error: "Une autre association avec ce nom existe déjà" });
    }

    let logoPath = existingAssoc[0].logo_path; // Garder l'ancien logo par défaut

    // Si un nouveau logo est uploadé
    if (req.file) {
      // Supprimer l'ancien logo s'il existe
      if (existingAssoc[0].logo_path) {
        const oldLogoPath = path.join(__dirname, "../../", existingAssoc[0].logo_path);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      // Utiliser le nouveau logo
      logoPath = `/uploads/associations/${req.file.filename}`;
    }

    // Mettre à jour en base de données
    await pool.query(
      `
      UPDATE associations 
      SET nom = ?, description = ?, email = ?, logo_path = ?, telephone = ?, 
          facebook = ?, instagram = ?, whatsapp = ?, tiktok = ?, youtube = ?, site_externe = ?
      WHERE id = ?
      `,
      [nom, description, email, logoPath, telephone || null, facebook || null, instagram || null, whatsapp || null, tiktok || null, youtube || null, siteExterne || null, id]
    );

    // Récupérer l'association mise à jour
    const [updatedAssoc] = await pool.query("SELECT * FROM associations WHERE id = ?", [id]);

    // Ajouter l'URL complète pour le logo
    const associationWithLogo = {
      ...updatedAssoc[0],
      logo_url: updatedAssoc[0].logo_path ? `${req.protocol}://${req.get("host")}${updatedAssoc[0].logo_path}` : null,
    };

    res.status(200).json({
      message: "Association mise à jour avec succès",
      association: associationWithLogo,
    });
  } catch (error) {
    console.error("Error updating association:", error);

    // Supprimer le fichier uploadé si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getAssociationById = async (req, res) => {
  const { id } = req.params;

  try {
    const [association] = await pool.query("SELECT * FROM associations WHERE id = ?", [id]);

    if (association.length === 0) {
      return res.status(404).json({ error: "Association non trouvée" });
    }

    // Ajouter l'URL complète pour le logo
    const associationWithLogo = {
      ...association[0],
      logo_url: association[0].logo_path ? `${req.protocol}://${req.get("host")}${association[0].logo_path}` : null,
    };

    res.status(200).json(associationWithLogo);
  } catch (error) {
    console.error("Error fetching association by ID:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  createAssociation,
  getAssociations,
  deleteAssociation,
  updateAssociation,
  getAssociationById,
};

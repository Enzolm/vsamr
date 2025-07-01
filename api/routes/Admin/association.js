const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadsMulter");
const { authenticateToken, requireAdmin } = require("../../middleware/auth");
const AssociationController = require("../../Controllers/Association/AssosController");

// Créer une association (avec upload de logo)
router.post(
  "/create",
  authenticateToken,
  upload.single("logo"), // 'logo' correspond au nom du champ dans FormData
  AssociationController.createAssociation
);

// Mettre à jour une association (avec upload de logo optionnel)
router.put(
  "/:id",
  authenticateToken,
  upload.single("logo"), // 'logo' correspond au nom du champ dans FormData
  AssociationController.updateAssociation
);

// Récupérer toutes les associations
router.get("/", AssociationController.getAssociations);

// Récupérer une association par ID
router.get("/:id", AssociationController.getAssociationById);

// Supprimer une association (admin seulement)
router.delete("/:id", authenticateToken, requireAdmin, AssociationController.deleteAssociation);

module.exports = router;

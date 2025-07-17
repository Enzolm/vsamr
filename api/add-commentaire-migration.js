const db = require("./DataBase/db");

async function addCommentaireAdmin() {
  try {
    console.log("🔄 Ajout du champ commentaire_admin...");

    await db.query(
      "ALTER TABLE reservations_salle ADD COLUMN commentaire_admin TEXT NULL"
    );

    console.log("✅ Champ commentaire_admin ajouté avec succès !");

    // Vérifier que le champ a été ajouté
    const result = await db.query("DESCRIBE reservations_salle");
    const columns = result[0];

    const commentaireColumn = columns.find(
      (col) => col.Field === "commentaire_admin"
    );
    if (commentaireColumn) {
      console.log("📋 Champ commentaire_admin trouvé dans la table");
    } else {
      console.log("❌ Champ commentaire_admin non trouvé");
    }
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("⚠️ Le champ commentaire_admin existe déjà");
    } else {
      console.error("❌ Erreur lors de l'ajout du champ:", error);
    }
  }

  process.exit(0);
}

addCommentaireAdmin();

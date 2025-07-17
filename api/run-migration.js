const fs = require("fs");
const db = require("./DataBase/db.js");

async function runMigration() {
  try {
    console.log("🔄 Exécution de la migration...");

    // Lire le fichier SQL
    const sql = fs.readFileSync(
      "./migrations/create_reservations_salle.sql",
      "utf8"
    );

    // Exécuter la migration
    await db.query(sql);

    console.log("✅ Migration exécutée avec succès!");
    console.log("📋 Table reservations_salle créée");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error.message);
  }

  process.exit(0);
}

runMigration();

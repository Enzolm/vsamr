const db = require("./DataBase/db.js");

async function testTable() {
  try {
    // Tester si la table existe
    const result = await db.query('SHOW TABLES LIKE "reservations_salle"');

    if (result.length > 0) {
      console.log("✅ Table reservations_salle trouvée");

      // Tester la structure
      const structure = await db.query("DESCRIBE reservations_salle");
      console.log("📋 Structure de la table:");
      structure.forEach((col) => {
        console.log(`  - ${col.Field || col.field}: ${col.Type || col.type}`);
      });

      // Compter les enregistrements
      const count = await db.query(
        "SELECT COUNT(*) as total FROM reservations_salle"
      );
      console.log(
        `📊 Nombre d'enregistrements: ${count[0].total || count[0].COUNT || 0}`
      );
    } else {
      console.log("❌ Table reservations_salle non trouvée");
      console.log("👉 Exécutez: node run-migration.js");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }

  process.exit(0);
}

testTable();

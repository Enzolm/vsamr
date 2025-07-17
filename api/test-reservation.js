const db = require("./DataBase/db");

async function testReservation() {
  console.log("🧪 Test de création de réservation...");

  // Données de test
  const testData = {
    nom: "Test",
    prenom: "User",
    email: "test@example.com",
    telephone: "0123456789",
    dateReservation: "2025-07-20",
    heureDebut: "14:00",
    heureFin: "16:00",
    typeReservation: "Reunion",
    nombrePersonnes: 10,
    description: "Test de réservation",
    besoinsSpecifiques: "Aucun",
  };

  try {
    console.log("📋 Données de test:", testData);

    // Test de la vérification des conflits
    console.log("\n🔍 Vérification des conflits...");
    const conflitQuery = `
      SELECT * FROM reservations_salle 
      WHERE dateReservation = ? 
      AND statut NOT IN ('annulee', 'passee')
      AND NOT (heureFin <= ? OR heureDebut >= ?)
    `;

    const conflits = await db.query(conflitQuery, [
      testData.dateReservation,
      testData.heureDebut,
      testData.heureFin,
    ]);

    // Les résultats sont dans le premier élément du tableau retourné
    const conflitsData = conflits[0];
    console.log(
      "📊 Résultat de la vérification:",
      conflitsData ? conflitsData.length : 0,
      "conflits trouvés"
    );

    if (conflitsData && conflitsData.length > 0) {
      console.log("❌ Conflits détectés:", conflitsData);
    } else {
      console.log("✅ Aucun conflit détecté");

      // Test de création
      console.log("\n💾 Test de création...");
      const insertQuery = `
        INSERT INTO reservations_salle (
          nom, prenom, email, telephone, dateReservation, 
          heureDebut, heureFin, typeReservation, nombrePersonnes, 
          description, besoinsSpecifiques, statut
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(insertQuery, [
        testData.nom,
        testData.prenom,
        testData.email,
        testData.telephone,
        testData.dateReservation,
        testData.heureDebut,
        testData.heureFin,
        testData.typeReservation,
        testData.nombrePersonnes,
        testData.description,
        testData.besoinsSpecifiques,
        "en_attente",
      ]);

      console.log("🔍 Résultat complet de l'insertion:", result);

      // Pour MySQL2, l'insertId est dans le premier élément
      const insertResult = result[0];
      const insertId = insertResult.insertId;

      console.log("✅ Réservation créée avec succès! ID:", insertId);

      // Vérifier que la réservation a été créée
      const verifyQuery = "SELECT * FROM reservations_salle WHERE id = ?";
      const verifyResult = await db.query(verifyQuery, [insertId]);
      const created = verifyResult[0]; // Les données sont dans le premier élément
      console.log("📋 Réservation créée:", created[0]);
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }

  process.exit(0);
}

testReservation();

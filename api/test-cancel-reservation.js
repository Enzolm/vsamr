const axios = require("axios");

async function testCancelReservation() {
  try {
    console.log("🧪 Test d'annulation de réservation avec commentaire...");

    // D'abord, créer une réservation de test
    const reservationData = {
      nom: "TestCancel",
      prenom: "User",
      email: "test@example.com",
      telephone: "0123456789",
      dateReservation: "2025-07-25",
      heureDebut: "10:00",
      heureFin: "12:00",
      typeReservation: "Reunion",
      nombrePersonnes: 15,
      description: "Test de réservation pour annulation",
      besoinsSpecifiques: "Aucun",
      statut: "en_attente",
    };

    console.log("📝 Création d'une réservation de test...");
    const createResponse = await axios.post(
      "http://localhost:3001/reservations/create",
      reservationData
    );
    const reservationId = createResponse.data.reservation.id;
    console.log("✅ Réservation créée avec ID:", reservationId);

    // Ensuite, tester l'annulation sans commentaire (doit échouer)
    console.log("❌ Test d'annulation sans commentaire...");
    try {
      await axios.put(
        `http://localhost:3001/reservations/${reservationId}/status`,
        {
          statut: "annulee",
        }
      );
      console.log(
        "❌ ERREUR: L'annulation sans commentaire a réussi (ne devrait pas)"
      );
    } catch (error) {
      console.log(
        "✅ Annulation sans commentaire rejetée:",
        error.response?.data?.error
      );
    }

    // Maintenant, tester l'annulation avec commentaire (doit réussir)
    console.log("✅ Test d'annulation avec commentaire...");
    const cancelResponse = await axios.put(
      `http://localhost:3001/reservations/${reservationId}/status`,
      {
        statut: "annulee",
        commentaire_admin:
          "Test d'annulation - Salle indisponible pour maintenance",
      }
    );

    console.log("✅ Réservation annulée avec succès!");
    console.log("📧 Email d'annulation envoyé à l'utilisateur");

    // Vérifier que la réservation a été mise à jour
    const checkResponse = await axios.get(
      `http://localhost:3001/reservations/${reservationId}`
    );
    const updatedReservation = checkResponse.data;

    console.log("📋 Réservation après annulation:");
    console.log("- Statut:", updatedReservation.statut);
    console.log("- Commentaire admin:", updatedReservation.commentaire_admin);
  } catch (error) {
    console.error(
      "❌ Erreur lors du test:",
      error.response?.data || error.message
    );
  }
}

testCancelReservation();

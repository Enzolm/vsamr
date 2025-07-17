// Test simple pour vérifier les imports
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getReservationsByStatus,
  getReservationsByDate,
} = require("../../Controllers/Reservation/ReservationController");

console.log("Testing controller imports:");
console.log("createReservation:", typeof createReservation);
console.log("getAllReservations:", typeof getAllReservations);
console.log("getReservationById:", typeof getReservationById);
console.log("updateReservationStatus:", typeof updateReservationStatus);
console.log("deleteReservation:", typeof deleteReservation);
console.log("getReservationsByStatus:", typeof getReservationsByStatus);
console.log("getReservationsByDate:", typeof getReservationsByDate);

// Si toutes les fonctions sont de type "function", l'import est correct
module.exports = "test completed";

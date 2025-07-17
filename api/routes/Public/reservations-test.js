const express = require("express");
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getReservationsByStatus,
  getReservationsByDate,
} = require("../../Controllers/Reservation/ReservationController");

// Routes publiques
router.post("/create", createReservation);
router.get("/date/:date", getReservationsByDate);

// Routes protégées (temporairement sans auth pour test)
router.get("/status/:statut", getAllReservations); // Test temporaire
router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.put("/:id/status", updateReservationStatus);
router.delete("/:id", deleteReservation);

module.exports = router;

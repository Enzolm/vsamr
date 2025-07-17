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

const { authenticateToken } = require("../../middleware/auth");

// Routes publiques
router.post("/create", createReservation);
router.get("/date/:date", getReservationsByDate);

// Routes protégées (admin seulement)
router.get("/status/:statut", authenticateToken, getReservationsByStatus);
router.get("/", authenticateToken, getAllReservations);
router.get("/:id", authenticateToken, getReservationById);
router.put("/:id/status", authenticateToken, updateReservationStatus);
router.delete("/:id", authenticateToken, deleteReservation);

module.exports = router;

const express = require("express");
const cors = require("cors");
const pool = require("./DataBase/db.js");
const router = require("./routes/User/utilisateur.js");
const { testEmailConnection } = require("./services/emailService.js");
const path = require("path");
require("dotenv").config();

const app = express();

// Configuration CORS pour permettre les requêtes depuis le frontend
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Middleware pour parser le JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données de formulaire

app.use("/utilisateur", router);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const associationRoutes = require("./routes/Admin/association.js");
app.use("/associations", associationRoutes);

// Routes pour les réservations de salle
const reservationRoutes = require("./routes/Public/reservations.js");
app.use("/reservations", reservationRoutes);

const PORT = process.env.API_PORT;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test de la configuration email au démarrage
  console.log("Testing email configuration...");
  await testEmailConnection();
});

const express = require("express");
const cors = require("cors");
const pool = require("./DataBase/db.js");
const router = require("./routes/User/utilisateur.js");
const { testEmailConnection } = require("./services/emailService.js");
require("dotenv").config();

const app = express();

// Configuration CORS pour permettre les requêtes depuis le frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Middleware pour parser le JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données de formulaire

app.use("/utilisateur", router);

const PORT = process.env.API_PORT;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test de la configuration email au démarrage
  console.log("Testing email configuration...");
  await testEmailConnection();
});

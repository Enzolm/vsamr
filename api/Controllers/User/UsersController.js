const { Router } = require("express");
const pool = require("../../DataBase/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail, generateResetToken } = require("../../services/emailService.js");

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Users");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  // Check if email already exists
  const { lastName, firstName, email, password } = req.body;
  const [existingUser] = await pool.query("SELECT id FROM Users WHERE email = ?", [email]);
  if (existingUser.length > 0) {
    return res.status(409).json({ error: "L'email existe déjà" });
  }
  console.log("Creating user with data:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO Users (fullname, lastname, email, password) VALUES (?, ?, ?, ?)", [firstName, lastName, email, hashedPassword]);

    // Connecter automatiquement l'utilisateur après l'inscription
    const [rows] = await pool.query("SELECT * FROM Users WHERE id = ?", [result.insertId]);
    const user = rows[0];

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Envoyer la réponse avec les données utilisateur et token
    res.status(201).json({
      message: "User created and logged in successfully",
      user: { id: user.id, email: user.email, fullname: user.fullname },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  console.log("Login attempt with data:", req.body);
  const { email, password, rememberMe } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    let expiresIn;
    if (rememberMe) {
      expiresIn = "7d"; // 7 days for remember me
    } else {
      expiresIn = "24h"; // 24 hours for normal login
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, fullname: user.fullname },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Demande de réinitialisation de mot de passe
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "L'email est requis" });
  }

  try {
    // Vérifier si l'utilisateur existe
    const [users] = await pool.query("SELECT id, email FROM Users WHERE email = ?", [email]);

    if (users.length === 0) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    const user = users[0];

    // Générer un token de réinitialisation
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Supprimer les anciens tokens pour cet utilisateur
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [user.id]);

    // Insérer le nouveau token
    await pool.query("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, resetToken, expiresAt]);

    // Envoyer l'email de réinitialisation
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (emailResult.success) {
      res.status(200).json({ message: "Un email de réinitialisation a été envoyé à votre adresse." });
    } else {
      console.error("Failed to send email:", emailResult.error);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
    }
  } catch (error) {
    console.error("Error in password reset request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Réinitialiser le mot de passe avec le token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token et nouveau mot de passe requis" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  try {
    // Vérifier le token
    const [tokens] = await pool.query("SELECT user_id, expires_at, used FROM password_reset_tokens WHERE token = ?", [token]);

    if (tokens.length === 0) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    const tokenData = tokens[0];

    // Vérifier si le token a expiré
    if (new Date() > new Date(tokenData.expires_at)) {
      return res.status(400).json({ error: "Token expiré" });
    }

    // Vérifier si le token a déjà été utilisé
    if (tokenData.used) {
      return res.status(400).json({ error: "Token déjà utilisé" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await pool.query("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, tokenData.user_id]);

    // Marquer le token comme utilisé
    await pool.query("UPDATE password_reset_tokens SET used = TRUE WHERE token = ?", [token]);

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou format invalide" });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const userId = decoded.userId;
    // Si on arrive ici, le token est valide (grâce au middleware authenticateToken)
    console.log("Verifying token for user ID:", userId);
    const [rows] = await pool.query("SELECT id, email, fullname, admin, valideaccount FROM Users WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      valid: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  requestPasswordReset,
  verifyToken,
  resetPassword,
};

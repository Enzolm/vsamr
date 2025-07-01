const jwt = require("jsonwebtoken");
const pool = require("../DataBase/db.js");

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token d'accès requis" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer les informations utilisateur depuis la BDD (statut admin inclus)
    const [users] = await pool.query("SELECT id, email, fullname, lastname, admin FROM Users WHERE id = ?", [decoded.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Attacher les informations utilisateur à la requête
    req.user = users[0];
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Token invalide" });
  }
};

// Middleware pour vérifier les droits admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  if (!req.user.admin) {
    return res.status(403).json({ error: "Droits administrateur requis" });
  }

  next();
};

// Middleware optionnel : vérifier si l'utilisateur est le propriétaire ou admin
const requireOwnershipOrAdmin = (userIdParam = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    const targetUserId = parseInt(req.params[userIdParam]);
    const currentUserId = req.user.id;
    const isAdmin = req.user.admin;

    if (currentUserId === targetUserId || isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
};

-- Migration pour créer la table des réservations de salle
CREATE TABLE IF NOT EXISTS reservations_salle (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  dateReservation DATE NOT NULL,
  heureDebut TIME NOT NULL,
  heureFin TIME NOT NULL,
  typeReservation VARCHAR(100) NOT NULL,
  nombrePersonnes INT NOT NULL,
  description TEXT NOT NULL,
  besoinsSpecifiques TEXT,
  statut ENUM('en_attente', 'validee', 'annulee', 'passee') DEFAULT 'en_attente',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Index pour améliorer les performances
  INDEX idx_date_reservation (dateReservation),
  INDEX idx_statut (statut),
  INDEX idx_email (email),
  INDEX idx_horaires (dateReservation, heureDebut, heureFin)
);

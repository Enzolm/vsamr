-- Migration pour créer la table des réservations de salle
CREATE TABLE IF NOT EXISTS reservations_salle (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  date_reservation DATE NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  type_reservation ENUM('mariage', 'anniversaire', 'reunion', 'formation', 'spectacle', 'autre') NOT NULL,
  nombre_personnes INT NOT NULL,
  description TEXT NOT NULL,
  besoins_specifiques TEXT,
  statut ENUM('en_attente', 'confirmee', 'refusee') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Index pour améliorer les performances
  INDEX idx_date_reservation (date_reservation),
  INDEX idx_statut (statut),
  INDEX idx_email (email),
  INDEX idx_horaires (date_reservation, heure_debut, heure_fin)
);

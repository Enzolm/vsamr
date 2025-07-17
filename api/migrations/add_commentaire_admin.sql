-- Ajouter un champ pour les commentaires d'admin lors d'annulation
ALTER TABLE reservations_salle 
ADD COLUMN commentaire_admin TEXT NULL;

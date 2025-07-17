// Types pour les réservations de salle
export interface ReservationSalle {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  typeReservation: string;
  nombrePersonnes: number;
  description: string;
  besoinsSpecifiques?: string;
  statut: "en_attente" | "validee" | "annulee" | "passee";
  createdAt?: string;
  updatedAt?: string;
}

export interface DisponibiliteSalle {
  date: string;
  disponible: boolean;
  reservations: {
    heureDebut: string;
    heureFin: string;
    type: string;
    couleur: string;
  }[];
}

export interface FormulaireReservation {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  typeReservation: string;
  nombrePersonnes: number;
  description: string;
  besoinsSpecifiques?: string;
}

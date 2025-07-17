export const config = {
  // API Configuration
  api: {
    baseUrl: "http://localhost:3001",
    timeout: 10000,
  },
};

// Couleurs avec contraste amélioré
export const colors = {
  // Couleurs du logo
  logo: {
    blue: "#081d35",
    sky: "#4a9de0",
    green: "#2a5b32",
    lightgreen: "#65a051",
    beige: "#f7f0d8",
    sun: "#e6a726",
  },
  // Couleurs Canvas
  canva: {
    white: "#ffffff",
    green: "#0d2b2d",
    lightgreen: "#7a9034",
    darkblue: "#041420",
  },
  // Couleurs personnalisées
  custom: {
    blue: "#052028",
    blueLight: "#0a3848",
    blueDark: "#01141c",
    white: "#ffffff",
    white2: "#fdfbf5",
    darkWhite: "#d8d8d8",
    green: "#4a6e28",
    green2: "#658848",
    green3: "#567536",
    greenLight: "#85a870",
    greenDark: "#334f1c",
  },
};

// Configurations d'accessibilité
export const accessibility = {
  // Ratios de contraste minimums (WCAG AAA = 7:1, AA = 4.5:1)
  contrast: {
    minimum: 4.5,
    enhanced: 7,
  },
  // Tailles de focus ring
  focusRing: {
    width: "2px",
    offset: "2px",
    color: "#4a9de0",
  },
};

// Configuration pour la réservation de salle
export const reservationSalle = {
  // Email administrateur pour recevoir les demandes
  adminEmail: "lemaireenzo91@gmail.com",
  // Heures d'ouverture de la salle

  // Durée minimum et maximum de réservation
  dureeReservation: {
    minimum: 0, // heures
    maximum: 999, // heures
  },
  adresse: "6 Rue de Noncerve, 91580 Villeneuve-sur-Auvers",

  EquipementsMobilier: "25 tables, 94 chaises",
  EquipementsCuisine:
    "Cuisine équipée avec réfrigérateur, meuble chauffe-plat, four, four electrique double, évier",
  Parking: "Parking cloturé plus de 50 places",
  Capacite: "100 personnes",

  // Tarifs (optionnel pour affichage informatif)
  tarifs: {
    particulier: {
      demieJournee: 50,
      journeeComplete: 80,
    },
    association: {
      demieJournee: 30,
      journeeComplete: 50,
    },
    WeekEndResident: {
      Total: 290,
      Arrhes: 87,
      Solde: 203,
    },
    FinAnneeResident: {
      Total: 350,
      Arrhes: 105,
      Solde: 245,
    },
    WeekEndNonResident: {
      Total: 680,
      Arrhes: 204,
      Solde: 476,
    },
    FinAnneeNonResident: {
      Total: 750,
      Arrhes: 225,
      Solde: 525,
    },
  },
  // Types de réservation
  typesReservation: [
    { id: "mariage", label: "Mariage", couleur: "#ff6b9d" },
    { id: "anniversaire", label: "Anniversaire", couleur: "#4ecdc4" },
    { id: "reunion", label: "Réunion", couleur: "#45b7d1" },
    { id: "formation", label: "Formation", couleur: "#96ceb4" },
    { id: "spectacle", label: "Spectacle", couleur: "#ffeaa7" },
    { id: "autre", label: "Autre", couleur: "#dda0dd" },
  ],
};

export const config = {
  // API Configuration
  api: {
    baseUrl: "http://192.168.37.89:3001",
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

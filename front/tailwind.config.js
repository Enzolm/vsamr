/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}", // dossier source TS/JS
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du logo avec contraste amélioré
        logo: {
          blue: "#081d35",
          sky: "#4a9de0",
          green: "#2a5b32",
          lightgreen: "#65a051",
          beige: "#f7f0d8",
          sun: "#e6a726",
          gray: "#d8d8d8",
          light: "#ffffff",
        },
        // Couleurs Canvas avec contraste amélioré
        canva: {
          white: "#ffffff",
          green: "#0d2b2d",
          lightgreen: "#7a9034",
          darkblue: "#041420",
        },
        // Couleurs personnalisées avec contraste amélioré
        custom: {
          blue: "#052028",
          "blue-light": "#0a3848",
          "blue-dark": "#01141c",
          white: "#ffffff",
          white2: "#fdfbf5",
          "dark-white": "#d8d8d8",
          green: "#4a6e28",
          green2: "#658848",
          green3: "#567536",
          "green-light": "#85a870",
          "green-dark": "#334f1c",
        },
      },
      // Amélioration des focus pour l'accessibilité
      outline: {
        focus: ["2px solid #4a9de0", "2px"],
      },
      // Amélioration des ombres pour plus de contraste
      boxShadow: {
        contrast: "0 2px 8px rgba(4, 20, 32, 0.15)",
        "contrast-hover": "0 4px 16px rgba(4, 20, 32, 0.25)",
      },
      // Utilitaires personnalisés pour les liens
      textColor: {
        link: "#4a9de0",
        "link-hover": "#2a5b32",
      },
      textDecorationColor: {
        link: "#4a9de0",
      },
    },
  },
  plugins: [],
};

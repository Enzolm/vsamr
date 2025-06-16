/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}", // dossier source TS/JS
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        logo: {
          blue: "#112E4F",
          sky: "#96C4EA",
          green: "#397640",
          lightgreen: "#7FB36A",
          beige: "#F0E5C8",
          sun: "#F8C144",
          gray: "#D4D4D4",
          light: "#EDEDED",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#c49a4a",
        emeraldPremium: "#16a34a",
        darkPremium: "#020617"
      }
    }
  },
  plugins: []
};
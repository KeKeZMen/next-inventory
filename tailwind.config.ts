/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#005EA3",
      "light-primary": "#257EBE",
      white: "#FFFFFF",
      black: "#000000",
      "data-table-border": "#a9a9a9",
      inherit: "inherit",
      error: "#F43F5E",
      gray: "#F4F4F4",
      "on-delete": "#FFD8D8",
    },
    backgroundImage: {
      logout: "url('/logout.svg')",
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
  darkMode: "class",
};

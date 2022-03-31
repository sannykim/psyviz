module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        psygreen: {
          500: "#66FFC7",
        },
        psypink: {
          500: "#FF669D",
        },
        cyan: { 500: "#00bcd4" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};

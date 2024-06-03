module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  variants: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        "brand-blue": "#70E3F6",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

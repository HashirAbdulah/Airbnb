module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        'airbnb': '#ff385c',
        'airbnb-dark': '#F4002D',
        'accent': "#10B981",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".rounded-50": {
          borderRadius: "50%",
        },
      });
    },
  ],
};

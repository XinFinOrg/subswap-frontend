/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      "nunito-sans": ['Nunito Sans', 'sans-serif'],
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient": "linear-gradient(132deg, #111B33 -38.77%, #340D2D 156.78%)"
      },

      colors: {
        "light": "#D8D6DB",
        "light-grey": "rgba(251, 250, 252, 0.50)",
        "border": "rgba(143, 141, 149, 0.20)",
        "button-bg": "rgba(78, 128, 238, 0.15)",
        "card-title": "#FBFAFC",
        "primary": "#4E80EE"
      },
    },
  },
  plugins: [require("daisyui")],
};

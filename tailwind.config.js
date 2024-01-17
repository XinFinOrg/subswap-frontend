/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      "nunito-sans": ['Nunito Sans', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        "light": "#D8D6DB",
        "light-grey": "rgba(251, 250, 252, 0.50)",
        "section-border": "rgba(143, 141, 149, 0.20)",
        "button-bg": "rgba(78, 128, 238, 0.15)",
        "primary": {
          DEFAULT: "#4E80EE",
        },
        white: {
          DEFAULT: "#FFFFFF",
          3: "#EEF2FD",
          4: "#FBFCFF",
        },
        "black": {
          DEFAULT: "#0D0E10", // the colour is not in design system 🤷
          2: "#151D33",
          4: "#111729",
        },
        "grey": {
          9: "#FBFAFC",
          "border": "#E7E7E8"
        },
        "button-disabled": "#484B52"
      },

      boxShadow: {
        "dialog": "4px 7px 24px 0px rgba(0, 0, 0, 0.24)",
      }
    },
  },
  plugins: [require("daisyui")],
};

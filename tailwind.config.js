/** @type {import('tailwindcss').Config} */
let plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
    plugin(function ({ matchVariant }) {
      matchVariant(
        "nth",
        (value) => {
          return `&:nth-child(${value})`;
        },
        {
          values: {
            DEFAULT: "n", // Default value for `nth:`
            odd: "2n+1",
            even: "2n",
          },
        }
      );
    }),
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#F5F5F5",
      brightgreen: "#98FB98",
      softgreen: "#A5E1A5",
      lightgreen: "#D3FFD3",
      lightblue: "#A6B1E1",
      blue: "#697CCC",
      midblue: "#424874",
      darkblue: "#242A59",
      fontblue: "#9DAFFF",
      black: "#121212",
      lightred: "#FCABB9",
    },
    screens: {
      mobile: { max: "549px" },
      sm: "550px",
      md: "800px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
        logo: ["var(--font-vt323)"],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
        show: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        show: "show 2s 500ms 1 forwards",
      },
    },
  },
};

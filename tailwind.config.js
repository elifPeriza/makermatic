/** @type {import('tailwindcss').Config} */
module.exports = {
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
      lightblue: "#A6B1E1",
      blue: "#697CCC",
      darkblue: "#242A59",
      fontblue: "#9DAFFF",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)"],
        mono: ["var(--font-roboto-mono)"],
        logo: ["var(--font-vt323)"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-black": "#0b0b0b",
        "brand-lime":  "#ccff00",
        "brand-gray":  "#f3f4f6",
        "brand-dark-green": "#1a2e1a"
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      zIndex: {
        "999": "999",
      }
    },
  },
  plugins: [],
};

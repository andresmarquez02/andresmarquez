/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Onest"', '"Onest Variable"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

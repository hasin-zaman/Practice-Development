/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b3dee2',
        secondary: '#eaf2d7',
        tertiary: '#efcfe3',
        accent: '#ea9ab2',
        highlight: '#e27396',
      }
    },
  },
  plugins: [],
}

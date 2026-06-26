/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111827',
          green: '#1a3636',
          gold: '#d4af37',
          bronze: '#b8860b',
          light: '#f5f5f5'
        }
      }
    },
  },
  plugins: [],
}

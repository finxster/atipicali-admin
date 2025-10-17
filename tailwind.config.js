/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atipical: {
          blue: '#3B82F6',
          red: '#EF4444',
          green: '#10B981',
          yellow: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}

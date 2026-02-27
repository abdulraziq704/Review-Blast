/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#5fae42',
        'brand-blue': '#2678b4',
      }
    },
  },
  plugins: [],
}


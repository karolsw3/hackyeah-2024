/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gov-red": '#d5233f',
        'gov-blue': '#0052a5',
        'gov-light-gray': '#f1f1f1'
      }
    },
  },
  plugins: [],
}


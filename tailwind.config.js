/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#aa3bff',
          DEFAULT: '#8a2be2',
          dark: '#6a1bb3',
        },
        bg: {
          light: '#ffffff',
          dark: '#0f172a',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

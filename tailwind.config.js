/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdedd5',
          200: '#fbd7aa',
          300: '#f8bc74',
          400: '#f4963c',
          500: '#f17816',
          600: '#e2620c',
          700: '#bb4a0c',
          800: '#963a10',
          900: '#7a3111',
        },
      },
    },
  },
  plugins: [],
} 
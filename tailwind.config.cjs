/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#284e85',
          50: '#f3f6fc',
          100: '#e7edf7',
          200: '#c9d8ee',
          300: '#99b8e0',
          400: '#6293ce',
          500: '#3e76b9',
          600: '#2e5c9b',
          700: '#284e85',
          800: '#234069',
          900: '#223758',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

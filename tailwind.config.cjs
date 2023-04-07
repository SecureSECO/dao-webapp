/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
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
        slate: {
          950: '#0D1323',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  darkMode: 'class',
};

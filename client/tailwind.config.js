/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dash: {
          '0%': { strokeDasharray: '90,150', strokeDashoffset: '-120' },
          '50%': { strokeDasharray: '90,150', strokeDashoffset: '-70' },
          '100%': { strokeDasharray: '90,150', strokeDashoffset: '-120' },
        },
      },
      animation: {
        'dash': 'dash 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 
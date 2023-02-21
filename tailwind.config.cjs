/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        coiny: ['var(--font-coiny)'],
        modak: ['var(--font-modak)'],
        fredoka: ['var(--font-fredoka)']
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};

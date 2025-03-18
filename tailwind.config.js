/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [  function ({ addUtilities }) {
    addUtilities({
      '.footer-title:after': {
        content: '""',
        display: 'block',
        width: '150px',
        top:'30px',
        height: '5px',
        position: 'absolute',
        bottom: '0',
        left: '-5px',
        backgroundImage: 'radial-gradient(ellipse at center, #3bc8e7 0%, rgba(255, 42, 112, 0) 60%)',
      },
    });
  },],
}
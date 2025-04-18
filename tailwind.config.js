/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".footer-title:after": {
          content: '""',
          display: "block",
          width: "150px",
          top: "30px",
          height: "5px",
          position: "absolute",
          bottom: "0",
          left: "-5px",
          backgroundImage:
            "radial-gradient(ellipse at center, #3bc8e7 0%, rgba(255, 42, 112, 0) 60%)",
        },
      });
    },
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        verde: '#3eb6a8',
      },
      boxShadow: {
        t2xl: '0px 0px 50px -20px rgb(0 0 0 / 0.25);'
      },
    },
  },
  plugins: [],
}
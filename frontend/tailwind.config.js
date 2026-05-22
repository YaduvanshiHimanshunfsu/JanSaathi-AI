/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        secondary: "#FFF7ED",
        dark: "#1E293B",
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#F59E0B"
      }
    }
  },

  plugins: []
};
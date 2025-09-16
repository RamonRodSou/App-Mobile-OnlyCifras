/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ], theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        title: "#ffffff",
        name: "#ffff00",
        notes: "#20f535",
        tone: "#ebb811",
        struct: "#6d6d0693",
      },
    },
  },
  plugins: [],
} 
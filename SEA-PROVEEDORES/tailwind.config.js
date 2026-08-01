/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#18181b",
        input: "#18181b",
        ring: "#3b82f6",
        background: "#020617",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#1d4ed8",
          hover: "#1e40af",
        },
      },
    },
  },
  plugins: [],
}

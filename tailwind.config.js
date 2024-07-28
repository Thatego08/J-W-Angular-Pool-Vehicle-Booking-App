/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        navbar: '#333', // Add custom colors if needed
        sidebar: '#333',
      },
      spacing: {
        '64': '16rem', // Adjust spacing values as needed
        '20': '5rem',
      },
    },
  },
  plugins: [],
}


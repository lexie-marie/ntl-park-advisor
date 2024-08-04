/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'midnight': '#121063',
        'metal': '#565584',
        'silver': '#ecebff',
        'brown': '#AA6A2B',
        'gold':'#c5b867',
        'light-green':'#9bdd7a',
        'med-green':'#329c64',
        'dark-green':'#3c6738',
        'darker-green': '#1D4233',
        'forest-green': '#569151'
      },
    },
  },
  plugins: [],
}


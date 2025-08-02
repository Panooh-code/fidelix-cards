/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Ativa o modo escuro
  theme: {
    extend: {
      colors: {
        'fidelix-purple': {
          light: '#A78BFA',
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          darkest: '#111827'
        },
        'fidelix-yellow': {
          DEFAULT: '#FACC15',
          dark: '#EAB308'
        },
        'fidelix-gray': {
           light: '#f9fafb',
           dark: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 150s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      } 
    },
  },
  plugins: [],
}

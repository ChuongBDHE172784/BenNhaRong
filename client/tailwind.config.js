/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#081619', ocean: '#0d2b33', brass: '#c6a15b', paper: '#eee4ce', vermilion: '#8f2f2f' },
      fontFamily: {
        display: ['Cormorant Garamond', 'Times New Roman', 'Georgia', 'serif'],
        sans: ['Be Vietnam Pro', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      }
    }
  }, plugins: []
};

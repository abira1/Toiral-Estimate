/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#edf1fc',
          100: '#d0daf9',
          200: '#b1c2f5',
          300: '#92aaf1',
          400: '#7392ee',
          500: '#547aea',
          600: '#3562e6',
          700: '#1649e3',
          800: '#1340cc',
          900: '#1137b5',
        },
        secondary: {
          50: '#f0f8ff',
          100: '#e0f1fe',
          200: '#bae3fd',
          300: '#7dcffb',
          400: '#3ab5f8',
          500: '#0e9aed',
          600: '#0280d9',
          700: '#0167b0',
          800: '#015591',
          900: '#034877',
        },
        accent: {
          50: '#fef1f7',
          100: '#fee5f0',
          200: '#fecce3',
          300: '#ffa3ca',
          400: '#ff6aa7',
          500: '#ff3884',
          600: '#ff0062',
          700: '#d70050',
          800: '#b30042',
          900: '#94003a',
        },
        lavender: {
          light: '#e8e6ff',
          DEFAULT: '#d6d3ff',
          dark: '#b8b2ff',
        },
        cream: {
          light: '#fffaf0',
          DEFAULT: '#fff5e6',
          dark: '#ffedd9',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'retro': '2px 2px 0 0 rgba(0, 0, 0, 0.1)',
        'retro-lg': '4px 4px 0 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
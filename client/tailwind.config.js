/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#f9f6f0',
          100: '#f0e8db',
          200: '#e1d2bc',
          300: '#cfb597',
          400: '#bd9471',
          500: '#af7a53',
          600: '#a36547',
          700: '#88503c',
          800: '#6f4335',
          900: '#5a382e',
        }
      },
      boxShadow: {
        'clay': '8px 8px 16px #d1c8b8, -8px -8px 16px #ffffff',
        'clay-inset': 'inset 8px 8px 16px #d1c8b8, inset -8px -8px 16px #ffffff',
      }
    },
  },
  plugins: [],
}

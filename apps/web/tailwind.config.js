/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F4ECD8',
          300: '#EDE0C0',
        },
        stone: {
          850: '#1C1B1A',
          900: '#151413',
          950: '#0D0C0C',
        },
        bronze: {
          400: '#D4B996',
          500: '#C5A880',
          600: '#A88B63',
          700: '#8A6E48',
        },
        espresso: {
          800: '#2A1E17',
          900: '#1B130E',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        price: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.3em',
      }
    },
  },
  plugins: [],
}

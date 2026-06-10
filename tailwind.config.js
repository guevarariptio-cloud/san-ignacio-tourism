/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        premium: {
          dark: '#1c1917',
          muted: '#78706c',
          accent: '#059669',
          coffee: '#b45309',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78706c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      borderRadius: {
        '2.5xl': '1.375rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'premium-xl': '0 20px 40px -10px rgba(16, 185, 129, 0.15)',
      },
      backdropBlur: {
        'xl': '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

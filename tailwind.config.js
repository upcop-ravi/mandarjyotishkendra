/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0faf4',
          100: '#d9f2e5',
          200: '#b0e4ca',
          300: '#7dcfaa',
          400: '#4db385',
          500: '#2D6A4F',  // brand emerald
          600: '#256045',
          700: '#1d4f38',
          800: '#163e2c',
          900: '#0e2e20',
        },
        amber: {
          50:  '#fff9f0',
          100: '#feefd5',
          200: '#fddba8',
          300: '#fbc06b',
          400: '#f9a03a',
          500: '#E9922B',  // brand amber
          600: '#d07a1a',
          700: '#a85f10',
          800: '#7f470a',
          900: '#5a3205',
        },
        cream: {
          50:  '#FDFAF5',
          100: '#FDF8F0',
          200: '#F9F0DC',
          300: '#f3e5c2',
        },
        charcoal: {
          800: '#2C2C2C',
          700: '#3d3d3d',
          600: '#555555',
          500: '#6e6e6e',
          400: '#8a8a8a',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'count-up': 'countUp 2s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(45, 106, 79, 0.12)',
        'card': '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(45,106,79,0.2)',
        'amber': '0 4px 20px rgba(233,146,43,0.3)',
      },
    },
  },
  plugins: [],
}

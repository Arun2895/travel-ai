/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: '#F4600C',
        background: '#0A0A0A',
        surface: '#131313',
        border: 'rgba(255,255,255,0.07)',
        text: '#F5F0EB',
        muted: '#888880',
      },
      keyframes: {
        shine: {
          '100%': { transform: 'translateX(100%) skewX(-20deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        shine: 'shine 1.5s ease-out infinite',
        float: 'float 3s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 1s',
      }
    },
  },
  plugins: [],
}

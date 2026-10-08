/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#07080a',
        surface: {
          DEFAULT: '#0d0d0d',
          elevated: '#101111',
          card: '#121212',
        },
        hairline: {
          DEFAULT: '#242728',
          soft: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        ink: '#f4f4f6',
        body: '#cdcdcd',
        charcoal: '#d3d3d4',
        mute: '#9c9c9d',
        ash: '#6a6b6c',
        stone: '#434345',
        accent: {
          blue: '#57c1ff',
          'blue-soft': 'rgba(87, 193, 255, 0.15)',
          red: '#ff6161',
          'red-soft': 'rgba(255, 97, 97, 0.15)',
          green: '#59d499',
          'green-soft': 'rgba(89, 212, 153, 0.15)',
          yellow: '#ffc533',
          'yellow-soft': 'rgba(255, 197, 51, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EC',
        teal: {
          DEFAULT: '#2A6F6F',
          dark: '#1D4E4E',
          light: '#5A9B9B'
        },
        gold: {
          DEFAULT: '#E8A33D',
          light: '#F4C978'
        },
        brick: '#B5573A',
        night: {
          DEFAULT: '#2E3454',
          deep: '#1B1F35'
        },
        ink: '#1F2D3D'
      },
      fontFamily: {
        display: ['Lalezar', 'cursive'],
        body: ['Tajawal', 'sans-serif']
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' }
        },
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        shake: 'shake 0.3s ease-in-out 1',
        pop: 'pop 0.25s ease-out 1'
      },
      borderRadius: {
        blob: '42% 58% 65% 35% / 45% 40% 60% 55%'
      }
    }
  },
  plugins: []
}

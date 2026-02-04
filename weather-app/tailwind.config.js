/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drip': 'drip 20s ease-in-out infinite',
        'rain-fall': 'rainFall 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        drip: {
          '0%': { 
            transform: 'translateY(0) scaleY(1)',
            opacity: '0.4'
          },
          '50%': {
            opacity: '0.6'
          },
          '100%': { 
            transform: 'translateY(100vh) scaleY(1.5)',
            opacity: '0'
          },
        },
        rainFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      }
    },
  },
  plugins: [],
}
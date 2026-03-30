/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2b4a',
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9eb0d4',
          300: '#7690c2',
          400: '#5879b5',
          500: '#3a62a8',
          600: '#2e519a',
          700: '#223e87',
          800: '#1a2b4a',
          900: '#0f1d33',
        },
        orange: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0d',
          700: '#c2570a',
          800: '#9a4209',
          900: '#7c3406',
        },
        amber: '#f59e0b',
        traffic: {
          red: '#dc2626',
          amber: '#f59e0b',
          green: '#16a34a',
        },
        bg: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'traffic-pulse': 'trafficPulse 6s infinite',
        'marquee': 'marquee 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        trafficPulse: {
          '0%, 33%': { '--red-opacity': '1', '--amber-opacity': '0.2', '--green-opacity': '0.2' },
          '34%, 66%': { '--red-opacity': '0.2', '--amber-opacity': '1', '--green-opacity': '0.2' },
          '67%, 100%': { '--red-opacity': '0.2', '--amber-opacity': '0.2', '--green-opacity': '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

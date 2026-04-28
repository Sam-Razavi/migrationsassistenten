import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fa',
          100: '#d4e2f3',
          200: '#a8c5e6',
          300: '#6fa0d1',
          400: '#3d7dbc',
          500: '#1e60a8',
          600: '#1a5090',
          700: '#153f74',
          800: '#0f2f58',
          900: '#0c2340',
          950: '#071628',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

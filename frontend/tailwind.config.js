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
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        background: {
          DEFAULT: '#F8FAFC',
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
        },
        beige: {
          DEFAULT: '#E2E8F0',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
        },
        sage: {
          DEFAULT: '#14B8A6',
          light: '#99F6E4',
          dark: '#0F766E',
        },
        warm: {
          white: '#FFFFFF',
          gray: '#94A3B8',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 10px 30px -18px rgba(15, 23, 42, 0.35)',
        'soft-lg': '0 18px 48px -28px rgba(15, 23, 42, 0.42)',
        'card': '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -24px rgba(15, 23, 42, 0.35)',
        'card-hover': '0 18px 48px -28px rgba(15, 23, 42, 0.42)',
        'hover': '0 18px 48px -28px rgba(15, 23, 42, 0.42)',
        'elevated': '0 24px 70px -32px rgba(15, 23, 42, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 50%, #F8FAFC 100%)',
        'gradient-green': 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
      },
    },
  },
  plugins: [],
}

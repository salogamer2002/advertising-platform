/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fad6ac',
          300: '#f6b978',
          400: '#f19342',
          500: '#ed751d',
          600: '#de5b13',
          700: '#b84412',
          800: '#933716',
          900: '#762f15',
        },
      },
    },
  },
  plugins: [],
};

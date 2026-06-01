/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // TODO: confirm real brand colours with Dan. Maritime placeholder palette.
        navy: {
          DEFAULT: '#0b2545',
          light: '#13355f',
          dark: '#071a33',
        },
        accent: {
          DEFAULT: '#0a9396',
          light: '#37b3b6',
          dark: '#077578',
        },
        sand: '#f4f1ea',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

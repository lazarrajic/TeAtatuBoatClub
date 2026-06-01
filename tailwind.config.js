/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette, sampled from the club crest (TABC logo) ──
        // Navy = structure/dark sections · Gold = signature accent (buttons,
        // accents on dark) · Marine = blue accent on light · Sand = warm neutral.
        navy: {
          DEFAULT: '#0b2545',
          light: '#143a63',
          dark: '#071a33',
        },
        gold: {
          DEFAULT: '#f8b838',
          dark: '#e0a020',
          light: '#ffd479',
        },
        // `accent` is the marine blue from the pennant — used for labels/links/
        // highlights on light backgrounds (kept as the `accent` name so existing
        // utility classes resolve to it).
        accent: {
          DEFAULT: '#0070b8',
          dark: '#005a94',
          light: '#3392cf',
        },
        sand: '#f5f1e8',
        brandred: '#b80000', // crest red — reserved, used sparingly
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

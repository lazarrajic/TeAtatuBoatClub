/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand palette, sampled from the club crest (TABC logo) ──
        // Maritime blues + warm creams; gold/blue/red accents from the crest.
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
        // Marine blue from the pennant — accent on light backgrounds.
        accent: {
          DEFAULT: '#0070b8',
          dark: '#005a94',
          light: '#3392cf',
        },
        // Soft sea tint for occasional light-blue bands.
        sea: '#e7f0f6',
        // Warm creams — cream = lightest (page base), sand = a touch deeper (bands).
        cream: '#fbf8f2',
        sand: '#f2eada',
        brandred: '#b80000', // crest red — reserved, used sparingly
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

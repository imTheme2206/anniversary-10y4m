/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EA',
        'cream-2': '#F4ECD9',
        ivory: '#FFFDF7',
        ink: '#2E2822',
        'ink-soft': '#6B5F4E',
        gold: '#E8B23A',
        'gold-deep': '#C8922A',
        sage: '#8C9A6B',
        'sage-deep': '#6E7C4E',
        blush: '#E7A79C',
        line: '#E2D6BE',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Mali"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', '"Mitr"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', '"Itim"', 'cursive'],
      },
      height: {
        dvh: '100dvh',
      },
      minHeight: {
        dvh: '100dvh',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      transitionTimingFunction: {
        'power3-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

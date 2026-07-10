import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        charbon: '#111814',
        foret: '#0B3D2E',
        mousse: '#1F6B4E',
        creme: '#F6F0E4',
        beige: '#EADCC4',
        or: '#B98A3B',
        cuivre: '#C96A3A',
        corail: '#D96C5F',
      },
      boxShadow: {
        premium: '0 24px 80px rgba(0, 0, 0, 0.38)',
        glow: '0 0 80px rgba(201, 106, 58, 0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config;

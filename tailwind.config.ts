import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#071516',
        ink: '#10201F',
        aqua: '#0FA3A1',
        mint: '#67E8C9',
        leaf: '#A3E635',
        mist: '#E8F8F5',
        porcelain: '#F6FBF9',
        frost: '#EEF7F4',
        steel: '#6B7B7A',
        graphite: '#182C2B',
      },
      fontFamily: {
        display: ['Bai Jamjuree', 'Aptos Display', 'Noto Sans SC', 'sans-serif'],
        body: ['Aptos', 'Noto Sans SC', 'Source Han Sans SC', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 28px 90px rgba(15, 163, 161, 0.28)',
        panel: '0 22px 70px rgba(7, 21, 22, 0.13)',
        'panel-soft': '0 14px 44px rgba(7, 21, 22, 0.08)',
      },
      backgroundImage: {
        'grid-radial':
          'radial-gradient(circle at 20% 20%, rgba(103,232,201,0.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(163,230,53,0.16), transparent 30%)',
        'industrial-grid':
          'linear-gradient(rgba(7,21,22,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(7,21,22,0.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;

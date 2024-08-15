import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3ecfe',
          100: '#c29efa',
          200: '#b58bf9',
          300: '#a977f8',
          400: '#9d64f7',
          500: '#9050f6',
          600: '#843df5',
          700: '#7737dd',
          800: '#6a31c4',
          900: '#5c2bac',
        },
      },
    },
  },
  plugins: [],
};
export default config;

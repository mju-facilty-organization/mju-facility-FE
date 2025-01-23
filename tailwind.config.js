/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myongji: '#002e66',
        gray: {
          custom: '#767676',
        },
      },
    },
  },
  plugins: [],
};

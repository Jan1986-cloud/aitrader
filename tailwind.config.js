/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary-color))',
          light: 'rgb(var(--primary-color) / 0.8)',
          dark: 'rgb(var(--primary-color) / 1.2)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-color))',
          light: 'rgb(var(--secondary-color) / 0.8)',
          dark: 'rgb(var(--secondary-color) / 1.2)',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

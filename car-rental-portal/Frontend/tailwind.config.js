/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
     "./node_modules/flowbite/**/*.js",
    // "./src/pages/**/*.{js,jsx,ts,tsx}",
    // "./src/sections/**/*.{js,jsx,ts,tsx}",
    // "./src/components/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      dataCarouselItem: {
        '1': 'tw-transition-transform',
        '2': 'tw-transform',
        '3': '-tw-translate-z-full',
        '4': 'tw-z-10',
        '5': 'tw-hidden',
        // Thêm các giá trị khác nếu cần
      },
      animation: {
        fade: 'fadeIn .8s',
      },

      keyframes: {
        fadeIn: {
          from: {opacity: 0, transition: 0},
          to: {opacity: 1, transition: 2},
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('flowbite/plugin')
  ],
  safelist: ['animate-[fade-in_1s_ease-in-out]', 'animate-[fade-in-down_1s_ease-in-out]'],
  prefix: 'tw-',
}


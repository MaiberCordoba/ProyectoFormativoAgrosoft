import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sena-green": "#16A34A",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            success:{
              DEFAULT: "#16A34A",
              foreground: "#ffffff"
            }   
          },
        },
        dark: {
          colors: {
            success: {
              DEFAULT: '#39A900',
              foreground:"ffffff"
            }
          },
        },
      },
    }),
  ],
}

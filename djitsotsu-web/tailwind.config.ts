import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'solid-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'solid': '4px 4px 0px 0px rgba(0,0,0,1)',
        'solid-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      colors: {
        'ink-black': '#0a0a0a',
        'paper-white': '#fdfdfd',
        'zinc-accent': '#27272a',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'accent': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
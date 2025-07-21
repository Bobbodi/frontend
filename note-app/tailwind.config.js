/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Your custom OKLCH colors
        customred: 'oklch(64.76% 0.204 11.07)',
        yellow: 'oklch(88.03% 0.135 86.06)',
        green: 'oklch(77.75% 0.160 166.57)',
        blue: 'oklch(59.23% 0.112 227.97)',
        dark: 'oklch(32.91% 0.059 225.83)',
        
        // Optional: Create semantic names
        primary: 'oklch(59.23% 0.112 227.97)', // blue
        secondary: 'oklch(77.75% 0.160 166.57)', // green
        accent: 'oklch(64.76% 0.204 11.07)', // red
        warning: 'oklch(88.03% 0.135 86.06)' // yellow
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional plugin for better form styles
    // Other plugins you might want
  ],
}
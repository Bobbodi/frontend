import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  content: ["./index.html", "./src/**/*/.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: '#ef476f',
        yellow: '#ffd166',
        green: '#06d6a0',
        blue: '#118ab2', 
        dark: '#073b4c'
      },
    },
  },
  plugins: [
    react(), 
    tailwindcss()],
  base: "",
})


import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    /* The WebGL scene is deliberately lazy-loaded; Three.js makes that one
       chunk large, while the first paint stays under 250 KB of JS. */
    chunkSizeWarningLimit: 1000,
  },
})

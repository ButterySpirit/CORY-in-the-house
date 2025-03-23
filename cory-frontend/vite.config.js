import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 🔥 THIS tells Vite to fallback to index.html for unknown routes (client-side routing)
    historyApiFallback: true,
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'code-explorer-83.preview.emergentagent.com',
      '.preview.emergentagent.com',
      'localhost'
    ]
  }
})

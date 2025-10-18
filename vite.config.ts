import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build output
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Vendor chunk - React core libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Firebase chunk - Firebase services
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database'],
          // Charts chunk - Recharts library
          charts: ['recharts'],
          // UI utilities - Common UI libraries
          ui: ['lucide-react', 'react-hot-toast', 'date-fns'],
          // PDF utilities
          pdf: ['jspdf'],
        },
        // Naming pattern for chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Source map for debugging (disable in production for smaller builds)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'code-explorer-83.preview.emergentagent.com',
      '.preview.emergentagent.com',
      'localhost'
    ]
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/database'],
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import manifest from './public/manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: `dist/${manifest.version}`, // Output directory for the extension
    rollupOptions: {
      input: {
        index: './index.html',
        main: './src/main.tsx', // Entry point for popup
      },
      output: {
        entryFileNames: '[name].js', // Outputs background.js, popup.js
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Minify for production, but can be disabled for debugging
    minify: true,
    // Ensure compatibility with Chrome's service worker (ES modules)
    modulePreload: false,
    target: 'es2022'
  },
})

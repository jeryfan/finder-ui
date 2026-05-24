import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

const rootDir = resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@jeryfan/finder-ui': resolve(rootDir, 'src/index.ts'),
      '@': resolve(rootDir, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5273,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8010',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/api/**'],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5273,
    strictPort: true,
  },
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
})

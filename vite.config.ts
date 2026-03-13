import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ['src/**/*'],
      exclude: ['src/App.tsx', 'src/main.tsx'],
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FinderUI',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `finder-ui.${format}.js`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@codemirror/lang-json',
        '@codemirror/theme-one-dark',
        '@uiw/react-codemirror',
        '@codemirror/state',
        '@codemirror/view',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@codemirror/lang-json': 'codemirrorLangJson',
          '@codemirror/theme-one-dark': 'codemirrorThemeOneDark',
          '@uiw/react-codemirror': 'ReactCodeMirror',
        }
      }
    },
    cssCodeSplit: false,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
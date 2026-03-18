import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/utils/**',
        'src/store/slices/**',
        'src/constants/**',
      ],
      exclude: [
        'src/store/slices/handlers-slice.ts',
        'src/store/slices/sidebar-slice.ts',
        'src/store/slices/context-menu-slice.ts',
        'src/utils/file-icons.tsx',
        'src/utils/read-entry-files.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})

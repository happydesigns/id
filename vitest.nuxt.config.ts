import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/nuxt/**/*.spec.ts'],
    hookTimeout: 180_000,
    testTimeout: 30_000,
  },
})

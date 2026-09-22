import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser', testMatch: 'capabilities.spec.ts', workers: 1,
  timeout: 180_000, outputDir: '.output/tests/capabilities',
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
})

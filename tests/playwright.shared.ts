import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: fileURLToPath(new URL('./browser', import.meta.url)),
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', {
    open: 'never',
    outputFolder: fileURLToPath(new URL('../.output/tests/report', import.meta.url)),
  }]],
  use: { trace: 'retain-on-failure' },
})

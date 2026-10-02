import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'docs.spec.ts',
  outputDir: '.output/tests/docs',
  timeout: 60_000,
  workers: 1,
  use: { trace: 'retain-on-failure' },
  webServer: process.env.ID_DOCS_TEST_URL
    ? undefined
    : {
        command: 'pnpm docs:build && node tests/helpers/serve-static.mjs docs/.output/public',
        stdout: 'pipe',
        url: 'http://127.0.0.1:3443',
        env: { PORT: '3443' },
        reuseExistingServer: false,
        timeout: 300_000,
      },
})

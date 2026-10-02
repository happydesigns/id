import { defineConfig } from '@playwright/test'
import shared from './tests/playwright.shared'

export default defineConfig(shared, {
  testMatch: 'docs.spec.ts',
  outputDir: '.output/tests/docs',
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

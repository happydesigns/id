import { defineConfig } from '@playwright/test'
import shared from './tests/playwright.shared'

export default defineConfig(shared, {
  testMatch: 'devtools.spec.ts',
  outputDir: '.output/tests/devtools',
  timeout: 120_000,
  use: { baseURL: 'http://127.0.0.1:3450' },
  webServer: {
    command: 'node node_modules/nuxt/bin/nuxt.mjs dev tests/fixtures/preview --host 127.0.0.1 --port 3450',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3450/demo',
    env: { ID_TEST_DEVTOOLS: '1' },
    timeout: 300_000,
    reuseExistingServer: false,
  },
})

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'devtools.spec.ts',
  outputDir: '.output/tests/devtools',
  timeout: 120_000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3450', trace: 'retain-on-failure' },
  webServer: {
    command: 'node node_modules/nuxt/bin/nuxt.mjs dev tests/fixtures/preview --host 127.0.0.1 --port 3450',
    url: 'http://127.0.0.1:3450/demo',
    env: { ID_TEST_DEVTOOLS: '1' },
    timeout: 180_000,
    reuseExistingServer: false,
  },
})

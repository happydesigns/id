import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'external-preview.spec.ts',
  outputDir: '.output/tests/published-preview',
  timeout: 60_000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
  webServer: [{
    command: 'node tests/helpers/serve-static.mjs',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    timeout: 60_000,
    reuseExistingServer: false,
  }, {
    command: 'node tests/helpers/serve-static.mjs tests/fixtures/preview/.output/public',
    url: 'http://127.0.0.1:3444/demo',
    env: { PORT: '3444' },
    timeout: 60_000,
    reuseExistingServer: false,
  }],
})

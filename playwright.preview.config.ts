import { defineConfig } from '@playwright/test'
import shared from './tests/playwright.shared'

export default defineConfig(shared, {
  testMatch: 'external-preview.spec.ts',
  outputDir: '.output/tests/published-preview',
  use: { baseURL: 'http://127.0.0.1:3439' },
  webServer: [{
    command: 'pnpm exec nuxt generate tests/fixtures/guide && node tests/helpers/serve-static.mjs',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    timeout: 300_000,
    reuseExistingServer: false,
  }, {
    command: 'pnpm exec nuxt generate tests/fixtures/preview && node tests/helpers/serve-static.mjs tests/fixtures/preview/.output/public',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3444/demo',
    env: { PORT: '3444', ID_TEST_PREVIEW_BUILD: '1' },
    timeout: 300_000,
    reuseExistingServer: false,
  }],
})

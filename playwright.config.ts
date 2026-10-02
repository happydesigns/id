import { defineConfig } from '@playwright/test'
import shared from './tests/playwright.shared'

export default defineConfig(shared, {
  outputDir: '.output/tests/results',
  use: { baseURL: 'http://127.0.0.1:3439' },
  testIgnore: ['**/docs.spec.ts', '**/brand-switch.spec.ts', '**/devtools.spec.ts', '**/capabilities.spec.ts', '**/external-preview.spec.ts'],
  webServer: [{
    command: 'pnpm exec nuxt generate tests/fixtures/guide && node tests/helpers/serve-static.mjs',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    reuseExistingServer: false,
    timeout: 300_000,
  }, {
    command: 'node node_modules/nuxt/bin/nuxt.mjs dev tests/fixtures/preview --host 127.0.0.1 --port 3444',
    url: 'http://127.0.0.1:3444/demo',
    reuseExistingServer: false,
    timeout: 180_000,
  }, {
    command: 'node node_modules/nuxt/bin/nuxt.mjs dev tests/fixtures/dashboard --host 127.0.0.1 --port 3445',
    url: 'http://127.0.0.1:3445/demo',
    reuseExistingServer: false,
    timeout: 180_000,
  }],
})

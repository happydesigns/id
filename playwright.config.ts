import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  outputDir: '.output/tests/results',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '.output/tests/report' }]],
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
  testIgnore: ['**/docs.spec.ts', '**/brand-switch.spec.ts', '**/devtools.spec.ts', '**/capabilities.spec.ts'],
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

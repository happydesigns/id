import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  outputDir: '.output/tests/results',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '.output/tests/report' }]],
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
  webServer: [{
    command: 'node tests/helpers/serve-static.mjs',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    reuseExistingServer: false,
    timeout: 60_000,
  }, {
    command: 'node tests/helpers/serve-static.mjs docs/.output/public',
    url: 'http://127.0.0.1:3443',
    env: { PORT: '3443' },
    reuseExistingServer: false,
    timeout: 60_000,
  }, ...['violet', 'amber', 'studio'].map((name, index) => ({
    command: 'node tests/helpers/serve-static.mjs .output/native-consumers/' + name,
    url: 'http://127.0.0.1:' + (3440 + index),
    env: { PORT: String(3440 + index) },
    reuseExistingServer: false,
    timeout: 60_000,
  }))],
})

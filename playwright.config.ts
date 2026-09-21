import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
  webServer: {
    command: 'node scripts/serve-guide.mjs',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    reuseExistingServer: false,
    timeout: 60_000
  }
})

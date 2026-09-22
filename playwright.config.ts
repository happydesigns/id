import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  testIgnore: '**/workflow.spec.ts',
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
  }, ...([['violet', 3440], ['amber', 3441], ['studio', 3442], ['violet-dashboard', 3446], ['amber-dashboard', 3447]] as const).map(([name, port]) => ({
    command: 'node tests/helpers/serve-static.mjs .output/native-consumers/' + name,
    url: 'http://127.0.0.1:' + port + (name === 'studio' ? '/studio' : '/demo'),
    env: { PORT: String(port) },
    reuseExistingServer: false,
    timeout: 60_000,
  }))],
})

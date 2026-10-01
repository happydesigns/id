import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  outputDir: '.output/tests/results',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '.output/tests/report' }]],
  use: { baseURL: 'http://127.0.0.1:3439', trace: 'retain-on-failure' },
  projects: [{
    name: 'authoring',
    testMatch: '**/workflow.spec.ts',
  }, {
    name: 'native-build',
    testDir: './tests/setup',
    testMatch: '**/native.setup.ts',
    dependencies: ['authoring'],
    timeout: 20 * 60_000,
  }, {
    name: 'native',
    testMatch: '**/brand-switch.spec.ts',
    dependencies: ['native-build'],
  }, {
    name: 'browser',
    testIgnore: ['**/workflow.spec.ts', '**/brand-switch.spec.ts', '**/devtools.spec.ts', '**/capabilities.spec.ts'],
  }],
  webServer: [{
    command: 'pnpm pack:studio && pnpm exec nuxt generate tests/fixtures/guide && node tests/helpers/serve-static.mjs',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3439',
    env: { PORT: '3439' },
    reuseExistingServer: false,
    timeout: 300_000,
  }, {
    command: 'pnpm docs:build && node tests/helpers/serve-static.mjs docs/.output/public',
    stdout: 'pipe',
    url: 'http://127.0.0.1:3443',
    env: { PORT: '3443' },
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
  }, ...([['violet', 3440], ['amber', 3441], ['studio', 3442], ['violet-dashboard', 3446], ['amber-dashboard', 3447]] as const).map(([name, port]) => ({
    command: 'node tests/helpers/serve-static.mjs .output/native-consumers/' + name,
    // These servers start before the native-build dependency produces their files.
    url: 'http://127.0.0.1:' + port + '/__health',
    env: { PORT: String(port) },
    reuseExistingServer: false,
    timeout: 60_000,
  }))],
})

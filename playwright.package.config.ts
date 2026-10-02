import { defineConfig } from '@playwright/test'
import shared from './tests/playwright.shared'

export default defineConfig(shared, {
  outputDir: '.output/tests/package',
  projects: [{
    name: 'build',
    testDir: './tests/setup',
    testMatch: 'native.setup.ts',
    timeout: 10 * 60_000,
  }, {
    name: 'native',
    testMatch: 'brand-switch.spec.ts',
    dependencies: ['build'],
  }],
  webServer: ([['violet', 3440], ['amber-dashboard', 3447], ['studio', 3442]] as const).map(([name, port]) => ({
    command: 'node tests/helpers/serve-static.mjs .output/native-consumers/' + name,
    // Build is a project dependency; readiness here only checks the static server.
    url: 'http://127.0.0.1:' + port + '/__health',
    env: { PORT: String(port) },
    reuseExistingServer: false,
    timeout: 60_000,
  })),
})

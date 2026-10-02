import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'
import shared from '../playwright.shared'

export default defineConfig(shared, {
  testMatch: 'capabilities.spec.ts',
  timeout: 180_000,
  outputDir: fileURLToPath(new URL('../../.output/tests/capabilities', import.meta.url)),
  use: { baseURL: 'http://127.0.0.1:3439' },
})

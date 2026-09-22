import { defineConfig } from '@playwright/test'
import config from './playwright.config'

export default defineConfig({
  ...config,
  testIgnore: [],
  testMatch: '**/workflow.spec.ts',
  outputDir: '.output/tests/authoring',
  webServer: (Array.isArray(config.webServer) ? config.webServer : []).filter(server => !server.command.includes('native-consumers') && !server.command.includes('docs/.output')),
})

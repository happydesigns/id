import { presetFonts, presetIcons } from './presets'
import { createFirstPaintScript } from './first-paint'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

const currentDir = dirname(fileURLToPath(import.meta.url))
const firstPaintRevision = createHash('sha256')
  .update(readFileSync(resolve(currentDir, 'app/data/nuxt-ui-presets.json')))
  .update(readFileSync(resolve(currentDir, 'app/app.config.ts')))
  .digest('hex').slice(0, 12)

export default defineNuxtConfig({
  extends: ['../studio', '../guide', 'docus'],
  modules: [
    resolve(currentDir, '../module.ts'),
  ],
  app: { head: { script: [{ innerHTML: createFirstPaintScript(firstPaintRevision), tagPriority: -10 }] } },
  content: {
    _localDatabase: { type: 'sqlite', filename: devServer ? '.data/content/dev.sqlite' : '.data/content/contents.sqlite' },
  },
  appConfig: { idStudio: { firstPaintRevision } },
  buildDir: devServer ? '.nuxt-dev' : '.nuxt',
  compatibilityDate: 'latest',
  fonts: { families: presetFonts.map(name => ({ name })) },
  icon: { clientBundle: { icons: Object.values(presetIcons) } },
  llms: {
    domain: 'https://id.happydesigns.de',
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.',
  },
})

import { presetFonts, presetIcons } from './presets'
import { readFileSync } from 'node:fs'
import { createStudioDocument } from '../src/studio'
import { sampleBrandTheme } from '../themes/sample-brand'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({

  extends: ['../studio', '../guide', 'docus'],
  modules: [
    resolve(currentDir, '../module.ts'),
  ],
  css: [
    resolve(currentDir, '../themes/sample-brand/tokens.css'),
  ],
  content: {
    _localDatabase: { type: 'sqlite', filename: devServer ? '.data/content/dev.sqlite' : '.data/content/contents.sqlite' },
  }, appConfig: { idStudio: { brands: {
    [sampleBrandTheme.name]: createStudioDocument({ name: 'sample-brand', colors: {
      sample: Object.fromEntries([...readFileSync(resolve(currentDir, '../themes/sample-brand/tokens.css'), 'utf8').matchAll(/--color-sample-(\d+):\s*([^;]+);/g)].map(match => [match[1]!, match[2]!.trim()])),
    } }, sampleBrandTheme),
  } } },
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

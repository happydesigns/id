import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  buildDir: devServer ? '.nuxt-dev' : '.nuxt',
  content: {
    _localDatabase: { type: 'sqlite', filename: devServer ? '.data/content/dev.sqlite' : '.data/content/contents.sqlite' }
  },
  extends: ['../studio', '../guide', 'docus'],
  modules: [
    resolve(currentDir, '../module.ts')
  ],
  css: [
    resolve(currentDir, '../themes/sample-brand/tokens.css')
  ],
  compatibilityDate: 'latest',
  llms: {
    domain: 'https://id.happydesigns.de',
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.'
  }
})

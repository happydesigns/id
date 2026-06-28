import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))
const runtimeCompatModule = resolve(currentDir, '../modules/runtime-compat.mjs')

export default defineNuxtConfig({
  extends: ['docus'],
  modules: [
    resolve(currentDir, '../module.ts'),
    runtimeCompatModule
  ],
  css: [
    resolve(currentDir, '../themes/happydesigns/tokens.css')
  ],
  compatibilityDate: 'latest',
  vite: {
    optimizeDeps: {
      include: []
    }
  },
  llms: {
    domain: 'https://id.happydesigns.de',
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for happydesigns projects.'
  }
})

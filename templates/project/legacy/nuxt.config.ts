import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'
import { createStudioCss, parseStudioDocument } from '@happydesigns/id/studio/core'
import source from './brand.studio.json'

const stylesheet = fileURLToPath(new URL('./app/assets/css/brand.css', import.meta.url))
writeFileSync(stylesheet, [
  '@import "tailwindcss";',
  '@import "@nuxt/ui";',
  '@source "../../../brand.studio.json";',
  createStudioCss(parseStudioDocument(source))
].join('\n'))

export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt'],
  css: [stylesheet],
  compatibilityDate: '2026-08-01'
})

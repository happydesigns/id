import { fileURLToPath } from 'node:url'
import packageJson from '../package.json'
import source from '../brand.studio.json'
import { generateBrand } from '../scripts/generate-brand.mjs'
import { parseStudioDocument } from '@happydesigns/id/studio/core'

const document = parseStudioDocument(source)
const bundledPackage = packageJson.devDependencies['@happydesigns/id'].startsWith('file:')

export default defineNuxtConfig({
  extends: ['..', '@happydesigns/id/studio'],
  css: ['~/app.css'],
  appConfig: {
    idStudio: {
      document,
      sourcePath: 'brand.studio.json',
      ...(bundledPackage ? { packageAsset: '/studio-packages/id.tgz' } : {}),
    },
  },
  runtimeConfig: {
    idStudioSource: fileURLToPath(new URL('../brand.studio.json', import.meta.url)),
  },
  compatibilityDate: '2026-08-01',
  hooks: {
    'builder:watch': (_event, path) => {
      if (path.endsWith('brand.studio.json')) generateBrand()
    },
  },
  icon: { serverBundle: { collections: ['lucide', 'vscode-icons'] } },
})

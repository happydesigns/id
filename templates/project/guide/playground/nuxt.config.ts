import { fileURLToPath } from 'node:url'
import packageJson from '../package.json'
import source from '../brand.studio.json'
import { generateBrand } from '../scripts/generate-brand.mjs'
import { parseStudioDocument } from '@happydesigns/id/studio/core'

const document = parseStudioDocument(source)
const bundledPackage = packageJson.devDependencies['@happydesigns/id'].startsWith('file:')

export default defineNuxtConfig({
  extends: ['..', '@happydesigns/id/studio', '@happydesigns/id/guide', 'docus'],
  colorMode: { disableTransition: true },
  appConfig: {
    idStudio: {
      document,
      sourcePath: 'brand.studio.json',
      ...(bundledPackage ? { packageAsset: '/studio-packages/id.tgz' } : {}),
      documentation: '/docs/introduction',
      templates: {
        docs: {
          label: 'Docs',
          owner: 'docus',
          route: '/docs/introduction',
          routePrefix: '/docs',
        },
      },
    },
    header: {
      title: document.theme.label,
      logo: {
        light: document.brand.assets?.logos?.wordmark?.src,
        dark: document.brand.assets?.logos?.wordmarkInverse?.src,
      },
    },
    github: false,
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
  image: { provider: 'none' },
})

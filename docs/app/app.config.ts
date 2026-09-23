import { createStudioDocument } from '../../src/studio'
import { createNuxtUiAppConfig } from '../../src'
import { idBrandGuide, nuxtUiBrandTheme } from '../../themes/nuxt-ui'

import { docsPresetDocuments } from '../presets'

const docsThumbnail = '/id-studio/templates/docs.png'

const nuxtUiAppConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  idStudio: {
    brands: docsPresetDocuments,
    home: '/',
    documentation: '/getting-started/introduction',
    document: createStudioDocument({ name: 'nuxt-ui', colors: {} }, nuxtUiBrandTheme),
    host: { name: 'happydesigns/id' },
    templates: { docs: { label: 'Docs', description: 'Docus navigation, search, prose and code examples.', thumbnail: docsThumbnail, owner: 'docus', route: '/getting-started/introduction', routePrefix: '/getting-started' } },
  },
  seo: {
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.',
  },
  header: {
    title: 'happydesigns/id',
    links: [
      { label: 'Docs', to: '/getting-started/introduction' },
      { label: 'Studio', to: '/studio' },
    ],
  },
  navigation: {
    sub: 'header',
  },
  github: {
    url: 'https://github.com/happydesigns/id',
    branch: 'main',
    rootDir: 'docs',
  },
  toc: {
    title: 'On this page',
  },
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
  id: {
    name: 'happydesigns-id-docs',
    theme: nuxtUiBrandTheme,
    defaultTheme: nuxtUiBrandTheme.name,
    themes: [
      ...Object.values(docsPresetDocuments).map(document => document.theme),
    ],
    guide: idBrandGuide,
  },
  ui: {
    ...nuxtUiAppConfig.ui,
  },
})

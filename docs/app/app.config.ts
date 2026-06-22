import {
  createNuxtUiAppConfig,
  nuxtUiBrandTheme
} from '../../src'
import {
  happydesignsBrandGuide,
  happydesignsBrandTheme
} from '../../themes/happydesigns'

const nuxtUiAppConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  seo: {
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.'
  },
  header: {
    title: '@happydesigns/id'
  },
  navigation: {
    sub: 'header'
  },
  github: {
    url: 'https://github.com/happydesigns/id',
    branch: 'main',
    rootDir: 'docs'
  },
  toc: {
    title: 'On this page'
  },
  assistant: {
    floatingInput: false,
    explainWithAi: false
  },
  id: {
    name: 'happydesigns-id-docs',
    theme: nuxtUiBrandTheme,
    defaultTheme: nuxtUiBrandTheme.name,
    themes: [
      happydesignsBrandTheme
    ],
    guide: happydesignsBrandGuide
  },
  ui: {
    ...nuxtUiAppConfig.ui
  }
})

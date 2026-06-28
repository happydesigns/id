import { createNuxtUiAppConfig } from '../../src'
import {
  sampleBrandTheme
} from '../../themes/sample-brand'
import { idBrandGuide, nuxtUiBrandTheme } from '../../themes/nuxt-ui'

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
      sampleBrandTheme
    ],
    guide: idBrandGuide
  },
  ui: {
    ...nuxtUiAppConfig.ui
  }
})

import { createNuxtUiAppConfig, nuxtUiBrandTheme, sampleBrandGuide, sampleThemes } from '../../src'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id-playground',
    theme: nuxtUiBrandTheme,
    themes: sampleThemes,
    guide: sampleBrandGuide
  },
  header: {
    title: '@happydesigns/id'
  },
  ui: nuxtUiConfig.ui
})

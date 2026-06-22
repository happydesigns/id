import { createNuxtUiAppConfig, idBrandGuide, nuxtUiBrandTheme } from '../src'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id',
    theme: nuxtUiBrandTheme,
    guide: idBrandGuide
  },
  ui: nuxtUiConfig.ui
})

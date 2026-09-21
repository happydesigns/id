import { createNuxtUiAppConfig, nuxtUiBrandTheme } from '../src'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id',
    theme: nuxtUiBrandTheme,
  },
  ui: nuxtUiConfig.ui,
})

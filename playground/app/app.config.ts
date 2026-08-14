import { createNuxtUiAppConfig, idBrandGuide } from '../../src'
import { nuxtUiBrandTheme } from '../../themes/nuxt-ui'
import { flexiblePlaygroundTheme } from './utils/adapter-validation'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id-playground',
    theme: nuxtUiBrandTheme,
    themes: [flexiblePlaygroundTheme],
    guide: idBrandGuide
  },
  header: {
    title: '@happydesigns/id'
  },
  ui: nuxtUiConfig.ui
})

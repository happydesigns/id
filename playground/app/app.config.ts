import { createNuxtUiAppConfig, idBrandGuide } from '../../src'
import { nuxtUiBrandTheme } from '../../themes/nuxt-ui'
import { createStudioDocument } from '../../src/studio'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id-playground',
    theme: nuxtUiBrandTheme,
    guide: idBrandGuide
  },
  idStudio: {
    document: createStudioDocument({ name: 'nuxt-ui', colors: {} }, nuxtUiBrandTheme)
  },
  header: {
    title: '@happydesigns/id'
  },
  ui: nuxtUiConfig.ui
})

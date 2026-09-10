import { createNuxtUiAppConfig, idBrandGuide } from '../../src'
import { nuxtUiBrandTheme } from '../../themes/nuxt-ui'
import { createStudioDocument } from '../../src/studio'
import { flexiblePlaygroundTheme } from './utils/adapter-validation'

const nuxtUiConfig = createNuxtUiAppConfig(nuxtUiBrandTheme)

export default defineAppConfig({
  id: {
    name: 'happydesigns-id-playground',
    theme: nuxtUiBrandTheme,
    themes: [flexiblePlaygroundTheme],
    guide: idBrandGuide
  },
  idStudio: {
    home: '/runtime',
    templates: { docs: { label: 'Docs', owner: 'docus', route: '/docs/introduction', routePrefix: '/docs' } },
    document: createStudioDocument({ name: 'nuxt-ui', colors: {} }, nuxtUiBrandTheme)
  },
  header: {
    title: '@happydesigns/id'
  },
  ui: nuxtUiConfig.ui
})

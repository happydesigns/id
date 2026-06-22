import { createNuxtUiAppConfig } from '@happydesigns/id'
import { brandGuide, brandTheme } from '../brand'

const nuxtUiConfig = createNuxtUiAppConfig(brandTheme)

export default defineAppConfig({
  id: {
    name: brandTheme.name,
    theme: brandTheme,
    guide: brandGuide
  },
  ui: nuxtUiConfig.ui
})

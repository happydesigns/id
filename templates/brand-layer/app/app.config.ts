import { createNuxtUiAppConfig } from '@happydesigns/id'
import { brandRuntimeAssets, brandTheme } from '../brand'

const nuxtUiConfig = createNuxtUiAppConfig(brandTheme)

export default defineAppConfig({
  id: {
    name: brandTheme.name,
    theme: brandTheme,
    assets: brandRuntimeAssets
  },
  ui: nuxtUiConfig.ui
})

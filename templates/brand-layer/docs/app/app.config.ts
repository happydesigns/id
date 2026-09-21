import { createNuxtUiAppConfig } from '@happydesigns/id'
import { brandGuide, brandRuntimeAssets, brandTheme } from '../../brand'

const nuxtUiConfig = createNuxtUiAppConfig(brandTheme)

export default defineAppConfig({
  ...nuxtUiConfig,
  id: {
    name: brandTheme.name,
    theme: brandTheme,
    assets: brandRuntimeAssets,
    guide: brandGuide,
  },
  docus: {
    locale: 'en',
    colorMode: '',
  },
  seo: {
    title: 'Example Brand',
    description: 'Reference guide for the Example Brand layer.',
  },
  header: {
    title: 'Example Brand',
  },
  socials: {},
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
})

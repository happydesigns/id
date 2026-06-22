import { createNuxtUiAppConfig, defineBrandTheme } from '@happydesigns/id'

const defaultTheme = defineBrandTheme({
  name: 'app-theme',
  label: 'App Theme',
  semanticColors: {
    primary: 'blue',
    secondary: 'slate',
    success: 'green',
    info: 'sky',
    warning: 'amber',
    error: 'red',
    neutral: 'slate'
  },
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-text': '#334155',
      '--ui-text-highlighted': '#020617',
      '--ui-border': '#E2E8F0'
    },
    dark: {
      '--ui-bg': '#020617',
      '--ui-text': '#E2E8F0',
      '--ui-text-highlighted': 'white',
      '--ui-border': '#1E293B'
    }
  }
})

const nuxtUiConfig = createNuxtUiAppConfig(defaultTheme)

export default defineAppConfig({
  id: {
    name: defaultTheme.name,
    theme: defaultTheme
  },
  ui: nuxtUiConfig.ui
})

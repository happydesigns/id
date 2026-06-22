import { defineBrandTheme } from '@happydesigns/id'

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
      '--ui-text': 'var(--ui-color-slate-700)',
      '--ui-text-highlighted': 'var(--ui-color-slate-950)',
      '--ui-border': 'var(--ui-color-slate-200)'
    },
    dark: {
      '--ui-bg': 'var(--ui-color-slate-950)',
      '--ui-text': 'var(--ui-color-slate-200)',
      '--ui-text-highlighted': 'white',
      '--ui-border': 'var(--ui-color-slate-800)'
    }
  }
})

export default defineAppConfig({
  id: {
    defaultTheme: defaultTheme.name,
    themes: [defaultTheme]
  },
  ui: {
    colors: defaultTheme.semanticColors
  }
})

import { neutralBrandTheme } from '../src/examples'

export default defineAppConfig({
  id: {
    defaultTheme: neutralBrandTheme.name,
    themes: [
      neutralBrandTheme
    ]
  },
  ui: {
    colors: neutralBrandTheme.semanticColors,
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'rounded-lg shadow-none'
      }
    }
  }
})

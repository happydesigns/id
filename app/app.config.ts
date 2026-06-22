import { nuxtUiBrandTheme } from '../src/examples'

export default defineAppConfig({
  id: {
    defaultTheme: nuxtUiBrandTheme.name,
    themes: [
      nuxtUiBrandTheme
    ]
  },
  ui: {
    colors: nuxtUiBrandTheme.semanticColors,
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

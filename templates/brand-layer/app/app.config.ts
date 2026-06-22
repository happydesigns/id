import { brandGuide, brandTheme } from '../brand.config'

export default defineAppConfig({
  id: {
    defaultTheme: brandTheme.name,
    themes: [brandTheme],
    guide: brandGuide
  },
  ui: {
    colors: brandTheme.semanticColors,
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'rounded-md shadow-none'
      }
    }
  }
})

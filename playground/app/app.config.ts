import { sampleBrandGuide, sampleThemes } from '../../src/examples'

export default defineAppConfig({
  id: {
    defaultTheme: 'nuxt-ui',
    themes: sampleThemes,
    guide: sampleBrandGuide
  },
  header: {
    title: '@happydesigns/id'
  },
  ui: {
    colors: sampleThemes[0].semanticColors,
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    }
  }
})

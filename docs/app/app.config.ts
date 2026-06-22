export default defineAppConfig({
  seo: {
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.'
  },
  header: {
    title: '@happydesigns/id'
  },
  navigation: {
    sub: 'header'
  },
  github: {
    url: 'https://github.com/happydesigns/id',
    branch: 'main',
    rootDir: 'docs'
  },
  toc: {
    title: 'On this page'
  },
  assistant: {
    floatingInput: false,
    explainWithAi: false
  },
  ui: {
    colors: {
      primary: 'green',
      secondary: 'slate',
      neutral: 'slate'
    },
    button: {
      defaultVariants: {
        color: 'primary'
      }
    }
  }
})

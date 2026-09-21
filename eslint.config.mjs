// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.tmp/**',
    'src/project-templates.generated.ts',
    'templates/project/**',
    'node_modules/**',
    'docs/.nuxt/**',
    'docs/.nuxt-dev/**',
    'playground/.nuxt-dev/**',
    'playground/.nuxt/**'
  ]
})

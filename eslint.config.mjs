// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.tmp/**',
    'node_modules/**',
    'docs/.nuxt/**',
    'docs/.nuxt-dev/**',
    'playground/.nuxt-dev/**',
    'playground/.nuxt/**'
  ]
})

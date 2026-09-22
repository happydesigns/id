// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    '.tmp/**',
    'src/project-templates.generated.ts',
    'templates/brand-layer/app/brand.config.ts',
    'node_modules/**',
    'docs/.nuxt/**',
    'docs/.nuxt-dev/**',
    'playground/.nuxt-dev/**',
    'playground/.nuxt/**',
  ],
}, {
  files: ['templates/project/**/app/pages/**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' },
})

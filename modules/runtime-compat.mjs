import { defineNuxtModule } from '@nuxt/kit'

const docusCssTemplateFilename = 'docus.css'

export default defineNuxtModule({
  meta: {
    name: '@happydesigns/id-runtime-compat'
  },
  setup(_options, nuxt) {
    nuxt.options.mdc = {
      ...nuxt.options.mdc,
      highlight: {
        ...nuxt.options.mdc?.highlight,
        noApiRoute: false
      }
    }

    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []

    nuxt.hook('modules:done', () => {
      const template = nuxt.options.build.templates.find((candidate) => {
        return candidate.filename === docusCssTemplateFilename
      })

      if (template) {
        // Nuxt dev can emit generated CSS templates as filesystem CSS URLs on Windows.
        template.write = true
      }
    })
  }
})

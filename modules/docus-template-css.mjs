import { defineNuxtModule } from '@nuxt/kit'

const docusCssTemplateFilename = 'docus.css'

export default defineNuxtModule({
  meta: {
    name: '@happydesigns/id-docus-template-css'
  },
  setup(_options, nuxt) {
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

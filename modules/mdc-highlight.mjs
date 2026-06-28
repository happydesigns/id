import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@happydesigns/id-mdc-highlight'
  },
  setup(_options, nuxt) {
    nuxt.options.mdc = {
      ...nuxt.options.mdc,
      highlight: {
        ...nuxt.options.mdc?.highlight,
        noApiRoute: false
      }
    }
  }
})

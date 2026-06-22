import { defineNuxtPlugin, useHead } from '#imports'
import { createThemeCssVars } from '../../src'
import { useBrandTheme } from '../composables/useBrandTheme'

export default defineNuxtPlugin(() => {
  const brandTheme = useBrandTheme()

  if (brandTheme.currentTheme.value) {
    if (import.meta.server) {
      useHead({
        style: [
          {
            id: 'happydesigns-id-theme',
            innerHTML: createThemeCssVars(brandTheme.currentTheme.value)
          }
        ]
      })
    }

    if (import.meta.client) {
      brandTheme.setTheme(brandTheme.currentTheme.value.name)
    }
  }

  return {
    provide: {
      brandTheme
    }
  }
})

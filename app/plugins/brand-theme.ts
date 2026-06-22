import { defineNuxtPlugin, useHead, watch } from '#imports'
import { createThemeCssVars } from '../../src'
import { useBrandTheme } from '../composables/useBrandTheme'

export default defineNuxtPlugin(() => {
  const brandTheme = useBrandTheme()

  function updateThemeStyleElement(theme: NonNullable<typeof brandTheme.currentTheme.value>) {
    const styleElement = document.getElementById('happydesigns-id-theme')

    if (styleElement) {
      styleElement.textContent = createThemeCssVars(theme)
    }
  }

  function syncClientTheme() {
    const theme = brandTheme.currentTheme.value

    if (!theme) {
      return
    }

    brandTheme.applyTheme(theme)
    updateThemeStyleElement(theme)
  }

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
      watch(() => brandTheme.currentTheme.value, syncClientTheme, { immediate: true })

      new MutationObserver(syncClientTheme).observe(document.documentElement, {
        attributeFilter: ['class'],
        attributes: true
      })
    }
  }

  return {
    provide: {
      brandTheme
    }
  }
})

import { defineNuxtPlugin, onNuxtReady, useHead } from '#imports'
import { watch } from 'vue'
import { brandThemeStyleElementId, createThemeCssVars } from '../../src'
import { useBrandTheme } from '../composables/useBrandTheme'

export default defineNuxtPlugin(() => {
  // The opt-in Studio bridge owns the theme in its isolated documents.
  if (import.meta.client && window.parent !== window && (window.location.pathname === '/studio/preview' || new URLSearchParams(window.location.search).has('idPreview'))) return
  const brandTheme = useBrandTheme()

  function suppressTransitionsDuringThemeSync() {
    const styleElement = document.createElement('style')
    styleElement.textContent = '* { transition: none !important; }'
    document.head.appendChild(styleElement)

    // Flush the temporary rule before CSS variables change. Keep it through
    // the next paint because color-mode and MutationObserver updates run in
    // separate microtasks.
    void window.getComputedStyle(styleElement).opacity
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => styleElement.remove())
    })
  }

  function updateThemeStyleElement(theme: NonNullable<typeof brandTheme.currentTheme.value>) {
    const styleElement = document.getElementById(brandThemeStyleElementId)

    if (styleElement) {
      styleElement.textContent = createThemeCssVars(theme)
    }
  }

  function syncClientTheme() {
    if (document.documentElement.hasAttribute('data-id-studio-theme')) return
    const theme = brandTheme.currentTheme.value

    if (!theme) {
      return
    }

    suppressTransitionsDuringThemeSync()
    brandTheme.applyTheme(theme)
    updateThemeStyleElement(theme)
  }

  if (brandTheme.currentTheme.value) {
    if (import.meta.server) {
      useHead({
        style: [
          {
            id: brandThemeStyleElementId,
            innerHTML: createThemeCssVars(brandTheme.currentTheme.value)
          }
        ]
      })
    }

    if (import.meta.client) {
      watch(() => brandTheme.currentTheme.value, syncClientTheme, { immediate: true })

      onNuxtReady(() => {
        if (document.documentElement.hasAttribute('data-id-studio-theme')) return
        brandTheme.restorePersistedTheme()
      })

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

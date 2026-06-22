import { computed } from 'vue'
import { updateAppConfig, useAppConfig, useState } from '#imports'
import { applyBrandTheme as applyBrandThemeCore, createNuxtUiAppConfig, normalizeBrandThemes } from '../../src'
import type { BrandRuntimeConfig, BrandTheme } from '../../src'

type IdentityAppConfig = {
  id?: BrandRuntimeConfig
}

function getThemeList(config: IdentityAppConfig) {
  return normalizeBrandThemes(config.id?.themes ?? [])
}

function resolveInitialThemeName(config: IdentityAppConfig) {
  const themes = getThemeList(config)
  return config.id?.defaultTheme ?? themes[0]?.name ?? ''
}

function resolveDocumentMode() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useBrandTheme() {
  const appConfig = useAppConfig() as IdentityAppConfig
  const currentName = useState<string>('happydesigns:id:theme', () => resolveInitialThemeName(appConfig))

  const themes = computed(() => getThemeList(appConfig))
  const currentTheme = computed(() => themes.value.find(theme => theme.name === currentName.value))

  function setTheme(name: string) {
    const theme = themes.value.find(item => item.name === name)

    if (!theme) {
      throw new Error(`Unknown brand theme "${name}"`)
    }

    if (import.meta.client) {
      applyBrandThemeCore(theme, {
        mode: resolveDocumentMode(),
        target: document.documentElement,
        updateAppConfig
      })
    } else {
      updateAppConfig(createNuxtUiAppConfig(theme))
    }

    currentName.value = theme.name
    return theme
  }

  function applyTheme(theme: BrandTheme) {
    if (import.meta.client) {
      applyBrandThemeCore(theme, {
        mode: resolveDocumentMode(),
        target: document.documentElement,
        updateAppConfig
      })
    } else {
      updateAppConfig(createNuxtUiAppConfig(theme))
    }

    currentName.value = theme.name
    return theme
  }

  return {
    themes,
    currentName,
    currentTheme,
    setTheme,
    applyTheme
  }
}

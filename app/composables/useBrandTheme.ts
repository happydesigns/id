import { computed, updateAppConfig, useAppConfig, useState } from '#imports'
import { applyBrandTheme as applyBrandThemeCore, createNuxtUiAppConfig, resolveBrandThemes } from '../../src'
import type { BrandRuntimeConfig, BrandTheme } from '../../src'

type IdentityAppConfig = {
  id?: BrandRuntimeConfig
}

function getThemeList(config: IdentityAppConfig) {
  return resolveBrandThemes(config.id)
}

function resolveInitialThemeName(config: IdentityAppConfig) {
  const themes = getThemeList(config)
  return config.id?.defaultTheme ?? config.id?.theme?.name ?? themes[0]?.name ?? ''
}

function resolveTheme(themes: BrandTheme[], name: string) {
  return themes.find(theme => theme.name === name) ?? themes[0]
}

function resolveDocumentMode() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useBrandTheme() {
  const appConfig = useAppConfig() as IdentityAppConfig
  const currentName = useState<string>('happydesigns:id:theme', () => resolveInitialThemeName(appConfig))

  const themes = computed(() => getThemeList(appConfig))
  const currentTheme = computed(() => resolveTheme(themes.value, currentName.value))
  const selectedName = computed(() => currentTheme.value?.name ?? '')

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
    selectedName,
    currentTheme,
    setTheme,
    applyTheme
  }
}

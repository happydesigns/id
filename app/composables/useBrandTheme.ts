import { updateAppConfig, useAppConfig, useCookie, useState } from '#imports'
import { computed } from 'vue'
import { applyBrandTheme as applyBrandThemeCore, createBrandThemeCookieName, createBrandThemeStateKey, createNuxtUiAppConfig, resolveBrandThemeName, resolveBrandThemes } from '../../src'
import type { BrandRuntimeOnlyConfig, BrandTheme, NuxtUiAppConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandRuntimeOnlyConfig
}

function getThemeList(config: IdentityAppConfig) {
  return resolveBrandThemes(config.id)
}

function getThemeCookieKey(config: IdentityAppConfig) {
  return createBrandThemeCookieName(config.id?.name)
}

function useThemeCookie(config: IdentityAppConfig) {
  return useCookie<string | undefined>(getThemeCookieKey(config), {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}

function readPersistedThemeName(config: IdentityAppConfig, themes: BrandTheme[]) {
  const themeCookie = useThemeCookie(config)
  const themeName = themeCookie.value
  if (!themeName) {
    return undefined
  }
  if (themes.some(theme => theme.name === themeName)) {
    return themeName
  }
  themeCookie.value = undefined
  return undefined
}

function persistThemeName(config: IdentityAppConfig, themeName: string) {
  const themeCookie = useThemeCookie(config)
  themeCookie.value = themeName
}

function resolveInitialThemeName(config: IdentityAppConfig) {
  const themes = getThemeList(config)
  return resolveBrandThemeName(config.id, themes)
}

function resolveTheme(themes: BrandTheme[], name: string) {
  return themes.find(theme => theme.name === name) ?? themes[0]
}

function resolveDocumentMode() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

type SetThemeOptions = {
  persist?: boolean
}

function updateNuxtUiAppConfig(config: NuxtUiAppConfig) {
  updateAppConfig(config as Parameters<typeof updateAppConfig>[0])
}

export function useBrandTheme() {
  const appConfig = useAppConfig() as IdentityAppConfig
  const currentName = useState<string>(createBrandThemeStateKey(appConfig.id?.name), () => resolveInitialThemeName(appConfig))
  const themes = computed(() => getThemeList(appConfig))
  const currentTheme = computed(() => resolveTheme(themes.value, currentName.value))
  const selectedName = computed(() => currentTheme.value?.name ?? '')
  function setTheme(name: string, options: SetThemeOptions = {}) {
    const theme = themes.value.find(item => item.name === name)
    if (!theme) {
      throw new Error(`Unknown brand theme "${name}"`)
    }
    if (import.meta.client) {
      applyBrandThemeCore(theme, {
        mode: resolveDocumentMode(),
        target: document.documentElement,
        updateAppConfig: updateNuxtUiAppConfig,
      })
    }
    else {
      updateNuxtUiAppConfig(createNuxtUiAppConfig(theme))
    }
    currentName.value = theme.name
    if (options.persist ?? true) {
      persistThemeName(appConfig, theme.name)
    }
    return theme
  }
  function applyTheme(theme: BrandTheme) {
    if (import.meta.client) {
      applyBrandThemeCore(theme, {
        mode: resolveDocumentMode(),
        target: document.documentElement,
        updateAppConfig: updateNuxtUiAppConfig,
      })
    }
    else {
      updateNuxtUiAppConfig(createNuxtUiAppConfig(theme))
    }
    currentName.value = theme.name
    return theme
  }
  function restorePersistedTheme() {
    const themeName = readPersistedThemeName(appConfig, themes.value)
    if (!themeName || themeName === currentName.value) {
      return currentTheme.value
    }
    return setTheme(themeName, {
      persist: false,
    })
  }
  return {
    themes,
    currentName,
    selectedName,
    currentTheme,
    setTheme,
    applyTheme,
    restorePersistedTheme,
  }
}

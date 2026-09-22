import { useAppConfig, useCookie, useState } from '#imports'
import { computed } from 'vue'
import { copyConfig, replaceThemeUi } from '../../src/ui-config'
import { applyBrandTheme as applyBrandThemeCore, createBrandThemeCookieName, createBrandThemeStateKey, createNuxtUiAppConfig, resolveBrandThemeName, resolveBrandThemes } from '../../src'
import type { BrandRuntimeOnlyConfig, BrandTheme, NuxtUiAppConfig } from '../../src'

const hostConfigs = new WeakMap<object, { ui: Record<string, unknown>, seed: Record<string, unknown> }>()

type IdentityAppConfig = {
  id?: BrandRuntimeOnlyConfig
  ui?: Record<string, unknown>
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
  const persistedName = useThemeCookie(config).value
  if (persistedName && themes.some(theme => theme.name === persistedName)) {
    return persistedName
  }
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

export function useBrandTheme() {
  const appConfig = useAppConfig() as IdentityAppConfig
  const currentName = useState<string>(createBrandThemeStateKey(appConfig.id?.name), () => resolveInitialThemeName(appConfig))
  const localThemes = useState<BrandTheme[]>(createBrandThemeStateKey(appConfig.id?.name) + ':local', () => [])
  const themes = computed(() => [...getThemeList(appConfig).filter(theme => !localThemes.value.some(local => local.name === theme.name)), ...localThemes.value])
  if (!hostConfigs.has(appConfig)) hostConfigs.set(appConfig, { ui: copyConfig(appConfig.ui ?? {}), seed: copyConfig(appConfig.id?.theme?.ui ?? {}) })
  function updateNuxtUiAppConfig(config: NuxtUiAppConfig) {
    const host = hostConfigs.get(appConfig)!
    appConfig.ui = replaceThemeUi(host.ui, host.seed, config.ui ?? {})
  }
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
    localThemes,
    currentName,
    selectedName,
    currentTheme,
    setTheme,
    applyTheme,
    restorePersistedTheme,
  }
}

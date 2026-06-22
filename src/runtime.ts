import { applyCssVariables } from './css'
import { createNuxtUiAppConfig } from './nuxt-ui'
import type { ApplyBrandThemeOptions, BrandTheme } from './types'
import { validateBrandTheme } from './validation'

export function applyBrandTheme(theme: BrandTheme, options: ApplyBrandThemeOptions = {}) {
  const validatedTheme = validateBrandTheme(theme)
  const mode = options.mode ?? 'light'

  if (options.target) {
    const cssVariables = validatedTheme.cssVariables?.[mode] ?? {}
    const typographyVariables = {
      ...(validatedTheme.typography?.sans ? { '--font-sans': validatedTheme.typography.sans } : {}),
      ...(validatedTheme.typography?.mono ? { '--font-mono': validatedTheme.typography.mono } : {}),
      ...(validatedTheme.typography?.display ? { '--font-display': validatedTheme.typography.display } : {})
    }

    applyCssVariables(options.target, {
      ...typographyVariables,
      ...cssVariables
    }, {
      clearPrevious: true
    })
  }

  options.updateAppConfig?.(createNuxtUiAppConfig(validatedTheme))

  return validatedTheme
}

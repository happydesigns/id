import type { BrandRuntimeConfig, BrandTheme } from './types'

export function normalizeBrandThemes(themes: readonly BrandTheme[] = []): BrandTheme[] {
  const themesByName = new Map<string, BrandTheme>()

  for (const theme of themes) {
    themesByName.set(theme.name, theme)
  }

  return Array.from(themesByName.values())
}

export function resolveBrandThemes(config: Pick<BrandRuntimeConfig, 'theme' | 'themes'> = {}): BrandTheme[] {
  const additionalThemes = normalizeBrandThemes(config.themes ?? [])

  if (!config.theme) {
    return additionalThemes
  }

  return [
    config.theme,
    ...additionalThemes.filter(theme => theme.name !== config.theme?.name)
  ]
}

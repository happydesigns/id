import type { BrandRuntimeOnlyConfig, BrandTheme } from './types.js'

export function normalizeBrandThemes(themes: readonly BrandTheme[] = []): BrandTheme[] {
  const themesByName = new Map<string, BrandTheme>()
  for (const theme of themes) {
    themesByName.set(theme.name, theme)
  }
  return Array.from(themesByName.values())
}

export function resolveBrandThemes(config: Pick<BrandRuntimeOnlyConfig, 'theme' | 'themes'> = {}): BrandTheme[] {
  const additionalThemes = normalizeBrandThemes(config.themes ?? [])
  if (!config.theme) {
    return additionalThemes
  }
  return [
    config.theme,
    ...additionalThemes.filter(theme => theme.name !== config.theme?.name),
  ]
}

export function resolveBrandThemeName(
  config: Pick<BrandRuntimeOnlyConfig, 'defaultTheme' | 'theme' | 'themes'> = {},
  themes: readonly BrandTheme[] = resolveBrandThemes(config),
): string {
  const candidates = [
    config.defaultTheme,
    config.theme?.name,
  ].filter((name): name is string => Boolean(name))
  for (const name of candidates) {
    if (themes.some(theme => theme.name === name)) {
      return name
    }
  }
  return themes[0]?.name ?? ''
}

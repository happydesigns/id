import type { BrandTheme } from './types'

export function normalizeBrandThemes(themes: readonly BrandTheme[] = []): BrandTheme[] {
  const themesByName = new Map<string, BrandTheme>()

  for (const theme of themes) {
    themesByName.set(theme.name, theme)
  }

  return Array.from(themesByName.values())
}

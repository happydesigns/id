import type { BrandTheme } from './types'

function cleanObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  ) as T
}

export function createNuxtUiAppConfig(theme: BrandTheme) {
  const ui = {
    ...(theme.ui ?? {}),
    ...(theme.semanticColors ? { colors: theme.semanticColors } : {})
  }

  return cleanObject({
    ui: Object.keys(ui).length > 0 ? ui : undefined
  })
}

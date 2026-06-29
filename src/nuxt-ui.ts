import type { BrandTheme, NuxtUiAppConfig } from './types'

export function createNuxtUiAppConfig(theme: BrandTheme): NuxtUiAppConfig {
  const ui = theme.ui ?? {}

  return { ui: ui as NuxtUiAppConfig['ui'] }
}

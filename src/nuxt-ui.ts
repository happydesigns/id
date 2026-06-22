import type { AppConfigInput } from 'nuxt/schema'
import type { BrandTheme } from './types'

export type NuxtUiAppConfig = {
  ui: NonNullable<AppConfigInput['ui']>
}

export function createNuxtUiAppConfig(theme: BrandTheme): NuxtUiAppConfig {
  const ui = {
    ...(theme.ui ?? {}),
    ...(theme.semanticColors ? { colors: theme.semanticColors } : {})
  }

  return { ui: ui as NonNullable<AppConfigInput['ui']> }
}

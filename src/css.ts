import type { BrandCssVariables, BrandTheme, BrandThemeStyleTarget, ThemeCssOptions, ThemeMode } from './types'

const DEFAULT_LIGHT_SELECTOR = ':root'
const DEFAULT_DARK_SELECTOR = '.dark'
const appliedCssVariableNames = new WeakMap<BrandThemeStyleTarget, Set<string>>()

type ApplyCssVariablesOptions = {
  clearPrevious?: boolean
}

function normalizeCssVariableName(name: string) {
  return name.startsWith('--') ? name : `--${name}`
}

function renderDeclarations(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([name, value]) => `  ${normalizeCssVariableName(name)}: ${value};`)
    .join('\n')
}

function mergeTypography(
  variables: Record<string, string>,
  theme: Pick<BrandTheme, 'typography'>,
  includeTypography: boolean
) {
  if (!includeTypography || !theme.typography) {
    return variables
  }

  return {
    ...variables,
    ...(theme.typography.sans ? { '--font-sans': theme.typography.sans } : {}),
    ...(theme.typography.mono ? { '--font-mono': theme.typography.mono } : {}),
    ...(theme.typography.display ? { '--font-display': theme.typography.display } : {})
  }
}

export function createThemeCssDeclarations(theme: BrandTheme, mode: ThemeMode = 'light') {
  const variables = theme.cssVariables?.[mode] ?? {}

  return renderDeclarations(mergeTypography(variables, theme, true))
}

export function createThemeCssVars(theme: BrandTheme, options: ThemeCssOptions = {}) {
  const lightSelector = options.lightSelector ?? DEFAULT_LIGHT_SELECTOR
  const darkSelector = options.darkSelector ?? DEFAULT_DARK_SELECTOR
  const includeTypography = options.includeTypography ?? true
  const variables: BrandCssVariables = theme.cssVariables ?? {}

  const lightVariables = mergeTypography(variables.light ?? {}, theme, includeTypography)
  const darkVariables = variables.dark ?? {}
  const blocks: string[] = []

  if (Object.keys(lightVariables).length > 0) {
    blocks.push(`${lightSelector} {\n${renderDeclarations(lightVariables)}\n}`)
  }

  if (Object.keys(darkVariables).length > 0) {
    blocks.push(`${darkSelector} {\n${renderDeclarations(darkVariables)}\n}`)
  }

  return blocks.join('\n\n')
}

export function applyCssVariables(
  target: BrandThemeStyleTarget,
  variables: Record<string, string> = {},
  options: ApplyCssVariablesOptions = {}
) {
  const normalizedVariables = Object.fromEntries(
    Object.entries(variables).map(([name, value]) => [normalizeCssVariableName(name), value])
  )
  const nextVariableNames = new Set(Object.keys(normalizedVariables))

  if (options.clearPrevious) {
    const previousVariableNames = appliedCssVariableNames.get(target) ?? new Set()

    for (const name of previousVariableNames) {
      if (!nextVariableNames.has(name)) {
        target.style.removeProperty(name)
      }
    }

    appliedCssVariableNames.set(target, nextVariableNames)
  }

  for (const [name, value] of Object.entries(normalizedVariables)) {
    target.style.setProperty(name, value)
  }
}

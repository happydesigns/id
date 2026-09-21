import { defineBrandGuide, defineBrandTheme } from '../../src/validation'

const nuxtUiColors = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'sky',
  warning: 'amber',
  error: 'red',
  neutral: 'slate',
}

const nuxtUiComponentDefaults = { colors: nuxtUiColors }

export const nuxtUiBrandTheme = defineBrandTheme({
  name: 'nuxt-ui',
  label: 'Nuxt UI',
  description: 'A default Nuxt UI baseline with standard semantic colors, radius, surfaces, and component defaults.',
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-bg-muted': 'var(--ui-color-neutral-50)',
      '--ui-bg-elevated': 'var(--ui-color-neutral-100)',
      '--ui-bg-accented': 'var(--ui-color-neutral-200)',
      '--ui-bg-inverted': 'var(--ui-color-neutral-950)',
      '--ui-text': 'var(--ui-color-neutral-700)',
      '--ui-text-highlighted': 'var(--ui-color-neutral-950)',
      '--ui-text-muted': 'var(--ui-color-neutral-500)',
      '--ui-text-dimmed': 'var(--ui-color-neutral-400)',
      '--ui-text-inverted': 'white',
      '--ui-border': 'var(--ui-color-neutral-200)',
      '--ui-border-muted': 'var(--ui-color-neutral-100)',
      '--ui-border-accented': 'var(--ui-color-neutral-300)',
      '--ui-radius': '0.375rem',
    },
    dark: {
      '--ui-bg': 'var(--ui-color-neutral-950)',
      '--ui-bg-muted': 'var(--ui-color-neutral-900)',
      '--ui-bg-elevated': 'var(--ui-color-neutral-800)',
      '--ui-bg-accented': 'var(--ui-color-neutral-800)',
      '--ui-bg-inverted': 'white',
      '--ui-text': 'var(--ui-color-neutral-200)',
      '--ui-text-highlighted': 'white',
      '--ui-text-muted': 'var(--ui-color-neutral-400)',
      '--ui-text-dimmed': 'var(--ui-color-neutral-500)',
      '--ui-text-inverted': 'var(--ui-color-neutral-950)',
      '--ui-border': 'var(--ui-color-neutral-800)',
      '--ui-border-muted': 'var(--ui-color-neutral-900)',
      '--ui-border-accented': 'var(--ui-color-neutral-700)',
      '--ui-radius': '0.375rem',
    },
  },
  ui: nuxtUiComponentDefaults,
})

export const neutralBrandTheme = nuxtUiBrandTheme

export const idBrandGuide = defineBrandGuide({
  name: 'happydesigns-id',
  packageName: '@happydesigns/id',
  title: 'happydesigns id',
  description: 'A Nuxt UI identity baseline for brand layers, token-driven app config, and runtime-safe theme mechanics.',
  semanticColors: nuxtUiColors,
  cssVariables: nuxtUiBrandTheme.cssVariables,
  typography: nuxtUiBrandTheme.typography,
  ui: nuxtUiBrandTheme.ui,
  voice: {
    attributes: ['clear', 'technical', 'brand-neutral'],
    dos: [
      'Keep product behavior outside the brand layer.',
      'Map brand choices to Nuxt UI semantic roles first.',
      'Use runtime switching only for values that are already shipped.',
    ],
    donts: [
      'Do not make arbitrary product components depend on a concrete brand.',
      'Do not hide domain behavior inside identity configuration.',
    ],
  },
  componentCoverage: [
    {
      family: 'Actions',
      components: ['UButton', 'UBadge', 'UDropdownMenu'],
      status: 'verified',
    },
    {
      family: 'Forms',
      components: ['UInput', 'UTextarea', 'USelect', 'UCheckbox'],
      status: 'verified',
    },
    {
      family: 'Surfaces',
      components: ['UCard', 'UAlert', 'UTable', 'UHeader'],
      status: 'verified',
    },
  ],
  usage: {
    useFor: ['Nuxt UI projects', 'brand layers', 'runtime-safe theme values'],
    avoid: ['authorization', 'domain behavior', 'server credentials'],
    runtimeLimits: ['Runtime themes only affect shipped CSS variables and app config.'],
  },
})

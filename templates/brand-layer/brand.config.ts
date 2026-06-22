import { defineBrandGuide, defineBrandTheme } from '@happydesigns/id'

export const brandTheme = defineBrandTheme({
  name: 'example-brand',
  label: 'Example Brand',
  semanticColors: {
    primary: 'brand',
    secondary: 'slate',
    success: 'green',
    info: 'sky',
    warning: 'amber',
    error: 'red',
    neutral: 'slate'
  },
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-bg-muted': 'var(--ui-color-slate-50)',
      '--ui-bg-elevated': 'var(--ui-color-slate-100)',
      '--ui-text': 'var(--ui-color-slate-700)',
      '--ui-text-highlighted': 'var(--ui-color-slate-950)',
      '--ui-border': 'var(--ui-color-slate-200)',
      '--ui-radius': '0.375rem'
    },
    dark: {
      '--ui-bg': 'var(--ui-color-slate-950)',
      '--ui-bg-muted': 'var(--ui-color-slate-900)',
      '--ui-bg-elevated': 'var(--ui-color-slate-900)',
      '--ui-text': 'var(--ui-color-slate-200)',
      '--ui-text-highlighted': 'white',
      '--ui-border': 'var(--ui-color-slate-800)'
    }
  }
})

export const brandGuide = defineBrandGuide({
  name: 'example-brand',
  packageName: '@example/brand',
  title: 'Example Brand',
  description: 'A reusable Nuxt UI brand layer.',
  semanticColors: brandTheme.semanticColors,
  cssVariables: brandTheme.cssVariables,
  typography: brandTheme.typography,
  usage: {
    useFor: ['Nuxt UI apps', 'Docus docs', 'brand-specific presentation'],
    avoid: ['domain behavior', 'authorization', 'runtime credentials']
  }
})

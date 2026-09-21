import { defineBrandGuide, defineBrandTheme } from '../../src/index.js'

const sampleBrandColors = {
  primary: 'sample',
  secondary: 'teal',
  success: 'emerald',
  info: 'sky',
  warning: 'amber',
  error: 'rose',
  neutral: 'slate',
}

const sampleBrandUiDefaults = {
  colors: sampleBrandColors,
  button: {
    slots: {
      base: 'rounded-md font-medium',
    },
    defaultVariants: {
      color: 'primary',
      variant: 'solid',
      size: 'md',
    },
  },
  badge: {
    slots: {
      base: 'rounded-md font-medium ring-1 ring-inset',
    },
    defaultVariants: {
      color: 'neutral',
      variant: 'subtle',
      size: 'sm',
    },
  },
  card: {
    slots: {
      root: 'rounded-md bg-default shadow-none transition-colors',
      header: 'border-b border-default',
      footer: 'border-t border-default',
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
  input: {
    slots: {
      base: 'rounded-md bg-default text-highlighted ring-default focus-visible:ring-primary',
    },
    defaultVariants: {
      color: 'primary',
      variant: 'outline',
      size: 'md',
    },
  },
  alert: {
    slots: {
      root: 'rounded-md border shadow-none',
    },
    defaultVariants: {
      variant: 'subtle',
    },
  },
  table: {
    slots: {
      th: 'font-semibold text-muted',
      td: 'text-default',
    },
  },
}

export const sampleBrandTheme = defineBrandTheme({
  name: 'sample-brand',
  label: 'Sample Brand',
  description: 'Neutral reference theme for id documentation examples.',
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-bg-muted': '#F8FAFC',
      '--ui-bg-elevated': '#EEF2FF',
      '--ui-bg-accented': '#DBEAFE',
      '--ui-bg-inverted': '#0F172A',
      '--ui-text': '#334155',
      '--ui-text-highlighted': '#0F172A',
      '--ui-text-muted': '#64748B',
      '--ui-text-dimmed': '#94A3B8',
      '--ui-text-inverted': 'white',
      '--ui-border': '#CBD5E1',
      '--ui-border-muted': '#E2E8F0',
      '--ui-primary': '#2563EB',
      '--ui-secondary': '#0F766E',
      '--ui-success': '#059669',
      '--ui-info': '#0284C7',
      '--ui-warning': '#D97706',
      '--ui-error': '#E11D48',
      '--ui-radius': '0.375rem',
      '--sample-surface-accent': '#EEF2FF',
    },
    dark: {
      '--ui-bg': '#0F172A',
      '--ui-bg-muted': '#111827',
      '--ui-bg-elevated': '#1E293B',
      '--ui-bg-accented': '#334155',
      '--ui-bg-inverted': 'white',
      '--ui-text': '#CBD5E1',
      '--ui-text-highlighted': 'white',
      '--ui-text-muted': '#94A3B8',
      '--ui-text-dimmed': '#64748B',
      '--ui-text-inverted': '#0F172A',
      '--ui-border': '#334155',
      '--ui-border-muted': '#1E293B',
      '--ui-primary': '#60A5FA',
      '--ui-secondary': '#2DD4BF',
      '--ui-success': '#34D399',
      '--ui-info': '#38BDF8',
      '--ui-warning': '#FBBF24',
      '--ui-error': '#FB7185',
      '--ui-radius': '0.375rem',
      '--sample-surface-accent': '#1E293B',
    },
  },
  ui: sampleBrandUiDefaults,
})

export const sampleBrandGuide = defineBrandGuide({
  name: 'sample-brand',
  packageName: '@example/brand',
  title: 'Sample Brand',
  description: 'Reference identity contract used by id documentation to demonstrate a concrete brand layer shape.',
  semanticColors: sampleBrandColors,
  cssVariables: sampleBrandTheme.cssVariables,
  typography: sampleBrandTheme.typography,
  ui: sampleBrandTheme.ui,
  usage: {
    useFor: ['runtime theme previews', 'contract demonstrations', 'starter comparisons'],
    avoid: ['brand doctrine', 'product behavior', 'authorization', 'runtime credentials'],
  },
})

import { defineBrandGuide, defineBrandTheme } from './validation'

export const neutralBrandTheme = defineBrandTheme({
  name: 'neutral',
  label: 'Neutral',
  description: 'A quiet neutral baseline for brand-neutral Nuxt UI applications.',
  semanticColors: {
    primary: 'blue',
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
      '--ui-bg-muted': '#F8FAFC',
      '--ui-bg-elevated': '#F1F5F9',
      '--ui-bg-accented': '#E2E8F0',
      '--ui-bg-inverted': '#020617',
      '--ui-text': '#334155',
      '--ui-text-highlighted': '#020617',
      '--ui-text-muted': '#64748B',
      '--ui-text-dimmed': '#94A3B8',
      '--ui-text-inverted': 'white',
      '--ui-border': '#E2E8F0',
      '--ui-border-muted': '#F1F5F9',
      '--ui-radius': '0.375rem'
    },
    dark: {
      '--ui-bg': '#020617',
      '--ui-bg-muted': '#0F172A',
      '--ui-bg-elevated': '#0F172A',
      '--ui-bg-accented': '#1E293B',
      '--ui-bg-inverted': 'white',
      '--ui-text': '#E2E8F0',
      '--ui-text-highlighted': 'white',
      '--ui-text-muted': '#94A3B8',
      '--ui-text-dimmed': '#64748B',
      '--ui-text-inverted': '#020617',
      '--ui-border': '#1E293B',
      '--ui-border-muted': '#0F172A'
    }
  },
  ui: {
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'rounded-lg shadow-none'
      }
    }
  }
})

export const editorialBrandTheme = defineBrandTheme({
  name: 'editorial',
  label: 'Editorial',
  description: 'A warmer editorial sample theme that demonstrates runtime CSS variable switching.',
  semanticColors: {
    primary: 'orange',
    secondary: 'teal',
    success: 'green',
    info: 'cyan',
    warning: 'amber',
    error: 'rose',
    neutral: 'stone'
  },
  typography: {
    sans: 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  cssVariables: {
    light: {
      '--ui-bg': '#FFFCF7',
      '--ui-bg-muted': '#F7EFE4',
      '--ui-bg-elevated': '#F2E6D6',
      '--ui-bg-accented': '#E5D3BF',
      '--ui-bg-inverted': '#211B16',
      '--ui-text': '#43382F',
      '--ui-text-highlighted': '#211B16',
      '--ui-text-muted': '#75665A',
      '--ui-text-dimmed': '#9B8979',
      '--ui-text-inverted': '#FFFCF7',
      '--ui-border': '#D8C5B0',
      '--ui-border-muted': '#E8DACB',
      '--ui-radius': '0.25rem'
    },
    dark: {
      '--ui-bg': '#211B16',
      '--ui-bg-muted': '#2B241E',
      '--ui-bg-elevated': '#352D25',
      '--ui-bg-accented': '#4A3F35',
      '--ui-bg-inverted': '#FFFCF7',
      '--ui-text': '#EADCCD',
      '--ui-text-highlighted': '#FFF7ED',
      '--ui-text-muted': '#C8B7A5',
      '--ui-text-dimmed': '#A48F7C',
      '--ui-text-inverted': '#211B16',
      '--ui-border': '#4A3F35',
      '--ui-border-muted': '#352D25'
    }
  },
  ui: {
    button: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid'
      }
    },
    card: {
      slots: {
        root: 'rounded-sm shadow-none'
      }
    }
  }
})

export const sampleBrandGuide = defineBrandGuide({
  name: 'sample-brand',
  packageName: '@example/brand',
  title: 'Sample Brand',
  description: 'A complete sample brand guide used to demonstrate the @happydesigns/id contract.',
  palette: {
    brand: {
      50: '#FFF7ED',
      500: '#F97316',
      950: '#431407'
    },
    neutral: {
      50: '#FAFAF9',
      500: '#78716C',
      950: '#1C1917'
    }
  },
  semanticColors: editorialBrandTheme.semanticColors,
  cssVariables: editorialBrandTheme.cssVariables,
  typography: editorialBrandTheme.typography,
  voice: {
    attributes: ['clear', 'direct', 'warm'],
    dos: ['Name the user action directly.', 'Explain identity decisions through reusable rules.'],
    donts: ['Do not hide product behavior behind brand language.']
  },
  componentCoverage: [
    {
      family: 'Actions',
      components: ['UButton', 'UBadge', 'UDropdownMenu'],
      status: 'documented'
    },
    {
      family: 'Forms',
      components: ['UInput', 'UTextarea', 'USelect', 'UCheckbox'],
      status: 'tokenized'
    }
  ],
  usage: {
    useFor: ['Nuxt UI projects', 'brand layers', 'runtime theme packs'],
    avoid: ['authorization', 'domain behavior', 'server credentials'],
    runtimeLimits: ['Runtime themes only affect shipped CSS variables and app config.']
  }
})

export const sampleThemes = [
  neutralBrandTheme,
  editorialBrandTheme
]

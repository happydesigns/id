import { defineBrandGuide, defineBrandTheme } from './validation'

const nuxtUiColors = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'sky',
  warning: 'amber',
  error: 'red',
  neutral: 'slate'
}

const nuxtUiComponentDefaults = {
  colors: nuxtUiColors,
  button: {
    slots: {
      base: 'rounded-md font-medium'
    },
    defaultVariants: {
      color: 'primary',
      variant: 'solid',
      size: 'md'
    }
  },
  card: {
    slots: {
      root: 'rounded-lg shadow-none',
      header: 'p-4 sm:px-6',
      body: 'p-4 sm:p-6',
      footer: 'p-4 sm:px-6'
    },
    defaultVariants: {
      variant: 'outline'
    }
  },
  input: {
    slots: {
      base: 'rounded-md'
    },
    defaultVariants: {
      color: 'primary',
      variant: 'outline',
      size: 'md'
    }
  },
  badge: {
    slots: {
      base: 'rounded-md font-medium'
    },
    defaultVariants: {
      color: 'primary',
      variant: 'subtle',
      size: 'md'
    }
  },
  alert: {
    slots: {
      root: 'rounded-lg'
    },
    defaultVariants: {
      variant: 'subtle'
    }
  },
  table: {
    slots: {
      th: 'font-semibold text-muted',
      td: 'text-default'
    }
  }
}

export const nuxtUiBrandTheme = defineBrandTheme({
  name: 'nuxt-ui',
  label: 'Nuxt UI',
  description: 'A default Nuxt UI baseline with standard semantic colors, radius, surfaces, and component defaults.',
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
      '--ui-border-accented': '#CBD5E1',
      '--ui-radius': '0.375rem'
    },
    dark: {
      '--ui-bg': '#020617',
      '--ui-bg-muted': '#0F172A',
      '--ui-bg-elevated': '#111827',
      '--ui-bg-accented': '#1E293B',
      '--ui-bg-inverted': 'white',
      '--ui-text': '#E2E8F0',
      '--ui-text-highlighted': 'white',
      '--ui-text-muted': '#94A3B8',
      '--ui-text-dimmed': '#64748B',
      '--ui-text-inverted': '#020617',
      '--ui-border': '#1E293B',
      '--ui-border-muted': '#0F172A',
      '--ui-border-accented': '#334155',
      '--ui-radius': '0.375rem'
    }
  },
  ui: nuxtUiComponentDefaults
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
      'Use runtime switching only for values that are already shipped.'
    ],
    donts: [
      'Do not make arbitrary product components depend on a concrete brand.',
      'Do not hide domain behavior inside identity configuration.'
    ]
  },
  componentCoverage: [
    {
      family: 'Actions',
      components: ['UButton', 'UBadge', 'UDropdownMenu'],
      status: 'verified'
    },
    {
      family: 'Forms',
      components: ['UInput', 'UTextarea', 'USelect', 'UCheckbox'],
      status: 'verified'
    },
    {
      family: 'Surfaces',
      components: ['UCard', 'UAlert', 'UTable', 'UHeader'],
      status: 'verified'
    }
  ],
  usage: {
    useFor: ['Nuxt UI projects', 'brand layers', 'runtime-safe theme values'],
    avoid: ['authorization', 'domain behavior', 'server credentials'],
    runtimeLimits: ['Runtime themes only affect shipped CSS variables and app config.']
  }
})

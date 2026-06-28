import { defineBrandGuide, defineBrandTheme } from '../../src'

const happydesignsColors = {
  primary: 'coral',
  secondary: 'petrol',
  success: 'seafoam',
  info: 'plum',
  warning: 'butter',
  error: 'rose',
  neutral: 'sand'
}

const sharedUiDefaults = {
  colors: happydesignsColors,
  button: {
    slots: {
      base: 'rounded-sm font-medium'
    },
    defaultVariants: {
      color: 'primary',
      variant: 'solid',
      size: 'md'
    },
    compoundVariants: [
      {
        color: 'primary',
        variant: 'solid',
        class: 'bg-inverted text-inverted hover:bg-inverted/90 active:bg-inverted focus-visible:ring-2 focus-visible:ring-primary'
      },
      {
        color: 'neutral',
        variant: 'outline',
        class: 'border-default bg-elevated text-highlighted hover:bg-muted'
      }
    ]
  },
  badge: {
    slots: {
      base: 'rounded-full font-medium ring-1 ring-inset'
    },
    defaultVariants: {
      color: 'neutral',
      variant: 'subtle',
      size: 'sm'
    }
  },
  card: {
    slots: {
      root: 'rounded-sm bg-default shadow-none transition-colors',
      header: 'border-b border-default',
      footer: 'border-t border-default'
    },
    defaultVariants: {
      variant: 'outline'
    }
  },
  input: {
    slots: {
      base: 'rounded-sm bg-default text-highlighted ring-default focus-visible:ring-primary'
    },
    defaultVariants: {
      color: 'primary',
      variant: 'outline',
      size: 'md'
    }
  },
  alert: {
    slots: {
      root: 'rounded-sm border shadow-none'
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

export const happydesignsBrandTheme = defineBrandTheme({
  name: 'happydesigns',
  label: 'happydesigns',
  description: 'Demonstration runtime theme adapted from current happydesigns brand-layer work.',
  typography: {
    sans: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
    mono: '"Geist Mono", "SFMono-Regular", ui-monospace, monospace'
  },
  cssVariables: {
    light: {
      '--ui-bg': '#FAF7F2',
      '--ui-bg-muted': '#FFFFFF',
      '--ui-bg-elevated': '#F1ECE6',
      '--ui-bg-accented': '#D8D0C5',
      '--ui-bg-inverted': '#242423',
      '--ui-text': '#242423',
      '--ui-text-highlighted': '#242423',
      '--ui-text-muted': '#6B625A',
      '--ui-text-dimmed': '#8F857A',
      '--ui-text-inverted': '#FAF7F2',
      '--ui-border': '#D8D0C5',
      '--ui-border-muted': '#E9E4DC',
      '--ui-primary': '#F28564',
      '--ui-secondary': '#2F6374',
      '--ui-success': '#1FA573',
      '--ui-info': '#71617F',
      '--ui-warning': '#A77D22',
      '--ui-error': '#BD4D49',
      '--ui-radius': '0.25rem',
      '--hd-text-body': '#4A433E',
      '--hd-text-label': '#574B63',
      '--hd-bg-inset': '#FAF7F2'
    },
    dark: {
      '--ui-bg': '#242423',
      '--ui-bg-muted': '#2F2F2E',
      '--ui-bg-elevated': '#282827',
      '--ui-bg-accented': 'rgba(250, 247, 242, 0.12)',
      '--ui-bg-inverted': '#F3EEE8',
      '--ui-text': '#F3EEE8',
      '--ui-text-highlighted': '#FAF7F2',
      '--ui-text-muted': '#D8D0C5',
      '--ui-text-dimmed': '#B8AEA2',
      '--ui-text-inverted': '#242423',
      '--ui-border': 'rgba(250, 247, 242, 0.12)',
      '--ui-border-muted': 'rgba(250, 247, 242, 0.08)',
      '--ui-primary': '#F78A6D',
      '--ui-secondary': '#65A8B1',
      '--ui-success': '#74DBAD',
      '--ui-info': '#B1A0BC',
      '--ui-warning': '#F7E29A',
      '--ui-error': '#EB918D',
      '--ui-radius': '0.25rem',
      '--hd-text-body': '#D8D0C5',
      '--hd-text-label': '#D8D0C5',
      '--hd-bg-inset': '#242423'
    }
  },
  ui: sharedUiDefaults
})

export const happydesignsBrandGuide = defineBrandGuide({
  name: 'happydesigns',
  packageName: '@happydesigns/brand',
  title: 'happydesigns',
  description: 'Demonstration identity contract used by the id documentation; @happydesigns/brand owns the canonical guide and theme.',
  semanticColors: happydesignsColors,
  cssVariables: happydesignsBrandTheme.cssVariables,
  typography: happydesignsBrandTheme.typography,
  ui: happydesignsBrandTheme.ui,
  usage: {
    useFor: ['Nuxt UI runtime previews', 'contract demonstrations', 'id documentation demos'],
    avoid: ['canonical happydesigns doctrine', 'domain behavior', 'authorization', 'runtime credentials']
  }
})

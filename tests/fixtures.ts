import { defineBrandTheme, nuxtUiBrandTheme } from '../src'

export const editorialBrandTheme = defineBrandTheme({
  name: 'editorial',
  label: 'Editorial',
  description: 'A crisp editorial fixture with warm paper surfaces, serif typography, tighter radius, and quieter controls.',
  semanticColors: {
    primary: 'orange',
    secondary: 'teal',
    success: 'emerald',
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
      '--ui-bg-elevated': '#FFF8ED',
      '--ui-bg-accented': '#E5D3BF',
      '--ui-bg-inverted': '#211B16',
      '--ui-text': '#43382F',
      '--ui-text-highlighted': '#211B16',
      '--ui-text-muted': '#75665A',
      '--ui-text-dimmed': '#9B8979',
      '--ui-text-inverted': '#FFFCF7',
      '--ui-border': '#D8C5B0',
      '--ui-border-muted': '#E8DACB',
      '--ui-border-accented': '#C7A98A',
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
      '--ui-border-muted': '#352D25',
      '--ui-border-accented': '#6A5849',
      '--ui-radius': '0.25rem'
    }
  },
  ui: {
    button: {
      slots: {
        base: 'rounded-sm font-semibold tracking-wide'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
      }
    },
    card: {
      slots: {
        root: 'rounded-sm shadow-none',
        header: 'px-5 py-4',
        body: 'px-5 py-5',
        footer: 'px-5 py-4'
      },
      defaultVariants: {
        variant: 'subtle'
      }
    }
  }
})

export const studioBrandTheme = defineBrandTheme({
  name: 'studio',
  label: 'Studio',
  description: 'A polished studio fixture with cool glassy surfaces, rounded controls, and a high-contrast teal system.',
  semanticColors: {
    primary: 'teal',
    secondary: 'rose',
    success: 'emerald',
    info: 'cyan',
    warning: 'amber',
    error: 'red',
    neutral: 'zinc'
  },
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  cssVariables: {
    light: {
      '--ui-bg': '#F6F8FB',
      '--ui-bg-muted': '#EAF7F4',
      '--ui-bg-elevated': '#FFFFFF',
      '--ui-bg-accented': '#D7F0EA',
      '--ui-bg-inverted': '#061412',
      '--ui-text': '#223532',
      '--ui-text-highlighted': '#061412',
      '--ui-text-muted': '#5B746F',
      '--ui-text-dimmed': '#8FA6A1',
      '--ui-text-inverted': '#F6F8FB',
      '--ui-border': '#C6DED8',
      '--ui-border-muted': '#DDEAE7',
      '--ui-border-accented': '#8CC8BC',
      '--ui-radius': '0.75rem'
    },
    dark: {
      '--ui-bg': '#071412',
      '--ui-bg-muted': '#0D211E',
      '--ui-bg-elevated': '#12302B',
      '--ui-bg-accented': '#1D4D44',
      '--ui-bg-inverted': '#F6F8FB',
      '--ui-text': '#DDEBE8',
      '--ui-text-highlighted': '#FFFFFF',
      '--ui-text-muted': '#A7C4BE',
      '--ui-text-dimmed': '#73968F',
      '--ui-text-inverted': '#071412',
      '--ui-border': '#28655B',
      '--ui-border-muted': '#173A34',
      '--ui-border-accented': '#38A692',
      '--ui-radius': '0.75rem'
    }
  },
  ui: {
    button: {
      slots: {
        base: 'rounded-xl font-semibold shadow-sm shadow-primary/10'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
      }
    },
    card: {
      slots: {
        root: 'rounded-xl bg-default/80 shadow-lg shadow-primary/5 ring ring-default backdrop-blur',
        header: 'px-5 py-4',
        body: 'px-5 py-5',
        footer: 'px-5 py-4'
      },
      defaultVariants: {
        variant: 'outline'
      }
    }
  }
})

export const testBrandThemes = [
  nuxtUiBrandTheme,
  editorialBrandTheme,
  studioBrandTheme
]

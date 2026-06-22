import { defineBrandGuide, defineBrandTheme } from './validation'

const nuxtUiComponentDefaults = {
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
  semanticColors: {
    primary: 'green',
    secondary: 'blue',
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

export const editorialBrandTheme = defineBrandTheme({
  name: 'editorial',
  label: 'Editorial',
  description: 'A crisp editorial theme with warm paper surfaces, serif typography, tighter radius, and quieter controls.',
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
    },
    input: {
      slots: {
        base: 'rounded-sm bg-default'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'subtle',
        size: 'md'
      }
    },
    badge: {
      slots: {
        base: 'rounded-sm font-semibold uppercase tracking-wide'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'subtle',
        size: 'sm'
      }
    },
    alert: {
      slots: {
        root: 'rounded-sm ring-1 ring-current/10'
      },
      defaultVariants: {
        variant: 'subtle'
      }
    },
    table: {
      slots: {
        th: 'font-semibold uppercase tracking-wide text-dimmed',
        td: 'text-default'
      }
    }
  }
})

export const studioBrandTheme = defineBrandTheme({
  name: 'studio',
  label: 'Studio',
  description: 'A polished studio theme with cool glassy surfaces, rounded controls, and a high-contrast teal system.',
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
    },
    input: {
      slots: {
        base: 'rounded-xl bg-default/90'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'outline',
        size: 'md'
      }
    },
    badge: {
      slots: {
        base: 'rounded-full font-semibold'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'soft',
        size: 'md'
      }
    },
    alert: {
      slots: {
        root: 'rounded-xl bg-elevated/80 ring ring-default'
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
})

export const sampleBrandGuide = defineBrandGuide({
  name: 'sample-brand',
  packageName: '@example/brand',
  title: 'Sample Brand',
  description: 'A complete sample brand guide used to demonstrate the @happydesigns/id contract.',
  palette: {
    brand: {
      50: '#ECFDF5',
      500: '#14B8A6',
      950: '#042F2E'
    },
    accent: {
      50: '#FFF1F2',
      500: '#F43F5E',
      950: '#4C0519'
    },
    neutral: {
      50: '#FAFAFA',
      500: '#71717A',
      950: '#09090B'
    }
  },
  semanticColors: studioBrandTheme.semanticColors,
  cssVariables: studioBrandTheme.cssVariables,
  typography: studioBrandTheme.typography,
  ui: studioBrandTheme.ui,
  voice: {
    attributes: ['clear', 'direct', 'polished'],
    dos: ['Name the user action directly.', 'Explain identity decisions through reusable rules.'],
    donts: ['Do not hide product behavior behind brand language.']
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
    useFor: ['Nuxt UI projects', 'brand layers', 'runtime theme packs'],
    avoid: ['authorization', 'domain behavior', 'server credentials'],
    runtimeLimits: ['Runtime themes only affect shipped CSS variables and app config.']
  }
})

export const sampleThemes = [
  nuxtUiBrandTheme,
  editorialBrandTheme,
  studioBrandTheme
]

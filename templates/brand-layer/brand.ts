import { defineBrandGuide, defineBrandTheme } from '@happydesigns/id'

const brandColors = {
  primary: 'brand',
  secondary: 'slate',
  success: 'green',
  info: 'sky',
  warning: 'amber',
  error: 'red',
  neutral: 'slate'
}

export const brandTheme = defineBrandTheme({
  name: 'example-brand',
  label: 'Example Brand',
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-bg-muted': '#F8FAFC',
      '--ui-bg-elevated': '#F1F5F9',
      '--ui-text': '#334155',
      '--ui-text-highlighted': '#020617',
      '--ui-border': '#E2E8F0',
      '--ui-radius': '0.375rem'
    },
    dark: {
      '--ui-bg': '#020617',
      '--ui-bg-muted': '#0F172A',
      '--ui-bg-elevated': '#0F172A',
      '--ui-text': '#E2E8F0',
      '--ui-text-highlighted': 'white',
      '--ui-border': '#1E293B'
    }
  },
  ui: {
    colors: brandColors
  }
})

export const brandGuide = defineBrandGuide({
  name: 'example-brand',
  packageName: '@example/brand',
  title: 'Example Brand',
  description: 'A reusable Nuxt UI brand layer.',
  assets: {
    logos: {
      logo: {
        name: 'Example Brand logo',
        src: '/favicon.svg',
        role: 'logo',
        alt: 'Example Brand'
      },
      appIcon: {
        name: 'Example Brand app icon',
        src: '/favicon.svg',
        role: 'appIcon',
        alt: 'Example Brand'
      }
    }
  },
  semanticColors: brandColors,
  cssVariables: brandTheme.cssVariables,
  typography: brandTheme.typography,
  usage: {
    useFor: ['Nuxt UI apps', 'Docus docs', 'brand-specific presentation'],
    avoid: ['domain behavior', 'authorization', 'runtime credentials']
  }
})

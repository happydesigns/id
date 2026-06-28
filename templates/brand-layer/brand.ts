import { defineBrandGuide, defineBrandIdentity, defineBrandTheme } from '@happydesigns/id'

export const brandIdentity = defineBrandIdentity({
  name: 'example-brand',
  packageName: '@example/brand',
  claim: 'A reusable Nuxt UI brand layer.',
  logoAssetPaths: {
    logo: '/favicon.svg',
    appIcon: '/favicon.svg'
  }
})

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
  name: brandIdentity.name,
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
  name: brandIdentity.name,
  packageName: brandIdentity.packageName,
  title: 'Example Brand',
  description: brandIdentity.claim,
  assets: {
    logos: {
      logo: {
        name: 'Example Brand logo',
        src: brandIdentity.logoAssetPaths.logo,
        role: 'logo',
        alt: 'Example Brand'
      },
      appIcon: {
        name: 'Example Brand app icon',
        src: brandIdentity.logoAssetPaths.appIcon,
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

import { defineBrand, defineBrandGuide } from '@happydesigns/id'
import { nuxtUiAdapter } from '@happydesigns/id/adapters/nuxt-ui'

export const brandIdentity = defineBrand({
  name: 'example-brand',
  packageName: '@example/brand',
  claim: 'A reusable Nuxt UI brand layer.',
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    slate: '#64748B',
  },
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  assets: {
    logos: {
      logo: {
        name: 'Example Brand logo',
        src: '/favicon.svg',
        role: 'logo',
        media: 'any',
        alt: 'Example Brand',
      },
      appIcon: {
        name: 'Example Brand app icon',
        src: '/favicon.svg',
        role: 'appIcon',
        media: 'any',
        alt: 'Example Brand app icon',
      },
    },
  },
})

const brandColors = {
  primary: 'brand',
  neutral: 'slate',
} as const

export const brandTheme = nuxtUiAdapter.transform(brandIdentity, {
  label: 'Example Brand',
  colors: brandColors,
  cssVariables: {
    light: {
      '--ui-bg': 'white',
      '--ui-bg-muted': '#F8FAFC',
      '--ui-bg-elevated': '#F1F5F9',
      '--ui-text': '#334155',
      '--ui-text-highlighted': '#020617',
      '--ui-border': '#E2E8F0',
      '--ui-radius': '0.375rem',
    },
    dark: {
      '--ui-bg': '#020617',
      '--ui-bg-muted': '#0F172A',
      '--ui-bg-elevated': '#0F172A',
      '--ui-text': '#E2E8F0',
      '--ui-text-highlighted': 'white',
      '--ui-border': '#1E293B',
    },
  },
})

export const brandRuntimeAssets = brandIdentity.assets

export const brandGuide = defineBrandGuide({
  name: brandIdentity.name,
  packageName: brandIdentity.packageName,
  title: 'Example Brand',
  description: brandIdentity.claim,
  assets: brandRuntimeAssets,
  palette: brandIdentity.colors,
  semanticColors: brandColors,
  cssVariables: brandTheme.cssVariables,
  typography: brandTheme.typography,
  usage: {
    useFor: ['Nuxt UI apps', 'Docus docs', 'brand-specific presentation'],
    avoid: ['domain behavior', 'authorization', 'runtime credentials'],
  },
})

import { useAppConfig } from '#imports'
import { studioIcons, studioIconOverrides, themeIcons, type ThemeIcons } from './icon-sets'
import { auditedIconOverrides } from './icon-overrides'

/** Adapt explicit Studio glyphs to the selected pack, including native UI roles. */
export function useStudioIcon() {
  const config = useAppConfig()
  const icons = useStudioIcons()
  const aliases: Record<string, keyof typeof studioIcons> = {
    'i-lucide-sparkles': 'assistant', 'i-lucide-scan': 'proportions',
    'i-lucide-fingerprint': 'brand', 'i-lucide-square': 'radius',
    'i-lucide-panels-top-left': 'templates', 'i-lucide-library': 'layers',
    'i-lucide-git-compare-arrows': 'comparison', 'i-lucide-folder-sync': 'folderPlus',
    'i-lucide-tablet-smartphone': 'proportions', 'i-lucide-rotate-cw': 'reset',
    'i-lucide-maximize': 'proportions', 'i-lucide-smartphone': 'proportions',
    'i-lucide-tablet': 'tablet', 'i-lucide-trash-2': 'trash'
  }
  return (name: string) => {
    const native = Object.entries(themeIcons.lucide).find(([, value]) => value === name)?.[0]
    if (native) return (config.ui.icons as Record<string, string>)[native] || name
    const key = Object.entries(studioIcons).find(([, value]) => value === name)?.[0] as keyof typeof studioIcons | undefined
    return key ? icons[key] : aliases[name] ? icons[aliases[name]] : name
  }
}

/** Resolve each read against the reactive app config, including Undo and brand changes. */
export function useStudioIcons() {
  const config = useAppConfig()
  return new Proxy(studioIcons, {
    get(target, key: keyof typeof studioIcons) {
      const pack = Object.keys(themeIcons).find(name => themeIcons[name as ThemeIcons].search === config.ui.icons.search) as ThemeIcons | undefined
      const audited = auditedIconOverrides as Partial<Record<ThemeIcons, Partial<typeof studioIcons>>>
      return (pack && (audited[pack]?.[key] || studioIconOverrides[pack]?.[key])) || target[key]
    }
  })
}

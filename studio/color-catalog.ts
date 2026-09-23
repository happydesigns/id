import type { StudioColorCatalog } from '../src/studio-host'

export function studioPaletteLabel(key: string, catalog?: StudioColorCatalog): string {
  return catalog?.[key]?.label.trim() || key
}

/** Group only actual palettes, in their source order; metadata cannot create colors. */
export function studioPaletteGroups<T>(colors: Record<string, T>, catalog?: StudioColorCatalog) {
  const groups = new Map<string, { label: string, items: { label: string, value: string, palette: T }[] }>()
  const grouped = Object.keys(colors).some(key => catalog?.[key]?.group?.trim())
  for (const [key, palette] of Object.entries(colors)) {
    const label = grouped ? catalog?.[key]?.group?.trim() || 'Other palettes' : ''
    const group = groups.get(label) ?? { label, items: [] }
    group.items.push({ label: studioPaletteLabel(key, catalog), value: key, palette })
    groups.set(label, group)
  }
  return [...groups.values()]
}

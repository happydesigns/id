/** Shared editor navigation and randomizer capabilities. */
export const editorCategories = [
  { label: 'Brand', value: 'identity', icon: 'i-lucide-fingerprint', randomScope: null },
  { label: 'Colors', value: 'colors', icon: 'i-lucide-palette', randomScope: 'colors' },
  { label: 'Typography', value: 'type', icon: 'i-lucide-type', randomScope: 'typography' },
  { label: 'Icons', value: 'icons', icon: 'i-lucide-shapes', randomScope: 'icons' },
  { label: 'Styles', value: 'styles', icon: 'i-lucide-paintbrush', randomScope: 'styles' },
] as const

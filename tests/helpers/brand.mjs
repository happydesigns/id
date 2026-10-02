/**
 * @param {() => import('../../src/studio').StudioDocument} createDocument
 * @param {'violet' | 'amber'} brand
 */
export function createTestBrand(createDocument, brand) {
  const document = createDocument()
  document.brand.name = brand
  document.brand.packageName = '@id-test/brand'
  document.theme.label = brand
  document.brand.typography = { sans: brand === 'violet' ? 'Georgia, serif' : 'Arial, sans-serif' }
  document.theme.cssVariables = { light: { '--ui-radius': brand === 'violet' ? '0.75rem' : '0rem' } }
  document.theme.ui = { ...document.theme.ui, button: { defaultVariants: { variant: 'solid', size: brand === 'violet' ? 'lg' : 'sm' } } }
  const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1WQAAAAASUVORK5CYII='
  document.brand.assets = { logos: Object.fromEntries(['wordmark', 'wordmarkInverse'].map(role => [role, { name: role, role, src, alt: brand }])) }
  document.extension = { preserved: 'workflow' }
  return document
}

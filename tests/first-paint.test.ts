import { runInNewContext } from 'node:vm'
import { expect, it } from 'vitest'
import { createFirstPaintScript } from '../docs/first-paint'
import { createBlankStudioDocument } from '../src/studio'
import { createFirstPaintTheme } from '../studio/first-paint'

it('caches resolved role colors and explicitly authored palettes without a full brand document', () => {
  const document = createBlankStudioDocument()
  document.brand.colors.unmapped = { 500: '#123456' }
  document.theme.ui!.colors!.primary = 'violet'
  const cache = createFirstPaintTheme('draft-id', document.brand, document.theme, 'abc123def456')

  expect(cache).toMatchObject({ active: 'draft-id', revision: 'abc123def456' })
  expect(cache.light['--color-unmapped-500']).toBe('#123456')
  expect(cache.light['--ui-color-primary-500']).toBe('oklch(60.6% 0.25 292.717)')
  expect(JSON.stringify(cache)).not.toContain('packageName')
})

it('rejects stale revisions and invalid CSS declarations as a whole', () => {
  function appliedStyle(revision: string, value: string, iframe = false) {
    const styles: { id: string, textContent: string }[] = []
    const storage = {
      'id-studio:1:nuxt-ui:active': 'draft-id',
      'id-studio:1:nuxt-ui:first-paint': JSON.stringify({ active: 'draft-id', revision, light: { '--ui-bg': value }, dark: {} }),
    }
    const window: { parent?: unknown } = {}
    window.parent = iframe ? {} : window
    runInNewContext(createFirstPaintScript('abc123def456'), {
      window,
      localStorage: { getItem: (key: keyof typeof storage) => storage[key] },
      document: { createElement: () => ({ id: '', textContent: '' }), head: { appendChild: (style: typeof styles[number]) => styles.push(style) } },
    })
    return styles
  }

  expect(appliedStyle('abc123def456', 'red', true)).toEqual([])
  expect(appliedStyle('old-revision', 'red')).toEqual([])
  expect(appliedStyle('abc123def456', 'red;body{display:none}')).toEqual([])
  expect(appliedStyle('abc123def456', 'red')[0]?.textContent).toContain('--ui-bg:red;')
})

import { expect, it } from 'vitest'
import { createBlankStudioDocument, parseStudioDocument, createStudioProject } from '../src/studio'

it('repairs the old Material light icon in saved brands and exports', () => {
  const source = createBlankStudioDocument()
  source.theme.ui = { icons: { light: 'i-material-symbols:light-mode-outline-rounded', dark: 'i-custom-moon' } }
  const restored = parseStudioDocument(JSON.stringify(source))
  expect(restored.theme.ui?.icons).toEqual({ light: 'i-material-symbols-light-mode-outline-rounded', dark: 'i-custom-moon' })
  expect(createStudioProject(restored)['app/brand.config.ts']).toContain('i-material-symbols-light-mode-outline-rounded')
  expect(source.theme.ui.icons).toEqual({ light: 'i-material-symbols:light-mode-outline-rounded', dark: 'i-custom-moon' })
})

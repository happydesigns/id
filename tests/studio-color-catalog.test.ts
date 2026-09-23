import { expect, it } from 'vitest'
import { studioPaletteGroups, studioPaletteLabel } from '../studio/color-catalog'

it('retains technical identities with duplicate display labels and missing metadata', () => {
  const colors = { ocean: { 500: '#123456' }, forest: { 500: '#234567' }, custom: '#345678' }
  const catalog = {
    ocean: { label: 'Primary', group: 'Brand' },
    forest: { label: 'Primary', group: 'Brand' },
    obsolete: { label: 'Removed', group: 'Unused' },
  }
  const groups = studioPaletteGroups(colors, catalog)
  expect(groups.map(group => group.label)).toEqual(['Brand', 'Other palettes'])
  expect(groups[0]?.items.map(item => [item.label, item.value])).toEqual([['Primary', 'ocean'], ['Primary', 'forest']])
  expect(groups[0]?.items[0]?.palette).toBe(colors.ocean)
  expect(groups[1]?.items[0]?.value).toBe('custom')
  expect(studioPaletteLabel('renamed', catalog)).toBe('renamed')
})

it('keeps an ungrouped library without group metadata and ignores empty labels', () => {
  const colors = { ocean: '#123456' }
  expect(studioPaletteGroups(colors)).toEqual([{ label: '', items: [{ label: 'ocean', value: 'ocean', palette: '#123456' }] }])
  expect(studioPaletteLabel('ocean', { ocean: { label: '  ' } })).toBe('ocean')
  expect(studioPaletteGroups({})).toEqual([])
})

import { describe, expect, it } from 'vitest'
import {
  normalizeComponentCoverage,
  summarizeComponentCoverage,
} from '../src'

describe('component coverage helpers', () => {
  it('normalizes families and component names', () => {
    expect(normalizeComponentCoverage([
      {
        family: ' Forms ',
        components: [' UInput ', ' ', 'USelect'],
        status: 'documented',
        notes: ' Focus examples ',
      },
      {
        family: ' ',
        components: ['UButton'],
        status: 'planned',
      },
    ])).toEqual([
      {
        family: 'Forms',
        components: ['UInput', 'USelect'],
        status: 'documented',
        notes: 'Focus examples',
      },
    ])
  })
  it('summarizes family and component counts by status', () => {
    expect(summarizeComponentCoverage([
      {
        family: 'Actions',
        components: ['UButton', 'UBadge'],
        status: 'verified',
      },
      {
        family: 'Overlays',
        components: ['UModal'],
        status: 'planned',
      },
    ])).toEqual({
      families: 2,
      components: 3,
      byStatus: {
        planned: 1,
        tokenized: 0,
        documented: 0,
        verified: 1,
      },
    })
  })
})

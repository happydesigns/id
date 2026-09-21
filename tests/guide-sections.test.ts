import { describe, expect, it } from 'vitest'
import {
  createGuideDocsSections,
  createGuideSectionPath,
  defineGuideSections,
  findGuideSection,
  normalizeGuideSections,
} from '../src'

describe('guide section helpers', () => {
  const sections = defineGuideSections([
    {
      slug: ' colors ',
      title: ' Colors ',
      eyebrow: ' tokens ',
      summary: ' Palette and semantic roles. ',
      description: 'Color decisions for a brand guide.',
      icon: ' i-lucide-palette ',
      anchors: [' Palette ', ' ', 'Semantic roles'],
    },
    {
      slug: 'overview',
      title: 'Overview',
      description: 'Start here.',
    },
    {
      slug: '',
      title: 'Empty',
      description: 'Invalid.',
    },
  ])
  it('normalizes section metadata without owning brand content', () => {
    expect(normalizeGuideSections(sections)).toEqual([
      {
        slug: 'colors',
        title: 'Colors',
        eyebrow: 'tokens',
        summary: 'Palette and semantic roles.',
        description: 'Color decisions for a brand guide.',
        icon: 'i-lucide-palette',
        to: undefined,
        anchors: ['Palette', 'Semantic roles'],
      },
      {
        slug: 'overview',
        title: 'Overview',
        description: 'Start here.',
        summary: undefined,
        eyebrow: undefined,
        icon: undefined,
        to: undefined,
        anchors: undefined,
      },
    ])
  })
  it('creates Docus navigation sections from richer guide metadata', () => {
    expect(createGuideDocsSections(sections)).toEqual([
      {
        title: 'Colors',
        description: 'Palette and semantic roles.',
        to: '/docs/colors',
      },
      {
        title: 'Overview',
        description: 'Start here.',
        to: '/docs',
      },
    ])
  })
  it('supports custom base paths, index slugs, and explicit paths', () => {
    expect(createGuideSectionPath({
      slug: 'introduction',
      title: 'Introduction',
      description: 'Start here.',
    }, {
      basePath: 'brand',
      indexSlug: 'introduction',
    })).toBe('/brand')
    expect(createGuideSectionPath({
      slug: 'voice',
      title: 'Voice',
      description: 'Writing guidance.',
      to: '/docs/writing',
    })).toBe('/docs/writing')
  })
  it('finds sections by normalized slug', () => {
    expect(findGuideSection(sections, ' colors ')?.title).toBe('Colors')
    expect(findGuideSection(sections, 'missing')).toBeUndefined()
  })
})

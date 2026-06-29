import { describe, expect, it } from 'vitest'
import {
  componentExampleFamilies,
  componentExampleGroups,
  componentExampleNames,
  componentExampleOwnSurfaceNames,
  createComponentExampleContext,
  getComponentExampleDefinition,
  isComponentExampleName
} from '../src/component-examples'

describe('component examples', () => {
  it('exports grouped example metadata without duplicate names', () => {
    expect(componentExampleGroups.length).toBeGreaterThan(0)
    expect(componentExampleFamilies).toContain('actions')
    expect(componentExampleFamilies).toContain('forms')
    expect(componentExampleFamilies).toContain('dashboard')

    const uniqueNames = new Set(componentExampleNames)

    expect(uniqueNames.size).toBe(componentExampleNames.length)
  })

  it('resolves example definitions by name', () => {
    expect(isComponentExampleName('button')).toBe(true)
    expect(isComponentExampleName('dashboard-shell')).toBe(true)
    expect(isComponentExampleName('missing-example')).toBe(false)

    expect(getComponentExampleDefinition('button')).toMatchObject({
      name: 'button',
      family: 'actions'
    })
  })

  it('tracks examples that own their own visible surface', () => {
    expect(componentExampleOwnSurfaceNames).toContain('content-system')
    expect(componentExampleOwnSurfaceNames).toContain('dashboard-shell')
    expect(componentExampleOwnSurfaceNames).not.toContain('button')
  })

  it('merges brand-owned context with neutral defaults', () => {
    expect(createComponentExampleContext({
      brandName: 'sample',
      packageName: '@sample/brand',
      assets: {
        symbol: '/logos/sample.svg'
      },
      paths: {
        docs: '/guide'
      },
      copy: {
        heroTitle: 'Sample guide'
      }
    })).toMatchObject({
      brandName: 'sample',
      packageName: '@sample/brand',
      logoAlt: 'sample symbol',
      assets: {
        symbol: '/logos/sample.svg'
      },
      paths: {
        docs: '/guide',
        components: '/docs/components'
      },
      copy: {
        brandLabel: 'sample',
        heroTitle: 'Sample guide'
      }
    })
  })
})

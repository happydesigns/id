import { describe, expect, it } from 'vitest'
import { parseDocsLinks } from '../src'

describe('docs links', () => {
  it('parses label and url pairs from mdc attribute strings', () => {
    expect(parseDocsLinks('UButton|https://ui.nuxt.com/docs/components/button; UTooltip|https://ui.nuxt.com/docs/components/tooltip')).toEqual([
      {
        label: 'UButton',
        to: 'https://ui.nuxt.com/docs/components/button',
      },
      {
        label: 'UTooltip',
        to: 'https://ui.nuxt.com/docs/components/tooltip',
      },
    ])
  })
  it('keeps url-only entries and filters empty targets', () => {
    expect(parseDocsLinks('https://ui.nuxt.com/docs/components/button; Empty| ; UCard|https://ui.nuxt.com/docs/components/card')).toEqual([
      {
        to: 'https://ui.nuxt.com/docs/components/button',
      },
      {
        label: 'UCard',
        to: 'https://ui.nuxt.com/docs/components/card',
      },
    ])
  })
  it('normalizes typed docs links for component usage', () => {
    expect(parseDocsLinks([
      { label: ' UBadge ', to: ' https://ui.nuxt.com/docs/components/badge ' },
      { label: 'Empty', to: ' ' },
    ])).toEqual([
      {
        label: 'UBadge',
        to: 'https://ui.nuxt.com/docs/components/badge',
      },
    ])
  })
})

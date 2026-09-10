import { describe, expect, it } from 'vitest'
import { studioTemplates } from '../studio/templates'

describe('optional studio templates', () => {
  it('keeps the base studio usable without capability packages', () => {
    expect(studioTemplates().map(item => item.id)).toEqual(['landing'])
  })
  it('accepts a trusted host component and its declared pages', () => {
    expect(studioTemplates({ academy: { label: 'Academy', component: 'CourseAcademyPreview', pages: [{ id: 'home', label: 'Home' }, { id: 'lesson', label: 'Lesson' }] } }).at(-1)?.pages).toHaveLength(2)
  })
  it('rejects reserved identifiers, arbitrary element names and ambiguous pages', () => {
    const entry = { label: 'Academy', component: 'CourseAcademyPreview', pages: [{ id: 'home', label: 'Home' }] }
    expect(studioTemplates({ components: entry, bad: { ...entry, component: 'iframe' }, duplicate: { ...entry, pages: [...entry.pages, ...entry.pages] }, path: { ...entry, pages: [{ id: '../route', label: 'Route' }] } })).toHaveLength(1)
  })
})

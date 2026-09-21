import { describe, expect, it } from 'vitest'
import { createComponentExampleContext, resolveComponentExampleMessage, type ComponentExampleMessages } from '../src/component-examples'
import { resolveComponentCoverageStatus } from '../src/component-coverage'

describe('guide messages', () => {
  it('preserves English defaults and falls back per missing key', () => {
    const messages = { 'forms.projectName': 'Projektname' } satisfies ComponentExampleMessages
    const context = createComponentExampleContext({ messages })
    expect(resolveComponentExampleMessage(context.messages, 'forms.projectName')).toBe('Projektname')
    expect(resolveComponentExampleMessage(context.messages, 'actions.cancel')).toBe('Cancel')
    expect(resolveComponentExampleMessage(undefined, 'navigation.overview')).toBe('Overview')
    expect(context.paths.docs).toBe('/docs')
  })
  it('keeps intentional empty translations and rejects unknown keys in TypeScript', () => {
    expect(resolveComponentExampleMessage({ 'actions.cancel': '' }, 'actions.cancel')).toBe('')
    // @ts-expect-error Unknown translation keys are not part of the public contract.
    const invalid: ComponentExampleMessages = { invented: 'No' }
    expect(invalid).toBeDefined()
  })
  it('localizes coverage without changing status colors or fallback descriptions', () => {
    expect(resolveComponentCoverageStatus('verified', { statuses: { verified: { label: 'Geprüft' } } })).toMatchObject({ label: 'Geprüft', color: 'success' })
    expect(resolveComponentCoverageStatus('planned', { statuses: { verified: { label: 'Geprüft' } } }).label).toBe('Planned')
  })
})

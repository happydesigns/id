import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createBlankStudioDocument } from '../src/studio'
import { useStudioHistory } from '../studio/app/composables/useStudioHistory'

describe('Studio document history', () => {
  it('isolates snapshots, restores undo/redo and drops redo after a new edit', () => {
    const draft = ref(createBlankStudioDocument())
    const original = draft.value.theme.label
    const history = useStudioHistory(draft)
    history.record()
    draft.value.theme.label = 'First'
    history.undo()
    expect(draft.value.theme.label).toBe(original)
    history.redo()
    expect(draft.value.theme.label).toBe('First')
    history.undo()
    history.record()
    draft.value.theme.label = 'Alternative'
    history.redo()
    expect(draft.value.theme.label).toBe('Alternative')
    expect(history.future.value).toHaveLength(0)
  })
  it('bounds undo history and clears both stacks when changing projects', () => {
    const draft = ref(createBlankStudioDocument())
    const history = useStudioHistory(draft)
    for (let i = 0; i < 60; i++) {
      history.record()
      draft.value.theme.label = String(i)
    }
    expect(history.history.value).toHaveLength(50)
    for (let i = 0; i < 51; i++) history.undo()
    expect(draft.value.theme.label).toBe('9')
    history.clear()
    history.redo()
    expect(draft.value.theme.label).toBe('9')
    expect(history.history.value).toHaveLength(0)
    expect(history.future.value).toHaveLength(0)
  })
})

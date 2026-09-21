import { ref, type Ref } from 'vue'
import type { StudioDocument } from '../../src/studio'

const clone = (document: StudioDocument): StudioDocument => JSON.parse(JSON.stringify(document))

/** Validated document snapshots only; edit validation and UI errors belong to the caller. */
export function useStudioHistory(draft: Ref<StudioDocument>) {
  const history = ref<StudioDocument[]>([])
  const future = ref<StudioDocument[]>([])
  function record() {
    history.value.push(clone(draft.value))
    if (history.value.length > 50) history.value.shift()
    future.value = []
  }
  function undo() {
    const previous = history.value.pop()
    if (previous) {
      future.value.push(clone(draft.value))
      draft.value = previous
    }
  }
  function redo() {
    const next = future.value.pop()
    if (next) {
      history.value.push(clone(draft.value))
      draft.value = next
    }
  }
  function clear() {
    history.value = []
    future.value = []
  }
  return { history, future, record, undo, redo, clear }
}

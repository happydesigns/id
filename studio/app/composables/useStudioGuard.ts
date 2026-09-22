import { shallowRef } from 'vue'

/** One decision for replacing, navigating away from or closing an unsaved draft. */
export function useStudioGuard(hasUnsavedDraft: () => boolean) {
  const pending = shallowRef<(() => void) | null>(null)
  const leaving = shallowRef<((leave: boolean) => void) | null>(null)
  function guard(action: () => void) {
    if (hasUnsavedDraft()) pending.value = action
    else action()
  }
  function acceptReplacement() {
    const action = pending.value
    pending.value = null
    action?.()
  }
  function finishLeaving(leave: boolean) {
    const resolve = leaving.value
    leaving.value = null
    resolve?.(leave)
  }
  function requestLeave(): boolean | Promise<boolean> {
    if (!hasUnsavedDraft()) return true
    finishLeaving(false)
    return new Promise<boolean>((resolve) => {
      leaving.value = resolve
    })
  }
  function beforeUnload(event: BeforeUnloadEvent) {
    if (!hasUnsavedDraft()) return
    event.preventDefault()
    event.returnValue = ''
  }
  return { pending, leaving, guard, acceptReplacement, finishLeaving, requestLeave, beforeUnload }
}

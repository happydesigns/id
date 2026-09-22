import { expect, it, vi } from 'vitest'
import { useStudioGuard } from '../studio/app/composables/useStudioGuard'

it('requires a decision before replacing an unsaved draft', () => {
  let unsaved = true
  const guard = useStudioGuard(() => unsaved)
  const replace = vi.fn()
  guard.guard(replace)
  expect(replace).not.toHaveBeenCalled()
  guard.pending.value = null
  guard.acceptReplacement()
  expect(replace).not.toHaveBeenCalled()
  guard.guard(replace)
  guard.acceptReplacement()
  guard.acceptReplacement()
  expect(replace).toHaveBeenCalledTimes(1)
  unsaved = false
  guard.guard(replace)
  expect(replace).toHaveBeenCalledTimes(2)
})

it('settles superseded navigation and preserves the latest decision', async () => {
  const guard = useStudioGuard(() => true)
  const first = guard.requestLeave()
  const second = guard.requestLeave()
  await expect(first).resolves.toBe(false)
  guard.finishLeaving(true)
  await expect(second).resolves.toBe(true)
  expect(guard.leaving.value).toBeNull()
})

it('warns on browser exit only for an unsaved draft', () => {
  let unsaved = true
  const guard = useStudioGuard(() => unsaved)
  const preventDefault = vi.fn()
  const event = { preventDefault, returnValue: undefined } as unknown as BeforeUnloadEvent
  guard.beforeUnload(event)
  expect(preventDefault).toHaveBeenCalledOnce()
  expect(event.returnValue).toBe('')
  unsaved = false
  guard.beforeUnload(event)
  expect(preventDefault).toHaveBeenCalledOnce()
  expect(guard.requestLeave()).toBe(true)
})

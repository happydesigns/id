import { useToast } from '#imports'

/** Upstream demo actions are local, including authentication and transfers. */
export function usePlaygroundToast() {
  const toast = useToast()
  return {
    add(options: Parameters<typeof toast.add>[0]) {
      return toast.add({ ...options, id: 'studio-component-demo', description: 'Component demo only. No request was sent.' })
    },
  }
}

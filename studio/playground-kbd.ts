import { useKbd } from '@nuxt/ui/composables/useKbd'

/** Keep shortcuts readable during SSR; Nuxt UI resolves the platform after mounting. */
export function usePlaygroundKbd() {
  const { getKbdKey } = useKbd()
  return (key: string) => getKbdKey(key)?.trim() || (key === 'alt' ? 'Alt' : 'Ctrl')
}

/** Trusted host configuration, never imported from a brand document. */
export interface StudioTemplate {
  id: string
  label: string
  description: string
  thumbnail?: string
  component?: string
  origin?: string
  route?: string
  routePrefix?: string
  owner?: string
  pages: { id: string, label: string }[]
}
export function studioTemplates(input?: unknown): StudioTemplate[] {
  const result: StudioTemplate[] = [
    { id: 'landing', label: 'Landing', thumbnail: '/id-studio/templates/landing.png', description: 'Hero, features and pricing for a product website.', pages: [{ id: 'home', label: 'Home' }] },
  ]
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result
  for (const [id, value] of Object.entries(input)) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['components', 'landing'].includes(id) || !value || typeof value !== 'object') continue
    const item = value as Record<string, unknown>
    const thumbnail = typeof item.thumbnail === 'string' && item.thumbnail.startsWith('/') && !item.thumbnail.startsWith('//') && !item.thumbnail.includes('..') ? item.thumbnail : undefined
    if (typeof item.label !== 'string' || !item.label.trim()) continue
    const origin = item.origin === undefined ? undefined : studioOrigin(item.origin)
    if (item.origin !== undefined && !origin) continue
    if (isStudioRoute(item.route) && isStudioRoute(item.routePrefix) && withinStudioRoute(item.route, item.routePrefix)) {
      result.push({ id, label: item.label, description: typeof item.description === 'string' ? item.description : '', thumbnail, origin, route: item.route, routePrefix: item.routePrefix, owner: typeof item.owner === 'string' ? item.owner : undefined, pages: [{ id: 'home', label: 'Home' }] })
      continue
    }
    if (typeof item.label !== 'string' || !item.label.trim() || typeof item.component !== 'string' || !/^[A-Z][A-Za-z0-9]+$/.test(item.component)) continue
    if (!Array.isArray(item.pages) || !item.pages.length || item.pages.some(page => !page || typeof page.id !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(page.id) || typeof page.label !== 'string' || !page.label.trim())) continue
    if (new Set(item.pages.map(page => page.id)).size !== item.pages.length) continue
    result.push({ id, label: item.label, description: typeof item.description === 'string' ? item.description : '', thumbnail, component: item.component, owner: typeof item.owner === 'string' ? item.owner : undefined, pages: item.pages.map(page => ({ id: page.id, label: page.label })) })
  }
  return result
}

export function isStudioRoute(value: unknown): value is string {
  return typeof value === 'string' && /^\/[a-zA-Z0-9_/-]*$/.test(value) && !value.includes('//') && !value.split('/').some(part => ['studio', 'api', '_nuxt', '..'].includes(part))
}

export function withinStudioRoute(path: unknown, prefix: string): path is string {
  const base = prefix.replace(/\/$/, '')
  return isStudioRoute(path) && (base === '' || path === base || path.startsWith(`${base}/`))
}

export function studioOrigin(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  try {
    const url = new URL(value)
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) return url.origin
  }
  catch { /* Invalid host configuration. */ }
}

export function studioFrameUrl(template: StudioTemplate | undefined, frame: string, hostOrigin: string, session: string): string {
  const url = new URL(template?.route || '/studio/preview', template?.origin || hostOrigin)
  url.searchParams.set('frame', frame)
  if (template?.route) url.searchParams.set('idPreview', template.id)
  if (template?.origin) {
    url.searchParams.set('idStudioOrigin', hostOrigin)
    url.searchParams.set('idSession', session)
  }
  return url.href
}

export function acceptsStudioFrame(event: MessageEvent, frame: HTMLIFrameElement | undefined): boolean {
  if (!frame || event.source !== frame.contentWindow) return false
  const url = new URL(frame.src)
  return event.origin === url.origin && (!url.searchParams.has('idSession') || event.data?.session === url.searchParams.get('idSession'))
}

/** Trusted host configuration, never imported from a brand document. */
export interface StudioTemplate {
  id: string
  label: string
  description: string
  thumbnail?: string
  component?: string
  route?: string
  routePrefix?: string
  owner?: string
  pages: { id: string, label: string }[]
}
export function studioTemplates(input?: unknown): StudioTemplate[] {
  const result: StudioTemplate[] = [
    { id: 'landing', label: 'Landing', description: 'Hero, features and pricing for a product website.', pages: [{ id: 'home', label: 'Home' }] }
  ]
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result
  for (const [id, value] of Object.entries(input)) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['components', 'landing'].includes(id) || !value || typeof value !== 'object') continue
    const item = value as Record<string, unknown>
    const thumbnail = typeof item.thumbnail === 'string' && item.thumbnail.startsWith('/') && !item.thumbnail.startsWith('//') && !item.thumbnail.includes('..') ? item.thumbnail : undefined
    if (typeof item.label !== 'string' || !item.label.trim()) continue
    if (isStudioRoute(item.route) && isStudioRoute(item.routePrefix) && withinStudioRoute(item.route, item.routePrefix)) {
      result.push({ id, label: item.label, description: typeof item.description === 'string' ? item.description : '', thumbnail, route: item.route, routePrefix: item.routePrefix, owner: typeof item.owner === 'string' ? item.owner : undefined, pages: [{ id: 'home', label: 'Home' }] })
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
  return typeof value === 'string' && /^\/[a-zA-Z0-9_/-]+$/.test(value) && !value.includes('//') && !value.split('/').some(part => ['studio', 'api', '_nuxt', '..'].includes(part))
}

export function withinStudioRoute(path: unknown, prefix: string): path is string {
  return isStudioRoute(path) && (path === prefix || path.startsWith(`${prefix}/`))
}

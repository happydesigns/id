/** Trusted host configuration, never imported from a brand document. */
export interface StudioTemplate {
  id: string
  label: string
  description: string
  component?: string
  owner?: string
  pages: { id: string, label: string }[]
}
export function studioTemplates(input?: unknown): StudioTemplate[] {
  const result: StudioTemplate[] = [
    { id: 'landing', label: 'Landing', description: 'A product landing page.', pages: [{ id: 'home', label: 'Home' }] },
    { id: 'docs', label: 'Docs', description: 'A documentation page.', pages: [{ id: 'home', label: 'Home' }] }
  ]
  if (!input || typeof input !== 'object' || Array.isArray(input)) return result
  for (const [id, value] of Object.entries(input)) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(id) || ['components', 'landing', 'docs'].includes(id) || !value || typeof value !== 'object') continue
    const item = value as Record<string, unknown>
    if (typeof item.label !== 'string' || !item.label.trim() || typeof item.component !== 'string' || !/^[A-Z][A-Za-z0-9]+$/.test(item.component)) continue
    if (!Array.isArray(item.pages) || !item.pages.length || item.pages.some(page => !page || typeof page.id !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(page.id) || typeof page.label !== 'string' || !page.label.trim())) continue
    if (new Set(item.pages.map(page => page.id)).size !== item.pages.length) continue
    result.push({ id, label: item.label, description: typeof item.description === 'string' ? item.description : '', component: item.component, owner: typeof item.owner === 'string' ? item.owner : undefined, pages: item.pages.map(page => ({ id: page.id, label: page.label })) })
  }
  return result
}
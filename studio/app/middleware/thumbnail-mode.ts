import { defineNuxtRouteMiddleware, useAppConfig } from '#imports'
import { studioTemplates, withinStudioRoute } from '../../templates'

export default defineNuxtRouteMiddleware((to) => {
  if (to.query.frame !== 'thumbnail' || !['light', 'dark'].includes(String(to.query.previewMode))) return
  const config = useAppConfig() as unknown as { idStudio?: { templates?: unknown } }
  const template = studioTemplates(config.idStudio?.templates).find(item => item.id === to.query.idPreview)
  if (to.path === '/studio/preview' || (template?.routePrefix && withinStudioRoute(to.path, template.routePrefix))) {
    // Use Nuxt Color Mode's page override, leaving browser preferences intact.
    to.meta.colorMode = String(to.query.previewMode)
  }
})

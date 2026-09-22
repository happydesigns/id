import { nuxtUiBrandTheme } from '../../../../themes/nuxt-ui'

export default defineAppConfig({
  id: { theme: { ...nuxtUiBrandTheme, ui: { colors: { primary: 'green', neutral: 'slate' } } } },
  socials: { github: false },
  assistant: { floatingInput: false },
  idStudio: { templates: { external: { label: 'Independent app', origin: 'http://127.0.0.1:3444', route: '/demo', routePrefix: '/demo' } }, home: '/', documentation: '/', host: { name: 'Guide fixture' } },
})

import { nuxtUiBrandTheme } from '../../../../themes/nuxt-ui'
export default defineAppConfig({
  id: { theme: { ...nuxtUiBrandTheme, ui: { colors: { primary: 'green', neutral: 'slate' } } } },
  socials: { github: false },
  assistant: { floatingInput: false },
  idStudio: { home: '/', documentation: '/', host: { name: 'Guide fixture' } }
})

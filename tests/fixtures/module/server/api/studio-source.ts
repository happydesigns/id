import { useRuntimeConfig } from 'nuxt/server'
import { createStudioSourceHandler } from '../../../../../studio/server/source-handler'

export default createStudioSourceHandler(() => {
  const config = useRuntimeConfig()
  return { idStudioSource: config.idStudioSource, idStudioWriterToken: config.idStudioWriterToken }
})

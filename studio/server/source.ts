import { useRuntimeConfig } from '#imports'
import { createStudioSourceHandler } from './source-handler'

export default createStudioSourceHandler(event => useRuntimeConfig(event))

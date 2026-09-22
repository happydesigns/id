import { defineNuxtPlugin, useAppConfig, useColorMode, useHead, useRuntimeConfig } from '#imports'
import { ref } from 'vue'
import { createDevtoolsThemeSession, type DevtoolsThemeSession, type ThemeMode } from '../../devtools'
import type { StudioDocument } from '../../../src/studio-document'
import type { PreviewAppConfig } from '../../preview'

export default defineNuxtPlugin({
  name: 'id-devtools-theme',
  setup() {
    const css = ref('')
    const colorMode = useColorMode()
    useHead({ style: [{ key: 'id-devtools-theme', textContent: css }] })
    const options = useRuntimeConfig().public.idDevtoolsTheme as { document?: StudioDocument, appUi?: Record<string, unknown> }
    let session: DevtoolsThemeSession | undefined
    const connect = () => session ??= createDevtoolsThemeSession(useAppConfig() as unknown as PreviewAppConfig, (value) => {
      css.value = value
    }, (value?: ThemeMode) => {
      if (value) colorMode.preference = value
      return colorMode.preference as ThemeMode
    }, options)
    return { provide: { idDevtoolsTheme: connect } }
  },
})

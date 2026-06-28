import { createHighlighterCoreSync } from '@shikijs/core'
import type { HighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import bash from '@shikijs/langs/bash'
import typescript from '@shikijs/langs/typescript'
import materialThemeLighter from '@shikijs/themes/material-theme-lighter'
import materialThemePalenight from '@shikijs/themes/material-theme-palenight'

let highlighter: HighlighterCore | null = null

export function useLayerInstallHighlighter(): HighlighterCore {
  highlighter ||= createHighlighterCoreSync({
    langs: [
      ...bash,
      ...typescript
    ],
    themes: [
      materialThemeLighter,
      materialThemePalenight
    ],
    engine: createJavaScriptRegexEngine()
  })

  return highlighter
}

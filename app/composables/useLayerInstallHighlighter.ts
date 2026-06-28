import { createHighlighterCore } from '@shikijs/core'
import type { HighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

let highlighter: HighlighterCore | null = null
let highlighterPromise: Promise<HighlighterCore> | null = null

export async function useLayerInstallHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ||= createHighlighterCore({
    langs: [
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/typescript')
    ],
    themes: [
      import('@shikijs/themes/material-theme-lighter'),
      import('@shikijs/themes/material-theme-palenight')
    ],
    engine: createJavaScriptRegexEngine()
  })

  highlighter ||= await highlighterPromise

  return highlighter
}

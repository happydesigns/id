// This fixed head script applies a validated local presentation cache before
// prerendered HTML paints. Brand documents and CSS text are never executed.
export function createFirstPaintScript(revision: string) {
  if (!/^[a-f0-9]{12}$/.test(revision)) throw new Error('Invalid first-paint revision')
  return `(() => {
  try {
    const active = localStorage.getItem('id-studio:1:nuxt-ui:active')
    const raw = localStorage.getItem('id-studio:1:nuxt-ui:first-paint')
    if (!active || !raw || raw.length > 100000) return
    const cache = JSON.parse(raw)
    if (cache?.active !== active || cache?.revision !== '${revision}') return
    const safeKey = /^--[\\w-]+$/
    const unsafeValue = /[;{}<>\\\\]|url\\s*\\(|expression\\s*\\(|@import/i
    function rule(selector, values) {
      if (!values || typeof values !== 'object' || Array.isArray(values)) return null
      const entries = Object.entries(values)
      const declarations = []
      for (const [name, value] of entries) {
        if (!safeKey.test(name) || typeof value !== 'string' || value.length > 250 || unsafeValue.test(value)) return null
        declarations.push(name + ':' + value + ';')
      }
      return selector + '{' + declarations.join('') + '}'
    }
    const light = rule(':root:root', cache.light)
    const dark = rule(':root:root.dark', cache.dark)
    if (!light || !dark) return
    const css = light + dark
    const style = document.createElement('style')
    style.id = 'id-theme-first-paint'
    style.textContent = css
    document.head.appendChild(style)
  } catch { /* Browser storage can be disabled or contain an older draft. */ }
})()`
}

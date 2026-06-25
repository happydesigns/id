export type DocsLink = {
  label?: string
  to: string
}

export function parseDocsLinks(input?: string | DocsLink[] | null): DocsLink[] {
  if (!input) {
    return []
  }

  if (Array.isArray(input)) {
    return input
      .map(link => ({
        label: link.label?.trim() || undefined,
        to: link.to.trim()
      }))
      .filter(link => Boolean(link.to))
  }

  return input
    .split(';')
    .map(item => item.trim())
    .filter(Boolean)
    .map((item) => {
      const separatorIndex = item.indexOf('|')

      if (separatorIndex === -1) {
        return { to: item.trim() }
      }

      return {
        label: item.slice(0, separatorIndex).trim() || undefined,
        to: item.slice(separatorIndex + 1).trim()
      }
    })
    .filter(link => Boolean(link.to))
}

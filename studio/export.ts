import { createStudioArchive, createStudioProject, type StudioDocument } from '../src/studio'

export function download(name: string, data: string | Uint8Array, mime = 'application/json') {
  const payload = typeof data === 'string' ? data : new Uint8Array(data).buffer
  const url = URL.createObjectURL(new Blob([payload], { type: mime }))
  const link = Object.assign(window.document.createElement('a'), { href: url, download: name })
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportStudioProject(document: StudioDocument, options: { packageAsset?: string, guide?: boolean } = {}): Promise<Uint8Array> {
  const packageAsset = options.packageAsset
  if (packageAsset && (!/^\/(?!\/)[\w/.-]+\.tgz$/.test(packageAsset) || packageAsset.split('/').includes('..'))) throw new Error('Invalid host package asset.')
  const files: Record<string, string | Uint8Array> = createStudioProject(document, { bundledPackage: !!packageAsset, guide: options.guide })
  if (packageAsset) {
    const response = await fetch(packageAsset, { credentials: 'omit', redirect: 'error' })
    if (!response.ok) throw new Error('The editor package is unavailable. Ask the host to rebuild it before exporting.')
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.length > 20_000_000 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) throw new Error('The editor package is invalid or too large.')
    files['vendor/id.tgz'] = bytes
    files['playground/public/studio-packages/id.tgz'] = bytes
  }
  const assets = [...Object.values(document.brand.assets?.logos ?? {}), ...(document.brand.assets?.files ?? [])]
  for (const asset of assets) {
    if (!asset || !asset.src.startsWith('/') || files[`public${asset.src}`]) continue
    const response = await fetch(asset.src, { credentials: 'omit', redirect: 'error' })
    if (!response.ok || response.headers.get('content-type')?.includes('text/html')) throw new Error(`Asset unavailable: ${asset.src}. Restore this file before exporting a complete project.`)
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.length > 5_000_000) throw new Error(`Asset too large: ${asset.src}`)
    files[`public${asset.src}`] = bytes
  }
  return createStudioArchive(files)
}

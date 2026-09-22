/** Small deterministic, uncompressed ZIP writer. No archive dependency in runtime. */
export function createStudioArchive(files: Record<string, string | Uint8Array>): Uint8Array {
  const encode = new TextEncoder()
  const chunks: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0
  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith('/') || path.includes('..') || path.includes('\\')) throw new Error('Unsafe archive path.')
    const name = encode.encode(path)
    const data = typeof content === 'string' ? encode.encode(content) : content
    let crc = 0xffffffff
    for (const byte of data) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
    }
    crc = (crc ^ 0xffffffff) >>> 0
    const header = new Uint8Array(30 + name.length)
    const view = new DataView(header.buffer)
    view.setUint32(0, 0x04034b50, true)
    view.setUint16(4, 20, true)
    view.setUint16(6, 0x800, true)
    view.setUint16(12, 33, true)
    view.setUint32(14, crc, true)
    view.setUint32(18, data.length, true)
    view.setUint32(22, data.length, true)
    view.setUint16(26, name.length, true)
    header.set(name, 30)
    const directory = new Uint8Array(46 + name.length)
    const entry = new DataView(directory.buffer)
    entry.setUint32(0, 0x02014b50, true)
    entry.setUint16(4, 20, true)
    directory.set(header.slice(4, 30), 6)
    entry.setUint32(42, offset, true)
    directory.set(name, 46)
    central.push(directory)
    chunks.push(header, data)
    offset += header.length + data.length
  }
  const directorySize = central.reduce((size, entry) => size + entry.length, 0)
  const end = new Uint8Array(22)
  const view = new DataView(end.buffer)
  view.setUint32(0, 0x06054b50, true)
  view.setUint16(8, central.length, true)
  view.setUint16(10, central.length, true)
  view.setUint32(12, directorySize, true)
  view.setUint32(16, offset, true)
  const result = new Uint8Array(offset + directorySize + end.length)
  let position = 0
  for (const chunk of [...chunks, ...central, end]) {
    result.set(chunk, position)
    position += chunk.length
  }
  return result
}

import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'

// Test-only server for Nuxt's prerendered output; no application fallback on missing assets.
const root = resolve(process.argv[2] || 'tests/fixtures/guide/.output/public')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.wasm': 'application/wasm' }
createServer((request, response) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return }
    const file = [path, path + '.html', resolve(path, 'index.html')].find(candidate => {
      try { return statSync(candidate).isFile() } catch { return false }
    })
    if (!file) { response.writeHead(404).end(); return }
    response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream')
    response.end(readFileSync(file))
  } catch { response.writeHead(400).end() }
}).listen(Number(process.env.PORT || 3439), '127.0.0.1', () => console.log('Guide fixture ready'))

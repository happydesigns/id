import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseChangelogMarkdown } from 'changelogen'

export function releaseNotes(changelog, version) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error('Expected a semantic release version')
  }
  const entries = parseChangelogMarkdown(changelog).releases.filter(entry => entry.version === version)
  if (entries.length !== 1 || !entries[0].body.trim()) {
    throw new Error(`Expected exactly one nonempty changelog entry for ${version}`)
  }
  return entries[0].body.trim() + '\n'
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const version = process.argv[2] || JSON.parse(readFileSync('package.json', 'utf8')).version
  const body = releaseNotes(readFileSync('CHANGELOG.md', 'utf8'), version)
  process.stdout.write(body)
}

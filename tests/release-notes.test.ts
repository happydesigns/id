import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { releaseNotes } from '../scripts/release-notes.mjs'

describe('release notes', () => {
  const changelog = '# Changelog\n\n## v0.3.0\n\n### Features\n\n- New export ([abc](https://example.com))\n\n## v0.2.0\n\n- Old export\n'
  it('uses only the selected generated entry, with optional human highlights', () => {
    const notes = releaseNotes(changelog, '0.3.0', '## Highlights\n\nA simpler export.')
    expect(notes).toContain('A simpler export.')
    expect(notes).toContain('New export')
    expect(notes).not.toContain('Old export')
  })
  it('supports prereleases', () => {
    expect(releaseNotes('## v0.3.0-beta.1\n\n- Preview\n', '0.3.0-beta.1')).toContain('Preview')
  })
  it('rejects absent, duplicate, empty and invalid entries', () => {
    expect(() => releaseNotes(changelog, '0.4.0')).toThrow()
    expect(() => releaseNotes(changelog + '\n## v0.3.0\n\n- Duplicate\n', '0.3.0')).toThrow()
    expect(() => releaseNotes('## v0.3.0\n', '0.3.0')).toThrow()
    expect(() => releaseNotes(changelog, '../0.3.0')).toThrow()
  })
})

it.each([
  ['fix: verify release fixture', '0.2.1'],
  ['feat: verify release fixture', '0.2.1'],
  ['feat!: verify release fixture', '0.3.0'],
  ['refactor: verify release fixture\n\nBREAKING CHANGE: replace the public contract', '0.3.0'],
])('infers the v0 release from %s and creates its version, changelog, commit and tag', (message, version) => {
  const cwd = mkdtempSync(join(tmpdir(), 'id-release-test-'))
  const git = (...args: string[]) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
  try {
    git('init')
    git('config', 'user.name', 'Release test')
    git('config', 'user.email', 'release@example.invalid')
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ name: 'release-test', version: '0.2.0', private: true }))
    copyFileSync(resolve('changelog.config.ts'), join(cwd, 'changelog.config.ts'))
    git('add', '.')
    git('commit', '-m', 'chore: initial fixture')
    git('tag', 'v0.2.0')
    writeFileSync(join(cwd, 'feature.txt'), 'fixture only')
    git('add', '.')
    git('commit', '-m', message)
    execFileSync(process.execPath, [resolve('node_modules/changelogen/dist/cli.mjs'), '--release', '--no-github', '--clean'], { cwd, stdio: 'pipe' })
    expect(JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')).version).toBe(version)
    expect(git('log', '-1', '--format=%s')).toBe('chore(release): v' + version)
    expect(git('rev-parse', 'v' + version + '^{}')).toBe(git('rev-parse', 'HEAD'))
    expect(git('status', '--porcelain')).toBe('')
    expect(releaseNotes(readFileSync(join(cwd, 'CHANGELOG.md'), 'utf8'), version)).toContain('Verify release fixture')
    expect(git('remote')).toBe('')
  }
  finally {
    rmSync(cwd, { recursive: true, force: true })
  }
}, 30000)

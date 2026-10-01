import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { test } from '@playwright/test'

test('build and verify native consumers from the browser exports', async () => {
  const build = promisify(execFile)(process.execPath, ['tests/helpers/build-native.mjs'], {
    timeout: 18 * 60_000,
    maxBuffer: 20 * 1024 * 1024,
  })
  build.child.stdout?.pipe(process.stdout)
  build.child.stderr?.pipe(process.stderr)
  await build
})

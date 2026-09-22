import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { createBlankStudioDocument } from '../../src/studio'

const projectKey = 'id-studio:project:2:editor-contract'

for (const mode of ['light', 'dark']) test('a replacement editor shares validation, preview, history, persistence and export: ' + mode, async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const document = createBlankStudioDocument()
  document.extension = { preserved: true }
  await page.addInitScript(({ document, projectKey }) => {
    if (localStorage.getItem(projectKey)) return
    localStorage.setItem(projectKey, JSON.stringify({ id: 'editor-contract', baseline: document, draft: document, updatedAt: Date.now() }))
    localStorage.setItem('id-studio:1:@example/brand:active', 'editor-contract')
  }, { document, projectKey })
  await page.goto('/editor?editor=colors&compare=true&docked=true&mode=' + mode)
  const editor = page.getByTestId('alternative-editor')
  const draft = page.frameLocator('iframe[title="Draft brand preview"]')
  const original = page.frameLocator('iframe[title="Original brand preview"]')
  const primary = () => draft.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--ui-primary').trim())
  await expect(draft.locator('input[type="email"]').first()).toBeVisible()
  const initial = await primary()
  await editor.getByRole('button', { name: 'Use violet', exact: true }).click()
  await expect(editor.getByRole('status')).toHaveText('Accepted')
  await expect(editor).toContainText('Primary: violet')
  await expect.poll(primary).not.toBe(initial)
  const violet = await primary()
  await expect.poll(() => original.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--ui-primary').trim())).toBe(initial)
  await editor.getByRole('button', { name: 'Try invalid palette', exact: true }).click()
  await expect(editor.getByRole('alert')).toContainText('Map semantic roles')
  await expect(editor.getByRole('status')).toHaveText('Rejected')
  await expect(editor).toContainText('Primary: violet')
  await expect.poll(primary).toBe(violet)
  await page.getByRole('button', { name: 'Undo change', exact: true }).click()
  await expect(editor.getByRole('alert')).toHaveCount(0)
  await expect.poll(primary).toBe(initial)
  await page.getByRole('button', { name: 'Redo change', exact: true }).click()
  await expect.poll(primary).toBe(violet)
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).draft.theme.ui.colors.primary, projectKey)).toBe('violet')
  await page.reload()
  await expect(editor).toContainText('Primary: violet')
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON', exact: true }).click()
  const download = await downloadEvent
  const exported = JSON.parse(await readFile((await download.path())!, 'utf8'))
  expect(exported.theme.ui.colors.primary).toBe('violet')
  expect(exported.extension).toEqual({ preserved: true })
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).draft.extension, projectKey)).toEqual({ preserved: true })
  expect(errors).toEqual([])
})

for (const width of [390, 1440]) test('default editor keeps palette editing and responsive focus behavior ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto('/studio?editor=colors&mode=light&docked=true')
  await expect(page.getByRole('heading', { name: 'Colors', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'New palette', exact: true }).click()
  const modal = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'New palette', exact: true }) })
  await modal.getByRole('textbox', { name: /^Palette name/ }).fill('ocean')
  await modal.getByRole('button', { name: 'Create palette', exact: true }).click()
  await expect(modal).toBeHidden()
  await expect(page.getByRole('button', { name: 'Actions for palette ocean', exact: true })).toBeVisible()
  await page.screenshot({ path: `.output/tests/editor-${width}.png` })
  if (width >= 1100) {
    await page.getByRole('button', { name: 'Undo change', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Actions for palette ocean', exact: true })).toHaveCount(0)
  }
  await page.getByRole('button', { name: 'Close settings', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Colors', exact: true })).toBeHidden()
  await expect(page.getByRole('button', { name: width < 1100 ? 'Editor' : 'Colors', exact: true })).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('a failed browser save requires a decision before leaving Studio', async ({ page }) => {
  await page.goto('/editor?editor=colors&mode=light')
  await expect(page.getByTestId('alternative-editor')).toBeVisible()
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage is full', 'QuotaExceededError')
    }
  })
  await page.getByRole('button', { name: 'Use violet', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Accepted')
  await page.getByRole('link', { name: 'Guide fixture home', exact: true }).click()
  const dialog = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Leave Studio?', exact: true }) })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Keep editing', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/editor(?:\?|$)/)
  await page.getByRole('button', { name: 'Colors', exact: true }).click()
  await expect(page.getByTestId('alternative-editor')).toContainText('Primary: violet')
  await page.getByRole('link', { name: 'Guide fixture home', exact: true }).click()
  await dialog.getByRole('button', { name: 'Leave Studio', exact: true }).click()
  await expect(page).toHaveURL('http://127.0.0.1:3439/')
})

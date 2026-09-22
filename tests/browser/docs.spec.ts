import { expect, test } from '@playwright/test'
import { createBlankStudioDocument } from '../../src/studio'

const base = 'http://127.0.0.1:3443'

test('theme round trip restores component defaults', async ({ page }) => {
  await page.goto(base)
  const theme = page.getByRole('banner').getByRole('combobox', { name: 'Theme', exact: true }).first()
  const mode = page.getByRole('banner').getByRole('button', { name: /Switch to .* mode/ }).first()
  await expect(mode).toBeVisible()
  const appearance = () => mode.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color, radius: style.borderRadius }
  })
  await theme.click()
  await page.getByRole('option', { name: 'Nuxt UI', exact: true }).click()
  await page.getByRole('heading', { level: 1 }).hover()
  const original = await appearance()
  await theme.click()
  await page.getByRole('option', { name: 'Sample Brand', exact: true }).click()
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(async () => (await appearance()).background).toBe('rgba(0, 0, 0, 0)')
  await expect.poll(() => page.getByRole('link', { name: 'Read the docs', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)')
  await mode.click()
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(async () => (await appearance()).background).toBe('rgba(0, 0, 0, 0)')
  await mode.click()
  await theme.click()
  await page.getByRole('option', { name: 'Nuxt UI', exact: true }).click()
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(appearance).toEqual(original)
})

test('Studio edits follow the selected profile into docs and survive reload', async ({ page }) => {
  const doc = createBlankStudioDocument()
  doc.theme.label = 'My profile'
  doc.theme.ui!.colors!.primary = 'violet'
  await page.addInitScript((document) => {
    if (localStorage.getItem('test-profile-seeded')) return
    localStorage.setItem('id-studio:project:2:test-profile', JSON.stringify({ id: 'test-profile', baseline: document, draft: document, updatedAt: Date.now() }))
    localStorage.setItem('id-studio:1:nuxt-ui:active', 'test-profile')
    localStorage.setItem('test-profile-seeded', 'true')
  }, doc)
  await page.goto(base)
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true }).first()).toContainText('My profile')
  await page.getByRole('link', { name: 'Open Studio', exact: true }).click()
  await page.getByRole('button', { name: 'Colors', exact: true }).click()
  await page.getByRole('button', { name: 'Primary', exact: true }).click()
  await page.getByRole('button', { name: 'rose', exact: true }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('id-studio:project:2:test-profile')!).draft.theme.ui.colors.primary)).toBe('rose')
  await page.getByRole('link', { name: 'happydesigns/id home', exact: true }).click()
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true }).first()).toContainText('My profile')
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary-500').trim())
  const rose = 'oklch(64.5% 0.246 16.439)'
  await expect.poll(primary).toBe(rose)
  await page.reload()
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true }).first()).toContainText('My profile')
  await expect.poll(primary).toBe(rose)
})

for (const width of [390, 1440]) test('landing shows working code tabs and fits viewport ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto(base)
  await expect(page.getByRole('link', { name: 'Read the docs', exact: true })).toHaveAttribute('href', '/getting-started/introduction')
  await expect(page.getByRole('tabpanel')).toContainText('extends:')
  await page.getByRole('tab', { name: 'main.css', exact: true }).click()
  await expect(page.getByRole('tabpanel')).toContainText('@import')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

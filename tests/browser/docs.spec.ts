import { expect, test, type Page } from '@playwright/test'
import presetData from '../../docs/app/data/nuxt-ui-presets.json' with { type: 'json' }
import { createBlankStudioDocument } from '../../src/studio'

const base = process.env.ID_DOCS_TEST_URL || 'http://127.0.0.1:3443'
const appearanceTrigger = (page: Page) => page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })

async function selectTheme(page: Page, label: string) {
  const trigger = appearanceTrigger(page)
  await expect(trigger).toHaveAttribute('aria-label', /^Appearance:/)
  const current = (await trigger.getAttribute('aria-label'))!.slice('Appearance: '.length)
  await trigger.click()
  await page.getByRole('menuitem', { name: current, exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('menuitemcheckbox', { name: label, exact: true }).click()
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
}

test('saved docs brand paints before hydration and resets to the baseline', async ({ page }) => {
  await page.goto(base)
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  await selectTheme(page, 'Iris')
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary-500').trim())
  const selectedColor = await primary()
  expect(selectedColor).toBeTruthy()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('id-studio:1:nuxt-ui:first-paint')!).light['--ui-color-primary-500'])).toBe(selectedColor)

  await page.route('**/_nuxt/*.js', route => route.abort())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(1)
  await expect.poll(primary).toBe(selectedColor)

  await page.unrouteAll()
  await page.reload()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Iris')
  await expect.poll(primary).toBe(selectedColor)
  const appearance = page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })
  await appearance.click()
  await page.getByRole('tab', { name: 'Dark', exact: true }).click()
  const darkBackground = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-bg').trim())
  await page.route('**/_nuxt/*.js', route => route.abort())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-bg').trim())).toBe(darkBackground)
  await page.unrouteAll()
  await page.reload()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Iris')
  await selectTheme(page, 'Nuxt UI')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('id-studio:1:nuxt-ui:first-paint'))).toBeNull()
  await page.reload()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(0)
})

test('invalid first-paint cache leaves prerendered docs intact', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('id-studio:1:nuxt-ui:active', 'catalog:brand:nuxt-ui-iris')
    localStorage.setItem('id-studio:1:nuxt-ui:first-paint', '{invalid')
  })
  await page.route('**/_nuxt/*.js', route => route.abort())
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('first-paint bridge ignores stale and unsafe CSS declarations', async ({ page }) => {
  await page.goto(base)
  const revision = (await page.locator('head script').first().textContent())?.match(/cache\?\.revision !== '([a-f0-9]{12})'/)?.[1]
  expect(revision).toBeTruthy()
  await page.route('**/_nuxt/*.js', route => route.abort())
  const cache = (value: string, rev: string) => page.evaluate(({ value, rev }) => {
    localStorage.setItem('id-studio:1:nuxt-ui:active', 'catalog:brand:nuxt-ui-iris')
    localStorage.setItem('id-studio:1:nuxt-ui:first-paint', JSON.stringify({ active: 'catalog:brand:nuxt-ui-iris', revision: rev, light: { '--ui-bg': value }, dark: {} }))
  }, { value, rev })
  await cache('red', 'old-revision')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(0)
  await cache('red;body{display:none}', revision!)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('theme round trip restores component defaults', async ({ page }) => {
  await page.goto(base)
  const mode = page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })
  const footer = page.getByRole('contentinfo')
  const footerGithub = footer.getByRole('link', { name: 'GitHub repository', exact: true })
  await expect(mode).toBeVisible()
  await expect(footerGithub).toBeVisible()
  await expect(footerGithub).toHaveAttribute('href', 'https://github.com/happydesigns/id')
  await expect(page.getByRole('banner').getByRole('link', { name: 'GitHub', exact: true })).toBeHidden()
  await expect(footer.getByRole('button', { name: /Switch to .* mode/ })).toHaveCount(0)
  const navigationBackgrounds = () => Promise.all([mode, footerGithub].map(button => button.evaluate(element => getComputedStyle(element).backgroundColor)))
  const appearance = () => mode.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color, radius: style.borderRadius }
  })
  await selectTheme(page, 'Nuxt UI')
  await page.getByRole('heading', { level: 1 }).hover()
  const original = await appearance()
  await selectTheme(page, 'Cobalt')
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(navigationBackgrounds).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'])
  await expect.poll(() => page.getByRole('link', { name: 'Read the docs', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)')
  await mode.click()
  await page.getByRole('tab', { name: 'Dark', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(navigationBackgrounds).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'])
  await mode.click()
  await page.getByRole('tab', { name: 'System', exact: true }).click()
  await page.keyboard.press('Escape')
  await selectTheme(page, 'Nuxt UI')
  await page.getByRole('heading', { level: 1 }).hover()
  await expect.poll(appearance).toEqual(original)
  await expect.poll(navigationBackgrounds).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'])
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
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: My profile')
  await page.getByRole('link', { name: 'Open Studio', exact: true }).click()
  await page.getByRole('button', { name: 'Colors', exact: true }).click()
  await page.getByRole('button', { name: 'Primary', exact: true }).click()
  await page.getByRole('button', { name: 'rose', exact: true }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('id-studio:project:2:test-profile')!).draft.theme.ui.colors.primary)).toBe('rose')
  await page.getByRole('link', { name: 'happydesigns/id home', exact: true }).click()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: My profile')
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary-500').trim())
  const rose = 'oklch(64.5% 0.246 16.439)'
  await expect.poll(primary).toBe(rose)
  await page.reload()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: My profile')
  await expect.poll(primary).toBe(rose)
  await page.route('**/_nuxt/*.js', route => route.abort())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('#id-theme-first-paint')).toHaveCount(1)
  await expect.poll(primary).toBe(rose)
})

for (const width of [390, 1440]) test('landing shows working code tabs and fits viewport ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto(base)
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  await expect(page.getByRole('link', { name: 'Read the docs', exact: true })).toHaveAttribute('href', '/getting-started/introduction')
  await expect(page.getByRole('tabpanel').first()).toContainText('@import')
  await expect.poll(() => page.getByRole('tabpanel').first().locator('code .line span').evaluateAll(elements => new Set(elements.map(element => getComputedStyle(element).color)).size)).toBeGreaterThan(1)
  await page.getByRole('tab', { name: 'app.config.ts', exact: true }).click()
  await expect(page.getByRole('tabpanel').first()).toContainText('defineAppConfig')
  await expect.poll(() => page.getByRole('tabpanel').first().locator('code .line span').evaluateAll(elements => new Set(elements.map(element => getComputedStyle(element).color)).size)).toBeGreaterThan(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `.output/tests/landing-${width}.png`, fullPage: true })
})

for (const width of [390, 1440]) test('appearance menu groups brand, mode and Studio controls ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto(base)
  const trigger = page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })
  await trigger.click()
  await page.getByRole('menuitem', { name: 'Nuxt UI', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await page.getByRole('menuitemcheckbox', { name: 'Cobalt', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAccessibleName('Appearance: Cobalt')
  await trigger.click()
  for (const mode of ['Dark', 'Light', 'System']) {
    await page.getByRole('tab', { name: mode, exact: true }).click()
    await expect(page.getByRole('tab', { name: mode, exact: true })).toHaveAttribute('aria-selected', 'true')
    if (mode !== 'System') await expect(page.locator('html')).toHaveClass(new RegExp(mode.toLowerCase()))
  }
  await page.screenshot({ path: '.output/tests/appearance-menu-' + width + '.png', animations: 'disabled' })
  await page.getByRole('menuitem', { name: 'Edit theme', exact: true }).click()
  await expect(page).toHaveURL(/studio\?/)
  await expect(page.getByRole('button', { name: 'Brand picker', exact: true })).toBeVisible()
})

test('preset edits and named copies share the Studio draft and preserve originals', async ({ page }) => {
  await page.goto(base)
  const trigger = page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })
  async function submenu(label: string | RegExp) {
    await trigger.click()
    await page.getByRole('menuitem', { name: label, exact: typeof label === 'string' }).focus()
    await page.keyboard.press('ArrowRight')
  }
  async function choose(label: string) {
    await page.getByRole('menuitemcheckbox', { name: label, exact: true }).click()
    await page.keyboard.press('Escape')
    await page.keyboard.press('Escape')
  }
  await submenu('Nuxt UI')
  await choose('Iris')
  await expect(trigger).toHaveAccessibleName('Appearance: Iris')
  await submenu(/^Primary/)
  await choose('orange')
  await expect(trigger).toHaveAccessibleName('Appearance: Iris (custom)')
  const active = () => page.evaluate(() => localStorage.getItem('id-studio:1:nuxt-ui:active'))
  const firstId = await active()
  await submenu(/^Radius/)
  await choose('0.75rem')
  await submenu(/^Font/)
  await choose('Georgia')
  await submenu(/^Icons/)
  await choose('Lucide')
  expect(await active()).toBe(firstId)
  await submenu('Iris (custom)')
  await page.getByRole('menuitem', { name: 'Create theme…', exact: true }).click()
  await page.getByRole('textbox', { name: 'Theme name', exact: true }).fill('Team Amber')
  await page.getByRole('button', { name: 'Create theme', exact: true }).click()
  await expect(trigger).toHaveAccessibleName('Appearance: Team Amber')
  await page.reload()
  await expect(trigger).toHaveAccessibleName('Appearance: Team Amber')
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary-500').trim())
  const orange = await primary()
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-radius').trim())).toBe('0.75rem')
  await submenu('Team Amber')
  await choose('Iris')
  expect(await primary()).not.toBe(orange)
  await submenu('Iris')
  await choose('Team Amber')
  await expect.poll(primary).toBe(orange)
  const savedId = await active()
  await trigger.click()
  await page.getByRole('menuitem', { name: 'Edit theme', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Brand picker', exact: true })).toContainText('Team Amber')
  expect(await active()).toBe(savedId)
})

test('all Nuxt UI presets resolve their palettes in both color modes', async ({ page }) => {
  await page.goto(base)
  const trigger = page.getByRole('banner').getByRole('button', { name: /^Appearance:/ })
  await expect(trigger).toHaveAccessibleName('Appearance: Nuxt UI')
  for (const preset of presetData.presets.filter(preset => preset.id !== 'default')) {
    await selectTheme(page, preset.name)
    await expect(trigger).toHaveAccessibleName('Appearance: ' + preset.name)
    await trigger.click()
    for (const mode of ['Light', 'Dark']) {
      await page.getByRole('tab', { name: mode, exact: true }).click()
      await expect(page.locator('html')).toHaveClass(new RegExp(mode.toLowerCase()))
      await expect.poll(() => page.evaluate(() => ['--ui-color-primary-500', '--ui-color-neutral-500'].map(name => getComputedStyle(document.documentElement).getPropertyValue(name).trim()).every(Boolean))).toBe(true)
    }
    if (preset.name === 'Iris') {
      await page.getByRole('menuitem', { name: 'Iris', exact: true }).focus()
      await page.keyboard.press('ArrowRight')
      const crimsonIcon = page.getByRole('menuitemcheckbox', { name: 'Crimson', exact: true }).locator('[data-slot=icon]')
      await expect.poll(() => crimsonIcon.evaluate(element => getComputedStyle(element).maskImage)).not.toBe('none')
      await page.screenshot({ path: '.output/tests/appearance-presets-dark.png', animations: 'disabled' })
      await page.keyboard.press('Escape')
    }
    await page.keyboard.press('Escape')
  }
})

for (const width of [390, 1440]) test('landing presets and template previews preserve component input ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.goto(base)
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  const presets = page.getByRole('group', { name: 'Brand presets', exact: true })
  await expect(presets.getByRole('button')).toHaveCount(12)
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveCount(0)
  await expect(page.locator('iframe[title$="thumbnail"]')).toHaveCount(0)
  const email = page.getByPlaceholder('john@example.com').first()
  await email.fill('preview@example.com')
  await presets.getByRole('button', { name: 'Apply Iris preset', exact: true }).click()
  await expect(presets.getByRole('button', { name: 'Apply Iris preset', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Iris')
  for (const template of ['Landing', 'Docs']) {
    await page.getByRole('button', { name: 'Templates', exact: true }).click()
    for (const thumbnail of ['Landing', 'Docs']) {
      const selector = 'iframe[title="' + thumbnail + ' thumbnail"]'
      await expect(page.locator(selector).locator('..')).toHaveAttribute('data-preview-state', 'ready')
      const colors = () => ['--ui-primary', '--ui-bg', '--ui-color-primary-500', '--ui-color-neutral-500'].map(name => getComputedStyle(document.documentElement).getPropertyValue(name).trim())
      const expected = await page.evaluate(colors)
      await expect.poll(() => page.frameLocator(selector).locator('html').evaluate(colors)).toEqual(expected)
    }
    await page.getByRole('button', { name: template, exact: true }).click()
    await expect(page.locator('iframe[title$="thumbnail"]')).toHaveCount(0)
    const frame = page.locator('iframe[title="' + template + ' template preview"]')
    await expect(frame).toBeVisible()
    await expect(frame.locator('..')).toHaveAttribute('data-preview-state', 'ready')
    await expect(page.frameLocator('iframe[title="' + template + ' template preview"]').locator('h1').first()).toBeVisible()
  }
  await page.getByRole('button', { name: 'Components', exact: true }).click()
  await expect(email).toHaveValue('preview@example.com')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('mobile header uses an accessible menu and one appearance control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base)
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  const header = page.getByRole('banner')
  await expect(header.getByRole('button', { name: /Switch to .* mode/, includeHidden: true })).toHaveCount(0)
  await header.getByRole('button', { name: 'Open menu', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('link').first()).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('a rendered template can report an error and recover on retry', async ({ page }) => {
  await page.goto(base)
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: Nuxt UI')
  await page.getByRole('button', { name: 'Templates', exact: true }).click()
  await page.getByRole('button', { name: 'Landing', exact: true }).click()
  const frame = page.locator('iframe[title="Landing template preview"]')
  await expect(frame.locator('..')).toHaveAttribute('data-preview-state', 'ready')
  const preview = await (await frame.elementHandle())!.contentFrame()
  await preview!.evaluate(() => parent.postMessage({ type: 'id-studio-preview-error' }, location.origin))
  await expect(page.getByText('Preview unavailable', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Retry preview', exact: true }).click()
  await expect(frame.locator('..')).toHaveAttribute('data-preview-state', 'ready')
})

for (const template of ['Landing', 'Docs']) test('theme changes replace preview colors in ' + template, async ({ page }) => {
  await page.goto(base)
  await selectTheme(page, 'Iris')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('id-studio:1:nuxt-ui:first-paint'))).not.toBeNull()
  await page.getByRole('button', { name: 'Templates', exact: true }).click()
  await page.getByRole('button', { name: template, exact: true }).click()
  const frame = page.frameLocator('iframe[title="' + template + ' template preview"]')
  const colors = (element: Element) => {
    const style = getComputedStyle(element)
    return ['--ui-primary', '--ui-bg', '--ui-color-primary-500', '--ui-color-neutral-500'].map(name => style.getPropertyValue(name).trim())
  }
  for (const theme of ['Coral', 'Nuxt UI', 'Iris']) {
    await selectTheme(page, theme)
    for (const mode of ['Dark', 'Light']) {
      await appearanceTrigger(page).click()
      await page.getByRole('tab', { name: mode, exact: true }).click()
      await page.keyboard.press('Escape')
      await expect(page.locator('html')).toHaveClass(new RegExp(mode.toLowerCase()))
      await expect.poll(() => frame.locator('html').evaluate(colors)).toEqual(await page.locator('html').evaluate(colors))
    }
  }
  await expect(frame.locator('#id-theme-first-paint')).toHaveCount(0)
})

for (const label of ['Nuxt UI', ...presetData.presets.filter(preset => preset.id !== 'default').map(preset => preset.name)]) test('preset survives Studio navigation without reload: ' + label, async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  await selectTheme(page, label)
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary-500').trim())
  const color = await primary()
  await page.getByRole('link', { name: 'Open Studio', exact: true }).click()
  await expect(page.getByRole('main', { name: 'Brand Studio', exact: true })).toBeVisible()
  await expect.poll(primary).toBe(color)
  await page.getByRole('link', { name: 'happydesigns/id home', exact: true }).click()
  await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: ' + label)
  await expect.poll(primary).toBe(color)
  expect(errors).toEqual([])
})

test('preset icons survive reload without icon API requests or SSR warnings', async ({ page }) => {
  test.setTimeout(120_000)
  const warnings: string[] = []
  const requests: string[] = []
  page.on('console', (message) => {
    if (/\[Icon\].*(failed|timed out)/.test(message.text())) warnings.push(message.text())
  })
  await page.route(url => /iconify\.design|simplesvg\.com|unisvg\.com/.test(url.hostname) || url.pathname.includes('/_nuxt_icon/'), (route) => {
    requests.push(route.request().url())
    return route.abort()
  })
  await page.goto(base)
  await expect(appearanceTrigger(page)).toBeVisible({ timeout: 30_000 })
  for (const preset of presetData.presets.filter(preset => preset.id !== 'default')) {
    await selectTheme(page, preset.name)
    await page.reload()
    await expect(appearanceTrigger(page)).toHaveAccessibleName('Appearance: ' + preset.name)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
  expect(warnings).toEqual([])
  expect(requests).toEqual([])
})

test('hero typography and generated code follow the selected preset', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/api/_mdc/highlight**', route => route.abort())
  await page.goto(base)
  await selectTheme(page, 'Parchment')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Source Serif 4/)
  await expect(page.getByRole('tabpanel').first()).toContainText('Source Serif 4')
  await expect.poll(() => page.evaluate(async () => {
    const faces = await document.fonts.load('700 48px "Source Serif 4"')
    return faces.length > 0 && faces.every(face => face.status === 'loaded')
  })).toBe(true)
  await selectTheme(page, 'Iris')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Manrope/)
  await expect(page.getByRole('tabpanel').first()).toContainText('Manrope')
  await expect(page.getByRole('tabpanel').first()).not.toContainText('Source Serif 4')
  expect(errors).toEqual([])
})

import { readFile, writeFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const lesson = '/courses/abap-platform-rap120/getting-started'
for (const kind of ['booking', 'course']) test('company brand in real ' + kind + ' playground', async ({ page }) => {
  test.skip(process.env.ID_CAPABILITY_NATIVE === '1', 'Run against the preview builds first')
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const path = kind === 'course' ? lesson : '/book'
  await page.goto('/studio?browse=true&view=' + kind + '&path=' + encodeURIComponent(path) + '&editor=styles&docked=true&mode=light')
  const draft = page.frameLocator('iframe[title="Draft brand preview"]')
  await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready', { timeout: 120_000 })
  if (kind === 'course') {
    await draft.locator('#course-checkpoint-group-id-selected').check()
  }
  else {
    await draft.getByTestId('session-card').first().locator('button').click()
    await draft.getByTestId('checkout').getByLabel(/^Name/).fill('Brand Preview')
  }
  const radius = () => draft.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--ui-radius').trim())
  const before = await radius()
  await page.getByRole('combobox', { name: 'Corner radius', exact: true }).fill('0.75rem')
  await page.getByRole('option', { name: '0.75rem', exact: true }).click()
  await expect.poll(radius).toBe('0.75rem')
  expect(before).not.toBe('0.75rem')
  if (kind === 'course') await expect(draft.locator('#course-checkpoint-group-id-selected')).toBeChecked()
  else await expect(draft.getByTestId('checkout').getByLabel(/^Name/)).toHaveValue('Brand Preview')
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON', exact: true }).click()
  const exported = await readFile((await (await pending).path())!, 'utf8')
  await writeFile('.output/capability-proof/exported-' + kind + '.json', exported)
  const measurements: Record<string, unknown> = {}
  for (const width of [390, 1100]) for (const mode of ['light', 'dark']) {
    await page.goto('/studio?view=' + kind + '&path=' + encodeURIComponent(path) + '&width=' + width + '&height=850&mode=' + mode)
    await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready')
    await expect(draft.locator('html')).toHaveClass(new RegExp(mode))
    await expect(draft.locator('h1').first()).toBeVisible()
    await expect.poll(() => draft.locator('body').evaluate(el => el.scrollWidth <= el.ownerDocument.documentElement.clientWidth + 1)).toBe(true)
    measurements[width + '-' + mode] = await draft.locator('h1').first().evaluate((el) => {
      const s = getComputedStyle(el), body = getComputedStyle(el.ownerDocument.body)
      return { color: s.color, font: s.fontFamily, background: body.backgroundColor, primary: s.getPropertyValue('--ui-primary').trim(), radius: s.getPropertyValue('--ui-radius').trim() }
    })
    await page.screenshot({ path: '.output/capability-proof/' + kind + '-' + width + '-' + mode + '.png' })
  }
  await writeFile('.output/capability-proof/' + kind + '-appearance.json', JSON.stringify(measurements, null, 2))
  expect(errors).toEqual([])
})

for (const [kind, port] of [['booking', 3462], ['course', 3461]] as const) test('native exported brand matches ' + kind + ' preview', async ({ page, context }) => {
  test.skip(process.env.ID_CAPABILITY_NATIVE !== '1', 'Requires native builds without the preview module')
  const expected = JSON.parse(await readFile('.output/capability-proof/' + kind + '-appearance.json', 'utf8'))
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const samples = []
  for (const width of [390, 1100]) for (const mode of ['light', 'dark']) {
    await page.setViewportSize({ width, height: 850 })
    await context.addInitScript(mode => localStorage.setItem('nuxt-color-mode', mode), mode)
    const start = Date.now()
    await page.goto('http://127.0.0.1:' + port + (kind === 'course' ? lesson : '/book'))
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('html')).toHaveClass(new RegExp(mode))
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('html')).not.toHaveAttribute('data-id-preview')
    const actual = await page.locator('h1').first().evaluate((el) => {
      const s = getComputedStyle(el), body = getComputedStyle(el.ownerDocument.body)
      return { color: s.color, font: s.fontFamily, background: body.backgroundColor, primary: s.getPropertyValue('--ui-primary').trim(), radius: s.getPropertyValue('--ui-radius').trim() }
    })
    const normalize = (value: typeof actual) => ({ ...value, primary: value.primary.toLowerCase(), font: value.font.split(',')[0], radius: Number.parseFloat(value.radius) })
    expect(normalize(actual)).toEqual(normalize(expected[width + '-' + mode]))
    if (kind === 'course') {
      const checkpoint = page.locator('#course-checkpoint-group-id-selected')
      await checkpoint.setChecked(true)
      await expect(checkpoint).toBeChecked()
    }
    else {
      await page.getByTestId('session-card').first().locator('button').click()
      await page.getByTestId('checkout').getByLabel(/^Name/).fill('Native Brand')
      await expect(page.getByTestId('checkout').getByLabel(/^Name/)).toHaveValue('Native Brand')
      const checkout = page.getByTestId('checkout')
      const submit = checkout.getByRole('button', { name: 'Continue to payment', exact: true })
      await checkout.getByLabel(/Email/).fill('invalid')
      await checkout.getByRole('checkbox').check()
      await expect(submit).toBeDisabled()
      await checkout.getByLabel(/Email/).fill('preview@example.test')
      await expect(submit).toBeEnabled()
    }
    samples.push({ width, mode, elapsedMs: Date.now() - start, resources: await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      return { requests: resources.length, transferredBytes: resources.reduce((sum, resource) => sum + resource.transferSize, 0) }
    }) })
  }
  await writeFile('.output/capability-proof/' + kind + '-native-metrics.json', JSON.stringify(samples, null, 2))
  expect(errors).toEqual([])
})

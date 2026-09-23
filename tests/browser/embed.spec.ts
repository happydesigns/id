import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) test('embedded Studio preserves input across host mode changes at ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/embed')
  const embed = page.locator('[data-studio-embed]')
  await embed.scrollIntoViewIfNeeded()
  await expect(embed).toHaveAttribute('data-studio-embed', 'ready', { timeout: 60000 })
  const studio = page.frameLocator('iframe[title="Embedded brand editor"]')
  const preview = studio.frameLocator('iframe[title="Draft brand preview"]')
  const email = preview.locator('input[type="email"]').first()
  await email.fill('preserved@example.com')
  // Observe the next paint from the host's mode mutation, before an asynchronous
  // iframe message can be assumed to have run. Every visible document must agree.
  await page.evaluate(() => {
    const root = document.documentElement
    const samples: string[][] = []
    ;(window as unknown as { modePaints: string[][] }).modePaints = samples
    new MutationObserver(() => {
      requestAnimationFrame(() => {
        const studioRoot = document.querySelector<HTMLIFrameElement>('iframe[title="Embedded brand editor"]')?.contentDocument
        const previewRoot = studioRoot?.querySelector<HTMLIFrameElement>('iframe[title="Draft brand preview"]')?.contentDocument
        samples.push([root, studioRoot?.documentElement, previewRoot?.documentElement].map(element => element?.classList.contains('dark') ? 'dark' : 'light'))
      })
    }).observe(root, { attributes: true, attributeFilter: ['class'] })
  })
  const oldMode = await studio.locator('main').getAttribute('data-mode')
  await page.getByRole('button', { name: 'Toggle host mode' }).click()
  await expect(studio.locator('main')).toHaveAttribute('data-mode', oldMode === 'dark' ? 'light' : 'dark')
  await expect(email).toHaveValue('preserved@example.com')
  await expect.poll(() => page.evaluate(() => (window as unknown as { modePaints: string[][] }).modePaints.length)).toBeGreaterThan(0)
  const paints = await page.evaluate(() => (window as unknown as { modePaints: string[][] }).modePaints)
  expect(paints.every(modes => modes.every(mode => mode === modes[0]))).toBe(true)
  await page.getByRole('button', { name: 'Toggle host mode' }).click()
  await expect(studio.locator('main')).toHaveAttribute('data-mode', oldMode!)
  await expect(email).toHaveValue('preserved@example.com')
  const picker = studio.getByRole('button', { name: 'Brand picker', exact: true })
  await expect(picker).toBeVisible()
  expect((await picker.boundingBox())!.width).toBeGreaterThan(100)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect.poll(() => studio.locator('html').evaluate(element => element.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('Docus Markdown activates its Studio embed after page scroll restoration', async ({ page }) => {
  await page.goto('/embed-guide')
  const embed = page.locator('[data-studio-embed]')
  // Docus restores its initial scroll position after hydrating the content page.
  await expect.poll(async () => {
    await embed.scrollIntoViewIfNeeded()
    return embed.getAttribute('data-studio-embed')
  }, { timeout: 60000 }).toBe('ready')
  const studio = page.frameLocator('iframe[title="Brand Studio"]')
  await expect(studio.getByRole('button', { name: 'Brand picker', exact: true })).toBeVisible()
  await expect(studio.frameLocator('iframe[title="Draft brand preview"]').locator('input[type="email"]').first()).toBeVisible()
})

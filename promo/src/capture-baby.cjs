// Captures baby-mode screens (several items + the parent gate) for the 4th promo video.
const { chromium } = require('playwright')
const out = require('path').join(__dirname, '../shots')
;(async () => {
  const b = await chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2.77, serviceWorkers: 'block' })
  await ctx.addInitScript(() => { localStorage.setItem('stars', '27'); localStorage.setItem('kidows_sound', 'off') })
  const p = await ctx.newPage()
  await p.goto('http://localhost:4173/'); await p.waitForTimeout(1000)
  await p.screenshot({ path: `${out}/home-full.png`, fullPage: false })
  await p.getByText('وضع مبسّط للرضّع').scrollIntoViewIfNeeded(); await p.waitForTimeout(300)
  await p.screenshot({ path: `${out}/home-baby-link.png` })
  await p.getByText('وضع مبسّط للرضّع').click(); await p.waitForTimeout(900)
  const want = { 'القطة': 'baby-cat', 'القمر': 'baby-moon', 'الزهرة': 'baby-flower', 'العصفور': 'baby-bird', 'السمكة': 'baby-fish', 'الشمس': 'baby-sun' }
  const got = new Set()
  for (let i = 0; i < 60 && got.size < Object.keys(want).length; i++) {
    const label = (await p.locator('span.font-display').first().innerText()).trim()
    if (want[label] && !got.has(label)) { await p.waitForTimeout(500); await p.screenshot({ path: `${out}/${want[label]}.png` }); got.add(label) }
    await p.mouse.click(195, 600); await p.waitForTimeout(450)
  }
  console.log('captured', [...got].join(' '))
  await p.getByLabel('رجوع (للأهل)').click(); await p.waitForTimeout(600)
  await p.screenshot({ path: `${out}/baby-gate.png` })
  await b.close()
})()

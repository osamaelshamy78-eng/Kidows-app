// node still.cjs <index> <t1,t2,...> — renders single frames for review.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path')
const v = require('./videos.cjs')[+process.argv[2]]; const ts = process.argv[3].split(',').map(Number)
;(async () => {
  fs.mkdirSync(path.join(__dirname, '../out'), { recursive: true })
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } })
  await p.goto('file://' + path.join(__dirname, 'template.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600)
  const T = await p.evaluate((c) => window.setup(c), { ...v, qrSvg: fs.readFileSync(path.join(__dirname, 'qr.svg'), 'utf8') })
  console.log(JSON.stringify(T))
  for (const t of ts) { await p.evaluate((x) => window.render(x), t); await p.screenshot({ path: path.join(__dirname, `../out/still-${t}.png`) }) }
  await b.close()
})()

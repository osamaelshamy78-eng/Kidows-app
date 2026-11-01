// node render.cjs [index]  — renders the promo videos to ../out/*.mp4 (1080x1920, 30fps).
const { chromium } = require('playwright')
const { spawn, execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const videos = require('./videos.cjs')
const FPS = 30
const out = path.resolve(__dirname, '../out')
fs.mkdirSync(out, { recursive: true })
const qrSvg = fs.readFileSync(path.join(__dirname, 'qr.svg'), 'utf8')
const crypto = require('crypto')
const voFile = (text) => path.join(__dirname, 'vo', crypto.createHash('sha1').update(text).digest('hex').slice(0, 12) + '.mp3')
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString())
const SFX = { pop: path.join(__dirname, 'sfx/pop.wav') }

// Some generated lines end with a short breath after the last word, which sounds
// like the speaker is about to continue. Cut any tiny sound after the final pause.
function clean(file) {
  const outFile = path.join(__dirname, 'clean', path.basename(file).replace(/\.\w+$/, '') + '-' + crypto.createHash('sha1').update(file).digest('hex').slice(0, 6) + '.wav')
  if (fs.existsSync(outFile)) return outFile
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  const total = dur(file)
  const out = require('child_process').spawnSync('ffmpeg', ['-i', file, '-af', 'silencedetect=n=-40dB:d=0.06', '-f', 'null', '-']).stderr.toString()
  const starts = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1])
  const ends = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1])
  let cut = total
  // trailing silence → speech end; if a blip under 0.2s sits between the last two pauses, cut before it
  const lastStart = starts[starts.length - 1]
  if (lastStart !== undefined && lastStart > total - 0.4) {
    cut = lastStart
    const prevEnd = ends.filter((e) => e < lastStart).pop(), prevStart = starts.filter((x) => x < lastStart).pop()
    if (prevEnd !== undefined && prevStart !== undefined && lastStart - prevEnd < 0.2) cut = prevStart
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-t', String(cut + 0.06), '-af', `afade=t=out:st=${Math.max(0, cut - 0.02)}:d=0.08`, '-ar', '44100', '-ac', '2', outFile])
  return outFile
}

// Stretch the hook, scenes and CTA so every spoken line fits with a little air after it.
function fitToVoice(v) {
  const fit = (base, text, lead = 0.35) => (text ? Math.max(base, lead + dur(clean(voFile(text))) + 0.45) : base)
  return {
    ...v,
    hookDur: fit(v.hookDur, v.hookVo),
    ctaDur: fit(v.ctaDur, v.ctaVo, 0.6),
    scenes: v.scenes.map((s, i) => {
      if (s.audio) return { ...s, dur: Math.max(s.dur, 0.25 + dur(clean(s.audio)) + 0.35) }
      // A line can run on under following keepCaption scenes, so only stretch for what they don't cover.
      let after = 0
      for (let j = i + 1; j < v.scenes.length && v.scenes[j].keepCaption; j++) after += v.scenes[j].dur
      return { ...s, dur: s.vo ? Math.max(s.dur, fit(0, s.vo, 0.2) - after) : s.dur }
    })
  }
}

async function renderOne(page, v0) {
  const v = fitToVoice(v0)
  await page.goto('file://' + path.join(__dirname, 'template.html'))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  const T = await page.evaluate((cfg) => window.setup(cfg), { ...v, qrSvg })
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))))
  const frames = Math.round(T.total * FPS)
  const silent = path.join(out, `${v.name}.video.mp4`)
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent])
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.render(t), f / FPS)
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
  }
  ff.stdin.end()
  await new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg ' + c)) : r())))

  // Audio: narrator voice-over, the app's own recordings, and one soft pop on the QR (no music).
  const clips = []
  if (v.hookVo) clips.push({ file: voFile(v.hookVo), at: 0.35, vol: 1.15 })
  v.scenes.forEach((s, i) => {
    const at = T.scenes[i][0]
    if (s.audio) clips.push({ file: s.audio, at: at + 0.25, vol: 1.15 })
    else if (s.vo) clips.push({ file: voFile(s.vo), at: at + 0.2, vol: 1.15 })
  })
  clips.push({ file: SFX.pop, at: T.cta[0] + 0.35, vol: 0.5 })
  if (v.ctaVo) clips.push({ file: voFile(v.ctaVo), at: T.cta[0] + 0.6, vol: 1.15 })
  const args = ['-y', '-loglevel', 'error', '-i', silent, '-f', 'lavfi', '-t', String(T.total), '-i', 'anullsrc=r=44100:cl=stereo']
  clips.forEach((c) => args.push('-i', c.file === SFX.pop ? c.file : clean(c.file)))
  const parts = clips.map((c, i) => `[${i + 2}:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${Math.round(c.at * 1000)}|${Math.round(c.at * 1000)},volume=${c.vol}[a${i}]`)
  const mix = `[1:a]${clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${clips.length + 1}:duration=first:normalize=0,alimiter=limit=0.95[aout]`
  args.push('-filter_complex', [...parts, mix].join(';'), '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', path.join(out, `${v.name}.mp4`))
  execFileSync('ffmpeg', args)
  fs.unlinkSync(silent)
  console.log(`✓ ${v.name}.mp4  ${T.total.toFixed(1)}s, ${frames} frames, ${clips.length} audio clips`)
}

;(async () => {
  const only = process.argv[2]
  const b = await chromium.launch()
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  for (const [i, v] of videos.entries()) if (only === undefined || String(i) === only) await renderOne(page, v)
  await b.close()
})()

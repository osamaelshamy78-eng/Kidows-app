// Fetches each voice-over line once (by hash) from the app's /api/tts.
const fs = require('fs'); const crypto = require('crypto')
const videos = require('./videos.cjs')
const base = 'https://mandm.mambz.com'
const lines = new Set(); videos.forEach((v) => { lines.add(v.hookVo); lines.add(v.ctaVo); v.scenes.forEach((s) => s.vo && lines.add(s.vo)) })
;(async () => {
  for (const text of lines) {
    const f = `vo/${crypto.createHash('sha1').update(text).digest('hex').slice(0, 12)}.mp3`
    if (fs.existsSync(f)) continue
    const r = await fetch(`${base}/api/tts?text=${encodeURIComponent(text)}`)
    if (!r.ok || !(r.headers.get('content-type') || '').startsWith('audio/')) { console.error('FAILED', r.status, text, await r.text()); process.exit(1) }
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); console.log('✓', f, text)
  }
})()

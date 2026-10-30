// Pre-generates narration mp3s for the adhkar and companion stories so they
// play instantly and offline, without spending ElevenLabs credits at runtime.
//
// Usage: node scripts/generate-audio.mjs https://<your-deployment>.vercel.app
// It calls that deployment's /api/tts (which holds the ElevenLabs key and voice).
// Files that already exist are skipped, so re-running only fills the gaps.

import { mkdir, writeFile, access } from 'node:fs/promises'
import { morningAdhkar, eveningAdhkar } from '../src/data/adhkar.js'
import { companionStories } from '../src/data/companions_extra.js'

const base = process.argv[2]
if (!base) {
  console.error('Usage: node scripts/generate-audio.mjs <deployment URL>')
  process.exit(1)
}

// Same cleanup the app applies before speaking (see prepareText in src/utils/audio.js).
function prepareText(text) {
  return text
    .replace(/ﷺ/g, ' صلى الله عليه وسلم ')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/[“”«»"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const jobs = [
  ...[...morningAdhkar, ...eveningAdhkar].map((item) => ({ file: `public/audio/adhkar/${item.id}.mp3`, text: item.text })),
  ...companionStories.flatMap((story) => story.pages.map((page, i) => ({ file: `public/audio/companions/${story.id}-${i + 1}.mp3`, text: page.text })))
]

const exists = (file) => access(file).then(() => true, () => false)
let made = 0
let skipped = 0
let chars = 0

for (const job of jobs) {
  if (await exists(job.file)) { skipped++; continue }
  const text = prepareText(job.text)
  const res = await fetch(`${base.replace(/\/$/, '')}/api/tts?text=${encodeURIComponent(text)}`)
  const type = res.headers.get('content-type') || ''
  if (!res.ok || !type.startsWith('audio/')) {
    console.error(`Stopped at ${job.file}: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  await mkdir(job.file.slice(0, job.file.lastIndexOf('/')), { recursive: true })
  await writeFile(job.file, Buffer.from(await res.arrayBuffer()))
  made++
  chars += text.length
  console.log(`✓ ${job.file}`)
}

console.log(`Done: ${made} generated (${chars} characters), ${skipped} already existed.`)

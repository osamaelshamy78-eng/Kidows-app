// Audio playback for Kidows, in priority order:
//   1. A real recording (item.audio mp3 in public/audio/)
//   2. Cloud Arabic voice (ElevenLabs via /api/tts) — natural Arabic accent
//   3. The device's own speech engine — last resort, quality varies by phone
// English uses the device engine directly: every phone ships a good English
// voice, while the cloud voice is tuned for Arabic.

const CLOUD_TIMEOUT_MS = 8000
const MAX_CACHED_CLIPS = 80

// One shared <audio> element. iOS only lets a page play sound from an element
// that was first played inside a user tap, so we "unlock" this one element on
// the first touch and reuse it for every clip afterwards.
let player = null
let unlocked = false
let voicesReadyPromise = null
let requestId = 0
let inflight = null
// 'unknown' until the first request; 'off' when /api/tts is missing or has no
// API key (e.g. `npm run dev`), so we stop asking for the rest of the session.
let cloudStatus = 'unknown'
const clipCache = new Map()
const SOUND_KEY = 'kidows_sound'

function readSoundSetting() {
  try { return localStorage.getItem(SOUND_KEY) !== 'off' } catch { return true }
}
let soundEnabled = readSoundSetting()

export function isSoundEnabled() {
  return soundEnabled
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled
  try { localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off') } catch { /* private mode */ }
  if (!enabled) stopAudio()
}

// A 1ms silent WAV, used only to unlock the player on iOS.
const SILENT_WAV = 'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAAA'

function getPlayer() {
  if (!player && typeof Audio !== 'undefined') {
    player = new Audio()
    player.preload = 'auto'
  }
  return player
}

export function installAudioUnlock() {
  if (typeof window === 'undefined') return
  const unlock = () => {
    if (unlocked) return
    unlocked = true
    const el = getPlayer()
    if (el && !el.src) {
      el.src = SILENT_WAV
      el.play().then(() => el.pause()).catch(() => {})
    }
    // Speaking an empty utterance inside a tap unlocks speechSynthesis on iOS.
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance('')
      u.volume = 0
      window.speechSynthesis.speak(u)
    }
    window.removeEventListener('pointerdown', unlock, true)
    window.removeEventListener('touchend', unlock, true)
  }
  window.addEventListener('pointerdown', unlock, true)
  window.addEventListener('touchend', unlock, true)
  getVoicesWhenReady()
}

export function stopAudio() {
  requestId += 1
  inflight?.abort()
  inflight = null
  if (player) {
    player.pause()
    player.onended = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// Text cleanup so engines don't spell out symbols or read emoji names.
function prepareText(text, lang) {
  return String(text || '')
    .replace(/ﷺ/g, lang === 'en' ? ' peace be upon him ' : ' صلى الله عليه وسلم ')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/[“”«»"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ---------- 1. recorded files / cloud clips ----------

function playUrl(url, myId) {
  const el = getPlayer()
  if (!el || myId !== requestId) return Promise.resolve(false)
  el.onended = null
  el.src = url
  el.currentTime = 0
  return el.play().then(() => myId === requestId, () => false)
}

async function fetchCloudClip(text, myId) {
  if (cloudStatus === 'off') return null
  if (clipCache.has(text)) return clipCache.get(text)

  const controller = new AbortController()
  inflight = controller
  const timer = setTimeout(() => controller.abort(), CLOUD_TIMEOUT_MS)
  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`, { signal: controller.signal })
    const type = res.headers.get('content-type') || ''
    if (!res.ok || !type.startsWith('audio/')) {
      // 404 = no serverless function here, 501 = no API key: don't retry.
      if (res.status === 404 || res.status === 501 || (res.ok && !type.startsWith('audio/'))) cloudStatus = 'off'
      return null
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    cloudStatus = 'ok'
    clipCache.set(text, url)
    if (clipCache.size > MAX_CACHED_CLIPS) {
      const [oldestKey, oldestUrl] = clipCache.entries().next().value
      clipCache.delete(oldestKey)
      URL.revokeObjectURL(oldestUrl)
    }
    return myId === requestId ? url : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
    if (inflight === controller) inflight = null
  }
}

// ---------- 3. device speech engine ----------

function getVoicesWhenReady() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([])
  const synth = window.speechSynthesis
  const existing = synth.getVoices()
  if (existing.length) return Promise.resolve(existing)

  if (!voicesReadyPromise) {
    voicesReadyPromise = new Promise((resolve) => {
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        synth.removeEventListener?.('voiceschanged', onChange)
        resolve(synth.getVoices())
      }
      const onChange = () => { if (synth.getVoices().length) done() }
      synth.addEventListener?.('voiceschanged', onChange)
      synth.getVoices()
      // Some browsers never fire voiceschanged.
      setTimeout(done, 1500)
    }).then((voices) => {
      // Allow a later retry if nothing loaded this time.
      if (!voices.length) voicesReadyPromise = null
      return voices
    })
  }
  return voicesReadyPromise
}

// Higher score = more natural sounding. Network/neural voices beat the
// compact offline ones that cause the robotic or foreign accent.
function scoreVoice(voice, lang) {
  const voiceLang = (voice.lang || '').toLowerCase().replace('_', '-')
  const name = (voice.name || '').toLowerCase()
  const preferred = lang === 'en' ? ['en-us', 'en-gb'] : ['ar-sa', 'ar-eg', 'ar-ae', 'ar-xa']
  if (!voiceLang.startsWith(lang)) return -1
  let score = 1
  const rank = preferred.indexOf(voiceLang)
  if (rank !== -1) score += preferred.length - rank
  if (/natural|neural|online|premium|enhanced|google/.test(name)) score += 10
  if (/compact|espeak/.test(name)) score -= 5
  if (!voice.localService) score += 2
  return score
}

function pickVoice(voices, lang) {
  let best = null
  let bestScore = -1
  for (const voice of voices) {
    const score = scoreVoice(voice, lang)
    if (score > bestScore) { best = voice; bestScore = score }
  }
  return best
}

// Chrome cuts off utterances longer than ~15 seconds, so speak sentence by sentence.
function splitSentences(text) {
  return text.split(/(?<=[.!؟?،,؛])\s+/).filter(Boolean)
}

function speakWithDevice(text, lang, voices) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return false
  const synth = window.speechSynthesis
  synth.cancel()
  if (synth.paused) synth.resume()

  const voice = pickVoice(voices, lang)
  for (const part of splitSentences(text)) {
    const utterance = new SpeechSynthesisUtterance(part)
    utterance.lang = voice?.lang || (lang === 'en' ? 'en-US' : 'ar-SA')
    utterance.rate = lang === 'en' ? 0.9 : 0.8
    utterance.pitch = 1.05
    if (voice) utterance.voice = voice
    synth.speak(utterance)
  }
  return true
}

// ---------- public API ----------

export async function warmUpVoices() {
  await getVoicesWhenReady()
}

export async function playText(text, lang = 'ar') {
  stopAudio()
  const myId = requestId
  const clean = prepareText(text, lang)
  if (!clean || !soundEnabled) return false

  if (lang !== 'en') {
    const url = await fetchCloudClip(clean, myId)
    if (myId !== requestId) return false
    if (url && await playUrl(url, myId)) return true
  }

  const voices = await getVoicesWhenReady()
  if (myId !== requestId) return false
  return speakWithDevice(clean, lang, voices)
}

export async function playItem(item, lang = 'ar') {
  stopAudio()
  if (!soundEnabled) return false
  if (lang !== 'en' && item?.audio) {
    const myId = requestId
    if (await playUrl(item.audio, myId)) return true
  }
  return playText(item?.text || '', lang)
}

export function hasSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

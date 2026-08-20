// Audio helper with three tiers, tried in order:
// 1. A real recording (item.audio path) - best quality, use once you have
//    professionally recorded mp3 files.
// 2. Cloud TTS via /api/tts (ElevenLabs) - much more natural than browser
//    TTS, needs ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID set as Vercel env
//    vars (see api/tts.js). Results are cached in-memory per session so the
//    same line isn't re-requested every tap.
// 3. Browser text-to-speech (Web Speech API) - free, works with zero setup,
//    but sounds robotic. Used only if the cloud call fails or isn't
//    configured yet (e.g. during local `npm run dev` without `vercel dev`).

let currentAudioEl = null
const cloudAudioCache = new Map()

export function stopAudio() {
  if (currentAudioEl) {
    currentAudioEl.pause()
    currentAudioEl = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

function speakWithTTS(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar-SA'
  utterance.rate = 0.85
  utterance.pitch = 1

  const voices = window.speechSynthesis.getVoices()
  const arabicVoice = voices.find((v) => v.lang && v.lang.startsWith('ar'))
  if (arabicVoice) utterance.voice = arabicVoice

  window.speechSynthesis.speak(utterance)
}

async function playCloudTTS(text) {
  if (cloudAudioCache.has(text)) {
    const url = cloudAudioCache.get(text)
    const el = new Audio(url)
    currentAudioEl = el
    await el.play()
    return
  }

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })

  if (!response.ok) {
    throw new Error('cloud tts unavailable')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  cloudAudioCache.set(text, url)

  const el = new Audio(url)
  currentAudioEl = el
  await el.play()
}

export async function playItem(item) {
  stopAudio()

  if (item.audio) {
    const el = new Audio(item.audio)
    currentAudioEl = el
    el.play().catch(() => playCloudTTS(item.text).catch(() => speakWithTTS(item.text)))
    return
  }

  try {
    await playCloudTTS(item.text)
  } catch {
    speakWithTTS(item.text)
  }
}

export function hasSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

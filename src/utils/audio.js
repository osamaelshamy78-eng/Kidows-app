let currentAudioEl = null
const cloudAudioCache = new Map()
let voicesWarmed = false

export function stopAudio() {
  if (currentAudioEl) {
    currentAudioEl.pause()
    currentAudioEl = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// Some Android browsers (Samsung Internet in particular) return an empty
// voice list on the very first call because voices load asynchronously.
// This just nudges the browser to load them ahead of time and caches the
// result — it never blocks an actual speak() call, because on iOS/Safari
// speak() MUST be invoked synchronously inside the user-gesture call stack;
// any `await` in front of it silently breaks it there.
export function warmUpVoices() {
  if (voicesWarmed || typeof window === 'undefined' || !window.speechSynthesis) return
  voicesWarmed = true
  const synth = window.speechSynthesis
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => synth.getVoices()
    synth.getVoices()
  }
  // Many Android TTS engines have a noticeable "cold start" delay the very
  // first time speak() is called after the page loads. Nudging it early
  // with a near-silent utterance means the real first phrase plays without
  // that lag.
  try {
    const primer = new SpeechSynthesisUtterance(' ')
    primer.volume = 0
    synth.speak(primer)
  } catch {
    // Some engines reject empty/near-empty text — harmless to skip.
  }
}

function pickVoice(voices, lang) {
  return lang === 'en'
    ? voices.find((v) => v.lang?.toLowerCase().startsWith('en'))
    : voices.find((v) => v.lang?.toLowerCase() === 'ar-sa')
      || voices.find((v) => v.lang?.toLowerCase() === 'ar-ae')
      || voices.find((v) => v.lang?.toLowerCase().startsWith('ar'))
}

// Speaks synchronously (required for iOS/Safari to accept it as part of the
// user gesture). Returns true if a matching voice was found and speak() was
// called, false if no matching voice exists on this device at all — the
// caller can then fall back to cloud TTS.
function speakWithTTS(text, lang = 'ar') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  window.speechSynthesis.cancel()

  const voices = window.speechSynthesis.getVoices()
  const targetVoice = pickVoice(voices, lang)
  if (!targetVoice) return false

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA'
  utterance.rate = 0.85
  utterance.pitch = 1
  utterance.voice = targetVoice
  window.speechSynthesis.speak(utterance)
  return true
}

async function playCloudTTS(text, lang = 'ar') {
  const cacheKey = `${lang}:${text}`
  if (cloudAudioCache.has(cacheKey)) {
    const el = new Audio(cloudAudioCache.get(cacheKey))
    currentAudioEl = el
    await el.play()
    return
  }

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang })
  })

  if (!response.ok) throw new Error('cloud tts unavailable')

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  cloudAudioCache.set(cacheKey, url)
  const el = new Audio(url)
  currentAudioEl = el
  await el.play()
}

export async function playText(text, lang = 'ar') {
  stopAudio()

  // Arabic narration prefers the device's Modern Standard Arabic voice
  // (avoids regional/dialect cloud voices). speakWithTTS() must run
  // synchronously (see comment above) — if no Arabic voice exists on this
  // device at all, only then do we fall back to the cloud voice.
  if (lang === 'ar') {
    const spoke = speakWithTTS(text, 'ar')
    if (!spoke) {
      try {
        await playCloudTTS(text, 'ar')
      } catch {
        // Cloud TTS not configured/unavailable either — nothing left to try.
      }
    }
    return
  }

  try {
    await playCloudTTS(text, lang)
  } catch {
    speakWithTTS(text, lang)
  }
}

export async function playItem(item, lang = 'ar') {
  stopAudio()
  if (lang === 'ar' && item.audio) {
    const el = new Audio(item.audio)
    currentAudioEl = el
    el.play().catch(() => speakWithTTS(item.text, 'ar'))
    return
  }
  await playText(item.text, lang)
}

export function hasSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

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

// Some Android browsers (Samsung Internet in particular) return an empty
// voice list on the very first call because voices load asynchronously.
// Wait briefly for `voiceschanged` before giving up, instead of assuming
// "no voices" means "definitely no voices".
function getVoicesAsync() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length > 0) {
      resolve(existing)
      return
    }
    let settled = false
    const finish = (voices) => {
      if (settled) return
      settled = true
      resolve(voices)
    }
    window.speechSynthesis.onvoiceschanged = () => finish(window.speechSynthesis.getVoices())
    // Fallback timeout in case the event never fires on this device/browser.
    setTimeout(() => finish(window.speechSynthesis.getVoices()), 800)
  })
}

// Returns true if it actually found a voice and asked it to speak,
// false if no matching voice exists on this device (so the caller can
// fall back to cloud TTS instead of failing silently).
async function speakWithTTS(text, lang = 'ar') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  window.speechSynthesis.cancel()

  const voices = await getVoicesAsync()
  const targetVoice = lang === 'en'
    ? voices.find((v) => v.lang?.toLowerCase().startsWith('en'))
    : voices.find((v) => v.lang?.toLowerCase() === 'ar-sa')
      || voices.find((v) => v.lang?.toLowerCase() === 'ar-ae')
      || voices.find((v) => v.lang?.toLowerCase().startsWith('ar'))

  // No matching voice installed on this device at all — speak() would
  // either silently do nothing or throw depending on the browser.
  if (!targetVoice) return false

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA'
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.voice = targetVoice
    utterance.onend = () => resolve(true)
    utterance.onerror = () => resolve(false)
    window.speechSynthesis.speak(utterance)
  })
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
  // (avoids regional/dialect cloud voices). But many Android tablets
  // (Samsung especially) ship with no Arabic TTS voice installed at all,
  // so if the device can't speak it, fall back to the cloud voice instead
  // of failing silently.
  if (lang === 'ar') {
    const spoke = await speakWithTTS(text, 'ar')
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

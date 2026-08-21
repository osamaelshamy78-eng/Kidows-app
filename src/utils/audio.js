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

function speakWithTTS(text, lang = 'ar') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA'
  utterance.rate = 0.85
  utterance.pitch = 1
  const voices = window.speechSynthesis.getVoices()
  const targetVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang === 'en' ? 'en' : 'ar'))
  if (targetVoice) utterance.voice = targetVoice
  window.speechSynthesis.speak(utterance)
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
    el.play().catch(() => playCloudTTS(item.text, 'ar').catch(() => speakWithTTS(item.text, 'ar')))
    return
  }
  await playText(item.text, lang)
}

export function hasSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

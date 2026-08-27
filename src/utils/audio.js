// Device-only text-to-speech. No cloud/network dependency: everything here
// relies purely on the browser's built-in speechSynthesis engine. On a
// device with no Arabic voice installed, Arabic narration simply won't
// play — there is no cloud fallback by design (kept intentionally simple).

let currentAudioEl = null
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
// This just nudges the browser to start loading them ahead of time — it
// does NOT call speak() here (an earlier attempt to "warm up" the engine
// with a silent utterance caused some Android TTS engines to get stuck
// and go silent afterward).
export function warmUpVoices() {
  if (voicesWarmed || typeof window === 'undefined' || !window.speechSynthesis) return
  voicesWarmed = true
  const synth = window.speechSynthesis
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => synth.getVoices()
    synth.getVoices()
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
// called, false if no matching voice exists on this device at all.
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

export async function playText(text, lang = 'ar') {
  stopAudio()
  speakWithTTS(text, lang)
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

// Reliable browser/device text-to-speech for Kidows.
// The previous implementation failed when Android/iOS had not finished
// loading its voice list: getVoices() returned [] and playback silently stopped.

let currentAudioEl = null
let voicesReadyPromise = null

export function stopAudio() {
  if (currentAudioEl) {
    currentAudioEl.pause()
    currentAudioEl.currentTime = 0
    currentAudioEl = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

function getVoicesWhenReady() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  const synth = window.speechSynthesis
  const existing = synth.getVoices()
  if (existing.length) return Promise.resolve(existing)

  if (!voicesReadyPromise) {
    voicesReadyPromise = new Promise((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        const voices = synth.getVoices()
        if (voices.length) {
          settled = true
          synth.removeEventListener?.('voiceschanged', finish)
          resolve(voices)
        }
      }

      synth.addEventListener?.('voiceschanged', finish)
      // Trigger voice loading on browsers that need an initial getVoices().
      synth.getVoices()

      // Fallback for browsers that do not fire voiceschanged reliably.
      setTimeout(() => {
        const voices = synth.getVoices()
        if (!settled) {
          settled = true
          synth.removeEventListener?.('voiceschanged', finish)
          resolve(voices)
        }
      }, 1200)
    })
  }

  return voicesReadyPromise
}

function pickVoice(voices, lang) {
  if (lang === 'en') {
    return voices.find((v) => v.lang?.toLowerCase() === 'en-us')
      || voices.find((v) => v.lang?.toLowerCase().startsWith('en'))
  }

  return voices.find((v) => v.lang?.toLowerCase() === 'ar-sa')
    || voices.find((v) => v.lang?.toLowerCase() === 'ar-ae')
    || voices.find((v) => v.lang?.toLowerCase() === 'ar-eg')
    || voices.find((v) => v.lang?.toLowerCase().startsWith('ar'))
}

function speakWithTTS(text, lang, voices) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return false

  const synth = window.speechSynthesis
  synth.cancel()

  const targetVoice = pickVoice(voices, lang)
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA'
  utterance.rate = lang === 'en' ? 0.9 : 0.85
  utterance.pitch = 1
  if (targetVoice) utterance.voice = targetVoice

  synth.speak(utterance)
  return true
}

export async function warmUpVoices() {
  await getVoicesWhenReady()
}

export async function playText(text, lang = 'ar') {
  stopAudio()
  const voices = await getVoicesWhenReady()
  return speakWithTTS(text, lang, voices)
}

export async function playItem(item, lang = 'ar') {
  stopAudio()

  if (lang === 'ar' && item?.audio) {
    const el = new Audio(item.audio)
    currentAudioEl = el
    try {
      await el.play()
      return true
    } catch {
      currentAudioEl = null
    }
  }

  return playText(item?.text || '', lang)
}

export function hasSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

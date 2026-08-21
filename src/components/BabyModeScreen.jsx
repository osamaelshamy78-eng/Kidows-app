import { useState, useEffect, useRef } from 'react'
import { babyItems } from '../data/babyItems.js'
import { babyTranslationsEn } from '../data/i18n.js'
import { playText, stopAudio } from '../utils/audio.js'

export default function BabyModeScreen({ lang = 'ar', onBack }) {
  const [current, setCurrent] = useState(babyItems[0])
  const [pop, setPop] = useState(false)
  const hasPlayedFirst = useRef(false)
  const isEn = lang === 'en'
  const localized = isEn ? babyTranslationsEn[current.id] : { label: current.label, text: current.text }

  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasPlayedFirst.current) {
        playText(localized.text, lang)
        hasPlayedFirst.current = true
      }
    }, 600)
    return () => { clearTimeout(t); stopAudio() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTap() {
    const others = babyItems.filter((i) => i.id !== current.id)
    const next = others[Math.floor(Math.random() * others.length)]
    setCurrent(next)
    setPop(true)
    const nextLocalized = isEn ? babyTranslationsEn[next.id] : { text: next.text }
    playText(nextLocalized.text, lang)
    setTimeout(() => setPop(false), 400)
  }

  return (
    <div onClick={handleTap} dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: `${current.color}22` }}>
      <button onClick={(e) => { e.stopPropagation(); stopAudio(); onBack() }} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 text-ink/50 text-sm z-10" aria-label={isEn ? 'Back for parents' : 'رجوع (للأهل)'}>⏎</button>
      <div className={`text-[10rem] leading-none transition-transform duration-300 ${pop ? 'scale-125' : 'scale-100'}`}>{current.emoji}</div>
      <div className="mt-6 rounded-full px-8 py-3 shadow-md" style={{ backgroundColor: current.color }}>
        <span className="font-display text-3xl text-white">{localized.label}</span>
      </div>
      <p className="font-body text-ink/40 mt-10 text-sm">{isEn ? 'Tap anywhere ✨' : 'دوس في أي حتة ✨'}</p>
    </div>
  )
}

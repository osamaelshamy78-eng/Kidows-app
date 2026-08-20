import { useState, useEffect, useRef } from 'react'
import { babyItems } from '../data/babyItems.js'
import { playItem, stopAudio } from '../utils/audio.js'

export default function BabyModeScreen({ onBack }) {
  const [current, setCurrent] = useState(babyItems[0])
  const [pop, setPop] = useState(false)
  const hasPlayedFirst = useRef(false)

  useEffect(() => {
    // announce the first item shortly after the screen opens
    const t = setTimeout(() => {
      if (!hasPlayedFirst.current) {
        playItem(current)
        hasPlayedFirst.current = true
      }
    }, 600)
    return () => {
      clearTimeout(t)
      stopAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTap() {
    const others = babyItems.filter((i) => i.id !== current.id)
    const next = others[Math.floor(Math.random() * others.length)]
    setCurrent(next)
    setPop(true)
    playItem(next)
    setTimeout(() => setPop(false), 400)
  }

  return (
    <div
      onClick={handleTap}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: `${current.color}22` }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          stopAudio()
          onBack()
        }}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 text-ink/50 text-sm z-10"
        aria-label="رجوع (للأهل)"
      >
        ⏎
      </button>

      <div
        className={`text-[10rem] leading-none transition-transform duration-300 ${
          pop ? 'scale-125' : 'scale-100'
        }`}
      >
        {current.emoji}
      </div>

      <div
        className="mt-6 rounded-full px-8 py-3 shadow-md"
        style={{ backgroundColor: current.color }}
      >
        <span className="font-display text-3xl text-white">{current.label}</span>
      </div>

      <p className="font-body text-ink/40 mt-10 text-sm">دوس في أي حتة ✨</p>
    </div>
  )
}

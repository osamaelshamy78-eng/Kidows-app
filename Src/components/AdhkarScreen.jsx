import { useState, useEffect } from 'react'
import { playItem, stopAudio } from '../utils/audio.js'

export default function AdhkarScreen({ type, items, onBack, onComplete }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    return () => stopAudio()
  }, [])

  const isMorning = type === 'morning'
  const bg = isMorning ? 'bg-gold-light/30' : 'bg-night-deep'
  const textColor = isMorning ? 'text-ink' : 'text-cream'
  const cardBg = isMorning ? 'bg-white' : 'bg-night'

  const current = items[index]
  const isLast = index === items.length - 1

  function handleBack() {
    stopAudio()
    onBack()
  }

  function handleNext() {
    stopAudio()
    if (isLast) {
      setDone(true)
      onComplete()
    } else {
      setIndex(index + 1)
    }
  }

  if (done) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-6 px-6 ${bg}`}>
        <div className="text-8xl animate-bounce">🌟</div>
        <h2 className={`font-display text-3xl text-center ${textColor}`}>
          أحسنت! خلصت {isMorning ? 'أذكار الصباح' : 'أذكار المساء'}
        </h2>
        <button
          onClick={handleBack}
          className="bg-teal text-white font-body font-bold rounded-full px-8 py-3 shadow-lg active:scale-95 transition-transform"
        >
          رجوع للحديقة
        </button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={handleBack}
          className={`font-body font-bold ${textColor} bg-white/20 rounded-full px-4 py-2`}
        >
          رجوع
        </button>
        <div className="flex gap-1">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i <= index ? 'bg-gold' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-7xl">{current.icon}</div>
        <div className={`${cardBg} rounded-3xl shadow-xl px-6 py-8 w-full max-w-sm`}>
          <p className={`font-display text-2xl leading-relaxed text-center ${isMorning ? 'text-ink' : 'text-cream'}`}>
            {current.text}
          </p>
          <p className={`font-body text-sm text-center mt-4 ${isMorning ? 'text-ink/60' : 'text-cream/60'}`}>
            {current.meaning}
          </p>
          <button
            onClick={() => playItem(current)}
            className={`mx-auto mt-5 flex items-center justify-center w-14 h-14 rounded-full ${
              isMorning ? 'bg-gold text-white' : 'bg-teal text-white'
            } shadow-md active:scale-90 transition-transform`}
            aria-label="اسمع الذكر"
          >
            <span className="text-2xl">🔊</span>
          </button>
        </div>
      </div>

      <div className="px-6 pb-10">
        <button
          onClick={handleNext}
          className="w-full bg-brick text-white font-display text-xl rounded-full py-4 shadow-lg active:scale-95 transition-transform"
        >
          {isLast ? 'خلصت! 🎉' : 'قلتها ✅'}
        </button>
      </div>
    </div>
  )
}

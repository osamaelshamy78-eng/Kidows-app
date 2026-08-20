import { useState } from 'react'
import { wuduSteps } from '../data/wudu.js'

export default function WuduScreen({ onBack, onComplete }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  const isLast = index === wuduSteps.length - 1
  const current = wuduSteps[index]

  function handleNext() {
    if (isLast) {
      setDone(true)
      onComplete()
    } else {
      setIndex(index + 1)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-teal-light/30">
        <div className="text-8xl animate-bounce">🌟</div>
        <h2 className="font-display text-3xl text-center text-teal-dark">
          برافو! اتوضيت صح
        </h2>
        <button
          onClick={onBack}
          className="bg-teal text-white font-body font-bold rounded-full px-8 py-3 shadow-lg active:scale-95 transition-transform"
        >
          رجوع
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-light/20">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onBack}
          className="font-body font-bold text-ink bg-white/60 rounded-full px-4 py-2"
        >
          رجوع
        </button>
        <span className="font-body font-bold text-ink/60">
          خطوة {index + 1} من {wuduSteps.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-8xl">{current.icon}</div>
        <div className="bg-white rounded-3xl shadow-xl px-6 py-8 w-full max-w-sm">
          <p className="font-body text-xl leading-relaxed text-center text-ink">
            {current.text}
          </p>
        </div>
      </div>

      <div className="px-6 pb-10">
        <button
          onClick={handleNext}
          className="w-full bg-teal text-white font-display text-xl rounded-full py-4 shadow-lg active:scale-95 transition-transform"
        >
          {isLast ? 'خلصت الوضوء! 🎉' : 'الخطوة اللي جايه ⬅️'}
        </button>
      </div>
    </div>
  )
}

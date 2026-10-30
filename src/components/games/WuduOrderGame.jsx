import { useEffect, useState } from 'react'
import { GameShell, Result, shuffle, praise } from './common.jsx'
import { playText, stopAudio } from '../../utils/audio.js'

// Short labels for the wudu steps in src/data/wudu.js (w1–w7), in order.
const steps = [
  { id: 'w1', icon: '🤲', ar: 'بسم الله', en: 'Bismillah' },
  { id: 'w2', icon: '🧼', ar: 'غسل اليدين', en: 'Wash hands' },
  { id: 'w3', icon: '💧', ar: 'المضمضة والاستنشاق', en: 'Mouth & nose' },
  { id: 'w4', icon: '😊', ar: 'غسل الوجه', en: 'Wash face' },
  { id: 'w5', icon: '💪', ar: 'غسل الذراعين', en: 'Wash arms' },
  { id: 'w6', icon: '👂', ar: 'مسح الرأس والأذنين', en: 'Wipe head & ears' },
  { id: 'w7', icon: '🦶', ar: 'غسل القدمين', en: 'Wash feet' }
]

// The child taps the steps in the right order; each correct tap moves the
// step up into the "done" row.
export default function WuduOrderGame({ isEn, onBack, onStar, onReset }) {
  const lang = isEn ? 'en' : 'ar'
  const [pool, setPool] = useState(() => shuffle(steps))
  const [placed, setPlaced] = useState([])
  const [wrong, setWrong] = useState(null)
  const done = placed.length === steps.length

  useEffect(() => {
    playText(isEn ? 'Put the wudu steps in order. What comes first?' : 'رتّب خطوات الوضوء. إيه أول خطوة؟', lang)
    return () => stopAudio()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function tap(step) {
    if (step.id !== steps[placed.length].id) {
      setWrong(step.id)
      playText(isEn ? 'Not yet, try another step' : 'لسه مش دي، جرّب خطوة تانية', lang)
      setTimeout(() => setWrong(null), 500)
      return
    }
    const next = [...placed, step]
    setPlaced(next)
    setPool((p) => p.filter((s) => s.id !== step.id))
    // On the last step <Result> says the final praise itself.
    if (next.length === steps.length) onStar?.()
    else playText(`${praise(isEn)} ${isEn ? step.en : step.ar}`, lang)
  }

  return (
    <GameShell title={isEn ? 'Wudu Steps' : 'رتّب الوضوء'} isEn={isEn} onBack={onBack}>
      <p className="text-center font-body text-ink/70 mb-3">{isEn ? 'Tap the steps in the right order.' : 'اضغط على الخطوات بالترتيب الصحيح.'}</p>
      <div className="bg-teal-light/25 rounded-3xl p-3 mb-5 min-h-24 flex flex-wrap gap-2 justify-center">
        {placed.length === 0 && <span className="font-body text-ink/40 self-center">{isEn ? 'Step 1 goes here' : 'الخطوة الأولى هنا'}</span>}
        {placed.map((s, i) => (
          <div key={s.id} className="animate-pop bg-white rounded-2xl px-3 py-2 flex items-center gap-1 shadow">
            <span className="font-display text-teal">{i + 1}</span>
            <span className="text-2xl">{s.icon}</span>
          </div>
        ))}
      </div>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : (
        <div className="grid grid-cols-2 gap-3">
          {pool.map((s) => (
            <button key={s.id} onClick={() => tap(s)} className={`bg-white rounded-3xl shadow-lg p-4 flex flex-col items-center gap-1 active:scale-95 transition-all ${wrong === s.id ? 'ring-4 ring-brick animate-shake' : ''}`}>
              <span className="text-5xl">{s.icon}</span>
              <span className="font-body font-bold text-ink text-center leading-tight">{isEn ? s.en : s.ar}</span>
            </button>
          ))}
        </div>
      )}
    </GameShell>
  )
}

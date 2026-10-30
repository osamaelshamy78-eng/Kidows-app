import { useEffect, useRef, useState } from 'react'
import { GameShell, Result } from './common.jsx'
import { playText, stopAudio } from '../../utils/audio.js'

const CELLS = 12
const GOAL = 10
const STAR_MS = 1400

function nextCell(current) {
  let cell = current
  while (cell === current) cell = Math.floor(Math.random() * CELLS)
  return cell
}

// A star pops up in a random cloud; tap it before it moves. Only stars count.
export default function StarsGame({ isEn, onBack, onStar, onReset }) {
  const [cell, setCell] = useState(() => nextCell(-1))
  const [collected, setCollected] = useState(0)
  const [missed, setMissed] = useState(null)
  const timer = useRef(null)
  const done = collected >= GOAL

  useEffect(() => {
    if (done) return undefined
    timer.current = setTimeout(() => setCell((c) => nextCell(c)), STAR_MS)
    return () => clearTimeout(timer.current)
  }, [cell, done])

  useEffect(() => () => stopAudio(), [])

  function tap(i) {
    if (done) return
    if (i !== cell) {
      setMissed(i)
      setTimeout(() => setMissed(null), 300)
      return
    }
    const next = collected + 1
    setCollected(next)
    onStar?.()
    playText(isEn ? String(next) : ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'][next], isEn ? 'en' : 'ar')
    setCell((c) => nextCell(c))
  }

  return (
    <GameShell title={isEn ? 'Collect Stars' : 'اجمع النجوم'} isEn={isEn} onBack={onBack}>
      <p className="text-center font-body text-ink/70 mb-2">{isEn ? 'Tap the star before it flies away!' : 'اضغط على النجمة قبل ما تطير!'}</p>
      <div className="h-4 bg-white rounded-full overflow-hidden mb-5 shadow-inner">
        <div className="h-full bg-gold transition-all duration-300" style={{ width: `${(collected / GOAL) * 100}%` }} />
      </div>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} message={isEn ? `You collected ${GOAL} stars!` : `جمعت ${GOAL} نجوم!`} /> : (
        <div className="grid grid-cols-3 gap-3 bg-night rounded-3xl p-4">
          {Array.from({ length: CELLS }).map((_, i) => (
            <button key={i} onClick={() => tap(i)} className={`aspect-square rounded-2xl flex items-center justify-center text-5xl ${missed === i ? 'animate-shake' : ''}`}>
              {i === cell ? <span key={`${cell}-${collected}`} className="animate-pop inline-block">⭐</span> : <span className="opacity-40 text-4xl">☁️</span>}
            </button>
          ))}
        </div>
      )}
      <p className="text-center font-display text-2xl mt-4">⭐ {collected} / {GOAL}</p>
    </GameShell>
  )
}

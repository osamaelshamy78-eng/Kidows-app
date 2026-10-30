import { useCallback, useEffect, useRef, useState } from 'react'
import { playText, stopAudio } from '../../utils/audio.js'

export const ROUNDS = 5

export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pick(list, count) {
  return shuffle(list).slice(0, count)
}

const praiseAr = ['أحسنت!', 'ممتاز!', 'رائع!', 'برافو!', 'ما شاء الله!']
const praiseEn = ['Great job!', 'Excellent!', 'Well done!', 'Amazing!', 'Super!']

export function praise(isEn) {
  const list = isEn ? praiseEn : praiseAr
  return list[Math.floor(Math.random() * list.length)]
}

// Round-based flow shared by most games: a correct answer earns a star,
// says a word of praise, then moves to the next round; a wrong answer
// shakes the tapped card and lets the child try again.
export function useRounds({ isEn, onStar, makeRound, total = ROUNDS }) {
  const [round, setRound] = useState(0)
  const [data, setData] = useState(() => makeRound(0))
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong] = useState(null)
  const [done, setDone] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => { clearTimeout(timer.current); stopAudio() }, [])

  const correct = useCallback((sayAfter) => {
    if (solved) return
    setSolved(true)
    setWrong(null)
    onStar?.()
    playText(`${praise(isEn)} ${sayAfter || ''}`, isEn ? 'en' : 'ar')
    timer.current = setTimeout(() => {
      const next = round + 1
      if (next >= total) { setDone(true); return }
      setRound(next)
      setData(makeRound(next))
      setSolved(false)
    }, 1600)
  }, [solved, onStar, isEn, round, total, makeRound])

  const miss = useCallback((key) => {
    if (solved) return
    setWrong(key)
    playText(isEn ? 'Try again' : 'حاول مرة أخرى', isEn ? 'en' : 'ar')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setWrong(null), 500)
  }, [solved, isEn])

  return { round, total, data, solved, wrong, done, correct, miss }
}

export function GameShell({ title, isEn, onBack, round, total, children }) {
  return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { stopAudio(); onBack() }} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'العودة'}</button>
        <h1 className="font-display text-2xl text-teal-dark">{title}</h1>
      </div>
      {total > 0 && <RoundDots round={round} total={total} />}
      <div className="max-w-md mx-auto">{children}</div>
    </div>
  )
}

function RoundDots({ round, total }) {
  return (
    <div className="flex justify-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i < round ? 'bg-gold' : i === round ? 'bg-teal' : 'bg-ink/15'}`} />)}
    </div>
  )
}

export function Result({ isEn, onReset, onBack, message }) {
  useEffect(() => { playText(isEn ? 'Great job! You won!' : 'أحسنت! لقد فزت!', isEn ? 'en' : 'ar') }, [isEn])
  return (
    <div className="mt-8 text-center">
      <div className="text-7xl animate-bounce">🎉</div>
      <p className="font-display text-3xl text-teal-dark mt-2">{message || (isEn ? 'Great job!' : 'أحسنت!')}</p>
      <div className="flex justify-center gap-3 mt-5">
        <button onClick={onReset} className="bg-teal text-white font-body font-bold rounded-full px-6 py-3 shadow-md active:scale-95 transition-transform">{isEn ? 'Play again' : 'العب مرة أخرى'}</button>
        <button onClick={onBack} className="bg-white text-ink font-body font-bold rounded-full px-6 py-3 shadow-md active:scale-95 transition-transform">{isEn ? 'Other games' : 'ألعاب أخرى'}</button>
      </div>
    </div>
  )
}

export function SpeakButton({ onClick, isEn, size = 'w-20 h-20 text-4xl' }) {
  return (
    <button onClick={onClick} className={`mx-auto mb-5 flex items-center justify-center ${size} rounded-full bg-gold text-white shadow-lg active:scale-90 transition-transform`} aria-label={isEn ? 'Listen' : 'استمع'}>🔊</button>
  )
}

// Class names for an answer card, reflecting correct/wrong feedback.
export function cardClass({ isAnswer, solved, isWrong, base = 'text-6xl p-7' }) {
  let state = 'bg-white'
  if (solved && isAnswer) state = 'bg-teal/15 ring-4 ring-teal scale-105'
  if (isWrong) state = 'bg-brick/10 ring-4 ring-brick animate-shake'
  return `${state} ${base} rounded-3xl shadow-lg active:scale-90 transition-all duration-200`
}

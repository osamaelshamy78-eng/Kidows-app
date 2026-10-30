import { useEffect } from 'react'
import { things, arabicNumbers, englishNumbers } from '../../data/games.js'
import { GameShell, Result, SpeakButton, cardClass, pick, shuffle, useRounds } from './common.jsx'
import { playText } from '../../utils/audio.js'

const MAX = 9

function makeRound() {
  const count = 1 + Math.floor(Math.random() * MAX)
  const thing = pick(things, 1)[0]
  const wrong = pick(Array.from({ length: MAX }, (_, i) => i + 1).filter((n) => n !== count), 3)
  return { count, thing, choices: shuffle([count, ...wrong]) }
}

const toArabicDigits = (n) => n.toLocaleString('ar-EG')

export default function NumbersGame({ isEn, onBack, onStar, onReset }) {
  const lang = isEn ? 'en' : 'ar'
  const { round, total, data, solved, wrong, done, correct, miss } = useRounds({ isEn, onStar, makeRound })
  const question = isEn ? 'How many do you see?' : 'كم عددها؟'

  useEffect(() => { if (!done) playText(question, lang) }, [data, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GameShell title={isEn ? 'Learn Numbers' : 'تعلّم الأرقام'} isEn={isEn} onBack={onBack} round={round} total={total}>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : <>
        <div className="bg-white rounded-3xl shadow-lg p-4 mb-3 flex flex-wrap justify-center gap-2 min-h-32">
          {Array.from({ length: data.count }).map((_, i) => <span key={i} className="text-5xl animate-pop">{data.thing.emoji}</span>)}
        </div>
        <p className="text-center font-display text-2xl text-teal-dark mb-2">{question}</p>
        <SpeakButton isEn={isEn} onClick={() => playText(question, lang)} size="w-12 h-12 text-xl" />
        <div className="grid grid-cols-2 gap-4">
          {data.choices.map((n) => {
            const isAnswer = n === data.count
            const word = isEn ? englishNumbers[n] : arabicNumbers[n]
            return (
              <button key={n} onClick={() => (isAnswer ? correct(word) : miss(n))} className={cardClass({ isAnswer, solved, isWrong: wrong === n, base: 'p-4' })}>
                <span className="block font-display text-5xl text-ink">{isEn ? n : toArabicDigits(n)}</span>
                {!isEn && <span className="block font-body text-ink/50">{n}</span>}
              </button>
            )
          })}
        </div>
      </>}
    </GameShell>
  )
}

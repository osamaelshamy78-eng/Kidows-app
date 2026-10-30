import { useEffect } from 'react'
import { things } from '../../data/games.js'
import { GameShell, Result, cardClass, pick, useRounds } from './common.jsx'
import { playText } from '../../utils/audio.js'

function makeRound() {
  const choices = pick(things, 4)
  return { choices, target: choices[Math.floor(Math.random() * choices.length)] }
}

// Shows the target as a black silhouette; the child picks the picture that fits it.
export default function ShadowGame({ isEn, onBack, onStar, onReset }) {
  const { round, total, data, solved, wrong, done, correct, miss } = useRounds({ isEn, onStar, makeRound })
  const question = isEn ? 'Whose shadow is this?' : 'ظل مين ده؟'

  useEffect(() => { if (!done) playText(question, isEn ? 'en' : 'ar') }, [data, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GameShell title={isEn ? 'Shadow Match' : 'طابق الظل'} isEn={isEn} onBack={onBack} round={round} total={total}>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : <>
        <div className="mx-auto mb-3 w-40 h-40 rounded-3xl bg-gold-light/50 flex items-center justify-center shadow-inner">
          <span className="text-8xl transition-[filter] duration-500" style={{ filter: solved ? 'none' : 'brightness(0)', opacity: solved ? 1 : 0.85 }}>{data.target.emoji}</span>
        </div>
        <p className="text-center font-display text-2xl text-teal-dark mb-5">{question}</p>
        <div className="grid grid-cols-2 gap-4">
          {data.choices.map((item) => {
            const isAnswer = item.id === data.target.id
            return (
              <button key={item.id} onClick={() => (isAnswer ? correct(isEn ? item.en : item.ar) : miss(item.id))} className={cardClass({ isAnswer, solved, isWrong: wrong === item.id })}>
                {item.emoji}
              </button>
            )
          })}
        </div>
      </>}
    </GameShell>
  )
}

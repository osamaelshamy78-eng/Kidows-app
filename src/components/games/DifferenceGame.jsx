import { useEffect } from 'react'
import { differencePairs } from '../../data/games.js'
import { GameShell, Result, cardClass, pick, useRounds } from './common.jsx'
import { playText } from '../../utils/audio.js'

const SIZE = 6

function makeRound() {
  const [same, different] = pick(differencePairs, 1)[0]
  const odd = Math.floor(Math.random() * SIZE)
  return { odd, cells: Array.from({ length: SIZE }, (_, i) => (i === odd ? different : same)) }
}

export default function DifferenceGame({ isEn, onBack, onStar, onReset }) {
  const { round, total, data, solved, wrong, done, correct, miss } = useRounds({ isEn, onStar, makeRound })

  useEffect(() => { if (!done) playText(isEn ? 'Which picture is different?' : 'أي صورة مختلفة؟', isEn ? 'en' : 'ar') }, [data, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GameShell title={isEn ? 'Find the Difference' : 'اكتشف الاختلاف'} isEn={isEn} onBack={onBack} round={round} total={total}>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : <>
        <p className="text-center font-display text-2xl text-teal-dark mb-5">{isEn ? 'Which picture is different?' : 'أي صورة مختلفة؟'}</p>
        <div className="grid grid-cols-3 gap-3">
          {data.cells.map((emoji, i) => {
            const isAnswer = i === data.odd
            return <button key={i} onClick={() => (isAnswer ? correct() : miss(i))} className={cardClass({ isAnswer, solved, isWrong: wrong === i, base: 'text-5xl p-5 aspect-square' })}>{emoji}</button>
          })}
        </div>
      </>}
    </GameShell>
  )
}

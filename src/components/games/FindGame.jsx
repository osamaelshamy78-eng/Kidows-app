import { useEffect } from 'react'
import { things } from '../../data/games.js'
import { GameShell, Result, SpeakButton, cardClass, pick, useRounds } from './common.jsx'
import { playText } from '../../utils/audio.js'

function makeRound() {
  const choices = pick(things, 4)
  return { choices, target: choices[Math.floor(Math.random() * choices.length)] }
}

// mode 'find': the word is written and spoken. mode 'listen': spoken only.
export default function FindGame({ isEn, onBack, onStar, mode = 'find', onReset }) {
  const lang = isEn ? 'en' : 'ar'
  const { round, total, data, solved, wrong, done, correct, miss } = useRounds({ isEn, onStar, makeRound })
  const name = isEn ? data.target.en : data.target.ar
  const prompt = mode === 'listen' ? name : (isEn ? `Find the ${name}` : `أين ${name}؟`)

  useEffect(() => { if (!done) playText(prompt, lang) }, [data, done]) // eslint-disable-line react-hooks/exhaustive-deps

  const title = mode === 'listen' ? (isEn ? 'Listen & Choose' : 'استمع واختر') : (isEn ? 'Find It' : 'ابحث عن الشيء')

  return (
    <GameShell title={title} isEn={isEn} onBack={onBack} round={round} total={total}>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : <>
        {mode === 'listen'
          ? <p className="text-center font-body text-ink/70 mb-3">{isEn ? 'Listen, then tap the right picture.' : 'استمع ثم اضغط على الصورة الصحيحة.'}</p>
          : <p className="text-center font-display text-3xl text-teal-dark mb-3">{prompt}</p>}
        <SpeakButton isEn={isEn} onClick={() => playText(prompt, lang)} size={mode === 'listen' ? 'w-24 h-24 text-5xl' : 'w-14 h-14 text-2xl'} />
        <div className="grid grid-cols-2 gap-4">
          {data.choices.map((item) => {
            const isAnswer = item.id === data.target.id
            return (
              <button key={item.id} onClick={() => (isAnswer ? correct(name) : miss(item.id))} className={cardClass({ isAnswer, solved, isWrong: wrong === item.id })}>
                {item.emoji}
              </button>
            )
          })}
        </div>
      </>}
    </GameShell>
  )
}

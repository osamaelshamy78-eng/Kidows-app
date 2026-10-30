import { useEffect } from 'react'
import { things, arabicLetterNames } from '../../data/games.js'
import { GameShell, Result, SpeakButton, cardClass, shuffle, useRounds } from './common.jsx'
import { playText } from '../../utils/audio.js'

// Picks one word plus three distractors that start with a different letter,
// so there is always exactly one right answer.
function makeRound(isEn) {
  const letterOf = (t) => (isEn ? t.enLetter : t.arLetter)
  const target = shuffle(things)[0]
  const others = shuffle(things.filter((t) => letterOf(t) !== letterOf(target))).slice(0, 3)
  return { target, letter: letterOf(target), choices: shuffle([target, ...others]) }
}

export default function LettersGame({ isEn, onBack, onStar, onReset }) {
  const lang = isEn ? 'en' : 'ar'
  const { round, total, data, solved, wrong, done, correct, miss } = useRounds({ isEn, onStar, makeRound: () => makeRound(isEn) })
  const spoken = isEn
    ? `Which picture starts with the letter ${data.letter}?`
    : `أي صورة تبدأ بحرف ${arabicLetterNames[data.letter] || data.letter}؟`

  useEffect(() => { if (!done) playText(spoken, lang) }, [data, done]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GameShell title={isEn ? 'Letters & Words' : 'الحروف والكلمات'} isEn={isEn} onBack={onBack} round={round} total={total}>
      {done ? <Result isEn={isEn} onReset={onReset} onBack={onBack} /> : <>
        <div className="mx-auto mb-3 w-28 h-28 rounded-3xl bg-teal text-white flex items-center justify-center font-display text-7xl shadow-lg">{data.letter}</div>
        <p className="text-center font-body text-lg text-ink/80 mb-2">{isEn ? 'Which picture starts with this letter?' : 'أي صورة تبدأ بهذا الحرف؟'}</p>
        <SpeakButton isEn={isEn} onClick={() => playText(spoken, lang)} size="w-12 h-12 text-xl" />
        <div className="grid grid-cols-2 gap-4">
          {data.choices.map((item) => {
            const isAnswer = item.id === data.target.id
            return (
              <button key={item.id} onClick={() => (isAnswer ? correct(isEn ? item.en : item.word) : miss(item.id))} className={cardClass({ isAnswer, solved, isWrong: wrong === item.id, base: 'p-5' })}>
                <span className="block text-6xl">{item.emoji}</span>
                {solved && <span className="block font-display text-xl text-ink mt-1">{isEn ? item.en : item.word}</span>}
              </button>
            )
          })}
        </div>
      </>}
    </GameShell>
  )
}

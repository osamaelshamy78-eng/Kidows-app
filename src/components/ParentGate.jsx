import { useState } from 'react'
import { shuffle } from './games/common.jsx'

// A multiplication question small children can't answer, shown before
// anything meant for parents (settings, language, leaving baby mode).
function makeQuestion() {
  const a = 3 + Math.floor(Math.random() * 7)
  const b = 3 + Math.floor(Math.random() * 7)
  const answer = a * b
  const wrong = new Set()
  while (wrong.size < 3) {
    const offset = (1 + Math.floor(Math.random() * 6)) * (Math.random() < 0.5 ? -1 : 1)
    if (answer + offset > 0) wrong.add(answer + offset)
  }
  return { a, b, answer, choices: shuffle([answer, ...wrong]) }
}

export default function ParentGate({ isEn, onSuccess, onCancel }) {
  const [question, setQuestion] = useState(makeQuestion)
  const [failed, setFailed] = useState(false)

  function choose(n) {
    if (n === question.answer) { onSuccess(); return }
    setFailed(true)
    setQuestion(makeQuestion())
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center px-6" dir={isEn ? 'ltr' : 'rtl'} onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="text-5xl mb-2">🔒</div>
        <h2 className="font-display text-2xl text-teal-dark">{isEn ? 'For parents only' : 'للأهل فقط'}</h2>
        <p className="font-body text-ink/70 mt-1 mb-4">{isEn ? 'Answer to continue:' : 'جاوب عشان تكمل:'}</p>
        <p className="font-display text-4xl text-ink mb-5" dir="ltr">{question.a} × {question.b} = ?</p>
        <div className="grid grid-cols-2 gap-3">
          {question.choices.map((n) => (
            <button key={n} onClick={() => choose(n)} className="bg-cream rounded-2xl py-4 font-display text-2xl text-ink shadow active:scale-95 transition-transform">{n}</button>
          ))}
        </div>
        {failed && <p className="font-body text-brick mt-3">{isEn ? 'Not quite — try this one.' : 'إجابة غلط، جرّب السؤال ده.'}</p>}
        <button onClick={onCancel} className="mt-5 font-body font-bold text-ink/60 underline underline-offset-2">{isEn ? 'Cancel' : 'إلغاء'}</button>
      </div>
    </div>
  )
}

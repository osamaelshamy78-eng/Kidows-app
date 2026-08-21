import { useState } from 'react'
import { playText, stopAudio } from '../utils/audio.js'
import { quizLevels } from '../data/quiz.js'

export default function QuizScreen({ lang, onBack, onCorrect }) {
  const isEn = lang === 'en'
  const [level, setLevel] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const currentLevel = quizLevels.find((item) => item.id === level)
  const current = currentLevel?.questions[questionIndex]

  function chooseLevel(id) {
    stopAudio()
    setLevel(id)
    setQuestionIndex(0)
    setScore(0)
    setAnswered(false)
    setSelected(null)
    setDone(false)
  }

  function answer(index) {
    if (answered || !current) return
    setSelected(index)
    setAnswered(true)
    if (index === current.answer) {
      setScore((value) => value + 1)
      onCorrect()
    }
  }

  function next() {
    stopAudio()
    if (questionIndex === currentLevel.questions.length - 1) {
      setDone(true)
      return
    }
    setQuestionIndex((value) => value + 1)
    setAnswered(false)
    setSelected(null)
  }

  function back() {
    stopAudio()
    if (level !== null && !done) {
      setLevel(null)
      setQuestionIndex(0)
      setAnswered(false)
      setSelected(null)
      setScore(0)
      return
    }
    onBack()
  }

  const title = isEn ? 'Games & Questions' : 'الألعاب والأسئلة'

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={back} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
          <h1 className="font-display text-2xl text-teal-dark">{title}</h1>
        </div>
        <div className="bg-white/70 rounded-3xl p-5 mb-5 text-center shadow-sm">
          <div className="text-5xl mb-2">⭐🎮</div>
          <p className="font-body text-ink/70">
            {isEn ? 'Answer religious questions to earn stars. Each correct answer gives you one star.' : 'جاوب على أسئلة دينية وكسب نجوم. كل إجابة صحيحة تزودك بنجمة.'}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {quizLevels.map((item) => (
            <button key={item.id} onClick={() => chooseLevel(item.id)} className="w-full bg-white rounded-3xl shadow-md py-5 px-6 flex items-center justify-between active:scale-95 transition-transform">
              <span className="text-4xl">{item.icon}</span>
              <span className="font-display text-xl text-ink">{isEn ? item.titleEn : item.titleAr}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-gold-light/30" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="text-8xl animate-bounce">🏆</div>
        <h2 className="font-display text-3xl text-center text-teal-dark">
          {isEn ? 'Level complete!' : 'خلصت المستوى!'}
        </h2>
        <p className="font-body text-xl text-ink/70">
          {isEn ? `Your score: ${score} / ${currentLevel.questions.length}` : `نتيجتك: ${score} / ${currentLevel.questions.length}`}
        </p>
        <button onClick={back} className="bg-teal text-white font-body font-bold rounded-full px-8 py-3 shadow-lg active:scale-95 transition-transform">
          {isEn ? 'Choose another level' : 'اختار مستوى تاني'}
        </button>
      </div>
    )
  }

  const questionText = isEn ? current.qEn : current.qAr
  const options = isEn ? current.optionsEn : current.optionsAr
  const correct = selected === current.answer

  return (
    <div className="min-h-screen flex flex-col bg-teal-light/20 px-6 py-6" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-5">
        <button onClick={back} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
        <span className="font-body font-bold text-ink/60">{questionIndex + 1} / {currentLevel.questions.length}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-xl text-teal-dark">{isEn ? currentLevel.titleEn : currentLevel.titleAr}</span>
        <span className="text-2xl">⭐ {score}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 flex-1">
        <p className="font-display text-2xl leading-relaxed text-center text-ink">{questionText}</p>
        <button onClick={() => playText(questionText, lang)} className="mx-auto mt-4 flex items-center justify-center w-12 h-12 rounded-full bg-teal text-white shadow-md active:scale-90 transition-transform" aria-label={isEn ? 'Listen' : 'اسمع السؤال'}>🔊</button>

        <div className="mt-7 flex flex-col gap-3">
          {options.map((option, index) => {
            let className = 'w-full rounded-2xl border border-ink/10 bg-cream py-4 px-4 font-body text-lg text-ink active:scale-95 transition-transform'
            if (answered && index === current.answer) className = 'w-full rounded-2xl border-2 border-teal bg-teal/10 py-4 px-4 font-body text-lg text-teal-dark font-bold'
            if (answered && index === selected && index !== current.answer) className = 'w-full rounded-2xl border-2 border-brick bg-brick/10 py-4 px-4 font-body text-lg text-brick font-bold'
            return <button key={index} onClick={() => answer(index)} disabled={answered} className={className}>{option}</button>
          })}
        </div>

        {answered && (
          <div className="mt-5 text-center">
            <p className={`font-display text-xl ${correct ? 'text-teal-dark' : 'text-brick'}`}>
              {correct ? (isEn ? 'Correct! +1 star ⭐' : 'صح! + نجمة ⭐') : (isEn ? 'Not quite. Try the next one!' : 'مش مشكلة، جرّب السؤال اللي بعده!')}
            </p>
            <button onClick={next} className="mt-4 w-full bg-gold text-white font-display text-xl rounded-full py-4 shadow-lg active:scale-95 transition-transform">
              {questionIndex === currentLevel.questions.length - 1 ? (isEn ? 'Finish 🎉' : 'خلصت 🎉') : (isEn ? 'Next question ➡️' : 'السؤال اللي بعده ➡️')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

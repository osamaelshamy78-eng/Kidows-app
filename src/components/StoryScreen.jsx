import { useState, useEffect } from 'react'
import { stories } from '../data/stories.js'
import { playItem, stopAudio } from '../utils/audio.js'

export default function StoryScreen({ storyId, onBack, onComplete }) {
  const story = stories.find((s) => s.id === storyId)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    return () => stopAudio()
  }, [])

  const isLast = page === story.pages.length - 1
  const current = story.pages[page]

  function handleBack() {
    stopAudio()
    onBack()
  }

  function handleNext() {
    stopAudio()
    if (isLast) {
      setDone(true)
      onComplete()
    } else {
      setPage(page + 1)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-teal-light/30">
        <div className="text-8xl animate-bounce">🌟</div>
        <h2 className="font-display text-3xl text-center text-teal-dark">
          خلصت قصة {story.title}!
        </h2>
        <button
          onClick={handleBack}
          className="bg-teal text-white font-body font-bold rounded-full px-8 py-3 shadow-lg active:scale-95 transition-transform"
        >
          رجوع للقصص
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-light/20">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={handleBack}
          className="font-body font-bold text-ink bg-white/60 rounded-full px-4 py-2"
        >
          رجوع
        </button>
        <div className="flex gap-1">
          {story.pages.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i <= page ? 'bg-gold' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-8xl">{current.icon}</div>
        <div className="bg-white rounded-3xl shadow-xl px-6 py-8 w-full max-w-sm">
          <p className="font-body text-xl leading-relaxed text-center text-ink">
            {current.text}
          </p>
          <button
            onClick={() => playItem(current)}
            className="mx-auto mt-5 flex items-center justify-center w-14 h-14 rounded-full bg-teal text-white shadow-md active:scale-90 transition-transform"
            aria-label="اسمع القصة"
          >
            <span className="text-2xl">🔊</span>
          </button>
        </div>
      </div>

      <div className="px-6 pb-10">
        <button
          onClick={handleNext}
          className="w-full bg-teal text-white font-display text-xl rounded-full py-4 shadow-lg active:scale-95 transition-transform"
        >
          {isLast ? 'خلصت القصة! 🎉' : 'بعدين ⬅️'}
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { stories } from '../data/stories.js'
import { extraStories } from '../data/stories_extra.js'
import { companionStories } from '../data/companions_extra.js'
import { storyTranslationsEn } from '../data/i18n.js'
import { companionTranslationsEn } from '../data/companions_i18n.js'
import { playText, stopAudio } from '../utils/audio.js'

export default function StoryScreen({ storyId, lang = 'ar', onBack, onComplete }) {
  const allStories = [...stories, ...extraStories, ...companionStories]
  const story = allStories.find((s) => s.id === storyId)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const isEn = lang === 'en'

  useEffect(() => () => stopAudio(), [])

  if (!story) return null

  const isLast = page === story.pages.length - 1
  const current = story.pages[page]
  const translation = storyTranslationsEn[story.id] || companionTranslationsEn[story.id]
  const currentText = isEn ? (translation?.pages?.[page] || current.text) : current.text
  const storyTitle = isEn ? (translation?.title || story.title) : story.title

  function handleBack() {
    stopAudio()
    onBack()
  }

  function handleNext() {
    stopAudio()
    if (isLast) {
      setDone(true)
      onComplete()
    } else setPage(page + 1)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-teal-light/30" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="text-8xl animate-bounce">🌟</div>
        <h2 className="font-display text-3xl text-center text-teal-dark">{isEn ? `You finished ${storyTitle}!` : `لقد أتممت قصة ${storyTitle}!`}</h2>
        <button onClick={handleBack} className="bg-teal text-white font-body font-bold rounded-full px-8 py-3 shadow-lg active:scale-95 transition-transform">{isEn ? 'Back to stories' : 'العودة إلى القصص'}</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-light/20" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={handleBack} className="font-body font-bold text-ink bg-white/60 rounded-full px-4 py-2">{isEn ? 'Back' : 'العودة'}</button>
        <div className="flex gap-1">{story.pages.map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= page ? 'bg-gold' : 'bg-white/50'}`} />)}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-8xl">{current.icon}</div>
        <div className="bg-white rounded-3xl shadow-xl px-6 py-8 w-full max-w-sm">
          <p className="font-body text-xl leading-relaxed text-center text-ink">{currentText}</p>
          <button onClick={() => playText(currentText, lang)} className="mx-auto mt-5 flex items-center justify-center w-14 h-14 rounded-full bg-teal text-white shadow-md active:scale-90 transition-transform" aria-label={isEn ? 'Listen to story' : 'استمع إلى القصة'}>🔊</button>
        </div>
      </div>

      <div className="px-6 pb-10">
        <button onClick={handleNext} className="w-full bg-teal text-white font-display text-xl rounded-full py-4 shadow-lg active:scale-95 transition-transform">{isLast ? (isEn ? 'Finish the story! 🎉' : 'أتممت القصة! 🎉') : (isEn ? 'Next ➡️' : 'التالي ⬅️')}</button>
      </div>
    </div>
  )
}

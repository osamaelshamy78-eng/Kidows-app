import { stories } from '../data/stories.js'
import { extraStories } from '../data/stories_extra.js'
import { storyTranslationsEn } from '../data/i18n.js'

export default function StoriesListScreen({ lang = 'ar', onSelect, onBack }) {
  const isEn = lang === 'en'
  const allStories = [...stories, ...extraStories]
  return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
        <h1 className="font-display text-2xl text-teal-dark">{isEn ? 'Stories of the Prophets' : 'قصص الأنبياء'}</h1>
      </div>
      <div className="flex flex-col gap-4">
        {allStories.map((story) => (
          <button key={story.id} onClick={() => onSelect(story.id)} className="w-full bg-white rounded-3xl shadow-md py-5 px-6 flex items-center justify-between active:scale-95 transition-transform">
            <span className="text-5xl">{story.cover}</span>
            <span className="font-display text-xl text-ink">{isEn ? (storyTranslationsEn[story.id]?.title || story.title) : story.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

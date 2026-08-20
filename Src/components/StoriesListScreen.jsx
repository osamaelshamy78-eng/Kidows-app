import { stories } from '../data/stories.js'

export default function StoriesListScreen({ onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-cream px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2"
        >
          رجوع
        </button>
        <h1 className="font-display text-2xl text-teal-dark">قصص الأنبياء</h1>
      </div>

      <div className="flex flex-col gap-4">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelect(story.id)}
            className="w-full bg-white rounded-3xl shadow-md py-5 px-6 flex items-center justify-between active:scale-95 transition-transform"
          >
            <span className="text-5xl">{story.cover}</span>
            <span className="font-display text-xl text-ink">{story.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

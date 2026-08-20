export default function PrayerHubScreen({ onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-cream px-6 py-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2"
        >
          رجوع
        </button>
        <h1 className="font-display text-2xl text-teal-dark">الصلاة والوضوء</h1>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect('wudu')}
          className="w-full bg-teal rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-4xl">🧼</span>
          <span className="font-display text-2xl text-white">أتعلم الوضوء</span>
        </button>

        <button
          onClick={() => onSelect('prayers')}
          className="w-full bg-gold rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-4xl">🕌</span>
          <span className="font-display text-2xl text-white">الصلوات الخمس</span>
        </button>
      </div>
    </div>
  )
}

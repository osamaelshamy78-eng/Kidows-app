export default function PrayerHubScreen({ lang = 'ar', onSelect, onBack }) {
  const isEn = lang === 'en'
  return (
    <div className="min-h-screen bg-cream px-6 py-8 flex flex-col" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
        <h1 className="font-display text-2xl text-teal-dark">{isEn ? 'Prayer & Wudu' : 'الصلاة والوضوء'}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <button onClick={() => onSelect('wudu')} className="w-full bg-teal rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">🧼</span><span className="font-display text-2xl text-white">{isEn ? 'Learn Wudu' : 'أتعلم الوضوء'}</span>
        </button>
        <button onClick={() => onSelect('prayers')} className="w-full bg-gold rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">🕌</span><span className="font-display text-2xl text-white">{isEn ? 'Five Daily Prayers' : 'الصلوات الخمس'}</span>
        </button>
      </div>
    </div>
  )
}

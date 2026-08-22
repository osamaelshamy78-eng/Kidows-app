export default function HomeScreen({ lang, onToggleLanguage, onSelect, stars }) {
  const hour = new Date().getHours()
  const isDayTime = hour >= 5 && hour < 18
  const isEn = lang === 'en'

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white/70 rounded-full px-4 py-2 shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="font-body font-bold text-ink">{stars}</span>
        </div>
        <h1 className="font-display text-3xl text-teal-dark drop-shadow-sm text-center flex-1">{isEn ? 'Little Garden' : 'روضة الصبيان'}</h1>
        <button onClick={onToggleLanguage} className="bg-white/80 rounded-full px-3 py-2 font-body font-bold text-teal-dark shadow-sm" aria-label="Change language">
          {isEn ? 'عربي' : 'English'}
        </button>
      </div>

      <div className="relative w-56 h-56 flex items-center justify-center my-6">
        <div className={`absolute inset-0 rounded-full transition-colors duration-700 ${isDayTime ? 'bg-gold-light/40' : 'bg-night/30'}`} />
        <div className={`text-8xl transition-transform duration-700 ${isDayTime ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }}>
          {isDayTime ? '☀️' : '🌙'}
        </div>
        {!isDayTime && (
          <>
            <span className="absolute top-4 right-10 text-xl animate-pulse">✨</span>
            <span className="absolute bottom-8 left-8 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
          </>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        <button onClick={() => onSelect('morning')} className="w-full bg-gold rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">🌅</span>
          <span className="font-display text-2xl text-white">{isEn ? 'Morning Adhkar' : 'أذكار الصباح'}</span>
        </button>

        <button onClick={() => onSelect('evening')} className="w-full bg-night rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">🌙</span>
          <span className="font-display text-2xl text-white">{isEn ? 'Evening Adhkar' : 'أذكار المساء'}</span>
        </button>

        <button onClick={() => onSelect('stories')} className="w-full bg-teal rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">📖</span>
          <span className="font-display text-2xl text-white">{isEn ? 'Stories of the Prophets' : 'قصص الأنبياء'}</span>
        </button>

        <button onClick={() => onSelect('prayerHub')} className="w-full bg-brick rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform">
          <span className="text-4xl">🕌</span>
          <span className="font-display text-2xl text-white">{isEn ? 'Prayer & Wudu' : 'الصلاة والوضوء'}</span>
        </button>

        <button onClick={() => onSelect('quiz')} className="w-full bg-gold-light rounded-blob py-6 px-6 flex items-center justify-between shadow-lg active:scale-95 transition-transform border border-gold/30">
          <span className="text-4xl">🎮</span>
          <span className="font-display text-2xl text-teal-dark">{isEn ? 'Games & Questions' : 'الألعاب والأسئلة'}</span>
        </button>
      </div>

      <p className="font-body text-sm text-ink/50 mt-4">{isEn ? 'With Mom or Dad 💛' : 'مع الأب أو الأم 💛'}</p>

      <button onClick={() => onSelect('baby')} className="mt-2 font-body text-sm text-teal-dark/70 underline underline-offset-2">
        👶 {isEn ? 'Simple Baby Mode (1+)' : 'وضع مبسّط للرضّع من عمر سنة'}
      </button>
    </div>
  )
}

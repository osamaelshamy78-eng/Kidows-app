import { useState } from 'react'
import { isSoundEnabled, setSoundEnabled } from '../utils/audio.js'

export default function ParentScreen({ lang, stars, onToggleLanguage, onResetStars, onBack }) {
  const isEn = lang === 'en'
  const [sound, setSound] = useState(isSoundEnabled)
  const [confirmReset, setConfirmReset] = useState(false)

  function toggleSound() {
    setSoundEnabled(!sound)
    setSound(!sound)
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
        <h1 className="font-display text-2xl text-teal-dark">{isEn ? 'Parents' : 'ركن الأهل'}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-5 mb-4 text-center">
        <div className="text-5xl">⭐</div>
        <p className="font-display text-3xl text-ink mt-1">{stars}</p>
        <p className="font-body text-ink/60">{isEn ? 'Stars your child has earned' : 'النجوم اللي جمعها طفلك'}</p>
      </div>

      <div className="flex flex-col gap-3">
        <SettingRow icon="🌐" label={isEn ? 'Language' : 'اللغة'} value={isEn ? 'English' : 'العربية'} action={isEn ? 'عربي' : 'English'} onClick={onToggleLanguage} />
        <SettingRow icon={sound ? '🔊' : '🔇'} label={isEn ? 'Sound' : 'الصوت'} value={sound ? (isEn ? 'On' : 'شغّال') : (isEn ? 'Off' : 'مقفول')} action={sound ? (isEn ? 'Turn off' : 'اقفل') : (isEn ? 'Turn on' : 'شغّل')} onClick={toggleSound} />
        {confirmReset ? (
          <div className="bg-white rounded-3xl shadow-md p-5 text-center">
            <p className="font-body text-ink mb-3">{isEn ? 'Reset all stars to zero?' : 'متأكد إنك عايز تصفّر النجوم؟'}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { onResetStars(); setConfirmReset(false) }} className="bg-brick text-white font-body font-bold rounded-full px-5 py-2">{isEn ? 'Yes, reset' : 'أيوه، صفّر'}</button>
              <button onClick={() => setConfirmReset(false)} className="bg-cream text-ink font-body font-bold rounded-full px-5 py-2">{isEn ? 'Cancel' : 'إلغاء'}</button>
            </div>
          </div>
        ) : (
          <SettingRow icon="🔄" label={isEn ? 'Stars' : 'النجوم'} value={String(stars)} action={isEn ? 'Reset' : 'صفّر'} onClick={() => setConfirmReset(true)} />
        )}
      </div>

      <div className="bg-gold-light/40 rounded-3xl p-5 mt-6">
        <h2 className="font-display text-xl text-teal-dark mb-2">{isEn ? 'Tips' : 'نصايح'}</h2>
        <ul className="font-body text-ink/80 flex flex-col gap-2 list-disc ps-5">
          <li>{isEn ? 'Use the app together with your child: read and repeat the adhkar with them.' : 'استخدموا التطبيق مع طفلكم: اقروا الأذكار ورددوها معاه.'}</li>
          <li>{isEn ? 'Baby mode locks the back button. Tap ⏎ and answer the question to leave.' : 'وضع الرضّع بيقفل زرار الرجوع. اضغط ⏎ وجاوب السؤال عشان تخرج.'}</li>
          <li>{isEn ? 'Wudu and prayer content follows the Hanafi school.' : 'محتوى الوضوء والصلاة على المذهب الحنفي.'}</li>
        </ul>
      </div>
    </div>
  )
}

function SettingRow({ icon, label, value, action, onClick }) {
  return (
    <div className="bg-white rounded-3xl shadow-md py-4 px-5 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <p className="font-display text-lg text-ink">{label}</p>
        <p className="font-body text-sm text-ink/60">{value}</p>
      </div>
      <button onClick={onClick} className="bg-teal text-white font-body font-bold rounded-full px-4 py-2 active:scale-95 transition-transform">{action}</button>
    </div>
  )
}

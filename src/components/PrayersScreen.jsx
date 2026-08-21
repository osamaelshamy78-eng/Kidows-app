import { useState } from 'react'
import { prayers } from '../data/prayers.js'
import { prayerTranslationsEn } from '../data/i18n.js'

export default function PrayersScreen({ lang = 'ar', onBack }) {
  const [open, setOpen] = useState(null)
  const isEn = lang === 'en'

  return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'رجوع'}</button>
        <h1 className="font-display text-2xl text-teal-dark">{isEn ? 'Five Daily Prayers' : 'الصلوات الخمس'}</h1>
      </div>
      <div className="flex flex-col gap-4">
        {prayers.map((p) => {
          const isOpen = open === p.id
          const translation = prayerTranslationsEn[p.id]
          const name = isEn ? translation.name : p.name
          const time = isEn ? translation.time : p.time
          return (
            <button key={p.id} onClick={() => setOpen(isOpen ? null : p.id)} className="w-full bg-white rounded-3xl shadow-md py-5 px-6 text-right active:scale-95 transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{p.icon}</span>
                <span className="font-display text-xl text-ink">{name}</span>
              </div>
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-ink/10 flex flex-col gap-1 text-left" dir={isEn ? 'ltr' : 'rtl'}>
                  <p className="font-body text-ink/70">{isEn ? 'Rak‘ahs: ' : 'عدد الركعات: '}<span className="font-bold text-teal-dark">{p.rakaat}</span></p>
                  <p className="font-body text-ink/70">{time}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

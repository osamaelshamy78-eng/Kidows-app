import { useState } from 'react'
import { prayers } from '../data/prayers.js'

export default function PrayersScreen({ onBack }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="min-h-screen bg-cream px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2"
        >
          رجوع
        </button>
        <h1 className="font-display text-2xl text-teal-dark">الصلوات الخمس</h1>
      </div>

      <div className="flex flex-col gap-4">
        {prayers.map((p) => {
          const isOpen = open === p.id
          return (
            <button
              key={p.id}
              onClick={() => setOpen(isOpen ? null : p.id)}
              className="w-full bg-white rounded-3xl shadow-md py-5 px-6 text-right active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{p.icon}</span>
                <span className="font-display text-xl text-ink">{p.name}</span>
              </div>
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-ink/10 flex flex-col gap-1">
                  <p className="font-body text-ink/70">
                    عدد الركعات: <span className="font-bold text-teal-dark">{p.rakaat}</span>
                  </p>
                  <p className="font-body text-ink/70">{p.time}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

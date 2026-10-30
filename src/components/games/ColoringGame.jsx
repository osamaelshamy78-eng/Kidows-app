import { useEffect, useState } from 'react'
import { colorPalette } from '../../data/games.js'
import { GameShell, Result } from './common.jsx'
import { playText, stopAudio } from '../../utils/audio.js'

// Each picture is a set of tappable SVG regions drawn in a 200x200 box.
const pictures = [
  {
    id: 'mosque',
    ar: 'المسجد', en: 'Mosque',
    regions: [
      { id: 'sky', d: 'M0 0H200V160H0Z' },
      { id: 'ground', d: 'M0 160H200V200H0Z' },
      { id: 'body', d: 'M45 100H155V170H45Z' },
      { id: 'dome', d: 'M55 100C55 55 145 55 145 100Z' },
      { id: 'minaretL', d: 'M15 60H35V170H15Z' },
      { id: 'minaretR', d: 'M165 60H185V170H165Z' },
      { id: 'capL', d: 'M12 60L25 38L38 60Z' },
      { id: 'capR', d: 'M162 60L175 38L188 60Z' },
      { id: 'door', d: 'M85 170V135C85 120 115 120 115 135V170Z' },
      { id: 'moon', d: 'M100 30A10 10 0 1 0 108 46A8 8 0 1 1 100 30Z' }
    ]
  },
  {
    id: 'fish',
    ar: 'السمكة', en: 'Fish',
    regions: [
      { id: 'water', d: 'M0 0H200V200H0Z' },
      { id: 'body', d: 'M40 100C70 50 140 50 160 100C140 150 70 150 40 100Z' },
      { id: 'tail', d: 'M40 100L10 70V130Z' },
      { id: 'fin', d: 'M90 65L110 40L120 68Z' },
      { id: 'stripe', d: 'M100 62C92 85 92 115 100 138L112 136C104 115 104 85 112 64Z' },
      { id: 'eye', d: 'M135 90A7 7 0 1 0 135.1 90Z' },
      { id: 'sand', d: 'M0 175C50 160 150 190 200 172V200H0Z' }
    ]
  },
  {
    id: 'house',
    ar: 'البيت', en: 'House',
    regions: [
      { id: 'sky', d: 'M0 0H200V150H0Z' },
      { id: 'sun', d: 'M170 30A15 15 0 1 0 170.1 30Z' },
      { id: 'grass', d: 'M0 150H200V200H0Z' },
      { id: 'wall', d: 'M40 90H160V165H40Z' },
      { id: 'roof', d: 'M30 92L100 35L170 92Z' },
      { id: 'door', d: 'M88 125H112V165H88Z' },
      { id: 'windowL', d: 'M52 105H76V128H52Z' },
      { id: 'windowR', d: 'M124 105H148V128H124Z' }
    ]
  }
]

export default function ColoringGame({ isEn, onBack, onStar }) {
  const [pictureIndex, setPictureIndex] = useState(0)
  const [color, setColor] = useState(colorPalette[0])
  const [fills, setFills] = useState({})
  const [rewarded, setRewarded] = useState(false)
  const picture = pictures[pictureIndex]
  const coloredCount = picture.regions.filter((r) => fills[r.id]).length
  const complete = coloredCount === picture.regions.length

  useEffect(() => () => stopAudio(), [])

  useEffect(() => {
    if (complete && !rewarded) {
      setRewarded(true)
      onStar?.()
    }
  }, [complete, rewarded, onStar])

  function paint(id) {
    setFills((f) => ({ ...f, [id]: color }))
  }

  function choosePicture(i) {
    setPictureIndex(i)
    setFills({})
    setRewarded(false)
    playText(isEn ? pictures[i].en : pictures[i].ar, isEn ? 'en' : 'ar')
  }

  return (
    <GameShell title={isEn ? 'Coloring Book' : 'كتاب التلوين'} isEn={isEn} onBack={onBack}>
      <div className="flex justify-center gap-2 mb-4">
        {pictures.map((p, i) => (
          <button key={p.id} onClick={() => choosePicture(i)} className={`rounded-full px-4 py-2 font-body font-bold ${i === pictureIndex ? 'bg-teal text-white' : 'bg-white text-ink'}`}>{isEn ? p.en : p.ar}</button>
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow-lg p-3">
        <svg viewBox="0 0 200 200" className="w-full h-auto touch-manipulation" role="img" aria-label={isEn ? picture.en : picture.ar}>
          {picture.regions.map((r) => (
            <path key={r.id} d={r.d} fill={fills[r.id] || '#ffffff'} stroke="#1F2D3D" strokeWidth="2" strokeLinejoin="round" onClick={() => paint(r.id)} className="cursor-pointer" />
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {colorPalette.map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-11 h-11 rounded-full shadow transition-transform ${c === color ? 'ring-4 ring-ink/70 scale-110' : 'border-4 border-white'}`} aria-label={c} />
        ))}
      </div>
      <p className="text-center font-body text-ink/60 mt-4">{isEn ? 'Pick a color, then tap a part of the picture.' : 'اختر لونًا ثم اضغط على جزء من الصورة.'} ({coloredCount}/{picture.regions.length})</p>
      {complete && <Result isEn={isEn} onReset={() => { setFills({}); setRewarded(false) }} onBack={onBack} message={isEn ? 'Beautiful colors!' : 'ألوان جميلة!'} />}
    </GameShell>
  )
}

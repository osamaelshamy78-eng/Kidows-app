import { useState } from 'react'
import MemoryGame from './games/MemoryGame.jsx'
import FindGame from './games/FindGame.jsx'
import StarsGame from './games/StarsGame.jsx'
import ColoringGame from './games/ColoringGame.jsx'
import PuzzleGame from './games/PuzzleGame.jsx'
import DifferenceGame from './games/DifferenceGame.jsx'
import LettersGame from './games/LettersGame.jsx'
import NumbersGame from './games/NumbersGame.jsx'
import ShadowGame from './games/ShadowGame.jsx'
import WuduOrderGame from './games/WuduOrderGame.jsx'
import { stopAudio } from '../utils/audio.js'

const games = [
  { id: 'memory', icon: '🧠', ar: 'لعبة الذاكرة', en: 'Memory Match', color: 'bg-teal' },
  { id: 'find', icon: '🔍', ar: 'ابحث عن الشيء', en: 'Find It', color: 'bg-gold' },
  { id: 'stars', icon: '⭐', ar: 'اجمع النجوم', en: 'Collect Stars', color: 'bg-night' },
  { id: 'listen', icon: '🔊', ar: 'استمع واختر', en: 'Listen & Choose', color: 'bg-brick' },
  { id: 'coloring', icon: '🎨', ar: 'كتاب التلوين', en: 'Coloring Book', color: 'bg-teal-light' },
  { id: 'puzzle', icon: '🧩', ar: 'ركّب الصورة', en: 'Picture Puzzle', color: 'bg-gold' },
  { id: 'difference', icon: '👀', ar: 'اكتشف الاختلاف', en: 'Find the Difference', color: 'bg-teal-dark' },
  { id: 'letters', icon: '🔤', ar: 'الحروف والكلمات', en: 'Letters & Words', color: 'bg-brick' },
  { id: 'numbers', icon: '🔢', ar: 'تعلّم الأرقام', en: 'Learn Numbers', color: 'bg-night' },
  { id: 'shadow', icon: '🌑', ar: 'طابق الظل', en: 'Shadow Match', color: 'bg-teal' },
  { id: 'wudu', icon: '🤲', ar: 'رتّب الوضوء', en: 'Wudu Steps', color: 'bg-gold' }
]

export default function GamesScreen({ lang = 'ar', onBack, onComplete }) {
  const isEn = lang === 'en'
  const [game, setGame] = useState(null)
  // Bumping the key remounts the game, which is how "Play again" starts fresh.
  const [playKey, setPlayKey] = useState(0)

  const props = {
    isEn,
    onStar: onComplete,
    onBack: () => { stopAudio(); setGame(null) },
    onReset: () => setPlayKey((k) => k + 1)
  }

  if (game === 'memory') return <MemoryGame key={playKey} {...props} />
  if (game === 'find') return <FindGame key={playKey} {...props} mode="find" />
  if (game === 'listen') return <FindGame key={playKey} {...props} mode="listen" />
  if (game === 'stars') return <StarsGame key={playKey} {...props} />
  if (game === 'coloring') return <ColoringGame key={playKey} {...props} />
  if (game === 'puzzle') return <PuzzleGame key={playKey} {...props} />
  if (game === 'difference') return <DifferenceGame key={playKey} {...props} />
  if (game === 'letters') return <LettersGame key={playKey} {...props} />
  if (game === 'numbers') return <NumbersGame key={playKey} {...props} />
  if (game === 'shadow') return <ShadowGame key={playKey} {...props} />
  if (game === 'wudu') return <WuduOrderGame key={playKey} {...props} />

  return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-7">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'العودة'}</button>
        <h1 className="font-display text-3xl text-teal-dark">{isEn ? 'Fun Games' : 'ألعاب ممتعة'}</h1>
      </div>
      <p className="font-body text-center text-ink/70 mb-6">{isEn ? 'Play, learn and collect stars! ⭐' : 'العب وتعلّم واجمع النجوم! ⭐'}</p>
      <div className="grid grid-cols-2 gap-4">
        {games.map((g) => (
          <button key={g.id} onClick={() => { setPlayKey((k) => k + 1); setGame(g.id) }} className={`${g.color} rounded-3xl shadow-md p-5 flex flex-col items-center gap-2 active:scale-95 transition-transform`}>
            <span className="text-5xl">{g.icon}</span>
            <span className="font-display text-lg text-white text-center leading-tight">{isEn ? g.en : g.ar}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

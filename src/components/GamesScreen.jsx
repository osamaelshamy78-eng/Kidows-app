import { useState } from 'react'

const games = [
  { id: 'memory', icon: '🧠', ar: 'لعبة الذاكرة', en: 'Memory Match' },
  { id: 'find', icon: '🔍', ar: 'ابحث عن الشيء', en: 'Find It' },
  { id: 'stars', icon: '⭐', ar: 'اجمع النجوم', en: 'Collect Stars' },
  { id: 'listen', icon: '🔊', ar: 'استمع واختر', en: 'Listen & Choose' }
]

const memoryPairs = ['🕌', '🌙', '⭐', '🕋', '🕌', '🌙', '⭐', '🕋']

export default function GamesScreen({ lang = 'ar', onBack, onComplete }) {
  const isEn = lang === 'en'
  const [game, setGame] = useState(null)
  const [score, setScore] = useState(0)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [target, setTarget] = useState('🌙')
  const [choices, setChoices] = useState(['☀️', '🌙', '⭐', '🌳'])
  const [collected, setCollected] = useState(0)

  function finish(points = 1) {
    setScore((s) => s + points)
    onComplete?.()
  }

  function chooseMemory(i) {
    if (flipped.includes(i) || matched.includes(i) || flipped.length === 2) return
    const next = [...flipped, i]
    setFlipped(next)
    if (next.length === 2) {
      if (memoryPairs[next[0]] === memoryPairs[next[1]]) {
        setMatched((m) => [...m, ...next])
        setFlipped([])
        finish()
      } else {
        setTimeout(() => setFlipped([]), 650)
      }
    }
  }

  function newFindRound() {
    const pool = ['☀️', '🌙', '⭐', '🌳', '🕌', '🐦']
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setTarget(shuffled[0])
    setChoices(shuffled.slice(0, 4))
  }

  function reset() {
    setGame(null); setScore(0); setFlipped([]); setMatched([]); setCollected(0); newFindRound()
  }

  if (!game) return (
    <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center justify-between mb-7">
        <button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'العودة'}</button>
        <h1 className="font-display text-3xl text-teal-dark">{isEn ? 'Fun Games' : 'ألعاب ممتعة'}</h1>
      </div>
      <p className="font-body text-center text-ink/70 mb-6">{isEn ? 'Play, learn and collect stars! ⭐' : 'العب وتعلّم واجمع النجوم! ⭐'}</p>
      <div className="grid gap-4">
        {games.map((g) => <button key={g.id} onClick={() => setGame(g.id)} className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-5 active:scale-95 transition-transform">
          <span className="text-5xl">{g.icon}</span><span className="font-display text-xl text-ink">{isEn ? g.en : g.ar}</span>
        </button>)}
      </div>
    </div>
  )

  if (game === 'memory') return (
    <GameShell title={isEn ? 'Memory Match' : 'لعبة الذاكرة'} onBack={() => setGame(null)}>
      <p className="text-center font-body text-ink/70 mb-5">{isEn ? 'Find matching pairs.' : 'اعثر على البطاقات المتشابهة.'}</p>
      <div className="grid grid-cols-4 gap-3">
        {memoryPairs.map((item, i) => <button key={i} onClick={() => chooseMemory(i)} className="aspect-square rounded-2xl bg-teal text-3xl shadow-md">{flipped.includes(i) || matched.includes(i) ? item : '❓'}</button>)}
      </div>
      <p className="text-center font-display text-xl mt-5">⭐ {score}</p>
      {matched.length === memoryPairs.length && <Result isEn={isEn} onReset={reset} />}
    </GameShell>
  )

  if (game === 'find') return (
    <GameShell title={isEn ? 'Find It' : 'ابحث عن الشيء'} onBack={() => setGame(null)}>
      <p className="text-center font-body mb-4">{isEn ? 'Find the moon 🌙' : 'اعثر على القمر 🌙'}</p>
      <div className="grid grid-cols-2 gap-4">{choices.map((item, i) => <button key={i} onClick={() => { if (item === target) { finish(); newFindRound() } }} className="bg-white rounded-3xl shadow-lg text-6xl p-8 active:scale-90">{item}</button>)}</div>
      <p className="text-center font-display text-xl mt-5">⭐ {score}</p>
    </GameShell>
  )

  if (game === 'stars') return (
    <GameShell title={isEn ? 'Collect Stars' : 'اجمع النجوم'} onBack={() => setGame(null)}>
      <p className="text-center font-body mb-5">{isEn ? 'Tap the stars before they disappear!' : 'اضغط على النجوم قبل أن تختفي!'}</p>
      <div className="grid grid-cols-3 gap-4 min-h-72">{Array.from({ length: 12 }).map((_, i) => <button key={i} onClick={() => { setCollected((c) => c + 1); finish() }} className="text-5xl active:scale-75">{(i + collected) % 3 === 0 ? '⭐' : '✨'}</button>)}</div>
      <p className="text-center font-display text-xl">⭐ {score}</p>
    </GameShell>
  )

  return (
    <GameShell title={isEn ? 'Listen & Choose' : 'استمع واختر'} onBack={() => setGame(null)}>
      <p className="text-center font-body mb-4">{isEn ? 'Which picture matches the word?' : 'أي صورة تناسب الكلمة؟'}</p>
      <button onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance('القمر'))} className="mx-auto mb-6 block w-20 h-20 rounded-full bg-gold text-white text-4xl">🔊</button>
      <div className="grid grid-cols-2 gap-4">{['☀️', '🌙', '🌳', '🐦'].map((item) => <button key={item} onClick={() => item === '🌙' && finish()} className="bg-white rounded-3xl shadow-lg text-6xl p-8 active:scale-90">{item}</button>)}</div>
      <p className="text-center font-display text-xl mt-5">⭐ {score}</p>
    </GameShell>
  )
}

function GameShell({ title, onBack, children }) {
  return <div className="min-h-screen bg-cream px-6 py-8" dir="rtl"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">العودة</button><h1 className="font-display text-2xl text-teal-dark">{title}</h1></div><div className="max-w-md mx-auto">{children}</div></div>
}
function Result({ isEn, onReset }) { return <div className="mt-6 text-center"><div className="text-6xl">🎉</div><p className="font-display text-2xl text-teal-dark">{isEn ? 'Great job!' : 'أحسنت!'}</p><button onClick={onReset} className="mt-3 bg-teal text-white rounded-full px-6 py-3">{isEn ? 'Play again' : 'العب مرة أخرى'}</button></div> }

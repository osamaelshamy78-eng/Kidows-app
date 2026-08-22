import { useState } from 'react'

const games = [
  { id: 'memory', icon: '🧠', ar: 'لعبة الذاكرة', en: 'Memory Match' },
  { id: 'find', icon: '🔍', ar: 'ابحث عن الشيء', en: 'Find It' },
  { id: 'stars', icon: '⭐', ar: 'اجمع النجوم', en: 'Collect Stars' },
  { id: 'listen', icon: '🔊', ar: 'استمع واختر', en: 'Listen & Choose' },
  { id: 'coloring', icon: '🎨', ar: 'كتاب التلوين', en: 'Coloring Book' },
  { id: 'puzzle', icon: '🧩', ar: 'ركّب الصورة', en: 'Picture Puzzle' },
  { id: 'difference', icon: '👀', ar: 'اكتشف الاختلاف', en: 'Find the Difference' },
  { id: 'letters', icon: '🔤', ar: 'الحروف والكلمات', en: 'Letters & Words' },
  { id: 'numbers', icon: '🔢', ar: 'تعلّم الأرقام', en: 'Learn Numbers' }
]

const memoryPairs = ['🕌', '🌙', '⭐', '🕋', '🕌', '🌙', '⭐', '🕋']
const puzzlePieces = ['🚗', '🌳', '☁️', '☀️']

export default function GamesScreen({ lang = 'ar', onBack, onComplete }) {
  const isEn = lang === 'en'
  const [game, setGame] = useState(null)
  const [score, setScore] = useState(0)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [target, setTarget] = useState('🌙')
  const [choices, setChoices] = useState(['☀️', '🌙', '⭐', '🌳'])
  const [collected, setCollected] = useState(0)
  const [colored, setColored] = useState({})
  const [puzzleOrder, setPuzzleOrder] = useState(() => [...puzzlePieces].sort(() => Math.random() - 0.5))
  const [difference, setDifference] = useState(null)
  const [letterChoice, setLetterChoice] = useState(null)
  const [numberChoice, setNumberChoice] = useState(null)

  function finish(points = 1) { setScore((s) => s + points); onComplete?.() }
  function chooseMemory(i) {
    if (flipped.includes(i) || matched.includes(i) || flipped.length === 2) return
    const next = [...flipped, i]; setFlipped(next)
    if (next.length === 2) {
      if (memoryPairs[next[0]] === memoryPairs[next[1]]) { setMatched((m) => [...m, ...next]); setFlipped([]); finish() }
      else setTimeout(() => setFlipped([]), 650)
    }
  }
  function newFindRound() {
    const pool = ['☀️', '🌙', '⭐', '🌳', '🕌', '🐦']; const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setTarget(shuffled[0]); setChoices(shuffled.slice(0, 4))
  }
  function reset() { setGame(null); setScore(0); setFlipped([]); setMatched([]); setCollected(0); setColored({}); setPuzzleOrder([...puzzlePieces].sort(() => Math.random() - 0.5)); setDifference(null); setLetterChoice(null); setNumberChoice(null); newFindRound() }

  if (!game) return <div className="min-h-screen bg-cream px-6 py-8" dir={isEn ? 'ltr' : 'rtl'}>
    <div className="flex items-center justify-between mb-7"><button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">{isEn ? 'Back' : 'العودة'}</button><h1 className="font-display text-3xl text-teal-dark">{isEn ? 'Fun Games' : 'ألعاب ممتعة'}</h1></div>
    <p className="font-body text-center text-ink/70 mb-6">{isEn ? 'Play, learn and collect stars! ⭐' : 'العب وتعلّم واجمع النجوم! ⭐'}</p>
    <div className="grid gap-4">{games.map((g) => <button key={g.id} onClick={() => setGame(g.id)} className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-5 active:scale-95 transition-transform"><span className="text-5xl">{g.icon}</span><span className="font-display text-xl text-ink">{isEn ? g.en : g.ar}</span></button>)}</div>
  </div>

  if (game === 'memory') return <GameShell title={isEn ? 'Memory Match' : 'لعبة الذاكرة'} onBack={() => setGame(null)}><p className="text-center font-body text-ink/70 mb-5">{isEn ? 'Find matching pairs.' : 'اعثر على البطاقات المتشابهة.'}</p><div className="grid grid-cols-4 gap-3">{memoryPairs.map((item, i) => <button key={i} onClick={() => chooseMemory(i)} className="aspect-square rounded-2xl bg-teal text-3xl shadow-md">{flipped.includes(i) || matched.includes(i) ? item : '❓'}</button>)}</div><Score score={score} />{matched.length === memoryPairs.length && <Result isEn={isEn} onReset={reset} />}</GameShell>

  if (game === 'find') return <GameShell title={isEn ? 'Find It' : 'ابحث عن الشيء'} onBack={() => setGame(null)}><p className="text-center font-body mb-4">{isEn ? `Find ${target}` : `اعثر على ${target === '🌙' ? 'القمر' : 'الشيء المطلوب'} ${target}`}</p><div className="grid grid-cols-2 gap-4">{choices.map((item, i) => <button key={i} onClick={() => item === target && (finish(), newFindRound())} className="bg-white rounded-3xl shadow-lg text-6xl p-8 active:scale-90">{item}</button>)}</div><Score score={score} /></GameShell>

  if (game === 'stars') return <GameShell title={isEn ? 'Collect Stars' : 'اجمع النجوم'} onBack={() => setGame(null)}><p className="text-center font-body mb-5">{isEn ? 'Tap the stars!' : 'اضغط على النجوم!'}</p><div className="grid grid-cols-3 gap-4 min-h-72">{Array.from({ length: 12 }).map((_, i) => <button key={i} onClick={() => { setCollected((c) => c + 1); finish() }} className="text-5xl active:scale-75">{(i + collected) % 3 === 0 ? '⭐' : '✨'}</button>)}</div><Score score={score} /></GameShell>

  if (game === 'listen') return <GameShell title={isEn ? 'Listen & Choose' : 'استمع واختر'} onBack={() => setGame(null)}><p className="text-center font-body mb-4">{isEn ? 'Which picture matches the word?' : 'أي صورة تناسب الكلمة؟'}</p><button onClick={() => speak(isEn ? 'moon' : 'القمر', isEn ? 'en-US' : 'ar-SA')} className="mx-auto mb-6 block w-20 h-20 rounded-full bg-gold text-white text-4xl">🔊</button><div className="grid grid-cols-2 gap-4">{['☀️', '🌙', '🌳', '🐦'].map((item) => <button key={item} onClick={() => item === '🌙' && finish()} className="bg-white rounded-3xl shadow-lg text-6xl p-8 active:scale-90">{item}</button>)}</div><Score score={score} /></GameShell>

  if (game === 'coloring') return <GameShell title={isEn ? 'Coloring Book' : 'كتاب التلوين'} onBack={() => setGame(null)}><p className="text-center font-body mb-4">{isEn ? 'Choose a color and tap the picture.' : 'اختر لونًا ثم اضغط على الصورة.'}</p><div className="flex justify-center gap-3 mb-5">{['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7'].map((c) => <button key={c} onClick={() => setColored({ selected: c })} style={{ backgroundColor: c }} className="w-10 h-10 rounded-full border-4 border-white shadow" />)}</div><button onClick={() => colored.selected && finish()} style={{ color: colored.selected || '#64748b' }} className="mx-auto block text-[150px] leading-none">🚗</button><p className="text-center font-body mt-5">{isEn ? 'Tap the car to color it!' : 'اضغط على السيارة لتلوينها!'}</p><Score score={score} /></GameShell>

  if (game === 'puzzle') return <GameShell title={isEn ? 'Picture Puzzle' : 'ركّب الصورة'} onBack={() => setGame(null)}><p className="text-center font-body mb-4">{isEn ? 'Tap pieces in the correct order.' : 'اضغط على القطع بالترتيب الصحيح.'}</p><div className="grid grid-cols-2 gap-3">{puzzleOrder.map((item, i) => <button key={`${item}-${i}`} onClick={() => { if (item === puzzlePieces[i]) { finish(); if (i === puzzlePieces.length - 1) setPuzzleOrder([...puzzlePieces]) } }} className="aspect-square rounded-3xl bg-white shadow-lg text-6xl">{item}</button>)}</div><Score score={score} /></GameShell>

  if (game === 'difference') return <GameShell title={isEn ? 'Find the Difference' : 'اكتشف الاختلاف'} onBack={() => setGame(null)}><p className="text-center font-body mb-5">{isEn ? 'Which picture is different?' : 'أي صورة مختلفة؟'}</p><div className="grid grid-cols-2 gap-4">{['🐱','🐱','🐱','🐶'].map((x, i) => <button key={i} onClick={() => { if (x === '🐶') { setDifference(i); finish() } }} className="bg-white rounded-3xl shadow-lg text-7xl p-8">{x}</button>)}</div>{difference !== null && <Result isEn={isEn} onReset={reset} />}<Score score={score} /></GameShell>

  if (game === 'letters') return <GameShell title={isEn ? 'Letters & Words' : 'الحروف والكلمات'} onBack={() => setGame(null)}><p className="text-center font-body text-3xl mb-5">{isEn ? 'Which word starts with B?' : 'أي كلمة تبدأ بحرف ب؟'}</p><div className="grid grid-cols-2 gap-4">{['🐝','🐱','🍎','🚗'].map((x) => <button key={x} onClick={() => { if (x === '🐝') { setLetterChoice(x); finish() } }} className="bg-white rounded-3xl shadow-lg text-7xl p-7">{x}</button>)}</div>{letterChoice && <Result isEn={isEn} onReset={reset} />}<Score score={score} /></GameShell>

  return <GameShell title={isEn ? 'Learn Numbers' : 'تعلّم الأرقام'} onBack={() => setGame(null)}><p className="text-center font-body text-3xl mb-5">🍎 🍎 🍎<br />{isEn ? 'How many apples?' : 'كم عدد التفاحات؟'}</p><div className="grid grid-cols-2 gap-4">{[2,3,4,5].map((n) => <button key={n} onClick={() => { if (n === 3) { setNumberChoice(n); finish() } }} className="bg-white rounded-3xl shadow-lg text-4xl p-6">{n}</button>)}</div>{numberChoice && <Result isEn={isEn} onReset={reset} />}<Score score={score} /></GameShell>
}

function speak(text, lang) { if (!window.speechSynthesis) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang; window.speechSynthesis.speak(u) }
function Score({ score }) { return <p className="text-center font-display text-xl mt-5">⭐ {score}</p> }
function GameShell({ title, onBack, children }) { return <div className="min-h-screen bg-cream px-6 py-8" dir="rtl"><div className="flex items-center justify-between mb-6"><button onClick={onBack} className="font-body font-bold text-ink bg-white/70 rounded-full px-4 py-2">العودة</button><h1 className="font-display text-2xl text-teal-dark">{title}</h1></div><div className="max-w-md mx-auto">{children}</div></div> }
function Result({ isEn, onReset }) { return <div className="mt-6 text-center"><div className="text-6xl">🎉</div><p className="font-display text-2xl text-teal-dark">{isEn ? 'Great job!' : 'أحسنت!'}</p><button onClick={onReset} className="mt-3 bg-teal text-white rounded-full px-6 py-3">{isEn ? 'Play again' : 'العب مرة أخرى'}</button></div> }

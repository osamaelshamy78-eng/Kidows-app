import { useEffect, useRef, useState } from 'react'
import { things } from '../../data/games.js'
import { GameShell, Result, pick, shuffle, praise } from './common.jsx'
import { playText, stopAudio } from '../../utils/audio.js'

const PAIRS = 6

function newDeck() {
  const chosen = pick(things, PAIRS)
  return shuffle([...chosen, ...chosen]).map((thing, i) => ({ key: i, thing }))
}

export default function MemoryGame({ isEn, onBack, onStar }) {
  const [deck, setDeck] = useState(newDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const timer = useRef(null)
  const lang = isEn ? 'en' : 'ar'

  useEffect(() => () => { clearTimeout(timer.current); stopAudio() }, [])

  function choose(i) {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return
    const card = deck[i].thing
    playText(isEn ? card.en : card.ar, lang)
    const next = [...flipped, i]
    setFlipped(next)
    if (next.length < 2) return

    setMoves((m) => m + 1)
    const [a, b] = next
    if (deck[a].thing.id === deck[b].thing.id) {
      timer.current = setTimeout(() => {
        setMatched((m) => [...m, a, b])
        setFlipped([])
        onStar?.()
        playText(praise(isEn), lang)
      }, 450)
    } else {
      timer.current = setTimeout(() => setFlipped([]), 900)
    }
  }

  function reset() {
    setDeck(newDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
  }

  const won = matched.length === deck.length

  return (
    <GameShell title={isEn ? 'Memory Match' : 'لعبة الذاكرة'} isEn={isEn} onBack={onBack}>
      <p className="text-center font-body text-ink/70 mb-4">{isEn ? 'Flip two cards and find the matching pairs.' : 'اقلب بطاقتين وابحث عن الصور المتشابهة.'}</p>
      <div className="grid grid-cols-4 gap-3">
        {deck.map((card, i) => {
          const open = flipped.includes(i) || matched.includes(i)
          return (
            <button key={card.key} onClick={() => choose(i)} className={`aspect-square rounded-2xl text-4xl shadow-md transition-all duration-300 ${open ? 'bg-white' : 'bg-teal'} ${matched.includes(i) ? 'opacity-60 ring-4 ring-gold' : ''}`}>
              {open ? <span className="animate-pop inline-block">{card.thing.emoji}</span> : <span className="text-white/80 text-2xl">✦</span>}
            </button>
          )
        })}
      </div>
      <p className="text-center font-body text-ink/60 mt-4">{isEn ? `Moves: ${moves}` : `عدد المحاولات: ${moves}`}</p>
      {won && <Result isEn={isEn} onReset={reset} onBack={onBack} />}
    </GameShell>
  )
}

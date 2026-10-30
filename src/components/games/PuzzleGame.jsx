import { useEffect, useState } from 'react'
import { puzzleScenes } from '../../data/games.js'
import { GameShell, Result, shuffle } from './common.jsx'
import { playText, stopAudio } from '../../utils/audio.js'

function scramble(scene) {
  let tiles = shuffle(scene)
  while (tiles.every((t, i) => t === scene[i])) tiles = shuffle(scene)
  return tiles
}

// Tap two tiles to swap them until the picture matches the small preview.
export default function PuzzleGame({ isEn, onBack, onStar }) {
  const [sceneIndex, setSceneIndex] = useState(() => Math.floor(Math.random() * puzzleScenes.length))
  const scene = puzzleScenes[sceneIndex]
  const [tiles, setTiles] = useState(() => scramble(scene))
  const [selected, setSelected] = useState(null)
  const [won, setWon] = useState(false)

  useEffect(() => () => stopAudio(), [])

  function tap(i) {
    if (won) return
    if (selected === null) { setSelected(i); return }
    if (selected === i) { setSelected(null); return }
    const next = [...tiles]
    ;[next[selected], next[i]] = [next[i], next[selected]]
    setTiles(next)
    setSelected(null)
    if (next.every((t, k) => t === scene[k])) {
      setWon(true)
      onStar?.()
    }
  }

  function newPuzzle() {
    const nextIndex = (sceneIndex + 1) % puzzleScenes.length
    setSceneIndex(nextIndex)
    setTiles(scramble(puzzleScenes[nextIndex]))
    setSelected(null)
    setWon(false)
    playText(isEn ? 'New puzzle' : 'صورة جديدة', isEn ? 'en' : 'ar')
  }

  return (
    <GameShell title={isEn ? 'Picture Puzzle' : 'ركّب الصورة'} isEn={isEn} onBack={onBack}>
      <p className="text-center font-body text-ink/70 mb-3">{isEn ? 'Tap two pieces to swap them. Make it look like the small picture!' : 'اضغط على قطعتين لتبديلهم. خلّي الصورة زي الصورة الصغيرة!'}</p>
      <div className="mx-auto mb-4 w-28 grid grid-cols-3 gap-0.5 bg-white rounded-xl p-1 shadow">
        {scene.map((t, i) => <span key={i} className="text-xl text-center leading-8">{t}</span>)}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-teal-light/30 rounded-3xl p-3">
        {tiles.map((t, i) => {
          const inPlace = t === scene[i]
          return (
            <button key={i} onClick={() => tap(i)} className={`aspect-square rounded-2xl text-5xl shadow-md transition-all duration-200 ${selected === i ? 'bg-gold-light ring-4 ring-gold scale-95' : inPlace ? 'bg-white ring-2 ring-teal/40' : 'bg-white'}`}>
              {t}
            </button>
          )
        })}
      </div>
      {won && <Result isEn={isEn} onReset={newPuzzle} onBack={onBack} />}
    </GameShell>
  )
}

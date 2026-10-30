import { useState, useEffect, useCallback, useRef } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import AdhkarScreen from './components/AdhkarScreen.jsx'
import StoriesListScreen from './components/StoriesListScreen.jsx'
import StoryScreen from './components/StoryScreen.jsx'
import PrayerHubScreen from './components/PrayerHubScreen.jsx'
import WuduScreen from './components/WuduScreen.jsx'
import PrayersScreen from './components/PrayersScreen.jsx'
import BabyModeScreen from './components/BabyModeScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import GamesScreen from './components/GamesScreen.jsx'
import ParentScreen from './components/ParentScreen.jsx'
import ParentGate from './components/ParentGate.jsx'
import { morningAdhkar, eveningAdhkar } from './data/adhkar.js'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeStory, setActiveStory] = useState(null)
  const [stars, setStars] = useState(0)
  const [lang, setLang] = useState(() => localStorage.getItem('kidows_lang') || 'ar')
  // What the parent gate is protecting right now: 'parents' | 'exitBaby' | null
  const [gateFor, setGateFor] = useState(null)
  const screenRef = useRef(screen)
  screenRef.current = screen

  useEffect(() => {
    const saved = localStorage.getItem('stars')
    if (saved) setStars(Number(saved))
  }, [])

  function toggleLanguage() {
    setLang((value) => {
      const next = value === 'ar' ? 'en' : 'ar'
      localStorage.setItem('kidows_lang', next)
      return next
    })
  }

  useEffect(() => {
    window.history.replaceState({ screen: 'home', extra: null }, '', '#home')
    function handlePopState(event) {
      // Baby mode traps the hardware/gesture back button: re-push the same
      // state instead of navigating away. The only way out is the explicit
      // ⏎ button inside BabyModeScreen, which uses navigate() (pushState),
      // not history.back(), so it's unaffected by this trap.
      if (screenRef.current === 'baby') {
        window.history.pushState({ screen: 'baby', extra: null }, '', '#baby')
        return
      }
      setGateFor(null)
      const state = event.state
      if (state && state.screen) {
        setScreen(state.screen)
        setActiveStory(state.extra || null)
      } else {
        setScreen('home')
        setActiveStory(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Toggle a body class so index.css can scope pull-to-refresh prevention
  // to baby mode only, without affecting scroll/refresh on other screens.
  useEffect(() => {
    document.body.classList.toggle('baby-mode-lock', screen === 'baby')
    return () => document.body.classList.remove('baby-mode-lock')
  }, [screen])

  const navigate = useCallback((nextScreen, extra = null) => {
    // Fired synchronously inside the click handler (not in a useEffect
    // after render) so it still counts as "triggered by a user gesture" —
    // some browsers reject requestFullscreen() otherwise.
    if (nextScreen === 'baby') {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else if (screenRef.current === 'baby' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
    setScreen(nextScreen)
    if (extra !== null) setActiveStory(extra)
    const hash = extra ? `${nextScreen}/${extra}` : nextScreen
    window.history.pushState({ screen: nextScreen, extra }, '', `#${hash}`)
  }, [])

  const goBack = useCallback(() => window.history.back(), [])

  // Functional update: games can award several stars quickly (and from
  // timeouts), so reading `stars` from the closure would lose some.
  const addStar = useCallback(() => {
    setStars((value) => {
      const next = value + 1
      localStorage.setItem('stars', String(next))
      return next
    })
  }, [])

  function resetStars() {
    setStars(0)
    localStorage.setItem('stars', '0')
  }

  function passGate() {
    const target = gateFor
    setGateFor(null)
    if (target === 'parents') navigate('parents')
    if (target === 'exitBaby') navigate('home')
  }

  let content
  if (screen === 'morning') content = <AdhkarScreen type="morning" items={morningAdhkar} lang={lang} onBack={goBack} onComplete={addStar} />
  else if (screen === 'evening') content = <AdhkarScreen type="evening" items={eveningAdhkar} lang={lang} onBack={goBack} onComplete={addStar} />
  else if (screen === 'stories') content = <StoriesListScreen lang={lang} onSelect={(id) => navigate('story', id)} onBack={goBack} />
  else if (screen === 'story') content = <StoryScreen storyId={activeStory} lang={lang} onBack={goBack} onComplete={addStar} />
  else if (screen === 'prayerHub') content = <PrayerHubScreen lang={lang} onSelect={(next) => navigate(next)} onBack={goBack} />
  else if (screen === 'wudu') content = <WuduScreen lang={lang} onBack={goBack} onComplete={addStar} />
  else if (screen === 'prayers') content = <PrayersScreen lang={lang} onBack={goBack} />
  else if (screen === 'quiz') content = <QuizScreen lang={lang} onBack={goBack} onCorrect={addStar} />
  else if (screen === 'games') content = <GamesScreen lang={lang} onBack={goBack} onComplete={addStar} />
  else if (screen === 'parents') content = <ParentScreen lang={lang} stars={stars} onToggleLanguage={toggleLanguage} onResetStars={resetStars} onBack={goBack} />
  // The exit button opens the parent gate; passing it uses navigate()
  // (pushState) instead of history.back(), since popstate is trapped above.
  else if (screen === 'baby') content = <BabyModeScreen lang={lang} onBack={() => setGateFor('exitBaby')} />
  else content = <HomeScreen lang={lang} onOpenParents={() => setGateFor('parents')} onSelect={(next) => navigate(next)} stars={stars} />

  return (
    <>
      {content}
      {gateFor && <ParentGate isEn={lang === 'en'} onSuccess={passGate} onCancel={() => setGateFor(null)} />}
    </>
  )
}

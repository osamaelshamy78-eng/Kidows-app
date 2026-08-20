import { useState, useEffect, useCallback } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import AdhkarScreen from './components/AdhkarScreen.jsx'
import StoriesListScreen from './components/StoriesListScreen.jsx'
import StoryScreen from './components/StoryScreen.jsx'
import PrayerHubScreen from './components/PrayerHubScreen.jsx'
import WuduScreen from './components/WuduScreen.jsx'
import PrayersScreen from './components/PrayersScreen.jsx'
import BabyModeScreen from './components/BabyModeScreen.jsx'
import { morningAdhkar, eveningAdhkar } from './data/adhkar.js'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeStory, setActiveStory] = useState(null)
  const [stars, setStars] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('stars')
    if (saved) setStars(Number(saved))
  }, [])

  // --- Navigation history wiring -------------------------------------
  // Every screen change pushes a browser history entry, so the phone's
  // hardware/gesture back button pops back one screen at a time instead
  // of closing the app immediately. Only when the user is already on
  // "home" (the base entry) does back exit the app, which matches how
  // Karaji behaves.
  useEffect(() => {
    window.history.replaceState({ screen: 'home', extra: null }, '', '#home')

    function handlePopState(event) {
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

  const navigate = useCallback((nextScreen, extra = null) => {
    setScreen(nextScreen)
    if (extra !== null) setActiveStory(extra)
    const hash = extra ? `${nextScreen}/${extra}` : nextScreen
    window.history.pushState({ screen: nextScreen, extra }, '', `#${hash}`)
  }, [])

  const goBack = useCallback(() => {
    window.history.back()
  }, [])

  function addStar() {
    const next = stars + 1
    setStars(next)
    localStorage.setItem('stars', String(next))
  }

  if (screen === 'morning') {
    return (
      <AdhkarScreen
        type="morning"
        items={morningAdhkar}
        onBack={goBack}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'evening') {
    return (
      <AdhkarScreen
        type="evening"
        items={eveningAdhkar}
        onBack={goBack}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'stories') {
    return (
      <StoriesListScreen
        onSelect={(id) => navigate('story', id)}
        onBack={goBack}
      />
    )
  }

  if (screen === 'story') {
    return (
      <StoryScreen
        storyId={activeStory}
        onBack={goBack}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'prayerHub') {
    return (
      <PrayerHubScreen
        onSelect={(next) => navigate(next)}
        onBack={goBack}
      />
    )
  }

  if (screen === 'wudu') {
    return <WuduScreen onBack={goBack} onComplete={addStar} />
  }

  if (screen === 'prayers') {
    return <PrayersScreen onBack={goBack} />
  }

  if (screen === 'baby') {
    return <BabyModeScreen onBack={goBack} />
  }

  return <HomeScreen onSelect={(next) => navigate(next)} stars={stars} />
}

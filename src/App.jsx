import { useState, useEffect, useCallback } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import AdhkarScreen from './components/AdhkarScreen.jsx'
import StoriesListScreen from './components/StoriesListScreen.jsx'
import StoryScreen from './components/StoryScreen.jsx'
import PrayerHubScreen from './components/PrayerHubScreen.jsx'
import WuduScreen from './components/WuduScreen.jsx'
import PrayersScreen from './components/PrayersScreen.jsx'
import BabyModeScreen from './components/BabyModeScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import { morningAdhkar, eveningAdhkar } from './data/adhkar.js'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeStory, setActiveStory] = useState(null)
  const [stars, setStars] = useState(0)
  const [lang, setLang] = useState(() => localStorage.getItem('kidows_lang') || 'ar')

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
    return <AdhkarScreen type="morning" items={morningAdhkar} lang={lang} onBack={goBack} onComplete={addStar} />
  }

  if (screen === 'evening') {
    return <AdhkarScreen type="evening" items={eveningAdhkar} lang={lang} onBack={goBack} onComplete={addStar} />
  }

  if (screen === 'stories') {
    return <StoriesListScreen lang={lang} onSelect={(id) => navigate('story', id)} onBack={goBack} />
  }

  if (screen === 'story') {
    return <StoryScreen storyId={activeStory} lang={lang} onBack={goBack} onComplete={addStar} />
  }

  if (screen === 'prayerHub') {
    return <PrayerHubScreen lang={lang} onSelect={(next) => navigate(next)} onBack={goBack} />
  }

  if (screen === 'wudu') {
    return <WuduScreen lang={lang} onBack={goBack} onComplete={addStar} />
  }

  if (screen === 'prayers') {
    return <PrayersScreen lang={lang} onBack={goBack} />
  }

  if (screen === 'quiz') {
    return <QuizScreen lang={lang} onBack={goBack} onCorrect={addStar} />
  }

  if (screen === 'baby') {
    return <BabyModeScreen lang={lang} onBack={goBack} />
  }

  return <HomeScreen lang={lang} onToggleLanguage={toggleLanguage} onSelect={(next) => navigate(next)} stars={stars} />
}

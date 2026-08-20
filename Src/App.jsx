import { useState, useEffect } from 'react'
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
        onBack={() => setScreen('home')}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'evening') {
    return (
      <AdhkarScreen
        type="evening"
        items={eveningAdhkar}
        onBack={() => setScreen('home')}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'stories') {
    return (
      <StoriesListScreen
        onSelect={(id) => {
          setActiveStory(id)
          setScreen('story')
        }}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'story') {
    return (
      <StoryScreen
        storyId={activeStory}
        onBack={() => setScreen('stories')}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'prayerHub') {
    return (
      <PrayerHubScreen
        onSelect={(next) => setScreen(next)}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'wudu') {
    return (
      <WuduScreen
        onBack={() => setScreen('prayerHub')}
        onComplete={addStar}
      />
    )
  }

  if (screen === 'prayers') {
    return <PrayersScreen onBack={() => setScreen('prayerHub')} />
  }

  if (screen === 'baby') {
    return <BabyModeScreen onBack={() => setScreen('home')} />
  }

  return <HomeScreen onSelect={setScreen} stars={stars} />
}

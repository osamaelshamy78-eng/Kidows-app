import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './index.css'
import { installAudioUnlock } from './utils/audio.js'

installAudioUnlock()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* Vercel Web Analytics: cookieless page-view counts, no personal data. */}
    <Analytics />
  </React.StrictMode>
)

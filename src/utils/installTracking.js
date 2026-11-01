// Install tracking on Vercel Web Analytics' free plan, which has no custom events:
// visits from the installed app are reported under /app, and Android/Chrome
// installs as a one-off /installed page view. iOS fires no install event, so
// iPhone installs only show up as /app visits once the app is opened.
import { pageview } from '@vercel/analytics'

export function isInstalledApp() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export function tagInstalledVisits(event) {
  if (event.type !== 'pageview' || !isInstalledApp()) return event
  const url = new URL(event.url)
  if (!url.pathname.startsWith('/app')) url.pathname = '/app' + url.pathname
  return { ...event, url: url.toString() }
}

export function trackInstalls() {
  if (typeof window === 'undefined') return
  window.addEventListener('appinstalled', () => pageview({ route: '/installed', path: '/installed' }))
}

import { useState, useEffect } from 'react'
import TheCatchGame from './TheCatchGame'
import TheCatchCaseStudy from './TheCatchCaseStudy'

// Shareable links: /the-catch opens the case study, /the-catch/play opens the scorekeeper.
// vercel.json rewrites both paths to index.html.
export const CATCH_PATH = '/the-catch'
export const CATCH_PLAY_PATH = '/the-catch/play'
const currentPath = () => window.location.pathname.replace(/\/+$/, '')
export const isCatchPath = () => currentPath().startsWith(CATCH_PATH)
const viewFromPath = () => (currentPath() === CATCH_PLAY_PATH ? 'game' : 'case_study')

export default function TheCatchModal({ onClose }) {
  const [view, setView] = useState(viewFromPath) // 'case_study' | 'game'
  const inGame = view === 'game'

  const goTo = next => {
    window.history.pushState(null, '', next === 'game' ? CATCH_PLAY_PATH : CATCH_PATH)
    setView(next)
  }

  // Browser back/forward moves between the scorekeeper and the case study
  useEffect(() => {
    const sync = () => setView(viewFromPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  // While a game is open, let the page run edge-to-edge on notched iPhones so the
  // frame can pad itself around the Dynamic Island and home indicator (safe-area insets).
  useEffect(() => {
    if (!inGame) return
    const meta = document.querySelector('meta[name="viewport"]')
    if (!meta) return
    const prev = meta.getAttribute('content')
    if (!prev.includes('viewport-fit')) meta.setAttribute('content', `${prev}, viewport-fit=cover`)
    return () => meta.setAttribute('content', prev)
  }, [inGame])

  // Sized to an iPhone 15 screen: 393 × 852 pt. On a phone it fills the screen;
  // on desktop it renders as a 393 × 852 device frame.
  const phoneFrame = children => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#0a0808' }}
    >
      <div className="catch-phone" style={{
        width: '100%',
        maxWidth: 393,
        height: '100dvh',
        maxHeight: 852,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: 'border-box',
        background: '#131011',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  )

  if (view === 'game') return phoneFrame(<TheCatchGame onClose={() => goTo('case_study')} />)

  return (
    <TheCatchCaseStudy
      onClose={onClose}
      onPlay={() => goTo('game')}
    />
  )
}

import { useState, useEffect } from 'react'
import TheCatchGame from './TheCatchGame'
import TheCatchCaseStudy from './TheCatchCaseStudy'
import TheCatchOnline from './TheCatchOnline'

export default function TheCatchModal({ onClose }) {
  const [view, setView] = useState('case_study') // 'case_study' | 'game' | 'online'
  const inGame = view === 'game' || view === 'online'

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

  if (view === 'game')   return phoneFrame(<TheCatchGame   onClose={() => setView('case_study')} />)
  if (view === 'online') return phoneFrame(<TheCatchOnline onClose={() => setView('case_study')} />)

  return (
    <TheCatchCaseStudy
      onClose={onClose}
      onPlay={() => setView('game')}
      onPlayOnline={() => setView('online')}
    />
  )
}

import { useState } from 'react'
import TheCatchGame from './TheCatchGame'
import TheCatchCaseStudy from './TheCatchCaseStudy'
import TheCatchOnline from './TheCatchOnline'

export default function TheCatchModal({ onClose }) {
  const [view, setView] = useState('case_study') // 'case_study' | 'game' | 'online'

  const phoneFrame = children => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#0a0808' }}
    >
      <div style={{
        width: '100%',
        maxWidth: 390,
        height: '100dvh',
        maxHeight: '100dvh',
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

import TheCatchGame from './TheCatchGame'

export default function TheCatchModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#0a0808' }}
    >
      {/* Phone frame: 390px on desktop, full-screen on mobile */}
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
        <TheCatchGame onClose={onClose} />
      </div>
    </div>
  )
}

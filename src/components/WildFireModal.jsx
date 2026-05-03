import { useEffect } from 'react'

const RED = '#c41b1b'

const SPREADS = [
  '/wildfire/spread1.png',
  '/wildfire/spread2.png',
  '/wildfire/spread3.png',
  '/wildfire/spread4.png',
  '/wildfire/spread5.png',
]

export default function WildFireModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">

      {/* Sticky nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button
          onClick={onClose}
          className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity"
        >
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Title section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <h1 className="font-lexend font-black text-[#111] leading-none mb-3" style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
          Wild Fire
        </h1>
        <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.7)] leading-relaxed max-w-2xl mb-5">
          An editorial design exploration examining the intersection of nature, destruction, and resilience through compelling photography and typography.
        </p>
        <div className="flex gap-2 flex-wrap">
          {['Editorial Design', 'Typography', 'Photography'].map(tag => (
            <span
              key={tag}
              className="font-lexend text-xs px-3 py-1 rounded-full border border-[rgba(51,78,111,0.3)] text-[rgba(51,78,111,0.7)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Spreads gallery */}
      <div className="w-full py-10 md:py-14 px-4 md:px-10 flex flex-col gap-6" style={{ backgroundColor: '#111' }}>
        {SPREADS.map((src, i) => (
          <div key={i} className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <img src={src} alt={`Wild Fire spread ${i + 1}`} draggable={false} className="w-full h-auto block" />
          </div>
        ))}
      </div>

      {/* Project details */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left */}
        <div>
          <h2 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-6">
            Project Details
          </h2>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Year',  value: '2026' },
              { label: 'Role',  value: 'Editorial Designer' },
              { label: 'Tools', value: 'InDesign, Photoshop' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-lexend text-xs text-[rgba(51,78,111,0.5)] mb-1">{label}</p>
                <p className="font-lexend font-medium text-sm" style={{ color: RED }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <h2 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-6">
            About the Project
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
              Wild Fire is a multi-page editorial design that explores the devastating impact of wildfires on natural landscapes. Through a carefully curated combination of photography, typography, and layout design, the project tells a visual story of destruction and resilience.
            </p>
            <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
              The design employs a bold typographic treatment paired with documentary-style photography to create an immersive reading experience. Each spread is carefully composed to guide the reader through the narrative while maintaining visual interest and hierarchy.
            </p>
            <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
              The project demonstrates expertise in layout design, typography, image curation, and the ability to create cohesive multi-page editorial experiences that engage and inform readers.
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="py-10 flex justify-center bg-[#334e6f]">
        <button
          onClick={onClose}
          className="font-lexend font-medium text-white hover:opacity-70 transition-opacity"
        >
          ← Back to Portfolio
        </button>
      </div>

    </div>
  )
}

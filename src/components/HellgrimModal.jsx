import { useEffect } from 'react'

const ORANGE = '#f35500'

export default function HellgrimModal({ onClose }) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: '#111' }}>

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
      <div className="bg-white w-full">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <h1 className="font-lexend font-black leading-none mb-3" style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: ORANGE }}>
            Hellgrim
          </h1>
          <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.7)] leading-relaxed max-w-2xl mb-5">
            A modular typeface built on a strict geometric rule system — every letterform constructed from the same set of triangular and rectangular components.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Typeface Design', 'Typography', 'Branding'].map(tag => (
              <span
                key={tag}
                className="font-lexend text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: '#fff1e0', color: ORANGE }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center" style={{ padding: '1in' }}>
        <img src="/hellgrim/slide1.png" alt="Hellgrim fire hero"      draggable={false} style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '1in' }} />
        <img src="/hellgrim/slide2.png" alt="Hellgrim glyph showcase" draggable={false} style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '1in' }} />
        <img src="/hellgrim/slide3.png" alt="Hellgrim alphabet"       draggable={false} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* Project details */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left */}
          <div>
            <h2 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-6">
              Project Details
            </h2>
            <div className="flex flex-col gap-5">
              {[
                { label: 'Year',  value: '2026' },
                { label: 'Role',  value: 'Type Designer' },
                { label: 'Tools', value: 'Glyphs, Illustrator' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-lexend text-xs text-[rgba(51,78,111,0.5)] mb-1">{label}</p>
                  <p className="font-lexend font-medium text-sm" style={{ color: ORANGE }}>{value}</p>
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
                Hellgrim is a custom typeface that embodies the raw power and intensity of fire. The design features bold, dramatic letterforms paired with striking fire photography to create a cohesive visual language that's both fierce and elegant.
              </p>
              <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
                The project showcases comprehensive type design including multiple weights, glyphs, and character variations. Each letterform is carefully crafted to maintain readability while expressing the burning, untamed energy of its namesake.
              </p>
              <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
                This project demonstrates expertise in typeface design, typographic systems, and the ability to create distinctive custom fonts that work across various applications while maintaining a strong visual identity.
              </p>
            </div>
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

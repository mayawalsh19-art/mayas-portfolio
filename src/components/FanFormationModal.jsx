import { useEffect } from 'react'

const NAVY = '#1c2b5a'
const GOLD = '#f5a000'

export default function FanFormationModal({ onClose }) {
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

      {/* Hero */}
      <div style={{ backgroundColor: NAVY }} className="flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
        <p className="font-lexend text-white/50 text-xs uppercase tracking-widest mb-5">IXD 412 — Interaction Design 3</p>
        <h1
          className="font-black text-white leading-none mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 7vw, 84px)', letterSpacing: '-0.02em' }}
        >
          Fan Formation
        </h1>
        <p className="font-lexend text-white/75 text-base md:text-lg leading-relaxed max-w-xl mb-8">
          A synchronized wristband system for inclusive fan participation at the World Cup.
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {['UX Design', 'Wearable Tech', 'Accessibility'].map(tag => (
            <span
              key={tag}
              className="font-lexend text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* App showcase mockup */}
      <div className="w-full">
        <img
          src="/fanformation/showcase.png"
          alt="Fan Formation app and wristband showcase"
          draggable={false}
          className="w-full h-auto block"
        />
      </div>

      {/* Research poster */}
      <div className="w-full bg-white py-10 md:py-14 px-4 md:px-10">
        <div className="max-w-5xl mx-auto shadow-[0_4px_32px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
          <img
            src="/fanformation/poster1.png"
            alt="Fan Formation research, competitive analysis, and user testing"
            draggable={false}
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* User flow + design system poster */}
      <div className="w-full bg-white pb-10 md:pb-14 px-4 md:px-10">
        <div className="max-w-5xl mx-auto shadow-[0_4px_32px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden">
          <img
            src="/fanformation/poster2.png"
            alt="Fan Formation user flow and design system"
            draggable={false}
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Video + Prototype */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col gap-16">

        {/* Marketing Video */}
        <section>
          <h2 className="font-lexend font-black text-2xl md:text-[36px] leading-none mb-8" style={{ color: NAVY }}>
            Marketing Video
          </h2>
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
            style={{ paddingBottom: '56.25%' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://player.vimeo.com/video/1183892988?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="P_2_Walsh_Maya_Video"
            />
          </div>
        </section>

        {/* Prototype */}
        <section>
          <h2 className="font-lexend font-black text-2xl md:text-[36px] leading-none mb-8" style={{ color: NAVY }}>
            Prototype
          </h2>
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
            style={{ paddingBottom: '56.25%', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://embed.figma.com/proto/OIdGKD4I8pbdOj2SIdVKYY/fifa-world-cup-project?node-id=543-1342&scaling=scale-down&content-scaling=fixed&page-id=543%3A332&starting-point-node-id=543%3A333&embed-host=share"
              allowFullScreen
            />
          </div>
        </section>

      </div>

      {/* Project details */}
      <div style={{ backgroundColor: '#f7f9fc' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

          <div>
            <h2 className="font-lexend font-bold text-xs uppercase tracking-widest mb-6" style={{ color: NAVY }}>
              Project Details
            </h2>
            <div className="flex flex-col gap-5">
              {[
                { label: 'Year',   value: '2026' },
                { label: 'Role',   value: 'UX Designer' },
                { label: 'Course', value: 'IXD 412 — Interaction Design 3' },
                { label: 'Tools',  value: 'Figma, Illustrator' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-lexend text-xs text-[rgba(51,78,111,0.5)] mb-1">{label}</p>
                  <p className="font-lexend font-medium text-sm" style={{ color: GOLD }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-lexend font-bold text-xs uppercase tracking-widest mb-6" style={{ color: NAVY }}>
              About the Project
            </h2>
            <div className="flex flex-col gap-4">
              <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
                Fan Formation is a wearable + mobile ecosystem that translates match momentum into coordinated light and tactile feedback, allowing fans—especially those with sensory sensitivities—to participate in collective stadium energy without relying on loud audio cues.
              </p>
              <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
                The system pairs a custom LED wristband with a companion app that syncs seat location to stadium-wide light patterns. Features like Low-Stimulation Mode, Visual Momentum Language, and haptic controls ensure the experience is accessible and inclusive for every fan.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="py-10 flex justify-center" style={{ backgroundColor: NAVY }}>
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

import { useEffect } from 'react'

const GREEN = '#6DC96A'

const imgPortrait = "https://www.figma.com/api/mcp/asset/d005406a-44df-4c11-97ad-cf18ae20aab1"

export default function SelfPortraitModal({ onClose }) {
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
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <h1
          className="font-lexend font-black leading-none mb-4"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: GREEN }}
        >
          Self Portrait
        </h1>
        <p className="font-lexend text-base text-[rgba(51,78,111,0.75)] leading-relaxed max-w-xl mb-6">
          A self portrait designed in the image and likeness of yours truly, using expressive iconography.
        </p>
        <div className="flex gap-2 flex-wrap">
          {['Illustration', 'Graphic Design', 'Digital Art'].map(tag => (
            <span
              key={tag}
              className="font-lexend text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: GREEN, color: GREEN }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Full-width visual — image already contains both panels */}
      <div className="w-full">
        <img src={imgPortrait} alt="Self portrait" draggable={false} className="w-full h-auto block" />
      </div>

      {/* Project details */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left: project details */}
        <div>
          <h2 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-6">
            Project Details
          </h2>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Year',  value: '2026' },
              { label: 'Role',  value: 'Illustrator & Designer' },
              { label: 'Tools', value: 'Illustrator' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-lexend text-xs text-[rgba(51,78,111,0.5)] mb-1">{label}</p>
                <p className="font-lexend font-medium text-sm" style={{ color: GREEN }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: about */}
        <div>
          <h2 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-6">
            About the Project
          </h2>
          <div className="flex flex-col gap-4">
            <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
              This self-portrait project explores personal identity through a vibrant, contemporary illustration style. Using a bold pink and green color palette, the design creates a memorable visual identity that balances playfulness with sophistication.
            </p>
            <p className="font-lexend text-sm text-[rgba(51,78,111,0.75)] leading-relaxed">
              The design showcases different variations of the portrait across contrasting backgrounds, demonstrating versatility in application and scale. The simplified forms and clean linework create a distinctive style that's both modern and approachable.
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

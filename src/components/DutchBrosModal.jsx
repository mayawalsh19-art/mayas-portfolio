import { useEffect, Fragment } from 'react'

const PRIMARY   = '#00629c'
const CARD_BG   = '#e8f3fb'
const YELLOW    = '#e8a000'
const YELLOW_BG = '#fef9ee'

const imgHome     = "/dutchbros/home.png"
const imgMenu     = "/dutchbros/menu.png"
const imgIced     = "/dutchbros/iced.png"
const imgRedesign = "/dutchbros/redesign_hq.png"

const PROBLEMS = [
  { title: 'Unclear System Status',    text: "No feedback when items are added to cart — users can't tell if actions registered." },
  { title: 'Poor Error Recovery',      text: 'Error states provide no actionable guidance, leaving users stuck with no path forward.' },
  { title: 'Order Preparation Issues', text: 'No estimated time or status indicator after placing an order, causing confusion at pickup.' },
  { title: 'No Reset Function',        text: 'Customizing a drink has no way to undo all changes at once, requiring manual reversion of each option.' },
  { title: 'Inconsistent Design',      text: 'Typography, button styles, and layout patterns vary across screens with no clear design system.' },
  { title: 'Calories Don\'t Update',   text: 'Calorie counts stay static when users customize drinks, giving inaccurate nutritional information.' },
  { title: 'Limited Efficiency',       text: 'Frequent users have no shortcuts or saved preferences, requiring full re-entry every visit.' },
  { title: 'Overwhelming Rewards UI',  text: 'The rewards and promotions screen presents too much at once, reducing discoverability.' },
]

const HEURISTICS = [
  {
    num: '01',
    title: 'Visibility of System Status',
    bad:  'No feedback when a drink is added to cart — users are left wondering if the action registered.',
    good: 'Added a cart badge counter and a brief confirmation animation to reassure users of successful actions.',
  },
  {
    num: '02',
    title: 'Match Between System and Real World',
    bad:  '"Dutch Bucks" and internal reward tiers are unexplained, creating confusion for first-time users.',
    good: 'Renamed labels to familiar language and added short tooltips explaining loyalty rewards.',
  },
  {
    num: '03',
    title: 'User Control and Freedom',
    bad:  'No way to reset all customizations at once — users must manually undo each individual change.',
    good: 'Added a prominent "Reset" button to the customization screen, restoring defaults in one tap.',
  },
  {
    num: '04',
    title: 'Error Prevention',
    bad:  'Tapping "Place Order" triggers immediate submission with no confirmation, causing accidental orders.',
    good: 'Added a review modal before final submission, giving users a clear last chance to verify their order.',
  },
]

const IMPROVEMENTS = [
  'Visual size selector (S / M / L) with price differences displayed',
  'Included toppings separated clearly from paid add-ons',
  'One-tap "Reset" button clears all customizations instantly',
  'Calorie count updates in real time as options are changed',
  'Accordion sections reduce visual clutter on long screens',
]

const FLOW = ['Menu', 'Select Drink', 'Customize', 'Review Order', 'Checkout']

const STATS = [
  { value: '8',    label: 'Heuristic Violations\nIdentified' },
  { value: '4',    label: 'Nielsen Heuristics\nAddressed' },
  { value: '100%', label: 'Test Users Preferred\nthe Redesign' },
]

export default function DutchBrosModal({ onClose }) {
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
      <div style={{ backgroundColor: PRIMARY }} className="flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
        <p className="font-lexend text-white/55 text-xs uppercase tracking-widest mb-5">UX Case Study</p>
        <h1
          className="font-lexend font-black text-white leading-none mb-4"
          style={{ fontSize: 'clamp(32px, 7vw, 80px)' }}
        >
          Dutch Bros App Redesign
        </h1>
        <p className="font-lexend font-medium text-white/80 text-base md:text-lg italic mb-4">
          Heuristic Evaluation & UX Improvements
        </p>
        <p className="font-lexend text-white/55 text-sm">Maya Walsh</p>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-20">

        {/* Key Problems */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-2">
            Key Problems Identified
          </h2>
          <p className="font-lexend text-sm text-[rgba(51,78,111,0.6)] mb-8 leading-relaxed">
            A heuristic evaluation of the existing Dutch Bros app surfaced the following usability issues.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="rounded-2xl p-5 flex flex-col gap-2" style={{ backgroundColor: CARD_BG }}>
                <h3 className="font-lexend font-bold text-xs uppercase tracking-wide" style={{ color: PRIMARY }}>{p.title}</h3>
                <p className="font-lexend text-xs leading-relaxed" style={{ color: 'rgba(0,98,156,0.72)' }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Current Flow Analysis */}
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none">
              Current Flow Analysis
            </h2>
            <span
              className="font-lexend text-xs font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full"
              style={{ backgroundColor: '#e05c2a' }}
            >
              BEFORE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-8 justify-items-center">
            {[
              { img: imgHome, label: 'Home Screen' },
              { img: imgMenu, label: 'Menu Screen' },
              { img: imgIced, label: 'Iced Coffee' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                <div
                  className="w-full shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                  style={{
                    aspectRatio: '9 / 19.5',
                    borderRadius: '28px',
                    border: '8px solid #1c1c2e',
                    backgroundColor: '#1c1c2e',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={s.img}
                    alt={s.label}
                    draggable={false}
                    className="w-full h-full block"
                    style={{ objectFit: 'cover', objectPosition: 'top', borderRadius: '20px' }}
                  />
                </div>
                <span className="font-lexend text-xs font-medium text-[rgba(51,78,111,0.65)]">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Heuristic Analysis */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Heuristic Analysis
          </h2>
          <div className="flex flex-col gap-5">
            {HEURISTICS.map((h, i) => (
              <div key={i} className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: CARD_BG }}>
                <div className="flex items-start gap-4 mb-5">
                  <span
                    className="font-lexend font-black text-3xl md:text-4xl leading-none"
                    style={{ color: PRIMARY, opacity: 0.18 }}
                  >
                    {h.num}
                  </span>
                  <h3 className="font-lexend font-bold text-sm md:text-base pt-1" style={{ color: PRIMARY }}>{h.title}</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 rounded-xl p-4 bg-white/70 flex gap-3">
                    <span className="shrink-0 font-bold text-sm" style={{ color: '#c0392b' }}>✗</span>
                    <p className="font-lexend text-xs leading-relaxed" style={{ color: 'rgba(0,98,156,0.75)' }}>{h.bad}</p>
                  </div>
                  <div className="flex-1 rounded-xl p-4 bg-white/70 flex gap-3">
                    <span className="shrink-0 font-bold text-sm" style={{ color: '#27ae60' }}>✓</span>
                    <p className="font-lexend text-xs leading-relaxed" style={{ color: 'rgba(0,98,156,0.75)' }}>{h.good}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customization Screen Redesign */}
        <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: YELLOW_BG }}>
          <div className="px-6 md:px-10 py-8 md:py-10">
            <p className="font-lexend text-xs font-bold uppercase tracking-widest mb-2" style={{ color: YELLOW }}>Redesign</p>
            <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
              Customization Screen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* Left: improvements + flow */}
              <div className="flex flex-col gap-7">
                <div>
                  <h3 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-4">Key Improvements</h3>
                  <ul className="flex flex-col gap-3">
                    {IMPROVEMENTS.map((imp, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white font-bold"
                          style={{ backgroundColor: YELLOW, fontSize: '10px' }}
                        >
                          {i + 1}
                        </span>
                        <span className="font-lexend text-sm text-[rgba(51,78,111,0.8)] leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-lexend font-bold text-xs uppercase tracking-widest text-[#334e6f] mb-4">User Flow</h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    {FLOW.map((step, i) => (
                      <Fragment key={i}>
                        <span
                          className="font-lexend text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          {step}
                        </span>
                        {i < FLOW.length - 1 && (
                          <span className="font-lexend text-xs text-[rgba(51,78,111,0.35)]">→</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: redesigned screen in phone frame */}
              <div className="flex justify-center items-start">
                <div
                  className="shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
                  style={{
                    width: 'min(340px, 100%)',
                    aspectRatio: '9 / 19.5',
                    borderRadius: '36px',
                    border: '10px solid #1c1c2e',
                    backgroundColor: '#1c1c2e',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imgRedesign}
                    alt="Redesigned customization screen"
                    draggable={false}
                    className="w-full h-full block"
                    style={{ objectFit: 'cover', objectPosition: 'top', borderRadius: '26px' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Reflection */}
        <section className="rounded-2xl p-8 md:p-14" style={{ backgroundColor: PRIMARY }}>
          <h2 className="font-lexend font-black text-white text-2xl md:text-[36px] leading-none mb-10">
            Reflection
          </h2>
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col gap-1 text-center">
                <span
                  className="font-lexend font-black text-white leading-none"
                  style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}
                >
                  {s.value}
                </span>
                <span className="font-lexend text-white/60 text-xs leading-relaxed whitespace-pre-line">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="font-lexend text-white/85 text-sm md:text-base leading-relaxed">
            This heuristic evaluation reinforced how small friction points compound into a frustrating experience.
            A missing reset button, static calorie counts, and unclear feedback each seem minor in isolation — together
            they erode user trust. The redesign focused on three principles: give users the feedback they need, the
            control they want, and a path that feels intuitive from first tap to checkout.
          </p>
        </section>

        {/* Prototype */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Prototype
          </h2>
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
            style={{ paddingBottom: '56.25%' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
              src="https://embed.figma.com/proto/Y9mDHvx9D8oWSSUZIHH9KH/Nathan--Cami--Maya---Dutch-Bros-Redesign?node-id=1-4&scaling=scale-down&content-scaling=fixed&page-id=1%3A2&starting-point-node-id=1%3A4&embed-host=share"
              allowFullScreen
            />
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="py-10 flex justify-center" style={{ backgroundColor: PRIMARY }}>
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

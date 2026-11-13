import { useEffect } from 'react'
import Plot from './graveyard/Plot'

// Subscription Graveyard: case study for the subscription app (Figma design + working demo app).
// Styled in the app's own brand: Bagel Fat One / DM Sans / Space Mono on Bone, Ink and Grave Plum.

const C = {
  ink: '#1E1B2E', plum: '#3B2F5C', bone: '#F6F1E7', paper: '#FFFFFF', stone: '#C9C4D6',
  dirt: '#6B4A3A', moss: '#7FD67A', pumpkin: '#FF8A3D', blush: '#FF9EC4', candle: '#FFD166',
}
const DISPLAY = "'Bagel Fat One', 'Arial Rounded MT Bold', system-ui, sans-serif"
const BODY = "'DM Sans', system-ui, -apple-system, sans-serif"
const MONO = "'Space Mono', ui-monospace, Menlo, monospace"
const BONE_TXT = 'rgba(246,241,231,0.82)'
const INK_TXT = 'rgba(30,27,46,0.78)'

const Kicker = ({ children, night }) => (
  <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3" style={{ fontFamily: MONO, color: night ? C.candle : C.dirt }}>{children}</p>
)
const H2 = ({ children, night }) => (
  <h2 className="text-[32px] md:text-[48px] leading-[1.05] mb-6" style={{ fontFamily: DISPLAY, color: night ? C.bone : C.ink, textWrap: 'balance' }}>{children}</h2>
)
const Body = ({ children, night, className = '' }) => (
  <p className={`text-base md:text-lg leading-relaxed ${className}`} style={{ fontFamily: BODY, color: night ? BONE_TXT : INK_TXT }}>{children}</p>
)

const Phone = ({ src, alt, night, className = '', style }) => (
  <img src={src} alt={alt} className={`block h-auto rounded-[28px] ${className}`}
    style={{ boxShadow: night ? '0 0 0 2px rgba(201,196,214,0.4), 0 18px 40px -14px rgba(0,0,0,0.55)' : '0 16px 40px -16px rgba(30,27,46,0.45)', ...style }} />
)

// The ground Plot lives in: a dirt mound with grass, used along the bottom of the hero
function Ground() {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[56px] md:h-[90px]" aria-hidden="true">
      <path d="M0 40 C 240 10, 480 10, 720 28 S 1200 50, 1440 18 L 1440 90 L 0 90 Z" fill={C.dirt} stroke={C.ink} strokeWidth="4" />
      {[[120, 26], [410, 18], [690, 26], [980, 34], [1290, 24]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y + 6} l4 -16 l4 12 l5 -18 l3 20`} stroke={C.moss} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
      {[[260, 60], [560, 70], [860, 62], [1120, 72], [1360, 64]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="#8C6550" />)}
    </svg>
  )
}

const GAP = [
  ['Content', 'Money apps are spreadsheets with a logo.', 'Rocket Money, Monarch and Copilot are good at finding subscriptions, but they’re one tab inside a big finance tool.'],
  ['Sleepy', 'Cancelling has no payoff.', 'Once something is cancelled it disappears. Nobody shows the money you kept.'],
  ['Resurrected', 'Nobody tracks the comeback.', 'People cancel and re-subscribe on repeat. No app logs it, so the pattern stays hidden.'],
]

const STEPS = [
  ['/graveyard/screen-plot-found.png', 'Find them', 'Link a bank and Plot reads a year of charges, keeping only the ones that repeat. You remove anything that isn’t a subscription.'],
  ['/graveyard/screen-check-in-swipe.png', 'Check in once a month', 'On the 1st, swipe through each subscription and say how much you used it. It takes about two minutes.'],
  ['/graveyard/screen-shall-we-sheet.png', 'Bury the ones you don’t use', 'Plot opens the service’s own cancel page, then asks if it worked before it digs a grave.'],
  ['/graveyard/screen-graveyard.png', 'Watch the savings', 'Every cancelled subscription gets a tombstone and counts toward what you’ve saved. Bring one back and it’s logged.'],
]

const MOODS = [
  ['Content', 'Default', 'Dashboard, empty states, onboarding.', C.moss],
  ['Sleepy', 'Sleepy', 'A subscription you haven’t touched in a while.', C.stone],
  ['Alarmed', 'Alarmed', 'A free trial about to charge you.', C.pumpkin],
  ['Resurrected', 'Resurrected', 'Something you brought back.', C.candle],
]

const SWATCHES = [
  ['Midnight Ink', '#1E1B2E'], ['Grave Plum', '#3B2F5C'], ['Bone', '#F6F1E7'], ['Tombstone', '#C9C4D6'], ['Fresh Dirt', '#6B4A3A'],
  ['Money Moss', '#7FD67A'], ['Pumpkin Alarm', '#FF8A3D'], ['Ghost Blush', '#FF9EC4'], ['Candlelight', '#FFD166'], ['Paper', '#FFFFFF'],
]

const PROCESS = [
  ['Three ideas', 'I explored three concepts: a leftovers kitchen companion, a way to bury browser tabs, and a subscription graveyard. The graveyard had the clearest problem and the most room for a personality.'],
  ['Research', 'I compared six apps that handle subscriptions or money habits, plus Duolingo as a reference for a mascot and a small monthly ritual.'],
  ['System flow', 'I mapped seven lanes: first launch, the monthly check-in, cost per use, trial alerts, burying, the Graveyard, and what the app does behind the scenes.'],
  ['Wireframes', 'Ten grayscale screens to test the flow before any color, from the dashboard to the resurrection log.'],
  ['Branding', 'Plot, the tombstone mascot, sets the tone: a little morbid, deadpan, never shaming. Four moods cover every state in the app.'],
  ['Final screens and prototype', '28 screens in Figma built from a shared component set, linked into a clickable prototype.'],
  ['A working app', 'I turned the design into an app you can add to a phone’s home screen, built with Claude (an AI assistant). It connects to a demo bank through Plaid’s test mode, so no real bank data is used, and its cancel buttons open each service’s real account page.'],
]

const DETAILS = [
  ['Project', 'Project 2, Part 2'],
  ['Type', 'Mobile app'],
  ['Year', '2026'],
  ['Tools', 'Figma, HTML, CSS, JavaScript, Plaid (test mode)'],
  ['Screens', '28'],
]

const TAGS = [['Mobile App', C.moss], ['Branding', C.blush], ['UX / UI', C.candle]]

export default function SubscriptionGraveyardModal({ onClose }) {
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
    <div className="graveyard-cs fixed inset-0 z-50 overflow-y-auto" style={{ background: C.bone, color: C.ink }}>

      {/* Sticky nav (same as the other case studies) */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity">
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero: the wordmark, and three screens planted in the dirt */}
      <header className="relative overflow-hidden" style={{ background: C.plum }}>
        <div className="cs-container relative z-10 grid md:grid-cols-[1fr_1.05fr] items-center gap-10 md:gap-6 pt-16 md:pt-24 pb-0">
          <div className="text-center md:text-left">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-5" style={{ fontFamily: MONO, color: C.stone }}>Project 2, Part 2</p>
            <h1 className="leading-[0.92] mb-6" style={{ fontFamily: DISPLAY, fontWeight: 400 }}>
              <span className="block text-[44px] md:text-[64px]" style={{ color: C.blush }}>subscription</span>
              <span className="block text-[60px] md:text-[88px]" style={{ color: C.bone }}>graveyard</span>
            </h1>
            <Body night className="max-w-md mx-auto md:mx-0 mb-7">An app that finds your subscriptions, asks once a month if they were worth it, and helps you cancel the ones that weren’t.</Body>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {TAGS.map(([tag, bg]) => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: BODY, background: bg, color: C.ink, border: `2px solid ${C.ink}` }}>{tag}</span>
              ))}
            </div>
            <div className="hidden md:block mt-10 gy-bob" style={{ width: 120 }}><Plot mood="Content" size={120} /></div>
          </div>
          {/* Three phones, fanned, sinking into the ground */}
          <div className="relative h-[360px] md:h-[560px]">
            <Phone night src="/graveyard/screen-check-in-swipe.png" alt="Monthly check-in" className="absolute w-[34%] md:w-[38%] left-[2%] top-[22%]" style={{ transform: 'rotate(-8deg)' }} />
            <Phone night src="/graveyard/screen-graveyard.png" alt="The Graveyard" className="absolute w-[34%] md:w-[38%] right-[2%] top-[22%]" style={{ transform: 'rotate(8deg)' }} />
            <Phone night src="/graveyard/screen-dashboard.png" alt="Dashboard: this month’s total, the check-in banner, a free trial warning and the subscription list" className="absolute w-[38%] md:w-[42%] left-1/2 -translate-x-1/2 top-[6%] z-10" />
          </div>
        </div>
        <Ground />
      </header>

      {/* The problem, with Plot's own deadpan */}
      <section className="cs-container py-16 md:py-24 grid md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 items-center">
        <div>
          <Kicker>The problem</Kicker>
          <H2>Everyone tracks what you pay. Nobody asks if it was worth it.</H2>
          <Body>Subscriptions are easy to start and easy to forget. Free trials turn into charges, and services you stopped using keep billing every month.</Body>
        </div>
        <figure className="m-0">
          <div className="rounded-[24px] p-6 md:p-7 relative" style={{ background: C.paper, border: `3px solid ${C.ink}` }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-2" style={{ fontFamily: BODY, color: C.dirt }}>Cost per use · Netflix</p>
            <p className="text-[26px] md:text-[30px] font-bold mb-3" style={{ fontFamily: MONO, color: C.ink }}>$8.00 / show</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: MONO, color: C.plum }}>“You paid $15.99 for Netflix and watched twice. That’s $8 a show.”</p>
            <div className="h-3 rounded-full mt-5 overflow-hidden" style={{ background: C.stone }}><div className="h-full w-[22%] rounded-full" style={{ background: C.pumpkin }} /></div>
            <div className="absolute -top-12 -right-4"><Plot mood="Sleepy" size={96} /></div>
          </div>
          <figcaption className="text-sm mt-3" style={{ fontFamily: MONO, color: C.plum }}>From the cost-per-use screen.</figcaption>
        </figure>
      </section>

      {/* Research */}
      <section className="cs-container pb-16 md:pb-24">
        <Kicker>Research</Kicker>
        <H2>What other apps miss.</H2>
        <Body className="cs-solo">I looked at Rocket Money, Bobby, Monarch, Copilot, Apple and Google Play subscriptions, and Privacy.com. Three gaps came up.</Body>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-10">
          {GAP.map(([mood, t, d]) => (
            <div key={t} className="rounded-[24px] p-6 pt-5 flex flex-col" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
              <Plot mood={mood} size={72} />
              <h3 className="text-lg font-bold leading-snug mt-3" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
              <p className="text-base leading-relaxed mt-2" style={{ fontFamily: BODY, color: INK_TXT }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works: the Graveyard at night */}
      <section style={{ background: C.plum }}>
        <div className="cs-container py-16 md:py-24">
          <Kicker night>How it works</Kicker>
          <H2 night>Find, check in, bury.</H2>
          <div className="flex flex-col gap-12 md:gap-14 mt-10">
            {STEPS.map(([src, t, d], i) => (
              <div key={t} className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className="flex justify-center">
                  <Phone night src={src} alt={t} className="w-[56%] md:w-[44%]" />
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[56px] md:text-[72px] leading-none block mb-2" style={{ fontFamily: DISPLAY, color: C.pumpkin }}>{i + 1}</span>
                  <h3 className="text-[26px] md:text-[34px] leading-tight mb-3" style={{ fontFamily: DISPLAY, color: C.bone }}>{t}</h3>
                  <Body night className="max-w-md mx-auto md:mx-0">{d}</Body>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand, built live */}
      <section className="cs-container py-16 md:py-24">
        <Kicker>Brand</Kicker>
        <H2>Meet Plot.</H2>
        <Body className="cs-solo">Plot is a tombstone with a face, half-buried and a little dramatic. The tone is morbid and deadpan, but never shaming. Four moods cover every state in the app.</Body>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-10">
          {MOODS.map(([mood, name, use, color]) => (
            <div key={mood} className="rounded-[24px] overflow-hidden flex flex-col" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
              <div className="flex justify-center pt-5 pb-1" style={{ background: color === C.stone ? '#E7E3EF' : `${color}33` }}><Plot mood={mood} size={130} /></div>
              <div className="p-4 pt-3" style={{ borderTop: `2px solid ${C.ink}` }}>
                <p className="text-base font-bold" style={{ fontFamily: BODY, color: C.ink }}>{name}</p>
                <p className="text-sm leading-snug mt-1" style={{ fontFamily: BODY, color: INK_TXT }}>{use}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 md:gap-6 mt-5 md:mt-6">
          <div className="rounded-[24px] p-6" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-4" style={{ fontFamily: MONO, color: C.dirt }}>Color</p>
            <div className="grid grid-cols-5 gap-3">
              {SWATCHES.map(([name, hex]) => (
                <div key={name}>
                  <div className="aspect-square rounded-[14px]" style={{ background: hex, border: `2px solid ${C.ink}` }} />
                  <p className="text-[11px] md:text-xs font-medium mt-1.5 leading-tight" style={{ fontFamily: BODY, color: C.ink }}>{name}</p>
                  <p className="text-[10px] md:text-[11px]" style={{ fontFamily: MONO, color: C.plum }}>{hex}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] p-6 flex flex-col gap-4" style={{ background: C.ink, border: `2px solid ${C.ink}` }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.candle }}>Type</p>
            <div><p className="text-[40px] leading-none" style={{ fontFamily: DISPLAY, color: C.bone }}>Shall we?</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>Bagel Fat One · headlines</p></div>
            <div><p className="text-lg font-medium" style={{ fontFamily: BODY, color: C.bone }}>Next charge in 6 days</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>DM Sans · interface</p></div>
            <div><p className="text-base" style={{ fontFamily: MONO, color: C.moss }}>$8.00 / show</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>Space Mono · Plot’s voice</p></div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="cs-container pb-16 md:pb-24">
        <Kicker>Process</Kicker>
        <H2>How it came together.</H2>
        <div className="flex flex-col mt-4">
          {PROCESS.map(([t, d], i) => (
            <div key={t} className="grid gap-4 md:gap-6 py-6" style={{ gridTemplateColumns: '48px 1fr', borderTop: `2px solid ${C.stone}` }}>
              <span className="text-[30px] leading-none" style={{ fontFamily: DISPLAY, color: C.pumpkin }}>{i + 1}</span>
              <div>
                <h3 className="text-lg md:text-xl font-bold" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
                <p className="text-base leading-relaxed mt-1 cs-solo" style={{ fontFamily: BODY, color: INK_TXT }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        <figure className="m-0 mt-12">
          <img src="/graveyard/system-flow.png" alt="The system flow: seven lanes from first launch to behind the scenes" className="w-full rounded-[24px] block" style={{ border: `2px solid ${C.ink}` }} />
          <figcaption className="text-sm mt-3" style={{ fontFamily: MONO, color: C.plum }}>The system flow. Each box is tagged with the screen it belongs to.</figcaption>
        </figure>

        <div className="rounded-[28px] mt-12 px-6 py-10 md:py-12" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8 max-w-[640px] mx-auto">
            <figure className="m-0">
              <Phone src="/graveyard/lofi-dashboard.png" alt="The grayscale wireframe of the dashboard" className="w-full" />
              <figcaption className="text-sm mt-3 text-center" style={{ fontFamily: MONO, color: C.plum }}>Wireframe</figcaption>
            </figure>
            <span className="text-[28px] md:text-[40px]" style={{ fontFamily: DISPLAY, color: C.pumpkin }} aria-hidden="true">→</span>
            <figure className="m-0">
              <Phone src="/graveyard/screen-dashboard.png" alt="The final dashboard" className="w-full" />
              <figcaption className="text-sm mt-3 text-center" style={{ fontFamily: MONO, color: C.plum }}>Final</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Details */}
      <section style={{ background: C.ink }}>
        <div className="cs-container py-12 md:py-16 grid grid-cols-2 md:grid-cols-[repeat(5,auto)] md:justify-between gap-8">
          {DETAILS.map(([k, v]) => (
            <div key={k}>
              <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.candle }}>{k}</p>
              <p className="font-medium text-base mt-1 max-w-[220px]" style={{ fontFamily: BODY, color: C.bone }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="text-center pb-14">
          <button onClick={onClose} className="text-sm font-medium px-6 py-3 rounded-full hover:opacity-85 transition-opacity" style={{ fontFamily: BODY, background: C.bone, color: C.ink }}>← Back to Work</button>
        </div>
      </section>
    </div>
  )
}

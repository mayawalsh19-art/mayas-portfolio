import { useEffect } from 'react'

// Subscription Graveyard: case study for the subscription app (Figma design + working demo app).
// Styled in the app's own brand: Bagel Fat One / DM Sans / Space Mono on Bone, Ink and Grave Plum.

const C = {
  ink: '#1E1B2E', plum: '#3B2F5C', bone: '#F6F1E7', paper: '#FFFFFF', stone: '#C9C4D6',
  dirt: '#6B4A3A', moss: '#7FD67A', pumpkin: '#FF8A3D', blush: '#FF9EC4', candle: '#FFD166',
}
const DISPLAY = "'Bagel Fat One', 'Arial Rounded MT Bold', system-ui, sans-serif"
const BODY = "'DM Sans', system-ui, -apple-system, sans-serif"
const MONO = "'Space Mono', ui-monospace, Menlo, monospace"

function Section({ kicker, title, night, children }) {
  return (
    <section className="cs-container py-12 md:py-16">
      {kicker && <p className="text-[13px] font-bold uppercase tracking-[0.06em] mb-3" style={{ fontFamily: MONO, color: night ? C.candle : C.dirt }}>{kicker}</p>}
      {title && <h2 className="text-[30px] md:text-[44px] leading-[1.08] mb-6" style={{ fontFamily: DISPLAY, color: night ? C.bone : C.ink, textWrap: 'balance' }}>{title}</h2>}
      {children}
    </section>
  )
}

const P = ({ children, night }) => (
  <p className="text-base md:text-lg leading-relaxed mb-4 cs-solo" style={{ fontFamily: BODY, color: night ? 'rgba(246,241,231,0.85)' : 'rgba(30,27,46,0.85)' }}>{children}</p>
)

const Phone = ({ src, alt, night }) => (
  <img src={src} alt={alt} className="block w-full h-auto rounded-[28px]"
    style={{ boxShadow: night ? '0 0 0 2px rgba(201,196,214,0.45), 0 14px 34px -12px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(30,27,46,0.35)' }} />
)

const GAP = [
  ['Money apps are spreadsheets with a logo.', 'Rocket Money, Monarch and Copilot are good at finding subscriptions, but they’re one tab inside a big finance tool.', C.candle],
  ['Cancelling has no payoff.', 'Once something is cancelled it disappears. Nobody shows the money you kept.', C.moss],
  ['Nobody tracks the comeback.', 'People cancel and re-subscribe on repeat. No app logs it, so the pattern stays hidden.', C.blush],
]

const STEPS = [
  ['/graveyard/screen-plot-found.png', 'Find them', 'Link a bank and Plot reads a year of charges, keeping only the ones that repeat. You remove anything that isn’t a subscription.'],
  ['/graveyard/screen-check-in-swipe.png', 'Check in once a month', 'On the 1st, swipe through each subscription and say how much you used it. It takes about two minutes.'],
  ['/graveyard/screen-shall-we-sheet.png', 'Bury the ones you don’t use', 'Plot opens the service’s own cancel page, then asks if it worked before it digs a grave.'],
  ['/graveyard/screen-graveyard.png', 'Watch the savings', 'Every cancelled subscription gets a tombstone and counts toward what you’ve saved. Bring one back and it’s logged.'],
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
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity">
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero */}
      <div style={{ background: C.plum }}>
        <div className="flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.06em] mb-5" style={{ fontFamily: MONO, color: C.stone }}>Project 2, Part 2</p>
          <img src="/graveyard/logo-night.png" alt="Subscription Graveyard" className="w-[260px] md:w-[400px] h-auto mb-6" />
          <p className="text-base md:text-lg leading-relaxed max-w-xl mb-8" style={{ fontFamily: BODY, color: 'rgba(246,241,231,0.85)' }}>
            An app that finds your subscriptions, asks once a month if they were worth it, and helps you cancel the ones that weren’t.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {TAGS.map(([tag, bg]) => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: BODY, background: bg, color: C.ink }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero screens */}
      <div className="cs-container pt-12 md:pt-16">
        <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-[860px] mx-auto">
          <Phone src="/graveyard/screen-dashboard.png" alt="Dashboard: this month’s total, the check-in banner, a free trial warning and the subscription list" />
          <Phone src="/graveyard/screen-check-in-swipe.png" alt="Monthly check-in: a Netflix card to swipe and three rating options" />
          <Phone src="/graveyard/screen-graveyard.png" alt="The Graveyard: total saved and a grid of tombstones" />
        </div>
      </div>

      <Section kicker="The problem" title="Everyone tracks what you pay. Nobody asks if it was worth it.">
        <P>Subscriptions are easy to start and easy to forget. Free trials turn into charges, and services you stopped using keep billing every month.</P>
      </Section>

      <Section kicker="Research" title="What other apps miss.">
        <P>I looked at Rocket Money, Bobby, Monarch, Copilot, Apple and Google Play subscriptions, and Privacy.com. Three gaps came up.</P>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          {GAP.map(([t, d, color]) => (
            <div key={t} className="rounded-[24px] p-6 flex flex-col gap-3" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
              <span className="w-3 h-3 rounded-full" style={{ background: color, border: `2px solid ${C.ink}` }} />
              <h3 className="text-lg font-bold leading-snug" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
              <p className="text-base leading-relaxed" style={{ fontFamily: BODY, color: 'rgba(30,27,46,0.75)' }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works: the Graveyard at night */}
      <div style={{ background: C.plum }}>
        <Section kicker="How it works" title="Find, check in, bury." night>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STEPS.map(([src, t, d], i) => (
              <div key={t}>
                <Phone src={src} alt={t} night />
                <p className="text-[13px] font-bold uppercase tracking-[0.06em] mt-5" style={{ fontFamily: MONO, color: C.candle }}>Step {i + 1}</p>
                <h3 className="text-lg md:text-xl font-bold mt-1 leading-snug" style={{ fontFamily: BODY, color: C.bone }}>{t}</h3>
                <p className="text-sm md:text-base leading-relaxed mt-2" style={{ fontFamily: BODY, color: 'rgba(246,241,231,0.75)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Brand */}
      <Section kicker="Brand" title="Meet Plot.">
        <P>Plot is a tombstone with a face. Plot shows up in four moods: content by default, sleepy for subscriptions you’ve stopped using, alarmed when a free trial is about to charge, and resurrected when something comes back.</P>
        <img src="/graveyard/brand-logo-and-plot.png" alt="The Subscription Graveyard logo in day and night versions, the app icon, and Plot’s four moods" className="w-full rounded-[24px] block mt-6" style={{ border: `2px solid ${C.ink}` }} />
        <img src="/graveyard/brand-color.png" alt="The color palette: Midnight Ink, Grave Plum, Bone, Paper, Tombstone, Fresh Dirt, Money Moss, Pumpkin Alarm, Ghost Blush and Candlelight" className="w-full rounded-[24px] block mt-6" style={{ border: `2px solid ${C.ink}` }} />
      </Section>

      {/* Process */}
      <Section kicker="Process" title="How it came together.">
        <div className="flex flex-col">
          {PROCESS.map(([t, d], i) => (
            <div key={t} className="grid gap-4 py-6" style={{ gridTemplateColumns: '44px 1fr', borderTop: `1.5px solid ${C.stone}` }}>
              <span className="text-[28px] leading-none" style={{ fontFamily: DISPLAY, color: C.pumpkin }}>{i + 1}</span>
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
                <p className="text-base leading-relaxed mt-1 cs-solo" style={{ fontFamily: BODY, color: 'rgba(30,27,46,0.75)' }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <img src="/graveyard/system-flow.png" alt="The system flow: seven lanes from first launch to behind the scenes" className="w-full rounded-[24px] block" style={{ border: `2px solid ${C.ink}` }} />
          <p className="text-sm mt-3" style={{ fontFamily: MONO, color: C.plum }}>The system flow. Each box is tagged with the screen it belongs to.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-[560px] mx-auto mt-12">
          {[['/graveyard/lofi-dashboard.png', 'The grayscale wireframe of the dashboard', 'Wireframe'], ['/graveyard/screen-dashboard.png', 'The final dashboard', 'Final']].map(([src, alt, label]) => (
            <div key={label}>
              <Phone src={src} alt={alt} />
              <p className="text-sm mt-3 text-center" style={{ fontFamily: MONO, color: C.plum }}>{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Details */}
      <div className="cs-container py-12 md:py-16 grid grid-cols-2 md:grid-cols-3 gap-8" style={{ borderTop: `1.5px solid ${C.stone}` }}>
        {DETAILS.map(([k, v]) => (
          <div key={k}>
            <p className="text-[13px] font-bold uppercase tracking-[0.06em]" style={{ fontFamily: MONO, color: C.dirt }}>{k}</p>
            <p className="font-medium text-base mt-1" style={{ fontFamily: BODY, color: C.ink }}>{v}</p>
          </div>
        ))}
      </div>

      <div className="text-center pb-16">
        <button onClick={onClose} className="text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity" style={{ fontFamily: BODY, color: C.ink, border: `2px solid ${C.ink}` }}>← Back to Work</button>
      </div>
    </div>
  )
}

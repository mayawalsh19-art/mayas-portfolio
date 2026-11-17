import { useEffect, useRef, useState } from 'react'
import Plot from './graveyard/Plot'
import { Ghost, Bat, Zombie, Cobweb, Candle, MoonStars, Fence, IronFence, EventIcon, Particle } from './graveyard/Cast'

// Subscription Graveyard: case study for the subscription app (Figma design + working demo app).
// Styled in the app's own brand: Bagel Fat One / DM Sans / Space Mono on Bone, Ink and Grave Plum.
// Motion lives in index.css (gy-* classes) and switches off with prefers-reduced-motion.

const C = {
  ink: '#1E1B2E', plum: '#3B2F5C', bone: '#F6F1E7', paper: '#FFFFFF', stone: '#C9C4D6',
  dirt: '#6B4A3A', moss: '#7FD67A', pumpkin: '#FF8A3D', blush: '#FF9EC4', candle: '#FFD166',
}
const DISPLAY = "'Bagel Fat One', 'Arial Rounded MT Bold', system-ui, sans-serif"
const BODY = "'DM Sans', system-ui, -apple-system, sans-serif"
const MONO = "'Space Mono', ui-monospace, Menlo, monospace"
const BONE_TXT = 'rgba(246,241,231,0.82)'
const INK_TXT = 'rgba(30,27,46,0.78)'

// Fades a block up the first time it scrolls into view
function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <Tag ref={ref} className={`gy-reveal ${inView ? 'gy-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>
}

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
  <img src={src} alt={alt} draggable="false" className={`block h-auto rounded-[28px] select-none ${className}`}
    style={{ boxShadow: night ? '0 0 0 2px rgba(201,196,214,0.4), 0 18px 40px -14px rgba(0,0,0,0.55)' : '0 16px 40px -16px rgba(30,27,46,0.45)', ...style }} />
)

// The ground Plot lives in: a dirt mound with grass, used along the bottom of the hero
function Ground() {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[56px] md:h-[90px] z-20 pointer-events-none" aria-hidden="true">
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
  ['/graveyard/screen-spot-the-ghosts.png', 'Find them', 'Link a bank and Plot finds everything you pay for every month. Free trials show up as ghosts, and add-ons sit inside the subscription they belong to.'],
  ['/graveyard/screen-check-in-swipe.png', 'Check in once a month', 'On the 1st, swipe through each subscription and say how much you used it. It takes about two minutes.'],
  ['/graveyard/screen-verdict.png', 'Get the verdict', 'Plot sorts everything into worth it, on thin ice and shall we, and adds up what burying the last group would save.'],
  ['/graveyard/screen-shall-we-sheet.png', 'Bury the ones you don’t use', 'Plot opens the service’s own cancel page, then asks if it worked before it digs a grave.'],
  ['/graveyard/screen-cheaper-plans.png', 'Pay less for the rest', 'For what you keep, Plot finds cheaper ways to pay: student and teacher discounts, things you pay for twice, yearly plans, plans with ads and bundles. Tap Switch and it walks you through it.'],
  ['/graveyard/screen-graveyard.png', 'Watch the savings', 'Every cancelled subscription gets a tombstone and counts toward what you’ve saved. Bring one back and it’s logged.'],
]

const STRIP = [
  ['/graveyard/screen-dashboard.png', 'Dashboard'], ['/graveyard/screen-spot-the-ghosts.png', 'Spot the ghosts'], ['/graveyard/screen-discounts-and-deals.png', 'Any of these you?'],
  ['/graveyard/screen-check-in-swipe.png', 'Check-in'], ['/graveyard/screen-verdict.png', 'The verdict'], ['/graveyard/screen-cheaper-plans.png', 'Cheaper plans'],
  ['/graveyard/screen-switched.png', 'Switched'], ['/graveyard/screen-rest-in-peace-bats.png', 'Rest in peace'], ['/graveyard/screen-graveyard.png', 'The Graveyard'],
  ['/graveyard/screen-zombie-comeback.png', 'It’s back'], ['/graveyard/screen-the-log.png', 'The log'], ['/graveyard/screen-search-and-add.png', 'Search and add'],
]

// Round two: what changed after using the working app every day
const ROUND_TWO = [
  ['/graveyard/screen-spot-the-ghosts.png', 'Free trials are ghosts', 'Toggles confused people, so trials became ghosts: tap anything that’s still free and it floats up with a countdown. Trials Plot finds in your bank are already ghosts.'],
  ['/graveyard/screen-search-and-add.png', 'Search, plans and add-ons', 'Search 34 popular services, pick your actual plan, and add what you bought inside it, like a Starz channel in Amazon Prime. Anything else can still be added by hand.'],
  ['/graveyard/screen-cheaper-plans.png', 'Cheaper plans, switched in the app', 'Tell Plot you’re a student, teacher or in the military and it checks your list. Every deal has a Switch button: Plot hands you to the service, asks if it worked, then updates the bill and counts what you saved.'],
  ['/graveyard/screen-zombie-comeback.png', 'The undead', 'Burying sends bats out of the grave, each service with its own effect: music notes for Spotify, falling boxes for Prime. Bring one back and a zombie in that service’s colors claws its way out.'],
]
const SIMPLER = ['Onboarding went from nine screens to five', 'The dashboard shows one alert at a time', 'Lists, the Graveyard and the log fold up when they get long', 'Every screen got a brand touch: moons, cobwebs, candles, fences']

const MOODS = [
  ['Content', 'Default', 'Dashboard, empty states, onboarding.', '#E5F6E4'],
  ['Sleepy', 'Sleepy', 'A subscription you haven’t touched in a while.', '#E7E3EF'],
  ['Alarmed', 'Alarmed', 'A free trial about to charge you.', '#FFE6D5'],
  ['Resurrected', 'Resurrected', 'Something you brought back.', '#FFF5DC'],
]

const SWATCHES = [
  ['Midnight Ink', '#1E1B2E'], ['Grave Plum', '#3B2F5C'], ['Bone', '#F6F1E7'], ['Tombstone', '#C9C4D6'], ['Fresh Dirt', '#6B4A3A'],
  ['Money Moss', '#7FD67A'], ['Pumpkin Alarm', '#FF8A3D'], ['Ghost Blush', '#FF9EC4'], ['Candlelight', '#FFD166'], ['Paper', '#FFFFFF'],
]

const SENDOFFS = [
  ['Spotify', 'note', '#1DB954', 'The music stopped.'], ['Disney+', 'star', '#7FD3FF', 'The fireworks are over.'], ['Amazon Prime', 'box', '#FF9900', 'Returned to sender.'],
  ['Peacock', 'feather', '#FF9EC4', 'Feathers ruffled.'], ['Duolingo', 'flame', '#58CC02', 'Streak: lost.'], ['Netflix', 'film', '#E50914', 'No more “are you still watching?”'],
]

const PROCESS = [
  ['Three ideas', 'I explored three concepts: a leftovers kitchen companion, a way to bury browser tabs, and a subscription graveyard. The graveyard had the clearest problem and the most room for a personality.'],
  ['Research', 'I compared six apps that handle subscriptions or money habits, plus Duolingo as a reference for a mascot and a small monthly ritual.'],
  ['System flow', 'I mapped the whole app in lanes: first launch, the monthly check-in, cost per use, trial alerts, burying, the Graveyard, what happens behind the scenes, settings, and later cheaper plans and switching.'],
  ['Wireframes', 'Ten grayscale screens to test the flow before any color, from the dashboard to the resurrection log.'],
  ['Branding', 'Plot, the tombstone mascot, sets the tone: a little morbid, deadpan, never shaming. Four moods cover every state in the app.'],
  ['Final screens and prototype', 'Screens in Figma built from a shared component set, linked into a clickable prototype.'],
  ['A working app', 'I turned the design into an app you can add to a phone’s home screen, built with Claude (an AI assistant). It links to a pretend bank, so no real bank data is used, and its cancel buttons open each service’s real account page.'],
  ['Round two', 'Living with the app led to a second pass: ghosts for free trials, add-ons, search, discounts, switching to cheaper plans, burial and comeback animations, and a simpler onboarding. Every change went back into Figma, which now has 38 screens and the new components.'],
]

const APP_URL = '/graveyard-app/'

const DETAILS = [
  ['Type', 'Mobile app'],
  ['Year', '2026'],
  ['Tools', 'Figma, HTML, CSS, JavaScript, Plaid (test mode)'],
  ['Screens', '38'],
]

const TAGS = [['Mobile App', C.moss], ['Branding', C.blush], ['UX / UI', C.candle]]

const Arrow = ({ dir, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} aria-label={dir < 0 ? 'Previous step' : 'Next step'}
    className="gy-btn w-12 h-12 rounded-full grid place-items-center text-xl disabled:opacity-30 disabled:pointer-events-none"
    style={{ background: C.bone, color: C.ink, border: `2px solid ${C.ink}`, fontFamily: BODY }}>
    {dir < 0 ? '‹' : '›'}
  </button>
)

// How it works: one step at a time. Arrows, step tabs, swipe and arrow keys all work.
function StepsCarousel() {
  const [i, setI] = useState(0)
  const start = useRef(null)
  const go = n => setI(Math.max(0, Math.min(STEPS.length - 1, n)))
  return (
    <div
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="How it works"
      onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
      onPointerDown={e => { start.current = e.clientX }}
      onPointerUp={e => { if (start.current === null) return; const dx = e.clientX - start.current; start.current = null; if (dx < -50) go(i + 1); if (dx > 50) go(i - 1) }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#FFD166] rounded-[24px]"
    >
      {/* Step tabs */}
      <div className="flex flex-wrap gap-2 mb-8 md:mb-10" role="tablist">
        {['Find', 'Check in', 'Verdict', 'Bury', 'Pay less', 'Save'].map((t, n) => (
          <button key={t} role="tab" aria-selected={n === i} onClick={() => setI(n)}
            className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
            style={{ fontFamily: BODY, background: n === i ? C.candle : 'transparent', color: n === i ? C.ink : C.bone, border: `2px solid ${n === i ? C.candle : 'rgba(201,196,214,0.5)'}` }}>
            <span style={{ fontFamily: MONO }}>{n + 1}</span>&nbsp; {t}
          </button>
        ))}
      </div>

      {/* Slides */}
      <div className="overflow-hidden">
        <div className="gy-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {STEPS.map(([src, t, d], n) => (
            <div key={t} className="w-full shrink-0 grid md:grid-cols-2 gap-8 md:gap-16 items-center" aria-hidden={n !== i}>
              <div className="flex justify-center">
                <Phone night src={src} alt={t} className="w-[58%] md:w-[52%]" style={{ transform: n === i ? 'none' : 'scale(.92)', transition: 'transform .55s cubic-bezier(.2,.8,.2,1)' }} />
              </div>
              <div className="text-center md:text-left">
                <span className="text-[64px] md:text-[96px] leading-none block mb-2" style={{ fontFamily: DISPLAY, color: C.pumpkin }}>{n + 1}</span>
                <h3 className="text-[28px] md:text-[40px] leading-tight mb-4" style={{ fontFamily: DISPLAY, color: C.bone }}>{t}</h3>
                <Body night className="max-w-md mx-auto md:mx-0">{d}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-10 md:mt-12">
        <Arrow dir={-1} onClick={() => go(i - 1)} disabled={i === 0} />
        <div className="flex gap-2" aria-hidden="true">
          {STEPS.map((_, n) => <span key={n} className="h-2 rounded-full transition-all duration-300" style={{ width: n === i ? 28 : 8, background: n === i ? C.candle : 'rgba(201,196,214,0.45)' }} />)}
        </div>
        {/* The counter hangs off the right edge so the buttons and dots stay exactly centered */}
        <div className="relative">
          <Arrow dir={1} onClick={() => go(i + 1)} disabled={i === STEPS.length - 1} />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 text-sm whitespace-nowrap" style={{ fontFamily: MONO, color: C.stone }}>{i + 1} / {STEPS.length}</span>
        </div>
      </div>
    </div>
  )
}

// Color swatch that copies its hex code when clicked
function Swatch({ name, hex }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(hex).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200) }).catch(() => {})
  }
  return (
    <button onClick={copy} className="gy-swatch text-left" aria-label={`Copy ${name} ${hex}`}>
      <div className="aspect-square rounded-[14px] grid place-items-center" style={{ background: hex, border: `2px solid ${C.ink}` }}>
        {copied && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ fontFamily: MONO, background: C.ink, color: C.bone }}>Copied</span>}
      </div>
      <p className="text-[11px] md:text-xs font-medium mt-1.5 leading-tight" style={{ fontFamily: BODY, color: C.ink }}>{name}</p>
      <p className="text-[10px] md:text-[11px]" style={{ fontFamily: MONO, color: C.plum }}>{hex}</p>
    </button>
  )
}

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
    <div className="graveyard-cs fixed inset-0 z-50 overflow-y-auto overflow-x-hidden" style={{ background: C.bone, color: C.ink }}>

      {/* Sticky nav (same as the other case studies) */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity">
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero: the wordmark, and three screens planted in the dirt */}
      <header className="relative overflow-hidden" style={{ background: C.plum }}>
        <div className="cs-container relative z-10 grid md:grid-cols-[1fr_1.05fr] items-center gap-10 md:gap-6 pt-16 md:pt-24 pb-6 md:pb-10">
          <Reveal className="text-center md:text-left">
            <h1 className="leading-[0.92] mb-6" style={{ fontFamily: DISPLAY, fontWeight: 400 }}>
              <span className="block text-[44px] md:text-[64px]" style={{ color: C.blush }}>subscription</span>
              <span className="block text-[60px] md:text-[88px]" style={{ color: C.bone }}>graveyard</span>
            </h1>
            <Body night className="max-w-md mx-auto md:mx-0 mb-7">An app that finds your subscriptions, asks once a month if they were worth it, helps you cancel the ones that weren’t, and finds a cheaper way to pay for the rest.</Body>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              {TAGS.map(([tag, bg]) => (
                <span key={tag} className="gy-btn text-xs font-medium px-3 py-1 rounded-full cursor-default" style={{ fontFamily: BODY, background: bg, color: C.ink, border: `2px solid ${C.ink}` }}>{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mt-8">
              <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="gy-btn text-sm font-medium px-5 py-2.5 rounded-full"
                style={{ fontFamily: BODY, background: C.candle, color: C.ink, border: `2px solid ${C.ink}` }}>Try the app ↗</a>
            </div>
            <p className="text-xs mt-3" style={{ fontFamily: MONO, color: C.stone }}>The app uses a pretend bank. No sign-up.</p>
          </Reveal>
          {/* Three phones, fanned, sinking into the ground. Hover fans them out. */}
          <Reveal delay={150} className="gy-fan relative h-[360px] md:h-[560px]">
            <Phone night src="/graveyard/screen-check-in-swipe.png" alt="Monthly check-in" className="gy-fan-l absolute w-[34%] md:w-[38%] left-[2%] top-[22%]" style={{ transform: 'rotate(-8deg)' }} />
            <Phone night src="/graveyard/screen-graveyard.png" alt="The Graveyard" className="gy-fan-r absolute w-[34%] md:w-[38%] right-[2%] top-[22%]" style={{ transform: 'rotate(8deg)' }} />
            <Phone night src="/graveyard/screen-dashboard.png" alt="Dashboard: this month’s total, the check-in banner, a free trial warning and the subscription list" className="gy-fan-c absolute w-[38%] md:w-[42%] left-1/2 top-[6%] z-10" style={{ transform: 'translateX(-50%)' }} />
          </Reveal>
        </div>
        <Ground />
        {/* Plot, planted in the dirt */}
        <div className="hidden md:block absolute z-30 gy-bob" style={{ left: '7%', bottom: 36, width: 110 }}><Plot mood="Content" size={110} /></div>
      </header>

      {/* The problem, with Plot's own deadpan */}
      <section className="cs-container py-16 md:py-24 grid md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 items-center">
        <Reveal>
          <Kicker>The problem</Kicker>
          <H2>Everyone tracks what you pay. Nobody asks if it was worth it.</H2>
          <Body>Subscriptions are easy to start and easy to forget. Free trials turn into charges, and services you stopped using keep billing every month.</Body>
        </Reveal>
        <Reveal delay={120} as="figure" className="m-0">
          <div className="gy-card gy-lift rounded-[24px] p-6 md:p-7 relative" style={{ background: C.paper, border: `3px solid ${C.ink}` }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-2" style={{ fontFamily: BODY, color: C.dirt }}>Cost per use · Netflix</p>
            <p className="text-[26px] md:text-[30px] font-bold mb-3" style={{ fontFamily: MONO, color: C.ink }}>$8.00 / show</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: MONO, color: C.plum }}>“You paid $15.99 for Netflix and watched twice. That’s $8 a show.”</p>
            <div className="h-3 rounded-full mt-5 overflow-hidden" style={{ background: C.stone }}><div className="h-full w-[22%] rounded-full" style={{ background: C.pumpkin }} /></div>
            <div className="absolute -top-12 -right-4 gy-wiggle"><Plot mood="Sleepy" size={96} /></div>
          </div>
          <figcaption className="text-sm mt-3" style={{ fontFamily: MONO, color: C.plum }}>From the cost-per-use screen.</figcaption>
        </Reveal>
      </section>

      {/* Research */}
      <section className="cs-container pb-16 md:pb-24">
        <Reveal>
          <Kicker>Research</Kicker>
          <H2>What other apps miss.</H2>
          <Body className="cs-solo">I looked at Rocket Money, Bobby, Monarch, Copilot, Apple and Google Play subscriptions, and Privacy.com. Three gaps came up.</Body>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-10">
          {GAP.map(([mood, t, d], n) => (
            <Reveal key={t} delay={n * 110}>
              <div className="gy-card gy-lift h-full rounded-[24px] p-6 pt-5 flex flex-col" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
                <div className="gy-wiggle" style={{ width: 72 }}><Plot mood={mood} size={72} /></div>
                <h3 className="text-lg font-bold leading-snug mt-3" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
                <p className="text-base leading-relaxed mt-2" style={{ fontFamily: BODY, color: INK_TXT }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works: a carousel, the Graveyard at night */}
      <section style={{ background: C.plum }}>
        <div className="cs-container pt-16 md:pt-24 pb-12 md:pb-16">
          <Reveal>
            <Kicker night>How it works</Kicker>
            <H2 night>Find, check in, bury, pay less.</H2>
          </Reveal>
          <Reveal delay={120}><StepsCarousel /></Reveal>
        </div>
        {/* Every key screen, drifting by. Hover to pause. */}
        <div className="pb-16 md:pb-24 overflow-hidden" aria-label="Final screens">
          <div className="gy-marquee gap-5 md:gap-7 py-4">
            {[...STRIP, ...STRIP].map(([src, label], n) => (
              <figure key={n} className="m-0 shrink-0 w-[130px] md:w-[180px]" aria-hidden={n >= STRIP.length}>
                <Phone night src={src} alt={label} className="w-full" />
                <figcaption className="text-xs text-center mt-3" style={{ fontFamily: MONO, color: C.stone }}>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Round two: features added after living with the working app */}
      <section className="cs-container py-16 md:py-24">
        <Reveal>
          <Kicker>Round two</Kicker>
          <H2>Then I used it.</H2>
          <Body className="cs-solo">Using the working app every day showed what was missing and what was too busy. I made a second round of changes in the app, then brought every one of them back into the Figma components and screens.</Body>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-10">
          {ROUND_TWO.map(([src, t, d], n) => (
            <Reveal key={t} delay={n * 90}>
              <div className="gy-card gy-lift h-full rounded-[24px] p-5 md:p-6 grid grid-cols-[38%_1fr] gap-5 items-center" style={{ background: n % 2 ? C.paper : C.ink, border: `2px solid ${C.ink}` }}>
                <Phone night={!(n % 2)} src={src} alt={t} className="w-full" />
                <div>
                  <h3 className="text-[22px] md:text-[26px] leading-tight mb-2" style={{ fontFamily: DISPLAY, color: n % 2 ? C.ink : C.bone }}>{t}</h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: BODY, color: n % 2 ? INK_TXT : BONE_TXT }}>{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-5 md:mt-6">
          <div className="rounded-[24px] p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5" style={{ background: C.candle, border: `2px solid ${C.ink}` }}>
            <div className="gy-wiggle shrink-0" style={{ width: 84 }}><Plot mood="Resurrected" size={84} /></div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-2" style={{ fontFamily: MONO, color: C.dirt }}>And it got simpler</p>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1.5">
                {SIMPLER.map(x => <li key={x} className="text-sm md:text-base flex gap-2" style={{ fontFamily: BODY, color: C.ink }}><svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0 mt-1" aria-hidden="true"><path d="M6 21V10a6 6 0 0 1 12 0v11z" fill={C.stone} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" /></svg>{x}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Brand, built live */}
      <section className="cs-container py-16 md:py-24">
        <Reveal>
          <Kicker>Brand</Kicker>
          <H2>Meet Plot.</H2>
          <Body className="cs-solo">Plot is a tombstone with a face, half-buried and a little dramatic. The tone is morbid and deadpan, but never shaming. Four moods cover every state in the app.</Body>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-10">
          {MOODS.map(([mood, name, use, tint], n) => (
            <Reveal key={mood} delay={n * 90}>
              <div className="gy-card gy-lift h-full rounded-[24px] overflow-hidden flex flex-col" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
                <div className="flex justify-center pt-5 pb-1" style={{ background: tint }}><div className="gy-wiggle"><Plot mood={mood} size={130} /></div></div>
                <div className="p-4 pt-3 flex-1" style={{ borderTop: `2px solid ${C.ink}` }}>
                  <p className="text-base font-bold" style={{ fontFamily: BODY, color: C.ink }}>{name}</p>
                  <p className="text-sm leading-snug mt-1" style={{ fontFamily: BODY, color: INK_TXT }}>{use}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 md:gap-6 mt-5 md:mt-6">
          <Reveal>
            <div className="h-full rounded-[24px] p-6" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.dirt }}>Color</p>
                <p className="text-xs" style={{ fontFamily: MONO, color: C.plum }}>Click a color to copy it</p>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {SWATCHES.map(([name, hex]) => <Swatch key={name} name={name} hex={hex} />)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-[24px] p-6 flex flex-col gap-4" style={{ background: C.ink, border: `2px solid ${C.ink}` }}>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.candle }}>Type</p>
              <div><p className="text-[40px] leading-none" style={{ fontFamily: DISPLAY, color: C.bone }}>Shall we?</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>Bagel Fat One · headlines</p></div>
              <div><p className="text-lg font-medium" style={{ fontFamily: BODY, color: C.bone }}>Next charge in 6 days</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>DM Sans · interface</p></div>
              <div><p className="text-base" style={{ fontFamily: MONO, color: C.moss }}>$8.00 / show</p><p className="text-xs mt-1" style={{ fontFamily: MONO, color: C.stone }}>Space Mono · Plot’s voice</p></div>
            </div>
          </Reveal>
        </div>

        {/* Plot's supporting cast: the newer brand pieces, drawn live */}
        <Reveal className="mt-14 md:mt-16">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3" style={{ fontFamily: MONO, color: C.dirt }}>The supporting cast</p>
          <Body className="cs-solo">Plot isn’t alone out there. Every piece has one job, and they all move a little.</Body>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-8">
          {[
            [C.plum, <div className="gy-bob"><Ghost size={70} /></div>, 'Ghost', 'A free trial. Not charging yet, but it will.', true],
            [C.plum, <div className="flex items-end gap-1"><Bat width={84} lead color="#1DB954" letter="S" /><div className="mb-6"><Bat width={52} /></div></div>, 'Bats', 'Burst out of the grave when you bury something. The lead bat wears the service’s color.', true],
            [C.bone, <div className="gy-lurch mt-3"><Zombie width={80} /></div>, 'Zombie', 'Claws out when you bring a subscription back, wearing it as a T-shirt.', false],
            [C.paper, <span className="relative grid place-items-center w-[60px] h-[60px] rounded-[18px] text-[28px]" style={{ background: C.stone, border: `3px solid ${C.ink}`, fontFamily: DISPLAY, color: C.ink }}>N<span className="absolute -top-1 -right-1"><Cobweb size={30} /></span></span>, 'Cobweb', 'Grows on anything you rated “barely used.” It’s gathering dust.', false],
            [C.paper, <Candle height={78} />, 'Candle', 'Kept lit next to the log, where Plot writes everything down.', false],
            [C.ink, <MoonStars width={150} />, 'Moon & stars', 'The night sky over every dark total. The stars twinkle.', true],
            [C.paper, <div className="flex gap-2"><EventIcon type="Buried" /><EventIcon type="Resurrected" /><EventIcon type="Switched" /></div>, 'Log icons', 'Buried, back from the dead, and switched to something cheaper.', false],
            [C.paper, <div className="flex items-center gap-2 gy-dig"><Plot mood="Content" size={74} /><svg width="22" height="44" viewBox="0 0 40 80" className="gy-shovel" aria-hidden="true"><rect x="18" y="2" width="4" height="46" rx="2" fill={C.dirt} stroke={C.ink} strokeWidth="2" /><rect x="12" y="2" width="16" height="6" rx="3" fill={C.dirt} stroke={C.ink} strokeWidth="2" /><path d="M10 48h20v14c0 8-4 14-10 16-6-2-10-8-10-16z" fill={C.stone} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" /></svg></div>, 'Plot digging', 'The loading state. Plot digs through a year of charges.', false],
          ].map(([bg, art, name, use, dark], n) => (
            <Reveal key={name} delay={(n % 4) * 80}>
              <div className="gy-card gy-lift h-full rounded-[24px] overflow-hidden flex flex-col" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
                <div className="h-[150px] grid place-items-center px-3" style={{ background: bg }}>{art}</div>
                <div className="p-4 pt-3 flex-1" style={{ borderTop: `2px solid ${C.ink}` }}>
                  <p className="text-base font-bold" style={{ fontFamily: BODY, color: C.ink }}>{name}</p>
                  <p className="text-sm leading-snug mt-1" style={{ fontFamily: BODY, color: INK_TXT }}>{use}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Fences that close a list, light and dark */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
          <Reveal>
            <div className="h-full rounded-[24px] p-6 flex flex-col justify-end gap-2" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
              <Fence />
              <p className="text-xs text-center" style={{ fontFamily: BODY, color: C.plum }}>That’s everything. Plot checked twice.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[24px] p-6 flex flex-col justify-end gap-2" style={{ background: C.plum, border: `2px solid ${C.ink}` }}>
              <IronFence />
              <p className="text-xs text-center" style={{ fontFamily: BODY, color: C.stone }}>Rest in peace. Your wallet thanks them.</p>
            </div>
          </Reveal>
        </div>

        {/* Each service gets its own send-off */}
        <Reveal className="mt-4 md:mt-5">
          <div className="rounded-[24px] p-6 md:p-7" style={{ background: C.ink, border: `2px solid ${C.ink}` }}>
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
              <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.candle }}>Every service gets its own send-off</p>
              <p className="text-xs" style={{ fontFamily: MONO, color: C.stone }}>Hover one</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {SENDOFFS.map(([name, shape, color, line]) => (
                <div key={name} className="gy-sendoff rounded-[18px] p-3 flex flex-col items-center text-center gap-2" style={{ background: C.plum }}>
                  <div className="relative h-[46px] w-full grid place-items-center">
                    {[0, 1, 2].map(k => <span key={k} className={`gy-pt gy-pt${k}`}><Particle shape={shape} color={color} size={k ? 18 : 26} /></span>)}
                  </div>
                  <p className="text-sm font-bold" style={{ fontFamily: BODY, color: C.bone }}>{name}</p>
                  <p className="text-[11px] leading-snug" style={{ fontFamily: MONO, color: C.blush }}>{line}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="cs-container pb-16 md:pb-24">
        <Reveal>
          <Kicker>Process</Kicker>
          <H2>How it came together.</H2>
        </Reveal>
        <div className="flex flex-col mt-4">
          {PROCESS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 60}>
              <div className="gy-row grid gap-4 md:gap-6 py-6 px-3 -mx-3" style={{ gridTemplateColumns: '48px 1fr', borderTop: `2px solid ${C.stone}` }}>
                <span className="gy-num text-[30px] leading-none" style={{ fontFamily: DISPLAY, color: C.pumpkin }}>{i + 1}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold" style={{ fontFamily: BODY, color: C.ink }}>{t}</h3>
                  <p className="text-base leading-relaxed mt-1 cs-solo" style={{ fontFamily: BODY, color: INK_TXT }}>{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="figure" className="m-0 mt-12">
          <img src="/graveyard/system-flow.png" alt="The system flow: nine lanes from first launch to cheaper plans and switching" className="w-full rounded-[24px] block" style={{ border: `2px solid ${C.ink}` }} />
          <figcaption className="text-sm mt-3" style={{ fontFamily: MONO, color: C.plum }}>The system flow. Each box is tagged with the screen it belongs to.</figcaption>
        </Reveal>

        <Reveal className="mt-12">
          <div className="rounded-[28px] px-6 py-10 md:py-12" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
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
        </Reveal>
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
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ fontFamily: MONO, color: C.candle }}>The app</p>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-base mt-1 inline-block underline underline-offset-4 hover:opacity-75" style={{ fontFamily: BODY, color: C.bone }}>Try it ↗</a>
          </div>
        </div>
        <div className="text-center pb-14">
          <button onClick={onClose} className="gy-btn text-sm font-medium px-6 py-3 rounded-full" style={{ fontFamily: BODY, background: C.bone, color: C.ink, border: `2px solid ${C.bone}` }}>← Back to Work</button>
        </div>
      </section>
    </div>
  )
}

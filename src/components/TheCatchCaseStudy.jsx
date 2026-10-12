import { useEffect, useRef, useState } from 'react'
import { CatchHero, CatchWordmark } from './CatchBrand'
import { TraitCardFront, TraitCardBack, StalkChip } from './CatchCards'
import { Doll, DOLL_BG } from './DollCharacters'
import { TRAIT_POOL, SCORE_TITLES, PLAYER_TYPES } from '../data/catchProfiles'

// The Catch — case study.
// Told as a story, shown with the real thing: screenshots of the actual app
// (public/thecatch/screens/) and the live-coded printed cards. Same visual
// rules as the game: sentence-case labels, no emoji, no glow, one button style.

// ─── Design tokens (mirror the game) ─────────────────────────────────────────
const C = {
  bg:      '#131011',
  panel:   '#0e0b12',
  card:    '#1E1A1B',
  cardAlt: '#2C2729',
  accent:  '#FF4D6D',
  teal:    '#7CE0A8',
  gold:    '#E4C46A',
  cream:   '#EFE6DC',
  velvet:  '#3B2E4A',
}
const ANTON = "'Anton', sans-serif"
const WS    = "'Work Sans', sans-serif"
const hair  = '1px solid rgba(239,230,220,0.08)'
const line  = '1px solid #3a3535'
const body  = 'rgba(239,230,220,0.72)'
const muted = 'rgba(239,230,220,0.5)'

const card = n => ({ no: n, ...TRAIT_POOL[n - 1] })
const TYPE_NAME = { romantic: 'Romantic', selective: 'Selective', chaotic: 'Chaotic', overthinker: 'Overthinker', avoidant: 'Avoidant', gold_digger: 'Gold Digger' }

// ─── Building blocks ──────────────────────────────────────────────────────────
// Layout rule for the whole case study:
//  · every section is the same width (CONTENT), so everything shares one left edge
//  · text beside an image fills its half of a two-column row (TwoCol)
//  · text on its own runs to TEXT_SOLO (wider, but still a comfortable line length)
//  · dividing lines span the full width of whatever they divide
const CONTENT = 1080
const TEXT_SOLO = 760
function Section({ children, id, style = {} }) {
  return (
    <section id={id} style={{ maxWidth: CONTENT, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </section>
  )
}

// Small sentence-case kicker + big Anton headline
function Head({ kicker, children, center = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 22 }}>
      {kicker && <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.accent, marginBottom: 10 }}>{kicker}</div>}
      <h2 style={{ fontFamily: ANTON, fontWeight: 400, color: C.cream, fontSize: 'clamp(34px,6vw,50px)', lineHeight: 1.08, margin: 0 }}>{children}</h2>
    </div>
  )
}

// Keep the last two words together so no line ends with a single word on its own
// (works in every browser; text-wrap: pretty below is a bonus where supported)
function tie(c) {
  if (typeof c === 'string') return c.replace(/ (\S+)$/, '\u00A0$1')
  if (Array.isArray(c) && typeof c[c.length - 1] === 'string') return [...c.slice(0, -1), tie(c[c.length - 1])]
  return c
}

function P({ children, style = {} }) {
  return <p style={{ fontFamily: WS, fontSize: 'clamp(15px,1.8vw,17px)', color: body, lineHeight: 1.7, margin: '0 0 16px', maxWidth: TEXT_SOLO, ...style }}>{tie(children)}</p>
}

function Small({ children, style = {} }) {
  return <div style={{ fontFamily: WS, fontSize: 13, color: muted, lineHeight: 1.55, ...style }}>{tie(children)}</div>
}

// A phone: the real screenshot in a simple rounded frame
function Phone({ src, alt, width = 250, children }) {
  return (
    <div style={{ width, maxWidth: '100%', padding: 7, borderRadius: 34, background: '#08060a', border: line, boxShadow: '0 30px 60px rgba(0,0,0,0.45)', flexShrink: 0, boxSizing: 'border-box' }}>
      {children
        ? <div style={{ width: '100%', aspectRatio: '393 / 852', borderRadius: 27, background: '#0e0b12', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>{children}</div>
        : <img src={src} alt={alt} style={{ display: 'block', width: '100%', aspectRatio: '393 / 852', objectFit: 'cover', borderRadius: 27 }} />}
    </div>
  )
}

// Draws a card at its normal width, then scales it down, so the type always fits the card
function Scaled({ w, base, children }) {
  return (
    <div style={{ width: w, height: w * 1.4, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: base, transform: `scale(${w / base})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

function Btn({ children, onClick, href, primary = false }) {
  const style = {
    fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', lineHeight: 1.3,
    minHeight: 50, padding: '12px 30px', borderRadius: 6, cursor: 'pointer', maxWidth: '100%', boxSizing: 'border-box',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', textDecoration: 'none',
    color: primary ? '#fff' : C.cream, background: primary ? C.accent : 'transparent',
    border: primary ? `1px solid ${C.accent}` : line,
  }
  return href ? <a href={href} download style={style}>{children}</a> : <button onClick={onClick} style={style}>{children}</button>
}

const Gap = ({ h = 120 }) => <div style={{ height: h }} />

// ─── MAIN ─────────────────────────────────────────────────────────────────────
// ─── How to play: a step-by-step carousel built from the game's own pieces ───
const dl = { fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.cream, textDecoration: 'none', padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(239,230,220,0.3)' }
const BAND = '#211928'
const tile = { background: C.card, border: hair, borderRadius: 12 }
const label = { fontFamily: WS, fontWeight: 600, fontSize: 13, color: C.accent }
const brandBtn = { fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', padding: '12px 30px', borderRadius: 6, textAlign: 'center' }   // dark velvet: sets the instructions apart from the rest of the case study

function ProfileCardMini() {
  return (
    <div style={{ width: 210, borderRadius: 14, overflow: 'hidden', border: hair, background: C.card, boxShadow: '0 20px 40px rgba(0,0,0,0.45)' }}>
      <div style={{ height: 230, background: DOLL_BG.nia, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ transform: 'scale(1.05)', transformOrigin: 'top center', marginTop: 6 }}><Doll name="nia" /></div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream }}>NIA, 26</div>
        <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 12, color: C.gold }}>The Romantic</div>
      </div>
    </div>
  )
}

const choice = (on) => ({ fontFamily: WS, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', padding: '16px 34px', borderRadius: 8, color: on ? '#fff' : C.cream, background: on ? C.accent : 'transparent', border: `1px solid ${on ? C.accent : 'rgba(239,230,220,0.35)'}` })

const HAND = [17, 10, 40, 48, 5, 7]     // the example hand: totals +7 (the −3 is the card peeked at in Stalk)

const STEPS = [
  ['Meet them', 'A new stranger is on the market. The phone shows who they are.', () => <ProfileCardMini />],
  ['Deal six cards', 'Two face-up, four face-down. Those six cards are this person.', () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {HAND.slice(0, 2).map(n => <div key={n} style={{ width: 118 }}><TraitCardFront text={card(n).text} value={card(n).value} /></div>)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 62 }}><TraitCardBack compact /></div>)}
      </div>
    </div>
  )],
  ['Stalk', 'Spend a chip to secretly peek at one face-down card. Put it back. Tell no one.', () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
      <StalkChip size={110} />
      <div style={{ position: 'relative', width: 150, height: 210 }}>
        <div style={{ position: 'absolute', width: 130, left: 0, top: 10, transform: 'rotate(-6deg)' }}><TraitCardBack /></div>
        <div style={{ position: 'absolute', width: 130, left: 26, top: 0, transform: 'rotate(7deg)' }}><TraitCardFront text={card(48).text} value={card(48).value} /></div>
      </div>
    </div>
  )],
  ['Date or ghost', 'On three, everyone says it out loud at the same time. Out of ghosts? You have to date.', () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: ANTON, fontSize: 44, color: 'rgba(239,230,220,0.35)', letterSpacing: '0.3em', marginBottom: 22 }}>3 · 2 · 1</div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        <span style={choice(true)}>DATE</span><span style={choice(false)}>GHOST</span>
      </div>
    </div>
  )],
  ['Flip and add up', 'Flip all six. If you dated, add them up using your player type and enter your total.', () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 84px)', gap: 8 }}>
        {HAND.map(n => <div key={n}><Scaled w={84} base={118}><TraitCardFront text={card(n).text} value={card(n).value} /></Scaled></div>)}
      </div>
      <div style={{ fontFamily: ANTON, fontSize: 30, color: C.teal, marginTop: 14 }}>
        = {(() => { const t = HAND.reduce((a, n) => a + card(n).value, 0); return t > 0 ? `+${t}` : t })()}
      </div>
    </div>
  )],
  ['See where you stand', 'The phone adds the bonuses, reveals any catfish and ranks everyone. Then the next stranger.', () => (
    <div style={{ width: 280 }}>
      {[['Maya', '+9', 'Dated alone: +7, Chemistry +2', C.gold], ['Lanie', '±0', 'Ghosted', C.cream], ['Jo', '±0', 'Ghosted', C.cream]].map(([name, pts, note, col], i) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 8, background: C.card, borderRadius: 8, border: i === 0 ? `1px solid ${C.gold}88` : hair }}>
          <span style={{ fontFamily: ANTON, fontSize: 18, color: i === 0 ? C.gold : '#777' }}>{i + 1}</span>
          <div><div style={{ fontFamily: ANTON, fontSize: 18, color: col }}>{name.toUpperCase()}</div><div style={{ fontFamily: WS, fontSize: 11, color: muted }}>{note}</div></div>
          <span style={{ fontFamily: ANTON, fontSize: 22, color: pts.startsWith('+') ? C.teal : pts.startsWith('±') ? muted : C.accent }}>{pts}</span>
        </div>
      ))}
    </div>
  )],
]

function StepCarousel() {
  const [i, setI] = useState(0)
  const touch = useRef(null)
  const go = (d) => setI(n => Math.min(STEPS.length - 1, Math.max(0, n + d)))
  const [title, text, Visual] = STEPS[i]
  const btn = (enabled) => ({ fontFamily: WS, fontWeight: 600, fontSize: 14, padding: '10px 18px', borderRadius: 6, cursor: enabled ? 'pointer' : 'default', color: enabled ? C.cream : '#555', background: 'transparent', border: `1px solid ${enabled ? 'rgba(239,230,220,0.3)' : 'rgba(239,230,220,0.1)'}` })
  return (
    <div tabIndex={0} aria-roledescription="carousel" aria-label="How a match works"
      onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      onTouchStart={e => { touch.current = e.touches[0].clientX }}
      onTouchEnd={e => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touch.current = null }}
      style={{ outline: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center', background: 'rgba(0,0,0,0.22)', border: hair, borderRadius: 16, padding: 'clamp(24px, 4vw, 44px)' }}>
      <div style={{ minHeight: 330, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Visual /></div>
      <div>
        <Small style={{ color: C.accent, fontWeight: 600, fontSize: 14 }}>{`Step ${i + 1} of ${STEPS.length}`}</Small>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(32px,5vw,44px)', color: C.cream, lineHeight: 1.05, margin: '6px 0 14px' }}>{title.toUpperCase()}</div>
        <P style={{ minHeight: 88 }}>{text}</P>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <button onClick={() => go(-1)} disabled={i === 0} style={btn(i > 0)}>← Back</button>
          <button onClick={() => go(1)} disabled={i === STEPS.length - 1} style={btn(i < STEPS.length - 1)}>Next →</button>
          <div style={{ display: 'flex', gap: 8, marginLeft: 6 }}>
            {STEPS.map((s, n) => (
              <button key={s[0]} onClick={() => setI(n)} aria-label={`Step ${n + 1}: ${s[0]}`}
                style={{ width: n === i ? 22 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer', background: n === i ? C.accent : 'rgba(239,230,220,0.25)', transition: 'width 0.2s' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TheCatchCaseStudy({ onClose, onPlay }) {

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
    <div className="catch-cs" style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: C.bg, fontFamily: WS }}>

      {/* no lone word on the last line: balance headings, "pretty" wrapping for everything else */}
      <style>{'@media (max-width: 420px) { .cs-wide-only { display: none } } @media (max-width: 760px) { .brand-grid > * { grid-column: 1 / -1 !important } } @media (max-width: 480px) { .cs-nav-links { position: static !important; transform: none !important; gap: 14px !important } .cs-nav-links button { font-size: 13px !important } .catch-cs nav { gap: 10px } } .catch-cs h1, .catch-cs h2 { text-wrap: balance } .catch-cs p, .catch-cs div { text-wrap: pretty }'}</style>
      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56, background: 'rgba(19,16,17,0.94)', backdropFilter: 'blur(8px)', borderBottom: hair }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 14, color: muted, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>← Back<span className="cs-wide-only"> to work</span></button>
        <div className="cs-nav-links" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 28 }}>
          {[['How to play', 'how-to-play'], ['Process', 'process']].map(([label, id]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.cream, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>{label}</button>
          ))}
        </div>
        <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', background: C.accent, border: 'none', borderRadius: 6, padding: '9px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>KEEP SCORE</button>
      </nav>

      {/* ── Hero ── */}
      <header style={{ textAlign: 'center', padding: '88px 16px 96px', borderBottom: hair }}>
        <CatchHero maxWidth={460} style={{ marginBottom: 30 }} />
        <p style={{ fontFamily: WS, fontSize: 'clamp(15px,2vw,18px)', color: C.cream, lineHeight: 1.55, maxWidth: 500, margin: '0 auto 34px' }}>
          A dating card game with a phone for a matchmaker. Read the flags, bluff the table, and find out who you really went home with.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>GRAB YOUR CARDS &amp; KEEP SCORE</Btn>
        </div>
        <Small style={{ marginTop: 16, fontSize: 14 }}>
          You play with the printed deck. The website keeps score. <a href="/thecatch/the-catch-print-deck-11x17.pdf" download style={{ color: C.cream }}>Print the&nbsp;deck</a>
        </Small>
      </header>

      <Gap h={110} />

      {/* ── Overview ── */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="Overview">Every date is a gamble.</Head>
            <P>The Catch is a dating card game for 2–6 friends. Each round you meet a stranger, deal six of their traits (two face-up, four face-down) and decide out loud whether to date or ghost them. I wanted the fun of sleepover games like Dream Phone and Mystery Date, made for a whole group of friends. The fun is the bluffing: you can secretly peek at one card, nobody knows what you saw, and one profile is a catfish.</P>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 420 }}>
            <Phone src="/thecatch/screens/profile.jpg" alt="The profile card screen" width="min(230px, 56vw)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginLeft: -26, marginBottom: 24, zIndex: 2 }}>
              <div style={{ width: 'min(128px, 31vw)', transform: 'rotate(5deg)' }}><TraitCardFront text={card(17).text} value={card(17).value} /></div>
              <div style={{ width: 'min(128px, 31vw)', transform: 'rotate(-3deg)', marginLeft: 'min(18px, 4vw)' }}><TraitCardBack /></div>
            </div>
          </div>
        </div>
      </Section>

      <Gap />

      {/* ── Inspiration ── */}
      <Section>
        <Head kicker="Inspiration">Sleepover games, for grown-ups.</Head>
        <P>Dream Phone and Mystery Date made dating into a party: friends crowded around one game, guessing who they'd end up with and laughing at the reveal. Newer dating games went another way, into long roleplay for just two people. I wanted that loud, together feeling back, with real secrets to bluff about.</P>
        {/* Each game: what it inspired, and the gap it leaves. Drop a photo into
            public/competitors/ and set img to show the real box instead of the title tile. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 10 }}>
          {[
            { name: 'Mystery Date', meta: '1965 · Milton Bradley', stats: '2–4 players', good: 'The reveal: open the door and see who your date is, or get the dud.', gap: 'All luck. Nothing to read or bluff about.', img: '/competitors/mystery-date.jpg' },
            { name: 'Dream Phone', meta: '1991 · Milton Bradley', stats: 'Electronic phone', good: 'Calling for clues to work out who has a crush on you, with friends listening in.', gap: 'One right answer, and the phone runs the whole game.', img: '/competitors/dream-phone.jpg' },
            { name: 'Fog of Love', meta: '2017 · Hush Hush Projects', stats: '2 players · 60–120 min', good: 'Hidden traits and real choices about a partner.', gap: 'Only two players, and a long, heavy session.', img: '/competitors/fog-of-love.jpg' },
          ].map(g => (
            <div key={g.name} style={{ background: C.card, border: hair, borderRadius: 10, overflow: 'hidden' }}>
              {g.img
                ? <img src={g.img} alt={`${g.name} box art`} style={{ width: '100%', height: 170, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                : <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', textAlign: 'center', background: `linear-gradient(135deg, #140a0e, ${g.tint})` }}><span style={{ fontFamily: ANTON, fontSize: 24, color: '#e8c4c4', letterSpacing: '0.1em', lineHeight: 1.1 }}>{g.name.toUpperCase()}</span></div>}
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ fontFamily: ANTON, fontSize: 21, color: C.cream }}>{g.name.toUpperCase()}</div>
                <Small style={{ marginTop: 2 }}>{g.meta} · {g.stats}</Small>
                <div style={{ fontFamily: WS, fontSize: 14, color: body, lineHeight: 1.6, marginTop: 12 }}><span style={{ color: C.teal, fontWeight: 600 }}>Inspired </span>{tie(g.good)}</div>
                <div style={{ fontFamily: WS, fontSize: 14, color: body, lineHeight: 1.6, marginTop: 6 }}><span style={{ color: C.accent, fontWeight: 600 }}>Gap </span>{tie(g.gap)}</div>
              </div>
            </div>
          ))}
        </div>
        <Small style={{ marginTop: 10, fontSize: 12 }}>Game images belong to their publishers.</Small>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '32px 0 10px' }}>THE EXPERIENCE I WANTED</div>
        <P>The reveal of Mystery Date, the guessing of Dream Phone and the hidden traits of Fog of Love, for a whole group at once. Everyone reads the same stranger, bluffs about what they peeked at, and finds out together who the catfish was.</P>
      </Section>

      <Gap />

      {/* ── How to play (its own band, so the instructions stand apart) ── */}
      <div id="how-to-play" style={{ background: BAND, borderTop: hair, borderBottom: hair, padding: '100px 0 110px', scrollMarginTop: 56 }}>
        <Section>
          <Head kicker="How to play">Seven matches. Six steps each.</Head>
          <P>2–6 players, 20–40 minutes, the deck and one phone. Every match is a new stranger and goes like this:</P>
          <div style={{ marginTop: 30 }}><StepCarousel /></div>

          <div style={{ fontFamily: ANTON, fontSize: 30, color: C.cream, margin: '80px 0 12px' }}>IT ALL COMES DOWN TO POINTS</div>
          <P>When you date, the six cards go on your score. Your player type changes what each card is worth, so one stranger can be a great date for you and a disaster for your friend.</P>
          <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '34px 0 14px' }}>PLAYER TYPES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {PLAYER_TYPES.map(t => (
              <div key={t.id} style={{ background: C.card, border: hair, borderRadius: 10, padding: '18px 20px' }}>
                <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 15, color: C.cream }}>{TYPE_NAME[t.id]}</div>
                <div style={{ fontFamily: WS, fontSize: 14, color: muted, marginTop: 4, lineHeight: 1.5 }}>{tie(t.rule)}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '40px 0 14px' }}>THE TWISTS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              ['Red flag', '−2', 'A date that totals −5 or worse costs 2 more.', C.accent],
              ['Chemistry', '+2', 'Total 7 or more as the only one who dated them.', C.teal],
              ['The catfish', '−4 / +1', 'One secret profile per game. Date it and lose 4, ghost it and gain 1.', C.gold],
              ['Ghosts', '3 each', 'Pass on a match for ±0. When they’re gone, you have to date.', C.cream],
            ].map(([n, v, d, col]) => (
              <div key={n} style={{ background: C.card, border: hair, borderRadius: 10, padding: '18px 20px' }}>
                <div style={{ fontFamily: ANTON, fontSize: 28, lineHeight: 1, color: col }}>{v}</div>
                <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 15, color: C.cream, marginTop: 12 }}>{n}</div>
                <div style={{ fontFamily: WS, fontSize: 14, color: muted, marginTop: 4, lineHeight: 1.5 }}>{tie(d)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
            {/* the winner card, as it appears in the game */}
            <div style={{ justifySelf: 'center', width: '100%', maxWidth: 340, textAlign: 'center', padding: '30px 24px', background: C.card, border: `1px solid ${C.gold}66`, borderRadius: 12 }}>
              <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.gold }}>Winner</div>
              <div style={{ fontFamily: ANTON, fontSize: 44, color: C.cream, lineHeight: 1, marginTop: 6 }}>MAYA</div>
              <div style={{ fontFamily: ANTON, fontSize: 28, color: C.accent, marginTop: 4 }}>THE CATCH</div>
              <div style={{ fontFamily: WS, fontSize: 13, color: muted, marginTop: 10 }}>{tie(SCORE_TITLES[0].desc)}</div>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 13, color: C.teal, marginTop: 10 }}>23 points</div>
            </div>
            <div>
              <div style={{ fontFamily: ANTON, fontSize: 30, color: C.cream, marginBottom: 12 }}>EVERYONE LEAVES WITH A TITLE</div>
              <P>After seven matches the highest score wins, and everyone gets a title to brag about (or screenshot).</P>
              <div style={{ marginTop: 10, borderTop: hair }}>
                {SCORE_TITLES.map((t, i) => (
                  <div key={t.title} style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 14, padding: '11px 0', borderBottom: hair, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: i === 0 ? C.gold : '#888' }}>
                      {i === 0 ? `${t.min}+` : t.min === -Infinity ? `${SCORE_TITLES[i - 1].min - 1} or less` : `${t.min}–${SCORE_TITLES[i - 1].min - 1}`}
                    </span>
                    <span style={{ fontFamily: ANTON, fontSize: 18, color: C.accent }}>{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* printable copies */}
          <div style={{ marginTop: 70, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: WS, fontWeight: 600, fontSize: 15, color: C.cream, marginRight: 6 }}>Print it yourself:</span>
            <a href="/thecatch/how-to-play.pdf" download style={dl}>How-to sheet (PDF)</a>
            <a href="/thecatch/the-catch-print-deck-11x17.pdf" download style={dl}>Print-and-play deck (PDF, 11 × 17)</a>
          </div>
        </Section>
      </div>

      <Gap />

      {/* ── The deck ── */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="The deck">The cards hold the secrets.</Head>
            <P>68 trait cards (green, yellow and red flags, plus 4 dealbreakers worth −10), 6 blanks to write your own, 30 stalk chips and a one-page how-to sheet that lives in the box. Print it at home and play.</P>
            <Small style={{ marginTop: 12 }}>Poker-size cards, 2.5 × 3.5 in.</Small>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {/* the how-to sheet that comes in the box, tucked behind the cards */}
            <img src="/thecatch/screens/howto.jpg" alt="The one-page how-to sheet in the box" style={{ position: 'absolute', width: '58%', right: '1%', top: '-14%', transform: 'rotate(8deg)', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', opacity: 0.9, zIndex: -1 }} />
            <TraitCardBack />
            <TraitCardFront text={card(10).text} value={card(10).value} />
            <TraitCardFront text={card(40).text} value={card(40).value} />
            <TraitCardFront text={card(48).text} value={card(48).value} />
            <TraitCardFront text={card(65).text} value={card(65).value} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><StalkChip size={92} /></div>
          </div>
        </div>
      </Section>

      <Gap />

      {/* ── Process ── */}
      <Section id="process" style={{ scrollMarginTop: 70 }}>
        <Head kicker="Process">How it evolved.</Head>
        <P>Every round of playtesting pushed it the same way: less phone, more cards.</P>
        <div style={{ margin: '28px 0 0' }}>
          {[
            ['Version 1', 'An app game', 'The phone did everything, and everyone stared at it.'],
            ['Version 2', 'Multiplayer only', 'Friends played together, but still passed the phone around.'],
            ['Version 3', 'The cards are the game', 'Dealing, peeking and saying Date or Ghost moved to the table.'],
            ['Version 4', 'Points only', 'One score instead of hearts, bonuses and badges.'],
            ['Version 5', 'One mode', 'The deck and one phone. Nothing else to learn.'],
          ].map(([v, t, d], i, arr) => (
            <div key={v} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: i === arr.length - 1 ? C.accent : C.bg, border: `2px solid ${C.accent}`, marginTop: 6 }} />
                {i < arr.length - 1 && <span style={{ flex: 1, width: 2, background: 'rgba(255,77,109,0.3)' }} />}
              </div>
              <div style={{ paddingBottom: 28 }}>
                <Small style={{ color: C.accent, fontWeight: 600 }}>{v}</Small>
                <div style={{ fontFamily: ANTON, fontSize: 24, color: C.cream, margin: '2px 0 6px' }}>{t.toUpperCase()}</div>
                <P style={{ marginBottom: 0 }}>{d}</P>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Gap />

      {/* ── Look and feel ── */}
      <Section>
        <Head kicker="Look and feel">After hours.</Head>
        <P>It should feel like a night out: dark backgrounds, one hot pink and loud type. Pink means a date, mint means a good sign and gold means you earned something.</P>
        {/* Brand board: a designed layout instead of a row of swatches.
            Desktop: 6-column grid (logo 4 + flags 2, palette strip, two type specimens, "in use").
            Phones: every tile full width (see .brand-grid in the style tag). */}
        <div className="brand-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginTop: 34 }}>
          {/* logo */}
          <div style={{ gridColumn: 'span 4', ...tile, minHeight: 340, padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(circle, rgba(239,230,220,0.07) 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
            <img src="/thecatch/brand/logo-full.svg" alt="The Catch logo" style={{ width: 'min(400px, 80%)' }} />
            <Small style={{ marginTop: 18 }}>The logo. A fishing hook through the A, because every date is a catch.</Small>
          </div>
          {/* colour meaning, applied */}
          <div style={{ gridColumn: 'span 2', ...tile, padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            <div style={label}>Color means something</div>
            {[['GREEN FLAG', '+1 to +3', C.teal, false], ['YELLOW FLAG', '0 to −1', C.gold, false], ['RED FLAG', '−2 to −3', C.accent, false], ['DEALBREAKER', '−10', C.accent, true]].map(([t, v, col, solid]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', padding: '5px 9px', border: `1px solid ${col}`, color: solid ? C.bg : col, background: solid ? col : 'transparent' }}>{t}</span>
                <span style={{ fontFamily: ANTON, fontSize: 26, color: col }}>{v}</span>
              </div>
            ))}
          </div>
          {/* palette at the proportions it's used */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexWrap: 'wrap', borderRadius: 12, overflow: 'hidden', border: hair }}>
            {[['Midnight', C.bg, 'Background', 5, C.cream], ['Velvet', C.velvet, 'Accents', 2, C.cream], ['Hot pink', C.accent, 'Dates and actions', 1.6, '#fff'], ['Cream', C.cream, 'Text', 1.3, C.bg], ['Mint', C.teal, 'Good signs', 1, C.bg], ['Gold', C.gold, 'Earned', 1, C.bg]].map(([name, hex, role, weight, ink]) => (
              <div key={name} style={{ flex: `${weight} 1 120px`, minHeight: 150, background: hex, padding: '16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: ink }}>
                {/* name, hex and role each on one line, so every swatch's labels line up */}
                <div style={{ fontFamily: ANTON, fontSize: 20, lineHeight: 1.2, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{name.toUpperCase()}</div>
                <div style={{ fontFamily: WS, fontSize: 12, lineHeight: 1.5, opacity: 0.75, whiteSpace: 'nowrap', marginTop: 2 }}>{hex}</div>
                <div style={{ fontFamily: WS, fontSize: 12, lineHeight: 1.5, opacity: 0.75, whiteSpace: 'nowrap' }}>{role}</div>
              </div>
            ))}
          </div>
          {/* type specimens */}
          <div style={{ gridColumn: 'span 3', ...tile, padding: 'clamp(20px, 3vw, 28px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(14px, 2vw, 24px)', alignItems: 'center' }}>
            <div style={{ fontFamily: ANTON, fontSize: 'clamp(80px, 11vw, 120px)', lineHeight: 0.9, color: C.accent }}>Aa</div>
            <div>
              <div style={label}>Anton</div>
              <div style={{ fontFamily: ANTON, fontSize: 40, color: C.cream, lineHeight: 1, margin: '6px 0 8px' }}>WHO DATED?</div>
              <Small>Headlines, names and scores. Loud on purpose.</Small>
            </div>
          </div>
          <div style={{ gridColumn: 'span 3', ...tile, padding: 'clamp(20px, 3vw, 28px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(14px, 2vw, 24px)', alignItems: 'center' }}>
            <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 'clamp(72px, 10vw, 110px)', lineHeight: 0.9, color: C.cream }}>Aa</div>
            <div>
              <div style={label}>Work Sans</div>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 20, color: C.cream, lineHeight: 1.3, margin: '6px 0 8px' }}>Every green flag is worth 1&nbsp;more.</div>
              <Small>Buttons, rules and everything you read.</Small>
            </div>
          </div>
          {/* the system in use */}
          <div style={{ gridColumn: 'span 6', ...tile, padding: '30px 28px' }}>
            <div style={label}>In use</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: 28, marginTop: 18 }}>
              <div style={{ width: 120, transform: 'rotate(-5deg)' }}><TraitCardBack /></div>
              <div style={{ width: 120, transform: 'rotate(4deg)' }}><TraitCardFront text={card(65).text} value={card(65).value} /></div>
              <StalkChip size={110} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ ...brandBtn, color: '#fff', background: C.accent, border: `1px solid ${C.accent}` }}>DATE</span>
                <span style={{ ...brandBtn, color: C.cream, background: 'transparent', border: '1px solid rgba(239,230,220,0.35)' }}>GHOST</span>
              </div>
              <CatchWordmark size={26} accent={C.accent} cream={C.cream} />
            </div>
          </div>
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '44px 0 14px' }}>THE CAST</div>
        {/* 13 characters: seven across on desktop (girls + Cass, then guys), wrapping and centred on phones */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {['bibi', 'ada', 'suki', 'petra', 'nia', 'rory', 'cass', 'kip', 'dax', 'rell', 'milo', 'theo', 'jun'].map(n => (
            <div key={n} style={{ width: 'calc((100% - 48px) / 7)', minWidth: 96, boxSizing: 'border-box', borderRadius: 8, overflow: 'hidden', border: hair }}>
              <div style={{ height: 150, background: DOLL_BG[n], display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top center', marginTop: 8 }}><Doll name={n} /></div>
              </div>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 13, color: C.cream, textAlign: 'center', padding: '8px 0' }}>{n.charAt(0).toUpperCase() + n.slice(1)}</div>
            </div>
          ))}
        </div>
        <Small style={{ marginTop: 12 }}>Players choose who they’re looking for at the start: girls, guys or everyone.</Small>
      </Section>

      <Gap h={130} />

      {/* ── Play it ── */}
      <Section style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: ANTON, fontWeight: 400, fontSize: 'clamp(48px,10vw,84px)', color: C.cream, lineHeight: 1.02, margin: '0 0 12px' }}>READY TO <span style={{ color: C.accent }}>PLAY?</span></h2>
        <Small style={{ marginBottom: 28, fontSize: 15 }}>Deal from the printed deck, and let one phone keep score.</Small>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>GRAB YOUR CARDS &amp; KEEP SCORE</Btn>
          <Btn href="/thecatch/the-catch-print-deck-11x17.pdf">PRINT THE DECK</Btn>
        </div>
      </Section>

      <Gap h={110} />

      {/* ── Footer ── */}
      <footer style={{ borderTop: hair, padding: '26px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 14, color: muted, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>← Back to portfolio</button>
        <span style={{ fontFamily: WS, fontSize: 13, color: '#555' }}>The Catch · Maya Walsh · 2026</span>
      </footer>
    </div>
  )
}

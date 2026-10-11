import { useEffect, useState } from 'react'
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
function Section({ children, style = {} }) {
  return (
    <section style={{ maxWidth: CONTENT, margin: '0 auto', padding: '0 24px', ...style }}>
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
  if (typeof c === 'string') return c.replace(/ (\S+)\s*$/, '\u00A0$1')
  if (Array.isArray(c)) {
    const a = [...c]
    for (let i = a.length - 1; i >= 0; i--) if (typeof a[i] === 'string') { a[i] = tie(a[i]); break }
    return a
  }
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

function Btn({ children, onClick, primary = false }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em',
      minHeight: 50, padding: '0 34px', borderRadius: 6, cursor: 'pointer',
      color: primary ? '#fff' : C.cream, background: primary ? C.accent : 'transparent',
      border: primary ? `1px solid ${C.accent}` : line,
    }}>{children}</button>
  )
}

const Gap = ({ h = 120 }) => <div style={{ height: h }} />

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchCaseStudy({ onClose, onPlay }) {
  const [enlarged, setEnlarged] = useState(null)   // image shown full size, or null

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Esc closes the enlarged image first; only then the whole case study
    const onKey = e => { if (e.key === 'Escape') { if (enlarged) setEnlarged(null); else onClose() } }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, enlarged])

  return (
    <div className="catch-cs" style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: C.bg, fontFamily: WS }}>

      {/* no lone word on the last line: balance headings, "pretty" wrapping for everything else */}
      <style>{'@media (max-width: 420px) { .cs-wide-only { display: none } } .catch-cs h1, .catch-cs h2 { text-wrap: balance } .catch-cs p, .catch-cs div { text-wrap: pretty }'}</style>
      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56, background: 'rgba(19,16,17,0.94)', backdropFilter: 'blur(8px)', borderBottom: hair }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 14, color: muted, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>← Back<span className="cs-wide-only"> to work</span></button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}><CatchWordmark size={14} accent={C.accent} cream={C.cream} /></div>
        <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', background: C.accent, border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer' }}>PLAY</button>
      </nav>

      {/* ── Hero ── */}
      <header style={{ textAlign: 'center', padding: '88px 16px 96px', borderBottom: hair }}>
        <CatchHero maxWidth={460} style={{ marginBottom: 30 }} />
        <p style={{ fontFamily: WS, fontSize: 'clamp(15px,2vw,18px)', color: C.cream, lineHeight: 1.55, maxWidth: 500, margin: '0 auto 34px' }}>
          A dating card game with a phone for a matchmaker. Read the flags, bluff the table, and find out who you really went home with.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>PLAY</Btn>
        </div>
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
            { name: 'Dream Phone', meta: '1991 · Milton Bradley', stats: 'Electronic phone', good: 'Calling for clues to work out who has a crush on you, with friends listening in.', gap: 'One right answer, and the phone runs the whole game.', img: null, tint: '#2d1026' },
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

      {/* ── The game ── */}
      <Section>
        <Head kicker="The game">Seven matches. Four moments each.</Head>
        <P>Each match is a new stranger, and every match goes the same way.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginTop: 30, alignItems: 'start' }}>
          {[
            ['1', 'Meet them', 'The phone shows who’s on the market: name, age, archetype and an illustrated avatar.', <Phone key="p" src="/thecatch/screens/profile.jpg" alt="Profile card" width={210} />],
            ['2', 'Deal and stalk', 'Deal six trait cards, two face-up and four face-down. Spend a chip to secretly peek at one.', (
              <Phone key="d" width={210}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Scaled w={80} base={110}><TraitCardFront compact text={card(17).text} value={card(17).value} /></Scaled>
                  <Scaled w={80} base={110}><TraitCardFront compact text={card(48).text} value={card(48).value} /></Scaled>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[0, 1, 2, 3].map(i => <Scaled key={i} w={36} base={110}><TraitCardBack compact /></Scaled>)}
                </div>
                <StalkChip size={64} />
              </Phone>
            )],
            ['3', 'Decide and enter', 'On three, everyone says Date or Ghost. Daters add up their six cards and type in one number.', <Phone key="w" src="/thecatch/screens/whodated.jpg" alt="Who dated screen" width={210} />],
            ['4', 'See where you stand', 'The phone adds the bonuses, reveals any catfish, and ranks everyone.', <Phone key="s" src="/thecatch/screens/standings.jpg" alt="Standings screen" width={210} />],
          ].map(([n, t, d, visual]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {visual}
              <Small style={{ marginTop: 22, color: C.accent, fontWeight: 600 }}>Step {n}</Small>
              <div style={{ fontFamily: ANTON, fontSize: 20, color: C.cream, marginTop: 2 }}>{t.toUpperCase()}</div>
              <Small style={{ marginTop: 6, maxWidth: 230, fontSize: 14 }}>{d}</Small>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 30, color: C.cream, margin: '90px 0 12px' }}>IT ALL COMES DOWN TO POINTS</div>
        <P>When you date, the six cards go on your score. Your player type changes what each card is worth, so one stranger can be a great date for you and a disaster for your friend.</P>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '34px 0 14px' }}>PLAYER TYPES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {PLAYER_TYPES.map(t => (
            <div key={t.id} style={{ background: C.card, border: hair, borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 15, color: C.cream }}>{TYPE_NAME[t.id]}</div>
              <div style={{ fontFamily: WS, fontSize: 14, color: muted, marginTop: 4, lineHeight: 1.5 }}>{t.rule}</div>
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
              <div style={{ fontFamily: WS, fontSize: 14, color: muted, marginTop: 4, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 90, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Phone src="/thecatch/screens/final.jpg" alt="Final titles screen" width={250} /></div>
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
      </Section>

      <Gap />

      {/* ── The deck ── */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="The deck">The cards hold the secrets.</Head>
            <P>68 trait cards (green, yellow and red flags, plus 4 dealbreakers worth −10), 6 blanks to write your own, 30 stalk chips and a one-page how-to sheet. Print it at home and play.</P>
            <Small style={{ marginTop: 12 }}>Poker-size cards, 2.5 × 3.5 in.</Small>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            <TraitCardBack />
            <TraitCardFront text={card(10).text} value={card(10).value} />
            <TraitCardFront text={card(40).text} value={card(40).value} />
            <TraitCardFront text={card(48).text} value={card(48).value} />
            <TraitCardFront text={card(65).text} value={card(65).value} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><StalkChip size={92} /></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center', marginTop: 70 }}>
          <button onClick={() => setEnlarged({ src: '/thecatch/screens/howto.jpg', alt: 'The one-page how-to sheet' })}
            aria-label="Enlarge the how-to sheet"
            style={{ all: 'unset', justifySelf: 'center', width: '100%', maxWidth: 440, cursor: 'zoom-in', textAlign: 'center' }}>
            <img src="/thecatch/screens/howto.jpg" alt="The one-page how-to sheet" style={{ display: 'block', width: '100%', borderRadius: 6, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} />
            <Small style={{ marginTop: 12 }}>Click to enlarge</Small>
          </button>
          <div>
            <div style={{ fontFamily: ANTON, fontSize: 28, color: C.cream, marginBottom: 12 }}>THE HOW-TO SHEET</div>
            <P>Everything a new group needs on one page. It folds up and lives in the box.</P>
          </div>
        </div>
      </Section>

      <Gap />

      {/* ── Process ── */}
      <Section>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 28 }}>
          {[[C.bg, 'Midnight', 'Background'], [C.accent, 'Hot pink', 'Dates, actions'], [C.teal, 'Mint', 'Green flags'], [C.gold, 'Gold', 'Titles, stalk'], [C.cream, 'Cream', 'Text'], [C.velvet, 'Velvet', 'Accents']].map(([hex, name, role]) => (
            <div key={name} style={{ border: hair, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: 70, background: hex }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.cream }}>{name}</div>
                <Small>{hex} · {role}</Small>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginTop: 12 }}>
          <div style={{ border: hair, borderRadius: 8, padding: '20px 22px' }}>
            <div style={{ fontFamily: ANTON, fontSize: 46, color: C.cream, lineHeight: 1 }}>WHO DATED?</div>
            <Small style={{ marginTop: 8 }}>Anton · headlines, names and scores</Small>
          </div>
          <div style={{ border: hair, borderRadius: 8, padding: '20px 22px' }}>
            <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 24, color: C.cream, lineHeight: 1.2 }}>Every green flag is worth 1 more.</div>
            <Small style={{ marginTop: 8 }}>Work Sans · buttons, rules and everything you read</Small>
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
        <Small style={{ marginBottom: 28, fontSize: 15 }}>Grab the deck and one phone.</Small>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>PLAY</Btn>
        </div>
      </Section>

      <Gap h={110} />

      {/* ── Enlarged image ── */}
      {enlarged && (
        <div onClick={() => setEnlarged(null)} role="dialog" aria-label={enlarged.alt}
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(8,6,10,0.92)', overflowY: 'auto', cursor: 'zoom-out', padding: '64px 16px 40px', boxSizing: 'border-box' }}>
          <button onClick={() => setEnlarged(null)} aria-label="Close"
            style={{ position: 'fixed', top: 14, right: 16, width: 40, height: 40, borderRadius: 6, border: line, background: C.bg, color: C.cream, fontFamily: WS, fontSize: 18, cursor: 'pointer' }}>✕</button>
          <img src={enlarged.src} alt={enlarged.alt} style={{ display: 'block', width: '100%', maxWidth: 900, margin: '0 auto', borderRadius: 6, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }} />
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: hair, padding: '26px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 14, color: muted, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>← Back to portfolio</button>
        <span style={{ fontFamily: WS, fontSize: 13, color: '#555' }}>The Catch · Maya Walsh · 2026</span>
      </footer>
    </div>
  )
}

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
function Section({ children, wide = false, style = {} }) {
  return (
    <section style={{ maxWidth: wide ? 1080 : 760, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </section>
  )
}

// Small sentence-case kicker + big Anton headline
function Head({ kicker, children, center = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 22 }}>
      {kicker && <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.accent, marginBottom: 10 }}>{kicker}</div>}
      <h2 style={{ fontFamily: ANTON, fontWeight: 400, color: C.cream, fontSize: 'clamp(34px,6vw,50px)', lineHeight: 0.98, margin: 0 }}>{children}</h2>
    </div>
  )
}

function P({ children, style = {} }) {
  return <p style={{ fontFamily: WS, fontSize: 'clamp(15px,1.8vw,17px)', color: body, lineHeight: 1.7, margin: '0 0 16px', maxWidth: 620, ...style }}>{children}</p>
}

function Small({ children, style = {} }) {
  return <div style={{ fontFamily: WS, fontSize: 13, color: muted, lineHeight: 1.55, ...style }}>{children}</div>
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

// ─── Online: a phone showing the dealt hand (live card components) ────────────
function OnlineHand() {
  const up = [card(10), card(17)], peeked = card(63)
  return (
    <div style={{ width: 330, maxWidth: '100%', padding: 7, borderRadius: 34, background: '#08060a', border: line, boxShadow: '0 30px 60px rgba(0,0,0,0.45)', flexShrink: 0 }}>
      <div style={{ borderRadius: 27, overflow: 'hidden', background: C.bg, padding: '16px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, padding: '0 2px' }}>
          <span style={{ fontFamily: ANTON, fontSize: 13, color: C.accent, letterSpacing: '0.1em' }}>MATCH 3 / 7</span>
          <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: C.cream }}>+9 pts</span>
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, lineHeight: 1, marginBottom: 2 }}>RIVER, 26</div>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, letterSpacing: '0.18em', marginBottom: 12 }}>THE SOFT LAUNCH</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 7 }}>
          {up.map(t => <TraitCardFront key={t.no} compact text={t.text} value={t.value} />)}
          <div style={{ position: 'relative', outline: `2px solid ${C.gold}`, outlineOffset: 2, borderRadius: 2 }}>
            <TraitCardFront compact text={peeked.text} value={peeked.value} />
          </div>
          <TraitCardBack compact /><TraitCardBack compact />
        </div>
        <div style={{ fontFamily: WS, fontSize: 11, color: muted, textAlign: 'center', margin: '10px 0 12px' }}>You stalked one card. Only you can see it.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: '#fff', background: C.accent, borderRadius: 6, padding: '11px 0', textAlign: 'center' }}>DATE</div>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: C.cream, border: line, borderRadius: 6, padding: '11px 0', textAlign: 'center' }}>GHOST</div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchCaseStudy({ onClose, onPlay, onPlayOnline }) {
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: C.bg, fontFamily: WS }}>

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56, background: 'rgba(19,16,17,0.94)', backdropFilter: 'blur(8px)', borderBottom: hair }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 14, color: muted, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>← Back to work</button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}><CatchWordmark size={14} accent={C.accent} cream={C.cream} /></div>
        <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', background: C.accent, border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer' }}>PLAY</button>
      </nav>

      {/* ── Hero ── */}
      <header style={{ textAlign: 'center', padding: '88px 16px 96px', borderBottom: hair }}>
        <CatchHero maxWidth={460} style={{ marginBottom: 30 }} />
        <p style={{ fontFamily: WS, fontSize: 'clamp(15px,2vw,18px)', color: C.cream, lineHeight: 1.55, maxWidth: 500, margin: '0 auto 30px' }}>
          A dating card game with a phone for a matchmaker. Read the flags, bluff the table, and find out who you really went home with.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 34 }}>
          {[['Type', 'Card game + companion app'], ['Platform', 'Printed deck + phone'], ['Modes', 'In person + Online'], ['Year', '2026']].map(([k, v]) => (
            <div key={k} style={{ padding: '9px 14px', border: line, borderRadius: 6, fontFamily: WS, fontSize: 13 }}>
              <span style={{ fontWeight: 500, color: '#888' }}>{k} </span><span style={{ fontWeight: 600, color: C.cream }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>PLAY</Btn>
          {onPlayOnline && <Btn onClick={onPlayOnline}>PLAY ONLINE</Btn>}
        </div>
      </header>

      <Gap h={110} />

      {/* ── Overview ── */}
      <Section wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="Overview">What if the portfolio piece was the thing itself?</Head>
            <P>The Catch started as a question: could one project be both the design work and the thing it shows off? It became a finished, playable dating game you can pick up right from my portfolio.</P>
            <P>The cards are the game. You deal a stranger's traits face-up and face-down, peek where you can, and decide out loud whether to date or ghost. One phone sits in the middle of the table as the matchmaker: it shows who's on the market, keeps score, and hands everyone a title at the end.</P>
            <div style={{ marginTop: 10 }}>
            {[
              ['The challenge', 'Show interaction design, visual identity and systems thinking at once, as a live, playable artifact instead of mockups.'],
              ['The approach', 'A complete game with its own identity, a printed deck, and enough depth to replay.'],
              ['The constraint', 'Everything runs in the browser, with no servers, accounts or database.'],
            ].map(([t, d]) => (
              <div key={t} style={{ fontFamily: WS, fontSize: 15, color: body, lineHeight: 1.6, padding: '10px 0', borderTop: hair }}>
                <span style={{ fontWeight: 600, color: C.cream }}>{t}. </span>{d}
              </div>
            ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 420 }}>
            <Phone src="/thecatch/screens/profile.jpg" alt="The profile card screen" width={230} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginLeft: -26, marginBottom: 24, zIndex: 2 }}>
              <div style={{ width: 128, transform: 'rotate(5deg)' }}><TraitCardFront text={card(17).text} value={card(17).value} /></div>
              <div style={{ width: 128, transform: 'rotate(-3deg)', marginLeft: 18 }}><TraitCardBack /></div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, marginTop: 56, background: 'rgba(239,230,220,0.08)', border: hair, borderRadius: 8, overflow: 'hidden' }}>
          {[['Course', 'IXD 432, senior year'], ['Year', '2026'], ['Built with', 'React, Vite, PeerJS'], ['Made', 'Web app, printed deck, rulebook'], ['Players', '2–6, 20–40 minutes']].map(([k, v]) => (
            <div key={k} style={{ background: C.bg, padding: '16px 18px' }}>
              <Small>{k}</Small>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 15, color: C.cream, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Gap />

      {/* ── The problem ── */}
      <Section wide>
        <Head kicker="The problem">Dating games are either long or shallow.</Head>
        <P>Two tabletop games anchor the space. One is a deep two-player roleplay; the other is a party game about guessing. Neither has real hidden information that a whole group can play with.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 10 }}>
          {[
            { name: 'Fog of Love', meta: '2017 · Hush Hush Projects', stats: '2 players · 60–120 min · $50', good: 'Rich relationship roleplay with deep emotional mechanics.', gap: 'Exactly two players, long sessions, and a heavy rulebook.', img: '/competitors/fog-of-love.jpg' },
            { name: 'The Bachelor Board Game', meta: '2018 · Imagination Games', stats: '3+ players · 18+ · Party game', good: 'Familiar show, built for groups, easy to pick up.', gap: 'Mostly guessing about friends, with no real scoring or strategy.' },
          ].map(g => (
            <div key={g.name} style={{ background: C.card, border: hair, borderRadius: 10, overflow: 'hidden' }}>
              {g.img
                ? <img src={g.img} alt={`${g.name} box art`} style={{ width: '100%', height: 170, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                : <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a0a0f,#2d0e18)' }}><span style={{ fontFamily: ANTON, fontSize: 24, color: '#e8c4c4', letterSpacing: '0.12em' }}>THE BACHELOR</span></div>}
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream }}>{g.name.toUpperCase()}</div>
                <Small style={{ marginTop: 2 }}>{g.meta} · {g.stats}</Small>
                <div style={{ fontFamily: WS, fontSize: 14, color: body, lineHeight: 1.6, marginTop: 12 }}><span style={{ color: C.teal, fontWeight: 600 }}>Strength </span>{g.good}</div>
                <div style={{ fontFamily: WS, fontSize: 14, color: body, lineHeight: 1.6, marginTop: 6 }}><span style={{ color: C.accent, fontWeight: 600 }}>Gap </span>{g.gap}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 22, color: C.cream, margin: '32px 0 10px' }}>THE OPPORTUNITY</div>
        <P style={{ maxWidth: 760 }}>The Catch takes the group energy of a party game and adds real hidden information: face-down cards, a secret catfish, stalk chips, and player types that change the math. It's free, needs no setup, and plays at the table or online.</P>
      </Section>

      <Gap />

      {/* ── The game ── */}
      <Section wide>
        <Head kicker="The game">Seven matches. Four moments each.</Head>
        <P>The table does the playing and the phone keeps up. Each match is a new stranger, and each one follows the same rhythm.</P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginTop: 30, alignItems: 'start' }}>
          {[
            ['1', 'Meet them', 'The phone shows who’s on the market: name, age, archetype and an illustrated avatar.', <Phone key="p" src="/thecatch/screens/profile.jpg" alt="Profile card" width={210} />],
            ['2', 'Deal and stalk', 'Deal six trait cards, two face-up and four face-down. Spend a chip to secretly peek at one.', (
              <Phone key="d" width={210}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 80px', gap: 8 }}>
                  <TraitCardFront compact text={card(17).text} value={card(17).value} />
                  <TraitCardBack compact />
                </div>
                <StalkChip size={72} />
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
        <P>Every date adds your six cards to your total. Your player type changes what each card is worth to you, so the same stranger can be a great date for one player and a disaster for another.</P>
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
            <P>After seven matches the highest total wins, and ties are shared. Then every player gets a title from their score, which is easy to explain at the table and easy to screenshot after.</P>
            <div style={{ marginTop: 10 }}>
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
      <Section wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="The deck">The cards hold the secrets.</Head>
            <P>A printable deck made for this game: 64 trait cards in green, yellow and red flags, 6 blanks to write your own, 30 stalk chips, and a one-page how-to sheet that folds into the box. The rules live in the box, so the phone never has to explain itself.</P>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              <a href="/thecatch/trait-card-deck.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.cream, border: line, borderRadius: 6, padding: '12px 18px', textDecoration: 'none' }}>Print-ready deck (PDF)</a>
              <a href="/thecatch/rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: WS, fontWeight: 600, fontSize: 14, color: C.cream, border: line, borderRadius: 6, padding: '12px 18px', textDecoration: 'none' }}>Rulebook (PDF)</a>
            </div>
            <Small style={{ marginTop: 12 }}>Poker size, 2.5 × 3.5 in. Print at 100% and cut on the dashed lines.</Small>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            <TraitCardBack />
            <TraitCardFront text={card(10).text} value={card(10).value} />
            <TraitCardFront text={card(40).text} value={card(40).value} />
            <TraitCardFront text={card(48).text} value={card(48).value} />
            <TraitCardFront blank green />
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
            <P>Everything a new table needs on one page: setup, the five steps of a match, card values, the six player types, what the phone adds for you, and the final titles. It folds into quarters and lives in the box.</P>
          </div>
        </div>
      </Section>

      <Gap />

      {/* ── Online ── */}
      <Section wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <Head kicker="Online">No deck? No problem.</Head>
            <P>When friends are apart, every phone is dealt the same six cards, drawn exactly like the printed deck. Tap a face-down card to stalk it and it flips for you alone. Everyone picks Date or Ghost in secret, and the host’s phone does the math.</P>
            <P>Using the same card faces in both modes means there’s nothing new to learn when you switch between them.</P>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><OnlineHand /></div>
        </div>
      </Section>

      <Gap />

      {/* ── Process ── */}
      <Section>
        <Head kicker="Process">How it evolved.</Head>
        <P>The Catch changed a lot between the first playable version and this one. Each round of playtesting pushed it the same direction: fewer rules on the screen, more of the game in people's hands.</P>
        <div style={{ margin: '28px 0 70px' }}>
          {[
            ['Version 1', 'An app game', 'The phone ran everything: solo play against AI rivals, private decisions passed around the phone, photo reveals, a bonus final round, achievements and online power-ups.'],
            ['Version 2', 'Multiplayer only', 'Solo mode came out. The phone told the table which numbered cards to deal, and players still decided in private on the phone.'],
            ['Version 3', 'The cards are the game', 'The deck took over: deal, peek and say Date or Ghost out loud. The phone became a matchmaker that shows the profile and keeps score, and the rules moved onto a printed sheet in the box.'],
            ['Version 4', 'Points only', 'Hearts, the bonus round and achievements were cut so everything comes down to one total. The interface lost its emoji, bios and extra labels, and every choice now shares one button style.'],
          ].map(([v, t, d], i, arr) => (
            <div key={v} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: i === arr.length - 1 ? C.accent : C.bg, border: `2px solid ${C.accent}`, marginTop: 6 }} />
                {i < arr.length - 1 && <span style={{ flex: 1, width: 2, background: 'rgba(255,77,109,0.3)' }} />}
              </div>
              <div style={{ paddingBottom: 28 }}>
                <Small style={{ color: C.accent, fontWeight: 600 }}>{v}</Small>
                <div style={{ fontFamily: ANTON, fontSize: 24, color: C.cream, margin: '2px 0 6px' }}>{t.toUpperCase()}</div>
                <P style={{ marginBottom: 0, fontSize: 15 }}>{d}</P>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: ANTON, fontSize: 30, color: C.cream, marginBottom: 6 }}>KEY DECISIONS</div>
        {[
          ['Why let the cards run the game?', "Earlier versions had the app call out card numbers, collect private decisions by passing the phone around, and do all the math. The phone kept pulling everyone's attention away from the table. Now the table does the playing, dealing and peeking and saying Date or Ghost out loud, and the phone only does what people are bad at: remembering the fine print and keeping score."],
          ['Why phone-sized on a computer?', 'The game is built to feel like a phone app. On a computer it opens as an iPhone-sized screen, so it always feels like something in your hand, not something filling a monitor.'],
          ['Why draw the online cards like the printed deck?', 'So both modes feel like one game. The same card faces show up on the table and on the phone, and stalking online is literally flipping a card over.'],
        ].map(([q, a], i) => (
          <div key={q} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 12, padding: '24px 0', borderTop: hair }}>
            <span style={{ fontFamily: ANTON, fontSize: 28, color: C.accent, lineHeight: 1 }}>{i + 1}</span>
            <div>
              <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 18, color: C.cream, marginBottom: 8 }}>{q}</div>
              <P style={{ marginBottom: 0 }}>{a}</P>
            </div>
          </div>
        ))}
      </Section>

      <Gap />

      {/* ── Look and feel ── */}
      <Section wide>
        <Head kicker="Look and feel">After hours.</Head>
        <P>The identity is built around late-night tension: dark backgrounds, one hot pink, and loud condensed type. Color always means something, from pink for a date to mint for a good sign and gold for anything earned.</P>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 8 }}>
          {['bibi', 'ada', 'suki', 'petra', 'cass', 'kip', 'dax', 'rell', 'milo'].map(n => (
            <div key={n} style={{ borderRadius: 8, overflow: 'hidden', border: hair }}>
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
        <h2 style={{ fontFamily: ANTON, fontWeight: 400, fontSize: 'clamp(48px,10vw,84px)', color: C.cream, lineHeight: 0.92, margin: '0 0 12px' }}>READY TO <span style={{ color: C.accent }}>PLAY?</span></h2>
        <Small style={{ marginBottom: 28, fontSize: 15 }}>Grab a deck and a phone, or play online with friends.</Small>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn primary onClick={onPlay}>PLAY</Btn>
          {onPlayOnline && <Btn onClick={onPlayOnline}>PLAY ONLINE</Btn>}
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

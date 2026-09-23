import { useEffect } from 'react'
import { CatchHero, CatchWordmark } from './CatchBrand'
import { Doll, DOLL_BG } from './DollCharacters'
import { TRAIT_POOL } from '../data/catchProfiles'

// ─── Design tokens (mirror the game) ─────────────────────────────────────────
const C = {
  bg:      '#131011',
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
const hair  = `1px solid rgba(239,230,220,0.08)`

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, style = {} }) {
  return (
    <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </section>
  )
}

function Label({ children, color = '#555' }) {
  return (
    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.22em', color, marginBottom: 14 }}>
      {children}
    </div>
  )
}

function Heading({ children, color = C.cream, size = 'clamp(32px,7vw,56px)' }) {
  return (
    <div style={{ fontFamily: ANTON, color, fontSize: size, lineHeight: 0.92, marginBottom: 20 }}>
      {children}
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, maxWidth: 820, margin: '72px auto', padding: '0 24px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(239,230,220,0.07)' }} />
      <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 22, opacity: 0.35 }} />
      <div style={{ flex: 1, height: 1, background: 'rgba(239,230,220,0.07)' }} />
    </div>
  )
}

// ─── The cast: illustration + the B&W photo a LOOK reveals ────────────────────
const CAST = ['bibi', 'kip', 'ada', 'dax', 'suki', 'rell']

function CastStrip() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
      {CAST.map(name => (
        <div key={name} style={{ background: C.card, border: hair, overflow: 'hidden' }}>
          <div style={{ height: 150, background: DOLL_BG[name], overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center', marginTop: 8 }}><Doll name={name} /></div>
          </div>
          <img src={`/catch-photos/${name}.jpg`} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', objectPosition: 'center 30%', filter: 'grayscale(1) contrast(1.1) brightness(0.9)', display: 'block', borderTop: `2px solid ${C.accent}55` }} />
          <div style={{ fontFamily: ANTON, fontSize: 12, color: C.cream, letterSpacing: '0.14em', textAlign: 'center', padding: '8px 0' }}>{name.toUpperCase()}</div>
        </div>
      ))}
    </div>
  )
}

// ─── System flow diagram ──────────────────────────────────────────────────────
function FlowArrow({ label, color = '#444', vertical = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: vertical ? '8px 0' : '0 8px', flexShrink: 0 }}>
      {label && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color, letterSpacing: '0.16em' }}>{label}</span>}
      <div style={{ width: vertical ? 1 : 24, height: vertical ? 24 : 1, background: '#333' }} />
      <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid #444` }} />
    </div>
  )
}

function FlowNode({ label, sub, color = C.cream, accent = C.accent, dim = false, small = false }) {
  return (
    <div style={{
      padding: small ? '7px 12px' : '10px 16px',
      background: dim ? 'transparent' : C.card,
      border: `1px solid ${dim ? '#2a2525' : accent + '55'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      minWidth: small ? 80 : 120,
    }}>
      <div style={{ fontFamily: ANTON, fontSize: small ? 10 : 12, color: dim ? '#444' : color, letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.2 }}>{label}</div>
      {sub && <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 9, color: '#555', letterSpacing: '0.08em', textAlign: 'center' }}>{sub}</div>}
    </div>
  )
}

function SystemFlow() {
  const Chip = ({ label, color }) => (
    <div style={{ padding: '4px 8px', border: `1px solid ${color}55`, background: `${color}10` }}>
      <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color, letterSpacing: '0.1em' }}>{label}</span>
    </div>
  )
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ minWidth: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FlowNode label="▶ PLAY" sub="Phone + the trait card deck" accent={C.accent} />
          <FlowArrow />
          <FlowNode label="PLAYER SETUP" sub="1–6 players on one phone · alone = 2 AI rivals" accent={C.teal} />
          <FlowArrow />
          <FlowNode label="WRITE YOUR OWN" sub="Optional · blank cards become W1–W6" accent={C.gold} dim />
          <FlowArrow label="START" color={C.accent} />

          {/* 7-round loop */}
          <div style={{ border: `1px dashed ${C.accent}44`, padding: '14px 16px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', top: -9, left: 12, background: C.bg, padding: '0 6px', fontFamily: WS, fontWeight: 700, fontSize: 8, color: C.accent, letterSpacing: '0.18em' }}>ROUND 1–7</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <FlowNode label="DEAL" sub="App calls the card numbers · 2 up, 4 down" accent={C.cream} small />
              <FlowArrow />
              <div style={{ display: 'flex', gap: 5 }}>
                <Chip label="👁 LOOK · APP" color={C.teal} />
                <Chip label="🔍 STALK · CHIPS" color={C.gold} />
              </div>
              <FlowArrow />
              <FlowNode label="DECIDE" sub="Pass the phone · ♥ Date or ◌ Ghost" accent={C.accent} small />
              <FlowArrow />
              <FlowNode label="FLIP" sub="Turn the cards as the app reveals" accent={C.velvet} color={C.cream} small />
              <FlowArrow />
              <FlowNode label="SCORED" sub="Score · hearts · leaderboard" accent={C.teal} color={C.teal} small />
            </div>
          </div>

          <FlowArrow label="AFTER 7" color="#555" />

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, letterSpacing: '0.14em', marginBottom: 8 }}>10+ POINTS &amp; A HEART</div>
              <FlowNode label="THE ONE" sub="App only · ±10" accent={C.gold} color={C.gold} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.14em', marginBottom: 8 }}>TIE AT THE TABLE</div>
              <FlowNode label="SPEED DATING" sub="Tied players date or ghost" accent={C.gold} dim />
            </div>
          </div>
          <FlowArrow />
          <FlowNode label="RESULTS" sub="Rank · title · achievements" accent={C.teal} color={C.teal} />
        </div>
      </div>
    </div>
  )
}

// ─── The token: printed trait cards + stalk chips (mirrors the print deck) ────
function flagOf(v) {
  if (v >= 1)  return ['GREEN FLAG', C.teal]
  if (v >= -1) return ['YELLOW FLAG', C.gold]
  return ['RED FLAG', C.accent]
}

function TraitCardFront({ no, text, value, blank = false, green = true }) {
  const [label, col] = blank ? (green ? ['GREEN FLAG', C.teal] : ['RED FLAG', C.accent]) : flagOf(value)
  const val = blank ? (green ? '+2' : '−2') : value > 0 ? `+${value}` : value === 0 ? '±0' : `−${Math.abs(value)}`
  return (
    <div style={{ aspectRatio: '5 / 7', background: C.card, borderLeft: `5px solid ${col}`, padding: '12px 12px 11px 14px', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 32px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: ANTON, fontSize: blank ? 9 : 11, letterSpacing: '0.08em', color: 'rgba(239,230,220,0.55)', whiteSpace: 'nowrap' }}>{blank ? 'WRITE YOUR OWN' : `№ ${String(no).padStart(2, '0')}`}</span>
        <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 6, letterSpacing: '0.14em', color: col, border: `1px solid ${col}`, padding: '2px 4px', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      {blank
        ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>{[0, 1, 2].map(i => <div key={i} style={{ borderBottom: '1px solid rgba(239,230,220,0.22)' }} />)}</div>
        : <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontFamily: WS, fontWeight: 500, fontSize: 11.5, lineHeight: 1.32, color: C.cream }}>{text}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <CatchWordmark size={7} accent={C.accent} cream="rgba(239,230,220,0.6)" />
        <span style={{ fontFamily: ANTON, fontSize: 26, lineHeight: 0.9, color: col }}>{val}</span>
      </div>
    </div>
  )
}

function TraitCardBack() {
  return (
    <div style={{ aspectRatio: '5 / 7', background: C.bg, backgroundImage: 'radial-gradient(circle, rgba(239,230,220,0.07) 1px, transparent 1px)', backgroundSize: '8px 8px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', inset: 8, border: `1px solid ${C.accent}73` }} />
      <img src="/thecatch/brand/logo-full.svg" alt="" style={{ width: '72%' }} />
      <div style={{ position: 'absolute', bottom: 16, fontFamily: WS, fontWeight: 700, fontSize: 6.5, letterSpacing: '0.3em', color: C.accent }}>TRAIT CARD</div>
    </div>
  )
}

function StalkChip({ size = 96 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: C.card, border: `${Math.round(size * 0.045)}px solid ${C.gold}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px rgba(0,0,0,0.5)', flexShrink: 0 }}>
      <div style={{ fontSize: size * 0.24, lineHeight: 1 }}>🔍</div>
      <div style={{ fontFamily: ANTON, fontSize: size * 0.15, letterSpacing: '0.12em', color: C.gold, marginTop: 3 }}>STALK</div>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: Math.max(5, size * 0.055), letterSpacing: '0.12em', color: 'rgba(239,230,220,0.55)', marginTop: 1 }}>PEEK AT 1 CARD</div>
    </div>
  )
}

function TokenShowcase() {
  const pick = n => ({ no: n, ...TRAIT_POOL[n - 1] })
  const fronts = [pick(1), pick(34), pick(64)]
  return (
    <div>
      {/* The cards */}
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 14 }}>THE TRAIT CARDS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
        <TraitCardBack />
        {fronts.map(t => <TraitCardFront key={t.no} no={t.no} text={t.text} value={t.value} />)}
        <TraitCardFront blank green />
      </div>
      <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#777', margin: '14px 0 0', lineHeight: 1.6 }}>
        Every card's number matches the game — the app calls out which ones to deal. Green, yellow and red flags carry their point values; the blanks are for writing your own.
      </p>

      {/* The stalk tokens */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', marginTop: 40, padding: '26px 24px', background: C.card, border: hair }}>
        <div style={{ display: 'flex' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ marginLeft: i ? -22 : 0, transform: `rotate(${(i - 1) * 8}deg)` }}><StalkChip /></div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: ANTON, fontSize: 20, color: C.gold, letterSpacing: '0.06em' }}>STALK TOKENS</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.65)', lineHeight: 1.6, margin: '6px 0 0' }}>
            Three per player. Spend one to secretly peek at a face-down card — then put it back and say nothing. Everyone sees you stalk; nobody sees what you found.
          </p>
        </div>
      </div>

      {/* What's in the deck + download */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginTop: 16 }}>
        {[['64', 'TRAIT CARDS', C.teal], ['6', 'BLANK CARDS', C.gold], ['30', 'STALK CHIPS', C.accent], ['2', 'RULES CARDS', '#aaa']].map(([n, l, col]) => (
          <div key={l} style={{ padding: '14px 16px', background: C.cardAlt, border: hair }}>
            <div style={{ fontFamily: ANTON, fontSize: 28, color: col, lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em', color: '#777', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <a href="/thecatch/trait-card-deck.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: C.gold, border: `1px solid ${C.gold}66`, padding: '11px 20px', textDecoration: 'none', display: 'inline-block' }}>
          ↓ PRINT-READY DECK (PDF)
        </a>
        <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666' }}>Poker size 2.5 × 3.5 in · print at 100% · cut on the dashed lines</span>
      </div>
    </div>
  )
}

// ─── Mechanic card ─────────────────────────────────────────────────────────────
function MechanicCard({ icon, name, desc, tag, color = C.cream }) {
  return (
    <div style={{ background: C.card, border: hair, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div style={{ fontFamily: ANTON, fontSize: 15, color, letterSpacing: '0.08em' }}>{name}</div>
        </div>
        {tag && (
          <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, letterSpacing: '0.16em', color: '#555', border: `1px solid #2a2525`, padding: '2px 7px' }}>{tag}</span>
        )}
      </div>
      <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Player type pill ─────────────────────────────────────────────────────────
function TypePill({ emoji, label, desc }) {
  return (
    <div style={{ background: C.cardAlt, border: hair, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontFamily: ANTON, fontSize: 12, color: C.teal, letterSpacing: '0.14em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.55)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function Swatch({ hex, name, role }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 64, background: hex, border: hex === C.bg ? `1px solid rgba(239,230,220,0.12)` : 'none' }} />
      <div>
        <div style={{ fontFamily: ANTON, fontSize: 12, color: C.cream, letterSpacing: '0.08em' }}>{name}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', marginTop: 2 }}>{hex}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>{role}</div>
      </div>
    </div>
  )
}

// ─── Component states ────────────────────────────────────────────────────────
function StateCol({ name, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {children}
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: '#9a9090', letterSpacing: '0.15em', textAlign: 'center' }}>{name}</div>
    </div>
  )
}

function StatesRow({ label, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#7a7070', letterSpacing: '0.18em', marginBottom: 16, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {children}
      </div>
    </div>
  )
}

function MiniScreen({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 150, background: C.bg, border: `1px solid rgba(239,230,220,0.07)`, overflow: 'hidden' }}>
        {children}
      </div>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: '#9a9090', letterSpacing: '0.15em' }}>{label}</div>
    </div>
  )
}

function ComponentStates() {
  const WS_BTN = { fontFamily: WS, fontWeight: 700, letterSpacing: '0.12em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }

  return (
    <div>
      {/* PRIMARY CTA */}
      <StatesRow label="Main button — ▶ Play">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: C.accent, color: '#fff' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: C.accent, color: '#fff', boxShadow: `0 0 28px rgba(255,77,109,0.55)`, transform: 'scale(1.035)' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: '#cc3d56', color: 'rgba(255,255,255,0.8)', transform: 'scale(0.96)' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="DISABLED">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: '#252020', color: '#3a3535', cursor: 'not-allowed' }}>▶ PLAY</div>
        </StateCol>
      </StatesRow>

      {/* DATE ACTION */}
      <StatesRow label="Action — ♥ Date">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}55`, color: C.cream, background: 'transparent' }}>♥ DATE</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}99`, color: C.cream, background: `${C.accent}16`, boxShadow: `0 0 14px rgba(255,77,109,0.18)` }}>♥ DATE</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}`, color: '#fff', background: C.accent, transform: 'scale(0.96)' }}>♥ DATE</div>
        </StateCol>
        <StateCol name="DISABLED (locked in)">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #2a2525`, color: '#333', background: 'transparent', cursor: 'not-allowed' }}>♥ DATE</div>
        </StateCol>
      </StatesRow>

      {/* GHOST ACTION */}
      <StatesRow label="Action — ◌ Ghost">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #3a3535`, color: '#888', background: 'transparent' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #555`, color: '#aaa', background: '#1a1818' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #666`, color: '#ccc', background: '#222', transform: 'scale(0.96)' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="DISABLED (0 left)">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #1e1a1b`, color: '#2a2525', background: 'transparent', cursor: 'not-allowed' }}>◌ GHOST</div>
        </StateCol>
      </StatesRow>


      {/* ONE-USE TOKENS */}
      <StatesRow label="One-time action — ⚡ Steal / 🛋️ Therapy">
        <StateCol name="AVAILABLE">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: `${C.gold}12`, border: `1px solid ${C.gold}44`, color: C.gold }}>⚡ STEAL</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: `${C.gold}22`, border: `1px solid ${C.gold}88`, color: C.gold, boxShadow: `0 0 12px rgba(228,196,106,0.18)` }}>⚡ STEAL</div>
        </StateCol>
        <StateCol name="USED / DISABLED">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: 'transparent', border: `1px solid #1e1a1b`, color: '#2a2525', cursor: 'not-allowed' }}>⚡ STEAL</div>
        </StateCol>
      </StatesRow>


      {/* SCREEN STATES */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#444', letterSpacing: '0.18em', marginBottom: 20, textTransform: 'uppercase' }}>Screen States</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* DECIDING */}
          <MiniScreen label="DECIDING">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7, color: C.accent, letterSpacing: '0.1em' }}>ROUND 3</div>
              <div style={{ fontFamily: WS, fontSize: 8, color: '#666' }}>♥ ♥ ♥</div>
            </div>
            <div style={{ margin: '6px 6px 0' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.cream, marginBottom: 4, paddingLeft: 1 }}>ALEX M.</div>
              <div style={{ height: 1, background: 'rgba(239,230,220,0.07)', marginBottom: 4 }} />
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {[{t:'Texts back quickly',v:'+1',c:C.teal},{t:'Ugly laughs freely',v:'+2',c:C.teal}].map((r,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 5px', background:`${r.c}11`, border:`1px solid ${r.c}33`, borderRadius:3 }}>
                    <span style={{ fontFamily:WS, fontSize:6, color:'rgba(239,230,220,0.7)', flex:1, lineHeight:1.3 }}>{r.t}</span>
                    <div style={{ width:13, height:13, borderRadius:'50%', background:`${r.c}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ANTON, fontSize:6.5, color:r.c }}>{r.v}</div>
                  </div>
                ))}
                {[1,2,3,4].map(i=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 5px', background:'rgba(255,255,255,0.02)', border:`1px solid rgba(255,255,255,0.05)`, borderRadius:3 }}>
                    <span style={{ fontFamily:WS, fontSize:6, color:'#3a3535', flex:1 }}>?????</span>
                    <div style={{ width:13, height:13, borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ANTON, fontSize:6.5, color:'#3a3535' }}>?</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:'5px 7px 7px', display:'flex', gap:4 }}>
              <div style={{ flex:1, padding:'4px 0', border:`1px solid ${C.accent}55`, textAlign:'center', fontFamily:WS, fontWeight:700, fontSize:6.5, color:C.cream }}>♥ DATE</div>
              <div style={{ flex:1, padding:'4px 0', border:`1px solid #3a3535`, textAlign:'center', fontFamily:WS, fontWeight:700, fontSize:6.5, color:'#666' }}>◌ GHOST</div>
            </div>
          </MiniScreen>

          {/* SCORED */}
          <MiniScreen label="SCORED">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7, color: C.accent, letterSpacing: '0.1em' }}>ROUND 3</div>
              <div style={{ fontFamily: WS, fontSize: 8, color: '#666' }}>♥ ♥ ♥</div>
            </div>
            <div style={{ margin: '7px 7px 0', background: C.cardAlt, border: `1px solid ${C.teal}44`, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 26, color: C.teal, lineHeight: 1 }}>+3</div>
              <div style={{ fontFamily: WS, fontSize: 6.5, color: 'rgba(239,230,220,0.45)', marginTop: 3, letterSpacing: '0.1em' }}>TOTAL: 9 PTS</div>
            </div>
            <div style={{ margin: '5px 6px 6px', display:'flex', flexDirection:'column', gap:3 }}>
              {[{t:'Texts back quickly',v:'+1',c:C.teal},{t:'Gets jealous easily',v:'−2',c:C.accent},{t:'Ugly laughs freely',v:'+2',c:C.teal},{t:'Remembers small things',v:'+2',c:C.teal}].map((r,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 5px', background:`${r.c}11`, border:`1px solid ${r.c}33`, borderRadius:3 }}>
                  <span style={{ fontFamily:WS, fontSize:6, color:'rgba(239,230,220,0.7)', flex:1, lineHeight:1.3 }}>{r.t}</span>
                  <div style={{ width:13, height:13, borderRadius:'50%', background:`${r.c}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ANTON, fontSize:6.5, color:r.c }}>{r.v}</div>
                </div>
              ))}
            </div>
          </MiniScreen>

          {/* THE ONE */}
          <MiniScreen label="THE ONE">
            <div style={{ background: C.velvet, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.gold, letterSpacing: '0.14em', marginBottom: 2 }}>💘 THE ONE</div>
              <div style={{ fontFamily: WS, fontSize: 6.5, color: 'rgba(239,230,220,0.45)', letterSpacing: '0.1em' }}>LEGENDARY PROFILE</div>
            </div>
            <div style={{ height: 1, background: `${C.gold}33` }} />
            <div style={{ margin: '6px 6px 0' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.gold, marginBottom: 4, paddingLeft: 1 }}>QUINN, 27 ★</div>
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {[{t:'Never leaves things unfinished',v:'+2',c:C.teal},{t:'?????',v:'?',c:'#3a3535'},{t:'?????',v:'?',c:'#3a3535'}].map((r,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 5px', background:r.c==='#3a3535'?'rgba(255,255,255,0.02)':`${r.c}11`, border:`1px solid ${r.c==='#3a3535'?'rgba(255,255,255,0.05)':r.c+'33'}`, borderRadius:3 }}>
                    <span style={{ fontFamily:WS, fontSize:6, color:r.c==='#3a3535'?r.c:'rgba(239,230,220,0.7)', flex:1, lineHeight:1.3 }}>{r.t}</span>
                    <div style={{ width:13, height:13, borderRadius:'50%', background:r.c==='#3a3535'?'rgba(255,255,255,0.03)':`${r.c}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:ANTON, fontSize:6.5, color:r.c }}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ margin: '5px 7px 7px', padding: '5px', background: C.gold, textAlign: 'center', fontFamily: ANTON, fontSize: 7.5, color: '#131011', letterSpacing: '0.1em' }}>♛ TAKE A CHANCE</div>
          </MiniScreen>

          {/* RESULTS */}
          <MiniScreen label="RESULTS">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7.5, color: C.cream, letterSpacing: '0.1em' }}>FINAL RESULTS</div>
            </div>
            <div style={{ padding: '7px 10px' }}>
              {[{n:'Maya',p:24,r:'🥇'},{n:'Jordan',p:18,r:'🥈'},{n:'Alex',p:11,r:'🥉'}].map((p,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 0', borderBottom:i<2?`1px solid rgba(239,230,220,0.06)`:'none' }}>
                  <span style={{ fontSize:8 }}>{p.r}</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:7.5, color:C.cream, flex:1 }}>{p.n}</span>
                  <span style={{ fontFamily:ANTON, fontSize:9, color:i===0?C.gold:C.cream }}>{p.p}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'0 8px 8px', display:'flex', gap:4, flexWrap:'wrap' }}>
              {['🎣','👻','⚡'].map(e=>(
                <div key={e} style={{ padding:'2px 5px', background:C.cardAlt, border:`1px solid ${C.gold}33`, fontSize:8 }}>{e}</div>
              ))}
            </div>
          </MiniScreen>

        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchCaseStudy({ onClose, onPlay, onPlayOnline }) {
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: C.bg, fontFamily: WS }}>

      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 56,
        background: 'rgba(19,16,17,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: hair,
      }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.04em' }}>
          ← Back to Work
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}><CatchWordmark size={14} accent={C.accent} cream={C.cream} /></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onPlayOnline && (
            <button onClick={onPlayOnline} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: C.accent, background: 'transparent', border: `1px solid ${C.accent}44`, padding: '8px 14px', cursor: 'pointer' }}>
              ↗ ONLINE
            </button>
          )}
          <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', background: C.accent, border: 'none', padding: '8px 18px', cursor: 'pointer' }}>
            ▶ PLAY
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: C.bg, paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(239,230,220,0.06) 1px, transparent 1px)`, backgroundSize: '20px 20px', pointerEvents: 'none' }} />
        {/* Scanline */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '30%', background: `linear-gradient(to bottom, transparent, rgba(255,77,109,0.04), transparent)`, animation: 'catch-scan 6s linear infinite' }} />
        </div>
        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: C.accent, animation: 'catch-bar-glow 3s ease-in-out infinite' }} />

        <div style={{ position: 'relative' }}>
          <CatchHero style={{ marginBottom: 36 }} />

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              ['TYPE', 'Game Design'],
              ['PLATFORM', 'Web / Mobile'],
              ['MODES', 'Solo + Online'],
              ['YEAR', '2025'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '6px 14px', border: hair, background: C.card }}>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.18em' }}>{k}: </span>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.cream, letterSpacing: '0.1em' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onPlay} style={{
              fontFamily: WS, fontWeight: 700, fontSize: 15, letterSpacing: '0.14em',
              color: '#fff', background: C.accent, border: 'none',
              padding: '16px 40px', cursor: 'pointer',
              boxShadow: `0 0 40px rgba(255,77,109,0.35)`,
            }}>
              ▶ PLAY
            </button>
            {onPlayOnline && (
              <button onClick={onPlayOnline} style={{
                fontFamily: WS, fontWeight: 700, fontSize: 15, letterSpacing: '0.14em',
                color: C.accent, background: 'transparent',
                border: `1px solid ${C.accent}55`, padding: '16px 40px', cursor: 'pointer',
              }}>
                ↗ PLAY ONLINE
              </button>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="/thecatch/rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em',
              color: 'rgba(239,230,220,0.35)', textDecoration: 'none', borderBottom: `1px solid rgba(239,230,220,0.12)`,
              paddingBottom: 2,
            }}>
              ↓ DOWNLOAD RULEBOOK PDF
            </a>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ paddingTop: 80, paddingBottom: 120 }}>

        {/* Overview */}
        <Section>
          <Label color={C.accent}>01 — OVERVIEW</Label>
          <Heading>A dating sim where<br />every flag counts.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(239,230,220,0.65)', lineHeight: 1.75, maxWidth: 640 }}>
            The Catch is a dating game built into my portfolio, designed to feel like a dating app. Players read through profiles, weigh the green flags they can see against the red ones they can't, and decide who to date and who to ghost. Every trait is worth points, every choice has consequences, and no two games play out the same.
          </p>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(239,230,220,0.65)', lineHeight: 1.75, maxWidth: 640, marginTop: 20 }}>
            The project started with a question: what if a portfolio piece could be both the design work <em>and</em> the thing it's showing off? The Catch is a finished, playable game with two modes — solo against two AI rivals, and online multiplayer where everyone plays on their own phone. It runs free in the browser, with nothing to download.
          </p>
        </Section>

        <Divider />

        {/* Problem & Brief */}
        <Section>
          <Label color={C.accent}>02 — THE BRIEF</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE CHALLENGE</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                Build something that demonstrates interaction design, visual identity, and systems thinking — all at once. No mockups. No static screens. A live, playable artifact.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.teal}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE APPROACH</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                Design a game with a complete visual identity, a custom-built game engine, and enough depth to replay multiple times. Every mechanic should feel intentional — not just functional, but expressive.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.gold}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE CONSTRAINT</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                It had to run entirely in the browser — no servers, no accounts, no database. Online games connect players' phones directly to each other, with the host's phone keeping score.
              </p>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Competitive Landscape */}
        <Section>
          <Label color={C.accent}>03 — COMPETITIVE LANDSCAPE</Label>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 32 }}>
            Two tabletop games anchor the dating-game space — one narrative, one IP-driven. The Catch sits in neither category.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>

            {/* Fog of Love */}
            <div style={{ background: C.card, border: `1px solid rgba(239,230,220,0.1)`, padding: '24px 22px' }}>
              <img src="/competitors/fog-of-love.jpg" alt="Fog of Love box art" style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'center top', display: 'block', marginBottom: 18 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 16, letterSpacing: '0.08em' }}>FOG OF LOVE</div>
                  <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em', marginTop: 3 }}>2017 · HUSH HUSH PROJECTS</div>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#9a9090', letterSpacing: '0.15em', border: '1px solid #3a3535', padding: '4px 9px' }}>PHYSICAL</div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                {[['2', 'PLAYERS'], ['60–120', 'MINUTES'], ['$50', 'COST']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 14 }}>{val}</div>
                    <div style={{ fontFamily: WS, fontSize: 9, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.15em', marginBottom: 8 }}>STRENGTHS</div>
                {['Rich narrative roleplay — you live a full relationship arc', 'Deep emotional mechanics, high replayability', 'Beautifully crafted physical component'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.teal, fontSize: 11, lineHeight: 1.5 }}>+</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.15em', marginBottom: 8 }}>GAPS</div>
                {['Exactly 2 players — no group or solo play', 'Long sessions; heavy rulebook, high barrier to entry', 'Physical only, requires purchase (~$50)'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.accent, fontSize: 11, lineHeight: 1.5 }}>–</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Bachelor */}
            <div style={{ background: C.card, border: `1px solid rgba(239,230,220,0.1)`, padding: '24px 22px' }}>
              <div style={{ width: '100%', height: 180, marginBottom: 18, background: 'linear-gradient(135deg, #1a0a0f 0%, #2d0e18 50%, #1a0a0f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(180,20,60,0.18) 0%, transparent 70%)' }} />
                <div style={{ fontSize: 40, lineHeight: 1 }}>🌹</div>
                <div style={{ fontFamily: ANTON, color: '#e8c4c4', fontSize: 13, letterSpacing: '0.3em', textAlign: 'center' }}>THE BACHELOR</div>
                <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 9, color: 'rgba(232,196,196,0.45)', letterSpacing: '0.2em' }}>BOARD GAME</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 16, letterSpacing: '0.08em' }}>THE BACHELOR</div>
                  <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em', marginTop: 3 }}>2018 · IMAGINATION GAMES</div>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#9a9090', letterSpacing: '0.15em', border: '1px solid #3a3535', padding: '4px 9px' }}>PHYSICAL</div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                {[['3+', 'PLAYERS'], ['18+', 'AGES'], ['PARTY', 'GENRE']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 14 }}>{val}</div>
                    <div style={{ fontFamily: WS, fontSize: 9, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.15em', marginBottom: 8 }}>STRENGTHS</div>
                {['Familiar IP lowers the barrier to entry', 'Built for groups — a party game for 3+', 'Answer-paddle guessing anyone can pick up'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.teal, fontSize: 11, lineHeight: 1.5 }}>+</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.15em', marginBottom: 8 }}>GAPS</div>
                {['Leans on the show — most fun if you already watch it', 'Guessing about friends, not a scoring or strategy system', 'Physical only, requires purchase, no solo or digital play'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.accent, fontSize: 11, lineHeight: 1.5 }}>–</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Positioning statement */}
          <div style={{ background: C.cardAlt, border: `1px solid ${C.accent}33`, padding: '20px 22px' }}>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 11, letterSpacing: '0.16em', marginBottom: 10 }}>WHERE THE CATCH FITS</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.7)', margin: 0, lineHeight: 1.7 }}>
              Neither competitor offers free, instant, browser-based play, and neither builds its scoring around hidden red flags. The Catch pairs the group, party-game energy of The Bachelor with its own hidden-information mechanics — the catfish, hidden-trait reveals, stalk and look tokens, and player types that change the math — delivers it free with no setup, and runs solo against AI rivals or online with everyone on their own phone.
            </p>
          </div>
        </Section>

        <Divider />

        {/* Design System */}
        <Section>
          <Label color={C.accent}>04 — DESIGN SYSTEM</Label>
          <Heading>After Hours.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            The visual identity was built around late-night tension — dark backgrounds, neon accents, high-contrast typography. Every color carries meaning inside the game logic.
          </p>

          {/* Logo & marks */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>LOGO &amp; MARKS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
              {[
                [<img src="/thecatch/brand/logo-full.svg" alt="The Catch logo" style={{ width: '88%', maxWidth: 190 }} />, 'FULL LOCKUP', 'Hero and cover moments'],
                [<CatchWordmark size={22} accent={C.accent} cream={C.cream} />, 'WORDMARK', 'Nav bars and small spaces'],
                [<img src="/thecatch/brand/hook-heart.png" alt="" style={{ height: 64 }} />, 'HOOK + HEART', 'Wins, reveals, transitions', C.cream],
                [<img src="/thecatch/brand/flank-heart.svg" alt="" style={{ height: 64 }} />, 'HAND-DRAWN HEART', 'Accent only'],
              ].map(([mark, name, use, tile]) => (
                <div key={name} style={{ background: C.card, border: hair }}>
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tile }}>{mark}</div>
                  <div style={{ padding: '10px 14px', borderTop: hair }}>
                    <div style={{ fontFamily: ANTON, fontSize: 11, color: C.cream, letterSpacing: '0.12em' }}>{name}</div>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', marginTop: 2 }}>{use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>COLOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 16 }}>
              <Swatch hex={C.bg}     name="MIDNIGHT"  role="Background" />
              <Swatch hex={C.accent} name="NEON RED"   role="Danger · Date" />
              <Swatch hex={C.teal}   name="MINT"       role="Safe · Positive" />
              <Swatch hex={C.gold}   name="GOLD"       role="The One · Premium" />
              <Swatch hex={C.cream}  name="CREAM"      role="Primary text" />
              <Swatch hex={C.velvet} name="VELVET"     role="The One screen" />
            </div>
          </div>

          {/* Typography */}
          <div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>TYPOGRAPHY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '20px 24px', background: C.card, border: hair, display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: ANTON, fontSize: 48, color: C.cream, lineHeight: 1, flexShrink: 0 }}>CATCH</div>
                <div>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.18em' }}>ANTON — DISPLAY</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 4 }}>Headlines · Scores · Action labels · Game titles</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', background: C.card, border: hair, display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 22, color: C.cream, lineHeight: 1, flexShrink: 0 }}>THE SELECTIVE</div>
                <div>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.18em' }}>WORK SANS — BODY</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 4 }}>UI labels · Trait text · Descriptions · All caps tags</div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice */}
          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>VOICE</div>
            <div style={{ padding: '26px 24px', background: C.card, border: hair, borderLeft: `3px solid ${C.accent}` }}>
              <div style={{ fontFamily: ANTON, fontSize: 'clamp(22px,4vw,30px)', color: C.cream, lineHeight: 1.1, letterSpacing: '0.02em' }}>
                SAME RULES. <span style={{ color: C.accent }}>LOUDER CONSEQUENCES.</span>
              </div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.55)', lineHeight: 1.6, margin: '10px 0 18px', maxWidth: 520 }}>
                Dry, knowing, a little too honest — the friend who reads the group chat and says what everyone's thinking.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Not your person. Not not your person.', 'Everything checks out. So why does something feel off?', 'Has the vocabulary. Working on the follow-through.'].map(line => (
                  <div key={line} style={{ fontFamily: WS, fontWeight: 400, fontStyle: 'italic', fontSize: 14, color: C.cream }}>“{line}”</div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Component States */}
        <Section>
          <Label color={C.accent}>05 — COMPONENT STATES</Label>
          <Heading>Every element,<br />every state.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Every button has four states — default, hover, pressed and disabled — so players always know what they can tap and what's used up.
          </p>
          <ComponentStates />
        </Section>

        <Divider />

        {/* System Flow */}
        <Section>
          <Label color={C.accent}>06 — SYSTEM FLOW</Label>
          <Heading>How a game<br />flows.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            The app and the trait cards work together: set up, then seven rounds of deal → look &amp; stalk → decide → flip → score, then The One for anyone who qualifies.
          </p>
          <SystemFlow />

          {/* Figma downloads */}
          <div style={{ marginTop: 40, padding: '20px 22px', background: C.card, border: `1px solid ${C.gold}33`, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: ANTON, fontSize: 11, color: C.gold, letterSpacing: '0.16em' }}>EDITABLE IN FIGMA</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.55)', margin: 0, lineHeight: 1.6 }}>
              Both diagrams open in Figma as editable layers — drag either file into any frame.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/thecatch/system-flow.svg" download="TheCatch-SystemFlow.svg" style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: C.gold, border: `1px solid ${C.gold}44`, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
                ↓ SYSTEM FLOW SVG
              </a>
              <a href="/thecatch/design-system.svg" download="TheCatch-DesignSystem.svg" style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: C.gold, border: `1px solid ${C.gold}44`, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
                ↓ DESIGN SYSTEM SVG
              </a>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Profile generation */}
        <Section>
          <Label color={C.accent}>07 — PROFILE GENERATION</Label>
          <Heading>No two games<br />play the same.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Every game builds 7 fresh profiles from a pool of 64 real dating behaviors. Each gets 6 traits — you see the 2 mildest, and the other 4 stay hidden until you decide.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ background: C.card, border: `1px solid ${C.teal}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>TRAIT CATEGORIES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Green Flags', 'value +1 to +3', C.teal],
                  ['Yellow Flags', 'value 0 to −1', C.gold],
                  ['Red Flags', 'value −2 to −3', C.accent],
                ].map(([label, range, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: hair }}>
                    <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color }}>{label}</span>
                    <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>🪝 THE CATFISH</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>
                One catfish is injected into every game at a random position (rounds 2–5). Visible traits are all positive. Hidden traits are all −3. Dating them costs −4 extra and a heart — and a LOOK gives them away: their photo is a lot older than their age. Ghosting them earns +1 and the "Catfish Dodger" achievement.
              </p>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.gold}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>💘 THE ONE</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>
                A legendary final profile, pitched in-game as a "1% drop". Only players who scored ≥ 10 points and kept at least one heart get to face them. Four hidden traits, one worth +5. In solo, a type-adjusted total of 7+ pays +10; anything less costs −10 and a heart.
              </p>
            </div>
          </div>

          {/* Trait example */}
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 12 }}>TRAIT EXAMPLE — VISIBLE VS HIDDEN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { text: 'Texts back within a reasonable amount of time', value: 1, visible: true },
              { text: 'Will ugly laugh with you and not care how they look', value: 2, visible: true },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
            ].map((t, i) => {
              const isPos = t.visible && t.value > 0
              const isNeg = t.visible && t.value < 0
              const accentCol = !t.visible ? '#3a3535' : isPos ? C.teal : isNeg ? C.accent : C.gold
              const bg = !t.visible ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : isNeg ? 'rgba(255,77,109,0.07)' : 'rgba(255,255,255,0.04)'
              const borderCol = !t.visible ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : isNeg ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.1)'
              const scoreStr = t.visible ? (t.value > 0 ? `+${t.value}` : `${t.value}`) : '?'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: bg, border: `1px solid ${borderCol}`, borderRadius: 6 }}>
                  <span style={{ fontFamily: WS, fontWeight: t.visible ? 500 : 300, fontSize: 13, color: t.visible ? C.cream : '#3a3535', flex: 1, lineHeight: 1.35 }}>{t.text}</span>
                  <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: !t.visible ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : isNeg ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.08)', fontFamily: ANTON, fontSize: 14, color: accentCol }}>
                    {scoreStr}
                  </div>
                </div>
              )
            })}
          </div>

          {/* The cast */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555' }}>THE CAST</div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: C.teal }}>👁 A LOOK SWAPS THE ILLUSTRATION FOR THE REAL PHOTO</div>
            </div>
            <CastStrip />
          </div>
        </Section>

        <Divider />

        {/* Mechanics */}
        <Section>
          <Label color={C.accent}>08 — GAME MECHANICS</Label>
          <Heading>Every action<br />has a cost.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Each mechanic was designed to create meaningful decisions with real tradeoffs — not just UI controls.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            <MechanicCard icon="♥" name="DATE" color={C.accent} tag="CORE"
              desc="Score the profile's traits, adjusted by your player type. Negative totals cost a heart. Solo adds a +2 bonus for 7+ and a −2 Red Flag penalty at −5 or worse. Date the catfish and it's −4 on top." />
            <MechanicCard icon="◌" name="GHOST" color="#888" tag="CORE"
              desc="Skip the round. No points, no hearts lost. You only have 3 ghosts per game — spend them wisely. Ghosting a catfish earns +1 bonus point." />
            <MechanicCard icon="🔍" name="STALK" color={C.gold} tag="SOLO · INTEL"
              desc="Reveal one random hidden trait early. Costs a stalk token. You start with 3, and they work on The One too. Use them to make a more informed call before committing." />
            <MechanicCard icon="👁" name="LOOK" color={C.teal} tag="SOLO · INTEL"
              desc="Spend a look token to swap the illustrated avatar for the profile's real black-and-white photo. 3 per game, once per profile. The catfish's photo never matches their age." />
            <MechanicCard icon="⚡" name="STEAL" color={C.gold} tag="ONLINE"
              desc="Skip the date and take up to 3 points from the highest-scoring other player — never more than they have. One use per game. Earns the Smooth Criminal achievement." />
            <MechanicCard icon="♥♥" name="DOUBLE DATE" color={C.accent} tag="ONLINE"
              desc="If two or more players pick it, the score is split evenly between them. Lower risk, lower reward. If only one person picks it, it counts as a regular date." />
            <MechanicCard icon="🛋️" name="THERAPY" color="#8B7EA8" tag="SOLO · RECOVERY"
              desc="One use per game, from any score screen. Roll 50/50 for +4 or +0, banked when the next match starts. Used after round 7, the +4 can push you over the line for The One." />
          </div>
        </Section>

        <Divider />

        {/* Player types */}
        <Section>
          <Label color={C.accent}>09 — PLAYER TYPES</Label>
          <Heading>Who you are<br />changes the math.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Each player type applies a different scoring adjustment to every trait value. The same profile can score completely differently depending on who's reading it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            <TypePill emoji="💘" label="THE ROMANTIC"
              desc="Green flags hit harder. Any positive trait gets +1. You fall fast and you score for it — until you don't." />
            <TypePill emoji="🎯" label="THE SELECTIVE"
              desc="Red flags cost double. Any negative trait loses 1 more. Your standards are a feature, not a bug." />
            <TypePill emoji="🔥" label="THE CHAOTIC ONE"
              desc="Red flags barely sting. Negative traits get +2 forgiveness, never rising above 0. Boring is the only dealbreaker." />
            <TypePill emoji="🌀" label="THE OVERTHINKER"
              desc="Yellow flags become red flags. −1 traits become −3, and neutral 0s become −1. Patterns are everywhere." />
            <TypePill emoji="🚪" label="THE AVOIDANT"
              desc="Too intense is a red flag. Traits of +3 drop by 1, and traits of −2 or worse drop 1 more. Space is your love language." />
            <TypePill emoji="💰" label="THE GOLD DIGGER"
              desc="Stability pays. Strong positives (+2 and above) score +1 more. Strong negatives (−2 and below) lose 1 more. The math maths." />
          </div>
        </Section>

        <Divider />

        {/* Achievements */}
        <Section>
          <Label color={C.accent}>10 — ACHIEVEMENTS</Label>
          <Heading>Rewarding<br />the story, not just the score.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            11 achievements track behaviors across a full game — 9 live, 2 still locked. In solo they toast the moment you earn them, and every mode shows them on the results screen — turning each run into a story you can share.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {[
              ['🎣', 'CATFISH DODGER', 'Ghost the catfish'],
              ['🪝', 'GOT CATFISHED', 'Date the catfish'],
              ['👻', 'GHOST MASTER', 'Use all 3 ghosts'],
              ['🔥', 'CHAOS ENJOYER', 'Go on 2+ Red Flag dates (solo)'],
              ['🛋️', 'THERAPIZED', 'Use the therapy action (solo)'],
              ['⚡', 'SMOOTH CRIMINAL', 'Use Steal (online)'],
              ['♥♥', 'DOUBLE DATER', 'Pick Double Date (online)'],
              ['💘', 'FOUND THE ONE', 'Win at The One round'],
              ['💔', 'UNMATCHED', 'Lose at The One round'],
              ['🚩', 'RED FLAG RADAR', 'Locked — coming soon', true],
              ['☠️', 'NO SURVIVORS', 'Locked — coming soon', true],
            ].map(([emoji, title, trigger, locked]) => (
              <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: C.cardAlt, border: hair, opacity: locked ? 0.45 : 1 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <div style={{ fontFamily: ANTON, fontSize: 10, color: C.gold, letterSpacing: '0.1em', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', lineHeight: 1.4 }}>{trigger}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Design decisions */}
        <Section>
          <Label color={C.accent}>11 — DESIGN DECISIONS</Label>
          <Heading>Why it works<br />this way.</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: 'Why reveal traits automatically instead of on-tap?',
                a: 'The original version required tapping each hidden trait. It felt like work. The auto-reveal creates a rhythm — you watch the profile unfold. The tension of waiting is the mechanic.',
              },
              {
                q: 'Why put the score popup before the full breakdown?',
                a: 'Playtesting showed players were looking for their result first, then reading the context. Leading with the number (large, glowing) lets the emotion land, then the breakdown gives it meaning.',
              },
              {
                q: 'Why phone-sized on a computer?',
                a: "The game is built to feel like a phone app. On a computer it opens as an iPhone 15-sized screen, so it always feels like something in your hand, not something filling a monitor. In online multiplayer, everyone is literally on their own phone.",
              },
              {
                q: 'Why switch from left-border rows to rounded trait cards?',
                a: "The original left-border row pattern read like a data table — clean, but cold. Rounded cards with tinted backgrounds and circular score bubbles give each trait its own visual weight. The color tinting communicates sentiment at a glance before the score even registers, and the card format reinforces that you're making a judgment call about a person, not parsing a spreadsheet.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '22px 24px', background: C.card, border: hair, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream, lineHeight: 1.4 }}>↳ {q}</div>
                <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* The token: cards + stalk chips */}
        <Section>
          <Label color={C.gold}>12 — THE TOKEN</Label>
          <Heading>The cards hold<br /><span style={{ color: C.accent }}>the secrets.</span></Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>
            A hand-made deck that plays alongside the app. The phone shows who's on the market and keeps score — the cards decide what they're really like.
          </p>
          <TokenShowcase />
        </Section>

        <Divider />

        {/* CTA */}
        <Section style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,10vw,80px)', color: C.cream, lineHeight: 0.9, marginBottom: 6 }}>READY TO</div>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,10vw,80px)', color: C.accent, lineHeight: 0.9, marginBottom: 32 }}>PLAY?</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button onClick={onPlay} style={{
              fontFamily: WS, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em',
              color: '#fff', background: C.accent, border: 'none',
              padding: '18px 48px', cursor: 'pointer',
              boxShadow: `0 0 48px rgba(255,77,109,0.4)`,
            }}>
              ▶ PLAY
            </button>
            {onPlayOnline && (
              <button onClick={onPlayOnline} style={{
                fontFamily: WS, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em',
                color: C.accent, background: 'transparent',
                border: `1px solid ${C.accent}55`,
                padding: '18px 48px', cursor: 'pointer',
              }}>
                ↗ ONLINE MULTIPLAYER
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#444', letterSpacing: '0.1em' }}>
              SOLO · ONLINE MULTIPLAYER · 7 ROUNDS · THEN THE ONE
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <a href="/thecatch/rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em',
              color: 'rgba(239,230,220,0.35)', textDecoration: 'none',
              border: `1px solid rgba(239,230,220,0.1)`, padding: '8px 20px', display: 'inline-block',
            }}>
              ↓ OFFICIAL RULEBOOK PDF
            </a>
          </div>
        </Section>

      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: hair, padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← Back to Portfolio
        </button>
        <div style={{ fontFamily: ANTON, color: '#2a2525', fontSize: 12, letterSpacing: '0.12em' }}>THE CATCH · MAYA WALSH</div>
        <div style={{ width: 140 }} />
      </div>

    </div>
  )
}

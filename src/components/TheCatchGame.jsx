import { useReducer, useState } from 'react'
import { generateProfiles, PLAYER_TYPES, LOOKING_FOR, getTitle } from '../data/catchProfiles'
import { ROUNDS, HEARTS, GHOSTS, scoreMatch, rankPlayers } from '../data/catchRules'
import { Doll, DOLL_BG } from './DollCharacters'
import { CatchWordmark } from './CatchBrand'

// The Catch — table companion.
//
// The physical trait cards are the game: players deal, stalk, decide, flip and
// add up their own cards at the table. This app only shows who's on the market
// each round, takes everyone's card totals, keeps the leaderboard, and hands out
// a title at the end. It never needs to know which cards were dealt.

// ─── Option B · After Hours design tokens ─────────────────────────────────────
const C = {
  bg:      '#131011',
  screen:  '#0e0b12',
  card:    '#1E1A1B',
  cardAlt: '#2C2729',
  accent:  '#FF4D6D',
  teal:    '#7CE0A8',
  gold:    '#E4C46A',
  cream:   '#EFE6DC',
  slate:   '#2C2729',
  velvet:  '#3B2E4A',
}
const WS       = "'Work Sans', sans-serif"
const ANTON    = "'Anton', sans-serif"
const hairline = '1px solid rgba(239,230,220,0.08)'

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6

// ─── game state ───────────────────────────────────────────────────────────────
function makePlayer(id, name, playerType) {
  return { id, name, playerType, score: 0, hearts: HEARTS, ghosts: GHOSTS, dates: 0, redFlags: 0 }
}

const INIT = { screen: 'setup', players: [], profiles: [], round: 0, results: null }

function reducer(state, { type, ...p }) {
  switch (type) {
    case 'START':
      return { ...INIT, screen: 'round', players: p.players, profiles: generateProfiles(ROUNDS, [], [], p.lookingFor).slice(0, ROUNDS) }
    case 'ENTER_SCORES':
      return { ...state, screen: 'score' }
    case 'BACK_TO_PROFILE':
      return { ...state, screen: 'round' }
    case 'SCORE': {
      const isCatfish = state.profiles[state.round].isCatfish === true
      const { players, results } = scoreMatch(state.players, p.decisions, isCatfish)
      return { ...state, players, results, screen: 'match_result' }
    }
    case 'NEXT':
      if (state.round >= ROUNDS - 1) return { ...state, screen: 'final' }
      return { ...state, round: state.round + 1, results: null, screen: 'round' }
    case 'PLAY_AGAIN':
      return { ...INIT }
    default:
      return state
  }
}

// ─── shared bits ──────────────────────────────────────────────────────────────
const primaryBtn = enabled => ({
  width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em',
  minHeight: 52, border: 'none', borderRadius: 6,
  background: enabled ? C.accent : C.slate, color: enabled ? '#fff' : '#555',
  cursor: enabled ? 'pointer' : 'not-allowed',
  boxShadow: enabled ? '0 0 20px rgba(255,77,109,0.35)' : 'none',
})

// Every choice button in the game shares this look: even size, sentence-case
// text, pink fill when selected.
const choiceBtn = (selected, disabled = false) => ({
  minHeight: 40, padding: '0 6px', fontFamily: WS, fontWeight: 600, fontSize: 12,
  color: disabled ? '#444' : selected ? '#fff' : '#aaa',
  background: selected ? C.accent : 'transparent',
  border: `1px solid ${selected ? C.accent : disabled ? '#2a2525' : '#3a3535'}`,
  borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
})

function Screen({ children, footer, center = false }) {
  // center: content sits in the middle of the screen when it's short, and
  // scrolls normally when it's long (margin auto never clips the top).
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.screen, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', maxWidth: 400, margin: center ? 'auto' : '0 auto', padding: center ? '20px' : '0 20px 20px', boxSizing: 'border-box' }}>{children}</div>
      </div>
      {footer && (
        <div style={{ flexShrink: 0, padding: '10px 20px 16px', background: C.screen, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>{footer}</div>
        </div>
      )}
    </div>
  )
}

function Hero({ top, bottom, sub }) {
  return (
    <div style={{ padding: '22px 20px 16px', margin: '0 -20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
      <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(34px,10vw,46px)', lineHeight: 0.9 }}>{top}</div>
      <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(34px,10vw,46px)', lineHeight: 0.9 }}>{bottom}</div>
      {sub && <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#888', margin: '10px 0 0', lineHeight: 1.5 }}>{sub}</p>}
    </div>
  )
}

function Label({ children, color = '#888' }) {
  return <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 13, color, marginBottom: 8 }}>{children}</div>
}

function Hearts({ n }) {
  return <span>{Array.from({ length: HEARTS }, (_, i) => <span key={i} style={{ color: C.accent, opacity: i < n ? 1 : 0.18 }}>♥</span>)}</span>
}

function titleCase(str) { return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) }

function signed(n) { return n > 0 ? `+${n}` : n === 0 ? '±0' : `${n}` }

// ─── SETUP ────────────────────────────────────────────────────────────────────
// Short, sentence-case names for the type buttons.
const TYPE_NAME = { romantic: 'Romantic', selective: 'Selective', chaotic: 'Chaotic', overthinker: 'Overthinker', avoidant: 'Avoidant', gold_digger: 'Gold Digger' }

// Who the table wants to date: decides which characters show up this game.
function LookingFor({ value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#777', letterSpacing: '0.2em', marginBottom: 8 }}>LOOKING FOR</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {LOOKING_FOR.map(l => {
          const sel = value === l.id
          return (
            <button key={l.id} onClick={() => onChange(l.id)} style={{ ...choiceBtn(sel), flex: 1 }}>
              {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
function SetupScreen({ dispatch }) {
  const [slots, setSlots] = useState(() => Array.from({ length: MIN_PLAYERS }, () => ({ name: '', playerType: PLAYER_TYPES[0] })))
  const update   = (i, key, val) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl))
  const [lookingFor, setLookingFor] = useState('everyone')
  const canStart = slots.every(s => s.name.trim().length > 0)
  const start    = () => dispatch({ type: 'START', lookingFor, players: slots.map((sl, i) => makePlayer(`p${i}`, sl.name.trim(), sl.playerType)) })

  return (
    <Screen footer={<button onClick={start} disabled={!canStart} style={primaryBtn(canStart)}>START THE GAME</button>}>
      <Hero top="WHO'S" bottom="PLAYING?" sub="Rules are on the direction sheet in the box." />
      <LookingFor value={lookingFor} onChange={setLookingFor} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {slots.map((sl, i) => (
          <div key={i} style={{ padding: 14, background: C.card, border: hairline, borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.accent, letterSpacing: '0.2em' }}>PLAYER {i + 1}</span>
              {i >= MIN_PLAYERS && (
                <button onClick={() => setSlots(s => s.filter((_, j) => j !== i))}
                  style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>✕</button>
              )}
            </div>
            <input
              style={{ width: '100%', fontFamily: ANTON, fontSize: 22, letterSpacing: '0.04em', background: C.cardAlt, color: C.cream, border: sl.name ? '1px solid rgba(239,230,220,0.2)' : hairline, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent, borderRadius: 4 }}
              placeholder="NAME" value={sl.name} maxLength={16} autoFocus={i === 0}
              onChange={e => update(i, 'name', e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.18em', marginBottom: 6 }}>TYPE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {PLAYER_TYPES.map(pt => {
                  const sel = sl.playerType?.id === pt.id
                  return (
                    <button key={pt.id} onClick={() => update(i, 'playerType', pt)} style={choiceBtn(sel)}>
                      {TYPE_NAME[pt.id]}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
        {slots.length < MAX_PLAYERS && (
          <button onClick={() => setSlots(s => [...s, { name: '', playerType: PLAYER_TYPES[0] }])}
            style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, padding: '12px 0', border: `1px dashed ${C.slate}`, color: '#777', background: 'transparent', cursor: 'pointer', borderRadius: 6 }}>
            + Add player
          </button>
        )}
      </div>
    </Screen>
  )
}

// ─── PROFILE CARD ─────────────────────────────────────────────────────────────
// Each match's profile is its own full-screen "card": the avatar fills the
// space, with name, age and archetype along the bottom.
function ProfileCard({ profile, match }) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', borderRadius: 14, overflow: 'hidden', border: hairline, background: C.card, boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 220, overflow: 'hidden', background: profile.doll ? DOLL_BG[profile.doll] : '#111', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {profile.doll
          ? <div style={{ transform: 'scale(1.9)', transformOrigin: 'top center', marginTop: 4 }}><Doll name={profile.doll} /></div>
          : <span style={{ fontSize: 96, lineHeight: 1, display: 'flex', alignItems: 'center', height: '100%' }}>{profile.emoji}</span>}
        {match && (
          <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: ANTON, fontSize: 12, letterSpacing: '0.12em', color: C.cream, background: 'rgba(19,16,17,0.72)', border: '1px solid rgba(239,230,220,0.15)', borderRadius: 4, padding: '4px 9px' }}>{match}</div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '70px 16px 14px', background: 'linear-gradient(to top,rgba(0,0,0,0.96),transparent)' }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 34, lineHeight: 1 }}>{profile.name.toUpperCase()}, {profile.age}</div>
          {profile.archetype && <div style={{ fontFamily: WS, fontWeight: 700, color: C.gold, fontSize: 11, letterSpacing: '0.22em', marginTop: 5 }}>{profile.archetype.toUpperCase()}</div>}
        </div>
      </div>
    </div>
  )
}

// ─── ROUND: the profile card, full screen — how to play is on the sheet in the box
function RoundScreen({ state, dispatch }) {
  const profile = state.profiles[state.round]
  const match = `MATCH ${String(state.round + 1).padStart(2, '0')} / ${String(ROUNDS).padStart(2, '0')}`
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.screen, minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 400, margin: '0 auto', padding: '14px 20px 12px', boxSizing: 'border-box' }}>
        <ProfileCard profile={profile} match={match} />
      </div>
      <div style={{ flexShrink: 0, padding: '10px 20px 16px', background: C.screen, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <button onClick={() => dispatch({ type: 'ENTER_SCORES' })} style={primaryBtn(true)}>ENTER SCORES</button>
        </div>
      </div>
    </div>
  )
}

// ─── SCORE ENTRY: each player says date/ghost and types their card total ─────
function ScoreScreen({ state, dispatch }) {
  const profile = state.profiles[state.round]
  const [dec, setDec] = useState({})
  const set = (id, patch) => setDec(d => ({ ...d, [id]: { total: 0, ...d[id], ...patch } }))
  // +/− read the latest total, so fast taps all count
  const bump = (id, by) => setDec(d => { const cur = d[id]?.total ?? 0; return { ...d, [id]: { ...d[id], total: Math.max(-40, Math.min(40, cur + by)) } } })
  const ready = state.players.every(p => dec[p.id]?.action)

  return (
    <Screen center footer={
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => dispatch({ type: 'BACK_TO_PROFILE' })}
          style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 13, color: '#888', background: 'transparent', border: hairline, borderRadius: 6, padding: '0 16px', cursor: 'pointer' }}>PROFILE</button>
        <button onClick={() => dispatch({ type: 'SCORE', decisions: dec })} disabled={!ready} style={primaryBtn(ready)}>SCORE THE MATCH</button>
      </div>
    }>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(30px,9vw,40px)', lineHeight: 0.95 }}>WHO DATED</div>
        <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(30px,9vw,40px)', lineHeight: 0.95 }}>{profile.name.toUpperCase()}?</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.players.map(p => {
          const d = dec[p.id] ?? {}
          const canGhost = p.ghosts > 0
          return (
            <div key={p.id} style={{ padding: 14, background: C.card, border: hairline, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: ANTON, fontSize: 20, color: C.cream, letterSpacing: '0.03em' }}>{p.name.toUpperCase()}</div>
                <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: '#777' }}>{TYPE_NAME[p.playerType.id]}</div>
              </div>
              <div style={{ height: 10 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button onClick={() => set(p.id, { action: 'date' })} style={choiceBtn(d.action === 'date')}>Dated</button>
                <button onClick={() => canGhost && set(p.id, { action: 'ghost' })} disabled={!canGhost} style={choiceBtn(d.action === 'ghost', !canGhost)}>
                  Ghosted ({p.ghosts} left)
                </button>
              </div>
              {!canGhost && <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#777', marginTop: 6 }}>No ghosts left — you have to date.</div>}
              {d.action === 'date' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <span style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: '#999', flex: 1 }}>Card total</span>
                  <button onClick={() => bump(p.id, -1)} aria-label="minus one"
                    style={{ ...choiceBtn(false), width: 40, fontSize: 18, color: C.cream }}>−</button>
                  <input type="number" value={d.total ?? 0}
                    onChange={e => { const v = parseInt(e.target.value, 10); set(p.id, { total: Number.isNaN(v) ? 0 : Math.max(-40, Math.min(40, v)) }) }}
                    style={{ width: 64, height: 40, boxSizing: 'border-box', textAlign: 'center', fontFamily: WS, fontWeight: 600, fontSize: 16, color: (d.total ?? 0) >= 0 ? C.teal : C.accent, background: 'transparent', border: '1px solid #3a3535', borderRadius: 6, outline: 'none' }} />
                  <button onClick={() => bump(p.id, 1)} aria-label="plus one"
                    style={{ ...choiceBtn(false), width: 40, fontSize: 18, color: C.cream }}>+</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Screen>
  )
}

// ─── MATCH RESULT + LEADERBOARD ───────────────────────────────────────────────
function MatchResultScreen({ state, dispatch }) {
  const profile   = state.profiles[state.round]
  const isCatfish = profile.isCatfish === true
  const last      = state.round >= ROUNDS - 1
  return (
    <Screen center footer={<button onClick={() => dispatch({ type: 'NEXT' })} style={primaryBtn(true)}>{last ? 'SEE FINAL TITLES' : 'NEXT MATCH'}</button>}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: '#888' }}>Match {state.round + 1} of {ROUNDS}</div>
        <div style={{ fontFamily: ANTON, color: isCatfish ? C.teal : C.cream, fontSize: 'clamp(30px,9vw,40px)', lineHeight: 0.95, marginTop: 6 }}>
          {profile.name.toUpperCase()}{isCatfish ? '' : `, ${profile.age}`}
        </div>
        {isCatfish && <>
          <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 'clamp(30px,9vw,40px)', lineHeight: 0.95 }}>WAS THE CATFISH</div>
          <div style={{ fontFamily: WS, fontSize: 13, color: '#999', marginTop: 8 }}>Dated: −4 and a heart · Ghosted: +1</div>
        </>}
      </div>

      {/* One list: this match + running standings (sorted), so nothing repeats */}
      <Standings players={state.players} results={state.results} />
    </Screen>
  )
}

// Each row: rank, name, what happened this match, and the running total.
function Standings({ players, results }) {
  const ranked = rankPlayers(players)
  const soleLeader = ranked.length > 1 && (ranked[0].score !== ranked[1].score || ranked[0].hearts !== ranked[1].hearts)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ranked.map((p, rank) => {
        const r = results[p.id]
        const col = r.pts > 0 ? C.teal : r.pts < 0 ? C.accent : '#888'
        const lead = rank === 0 && soleLeader
        const what = [r.action === 'date' ? `Dated, cards ${signed(r.raw)}` : 'Ghosted', ...r.notes].join(' · ')
        return (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '22px 1fr auto', alignItems: 'center', gap: 12, padding: '12px 14px', background: C.card, border: lead ? `1px solid ${C.gold}66` : hairline, borderRadius: 6 }}>
            <span style={{ fontFamily: ANTON, fontSize: 20, color: lead ? C.gold : '#555', textAlign: 'center' }}>{rank + 1}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: ANTON, fontSize: 19, color: C.cream, letterSpacing: '0.03em', lineHeight: 1.1 }}>{p.name.toUpperCase()}</div>
              <div style={{ fontFamily: WS, fontSize: 12, lineHeight: 1.45, marginTop: 3 }}>
                <span style={{ fontWeight: 700, color: col }}>{signed(r.pts)} this match</span>
                <span style={{ color: '#888' }}> · {what}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: ANTON, fontSize: 28, lineHeight: 1, color: p.score >= 0 ? C.cream : C.accent }}>{signed(p.score)}</div>
              <div style={{ fontSize: 11, marginTop: 3 }}><Hearts n={p.hearts} /></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Leaderboard({ players, withTitles = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rankPlayers(players).map((p, rank) => {
        const t = getTitle(p.score)
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14, background: C.card, border: rank === 0 ? `1px solid ${C.gold}66` : hairline, borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span style={{ fontFamily: ANTON, fontSize: 18, color: rank === 0 ? C.gold : '#555', minWidth: 14 }}>{rank + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: ANTON, fontSize: 18, color: C.cream, letterSpacing: '0.03em' }}>{p.name.toUpperCase()}</div>
                {withTitles && <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 12, color: C.accent, marginTop: 2 }}>{titleCase(t.title)}</div>}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: ANTON, fontSize: 22, color: p.score >= 0 ? C.teal : C.accent }}>{signed(p.score)}</div>
              <div style={{ fontSize: 11 }}><Hearts n={p.hearts} /></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── FINAL: everyone gets a title from their score ────────────────────────────
function FinalScreen({ state, dispatch, onClose }) {
  const ranked  = rankPlayers(state.players)
  const top     = ranked[0]
  const winners = ranked.filter(p => p.score === top.score && p.hearts === top.hearts)
  const title   = getTitle(top.score)

  return (
    <Screen center footer={
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
          style={{ fontFamily: WS, fontWeight: 700, background: 'transparent', color: C.cream, fontSize: 15, letterSpacing: '0.12em', border: '1px solid #3a3535', minHeight: 52, borderRadius: 6, cursor: 'pointer' }}>PLAY AGAIN</button>
        <button onClick={onClose} style={primaryBtn(true)}>EXIT</button>
      </div>
    }>
      <div style={{ textAlign: 'center', marginBottom: 20, padding: '22px 18px', background: C.card, border: `1px solid ${C.gold}66`, borderRadius: 10 }}>
        <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.gold }}>{winners.length > 1 ? "It's a tie" : 'Winner'}</div>
        <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(30px,9vw,40px)', lineHeight: 0.95, marginTop: 6 }}>{winners.map(w => w.name.toUpperCase()).join(' & ')}</div>
        <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>{title.title}</div>
        <p style={{ fontFamily: WS, fontSize: 13, color: '#999', margin: '10px 0 0' }}>{title.desc}</p>
        <div style={{ fontFamily: WS, fontWeight: 600, fontSize: 13, color: C.teal, marginTop: 10 }}>{top.score} points · <Hearts n={top.hearts} /></div>
      </div>

      <Label>Everyone's title</Label>
      <Leaderboard players={state.players} withTitles />
      <p style={{ fontFamily: WS, fontSize: 12, color: '#666', lineHeight: 1.6, marginTop: 14, textAlign: 'center' }}>
        18+ The Catch · 10–17 The Romantic · 1–9 The Situationship · 0 or less The Red Flag Magnet · Ties go to whoever kept more hearts
      </p>
    </Screen>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchGame({ onClose }) {
  const [state, dispatch] = useReducer(reducer, INIT)

  return (
    <div style={{ fontFamily: WS, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', padding: '0 20px', background: C.bg, borderBottom: hairline, height: 48 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
          ← Back
        </button>
        {/* Absolutely centred so the Back button's width doesn't push it off-centre */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <CatchWordmark size={14} accent={C.accent} cream={C.cream} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {state.screen === 'setup'        && <SetupScreen dispatch={dispatch} />}
        {state.screen === 'round'        && <RoundScreen state={state} dispatch={dispatch} />}
        {state.screen === 'score'        && <ScoreScreen key={state.round} state={state} dispatch={dispatch} />}
        {state.screen === 'match_result' && <MatchResultScreen state={state} dispatch={dispatch} />}
        {state.screen === 'final'        && <FinalScreen state={state} dispatch={dispatch} onClose={onClose} />}
      </div>
    </div>
  )
}

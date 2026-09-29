import { useState, useEffect, useCallback, useRef } from 'react'
import { generateProfiles, PLAYER_TYPES, LOOKING_FOR, getTitle } from '../data/catchProfiles'
import { ROUNDS, HEARTS, GHOSTS, STALKS, scoreMatch, rankPlayers } from '../data/catchRules'
import { useGameRoom } from '../hooks/useGameRoom'
import { CatchWordmark, CatchHero } from './CatchBrand'
import { TraitCardFront, TraitCardBack } from './CatchCards'
import { Doll, DOLL_BG } from './DollCharacters'

// The Catch — online mode. Same rules as the table game, but with no physical
// deck: every phone is dealt the round's trait cards digitally (drawn like the
// printed ones). Tap a face-down card to spend a stalk token and flip it for you
// only. Everyone picks DATE or GHOST in secret; the host's phone scores it.

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#131011', card: '#1E1A1B', cardAlt: '#2C2729',
  accent: '#FF4D6D', teal: '#7CE0A8', gold: '#E4C46A',
  cream: '#EFE6DC', velvet: '#3B2E4A',
}
const ANTON = "'Anton', sans-serif"
const WS    = "'Work Sans', sans-serif"
const hair  = `1px solid rgba(239,230,220,0.08)`

// ─── Utilities ────────────────────────────────────────────────────────────────
function genCode() {
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  return Array.from({ length: 4 }, () => c[Math.floor(Math.random() * c.length)]).join('')
}
function signed(n) { return n > 0 ? `+${n}` : n === 0 ? '±0' : `${n}` }

function makePlayer(id, name, typeId) {
  return { id, name, typeId, score: 0, hearts: HEARTS, ghosts: GHOSTS, stalks: STALKS, dates: 0, redFlags: 0 }
}

function cardsOf(profile) {
  return {
    faceUp:   profile.traits.filter(t => t.startVisible),
    faceDown: profile.traits.filter(t => !t.startVisible),
  }
}

// The player's type-adjusted sum of all six cards (what they'd add up at the table)
function cardTotal(profile, typeId) {
  const type = PLAYER_TYPES.find(t => t.id === typeId)
  return profile.traits.reduce((s, t) => s + (type ? type.adjust(t.value) : t.value), 0)
}

// ─── Host-side game logic (pure: state in, state out) ────────────────────────
function newGame(players, lookingFor) {
  return { phase: 'deciding', round: 0, profiles: generateProfiles(ROUNDS, [], [], lookingFor).slice(0, ROUNDS), players, decisions: {}, peeks: {}, results: null }
}

function scoreRound(st) {
  const profile = st.profiles[st.round]
  const decisions = Object.fromEntries(st.players.map(p => {
    const action = st.decisions[p.id]?.action ?? 'ghost'
    return [p.id, { action, total: cardTotal(profile, p.typeId) }]
  }))
  const { players, results } = scoreMatch(st.players, decisions, profile.isCatfish === true)
  return { ...st, phase: 'scored', players, results }
}

function applyDecision(st, pid, action) {
  if (!st || st.phase !== 'deciding' || st.decisions[pid]) return st
  const me = st.players.find(p => p.id === pid)
  if (!me || (action === 'ghost' && me.ghosts <= 0) || !['date', 'ghost'].includes(action)) return st
  const next = { ...st, decisions: { ...st.decisions, [pid]: { action } } }
  return st.players.every(p => next.decisions[p.id]) ? scoreRound(next) : next
}

function applyStalk(st, pid, idx) {
  if (!st || st.phase !== 'deciding' || st.decisions[pid]) return st
  const me     = st.players.find(p => p.id === pid)
  const hidden = cardsOf(st.profiles[st.round]).faceDown
  const mine   = st.peeks[pid] ?? []
  if (!me || me.stalks <= 0 || mine.includes(idx) || idx < 0 || idx >= hidden.length) return st
  return {
    ...st,
    peeks: { ...st.peeks, [pid]: [...mine, idx] },
    players: st.players.map(p => p.id === pid ? { ...p, stalks: p.stalks - 1 } : p),
  }
}

function advance(st) {
  if (!st || st.phase !== 'scored') return st
  if (st.round >= ROUNDS - 1) return { ...st, phase: 'results' }
  return { ...st, phase: 'deciding', round: st.round + 1, decisions: {}, peeks: {}, results: null }
}

// ─── Shared design primitives ─────────────────────────────────────────────────
function Btn({ children, onClick, color = C.accent, outline = false, disabled = false, style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em',
        padding: '14px 24px', border: outline ? `1px solid ${color}55` : 'none', borderRadius: 6,
        background: disabled ? '#252020' : outline ? `${color}12` : color,
        color: disabled ? '#3a3535' : outline ? color : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer', width: '100%',
        textTransform: 'uppercase', ...style,
      }}
    >{children}</button>
  )
}

function Input({ value, onChange, placeholder, maxLength = 20, style = {} }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        fontFamily: WS, fontWeight: 500, fontSize: 14, color: C.cream,
        background: C.card, border: `1px solid rgba(239,230,220,0.15)`, borderRadius: 4,
        padding: '12px 14px', width: '100%', outline: 'none', boxSizing: 'border-box',
        letterSpacing: '0.04em', ...style,
      }}
    />
  )
}

function TypePicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {PLAYER_TYPES.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', borderRadius: 4,
            padding: '11px 14px', border: `1px solid ${value === t.id ? C.accent + '88' : 'rgba(239,230,220,0.08)'}`,
            background: value === t.id ? `${C.accent}18` : C.card,
            color: value === t.id ? C.cream : 'rgba(239,230,220,0.45)',
            cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 18 }}>{t.emoji}</span>
          <div style={{ color: value === t.id ? C.cream : 'rgba(239,230,220,0.45)' }}>{t.label}</div>
        </button>
      ))}
    </div>
  )
}

function RoomCode({ code }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 6, padding: '20px 24px', textAlign: 'center', marginBottom: 20 }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', marginBottom: 8 }}>ROOM CODE</div>
      <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,14vw,72px)', color: C.accent, letterSpacing: '0.18em', lineHeight: 1 }}>{code}</div>
      <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', marginTop: 8, letterSpacing: '0.08em' }}>
        Share this code — others open the game and tap JOIN
      </div>
    </div>
  )
}

function Hearts({ n }) {
  return <span>{Array.from({ length: HEARTS }, (_, i) => <span key={i} style={{ color: C.accent, opacity: i < n ? 1 : 0.18 }}>♥</span>)}</span>
}

function Leaderboard({ players, myId, withTitles = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rankPlayers(players).map((p, rank) => {
        const type = PLAYER_TYPES.find(t => t.id === p.typeId)
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 14px', background: rank === 0 ? `${C.gold}12` : C.card, border: rank === 0 ? `1px solid ${C.gold}55` : p.id === myId ? `1px solid ${C.accent}44` : hair, borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span style={{ fontFamily: ANTON, fontSize: 13, color: rank === 0 ? C.gold : '#444', minWidth: 20 }}>#{rank + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{p.name}{p.id === myId ? ' (you)' : ''}</div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: withTitles ? C.accent : '#555', letterSpacing: '0.12em', marginTop: 2 }}>
                  {withTitles ? getTitle(p.score).title : `${type?.emoji ?? ''} ${type?.label ?? ''}`}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: ANTON, fontSize: 20, color: p.score >= 0 ? C.teal : C.accent }}>{signed(p.score)}</div>
              <div style={{ fontSize: 9 }}><Hearts n={p.hearts} /></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Profile header: who's on the market this round ───────────────────────────
function ProfileHeader({ profile }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: hair, background: C.card, marginBottom: 14 }}>
      <div style={{ position: 'relative', height: 150, overflow: 'hidden', background: profile.doll ? DOLL_BG[profile.doll] : '#111', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {profile.doll
          ? <div style={{ transform: 'scale(1.3)', transformOrigin: 'top center', marginTop: -6 }}><Doll name={profile.doll} /></div>
          : <span style={{ fontSize: 64, lineHeight: 1, display: 'flex', alignItems: 'center', height: '100%' }}>{profile.emoji}</span>}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '44px 14px 10px', background: 'linear-gradient(to top,rgba(0,0,0,0.96),transparent)' }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 24, lineHeight: 1 }}>{profile.name.toUpperCase()}, {profile.age}</div>
          {profile.archetype && <div style={{ fontFamily: WS, fontWeight: 700, color: C.gold, fontSize: 10, letterSpacing: '0.2em', marginTop: 3 }}>{profile.archetype.toUpperCase()}</div>}
        </div>
      </div>
    </div>
  )
}

// ─── The dealt hand: 2 face-up + 4 face-down trait cards ─────────────────────
// `peeked` = face-down indexes this player has stalked. `revealAll` flips the
// whole hand (after everyone decides), staggered like cards turned one by one.
function Hand({ profile, peeked = [], revealAll = false, onStalk }) {
  const { faceUp, faceDown } = cardsOf(profile)
  const cell = (key, node, extra = {}) => <div key={key} style={{ position: 'relative', ...extra }}>{node}</div>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {faceUp.map((t, i) => cell(`u${i}`, <TraitCardFront compact no={t.card} text={t.text} value={t.value} />))}
      {faceDown.map((t, i) => {
        const open = revealAll || peeked.includes(i)
        if (open) {
          return cell(`d${i}`, <>
            <TraitCardFront compact no={t.card} text={t.text} value={t.value} />
            {peeked.includes(i) && (
              <span style={{ position: 'absolute', top: -6, right: -4, fontFamily: WS, fontWeight: 700, fontSize: 7, letterSpacing: '0.12em', color: '#131011', background: C.gold, padding: '2px 5px', borderRadius: 2 }}>🔍 STALKED</span>
            )}
          </>, revealAll ? { animation: `catch-card-flip 0.45s ease ${0.15 + i * 0.35}s both` } : { animation: 'catch-card-flip 0.35s ease both' })
        }
        return cell(`d${i}`,
          <button onClick={onStalk ? () => onStalk(i) : undefined} disabled={!onStalk}
            style={{ all: 'unset', display: 'block', width: '100%', cursor: onStalk ? 'pointer' : 'default' }}
            aria-label={onStalk ? 'Stalk this card' : 'Face-down card'}>
            <TraitCardBack compact />
          </button>)
      })}
    </div>
  )
}

// ─── How to play (online only — at the table the rules are on the printed sheet)
const HOW_TO = [
  ['Meet them', "Everyone sees the same profile and is dealt the same 6 trait cards: 2 face-up, 4 face-down."],
  ['Stalk', 'Tap a face-down card to spend a stalk token. It flips for you only. 3 per game.'],
  ['Decide', 'Tap DATE or GHOST in secret. 3 ghosts per game — when they\'re gone, you have to date.'],
  ['Reveal', 'When everyone is in, every card flips and your phone adds them up for your type.'],
  ['Win', 'After 7 matches the highest total wins, and everyone gets a title from their score.'],
]
const HOW_TO_RULES = 'A negative date costs a heart · −5 or worse: −2 more · 7+ as the only dater: +2 · at 0 hearts good dates count half · one secret catfish: dated −4 & a heart, ghosted +1'

function HowToPlay() {
  return (
    <div style={{ background: C.card, border: hair, borderRadius: 6, padding: '14px 14px 12px', marginTop: 18 }}>
      <div style={{ fontFamily: ANTON, fontSize: 14, color: C.accent, letterSpacing: '0.1em', marginBottom: 10 }}>HOW TO PLAY</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HOW_TO.map(([title, text], i) => (
          <div key={title} style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontFamily: ANTON, fontSize: 15, color: C.accent, lineHeight: 1.1, minWidth: 12 }}>{i + 1}</span>
            <div style={{ fontFamily: WS, fontSize: 12, color: 'rgba(239,230,220,0.75)', lineHeight: 1.45 }}>
              <b style={{ color: C.cream }}>{title}.</b> {text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10.5, color: '#888', lineHeight: 1.5, marginTop: 10, paddingTop: 8, borderTop: hair }}>{HOW_TO_RULES}</div>
    </div>
  )
}

// ─── Scroll / nav / frame ─────────────────────────────────────────────────────
function Scroll({ children, style = {} }) {
  return <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 0, ...style }}>{children}</div>
}

function Nav({ left, center, right }) {
  return (
    <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', background: 'rgba(19,16,17,0.95)', borderBottom: hair, flexShrink: 0 }}>
      <div style={{ flex: 1, minWidth: 60 }}>{left}</div>
      <div style={{ fontFamily: ANTON, fontSize: 12, color: C.accent, letterSpacing: '0.14em' }}>{center}</div>
      <div style={{ flex: 1, minWidth: 60, textAlign: 'right' }}>{right}</div>
    </div>
  )
}

function Frame({ children, onClose, title, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: C.bg, overflow: 'hidden' }}>
      <style>{`@keyframes catch-card-flip { from { transform: rotateY(90deg); opacity: 0.2 } to { transform: rotateY(0deg); opacity: 1 } }`}</style>
      <Nav
        left={<button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Back</button>}
        center={title}
        right={right}
      />
      {children}
    </div>
  )
}

function Footer({ children }) {
  return <div style={{ padding: '10px 14px 14px', borderTop: hair, flexShrink: 0, background: C.bg }}>{children}</div>
}

function SectionLabel({ children, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{children}</div>
      {right}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOST — owns the game state, scores rounds, broadcasts to everyone
// ═══════════════════════════════════════════════════════════════════════════════
function HostGame({ onClose }) {
  const [screen, setScreen]       = useState('setup')    // setup | lobby | game
  const [myName, setMyName]       = useState('')
  const [myType, setMyType]       = useState(PLAYER_TYPES[0].id)
  const [lookingFor, setLookingFor] = useState('everyone')
  const [roomCode]                = useState(genCode)
  const [gameState, setGameState] = useState(null)
  const [lobbyPlayers, setLobbyPlayers] = useState([])
  const roomRef = useRef(null)   // the room is created below; messages only arrive after that

  const handleMessage = useCallback((data, fromId) => {
    if (data.type === 'JOIN_LOBBY') {
      const p = { id: fromId, name: data.name, typeId: data.typeId }
      setLobbyPlayers(prev => prev.find(x => x.id === fromId) ? prev : [...prev, p])
      roomRef.current?.broadcast({ type: 'LOBBY_STATE', players: [...lobbyPlayers, p] })
    }
    if (data.type === 'DECISION') setGameState(prev => applyDecision(prev, fromId, data.action))
    if (data.type === 'STALK')    setGameState(prev => applyStalk(prev, fromId, data.idx))
  }, [lobbyPlayers]) // eslint-disable-line

  const handlePeerLeave = useCallback(pid => {
    setLobbyPlayers(prev => prev.filter(p => p.id !== pid))
  }, [])

  const room = useGameRoom({ isHost: true, roomCode, onMessage: handleMessage, onPeerLeave: handlePeerLeave })
  useEffect(() => { roomRef.current = room })

  // Every state change goes out to all phones
  useEffect(() => {
    if (gameState) room.broadcast({ type: 'GAME_STATE', state: gameState })
  }, [gameState]) // eslint-disable-line

  function startGame() {
    const host   = makePlayer('host', myName.trim(), myType)
    const others = lobbyPlayers.map(lp => makePlayer(lp.id, lp.name, lp.typeId))
    setGameState(newGame([host, ...others], lookingFor))
    setScreen('game')
  }

  if (screen === 'setup') {
    return (
      <Frame onClose={onClose} title="HOST GAME">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            <SectionLabel>Your Name</SectionLabel>
            <Input value={myName} onChange={setMyName} placeholder="Enter your name" style={{ marginBottom: 20 }} />
            <SectionLabel>Your Player Type</SectionLabel>
            <TypePicker value={myType} onChange={setMyType} />
            <div style={{ marginTop: 20 }}>
              <SectionLabel>Looking for (the whole room)</SectionLabel>
              <div style={{ display: 'flex', gap: 6 }}>
                {LOOKING_FOR.map(l => (
                  <button key={l.id} onClick={() => setLookingFor(l.id)}
                    style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', minHeight: 42, borderRadius: 6, cursor: 'pointer', background: lookingFor === l.id ? C.accent : 'transparent', color: lookingFor === l.id ? '#fff' : '#999', border: `1px solid ${lookingFor === l.id ? C.accent : '#3a3535'}` }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Scroll>
        <Footer><Btn onClick={() => myName.trim() && setScreen('lobby')} disabled={!myName.trim()}>CREATE ROOM →</Btn></Footer>
      </Frame>
    )
  }

  if (screen === 'lobby') {
    const typeOf = id => PLAYER_TYPES.find(t => t.id === id)
    return (
      <Frame onClose={onClose} title="HOST — LOBBY">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            {room.status === 'connecting' && <div style={{ fontFamily: WS, fontSize: 12, color: '#555', textAlign: 'center', marginBottom: 16 }}>Connecting…</div>}
            {room.status === 'room-taken' && <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, textAlign: 'center', marginBottom: 16 }}>Room code taken — refresh to get a new one.</div>}
            {room.status === 'open' && <RoomCode code={roomCode} />}

            <SectionLabel>{lobbyPlayers.length + 1} PLAYER{lobbyPlayers.length !== 0 ? 'S' : ''} IN THE ROOM</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ padding: '10px 14px', background: `${C.accent}14`, border: `1px solid ${C.accent}33`, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{typeOf(myType)?.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{myName}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#777' }}>HOST · {typeOf(myType)?.label}</div>
                </div>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.12em' }}>YOU</span>
              </div>
              {lobbyPlayers.map(lp => (
                <div key={lp.id} style={{ padding: '10px 14px', background: C.card, border: hair, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{typeOf(lp.typeId)?.emoji || '👤'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{lp.name}</div>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#777' }}>{typeOf(lp.typeId)?.label || 'JOINING…'}</div>
                  </div>
                  <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.1em' }}>READY</span>
                </div>
              ))}
            </div>
            {lobbyPlayers.length === 0 && (
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', textAlign: 'center', padding: '20px 0' }}>Waiting for players to join…</div>
            )}
            <HowToPlay />
          </div>
        </Scroll>
        <Footer>
          <Btn onClick={startGame} disabled={lobbyPlayers.length === 0 || room.status !== 'open'}>
            {lobbyPlayers.length === 0 ? 'NEED AT LEAST 2 PLAYERS' : `START WITH ${lobbyPlayers.length + 1} PLAYERS →`}
          </Btn>
        </Footer>
      </Frame>
    )
  }

  if (screen === 'game' && gameState) {
    return (
      <GameScreen
        gameState={gameState}
        myId="host"
        onDecide={action => setGameState(prev => applyDecision(prev, 'host', action))}
        onStalk={idx => setGameState(prev => applyStalk(prev, 'host', idx))}
        onNext={() => setGameState(advance)}
        onClose={onClose}
      />
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT — sends decisions/stalks to the host, renders whatever state comes back
// ═══════════════════════════════════════════════════════════════════════════════
function ClientGame({ onClose }) {
  const [screen, setScreen]       = useState('code')   // code | setup | waiting (the game shows once state arrives)
  const [codeInput, setCodeInput] = useState('')
  const [myName, setMyName]       = useState('')
  const [myType, setMyType]       = useState(PLAYER_TYPES[0].id)
  const [roomCode, setRoomCode]   = useState(null)
  const [gameState, setGameState] = useState(null)

  const handleMessage = useCallback(data => {
    if (data.type === 'GAME_STATE') setGameState(data.state)
  }, [])

  const room = useGameRoom({ isHost: false, roomCode, onMessage: handleMessage })
  const myId = room.myPeerId

  const connErr = room.status === 'error' ? 'Could not connect. Check the room code and try again.'
                : room.status === 'disconnected' ? 'Lost connection to host.' : null

  // Join once the connection to the host itself is open (not just the signalling
  // server) — sending earlier silently drops the message.
  const hostConnected = room.connectedIds.includes('host')
  useEffect(() => {
    if (hostConnected && screen === 'waiting') room.sendToHost({ type: 'JOIN_LOBBY', name: myName.trim(), typeId: myType })
  }, [hostConnected, screen]) // eslint-disable-line

  if (screen === 'code') {
    return (
      <Frame onClose={onClose} title="JOIN GAME">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            <SectionLabel>Room Code</SectionLabel>
            <Input value={codeInput} onChange={v => setCodeInput(v.toUpperCase().slice(0, 4))} placeholder="4-letter code" maxLength={4}
              style={{ fontSize: 28, letterSpacing: '0.3em', textAlign: 'center', marginBottom: 20 }} />
            {connErr && <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, marginBottom: 12 }}>{connErr}</div>}
          </div>
        </Scroll>
        <Footer><Btn onClick={() => { setRoomCode(codeInput.trim().toUpperCase()); setScreen('setup') }} disabled={codeInput.trim().length !== 4}>NEXT →</Btn></Footer>
      </Frame>
    )
  }

  if (screen === 'setup') {
    return (
      <Frame onClose={onClose} title={`JOIN — ${roomCode}`}>
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            <SectionLabel>Your Name</SectionLabel>
            <Input value={myName} onChange={setMyName} placeholder="Enter your name" style={{ marginBottom: 20 }} />
            <SectionLabel>Your Player Type</SectionLabel>
            <TypePicker value={myType} onChange={setMyType} />
          </div>
        </Scroll>
        <Footer><Btn onClick={() => myName.trim() && setScreen('waiting')} disabled={!myName.trim()}>JOIN ROOM →</Btn></Footer>
      </Frame>
    )
  }

  if (screen === 'waiting' && !gameState) {
    return (
      <Frame onClose={onClose} title={`ROOM ${roomCode}`}>
        <Scroll>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px 20px' }}>
          <div style={{ fontFamily: ANTON, fontSize: 28, color: C.teal, letterSpacing: '0.12em', marginBottom: 12 }}>READY</div>
          <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.55)', textAlign: 'center', lineHeight: 1.6 }}>Waiting for the host to start the game…</div>
          {room.status === 'connecting' && <div style={{ fontFamily: WS, fontSize: 11, color: '#555', marginTop: 16 }}>Connecting to room {roomCode}…</div>}
          {connErr && <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, marginTop: 12 }}>{connErr}</div>}
          <div style={{ marginTop: 24, padding: '10px 20px', background: C.card, border: hair, borderRadius: 4 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.16em', marginBottom: 4 }}>JOINED AS</div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 14, color: C.cream }}>{myName}</div>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#777' }}>{PLAYER_TYPES.find(t => t.id === myType)?.label}</div>
          </div>
          <div style={{ width: '100%' }}><HowToPlay /></div>
        </div>
        </Scroll>
      </Frame>
    )
  }

  if (gameState) {
    return (
      <GameScreen
        gameState={gameState}
        myId={myId}
        onDecide={action => room.sendToHost({ type: 'DECISION', action })}
        onStalk={idx => room.sendToHost({ type: 'STALK', idx })}
        onNext={null}
        onClose={onClose}
      />
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME SCREEN — the same view on every phone
// ═══════════════════════════════════════════════════════════════════════════════
function GameScreen({ gameState, myId, onDecide, onStalk, onNext, onClose }) {
  const { phase, round, profiles, players, decisions, peeks, results } = gameState
  const me       = players.find(p => p.id === myId)
  const profile  = profiles[round]
  const isHost   = !!onNext
  const hearts   = <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10 }}><Hearts n={me?.hearts ?? 0} /></span>
  const title    = `MATCH ${round + 1} / ${ROUNDS}`

  // ── DECIDING: look at the profile + your hand, stalk, then date or ghost ───
  if (phase === 'deciding') {
    const decided = decisions[myId]
    const myPeeks = peeks[myId] ?? []
    const canStalk = !decided && (me?.stalks ?? 0) > 0
    const waitingOn = players.filter(p => !decisions[p.id])
    return (
      <Frame onClose={onClose} title={title} right={hearts}>
        <Scroll style={{ padding: '14px 14px 16px' }}>
          <ProfileHeader profile={profile} />
          <SectionLabel right={<span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold, letterSpacing: '0.1em' }}>🔍 {me?.stalks ?? 0} STALK{(me?.stalks ?? 0) === 1 ? '' : 'S'} LEFT</span>}>
            Your trait cards
          </SectionLabel>
          <Hand profile={profile} peeked={myPeeks} onStalk={canStalk ? onStalk : null} />
          {round === 0 && <HowToPlay />}
          <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#777', marginTop: 10, textAlign: 'center' }}>
            {decided ? 'Cards flip once everyone has decided.'
              : canStalk ? 'Tap a face-down card to stalk it — only you see it.'
              : (me?.stalks ?? 0) === 0 ? 'Out of stalk tokens.' : ''}
          </div>
        </Scroll>
        <Footer>
          {decided ? (
            <div style={{ textAlign: 'center', padding: '4px 0' }}>
              <div style={{ fontFamily: ANTON, fontSize: 15, color: C.teal, letterSpacing: '0.12em' }}>{decided.action === 'date' ? '♥ DATE' : '◌ GHOST'} — LOCKED IN</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#777', marginTop: 4 }}>
                Waiting on {waitingOn.map(p => p.name).join(', ')}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => onDecide('date')} style={{ flex: 1, boxShadow: '0 0 20px rgba(255,77,109,0.3)' }}>♥ DATE</Btn>
              <Btn onClick={() => onDecide('ghost')} outline color="#aaa" disabled={(me?.ghosts ?? 0) <= 0} style={{ flex: 1 }}>
                ◌ GHOST · {me?.ghosts ?? 0}
              </Btn>
            </div>
          )}
        </Footer>
      </Frame>
    )
  }

  // ── SCORED: every card flips, results + leaderboard ────────────────────────
  if (phase === 'scored') {
    const mine = results?.[myId]
    const last = round >= ROUNDS - 1
    return (
      <Frame onClose={onClose} title={title} right={hearts}>
        <Scroll style={{ padding: '14px 14px 16px' }}>
          {profile.isCatfish && (
            <div style={{ background: '#0d1a10', border: `1px solid ${C.teal}44`, borderRadius: 6, padding: '12px 14px', marginBottom: 14, textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 18, color: C.teal, letterSpacing: '0.08em' }}>🎣 {profile.name.toUpperCase()} WAS THE CATFISH</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#9ab', marginTop: 4 }}>Dated them: −4 and a heart. Ghosted them: +1.</div>
            </div>
          )}
          {mine && (
            <div style={{ textAlign: 'center', padding: '4px 0 14px' }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#666', letterSpacing: '0.2em' }}>
                YOU {mine.action === 'date' ? `DATED ${profile.name.toUpperCase()} · CARDS ${signed(mine.raw)}` : `GHOSTED ${profile.name.toUpperCase()}`}
              </div>
              <div style={{ fontFamily: ANTON, fontSize: 'clamp(52px,16vw,68px)', lineHeight: 1, color: mine.pts > 0 ? C.teal : mine.pts < 0 ? C.accent : '#666', marginTop: 4 }}>{signed(mine.pts)}</div>
              {mine.notes.length > 0 && <div style={{ fontFamily: WS, fontSize: 11, color: '#999', marginTop: 4 }}>{mine.notes.join(' · ')}</div>}
            </div>
          )}
          <SectionLabel>{profile.name}'s cards</SectionLabel>
          <Hand profile={profile} peeked={peeks[myId] ?? []} revealAll />

          <div style={{ marginTop: 18 }}>
            <SectionLabel>This match</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {players.map(p => {
                const r = results[p.id]
                return (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '8px 12px', background: C.card, border: hair, borderRadius: 4 }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color: C.cream }}>{p.name}</span>
                      <span style={{ fontFamily: WS, fontSize: 11, color: '#777' }}> — {r.action === 'date' ? '♥ dated' : '◌ ghosted'}</span>
                      {r.notes.length > 0 && <div style={{ fontFamily: WS, fontSize: 10, color: '#888', marginTop: 2 }}>{r.notes.join(' · ')}</div>}
                    </div>
                    <span style={{ fontFamily: ANTON, fontSize: 18, color: r.pts > 0 ? C.teal : r.pts < 0 ? C.accent : '#666' }}>{signed(r.pts)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <SectionLabel>Leaderboard</SectionLabel>
            <Leaderboard players={players} myId={myId} />
          </div>
        </Scroll>
        <Footer>
          {isHost
            ? <Btn onClick={onNext}>{last ? 'SEE FINAL TITLES →' : 'NEXT MATCH →'}</Btn>
            : <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#777', textAlign: 'center', padding: '8px 0' }}>Waiting for the host to continue…</div>}
        </Footer>
      </Frame>
    )
  }

  // ── RESULTS: winner + everyone's title ─────────────────────────────────────
  if (phase === 'results') {
    const ranked  = rankPlayers(players)
    const top     = ranked[0]
    const winners = ranked.filter(p => p.score === top.score && p.hearts === top.hearts)
    const mineT   = me ? getTitle(me.score) : null
    return (
      <Frame onClose={onClose} title="FINAL TITLES">
        <Scroll style={{ padding: '14px 14px 16px' }}>
          <div style={{ textAlign: 'center', padding: 20, background: 'rgba(228,196,106,0.08)', border: `1px solid ${C.gold}88`, borderRadius: 12, marginBottom: 18 }}>
            <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 28, marginBottom: 8 }} />
            <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 11, letterSpacing: '0.2em' }}>♛ {winners.length > 1 ? "IT'S A TIE" : 'WINNER'}</div>
            <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 26, lineHeight: 1.05, marginTop: 6 }}>{winners.map(w => w.name.toUpperCase()).join(' & ')}</div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color: C.teal, marginTop: 6 }}>{top.score} LOVE POINTS</div>
          </div>
          {mineT && (
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#666', letterSpacing: '0.2em' }}>YOUR TITLE</div>
              <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>{mineT.title}</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#999', marginTop: 6 }}>{mineT.desc}</div>
            </div>
          )}
          <SectionLabel>Everyone's title</SectionLabel>
          <Leaderboard players={players} myId={myId} withTitles />
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', lineHeight: 1.6, marginTop: 14 }}>
            18+ The Catch · 10–17 The Romantic · 1–9 The Situationship · 0 or less The Red Flag Magnet. Ties go to whoever kept more hearts.
          </p>
        </Scroll>
        <Footer><Btn onClick={onClose} outline>← BACK TO PORTFOLIO</Btn></Footer>
      </Frame>
    )
  }

  return (
    <Frame onClose={onClose} title={<CatchWordmark size={12} accent={C.accent} cream={C.cream} />}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555' }}>Loading…</div>
      </div>
    </Frame>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE SELECT + ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════
export default function TheCatchOnline({ onClose }) {
  const [role, setRole] = useState(null) // null | 'host' | 'join'

  if (role === 'host') return <HostGame onClose={onClose} />
  if (role === 'join') return <ClientGame onClose={onClose} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: C.bg }}>
      <Nav
        left={<button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Back</button>}
        center="ONLINE MULTIPLAYER"
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 40px', textAlign: 'center' }}>
        <CatchHero maxWidth={320} subtitle="SEPARATE DEVICES · ONLINE" subtitleColor="rgba(239,230,220,0.38)" style={{ marginBottom: 40 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
          <button onClick={() => setRole('host')}
            style={{ fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', padding: '16px 24px', background: C.accent, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 32px rgba(255,77,109,0.3)' }}>
            CREATE A ROOM
          </button>
          <button onClick={() => setRole('join')}
            style={{ fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', padding: '16px 24px', background: 'transparent', color: C.cream, border: '1px solid rgba(239,230,220,0.2)', borderRadius: 6, cursor: 'pointer' }}>
            JOIN A ROOM
          </button>
        </div>
        <div style={{ marginTop: 32, fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', lineHeight: 1.7, maxWidth: 280 }}>
          No deck needed. Everyone's dealt the same trait cards on their own phone — stalk a card with a tap, then date or ghost in secret.
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateProfiles, PLAYER_TYPES, THE_ONE_PROFILE, TRAIT_POOL } from '../data/catchProfiles'
import { useGameRoom, hostPeerId } from '../hooks/useGameRoom'

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
function uid() { return Math.random().toString(36).slice(2, 9) }

function scoreProfile(profile, typeId) {
  const type = PLAYER_TYPES.find(t => t.id === typeId)
  return profile.traits.reduce((s, t) => s + (type ? type.adjust(t.value) : t.value), 0)
}

function makePlayer(id, name, typeId) {
  return {
    id, name, typeId,
    score: 0, hearts: 3,
    ghostsLeft: 3, stalkTokens: 3,
    hasStolen: false, hasTherapy: false,
    skipNext: false,
    achievements: [],
  }
}

// ─── Shared design primitives ─────────────────────────────────────────────────
function Btn({ children, onClick, color = C.accent, outline = false, disabled = false, style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em',
        padding: '12px 24px', border: outline ? `1px solid ${color}55` : 'none',
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
        background: C.card, border: `1px solid rgba(239,230,220,0.15)`,
        padding: '12px 14px', width: '100%', outline: 'none',
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
            fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
            padding: '11px 14px', border: `1px solid ${value === t.id ? C.accent + '88' : 'rgba(239,230,220,0.08)'}`,
            background: value === t.id ? `${C.accent}18` : C.card,
            color: value === t.id ? C.cream : 'rgba(239,230,220,0.45)',
            cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 18 }}>{t.emoji}</span>
          <div>
            <div style={{ color: value === t.id ? C.cream : 'rgba(239,230,220,0.45)' }}>{t.label}</div>
            <div style={{ fontWeight: 300, fontSize: 10, color: '#555', marginTop: 2 }}>{t.desc}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

function RoomCode({ code }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.accent}44`,
      padding: '20px 24px', textAlign: 'center', marginBottom: 20,
    }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', marginBottom: 8 }}>ROOM CODE</div>
      <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,14vw,72px)', color: C.accent, letterSpacing: '0.18em', lineHeight: 1 }}>{code}</div>
      <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#444', marginTop: 8, letterSpacing: '0.08em' }}>
        Share this code — others open the game and tap JOIN
      </div>
    </div>
  )
}

function PlayerRow({ player, rank, score, roundScore, showRound }) {
  const type = PLAYER_TYPES.find(t => t.id === player.typeId)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', background: C.card, border: hair, marginBottom: 4,
    }}>
      <div style={{ fontFamily: ANTON, fontSize: 13, color: rank === 1 ? C.gold : '#555', minWidth: 20 }}>
        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{player.name}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555' }}>{type?.emoji} {type?.label}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: ANTON, fontSize: 20, color: rank === 1 ? C.gold : C.cream }}>{score}</div>
        {showRound && roundScore != null && (
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: roundScore >= 0 ? C.teal : C.accent }}>
            {roundScore >= 0 ? '+' : ''}{roundScore}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} style={{ fontSize: 9, color: i < player.hearts ? C.accent : '#2a2525' }}>♥</span>
        ))}
      </div>
    </div>
  )
}

// ─── Trait row for profile card ────────────────────────────────────────────────
function TraitRow({ trait, revealed }) {
  if (!revealed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderLeft: `3px solid #2a2525`, marginBottom: 3, background: '#181415' }}>
        <span style={{ fontFamily: WS, fontSize: 12, color: '#2a2525', flex: 1 }}>?????</span>
        <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#2a2525' }}>?</span>
      </div>
    )
  }
  const col = trait.value > 0 ? C.teal : trait.value < 0 ? C.accent : C.gold
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', borderLeft: `3px solid ${col}`, marginBottom: 3, background: C.card }}>
      <span style={{ fontFamily: WS, fontSize: 12, color: 'rgba(239,230,220,0.8)', flex: 1, lineHeight: 1.4 }}>{trait.text}</span>
      <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: col, minWidth: 28, textAlign: 'right' }}>
        {trait.value > 0 ? `+${trait.value}` : trait.value}
      </span>
    </div>
  )
}

// ─── Profile card (visible in deciding/revealing) ──────────────────────────────
function ProfileCard({ profile, revealStep = -1, stalkedIdxs = [] }) {
  if (!profile) return null
  const hiddenTraits = profile.traits.filter(t => !t.startVisible)
  return (
    <div style={{ background: C.cardAlt, border: hair, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: hair }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{profile.emoji}</span>
          <div>
            <div style={{ fontFamily: ANTON, fontSize: 18, color: C.cream, letterSpacing: '0.06em' }}>{profile.name}</div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.16em' }}>{profile.archetype}</div>
          </div>
        </div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: 'rgba(239,230,220,0.45)', lineHeight: 1.5 }}>{profile.bio}</div>
      </div>
      {/* Traits */}
      <div style={{ padding: '10px 0' }}>
        {profile.traits.filter(t => t.startVisible).map((t, i) => (
          <TraitRow key={`v${i}`} trait={t} revealed />
        ))}
        {hiddenTraits.map((t, i) => (
          <TraitRow key={`h${i}`} trait={t} revealed={i < revealStep || stalkedIdxs.includes(i)} />
        ))}
      </div>
    </div>
  )
}

// ─── Timer bar ────────────────────────────────────────────────────────────────
function TimerBar({ seconds, total = 30 }) {
  const pct = Math.max(0, seconds / total)
  const col = pct > 0.5 ? C.teal : pct > 0.25 ? C.gold : C.accent
  return (
    <div style={{ height: 3, background: '#1a1818', marginBottom: 12 }}>
      <div style={{ height: '100%', width: `${pct * 100}%`, background: col, transition: 'width 1s linear, background 0.5s ease' }} />
    </div>
  )
}

// ─── Scroll wrapper ───────────────────────────────────────────────────────────
function Scroll({ children, style = {} }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', ...style }}>
      {children}
    </div>
  )
}

// ─── Nav bar ─────────────────────────────────────────────────────────────────
function Nav({ left, center, right }) {
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', background: 'rgba(19,16,17,0.95)',
      borderBottom: hair, flexShrink: 0,
    }}>
      <div style={{ minWidth: 60 }}>{left}</div>
      <div style={{ fontFamily: ANTON, fontSize: 12, color: C.accent, letterSpacing: '0.14em' }}>{center}</div>
      <div style={{ minWidth: 60, textAlign: 'right' }}>{right}</div>
    </div>
  )
}

// ─── Action button ─────────────────────────────────────────────────────────────
function ActionBtn({ icon, label, color, disabled, chosen, onClick, tag }) {
  return (
    <button
      onClick={disabled || chosen ? undefined : onClick}
      style={{
        flex: 1, padding: '10px 6px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4,
        border: chosen ? `1px solid ${color}` : disabled ? `1px solid #1e1a1b` : `1px solid ${color}44`,
        background: chosen ? `${color}22` : disabled ? 'transparent' : `${color}0a`,
        cursor: disabled || chosen ? 'default' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: chosen ? color : disabled ? '#2a2525' : color, letterSpacing: '0.12em' }}>{label}</span>
      {tag && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 7, color: '#444', letterSpacing: '0.1em' }}>{tag}</span>}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function HostGame({ onClose }) {
  const [screen, setScreen]       = useState('setup')    // setup | lobby | game | results
  const [myName, setMyName]       = useState('')
  const [myType, setMyType]       = useState(PLAYER_TYPES[0].id)
  const [roomCode]                = useState(genCode)
  const [gameState, setGameState] = useState(null)       // full game state
  const [lobbyPlayers, setLobbyPlayers] = useState([])   // players who joined lobby
  const pendingDecisionsRef       = useRef({})           // collected decisions not yet in state
  const revealTimerRef            = useRef(null)
  const autoStartTimerRef         = useRef(null)

  // ── Customization ─────────────────────────────────────────────────────────
  const [showCustomize, setShowCustomize] = useState(false)
  const [customTraits, setCustomTraits]   = useState([])
  const [customProfiles, setCustomProfiles] = useState([])
  const [ctText, setCtText]     = useState('')
  const [ctGreen, setCtGreen]   = useState(true)
  const [cpName, setCpName]     = useState('')
  const [cpTraitText, setCpTraitText] = useState('')
  const [cpGreen, setCpGreen]   = useState(true)
  const [cpTraits, setCpTraits] = useState([])
  const [showCpBuilder, setShowCpBuilder] = useState(false)

  function addCustomTrait() {
    const t = ctText.trim(); if (!t) return
    setCustomTraits(prev => [...prev, { text: t, value: ctGreen ? 2 : -2 }])
    setCtText('')
  }
  function addCpTrait() {
    const t = cpTraitText.trim(); if (!t) return
    setCpTraits(prev => [...prev, { text: t, value: cpGreen ? 2 : -2 }])
    setCpTraitText('')
  }
  function submitCustomProfile() {
    const name = cpName.trim(); if (!name || cpTraits.length < 2) return
    const sorted = [...cpTraits].sort((a, b) => Math.abs(a.value) - Math.abs(b.value))
    const traits = sorted.map((t, i) => ({ ...t, startVisible: i < 2 }))
    setCustomProfiles(prev => [...prev, { id: `cp_${Date.now()}`, name, age: 25, emoji: '👤', doll: null, archetype: 'CUSTOM PROFILE', tags: ['REAL PERSON', 'CUSTOM BUILD'], bio: 'Someone you actually know. Good luck.', traits, isCustom: true }])
    setCpName(''); setCpTraits([]); setCpTraitText(''); setShowCpBuilder(false)
  }

  // ── Room ──────────────────────────────────────────────────────────────────
  const handleMessage = useCallback((data, fromId) => {
    if (data.type === 'JOIN_LOBBY') {
      const p = { id: fromId, name: data.name, typeId: data.typeId }
      setLobbyPlayers(prev => {
        if (prev.find(x => x.id === fromId)) return prev
        return [...prev, p]
      })
      // Send back current player list
      room.broadcast({ type: 'LOBBY_STATE', players: [...lobbyPlayers, p] })
    }
    if (data.type === 'DECISION') {
      pendingDecisionsRef.current[fromId] = data
      setGameState(prev => {
        if (!prev || prev.phase !== 'deciding') return prev
        const newDecisions = { ...prev.decisions, [fromId]: data }
        const newSubmitted = Object.keys(newDecisions)
        const all = prev.players.filter(p => !p.skipNext).every(p => newSubmitted.includes(p.id))
        const next = { ...prev, decisions: newDecisions, submittedIds: newSubmitted }
        if (all) {
          clearTimeout(autoStartTimerRef.current)
          return startReveal(next)
        }
        return next
      })
    }
    if (data.type === 'THE_ONE_DECISION') {
      setGameState(prev => {
        if (!prev || prev.phase !== 'the_one') return prev
        const newD = { ...prev.theOneDecisions, [fromId]: data }
        const newS = Object.keys(newD)
        const all = (prev.qualifiedIds || []).every(id => newS.includes(id))
        const next = { ...prev, theOneDecisions: newD, theOneSubmitted: newS }
        if (all) return scoreTheOne(next)
        return next
      })
    }
  }, [lobbyPlayers]) // eslint-disable-line

  const handlePeerJoin  = useCallback(pid => {}, [])
  const handlePeerLeave = useCallback(pid => {
    setLobbyPlayers(prev => prev.filter(p => p.id !== pid))
  }, [])

  const room = useGameRoom({
    isHost: true, roomCode,
    onMessage: handleMessage,
    onPeerJoin: handlePeerJoin,
    onPeerLeave: handlePeerLeave,
  })

  // ── Broadcast whenever state changes ──────────────────────────────────────
  useEffect(() => {
    if (gameState) room.broadcast({ type: 'GAME_STATE', state: gameState })
  }, [gameState]) // eslint-disable-line

  // ── Auto-reveal loop ───────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(revealTimerRef.current)
    if (!gameState) return
    if (gameState.phase === 'revealing') {
      revealTimerRef.current = setTimeout(() => {
        setGameState(prev => {
          if (!prev || prev.phase !== 'revealing') return prev
          const profile   = prev.profiles[prev.round]
          const hidden    = profile.traits.filter(t => !t.startVisible)
          const nextStep  = prev.revealStep + 1
          if (nextStep >= hidden.length) return scoreRound(prev)
          return { ...prev, revealStep: nextStep }
        })
      }, 900)
    }
    if (gameState.phase === 'the_one_revealing') {
      revealTimerRef.current = setTimeout(() => {
        setGameState(prev => {
          if (!prev || prev.phase !== 'the_one_revealing') return prev
          const hidden    = THE_ONE_PROFILE.traits.filter(t => !t.startVisible)
          const nextStep  = prev.theOneRevealStep + 1
          if (nextStep >= hidden.length) return scoreTheOne(prev)
          return { ...prev, theOneRevealStep: nextStep }
        })
      }, 900)
    }
  }, [gameState?.phase, gameState?.revealStep, gameState?.theOneRevealStep]) // eslint-disable-line

  // ── Game logic helpers ─────────────────────────────────────────────────────
  function calcScore(profile, typeId, action, allPlayers, decisions) {
    if (action === 'ghost') return profile.isCatfish ? 1 : 0
    if (action === 'steal') {
      const others = allPlayers.filter(p => p.typeId !== typeId || p.score !== undefined)
        .sort((a, b) => b.score - a.score)
      return Math.min(3, Math.max(0, others[0]?.score ?? 0))
    }
    const type = PLAYER_TYPES.find(t => t.id === typeId)
    let s = profile.traits.reduce((sum, t) => sum + (type ? type.adjust(t.value) : t.value), 0)
    if (profile.isCatfish && (action === 'date' || action === 'double_date')) s -= 4
    if (action === 'double_date') {
      const ddCount = Object.values(decisions || {}).filter(d => d.action === 'double_date').length
      if (ddCount >= 2) s = Math.floor(s / ddCount)
    }
    return s
  }

  function startReveal(st) {
    return { ...st, phase: 'revealing', revealStep: 0 }
  }

  function scoreRound(st) {
    const profile    = st.profiles[st.round]
    const roundScores = {}

    // Identify steal victims
    const stealDeductions = {}
    st.players.forEach(p => {
      if (st.decisions[p.id]?.action === 'steal') {
        const victim = [...st.players].filter(x => x.id !== p.id).sort((a, b) => b.score - a.score)[0]
        if (victim) {
          const stolen = Math.min(3, Math.max(0, victim.score))
          stealDeductions[victim.id] = (stealDeductions[victim.id] || 0) + stolen
          roundScores[p.id] = stolen
        } else {
          roundScores[p.id] = 0
        }
      }
    })

    const newPlayers = st.players.map(p => {
      if (p.skipNext) {
        roundScores[p.id] = p.therapyRoll ?? 0
        return { ...p, score: p.score + (p.therapyRoll ?? 0), skipNext: false, therapyRoll: undefined }
      }
      const dec    = st.decisions[p.id] || { action: 'ghost' }
      const action = dec.action
      let pts      = roundScores[p.id] // already set for steal
      if (pts === undefined) {
        pts = calcScore(profile, p.typeId, action, st.players, st.decisions)
        roundScores[p.id] = pts
      }
      const deduct  = stealDeductions[p.id] || 0
      const newScore = p.score + pts - deduct
      const loseHeart = (action === 'date' || action === 'double_date') && pts < 0
      const useGhost  = action === 'ghost'
      const newAch    = [...p.achievements]
      if (profile.isCatfish && action === 'ghost' && !newAch.includes('catfish_dodger')) newAch.push('catfish_dodger')
      if (profile.isCatfish && (action === 'date' || action === 'double_date') && !newAch.includes('got_catfished')) newAch.push('got_catfished')
      if (action === 'steal' && !newAch.includes('smooth_criminal')) newAch.push('smooth_criminal')
      if (action === 'double_date' && !newAch.includes('double_dater')) newAch.push('double_dater')
      const updatedGhosts = useGhost ? Math.max(0, p.ghostsLeft - 1) : p.ghostsLeft
      if (updatedGhosts === 0 && !newAch.includes('ghost_master') && p.ghostsLeft > 0 && action === 'ghost') newAch.push('ghost_master')
      return {
        ...p,
        score:      newScore,
        hearts:     loseHeart ? Math.max(0, p.hearts - 1) : p.hearts,
        ghostsLeft: updatedGhosts,
        hasStolen:  p.hasStolen || action === 'steal',
        achievements: newAch,
      }
    })

    return {
      ...st, phase: 'scored',
      players: newPlayers, roundScores,
    }
  }

  function scoreTheOne(st) {
    const roundScores = {}
    const newPlayers  = st.players.map(p => {
      if (!st.qualifiedIds?.includes(p.id)) return p
      const dec    = st.theOneDecisions?.[p.id] || { action: 'ghost' }
      const action = dec.action
      if (action === 'ghost') { roundScores[p.id] = 0; return p }
      const type = PLAYER_TYPES.find(t => t.id === p.typeId)
      const pts  = THE_ONE_PROFILE.traits.reduce((s, t) => s + (type ? type.adjust(t.value) : t.value), 0)
      roundScores[p.id] = pts
      const newAch = [...p.achievements]
      if (pts >= 0 && !newAch.includes('found_the_one')) newAch.push('found_the_one')
      if (pts < 0 && !newAch.includes('unmatched')) newAch.push('unmatched')
      return { ...p, score: p.score + pts, hearts: pts < 0 ? Math.max(0, p.hearts - 1) : p.hearts, achievements: newAch }
    })
    return { ...st, phase: 'the_one_scored', players: newPlayers, theOneScores: roundScores }
  }

  // ── Host actions ──────────────────────────────────────────────────────────
  function startGame() {
    const myId      = 'host'
    const profiles  = generateProfiles(7, customTraits, customProfiles)
    const host      = makePlayer(myId, myName, myType)
    const others    = lobbyPlayers.map(lp => makePlayer(lp.id, lp.name, lp.typeId))
    const allPlayers = [host, ...others]

    setGameState({
      phase: 'deciding', round: 0, profiles,
      players: allPlayers,
      decisions: {}, submittedIds: [],
      revealStep: 0, roundScores: {},
      qualifiedIds: null, theOneDecisions: {}, theOneSubmitted: [],
      theOneRevealStep: 0, theOneScores: {},
    })
    setScreen('game')

    // Auto-advance if no decision after 35s
    clearTimeout(autoStartTimerRef.current)
    autoStartTimerRef.current = setTimeout(() => {
      setGameState(prev => {
        if (!prev || prev.phase !== 'deciding') return prev
        return startReveal({ ...prev, decisions: { ...prev.decisions }, submittedIds: prev.players.map(p => p.id) })
      })
    }, 35000)
  }

  function submitHostDecision(action) {
    setGameState(prev => {
      if (!prev || prev.phase !== 'deciding') return prev
      const newDecisions = { ...prev.decisions, host: { action } }
      const newSubmitted = Object.keys(newDecisions)
      const all = prev.players.filter(p => !p.skipNext).every(p => newSubmitted.includes(p.id))
      const next = { ...prev, decisions: newDecisions, submittedIds: newSubmitted }
      if (all) { clearTimeout(autoStartTimerRef.current); return startReveal(next) }
      return next
    })
  }

  function submitHostTheOneDecision(action) {
    setGameState(prev => {
      if (!prev || prev.phase !== 'the_one') return prev
      const newD = { ...prev.theOneDecisions, host: { action } }
      const newS = Object.keys(newD)
      const all = (prev.qualifiedIds || []).every(id => newS.includes(id))
      const next = { ...prev, theOneDecisions: newD, theOneSubmitted: newS }
      if (all) return scoreTheOne(next)
      return next
    })
  }

  function advanceFromScored() {
    setGameState(prev => {
      if (!prev) return prev
      const nextRound = prev.round + 1
      if (nextRound >= 7) {
        // Check for The One qualification
        const qualified = prev.players.filter(p => p.score >= 10 && p.hearts > 0)
        if (qualified.length > 0) {
          return {
            ...prev, phase: 'the_one',
            qualifiedIds: qualified.map(p => p.id),
            theOneDecisions: {}, theOneSubmitted: [],
            theOneRevealStep: 0,
          }
        }
        return { ...prev, phase: 'results' }
      }
      // Prep next round: handle therapy skips
      const therapyPlayers = prev.players.filter(p => p.hasTherapy && !p.hasUsedTherapy) // handled via skipNext
      const nextPlayers = prev.players.map(p => ({
        ...p,
        skipNext: p.skipNext || false,
        therapyRoll: p.skipNext ? (Math.random() < 0.5 ? 4 : 0) : undefined,
      }))
      return {
        ...prev, phase: 'deciding', round: nextRound,
        decisions: {}, submittedIds: [],
        revealStep: 0, roundScores: {},
        players: nextPlayers,
      }
    })
    clearTimeout(autoStartTimerRef.current)
    autoStartTimerRef.current = setTimeout(() => {
      setGameState(prev => {
        if (!prev || prev.phase !== 'deciding') return prev
        return startReveal({ ...prev, submittedIds: prev.players.map(p => p.id) })
      })
    }, 35000)
  }

  function advanceFromTheOneScored() {
    setGameState(prev => prev ? { ...prev, phase: 'results' } : prev)
  }

  function useTherapy() {
    setGameState(prev => {
      if (!prev) return prev
      const newPlayers = prev.players.map(p =>
        p.id === 'host' ? { ...p, hasTherapy: true, skipNext: true } : p
      )
      return { ...prev, players: newPlayers }
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (screen === 'setup') {
    return (
      <Frame onClose={onClose} title="HOST GAME">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            <SectionLabel>Your Name</SectionLabel>
            <Input value={myName} onChange={setMyName} placeholder="Enter your name" style={{ marginBottom: 20 }} />
            <SectionLabel>Your Player Type</SectionLabel>
            <TypePicker value={myType} onChange={setMyType} />
          </div>
        </Scroll>
        <div style={{ padding: '12px 16px', borderTop: hair, flexShrink: 0 }}>
          <Btn onClick={() => myName.trim() && setScreen('lobby')} disabled={!myName.trim()}>
            CREATE ROOM →
          </Btn>
        </div>
      </Frame>
    )
  }

  if (screen === 'lobby') {
    return (
      <Frame onClose={onClose} title="HOST — LOBBY">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            {room.status === 'connecting' && (
              <div style={{ fontFamily: WS, fontSize: 12, color: '#555', textAlign: 'center', marginBottom: 16 }}>Connecting…</div>
            )}
            {room.status === 'room-taken' && (
              <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, textAlign: 'center', marginBottom: 16 }}>Room code taken — refresh to get a new one.</div>
            )}
            {room.status === 'open' && <RoomCode code={roomCode} />}

            <SectionLabel>{lobbyPlayers.length + 1} PLAYER{lobbyPlayers.length !== 0 ? 'S' : ''} JOINED</SectionLabel>
            <div style={{ marginBottom: 16 }}>
              {/* Host row */}
              <div style={{ padding: '10px 14px', background: `${C.accent}14`, border: `1px solid ${C.accent}33`, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{PLAYER_TYPES.find(t => t.id === myType)?.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{myName}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555' }}>HOST · {PLAYER_TYPES.find(t => t.id === myType)?.label}</div>
                </div>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.12em' }}>YOU</span>
              </div>
              {lobbyPlayers.map(lp => (
                <div key={lp.id} style={{ padding: '10px 14px', background: C.card, border: hair, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{PLAYER_TYPES.find(t => t.id === lp.typeId)?.emoji || '👤'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>{lp.name}</div>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555' }}>{PLAYER_TYPES.find(t => t.id === lp.typeId)?.label || 'JOINING…'}</div>
                  </div>
                  <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.1em' }}>READY</span>
                </div>
              ))}
            </div>
            {lobbyPlayers.length === 0 && (
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#444', textAlign: 'center', padding: '20px 0' }}>
                Waiting for players to join…
              </div>
            )}

            {/* ── Customization panel ── */}
            <div style={{ borderTop: hair, marginTop: 12, paddingTop: 12 }}>
              <button
                onClick={() => setShowCustomize(s => !s)}
                style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', padding: '10px 0', background: showCustomize ? `${C.teal}14` : 'transparent', border: `1px solid ${showCustomize ? C.teal : '#333'}`, color: showCustomize ? C.teal : '#555', cursor: 'pointer' }}>
                🎲 MAKE IT PERSONAL {customTraits.length + customProfiles.length > 0 ? `(${customTraits.length + customProfiles.length})` : ''}
              </button>
            </div>

            {showCustomize && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>Add traits or real people — they'll show up in the profiles.</div>

                {/* Custom trait input */}
                <input
                  style={{ width: '100%', fontFamily: WS, fontWeight: 400, background: C.card, color: C.cream, fontSize: 13, border: ctText ? `1px solid rgba(239,230,220,0.2)` : hair, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
                  placeholder="A trait you've actually seen from someone…"
                  value={ctText}
                  onChange={e => setCtText(e.target.value)}
                  maxLength={80}
                  onKeyDown={e => { if (e.key === 'Enter') addCustomTrait() }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setCtGreen(true)} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: ctGreen ? `${C.teal}22` : 'transparent', border: `1px solid ${ctGreen ? C.teal : '#333'}`, color: ctGreen ? C.teal : '#444', cursor: 'pointer' }}>🟢 GREEN</button>
                  <button onClick={() => setCtGreen(false)} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: !ctGreen ? `${C.accent}22` : 'transparent', border: `1px solid ${!ctGreen ? C.accent : '#333'}`, color: !ctGreen ? C.accent : '#444', cursor: 'pointer' }}>🚩 RED</button>
                  <button onClick={addCustomTrait} disabled={!ctText.trim()} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: ctText.trim() ? C.cardAlt : 'transparent', border: ctText.trim() ? hair : `1px dashed #333`, color: ctText.trim() ? C.cream : '#444', cursor: ctText.trim() ? 'pointer' : 'not-allowed' }}>+ ADD</button>
                </div>

                {customTraits.length > 0 && (
                  <div>
                    {customTraits.map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: C.card, borderLeft: `3px solid ${t.value > 0 ? C.teal : C.accent}`, marginBottom: 3 }}>
                        <span style={{ fontFamily: WS, fontSize: 11, color: C.cream, flex: 1 }}>{t.text}</span>
                        <button onClick={() => setCustomTraits(prev => prev.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 11 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 0' }}>
                  <div style={{ flex: 1, height: 1, background: '#2a2525' }} />
                  <span style={{ fontFamily: WS, fontSize: 10, color: '#444', letterSpacing: '0.14em' }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: '#2a2525' }} />
                </div>

                <button onClick={() => setShowCpBuilder(s => !s)} style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', padding: '10px 0', background: showCpBuilder ? `${C.teal}14` : 'transparent', border: `1px solid ${showCpBuilder ? C.teal : '#333'}`, color: showCpBuilder ? C.teal : '#555', cursor: 'pointer' }}>
                  👤 BUILD A REAL PERSON
                </button>

                {showCpBuilder && (
                  <div style={{ padding: 12, background: C.card, border: `1px solid ${C.teal}44`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.2em' }}>CUSTOM PROFILE BUILDER</div>
                    <input
                      style={{ width: '100%', fontFamily: ANTON, fontSize: 20, letterSpacing: '0.04em', background: C.cardAlt, color: C.cream, border: cpName ? `1px solid rgba(239,230,220,0.2)` : hair, padding: '9px 11px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
                      placeholder="THEIR NAME"
                      value={cpName}
                      onChange={e => setCpName(e.target.value)}
                      maxLength={16}
                    />
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.16em' }}>ADD THEIR TRAITS (min 2)</div>
                    <input
                      style={{ width: '100%', fontFamily: WS, fontWeight: 400, background: C.cardAlt, color: C.cream, fontSize: 12, border: cpTraitText ? `1px solid rgba(239,230,220,0.2)` : hair, padding: '9px 11px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
                      placeholder="A trait you've seen from them…"
                      value={cpTraitText}
                      onChange={e => setCpTraitText(e.target.value)}
                      maxLength={80}
                      onKeyDown={e => { if (e.key === 'Enter') addCpTrait() }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setCpGreen(true)} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: cpGreen ? `${C.teal}22` : 'transparent', border: `1px solid ${cpGreen ? C.teal : '#333'}`, color: cpGreen ? C.teal : '#444', cursor: 'pointer' }}>🟢 GREEN</button>
                      <button onClick={() => setCpGreen(false)} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: !cpGreen ? `${C.accent}22` : 'transparent', border: `1px solid ${!cpGreen ? C.accent : '#333'}`, color: !cpGreen ? C.accent : '#444', cursor: 'pointer' }}>🚩 RED</button>
                      <button onClick={addCpTrait} disabled={!cpTraitText.trim()} style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: cpTraitText.trim() ? C.cardAlt : 'transparent', border: cpTraitText.trim() ? hair : `1px dashed #333`, color: cpTraitText.trim() ? C.cream : '#444', cursor: cpTraitText.trim() ? 'pointer' : 'not-allowed' }}>+ ADD</button>
                    </div>
                    {cpTraits.length > 0 && (
                      <div>
                        {cpTraits.map((t, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: C.cardAlt, borderLeft: `3px solid ${t.value > 0 ? C.teal : C.accent}`, marginBottom: 3 }}>
                            <span style={{ fontFamily: WS, fontSize: 11, color: C.cream, flex: 1 }}>{t.text}</span>
                            <button onClick={() => setCpTraits(ts => ts.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 11 }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={submitCustomProfile} disabled={!cpName.trim() || cpTraits.length < 2} style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', padding: '10px 0', background: cpName.trim() && cpTraits.length >= 2 ? `${C.teal}22` : 'transparent', border: `1px solid ${cpName.trim() && cpTraits.length >= 2 ? C.teal : '#333'}`, color: cpName.trim() && cpTraits.length >= 2 ? C.teal : '#444', cursor: cpName.trim() && cpTraits.length >= 2 ? 'pointer' : 'not-allowed' }}>
                      ✓ ADD {cpName.trim() ? cpName.trim().toUpperCase() : 'PROFILE'} TO GAME
                    </button>
                  </div>
                )}

                {customProfiles.length > 0 && (
                  <div>
                    {customProfiles.map((cp, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: C.card, border: `1px solid ${C.teal}44`, marginBottom: 4, borderLeft: `3px solid ${C.teal}` }}>
                        <div>
                          <div style={{ fontFamily: ANTON, fontSize: 13, color: C.cream, letterSpacing: '0.06em' }}>{cp.name.toUpperCase()}</div>
                          <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#666' }}>{cp.traits.length} traits · custom profile</div>
                        </div>
                        <button onClick={() => setCustomProfiles(prev => prev.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 11 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Scroll>
        <div style={{ padding: '12px 16px', borderTop: hair, flexShrink: 0 }}>
          <Btn onClick={startGame} disabled={lobbyPlayers.length === 0 || room.status !== 'open'}>
            {lobbyPlayers.length === 0 ? 'NEED AT LEAST 1 PLAYER' : `START WITH ${lobbyPlayers.length + 1} PLAYERS →`}
          </Btn>
        </div>
      </Frame>
    )
  }

  if (screen === 'game' && gameState) {
    const me       = gameState.players.find(p => p.id === 'host')
    const isMine   = !me?.skipNext
    const submitted = gameState.submittedIds?.includes('host')
    const qualified = gameState.qualifiedIds?.includes('host')
    const theOneSubmitted = gameState.theOneSubmitted?.includes('host')

    return (
      <GameScreen
        gameState={gameState}
        myId="host"
        isMine={isMine}
        submitted={submitted}
        qualified={qualified}
        theOneSubmitted={theOneSubmitted}
        onDecide={submitHostDecision}
        onTheOneDecide={submitHostTheOneDecision}
        onNext={advanceFromScored}
        onTheOneNext={advanceFromTheOneScored}
        onTherapy={useTherapy}
        onClose={onClose}
        isHost
      />
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function ClientGame({ onClose }) {
  const [screen, setScreen]         = useState('code')   // code | setup | waiting | game
  const [codeInput, setCodeInput]   = useState('')
  const [myName, setMyName]         = useState('')
  const [myType, setMyType]         = useState(PLAYER_TYPES[0].id)
  const [roomCode, setRoomCode]     = useState(null)
  const [myId]                      = useState(uid)
  const [gameState, setGameState]   = useState(null)
  const [lobbyPlayers, setLobbyPlayers] = useState([])
  const [connErr, setConnErr]       = useState(null)

  const handleMessage = useCallback((data) => {
    if (data.type === 'LOBBY_STATE')  setLobbyPlayers(data.players || [])
    if (data.type === 'GAME_STATE')   setGameState(data.state)
  }, [])

  const room = useGameRoom({
    isHost: false, roomCode,
    onMessage: handleMessage,
  })

  // Detect connection issues
  useEffect(() => {
    if (room.status === 'error')        setConnErr('Could not connect. Check the room code and try again.')
    if (room.status === 'disconnected') setConnErr('Lost connection to host.')
  }, [room.status])

  // Join lobby once connected
  useEffect(() => {
    if (room.status === 'open' && screen === 'waiting') {
      room.sendToHost({ type: 'JOIN_LOBBY', name: myName, typeId: myType })
    }
  }, [room.status, screen]) // eslint-disable-line

  // When game starts, switch screen
  useEffect(() => {
    if (gameState && screen === 'waiting') setScreen('game')
  }, [gameState]) // eslint-disable-line

  function joinRoom() {
    const code = codeInput.trim().toUpperCase()
    if (code.length !== 4) return
    setRoomCode(code)
    setScreen('setup')
  }

  function enterGame() {
    if (!myName.trim()) return
    setScreen('waiting')
  }

  function sendDecision(action) {
    room.sendToHost({ type: 'DECISION', action, playerId: myId })
  }

  function sendTheOneDecision(action) {
    room.sendToHost({ type: 'THE_ONE_DECISION', action, playerId: myId })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (screen === 'code') {
    return (
      <Frame onClose={onClose} title="JOIN GAME">
        <Scroll>
          <div style={{ padding: '20px 16px' }}>
            <SectionLabel>Room Code</SectionLabel>
            <Input
              value={codeInput}
              onChange={v => setCodeInput(v.toUpperCase().slice(0, 4))}
              placeholder="4-letter code"
              maxLength={4}
              style={{ fontSize: 28, letterSpacing: '0.3em', textAlign: 'center', marginBottom: 20 }}
            />
            {connErr && <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, marginBottom: 12 }}>{connErr}</div>}
          </div>
        </Scroll>
        <div style={{ padding: '12px 16px', borderTop: hair, flexShrink: 0 }}>
          <Btn onClick={joinRoom} disabled={codeInput.trim().length !== 4}>
            NEXT →
          </Btn>
        </div>
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
        <div style={{ padding: '12px 16px', borderTop: hair, flexShrink: 0 }}>
          <Btn onClick={enterGame} disabled={!myName.trim()}>
            JOIN ROOM →
          </Btn>
        </div>
      </Frame>
    )
  }

  if (screen === 'waiting') {
    return (
      <Frame onClose={onClose} title={`ROOM ${roomCode}`}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ fontFamily: ANTON, fontSize: 28, color: C.teal, letterSpacing: '0.12em', marginBottom: 12 }}>READY</div>
          <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.45)', textAlign: 'center', lineHeight: 1.6 }}>
            Waiting for the host to start the game…
          </div>
          {room.status === 'connecting' && (
            <div style={{ fontFamily: WS, fontSize: 11, color: '#444', marginTop: 16 }}>Connecting to room {roomCode}…</div>
          )}
          {connErr && <div style={{ fontFamily: WS, fontSize: 12, color: C.accent, marginTop: 12 }}>{connErr}</div>}
          <div style={{ marginTop: 24, padding: '10px 20px', background: C.card, border: hair }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.16em', marginBottom: 4 }}>JOINED AS</div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 14, color: C.cream }}>{myName}</div>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>{PLAYER_TYPES.find(t => t.id === myType)?.label}</div>
          </div>
        </div>
      </Frame>
    )
  }

  if (screen === 'game' && gameState) {
    const me          = gameState.players?.find(p => p.id === myId)
    const isMine      = me && !me.skipNext
    const submitted   = gameState.submittedIds?.includes(myId)
    const qualified   = gameState.qualifiedIds?.includes(myId)
    const theOneSubmit = gameState.theOneSubmitted?.includes(myId)

    return (
      <GameScreen
        gameState={gameState}
        myId={myId}
        isMine={isMine}
        submitted={submitted}
        qualified={qualified}
        theOneSubmitted={theOneSubmit}
        onDecide={sendDecision}
        onTheOneDecide={sendTheOneDecision}
        onNext={null}    // host controls advancement
        onTheOneNext={null}
        onTherapy={null}
        onClose={onClose}
        isHost={false}
      />
    )
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED GAME SCREEN (renders for both host and clients)
// ═══════════════════════════════════════════════════════════════════════════════
function GameScreen({
  gameState, myId, isMine, submitted, qualified, theOneSubmitted,
  onDecide, onTheOneDecide, onNext, onTheOneNext, onTherapy, onClose, isHost,
}) {
  const { phase, round, profiles, players, decisions, submittedIds,
          revealStep, roundScores, qualifiedIds, theOneRevealStep, theOneScores } = gameState

  const me         = players?.find(p => p.id === myId)
  const profile    = profiles?.[round]
  const sorted     = [...(players || [])].sort((a, b) => b.score - a.score)
  const myDecision = decisions?.[myId]
  const totalRound = 7

  // Timer for deciding phase
  const [timer, setTimer] = useState(30)
  const timerRef = useRef(null)
  useEffect(() => {
    setTimer(30)
    if (phase !== 'deciding' || submitted) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (!submitted && isMine && onDecide) onDecide('ghost')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, round]) // eslint-disable-line

  // ── DECIDING ──────────────────────────────────────────────────────────────
  if (phase === 'deciding') {
    const stalkedIdxs = (myDecision?.stalkedIdxs || [])
    return (
      <Frame onClose={onClose} title={`ROUND ${round + 1} / ${totalRound}`}
        right={<span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent }}>{Array.from({length:3},(_,i)=>(i<(me?.hearts||0)?'♥':'♡')).join('')}</span>}>
        {isMine && !submitted && <TimerBar seconds={timer} />}
        <Scroll style={{ padding: '0 14px 14px' }}>
          <ProfileCard profile={profile} revealStep={-1} stalkedIdxs={stalkedIdxs} />

          {me?.skipNext ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontFamily: ANTON, fontSize: 20, color: C.velvet, letterSpacing: '0.12em', marginBottom: 8 }}>🛋️ IN THERAPY</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555' }}>You're sitting this round out. Result coming after reveal.</div>
            </div>
          ) : submitted ? (
            <div style={{ padding: '14px', background: C.card, border: `1px solid ${C.accent}33`, textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 14, color: C.teal, letterSpacing: '0.12em', marginBottom: 4 }}>DECISION LOCKED IN</div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color: C.cream }}>
                {myDecision?.action === 'date' ? '♥ DATE' : myDecision?.action === 'ghost' ? '◌ GHOST' : myDecision?.action === 'steal' ? '⚡ STEAL' : myDecision?.action === 'double_date' ? '♥♥ DOUBLE DATE' : myDecision?.action}
              </div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555', marginTop: 6 }}>
                Waiting for others… ({submittedIds?.length || 0}/{players?.filter(p => !p.skipNext).length} in)
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn icon="♥" label="DATE" color={C.accent} onClick={() => onDecide?.('date')} />
                <ActionBtn icon="◌" label="GHOST" color="#888"
                  tag={`${me?.ghostsLeft ?? 3} LEFT`}
                  disabled={(me?.ghostsLeft ?? 3) <= 0}
                  onClick={() => onDecide?.('ghost')} />
                <ActionBtn icon="🔍" label="STALK" color={C.gold}
                  tag={`${me?.stalkTokens ?? 3} LEFT`}
                  disabled={(me?.stalkTokens ?? 3) <= 0}
                  onClick={() => {/* stalk opens hidden trait reveal */}} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn icon="⚡" label="STEAL" color={C.gold}
                  tag="1 USE"
                  disabled={me?.hasStolen}
                  onClick={() => onDecide?.('steal')} />
                <ActionBtn icon="♥♥" label="DOUBLE" color={C.accent}
                  onClick={() => onDecide?.('double_date')} />
                {isHost && onTherapy && (
                  <ActionBtn icon="🛋️" label="THERAPY" color="#8B7EA8"
                    tag="1 USE"
                    disabled={me?.hasTherapy || me?.skipNext}
                    onClick={onTherapy} />
                )}
              </div>
            </div>
          )}

          {/* Waiting list */}
          {submitted && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: '#444', letterSpacing: '0.16em', marginBottom: 8 }}>WAITING ON</div>
              {players?.filter(p => !p.skipNext && !submittedIds?.includes(p.id)).map(p => (
                <div key={p.id} style={{ fontFamily: WS, fontSize: 11, color: '#555', padding: '4px 0' }}>· {p.name}</div>
              ))}
            </div>
          )}
        </Scroll>
      </Frame>
    )
  }

  // ── REVEALING ──────────────────────────────────────────────────────────────
  if (phase === 'revealing') {
    return (
      <Frame onClose={onClose} title={`ROUND ${round + 1} — REVEALING`}>
        <Scroll style={{ padding: '0 14px 14px' }}>
          <ProfileCard profile={profile} revealStep={revealStep} />
        </Scroll>
      </Frame>
    )
  }

  // ── SCORED ────────────────────────────────────────────────────────────────
  if (phase === 'scored') {
    const myScore = roundScores?.[myId] ?? 0
    return (
      <Frame onClose={onClose} title={`ROUND ${round + 1} — SCORED`}>
        <Scroll style={{ padding: '0 14px 14px' }}>
          {/* My score popup */}
          {me && (
            <div style={{ textAlign: 'center', padding: '20px 0 16px', borderBottom: hair, marginBottom: 16 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', marginBottom: 6 }}>YOUR ROUND SCORE</div>
              <div style={{ fontFamily: ANTON, fontSize: 'clamp(52px,16vw,72px)', color: myScore >= 0 ? C.teal : C.accent, lineHeight: 1 }}>
                {myScore >= 0 ? '+' : ''}{myScore}
              </div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#555', marginTop: 6 }}>TOTAL: {me.score}</div>
            </div>
          )}

          {profile?.isCatfish && (
            <div style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}44`, padding: '10px 14px', marginBottom: 14, textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 13, color: C.accent, letterSpacing: '0.1em' }}>🪝 THAT WAS THE CATFISH</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: 'rgba(239,230,220,0.5)', marginTop: 4 }}>All hidden traits were −3.</div>
            </div>
          )}

          <ProfileCard profile={profile} revealStep={999} />

          {/* Leaderboard */}
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.16em', marginBottom: 8 }}>LEADERBOARD</div>
          {sorted.map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={i + 1} score={p.score} roundScore={roundScores?.[p.id]} showRound />
          ))}

          {isHost && onNext && (
            <div style={{ marginTop: 16 }}>
              <Btn onClick={onNext}>
                {round + 1 >= 7 ? 'SEE FINAL RESULTS →' : `NEXT ROUND →`}
              </Btn>
            </div>
          )}
          {!isHost && (
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#444', textAlign: 'center', marginTop: 16 }}>
              Waiting for host to advance…
            </div>
          )}
        </Scroll>
      </Frame>
    )
  }

  // ── THE ONE ───────────────────────────────────────────────────────────────
  if (phase === 'the_one') {
    const hiddenTraits = THE_ONE_PROFILE.traits.filter(t => !t.startVisible)
    const qSubmitted   = gameState.theOneSubmitted?.includes(myId)
    return (
      <Frame onClose={onClose} title="💘 THE ONE">
        <Scroll style={{ padding: '0 14px 14px' }}>
          <div style={{ textAlign: 'center', padding: '16px 0 12px', marginBottom: 12 }}>
            <div style={{ fontFamily: ANTON, fontSize: 'clamp(28px,8vw,40px)', color: C.gold, lineHeight: 1, letterSpacing: '0.08em' }}>THE LEGENDARY DROP</div>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: 'rgba(239,230,220,0.45)', marginTop: 6 }}>1% drop rate. Only the qualified face this.</div>
          </div>

          {!qualified ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontFamily: ANTON, fontSize: 18, color: '#444', letterSpacing: '0.1em', marginBottom: 8 }}>DID NOT QUALIFY</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555' }}>Need 10+ points and at least 1 heart.</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 8 }}>Waiting for others…</div>
            </div>
          ) : qSubmitted ? (
            <div style={{ padding: '14px', background: C.card, border: `1px solid ${C.gold}33`, textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 13, color: C.gold, letterSpacing: '0.1em' }}>DECISION LOCKED IN</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555', marginTop: 6 }}>Waiting for others…</div>
            </div>
          ) : (
            <>
              <ProfileCard profile={THE_ONE_PROFILE} revealStep={-1} />
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn icon="♥" label="DATE" color={C.gold} onClick={() => onTheOneDecide?.('date')} />
                <ActionBtn icon="◌" label="GHOST" color="#888" onClick={() => onTheOneDecide?.('ghost')} />
              </div>
            </>
          )}
        </Scroll>
      </Frame>
    )
  }

  // ── THE ONE REVEALING ──────────────────────────────────────────────────────
  if (phase === 'the_one_revealing') {
    return (
      <Frame onClose={onClose} title="💘 THE ONE — REVEALING">
        <Scroll style={{ padding: '0 14px 14px' }}>
          <ProfileCard profile={THE_ONE_PROFILE} revealStep={theOneRevealStep} />
        </Scroll>
      </Frame>
    )
  }

  // ── THE ONE SCORED ─────────────────────────────────────────────────────────
  if (phase === 'the_one_scored') {
    const myScore = theOneScores?.[myId]
    return (
      <Frame onClose={onClose} title="💘 THE ONE — RESULT">
        <Scroll style={{ padding: '0 14px 14px' }}>
          {qualified && myScore != null && (
            <div style={{ textAlign: 'center', padding: '20px 0 16px', borderBottom: hair, marginBottom: 16 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', marginBottom: 6 }}>YOUR RESULT</div>
              <div style={{ fontFamily: ANTON, fontSize: 'clamp(52px,16vw,72px)', color: myScore >= 0 ? C.gold : C.accent, lineHeight: 1 }}>
                {myScore >= 0 ? '+' : ''}{myScore}
              </div>
              <div style={{ fontFamily: ANTON, fontSize: 14, color: myScore >= 0 ? C.gold : C.accent, marginTop: 8, letterSpacing: '0.1em' }}>
                {myScore >= 0 ? '💘 FOUND THE ONE' : '💔 UNMATCHED'}
              </div>
            </div>
          )}
          {sorted.map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={i + 1} score={p.score} roundScore={theOneScores?.[p.id]} showRound />
          ))}
          {isHost && onTheOneNext && (
            <div style={{ marginTop: 16 }}><Btn onClick={onTheOneNext}>SEE FINAL RESULTS →</Btn></div>
          )}
          {!isHost && (
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#444', textAlign: 'center', marginTop: 16 }}>Waiting for host…</div>
          )}
        </Scroll>
      </Frame>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const winner = sorted[0]
    return (
      <Frame onClose={onClose} title="FINAL RESULTS">
        <Scroll style={{ padding: '0 14px 40px' }}>
          <div style={{ textAlign: 'center', padding: '20px 0 16px' }}>
            <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,14vw,64px)', color: C.gold, lineHeight: 0.9 }}>GAME OVER</div>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 8 }}>
              {winner?.id === myId ? '🏆 YOU WON!' : `${winner?.name} wins!`}
            </div>
          </div>
          {sorted.map((p, i) => (
            <PlayerRow key={p.id} player={p} rank={i + 1} score={p.score} showRound={false} />
          ))}
          {/* Achievement badges */}
          {players?.map(p => p.achievements?.length > 0 && (
            <div key={p.id} style={{ marginTop: 8, padding: '10px 12px', background: C.cardAlt, border: hair }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.achievements.map(a => (
                  <div key={a} style={{ padding: '3px 8px', background: C.card, border: `1px solid ${C.gold}33`, fontFamily: WS, fontSize: 10, color: C.gold }}>
                    {a.replace(/_/g, ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <Btn onClick={onClose} outline>← BACK TO PORTFOLIO</Btn>
          </div>
        </Scroll>
      </Frame>
    )
  }

  return (
    <Frame onClose={onClose} title="THE CATCH">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555' }}>Loading…</div>
      </div>
    </Frame>
  )
}

// ─── Frame wrapper ────────────────────────────────────────────────────────────
function Frame({ children, onClose, title, right }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, overflow: 'hidden' }}>
      <Nav
        left={<button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Back</button>}
        center={title}
        right={right}
      />
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.2em', marginBottom: 10, textTransform: 'uppercase' }}>{children}</div>
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROLE SELECT + ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════
export default function TheCatchOnline({ onClose }) {
  const [role, setRole] = useState(null) // null | 'host' | 'join'

  if (role === 'host') return <HostGame onClose={onClose} />
  if (role === 'join') return <ClientGame onClose={onClose} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
      <Nav
        left={<button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 12, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Back</button>}
        center="ONLINE MULTIPLAYER"
      />

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(52px,14vw,72px)', color: C.accent, lineHeight: 0.88, marginBottom: 4 }}>THE</div>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(52px,14vw,72px)', color: C.cream, lineHeight: 0.88, marginBottom: 20 }}>CATCH</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: 'rgba(239,230,220,0.38)', letterSpacing: '0.18em', marginBottom: 40 }}>SEPARATE DEVICES · ONLINE</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
          <button
            onClick={() => setRole('host')}
            style={{
              fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em',
              padding: '16px 24px', background: C.accent, color: '#fff',
              border: 'none', cursor: 'pointer',
              boxShadow: `0 0 32px rgba(255,77,109,0.3)`,
            }}
          >
            CREATE A ROOM
          </button>
          <button
            onClick={() => setRole('join')}
            style={{
              fontFamily: WS, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em',
              padding: '16px 24px', background: 'transparent', color: C.cream,
              border: `1px solid rgba(239,230,220,0.2)`, cursor: 'pointer',
            }}
          >
            JOIN A ROOM
          </button>
        </div>

        <div style={{ marginTop: 32, fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#333', lineHeight: 1.7, maxWidth: 280 }}>
          Each player uses their own device. Host creates a room and shares the code — everyone joins, then decisions happen simultaneously in secret.
        </div>
      </div>
    </div>
  )
}

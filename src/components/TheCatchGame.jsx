import { useReducer, useState, useEffect } from 'react'
import { generateProfiles, TRAIT_POOL, THE_ONE_PROFILE, PLAYER_AVATARS, profileScore, getPersonality } from '../data/catchProfiles'
import { Doll, DOLL_BG } from './DollCharacters'

// ─── Option B · After Hours design tokens ─────────────────────────────────────
const C = {
  bg:      '#131011',
  card:    '#1E1A1B',
  cardAlt: '#2C2729',
  accent:  '#FF4D6D',
  teal:    '#7CE0A8',
  gold:    '#E4C46A',
  cream:   '#EFE6DC',
  slate:   '#2C2729',
  velvet:  '#3B2E4A',
}
const WS     = "'Work Sans', sans-serif"
const ANTON  = "'Anton', sans-serif"
const hairline = `1px solid rgba(239,230,220,0.08)`
const DVH    = '100%'  // fills parent flex container (modal constrains to phone width)

// ─── NPC rival system ─────────────────────────────────────────────────────────
const NPC_NAMES   = ['Jordan', 'Riley', 'Drew', 'Morgan', 'Casey', 'Sage', 'Frankie', 'Remy', 'Sasha', 'Tyler']
const NPC_AVATARS = ['🌙', '🔥', '⚡', '💀', '🌊', '🎯', '🦁', '🃏']

function makeNPC(idx) {
  const pool = shuffle([...NPC_NAMES])
  return { ...makePlayer(`npc${idx}`, pool[idx % pool.length], NPC_AVATARS[idx % NPC_AVATARS.length]), isNPC: true }
}

function npcDecide(profile, npc) {
  if (npc.ghosts <= 0) return 'date'
  const vis = profile.traits.filter(t => t.startVisible).reduce((s, t) => s + t.value, 0)
  if (vis >= 3) return Math.random() > 0.1 ? 'date' : 'ghost'
  if (vis <= -2) return Math.random() > 0.3 ? 'ghost' : 'date'
  return Math.random() > 0.48 ? 'date' : 'ghost'
}

// ─── utils ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makePlayer(id, name, avatar) {
  return { id, name, avatar, hearts: 3, stalkTokens: 3, ghosts: 3, loveScore: 0, heartbreakMode: false, ghostsUsed: 0, datesCount: 0, redFlagsCount: 0, foundTheOne: false }
}

function calcDate(player, score, bonusApplies) {
  let pts = score, heartsLost = 0, isRedFlag = false
  if (score < 0) {
    heartsLost = 1
    if (score <= -5) { pts -= 2; isRedFlag = true }
  }
  if (score >= 7 && bonusApplies) pts += 2
  if (player.heartbreakMode && pts > 0) pts = Math.floor(pts / 2)
  return { pts, heartsLost, isRedFlag }
}

function makeTBProfile() {
  const names = ['River', 'Quinn', 'Sage', 'Avery', 'Blake']
  const name  = names[Math.floor(Math.random() * names.length)]
  const vals  = shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 4)
  const descs = ['Has strong opinions about everything', 'Still texts their ex at midnight', 'Volunteers every Saturday', 'Genuinely kind when no one is watching']
  return {
    id: 'tb', name, age: 24, emoji: '⚡',
    bio: 'The tiebreaker.',
    traits: [
      { text: 'Seems too good to be true', value: 0, startVisible: true },
      ...descs.map((text, i) => ({ text, value: vals[i], startVisible: false })),
    ],
    tbScore: vals.reduce((s, v) => s + v, 0),
  }
}

// ─── scoring helpers ──────────────────────────────────────────────────────────
function applyRound(state) {
  const profile = state.profiles[state.currentRound]
  const score   = profileScore(profile)
  const daters  = state.players.filter(p => state.roundDecisions[p.id]?.action === 'date')
  const isChemistry = state.mode === 'multi' && score >= 7 && daters.length === 1
  const results = {}
  const newPlayers = state.players.map(p => {
    const action = state.roundDecisions[p.id]?.action ?? 'ghost'
    if (action === 'ghost') {
      results[p.id] = { action: 'ghost', pts: 0, heartsLost: 0, isRedFlag: false }
      return { ...p, ghostsUsed: p.ghostsUsed + 1 }
    }
    const bonusApplies = (state.mode === 'single' && score >= 7) || (isChemistry && p.id === daters[0].id)
    const { pts, heartsLost, isRedFlag } = calcDate(p, score, bonusApplies)
    const newHearts = Math.max(0, p.hearts - heartsLost)
    results[p.id] = { action: 'date', pts, heartsLost, isRedFlag, score }
    return { ...p, loveScore: p.loveScore + pts, hearts: newHearts, heartbreakMode: p.heartbreakMode || newHearts === 0, datesCount: p.datesCount + 1, redFlagsCount: p.redFlagsCount + (isRedFlag ? 1 : 0) }
  })
  return { ...state, players: newPlayers, roundResults: results, roundPhase: 'scored' }
}

function applyTheOne(state) {
  const score = profileScore(THE_ONE_PROFILE)
  const results = {}
  const newPlayers = state.players.map(p => {
    if (!state.qualifiedIds.includes(p.id)) return p
    const action = state.theOneDecisions[p.id]?.action ?? 'walk_away'
    if (action === 'walk_away') { results[p.id] = { action: 'walk_away', pts: 0, heartsLost: 0, foundTheOne: false }; return p }
    if (score >= 7) { results[p.id] = { action: 'take_chance', pts: 10, heartsLost: 0, foundTheOne: true }; return { ...p, loveScore: p.loveScore + 10, foundTheOne: true } }
    const newHearts = Math.max(0, p.hearts - 1)
    results[p.id] = { action: 'take_chance', pts: -10, heartsLost: 1, foundTheOne: false }
    return { ...p, loveScore: p.loveScore - 10, hearts: newHearts, heartbreakMode: p.heartbreakMode || newHearts === 0 }
  })
  return { ...state, players: newPlayers, theOneResults: results, theOnePhase: 'scored' }
}

function resolveWinner(state) {
  if (state.mode === 'single') return { ...state, screen: 'results' }
  let pool = [...state.players]
  const maxScore = Math.max(...pool.map(p => p.loveScore))
  pool = pool.filter(p => p.loveScore === maxScore)
  if (pool.length === 1) return { ...state, screen: 'results', winnerId: pool[0].id }
  const maxHearts = Math.max(...pool.map(p => p.hearts))
  pool = pool.filter(p => p.hearts === maxHearts)
  if (pool.length === 1) return { ...state, screen: 'results', winnerId: pool[0].id }
  const maxStalks = Math.max(...pool.map(p => p.stalkTokens))
  pool = pool.filter(p => p.stalkTokens === maxStalks)
  if (pool.length === 1) return { ...state, screen: 'results', winnerId: pool[0].id }
  return { ...state, screen: 'tiebreaker', tiedIds: pool.map(p => p.id), tbProfile: makeTBProfile(), tbDecisions: {}, tbDecidingIdx: 0, tbPhase: 'deciding', tbRevealStep: 0 }
}

// ─── reducer ──────────────────────────────────────────────────────────────────
const INIT = {
  screen: 'mode_select', mode: null, players: [], profiles: [], currentRound: 0,
  roundPhase: 'deciding', decidingPlayerIdx: 0, roundDecisions: {}, revealStep: 0, roundResults: null,
  qualifiedIds: [], theOnePhase: 'deciding', theOneDecidingIdx: 0, theOneDecisions: {}, theOneRevealStep: 0, theOneResults: null,
  winnerId: null, tiedIds: [], tbProfile: null, tbDecisions: {}, tbDecidingIdx: 0, tbPhase: 'deciding', tbRevealStep: 0,
  customTraits: [], pendingPlayers: [],
}

function reducer(state, { type, ...p }) {
  switch (type) {
    case 'SELECT_MODE': return { ...state, mode: p.mode, screen: 'player_setup' }

    case 'GO_TO_CUSTOM_TRAITS': {
      return { ...state, screen: 'custom_traits', pendingPlayers: p.players, customTraits: [] }
    }

    case 'ADD_CUSTOM_TRAIT': {
      return { ...state, customTraits: [...state.customTraits, { text: p.text, value: p.value }] }
    }

    case 'REMOVE_CUSTOM_TRAIT': {
      return { ...state, customTraits: state.customTraits.filter((_, i) => i !== p.idx) }
    }

    case 'RANDOMIZE_TRAITS': {
      return { ...state, customTraits: p.traits }
    }

    case 'START_GAME': {
      const players = state.pendingPlayers?.length ? state.pendingPlayers : (p.players ?? [])
      const npcs    = state.mode === 'single' ? [makeNPC(0), makeNPC(1)] : []
      const traits  = p.skipCustom ? [] : (state.customTraits ?? [])
      return { ...INIT, mode: state.mode, players: [...players, ...npcs], profiles: generateProfiles(7, traits), screen: 'round', roundPhase: 'deciding' }
    }

    case 'STALK': {
      const isTO   = state.screen === 'the_one'
      const decKey = isTO ? 'theOneDecisions' : 'roundDecisions'
      const idxKey = isTO ? 'theOneDecidingIdx' : 'decidingPlayerIdx'
      const pool   = isTO ? state.players.filter(pl => state.qualifiedIds.includes(pl.id) && !pl.isNPC) : state.players.filter(pl => !pl.isNPC)
      const cur    = pool[state[idxKey]]
      if (!cur || cur.stalkTokens <= 0) return state
      const profile  = isTO ? THE_ONE_PROFILE : state.profiles[state.currentRound]
      const prevIdxs = state[decKey][cur.id]?.stalkedIdxs ?? []
      const avail    = profile.traits.map((_, i) => i).filter(i => !profile.traits[i].startVisible && !prevIdxs.includes(i))
      if (!avail.length) return state
      const pick = avail[Math.floor(Math.random() * avail.length)]
      return { ...state, players: state.players.map(pl => pl.id === cur.id ? { ...pl, stalkTokens: pl.stalkTokens - 1 } : pl), [decKey]: { ...state[decKey], [cur.id]: { ...state[decKey][cur.id], stalkedIdxs: [...prevIdxs, pick] } } }
    }

    case 'DECIDE': {
      const isTO     = state.screen === 'the_one'
      const decKey   = isTO ? 'theOneDecisions'  : 'roundDecisions'
      const phaseKey = isTO ? 'theOnePhase'       : 'roundPhase'
      const idxKey   = isTO ? 'theOneDecidingIdx' : 'decidingPlayerIdx'
      const allPool  = isTO ? state.players.filter(pl => state.qualifiedIds.includes(pl.id)) : state.players
      const humanPool = allPool.filter(pl => !pl.isNPC)
      const cur      = humanPool[state[idxKey]]
      let updPlayers = state.players
      if (!isTO && p.action === 'ghost') updPlayers = state.players.map(pl => pl.id === cur.id ? { ...pl, ghosts: pl.ghosts - 1 } : pl)
      let newDec = { ...state[decKey], [cur.id]: { ...(state[decKey][cur.id] ?? {}), action: p.action } }

      // Single player: auto-decide NPCs alongside the human
      if (state.mode === 'single') {
        allPool.filter(pl => pl.isNPC).forEach(npc => {
          if (newDec[npc.id]) return
          let action
          if (isTO) {
            const visScore = THE_ONE_PROFILE.traits.filter(t => t.startVisible).reduce((s, t) => s + t.value, 0)
            action = (visScore >= 0 && npc.loveScore >= 8) ? 'take_chance' : 'walk_away'
          } else {
            action = npcDecide(state.profiles[state.currentRound], npc)
            if (action === 'ghost') updPlayers = updPlayers.map(pl => pl.id === npc.id ? { ...pl, ghosts: pl.ghosts - 1 } : pl)
          }
          newDec = { ...newDec, [npc.id]: { action, stalkedIdxs: [] } }
        })
      }

      const allDone = allPool.every(pl => newDec[pl.id]?.action != null)
      if (state.mode === 'single' || allDone) return { ...state, players: updPlayers, [decKey]: newDec, [phaseKey]: 'revealing', revealStep: 0, theOneRevealStep: 0 }
      return { ...state, players: updPlayers, [decKey]: newDec, [phaseKey]: 'pass_device', [idxKey]: state[idxKey] + 1 }
    }

    case 'CONTINUE_NEXT': return { ...state, [state.screen === 'the_one' ? 'theOnePhase' : 'roundPhase']: 'deciding' }

    case 'ADVANCE_REVEAL': {
      const isTO    = state.screen === 'the_one'
      const stepKey = isTO ? 'theOneRevealStep' : 'revealStep'
      const profile = isTO ? THE_ONE_PROFILE : state.profiles[state.currentRound]
      const hidden  = profile.traits.filter(t => !t.startVisible).length
      const next    = state[stepKey] + 1
      if (next > hidden) return isTO ? applyTheOne(state) : applyRound(state)
      return { ...state, [stepKey]: next }
    }

    case 'NEXT_ROUND': {
      if (state.currentRound >= 6) {
        const qualified = state.players.filter(pl => pl.loveScore >= 10 && pl.hearts >= 1)
        if (!qualified.length) return { ...state, screen: 'results' }
        return { ...state, screen: 'the_one', qualifiedIds: qualified.map(pl => pl.id), theOnePhase: 'deciding', theOneDecidingIdx: 0, theOneDecisions: {}, theOneRevealStep: 0, theOneResults: null }
      }
      return { ...state, currentRound: state.currentRound + 1, roundPhase: 'deciding', decidingPlayerIdx: 0, roundDecisions: {}, revealStep: 0, roundResults: null }
    }

    case 'FINISH_THE_ONE': return resolveWinner(state)

    case 'TB_DECIDE': {
      const tied = state.players.filter(pl => state.tiedIds.includes(pl.id))
      const cur  = tied[state.tbDecidingIdx]
      const newD = { ...state.tbDecisions, [cur.id]: p.action }
      const done = tied.every(pl => newD[pl.id] != null)
      if (done) return { ...state, tbDecisions: newD, tbPhase: 'revealing' }
      return { ...state, tbDecisions: newD, tbPhase: 'pass_device', tbDecidingIdx: state.tbDecidingIdx + 1 }
    }

    case 'TB_CONTINUE_NEXT': return { ...state, tbPhase: 'deciding' }

    case 'TB_ADVANCE_REVEAL': {
      const next   = (state.tbRevealStep ?? 0) + 1
      const hidden = state.tbProfile.traits.filter(t => !t.startVisible).length
      if (next > hidden) {
        const tied    = state.players.filter(pl => state.tiedIds.includes(pl.id))
        const tbScore = state.tbProfile.tbScore
        const daters  = tied.filter(pl => state.tbDecisions[pl.id] === 'date')
        const ghosters = tied.filter(pl => state.tbDecisions[pl.id] === 'ghost')
        const winner  = tbScore > 0
          ? (daters.length === 1 ? daters[0].id : tied[0].id)
          : (ghosters.length === 1 ? ghosters[0].id : tied[0].id)
        return { ...state, tbRevealStep: next, screen: 'results', winnerId: winner }
      }
      return { ...state, tbRevealStep: next }
    }

    default: return state
  }
}

// ─── shared components ────────────────────────────────────────────────────────
function Hud({ players, currentRound, mode, currentPlayer }) {
  const p = mode === 'single' ? players.find(pl => !pl.isNPC) : currentPlayer
  if (!p) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: C.bg, borderBottom: hairline }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[0,1,2].map(i => <span key={i} style={{ fontSize: 13, color: C.accent, opacity: i < p.hearts ? 1 : 0.18 }}>♥</span>)}
          {p.heartbreakMode && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, marginLeft: 4, letterSpacing: '0.12em' }}>HALF CREDIT</span>}
        </div>
        <span style={{ fontFamily: WS, fontWeight: 500, color: '#555', fontSize: 12 }}>🔎×{p.stalkTokens}</span>
        <span style={{ fontFamily: WS, fontWeight: 500, color: '#555', fontSize: 12 }}>◌×{p.ghosts}</span>
        <span style={{ fontFamily: WS, fontWeight: 700, color: p.loveScore >= 0 ? C.teal : C.accent, fontSize: 13 }}>{p.loveScore >= 0 ? '+' : ''}{p.loveScore}</span>
      </div>
      <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 12, letterSpacing: '0.12em' }}>
        MATCH {String(currentRound + 1).padStart(2, '0')} / 07
      </div>
    </div>
  )
}

// 3px left-bar trait row — Option B signature
// grow=true: fills parent flex cell (no fixed padding); grow=false (default): fixed padding for scored/reveal views
function TraitRow({ trait, revealed, stalked, grow = false }) {
  const show       = revealed || stalked
  const isPositive = trait.value > 0
  const isRedFlag  = trait.value <= -3
  const barColor   = !show ? C.slate : isPositive ? C.teal : isRedFlag ? C.accent : C.gold
  const textColor  = show ? C.cream : '#3a3535'
  const valColor   = !show ? '#3a3535' : isPositive ? C.teal : isRedFlag ? C.accent : C.gold
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
      borderLeft: show ? `3px solid ${barColor}` : `3px solid transparent`,
      paddingLeft: 11, paddingRight: 11,
      ...(grow
        ? { height: '100%' }
        : { paddingTop: 9, paddingBottom: 9, borderBottom: !show ? `1px dashed ${C.slate}` : `1px solid transparent` }
      ),
    }}>
      <span style={{ fontFamily: WS, fontWeight: show ? 400 : 300, color: textColor, fontSize: grow ? 12 : 13, lineHeight: 1.3, flex: 1 }}>
        {show ? trait.text : '?????'}
        {stalked && !revealed && <span style={{ marginLeft: 5, fontSize: 9, color: C.gold }}>🔎</span>}
      </span>
      <span style={{ fontFamily: WS, fontWeight: 700, color: valColor, fontSize: 11, minWidth: 26, textAlign: 'right' }}>
        {show ? (trait.value > 0 ? `+${trait.value}` : trait.value) : '?'}
      </span>
    </div>
  )
}

function PassDevice({ name, avatar, onReady }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: DVH, padding: '0 24px', textAlign: 'center', background: C.bg }}>
      <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 26, letterSpacing: '0.08em' }}>PASS THE DEVICE</div>
      <div style={{ fontFamily: WS, fontWeight: 300, color: C.cream, fontSize: 18, marginTop: 16, marginBottom: 32 }}>{avatar} {name}, you're up.</div>
      <button onClick={onReady} style={{ fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, minHeight: 52, minWidth: 200, border: 'none', borderRadius: 4, letterSpacing: '0.12em', cursor: 'pointer' }}>
        I'M READY
      </button>
    </div>
  )
}

// ─── MODE SELECT ──────────────────────────────────────────────────────────────
function ModeSelectScreen({ dispatch }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: DVH, padding: '0 24px', background: C.bg }}>
      <div style={{ marginBottom: 48, textAlign: 'center', userSelect: 'none' }}>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(60px,16vw,108px)', color: C.accent, lineHeight: 0.88 }}>THE</div>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(60px,16vw,108px)', color: C.cream, lineHeight: 0.88 }}>CATCH</div>
        <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: '#555', marginTop: 20 }}>Same rules. Louder consequences.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'single' })}
          style={{ fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          SINGLE PLAYER
        </button>
        <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'multi' })}
          style={{ fontFamily: WS, fontWeight: 700, background: 'transparent', border: `1px solid ${C.accent}`, color: C.accent, fontSize: 15, letterSpacing: '0.12em', minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>
          MULTIPLAYER — 2–4
        </button>
      </div>
    </div>
  )
}

// ─── PLAYER SETUP ─────────────────────────────────────────────────────────────
function PlayerSetupScreen({ state, dispatch }) {
  // Single player: one slot, multi: multiple slots
  const [slots, setSlots] = useState(
    state.mode === 'single'
      ? [{ name: '', avatar: '😊' }]
      : [{ name: '', avatar: '😊' }, { name: '', avatar: '😎' }]
  )
  const update   = (i, key, val) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl))
  const canStart = slots.every(s => s.name.trim().length > 0) && (state.mode === 'single' || slots.length >= 2)
  const start    = () => dispatch({ type: 'GO_TO_CUSTOM_TRAITS', players: slots.map((sl, i) => makePlayer(`p${i}`, sl.name.trim(), sl.avatar)) })

  if (state.mode === 'single') {
    const sl = slots[0]
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 20px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(38px,11vw,56px)', lineHeight: 0.88 }}>WHO'S</div>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(38px,11vw,56px)', lineHeight: 0.88 }}>PLAYING?</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#555', marginTop: 10 }}>Pick your look. Your rep follows you all game.</p>
          </div>

          {/* Avatar row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {PLAYER_AVATARS.map(av => (
              <button key={av} onClick={() => update(0, 'avatar', av)}
                style={{ width: 46, height: 46, fontSize: 22, background: sl.avatar === av ? C.accent : C.card, border: sl.avatar === av ? `1px solid ${C.accent}` : hairline, borderRadius: 2, cursor: 'pointer' }}>
                {av}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            style={{ width: '100%', fontFamily: ANTON, fontSize: 28, letterSpacing: '0.04em', background: C.card, color: C.cream, border: sl.name ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '14px 16px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
            placeholder="YOUR NAME"
            value={sl.name}
            onChange={e => update(0, 'name', e.target.value)}
            maxLength={16}
            autoFocus
          />

          {/* Stats preview */}
          <div style={{ display: 'flex', gap: 20, padding: '12px 0' }}>
            <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#555', letterSpacing: '0.1em' }}>♥ × 3</span>
            <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#555', letterSpacing: '0.1em' }}>🔍 × 3</span>
            <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#555', letterSpacing: '0.1em' }}>◌ × 3</span>
          </div>

          {/* NPC rival notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: C.card, border: hairline, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: -4 }}>
              <span style={{ fontSize: 18 }}>🌙</span>
              <span style={{ fontSize: 18, marginLeft: -4 }}>🔥</span>
            </div>
            <div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: C.gold, letterSpacing: '0.15em' }}>2 RIVALS IN THE ROOM</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#666', marginTop: 2 }}>They're already reading profiles.</div>
            </div>
          </div>

          <button onClick={start} disabled={!canStart}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: canStart ? C.accent : C.slate, color: canStart ? '#fff' : '#555', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: canStart ? 'pointer' : 'not-allowed' }}>
            NEXT →
          </button>
        </div>
      </div>
    )
  }

  // Multiplayer setup
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, padding: '32px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(36px,10vw,52px)', lineHeight: 0.88 }}>BUILD YOUR</div>
          <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(36px,10vw,52px)', lineHeight: 0.88 }}>SQUAD.</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#555', marginTop: 10 }}>Pass the phone around. Everyone decides.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slots.map((sl, i) => (
            <div key={i} style={{ padding: 14, background: C.card, border: hairline }}>
              <p style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.accent, letterSpacing: '0.2em', marginBottom: 10 }}>PLAYER {i + 1}</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {PLAYER_AVATARS.map(av => (
                  <button key={av} onClick={() => update(i, 'avatar', av)}
                    style={{ width: 38, height: 38, fontSize: 18, background: sl.avatar === av ? C.accent : C.cardAlt, border: sl.avatar === av ? `1px solid ${C.accent}` : '1px solid transparent', borderRadius: 2, cursor: 'pointer' }}>
                    {av}
                  </button>
                ))}
              </div>
              <input
                style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: C.cream, fontSize: 16, border: hairline, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
                placeholder="Enter name..."
                value={sl.name}
                onChange={e => update(i, 'name', e.target.value)}
                maxLength={16}
              />
            </div>
          ))}
          {slots.length < 4 && (
            <button onClick={() => setSlots(s => [...s, { name: '', avatar: PLAYER_AVATARS[s.length] }])}
              style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, padding: '12px 0', border: `1px dashed ${C.slate}`, color: '#555', background: 'transparent', cursor: 'pointer', borderRadius: 2 }}>
              + Add Player
            </button>
          )}
        </div>
        <button onClick={start} disabled={!canStart}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: canStart ? C.accent : C.slate, color: canStart ? '#fff' : '#555', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: canStart ? 'pointer' : 'not-allowed', marginTop: 20 }}>
          NEXT →
        </button>
      </div>
    </div>
  )
}

// ─── CUSTOM TRAITS ────────────────────────────────────────────────────────────
function CustomTraitsScreen({ state, dispatch }) {
  const [text, setText] = useState('')
  const [isGreen, setIsGreen] = useState(true)

  const addTrait = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_CUSTOM_TRAIT', text: trimmed, value: isGreen ? 2 : -2 })
    setText('')
  }

  const hasTraits = state.customTraits.length > 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, padding: '28px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(32px,9vw,48px)', lineHeight: 0.88 }}>MAKE IT</div>
          <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(32px,9vw,48px)', lineHeight: 0.88 }}>PERSONAL.</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#555', marginTop: 10 }}>Add real behaviors you've seen. They'll show up mixed into the profiles.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <input
            style={{ width: '100%', fontFamily: WS, fontWeight: 400, background: C.card, color: C.cream, fontSize: 14, border: text ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
            placeholder="Leaves you on read for 3 days then acts normal..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={80}
            onKeyDown={e => { if (e.key === 'Enter') addTrait() }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setIsGreen(true)}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '10px 0', background: isGreen ? `${C.teal}22` : 'transparent', border: `1px solid ${isGreen ? C.teal : '#333'}`, color: isGreen ? C.teal : '#444', borderRadius: 2, cursor: 'pointer' }}>
              🟢 GREEN FLAG
            </button>
            <button onClick={() => setIsGreen(false)}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '10px 0', background: !isGreen ? `${C.accent}22` : 'transparent', border: `1px solid ${!isGreen ? C.accent : '#333'}`, color: !isGreen ? C.accent : '#444', borderRadius: 2, cursor: 'pointer' }}>
              🚩 RED FLAG
            </button>
          </div>
          <button onClick={addTrait} disabled={!text.trim()}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', padding: '12px 0', background: text.trim() ? C.cardAlt : 'transparent', border: text.trim() ? hairline : `1px dashed ${C.slate}`, color: text.trim() ? C.cream : '#444', borderRadius: 2, cursor: text.trim() ? 'pointer' : 'not-allowed' }}>
            + ADD TRAIT
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#2a2525' }} />
            <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#444', letterSpacing: '0.14em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#2a2525' }} />
          </div>

          {/* Randomize button */}
          <button
            onClick={() => {
              const picked = shuffle([...TRAIT_POOL]).slice(0, 5)
              dispatch({ type: 'RANDOMIZE_TRAITS', traits: picked })
            }}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', padding: '12px 0', background: 'transparent', border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 2, cursor: 'pointer' }}>
            🎲 RANDOMIZE FOR ME
          </button>
        </div>

        {hasTraits && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#444', letterSpacing: '0.2em', marginBottom: 8 }}>YOUR TRAITS ({state.customTraits.length})</div>
            {state.customTraits.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: C.card, border: hairline, marginBottom: 4, borderLeft: `3px solid ${t.value > 0 ? C.teal : C.accent}` }}>
                <span style={{ fontFamily: WS, fontWeight: 400, fontSize: 13, color: C.cream, flex: 1, marginRight: 8 }}>{t.text}</span>
                <button onClick={() => dispatch({ type: 'REMOVE_CUSTOM_TRAIT', idx: i })}
                  style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button onClick={() => dispatch({ type: 'START_GAME' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {hasTraits ? `START WITH ${state.customTraits.length} CUSTOM TRAIT${state.customTraits.length > 1 ? 'S' : ''} →` : 'START THE GAME →'}
          </button>
          {hasTraits && (
            <button onClick={() => dispatch({ type: 'START_GAME', skipCustom: true })}
              style={{ width: '100%', fontFamily: WS, fontWeight: 500, background: 'transparent', border: `1px solid #333`, color: '#555', fontSize: 13, letterSpacing: '0.1em', minHeight: 44, borderRadius: 4, cursor: 'pointer' }}>
              SKIP — PLAY WITHOUT CUSTOM TRAITS
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE CARD (photo + tags, no traits) ───────────────────────────────────
function ProfileCard({ profile, goldTheme }) {
  return (
    <div style={{ background: C.card, border: hairline, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: 'clamp(200px, 28dvh, 260px)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: profile.doll ? DOLL_BG[profile.doll] : (goldTheme ? '#12100a' : '#111') }}>
        {profile.doll
          ? <div style={{ transform: 'scale(1.5)', transformOrigin: 'top center', marginTop: -10 }}><Doll name={profile.doll} /></div>
          : <span style={{ fontSize: 72, lineHeight: 1, display: 'flex', alignItems: 'center', height: '100%' }}>{profile.emoji}</span>
        }
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 12px 9px', background: goldTheme ? 'linear-gradient(to top,rgba(8,6,0,0.97),transparent)' : 'linear-gradient(to top,rgba(0,0,0,0.96),transparent)' }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 19, lineHeight: 1 }}>{profile.name.toUpperCase()}, {profile.age}</div>
          {profile.archetype && <div style={{ fontFamily: WS, fontWeight: 700, color: C.gold, fontSize: 9, letterSpacing: '0.2em', marginTop: 2 }}>{profile.archetype}</div>}
        </div>
      </div>
      {profile.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '7px 12px', borderBottom: hairline }}>
          {profile.tags.map((tag, i) => (
            <span key={i} style={{ fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: '#666', fontSize: 8, letterSpacing: '0.12em', padding: '2px 6px', borderRadius: 2 }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// Compact rival decision recap shown in reveal phase
function RivalBar({ players, decisions, mode }) {
  const showRivals = mode === 'multi' || players.some(p => p.isNPC)
  if (!showRivals) return null
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
      {players.map(pl => {
        const action = decisions[pl.id]?.action
        const dated  = action === 'date' || action === 'take_chance'
        return (
          <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: dated ? `${C.accent}1a` : C.cardAlt, border: dated ? `1px solid ${C.accent}44` : hairline, borderRadius: 2 }}>
            <span style={{ fontSize: 14 }}>{pl.avatar}</span>
            <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: dated ? C.accent : '#555', letterSpacing: '0.08em' }}>
              {pl.isNPC ? pl.name.toUpperCase() : 'YOU'} {dated ? '♥' : '◌'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── ROUND ────────────────────────────────────────────────────────────────────
function RoundScreen({ state, dispatch }) {
  const profile   = state.profiles[state.currentRound]
  const curPlayer = state.players.filter(pl => !pl.isNPC)[state.decidingPlayerIdx] ?? state.players[0]
  const dec       = state.roundDecisions[curPlayer?.id] ?? { stalkedIdxs: [] }

  const traitVisible  = i => profile.traits[i].startVisible || (dec.stalkedIdxs ?? []).includes(i)
  const traitInReveal = i => {
    if (profile.traits[i].startVisible) return true
    const hidden = profile.traits.map((t, idx) => ({ t, idx })).filter(({ t }) => !t.startVisible)
    const pos = hidden.findIndex(({ idx }) => idx === i)
    return pos !== -1 && pos < state.revealStep
  }

  const [showScorePopup, setShowScorePopup] = useState(false)
  useEffect(() => {
    if (state.roundPhase === 'scored') {
      setShowScorePopup(true)
      const id = setTimeout(() => setShowScorePopup(false), 1800)
      return () => clearTimeout(id)
    }
  }, [state.roundPhase, state.currentRound])

  if (state.roundPhase === 'pass_device') {
    const humanPlayers = state.players.filter(pl => !pl.isNPC)
    const next = humanPlayers[state.decidingPlayerIdx]
    return <PassDevice name={next?.name} avatar={next?.avatar} onReady={() => dispatch({ type: 'CONTINUE_NEXT' })} />
  }

  if (state.roundPhase === 'scored') {
    const results   = state.roundResults
    const score     = profileScore(profile)
    const anyRedFlag = state.players.some(pl => results[pl.id]?.isRedFlag)
    const realPlayer = state.players.find(pl => !pl.isNPC)
    const myResult   = results[realPlayer?.id]
    const sorted     = [...state.players].sort((a, b) => b.loveScore - a.loveScore)

    if (showScorePopup && myResult) {
      const pts        = myResult.pts
      const isGhost    = myResult.action === 'ghost'
      const ptColor    = pts > 0 ? C.teal : pts < 0 ? C.accent : C.slate
      const ptGlow     = pts > 0
        ? `0 0 32px rgba(124,224,168,0.7), 0 0 72px rgba(124,224,168,0.35)`
        : pts < 0
        ? `0 0 32px rgba(255,77,109,0.7), 0 0 72px rgba(255,77,109,0.35)`
        : 'none'
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, gap: 6, userSelect: 'none' }}>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.22em', color: '#555' }}>
            {isGhost ? '◌ GHOSTED' : '♥ DATED'}
          </div>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(100px,26vw,148px)', color: ptColor, lineHeight: 1, textShadow: ptGlow }}>
            {pts > 0 ? `+${pts}` : pts === 0 ? '±0' : pts}
          </div>
          <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, letterSpacing: '0.18em', color: '#555' }}>LOVE POINTS</div>
          {pts > 0 && score >= 7 && <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.teal, letterSpacing: '0.14em', marginTop: 4 }}>▲ STANDARDS: WORKING</div>}
          {pts < 0 && myResult.isRedFlag && <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.accent, letterSpacing: '0.14em', marginTop: 4 }}>🚩 RED FLAG PENALTY</div>}
          {isGhost && <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#555', letterSpacing: '0.14em', marginTop: 4 }}>SAFE PLAY.</div>}
        </div>
      )
    }

    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
        {anyRedFlag && (
          <div style={{ padding: '12px 20px', textAlign: 'center', background: '#1a0008', borderBottom: `1px solid ${C.accent}44` }}>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 20, letterSpacing: '0.1em' }}>🚩 ABSOLUTELY NOT</div>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#cc4466', marginTop: 3 }}>Dating a −5 or worse costs you 2 extra points.</div>
          </div>
        )}
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: ANTON, fontSize: 48, color: score >= 7 ? C.teal : score <= -5 ? C.accent : score > 0 ? C.cream : '#555', lineHeight: 1 }}>
              {score > 0 ? `+${score}` : score}
            </div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em' }}>COMPATIBILITY SCORE</div>
            {score >= 7  && <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: C.teal,   marginTop: 4 }}>▲ STANDARDS: WORKING</div>}
            {score <= -5 && <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: C.accent, marginTop: 4 }}>WE SAW THE SIGNS</div>}
          </div>

          {/* All traits revealed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16, background: C.card, border: hairline }}>
            {profile.traits.map((t, i) => <TraitRow key={i} trait={t} revealed={true} stalked={false} />)}
          </div>

          {/* Your result */}
          {myResult && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: myResult.action === 'date' && myResult.pts > 0 ? `${C.teal}12` : myResult.action === 'date' && myResult.pts < 0 ? `${C.accent}12` : C.card, border: hairline, marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>
                  {realPlayer?.avatar} {state.mode === 'single' ? 'YOU' : realPlayer?.name} — {myResult.action === 'date' ? '♥ DATED' : '◌ GHOSTED'}{myResult.isRedFlag ? ' 🚩' : ''}
                </div>
                {myResult.action === 'date' && myResult.pts > 0 && <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', marginTop: 2 }}>STANDARDS: WORKING</div>}
              </div>
              <div style={{ fontFamily: ANTON, fontSize: 24, color: myResult.pts > 0 ? C.teal : myResult.pts < 0 ? C.accent : '#555' }}>
                {myResult.pts > 0 ? `+${myResult.pts}` : myResult.pts === 0 ? '±0' : myResult.pts}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#444', letterSpacing: '0.2em', marginBottom: 6 }}>LEADERBOARD</div>
            {sorted.map((pl, rank) => {
              const r = results[pl.id]
              const isMe = !pl.isNPC
              return (
                <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: isMe ? `${C.accent}12` : 'transparent', border: isMe ? `1px solid ${C.accent}30` : hairline, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: ANTON, fontSize: 12, color: '#444', minWidth: 16 }}>#{rank + 1}</span>
                    <span style={{ fontSize: 16 }}>{pl.avatar}</span>
                    <span style={{ fontFamily: WS, fontWeight: isMe ? 700 : 400, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe && state.mode === 'single' ? 'YOU' : pl.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {r && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: r.action === 'date' || r.action === 'take_chance' ? C.accent : '#555', letterSpacing: '0.08em' }}>{r.action === 'date' ? '♥' : '◌'}</span>}
                    <span style={{ fontFamily: ANTON, fontSize: 18, color: pl.loveScore >= 0 ? C.teal : C.accent }}>{pl.loveScore >= 0 ? '+' : ''}{pl.loveScore}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <button onClick={() => dispatch({ type: 'NEXT_ROUND' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {state.currentRound >= 6 ? 'SEE FINAL RESULTS →' : 'NEXT MATCH →'}
          </button>
        </div>
      </div>
    )
  }

  if (state.roundPhase === 'revealing') {
    const hidden   = profile.traits.filter(t => !t.startVisible).length
    const allShown = state.revealStep >= hidden
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.velvet }}>
        <Hud players={state.players} currentRound={state.currentRound} mode={state.mode} currentPlayer={curPlayer} />
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px 16px' }}>
          <RivalBar players={state.players} decisions={state.roundDecisions} mode={state.mode} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{profile.emoji}</span>
            <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 20 }}>{profile.name.toUpperCase()}, {profile.age}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16, background: C.card, border: hairline }}>
            {profile.traits.map((t, i) => <TraitRow key={i} trait={t} revealed={t.startVisible || traitInReveal(i)} stalked={false} />)}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: C.cream, fontSize: 15, letterSpacing: '0.1em', border: hairline, minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>TAP TO SKIP ▼</button>
            : <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.1em', border: 'none', minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>SEE SCORES →</button>
          }
        </div>
      </div>
    )
  }

  // deciding phase — strict flex column: no scrolling, buttons always visible
  const canStalk = curPlayer?.stalkTokens > 0 && (dec.stalkedIdxs ?? []).length < profile.traits.filter(t => !t.startVisible).length
  const canGhost = (curPlayer?.ghosts ?? 0) > 0

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <Hud players={state.players} currentRound={state.currentRound} mode={state.mode} currentPlayer={curPlayer} />
      {state.mode === 'multi' && (
        <div style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '7px 16px', textAlign: 'center', background: C.card, color: C.accent, borderBottom: hairline }}>
          {curPlayer?.avatar} {curPlayer?.name?.toUpperCase()}'S TURN
        </div>
      )}

      {/* Profile card — fixed height, no grow */}
      <div style={{ flex: '0 0 auto' }}>
        <ProfileCard profile={profile} goldTheme={false} />
      </div>

      {/* Traits — grow to fill remaining space, each row stretches equally */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderLeft: hairline, borderRight: hairline, minHeight: 0 }}>
        {profile.traits.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'stretch', borderBottom: i < profile.traits.length - 1 ? `1px solid ${C.slate}` : 'none' }}>
            <TraitRow trait={t} revealed={traitVisible(i)} stalked={(dec.stalkedIdxs ?? []).includes(i) && !t.startVisible} grow />
          </div>
        ))}
      </div>

      {/* Action buttons — always pinned at bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 16px 14px', background: C.bg }}>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'date' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          ♥ DATE
        </button>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'ghost' })} disabled={!canGhost}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', border: `1px solid ${canGhost ? '#484848' : C.slate}`, color: canGhost ? '#aaa' : '#444', fontSize: 14, letterSpacing: '0.12em', height: 46, borderRadius: 4, cursor: canGhost ? 'pointer' : 'not-allowed' }}>
          {canGhost ? '◌ GHOST' : 'NO GHOSTS LEFT. COMMIT.'}
        </button>
        <button onClick={() => dispatch({ type: 'STALK' })} disabled={!canStalk}
          style={{ width: '100%', fontFamily: WS, fontWeight: 500, color: canStalk ? C.gold : '#3a3535', fontSize: 12, letterSpacing: '0.12em', background: 'transparent', border: `1px dashed ${canStalk ? C.gold : C.slate}`, borderRadius: 4, height: 38, cursor: canStalk ? 'pointer' : 'not-allowed' }}>
          🔍 STALK · {curPlayer?.stalkTokens ?? 0} LEFT
        </button>
      </div>
    </div>
  )
}

// ─── THE ONE ──────────────────────────────────────────────────────────────────
function TheOneScreen({ state, dispatch }) {
  const profile     = THE_ONE_PROFILE
  const score       = profileScore(profile)
  const qualPlayers = state.players.filter(p => state.qualifiedIds.includes(p.id))
  const humanQual   = qualPlayers.filter(p => !p.isNPC)
  const curPlayer   = humanQual[state.theOneDecidingIdx]
  const dec         = state.theOneDecisions[curPlayer?.id] ?? { stalkedIdxs: [] }

  const traitVisible  = i => profile.traits[i].startVisible || (dec.stalkedIdxs ?? []).includes(i)
  const traitInReveal = i => {
    if (profile.traits[i].startVisible) return true
    const hidden = profile.traits.map((t, idx) => ({ t, idx })).filter(({ t }) => !t.startVisible)
    const pos = hidden.findIndex(({ idx }) => idx === i)
    return pos !== -1 && pos < state.theOneRevealStep
  }

  if (state.theOnePhase === 'pass_device') {
    const next = humanQual[state.theOneDecidingIdx]
    return <PassDevice name={next?.name} avatar={next?.avatar} onReady={() => dispatch({ type: 'CONTINUE_NEXT' })} />
  }

  if (state.theOnePhase === 'scored') {
    const results = state.theOneResults
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '28px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 16, letterSpacing: '0.2em' }}>THE ONE</div>
          <div style={{ fontFamily: ANTON, fontSize: 52, color: score >= 7 ? C.teal : C.accent, lineHeight: 1 }}>
            {score > 0 ? `+${score}` : score}
          </div>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em', marginBottom: 20 }}>COMPATIBILITY SCORE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left', marginBottom: 20, background: C.card, border: hairline }}>
            {profile.traits.map((t, i) => <TraitRow key={i} trait={t} revealed={true} stalked={false} />)}
          </div>
          {qualPlayers.map(pl => {
            const r = results[pl.id]
            if (!r) return null
            const isMe = !pl.isNPC
            return (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isMe ? `${C.accent}12` : C.card, border: isMe ? `1px solid ${C.accent}30` : hairline, marginBottom: 6, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{pl.avatar}</span>
                  <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe ? 'YOU' : pl.name}</span>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: r.foundTheOne ? C.teal : r.action === 'walk_away' ? '#555' : C.accent, letterSpacing: '0.08em' }}>
                  {r.foundTheOne ? '♛ +10' : r.action === 'walk_away' ? 'WALKED' : '♥̸ −10'}
                </div>
              </div>
            )
          })}
          <button onClick={() => dispatch({ type: 'FINISH_THE_ONE' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 10 }}>
            FINAL RESULTS →
          </button>
        </div>
      </div>
    )
  }

  if (state.theOnePhase === 'revealing') {
    const hidden   = profile.traits.filter(t => !t.startVisible).length
    const allShown = state.theOneRevealStep >= hidden
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.velvet }}>
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '28px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 14, fontFamily: ANTON, color: C.gold, fontSize: 18, letterSpacing: '0.2em' }}>THE ONE</div>
          <RivalBar players={qualPlayers} decisions={state.theOneDecisions} mode={state.mode} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16, background: C.card, border: hairline }}>
            {profile.traits.map((t, i) => <TraitRow key={i} trait={t} revealed={t.startVisible || traitInReveal(i)} stalked={false} />)}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: C.cream, fontSize: 15, letterSpacing: '0.1em', border: hairline, minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>TAP TO SKIP ▼</button>
            : <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 15, letterSpacing: '0.1em', border: 'none', minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>SEE THE RESULT →</button>
          }
        </div>
      </div>
    )
  }

  const canStalk = curPlayer?.stalkTokens > 0 && (dec.stalkedIdxs ?? []).length < profile.traits.filter(t => !t.startVisible).length
  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: C.velvet, overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{ flex: '0 0 auto', padding: '10px 16px 8px', textAlign: 'center', borderBottom: hairline }}>
        <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 16, letterSpacing: '0.2em' }}>THE ONE</div>
        <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#999', margin: '2px 0 0' }}>One final decision. Choose wisely.</p>
      </div>
      {state.mode === 'multi' && (
        <div style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '7px 16px', textAlign: 'center', background: `${C.accent}1a`, color: C.accent, borderBottom: `1px solid ${C.accent}33` }}>
          {curPlayer?.avatar} {curPlayer?.name?.toUpperCase()}'S TURN
        </div>
      )}

      {/* Profile card — fixed */}
      <div style={{ flex: '0 0 auto' }}>
        <ProfileCard profile={profile} goldTheme={true} />
      </div>

      {/* Traits — grow */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderLeft: hairline, borderRight: hairline, minHeight: 0 }}>
        {profile.traits.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'stretch', borderBottom: i < profile.traits.length - 1 ? `1px solid ${C.slate}` : 'none' }}>
            <TraitRow trait={t} revealed={traitVisible(i)} stalked={(dec.stalkedIdxs ?? []).includes(i) && !t.startVisible} grow />
          </div>
        ))}
      </div>

      {/* Buttons — pinned bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 16px 14px', background: C.velvet }}>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'take_chance' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          ♛ TAKE A CHANCE
        </button>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'walk_away' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', border: '1px solid #484848', color: '#aaa', fontSize: 14, letterSpacing: '0.12em', height: 46, borderRadius: 4, cursor: 'pointer' }}>
          ◌ WALK AWAY
        </button>
        <button onClick={() => dispatch({ type: 'STALK' })} disabled={!canStalk}
          style={{ width: '100%', fontFamily: WS, fontWeight: 500, color: canStalk ? C.gold : '#3a3535', fontSize: 12, letterSpacing: '0.12em', background: 'transparent', border: `1px dashed ${canStalk ? C.gold : C.slate}`, borderRadius: 4, height: 38, cursor: canStalk ? 'pointer' : 'not-allowed' }}>
          🔍 STALK · {curPlayer?.stalkTokens ?? 0} LEFT
        </button>
      </div>
    </div>
  )
}

// ─── TIEBREAKER ───────────────────────────────────────────────────────────────
function TiebreakerScreen({ state, dispatch }) {
  const profile   = state.tbProfile
  const tied      = state.players.filter(p => state.tiedIds.includes(p.id))
  const curPlayer = tied[state.tbDecidingIdx]

  const traitInReveal = i => {
    if (profile.traits[i].startVisible) return true
    const hidden = profile.traits.map((t, idx) => ({ t, idx })).filter(({ t }) => !t.startVisible)
    const pos = hidden.findIndex(({ idx }) => idx === i)
    return pos !== -1 && pos < (state.tbRevealStep ?? 0)
  }

  if (state.tbPhase === 'pass_device') {
    const next = tied[state.tbDecidingIdx]
    return <PassDevice name={next?.name} avatar={next?.avatar} onReady={() => dispatch({ type: 'TB_CONTINUE_NEXT' })} />
  }

  if (state.tbPhase === 'revealing') {
    const hidden   = profile.traits.filter(t => !t.startVisible).length
    const allShown = (state.tbRevealStep ?? 0) >= hidden
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: C.velvet }}>
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '28px 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 20, letterSpacing: '0.12em' }}>⚡ SPEED DATING</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#999', marginTop: 4 }}>Tiebreaker. Whoever made the better call wins.</p>
          </div>
          <RivalBar players={tied} decisions={state.tbDecisions} mode={state.mode} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16, background: C.card, border: hairline }}>
            {profile.traits.map((t, i) => <TraitRow key={i} trait={t} revealed={t.startVisible || traitInReveal(i)} stalked={false} />)}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'TB_ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: C.cream, fontSize: 15, letterSpacing: '0.1em', border: hairline, minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>TAP TO SKIP ▼</button>
            : <button onClick={() => dispatch({ type: 'TB_ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 15, letterSpacing: '0.12em', border: 'none', minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>♛ CROWN THE CATCH →</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flex: '0 0 auto', padding: '10px 16px 8px', textAlign: 'center', borderBottom: hairline }}>
        <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 16, letterSpacing: '0.1em' }}>⚡ SPEED DATING</div>
        <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', margin: '2px 0 0' }}>It's a tie. One profile. No STALK Tokens.</p>
      </div>
      {state.mode === 'multi' && (
        <div style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '7px 16px', textAlign: 'center', background: C.card, color: C.accent, borderBottom: hairline }}>
          {curPlayer?.avatar} {curPlayer?.name?.toUpperCase()}'S TURN
        </div>
      )}

      {/* Photo */}
      <div style={{ flex: '0 0 auto', position: 'relative', height: 'clamp(120px, 18dvh, 170px)', overflow: 'hidden', background: profile.doll ? DOLL_BG[profile.doll] : '#111', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {profile.doll
          ? <div style={{ transform: 'scale(1.5)', transformOrigin: 'top center', marginTop: -10 }}><Doll name={profile.doll} /></div>
          : <span style={{ fontSize: 64, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{profile.emoji}</span>
        }
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 12px 9px', background: 'linear-gradient(to top,rgba(0,0,0,0.95),transparent)' }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 19 }}>{profile.name.toUpperCase()}, {profile.age}</div>
        </div>
      </div>

      {/* Traits — grow */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.card, borderLeft: hairline, borderRight: hairline, minHeight: 0 }}>
        {profile.traits.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'stretch', borderBottom: i < profile.traits.length - 1 ? `1px solid ${C.slate}` : 'none' }}>
            <TraitRow trait={t} revealed={t.startVisible} stalked={false} grow />
          </div>
        ))}
      </div>

      {/* Buttons — pinned bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 16px 14px', background: C.bg }}>
        <button onClick={() => dispatch({ type: 'TB_DECIDE', action: 'date' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          ♥ DATE
        </button>
        <button onClick={() => dispatch({ type: 'TB_DECIDE', action: 'ghost' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', border: '1px solid #484848', color: '#aaa', fontSize: 14, letterSpacing: '0.12em', height: 46, borderRadius: 4, cursor: 'pointer' }}>
          ◌ GHOST
        </button>
      </div>
    </div>
  )
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsScreen({ state, dispatch, onClose }) {
  const allPlayers = [...state.players].sort((a, b) => b.loveScore - a.loveScore)
  const realPlayer = state.players.find(p => !p.isNPC)
  const winner     = state.mode === 'multi' ? state.players.find(p => p.id === state.winnerId) : realPlayer
  const persona    = winner ? getPersonality(winner) : null
  const myRank     = allPlayers.findIndex(p => !p.isNPC) + 1

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '28px 16px' }}>
        {/* Winner/your result card */}
        {winner && (
          <div style={{ textAlign: 'center', marginBottom: 24, padding: 22, background: C.velvet, border: `1px solid ${C.gold}44` }}>
            <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 11, letterSpacing: '0.2em' }}>
              {state.mode === 'single' ? `YOU FINISHED #${myRank}` : '♛ THE CATCH'}
            </div>
            <div style={{ fontSize: 44, marginTop: 8 }}>{winner.avatar}</div>
            <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 26, lineHeight: 1, marginTop: 6 }}>
              {state.mode === 'single' ? 'YOU ARE' : winner.name.toUpperCase() + ' IS'}
            </div>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 26, lineHeight: 1.1 }}>{persona?.title}</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#999', marginTop: 10 }}>{persona?.desc}</p>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color: C.teal, marginTop: 10 }}>
              {winner.loveScore} LOVE POINTS · {[0,1,2].map(i => <span key={i} style={{ color: C.accent, opacity: i < winner.hearts ? 1 : 0.18 }}>♥</span>)}
            </div>
          </div>
        )}

        {/* Full leaderboard */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#444', letterSpacing: '0.2em', marginBottom: 8 }}>
            {state.mode === 'single' ? 'FINAL RANKINGS' : 'LEADERBOARD'}
          </div>
          {allPlayers.map((p, rank) => {
            const isMe   = !p.isNPC
            const persona = getPersonality(p)
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: isMe ? `${C.accent}12` : C.card, border: (state.mode === 'multi' && p.id === winner?.id) ? `1px solid ${C.gold}55` : isMe ? `1px solid ${C.accent}30` : hairline, marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: ANTON, fontSize: 13, color: '#444', minWidth: 18 }}>#{rank + 1}</span>
                  <span style={{ fontSize: 20 }}>{p.avatar}</span>
                  <div>
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe ? 'YOU' : p.name}</div>
                    <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 10, color: '#555', letterSpacing: '0.08em' }}>{persona.title}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: ANTON, fontSize: 20, color: p.loveScore >= 0 ? C.teal : C.accent }}>{p.loveScore >= 0 ? '+' : ''}{p.loveScore}</div>
                  <div style={{ fontSize: 10 }}>{[0,1,2].map(i => <span key={i} style={{ color: C.accent, opacity: i < p.hearts ? 1 : 0.18 }}>♥</span>)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: state.mode })}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: C.cardAlt, color: C.cream, fontSize: 14, letterSpacing: '0.1em', border: hairline, minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>
            PLAY AGAIN
          </button>
          <button onClick={onClose}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.1em', border: 'none', minHeight: 52, borderRadius: 4, cursor: 'pointer' }}>
            EXIT
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchGame({ onClose }) {
  const [state, dispatch] = useReducer(reducer, INIT)

  useEffect(() => {
    let id
    if (state.screen === 'round' && state.roundPhase === 'revealing') {
      const hidden = state.profiles[state.currentRound]?.traits.filter(t => !t.startVisible).length ?? 0
      if (state.revealStep < hidden) {
        id = setTimeout(() => dispatch({ type: 'ADVANCE_REVEAL' }), 900)
      }
    } else if (state.screen === 'the_one' && state.theOnePhase === 'revealing') {
      const hidden = THE_ONE_PROFILE.traits.filter(t => !t.startVisible).length
      if (state.theOneRevealStep < hidden) {
        id = setTimeout(() => dispatch({ type: 'ADVANCE_REVEAL' }), 900)
      }
    } else if (state.screen === 'tiebreaker' && state.tbPhase === 'revealing') {
      const hidden = state.tbProfile?.traits.filter(t => !t.startVisible).length ?? 0
      if (state.tbRevealStep < hidden) {
        id = setTimeout(() => dispatch({ type: 'TB_ADVANCE_REVEAL' }), 900)
      }
    }
    return () => clearTimeout(id)
  }, [state.screen, state.roundPhase, state.revealStep, state.theOnePhase, state.theOneRevealStep, state.tbPhase, state.tbRevealStep, state.currentRound])

  return (
    <div style={{ fontFamily: WS, height: '100dvh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: C.bg, borderBottom: hairline, height: 48 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
          ← Back
        </button>
        <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 14, letterSpacing: '0.12em' }}>THE CATCH</div>
        <div style={{ width: 48 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {state.screen === 'mode_select'   && <ModeSelectScreen dispatch={dispatch} />}
        {state.screen === 'player_setup'  && <PlayerSetupScreen state={state} dispatch={dispatch} />}
        {state.screen === 'custom_traits' && <CustomTraitsScreen state={state} dispatch={dispatch} />}
        {state.screen === 'round'         && <RoundScreen state={state} dispatch={dispatch} />}
        {state.screen === 'the_one'      && <TheOneScreen state={state} dispatch={dispatch} />}
        {state.screen === 'tiebreaker'   && <TiebreakerScreen state={state} dispatch={dispatch} />}
        {state.screen === 'results'      && <ResultsScreen state={state} dispatch={dispatch} onClose={onClose} />}
      </div>
    </div>
  )
}

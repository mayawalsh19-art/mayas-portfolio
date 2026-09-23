import { useReducer, useState, useEffect, useRef } from 'react'
import { generateProfiles, TRAIT_POOL, PLAYER_TYPES, THE_ONE_PROFILE, PLAYER_AVATARS, ACHIEVEMENTS, profileScore, getPersonality } from '../data/catchProfiles'
import { Doll, DOLL_BG } from './DollCharacters'
import { CatchWordmark } from './CatchBrand'

// ─── Stock photo map (one per doll character) ────────────────────────────────
const DOLL_PHOTO = {
  bibi:  '/catch-photos/bibi.jpg',
  kip:   '/catch-photos/kip.jpg',
  ada:   '/catch-photos/ada.jpg',
  dax:   '/catch-photos/dax.jpg',
  suki:  '/catch-photos/suki.jpg',
  rell:  '/catch-photos/rell.jpg',
  milo:  '/catch-photos/milo.jpg',
  petra: '/catch-photos/petra.jpg',
  cass:  '/catch-photos/cass.jpg',
}
// Catfish always shows an older photo regardless of which doll they have
const DOLL_GENDER = {
  bibi: 'f', ada: 'f', suki: 'f', petra: 'f', cass: 'f',
  rell: 'm', kip: 'm', dax: 'm', milo: 'm',
}
const CATFISH_PHOTO = {
  f: '/catch-photos/catfish-f.jpg',
  m: '/catch-photos/catfish-m.jpg',
}
// Face box per stock photo, in source pixels (all 400×600): top of head → chin, face center x.
// ProfileCard scales each photo so this box fits between the dots and the name overlay.
const PHOTO_FACE = {
  '/catch-photos/ada.jpg':       { top: 55,  bottom: 455, cx: 165 },
  '/catch-photos/bibi.jpg':      { top: 105, bottom: 400, cx: 205 },
  '/catch-photos/cass.jpg':      { top: 95,  bottom: 420, cx: 180 },
  '/catch-photos/catfish-f.jpg': { top: 145, bottom: 405, cx: 198 },
  '/catch-photos/catfish-m.jpg': { top: 140, bottom: 400, cx: 212 },
  '/catch-photos/dax.jpg':       { top: 140, bottom: 400, cx: 180 },
  '/catch-photos/kip.jpg':       { top: 35,  bottom: 460, cx: 200 },
  '/catch-photos/milo.jpg':      { top: 0,   bottom: 505, cx: 205 },
  '/catch-photos/petra.jpg':     { top: 90,  bottom: 425, cx: 200 },
  '/catch-photos/rell.jpg':      { top: 170, bottom: 410, cx: 198 },
  '/catch-photos/suki.jpg':      { top: 140, bottom: 425, cx: 190 },
}
const PHOTO_SRC_W = 400, PHOTO_SRC_H = 600
const FACE_PAD_TOP = 18      // clears the look dots
const FACE_PAD_BOTTOM = 62   // clears the name + archetype overlay

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

function makePlayer(id, name, avatar, playerType = null) {
  return { id, name, avatar, playerType, hearts: 3, stalkTokens: 3, ghosts: 3, looks: 3, loveScore: 0, heartbreakMode: false, ghostsUsed: 0, datesCount: 0, redFlagsCount: 0, foundTheOne: false, therapyTokens: 1, therapyActive: false, therapyBonus: 0, stealTokens: 1, achievements: [], ghostedRedFlags: 0 }
}

function grantAchievement(achievements, id) {
  return achievements.includes(id) ? achievements : [...achievements, id]
}

function profileScoreForPlayer(profile, player) {
  if (!player?.playerType?.adjust) return profileScore(profile)
  return profile.traits.reduce((s, t) => s + player.playerType.adjust(t.value), 0)
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
  const names  = ['River', 'Quinn', 'Sage', 'Avery', 'Blake']
  const name   = names[Math.floor(Math.random() * names.length)]
  const hidden = shuffle(TRAIT_POOL).slice(0, 4)
  return {
    id: 'tb', name, age: 24, emoji: '⚡',
    bio: 'The tiebreaker.',
    traits: [
      { text: 'Seems too good to be true', value: 0, startVisible: true },
      ...hidden.map(t => ({ text: t.text, value: t.value, startVisible: false })),
    ],
    tbScore: hidden.reduce((s, t) => s + t.value, 0),
  }
}

// ─── scoring helpers ──────────────────────────────────────────────────────────
function applyRound(state) {
  const profile      = state.profiles[state.currentRound]
  const isCatfish    = profile.isCatfish === true
  const sharedScore  = profileScore(profile)
  const daters       = state.players.filter(p => state.roundDecisions[p.id]?.action === 'date')
  const doubleDaters = state.players.filter(p => state.roundDecisions[p.id]?.action === 'double_date')
  const isChemistry  = state.mode === 'multi' && sharedScore >= 7 && daters.length === 1
  const isDoubleDateValid = doubleDaters.length >= 2

  // Resolve steal effects first — find the leader, apply deductions
  const stealers = state.players.filter(p => state.roundDecisions[p.id]?.action === 'steal')
  const stealVictimPts = {}
  stealers.forEach(() => {
    const leader = [...state.players].sort((a, b) => b.loveScore - a.loveScore)[0]
    if (leader) stealVictimPts[leader.id] = (stealVictimPts[leader.id] ?? 0) + 3
  })

  const results = {}
  const newPlayers = state.players.map(p => {
    const action = state.roundDecisions[p.id]?.action ?? 'ghost'

    // Steal action
    if (action === 'steal') {
      const leader     = [...state.players].sort((a, b) => b.loveScore - a.loveScore)[0]
      const stolenFrom = leader?.id
      const newAch     = grantAchievement(p.achievements, 'smooth_criminal')
      results[p.id]    = { action: 'steal', pts: 3, heartsLost: 0, isRedFlag: false, stolenFrom }
      return { ...p, loveScore: p.loveScore + 3, stealTokens: p.stealTokens - 1, achievements: newAch }
    }

    // Ghost / therapy_ghost action
    if (action === 'ghost' || action === 'therapy_ghost') {
      const isRedFlagProfile = sharedScore <= -5
      const newGhostedRF = isRedFlagProfile ? (p.ghostedRedFlags ?? 0) + 1 : (p.ghostedRedFlags ?? 0)
      let newAch = p.achievements
      if (isCatfish) newAch = grantAchievement(newAch, 'catfish_dodger')
      if (p.ghostsUsed + 1 >= 3) newAch = grantAchievement(newAch, 'ghost_master')
      const ghostBonus = isCatfish ? 1 : 0
      results[p.id] = { action, pts: ghostBonus, heartsLost: 0, isRedFlag: false, catfishDodged: isCatfish }
      return { ...p, ghostsUsed: p.ghostsUsed + 1, loveScore: p.loveScore + ghostBonus, ghostedRedFlags: newGhostedRF, achievements: newAch }
    }

    // Double date
    if (action === 'double_date') {
      const pScore       = profileScoreForPlayer(profile, p)
      let pts, heartsLost, isRedFlag
      if (isDoubleDateValid) {
        // valid double date — split score
        pts        = Math.floor(pScore / 2)
        heartsLost = pScore < 0 ? Math.floor(1 / 2) : 0
        isRedFlag  = false
      } else {
        // only 1 person chose it — treat as regular date
        const bonusApplies = state.mode === 'single' && pScore >= 7
        ;({ pts, heartsLost, isRedFlag } = calcDate(p, pScore, bonusApplies))
      }
      if (isCatfish) { pts -= 4; isRedFlag = true }
      const stealDeduction = stealVictimPts[p.id] ?? 0
      pts -= stealDeduction
      const newHearts = Math.max(0, p.hearts - heartsLost)
      let newAch = p.achievements
      if (isCatfish) newAch = grantAchievement(newAch, 'got_catfished')
      if (isDoubleDateValid) newAch = grantAchievement(newAch, 'double_dater')
      results[p.id] = { action: 'double_date', pts, heartsLost, isRedFlag, score: pScore, isCatfish, isDoubleDateValid }
      return { ...p, loveScore: p.loveScore + pts, hearts: newHearts, heartbreakMode: p.heartbreakMode || newHearts === 0, datesCount: p.datesCount + 1, redFlagsCount: p.redFlagsCount + (isRedFlag ? 1 : 0), achievements: newAch }
    }

    // Regular date
    const pScore       = profileScoreForPlayer(profile, p)
    const bonusApplies = (state.mode === 'single' && pScore >= 7) || (isChemistry && p.id === daters[0]?.id)
    let { pts, heartsLost, isRedFlag } = calcDate(p, pScore, bonusApplies)
    if (isCatfish) { pts -= 4; isRedFlag = true; heartsLost = Math.max(heartsLost, 1) }
    const stealDeduction = stealVictimPts[p.id] ?? 0
    pts -= stealDeduction
    const newHearts  = Math.max(0, p.hearts - heartsLost)
    let newAch = p.achievements
    if (isCatfish) newAch = grantAchievement(newAch, 'got_catfished')
    if (p.redFlagsCount + (isRedFlag && !isCatfish ? 1 : 0) >= 2) newAch = grantAchievement(newAch, 'chaos_enjoyer')
    results[p.id] = { action: 'date', pts, heartsLost, isRedFlag, score: pScore, isCatfish }
    return { ...p, loveScore: p.loveScore + pts, hearts: newHearts, heartbreakMode: p.heartbreakMode || newHearts === 0, datesCount: p.datesCount + 1, redFlagsCount: p.redFlagsCount + (isRedFlag ? 1 : 0), achievements: newAch }
  })
  return { ...state, players: newPlayers, roundResults: results, roundPhase: 'scored' }
}

function applyTheOne(state) {
  const results = {}
  const newPlayers = state.players.map(p => {
    if (!state.qualifiedIds.includes(p.id)) return p
    const action = state.theOneDecisions[p.id]?.action ?? 'walk_away'
    if (action === 'walk_away') { results[p.id] = { action: 'walk_away', pts: 0, heartsLost: 0, foundTheOne: false }; return p }
    const pScore = profileScoreForPlayer(THE_ONE_PROFILE, p)
    if (pScore >= 7) {
      const newAch = grantAchievement(p.achievements, 'found_the_one')
      results[p.id] = { action: 'take_chance', pts: 10, heartsLost: 0, foundTheOne: true }
      return { ...p, loveScore: p.loveScore + 10, foundTheOne: true, achievements: newAch }
    }
    const newHearts = Math.max(0, p.hearts - 1)
    const newAch = grantAchievement(p.achievements, 'unmatched')
    results[p.id] = { action: 'take_chance', pts: -10, heartsLost: 1, foundTheOne: false }
    return { ...p, loveScore: p.loveScore - 10, hearts: newHearts, heartbreakMode: p.heartbreakMode || newHearts === 0, achievements: newAch }
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
  screen: 'player_setup', mode: 'single', players: [], profiles: [], currentRound: 0,
  roundPhase: 'deciding', decidingPlayerIdx: 0, roundDecisions: {}, revealStep: 0, roundResults: null,
  qualifiedIds: [], theOnePhase: 'deciding', theOneDecidingIdx: 0, theOneDecisions: {}, theOneRevealStep: 0, theOneResults: null,
  winnerId: null, tiedIds: [], tbProfile: null, tbDecisions: {}, tbDecidingIdx: 0, tbPhase: 'deciding', tbRevealStep: 0,
  customTraits: [], pendingPlayers: [],
}

function reducer(state, { type, ...p }) {
  switch (type) {
    case 'SELECT_MODE': return { ...state, mode: p.mode, screen: 'player_setup' }

    case 'GO_TO_CUSTOM_TRAITS': {
      // One person = solo against 2 AI rivals; more = pass-the-phone at the table
      const mode = p.players.length > 1 ? 'multi' : 'single'
      return { ...state, mode, screen: 'custom_traits', pendingPlayers: p.players, customTraits: [] }
    }

    // Write-your-own cards are labelled W1…W6 in the order they're added
    case 'ADD_CUSTOM_TRAIT': {
      const traits = [...state.customTraits, { text: p.text, value: p.value }]
      return { ...state, customTraits: traits.map((t, i) => ({ ...t, card: `W${i + 1}` })) }
    }

    case 'REMOVE_CUSTOM_TRAIT': {
      const traits = state.customTraits.filter((_, i) => i !== p.idx)
      return { ...state, customTraits: traits.map((t, i) => ({ ...t, card: `W${i + 1}` })) }
    }

    case 'START_GAME': {
      const players  = state.pendingPlayers?.length ? state.pendingPlayers : (p.players ?? [])
      const npcs     = state.mode === 'single' ? [makeNPC(0), makeNPC(1)] : []
      const traits   = p.skipCustom ? [] : (state.customTraits ?? [])
      return { ...INIT, mode: state.mode, players: [...players, ...npcs], profiles: generateProfiles(7, traits), screen: 'round', roundPhase: 'deciding' }
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
      if (!isTO && (p.action === 'ghost' || p.action === 'therapy_ghost')) {
        updPlayers = state.players.map(pl => pl.id === cur.id ? { ...pl, ghosts: pl.ghosts - 1 } : pl)
      }
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

      const nextIdx = state[idxKey] + 1

      const allDone = allPool.every(pl => newDec[pl.id]?.action != null)
      if (state.mode === 'single' || allDone) return { ...state, players: updPlayers, [decKey]: newDec, [phaseKey]: 'revealing', revealStep: 0, theOneRevealStep: 0 }
      return { ...state, players: updPlayers, [decKey]: newDec, [phaseKey]: 'pass_device', [idxKey]: nextIdx }
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
        if (!qualified.length) return resolveWinner(state)
        // Only AI rivals made it: they decide on their own, then straight to results
        if (qualified.every(pl => pl.isNPC)) {
          const theOneDecisions = Object.fromEntries(qualified.map(pl => [pl.id, { action: pl.loveScore >= 8 ? 'take_chance' : 'walk_away' }]))
          return resolveWinner(applyTheOne({ ...state, qualifiedIds: qualified.map(pl => pl.id), theOneDecisions }))
        }
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

    case 'USE_LOOK': {
      const pool = state.players.filter(pl => !pl.isNPC)
      const cur  = pool[state.decidingPlayerIdx]
      if (!cur || cur.looks <= 0) return state
      const newPlayers = state.players.map(pl => pl.id === cur.id ? { ...pl, looks: pl.looks - 1 } : pl)
      const newDec = { ...state.roundDecisions, [cur.id]: { ...(state.roundDecisions[cur.id] ?? {}), lookUsed: true } }
      return { ...state, players: newPlayers, roundDecisions: newDec }
    }

    default: return state
  }
}

// ─── shared components ────────────────────────────────────────────────────────
function Hud({ players, currentRound, mode, currentPlayer }) {
  const p = mode === 'single' ? players.find(pl => !pl.isNPC) : currentPlayer
  if (!p) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: C.bg, borderBottom: hairline }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[0,1,2].map(i => <span key={i} style={{ fontSize: 13, color: C.accent, opacity: i < p.hearts ? 1 : 0.18 }}>♥</span>)}
        </div>
        <div style={{ display: 'flex', gap: 6, color: '#555', fontSize: 11, fontFamily: WS }}>
          <span>👁{p.looks ?? 3}</span>
          <span>◌{p.ghosts}</span>
        </div>
        <span style={{ fontFamily: WS, fontWeight: 700, color: p.loveScore >= 0 ? C.teal : C.accent, fontSize: 13 }}>{p.loveScore >= 0 ? '+' : ''}{p.loveScore}</span>
        {p.heartbreakMode && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: C.accent, letterSpacing: '0.1em' }}>½</span>}
      </div>
      <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 12, letterSpacing: '0.12em' }}>
        {String(currentRound + 1).padStart(2, '0')} / 07
      </div>
    </div>
  )
}

function PassDevice({ name, avatar, onReady }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: DVH, padding: '0 24px', textAlign: 'center', background: C.bg }}>
      <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 34, marginBottom: 14, opacity: 0.9 }} />
      <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 26, letterSpacing: '0.08em' }}>PASS THE DEVICE</div>
      <div style={{ fontFamily: WS, fontWeight: 300, color: C.cream, fontSize: 18, marginTop: 16 }}>{avatar} {name}, you're up.</div>
      <div style={{ fontFamily: WS, fontWeight: 300, color: '#777', fontSize: 13, marginTop: 8, marginBottom: 32 }}>Don't let anyone see your choice.</div>
      <button onClick={onReady} style={{ fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, minHeight: 52, minWidth: 200, border: 'none', borderRadius: 4, letterSpacing: '0.12em', cursor: 'pointer' }}>
        I'M READY
      </button>
    </div>
  )
}

// ─── ACHIEVEMENT TOAST ────────────────────────────────────────────────────────
function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2600)
    return () => clearTimeout(id)
  }, [])
  return (
    <div style={{
      position: 'absolute', top: 64, left: 16, right: 16, zIndex: 99,
      background: C.velvet, border: `1px solid ${C.gold}66`,
      padding: '10px 14px', borderRadius: 4,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'catch-pulse 2.6s ease-out forwards',
    }}>
      <span style={{ fontSize: 22 }}>{achievement.emoji}</span>
      <div>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, letterSpacing: '0.2em' }}>ACHIEVEMENT UNLOCKED</div>
        <div style={{ fontFamily: ANTON, fontSize: 14, color: C.cream, letterSpacing: '0.06em' }}>{achievement.title}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#999', marginTop: 1 }}>{achievement.desc}</div>
      </div>
    </div>
  )
}

// ─── PLAYER SETUP ─────────────────────────────────────────────────────────────
// Everyone at the table plays on this one phone. One player = 2 AI rivals join.
const MAX_PLAYERS = 6

function PlayerSetupScreen({ dispatch }) {
  const [slots, setSlots] = useState([{ name: '', avatar: PLAYER_AVATARS[0], playerType: PLAYER_TYPES[0] }])
  const update   = (i, key, val) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl))
  const canStart = slots.every(s => s.name.trim().length > 0)
  const start    = () => dispatch({ type: 'GO_TO_CUSTOM_TRAITS', players: slots.map((sl, i) => makePlayer(`p${i}`, sl.name.trim(), sl.avatar, sl.playerType)) })

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column', padding: '0 24px 28px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: 'auto', width: '100%' }}>
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)', marginBottom: 20, marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
          <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 26, marginBottom: 8, opacity: 0.85 }} />
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(38px,11vw,52px)', lineHeight: 0.88 }}>WHO'S</div>
          <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(38px,11vw,52px)', lineHeight: 0.88 }}>PLAYING?</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#777', marginTop: 10 }}>Grab the trait cards. Everyone plays on this phone — pass it around.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slots.map((sl, i) => (
            <div key={i} style={{ padding: 14, background: C.card, border: hairline, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.accent, letterSpacing: '0.2em' }}>PLAYER {i + 1}</span>
                {i > 0 && (
                  <button onClick={() => setSlots(s => s.filter((_, j) => j !== i))}
                    style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
                    ✕
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {PLAYER_AVATARS.map(av => (
                  <button key={av} onClick={() => update(i, 'avatar', av)}
                    style={{ width: 38, height: 38, fontSize: 18, background: sl.avatar === av ? C.accent : C.cardAlt, border: sl.avatar === av ? `1px solid ${C.accent}` : '1px solid transparent', borderRadius: 4, cursor: 'pointer' }}>
                    {av}
                  </button>
                ))}
              </div>
              <input
                style={{ width: '100%', fontFamily: ANTON, fontSize: 22, letterSpacing: '0.04em', background: C.cardAlt, color: C.cream, border: sl.name ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent, borderRadius: 4 }}
                placeholder="NAME"
                value={sl.name}
                onChange={e => update(i, 'name', e.target.value)}
                maxLength={16}
                autoFocus={i === 0}
              />
              <div style={{ marginTop: 10 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.18em', marginBottom: 6 }}>TYPE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {PLAYER_TYPES.map(pt => {
                    const sel = sl.playerType?.id === pt.id
                    return (
                      <button key={pt.id} onClick={() => update(i, 'playerType', pt)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', background: sel ? `${C.teal}18` : 'transparent', border: `1px solid ${sel ? C.teal : '#333'}`, borderRadius: 4, cursor: 'pointer' }}>
                        <span style={{ fontSize: 14 }}>{pt.emoji}</span>
                        <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: sel ? C.teal : '#666', letterSpacing: '0.1em' }}>{pt.label.replace('THE ', '')}</span>
                      </button>
                    )
                  })}
                </div>
                {sl.playerType && (
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#777', marginTop: 6 }}>{sl.playerType.desc}</div>
                )}
              </div>
            </div>
          ))}

          {slots.length < MAX_PLAYERS && (
            <button onClick={() => setSlots(s => [...s, { name: '', avatar: PLAYER_AVATARS[s.length % PLAYER_AVATARS.length], playerType: PLAYER_TYPES[0] }])}
              style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, padding: '12px 0', border: `1px dashed ${C.slate}`, color: '#777', background: 'transparent', cursor: 'pointer', borderRadius: 6 }}>
              + Add player
            </button>
          )}

          {slots.length === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.card, border: hairline, borderRadius: 6 }}>
              <span style={{ fontSize: 16 }}>🌙🔥</span>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold, letterSpacing: '0.15em' }}>PLAYING ALONE? 2 AI RIVALS JOIN YOU</div>
            </div>
          )}
        </div>

        <button onClick={start} disabled={!canStart}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: canStart ? C.accent : C.slate, color: canStart ? '#fff' : '#555', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: canStart ? 'pointer' : 'not-allowed', marginTop: 18, boxShadow: canStart ? '0 0 20px rgba(255,77,109,0.35)' : 'none' }}>
          NEXT →
        </button>
      </div>
    </div>
  )
}

// ─── WRITE-YOUR-OWN CARDS ─────────────────────────────────────────────────────
// The printed deck has 3 blank green (+2) and 3 blank red (−2) cards. Each one
// entered here gets a label (W1…W6) that players write on the physical card.
const BLANK_GREEN = 3
const BLANK_RED   = 3

function CustomTraitsScreen({ state, dispatch }) {
  const [text, setText] = useState('')
  const [isGreen, setIsGreen] = useState(true)
  const greens = state.customTraits.filter(t => t.value > 0).length
  const reds   = state.customTraits.filter(t => t.value < 0).length
  const greenLeft = BLANK_GREEN - greens
  const redLeft   = BLANK_RED - reds
  const canAdd = text.trim() && (isGreen ? greenLeft > 0 : redLeft > 0)

  const addTrait = () => {
    if (!canAdd) return
    dispatch({ type: 'ADD_CUSTOM_TRAIT', text: text.trim(), value: isGreen ? 2 : -2 })
    setText('')
  }

  const hasTraits = state.customTraits.length > 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column', padding: '0 24px 28px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: 'auto', width: '100%' }}>
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)', marginBottom: 20, marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(32px,9vw,46px)', lineHeight: 0.88 }}>WRITE</div>
          <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(32px,9vw,46px)', lineHeight: 0.88 }}>YOUR OWN.</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#777', marginTop: 10, lineHeight: 1.5 }}>
            Optional. Write real behaviors you've seen on the blank cards, then add them here so the app can deal them.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <input
            style={{ width: '100%', fontFamily: WS, fontWeight: 400, background: C.card, color: C.cream, fontSize: 14, border: text ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent, borderRadius: 4 }}
            placeholder="Leaves you on read for 3 days then acts normal…"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={80}
            onKeyDown={e => { if (e.key === 'Enter') addTrait() }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setIsGreen(true)}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', padding: '10px 0', background: isGreen ? `${C.teal}22` : 'transparent', border: `1px solid ${isGreen ? C.teal : '#333'}`, color: isGreen ? C.teal : '#555', borderRadius: 4, cursor: 'pointer' }}>
              🟢 GREEN +2 · {greenLeft} LEFT
            </button>
            <button onClick={() => setIsGreen(false)}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', padding: '10px 0', background: !isGreen ? `${C.accent}22` : 'transparent', border: `1px solid ${!isGreen ? C.accent : '#333'}`, color: !isGreen ? C.accent : '#555', borderRadius: 4, cursor: 'pointer' }}>
              🚩 RED −2 · {redLeft} LEFT
            </button>
          </div>
          <button onClick={addTrait} disabled={!canAdd}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', padding: '12px 0', background: canAdd ? C.cardAlt : 'transparent', border: canAdd ? hairline : `1px dashed ${C.slate}`, color: canAdd ? C.cream : '#444', borderRadius: 4, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
            + ADD CARD
          </button>
        </div>

        {hasTraits && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em', marginBottom: 8 }}>WRITE THE LABEL ON EACH CARD</div>
            {state.customTraits.map((t, i) => {
              const col = t.value > 0 ? C.teal : C.accent
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: C.card, border: `1px solid ${col}33`, borderRadius: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: ANTON, fontSize: 14, color: col, minWidth: 26 }}>{t.card}</span>
                  <span style={{ fontFamily: WS, fontSize: 13, color: C.cream, flex: 1 }}>{t.text}</span>
                  <button onClick={() => dispatch({ type: 'REMOVE_CUSTOM_TRAIT', idx: i })}
                    style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button onClick={() => dispatch({ type: 'START_GAME' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
            {hasTraits ? 'START WITH MY CARDS →' : 'START THE GAME →'}
          </button>
          {hasTraits && (
            <button onClick={() => dispatch({ type: 'START_GAME', skipCustom: true })}
              style={{ width: '100%', fontFamily: WS, fontWeight: 500, background: 'transparent', border: `1px solid rgba(255,255,255,0.1)`, color: '#888', fontSize: 13, letterSpacing: '0.1em', minHeight: 44, borderRadius: 6, cursor: 'pointer' }}>
              SKIP — PLAY WITHOUT THEM
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Card-number chip used wherever a trait is tied to its physical card
function CardNo({ no, color = '#888' }) {
  return (
    <span style={{ fontFamily: ANTON, fontSize: 11, letterSpacing: '0.06em', color, border: `1px solid ${color}55`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>
      {typeof no === 'number' ? `#${String(no).padStart(2, '0')}` : no}
    </span>
  )
}

// ─── PROFILE CARD (photo + tags, no traits) ───────────────────────────────────
function ProfileCard({ profile, goldTheme, lookUnlocked = false }) {
  const photo    = profile.isCatfish && profile.doll
    ? (CATFISH_PHOTO[DOLL_GENDER[profile.doll]] ?? DOLL_PHOTO[profile.doll])
    : (profile.doll ? DOLL_PHOTO[profile.doll] : (profile.photo ?? null))
  const hasPhoto = !!photo
  const face     = PHOTO_FACE[photo]
  const faceH    = face ? face.bottom - face.top : 0
  const maxLook  = (lookUnlocked && hasPhoto) ? 1 : 0
  const [lookIdx, setLookIdx] = useState(0)
  const touchStartX = useRef(null)

  // Rule: the illustration is always shown first. The B&W photo only appears
  // once that player has spent a LOOK token on this profile.
  useEffect(() => {
    setLookIdx(lookUnlocked && hasPhoto ? 1 : 0)
  }, [lookUnlocked, hasPhoto, profile.id])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 20) setLookIdx(i => dx < 0 ? Math.min(i + 1, maxLook) : Math.max(i - 1, 0))
    touchStartX.current = null
  }

  const gradOverlay = goldTheme
    ? 'linear-gradient(to top,rgba(8,6,0,0.97),transparent)'
    : 'linear-gradient(to top,rgba(0,0,0,0.96),transparent)'

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ position: 'relative', width: '100%', height: 'clamp(200px, 28dvh, 260px)', overflow: 'hidden', background: profile.doll ? DOLL_BG[profile.doll] : (goldTheme ? '#12100a' : '#111'), userSelect: 'none' }}
      >
        {/* Look 0: doll / emoji — always mounted, fades in/out */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', opacity: lookIdx === 0 ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
          {profile.doll
            ? <div style={{ transform: 'scale(1.5)', transformOrigin: 'top center', marginTop: -10 }}><Doll name={profile.doll} /></div>
            : <span style={{ fontSize: 72, lineHeight: 1, display: 'flex', alignItems: 'center', height: '100%' }}>{profile.emoji}</span>
          }
        </div>

        {/* Look 1: B&W photo — always mounted when photo exists, fades in/out */}
        {hasPhoto && face && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000', opacity: lookIdx === 1 ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
            {/* Blurred fill behind the sides once the photo is scaled down to fit the whole face */}
            <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) blur(14px) brightness(0.45)', transform: 'scale(1.15)', display: 'block' }} />
            <img src={photo} alt="" style={{
              position: 'absolute', display: 'block', width: 'auto', maxWidth: 'none',
              height: `calc((100% - ${FACE_PAD_TOP + FACE_PAD_BOTTOM}px) * ${PHOTO_SRC_H / faceH})`,
              top: `calc(${FACE_PAD_TOP}px - (100% - ${FACE_PAD_TOP + FACE_PAD_BOTTOM}px) * ${face.top / faceH})`,
              left: '50%', transform: `translateX(-${(face.cx / PHOTO_SRC_W) * 100}%)`,
              filter: 'grayscale(1) contrast(1.1) brightness(0.9)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
            }} />
          </div>
        )}
        {hasPhoto && !face && (
          <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', filter: 'grayscale(1) contrast(1.1) brightness(0.9)', display: 'block', opacity: lookIdx === 1 ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }} />
        )}

        {/* Left tap zone — go back one look */}
        {lookUnlocked && hasPhoto && (
          <div onClick={() => setLookIdx(i => Math.max(i - 1, 0))}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', zIndex: 4, cursor: lookIdx > 0 ? 'pointer' : 'default' }} />
        )}
        {/* Right tap zone — go forward one look */}
        {lookUnlocked && hasPhoto && (
          <div onClick={() => setLookIdx(i => Math.min(i + 1, maxLook))}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', zIndex: 4, cursor: lookIdx < maxLook ? 'pointer' : 'default' }} />
        )}

        {/* Dot indicators at top */}
        {lookUnlocked && hasPhoto && (
          <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5, zIndex: 5, pointerEvents: 'none' }}>
            {[0,1].map(i => (
              <div key={i} style={{ width: i === lookIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === lookIdx ? '#fff' : 'rgba(255,255,255,0.35)', transition: 'width 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
            ))}
          </div>
        )}

        {/* B&W label */}
        {lookUnlocked && hasPhoto && lookIdx === 1 && (
          <div style={{ position: 'absolute', top: 8, right: 10, zIndex: 6, fontFamily: WS, fontWeight: 700, fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', background: 'rgba(0,0,0,0.45)', padding: '2px 7px', borderRadius: 2 }}>
            B&W
          </div>
        )}

        {/* Name gradient overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '52px 14px 12px', background: gradOverlay, zIndex: 3, pointerEvents: 'none' }}>
          <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 28, lineHeight: 1 }}>{profile.name.toUpperCase()}, {profile.age}</div>
          {profile.archetype && <div style={{ fontFamily: WS, fontWeight: 700, color: C.gold, fontSize: 11, letterSpacing: '0.22em', marginTop: 4 }}>{profile.archetype.toUpperCase()}</div>}
        </div>
      </div>
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
              {pl.isNPC || mode === 'multi' ? pl.name.toUpperCase() : 'YOU'} {dated ? '♥' : '◌'}
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

  const traitInReveal = i => {
    if (profile.traits[i].startVisible) return true
    const hidden = profile.traits.map((t, idx) => ({ t, idx })).filter(({ t }) => !t.startVisible)
    const pos = hidden.findIndex(({ idx }) => idx === i)
    return pos !== -1 && pos < state.revealStep
  }

  const [showScorePopup, setShowScorePopup] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [toastAch, setToastAch] = useState(null)
  const prevAchRef = useRef([])

  useEffect(() => {
    if (state.roundPhase === 'scored') {
      setShowScorePopup(true)
      setShowLeaderboard(false)
      const id1 = setTimeout(() => { setShowScorePopup(false); setShowLeaderboard(true) }, 1800)
      const id2 = setTimeout(() => setShowLeaderboard(false), 1800 + 7000)
      // Check for new achievements on the real player
      const realPlayer = state.players.find(pl => !pl.isNPC)
      if (realPlayer) {
        const prev = prevAchRef.current
        const newOnes = realPlayer.achievements.filter(id => !prev.includes(id))
        if (newOnes.length > 0) {
          const achDef = ACHIEVEMENTS.find(a => a.id === newOnes[0])
          if (achDef) setToastAch(achDef)
        }
        prevAchRef.current = realPlayer.achievements
      }
      return () => { clearTimeout(id1); clearTimeout(id2) }
    }
  }, [state.roundPhase, state.currentRound])


  if (state.roundPhase === 'pass_device') {
    const humanPlayers = state.players.filter(pl => !pl.isNPC)
    const next = humanPlayers[state.decidingPlayerIdx]
    return <PassDevice name={next?.name} avatar={next?.avatar} onReady={() => dispatch({ type: 'CONTINUE_NEXT' })} />
  }

  if (state.roundPhase === 'scored') {
    const results    = state.roundResults
    const score      = profileScore(profile)
    const isCatfish  = profile.isCatfish === true
    const anyRedFlag = !isCatfish && state.players.some(pl => results[pl.id]?.isRedFlag)
    const realPlayer = state.players.find(pl => !pl.isNPC)
    const myResult   = results[realPlayer?.id]
    const sorted     = [...state.players].sort((a, b) => b.loveScore - a.loveScore)

    if (showScorePopup && myResult && state.mode === 'single') {
      const pts     = myResult.pts
      const isGhost = myResult.action === 'ghost' || myResult.action === 'therapy_ghost'
      const isDodge = myResult.catfishDodged
      const ptColor = isDodge ? C.teal : pts > 0 ? C.teal : pts < 0 ? C.accent : C.slate
      const ptGlow  = pts > 0 || isDodge
        ? `0 0 32px rgba(124,224,168,0.7), 0 0 72px rgba(124,224,168,0.35)`
        : pts < 0
        ? `0 0 32px rgba(255,77,109,0.7), 0 0 72px rgba(255,77,109,0.35)`
        : 'none'
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0e0b12', gap: 4, userSelect: 'none', position: 'relative' }}>
          {toastAch && <AchievementToast achievement={toastAch} onDone={() => setToastAch(null)} />}
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.22em', color: '#444' }}>
            {isDodge ? '🎣 DODGED' : isGhost ? '◌' : myResult.action === 'steal' ? '⚡' : myResult.action === 'double_date' ? '♥♥' : '♥'}
          </div>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(100px,26vw,148px)', color: ptColor, lineHeight: 1, textShadow: ptGlow }}>
            {pts > 0 ? `+${pts}` : pts === 0 ? '±0' : pts}
          </div>
          {isCatfish && myResult.action !== 'ghost' && myResult.action !== 'therapy_ghost' && (
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.accent, letterSpacing: '0.12em' }}>🪝 −4</div>
          )}
        </div>
      )
    }

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
        {toastAch && <AchievementToast achievement={toastAch} onDone={() => setToastAch(null)} />}

        {/* Leaderboard overlay — centered, auto-dismisses after 7s */}
        {showLeaderboard && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'catch-fade-in 0.3s ease',
          padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) setShowLeaderboard(false) }}>
          <div style={{
            background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 12,
            padding: '20px 20px 24px', maxWidth: 400, width: '100%',
            animation: 'catch-fade-in 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em' }}>LEADERBOARD</div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#444', letterSpacing: '0.12em' }}>MATCH {state.currentRound + 1} / 07</div>
            </div>
            {sorted.map((pl, rank) => {
              const r = results[pl.id]
              const isMe = !pl.isNPC
              return (
                <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: isMe ? `${C.accent}12` : 'transparent', border: isMe ? `1px solid ${C.accent}30` : hairline, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: ANTON, fontSize: 12, color: '#444', minWidth: 16 }}>#{rank + 1}</span>
                    <span style={{ fontSize: 16 }}>{pl.avatar}</span>
                    <div style={{ fontFamily: WS, fontWeight: isMe ? 700 : 400, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe && state.mode === 'single' ? 'YOU' : pl.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {r && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: r.action === 'date' || r.action === 'double_date' ? C.accent : r.action === 'steal' ? C.gold : '#555', letterSpacing: '0.08em' }}>
                      {r.action === 'date' || r.action === 'double_date' ? '♥' : r.action === 'steal' ? '⚡' : '◌'}
                    </span>}
                    <span style={{ fontFamily: ANTON, fontSize: 20, color: pl.loveScore >= 0 ? C.teal : C.accent }}>{pl.loveScore >= 0 ? '+' : ''}{pl.loveScore}</span>
                  </div>
                </div>
              )
            })}
            <button onClick={() => dispatch({ type: 'NEXT_ROUND' })}
              style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12, boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
              {state.currentRound >= 6 ? 'SEE FINAL RESULTS →' : 'NEXT MATCH →'}
            </button>
          </div>
        </div>
        )}

        {/* Profile photo — fixed at top, outside scroll */}
        {myResult && (myResult.action === 'date' || myResult.action === 'double_date') && (
          <div style={{ flexShrink: 0 }}>
            <ProfileCard profile={profile} goldTheme={false} lookUnlocked={state.mode === 'single' && (state.roundDecisions[realPlayer?.id]?.lookUsed ?? false)} />
          </div>
        )}

        {isCatfish && (
          <div style={{ flexShrink: 0, padding: '10px 20px', textAlign: 'center', background: '#0d1a10', borderBottom: `1px solid ${C.teal}44` }}>
            <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 18, letterSpacing: '0.1em' }}>🎣 CATFISH</div>
          </div>
        )}
        {!isCatfish && anyRedFlag && (
          <div style={{ flexShrink: 0, padding: '10px 20px', textAlign: 'center', background: '#1a0008', borderBottom: `1px solid ${C.accent}44` }}>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 18, letterSpacing: '0.1em' }}>🚩 RED FLAG</div>
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 400, margin: '0 auto', padding: '16px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: ANTON, fontSize: 48, color: score >= 7 ? C.teal : score <= -5 ? C.accent : score > 0 ? C.cream : '#555', lineHeight: 1 }}>
                {score > 0 ? `+${score}` : score}
              </div>
            </div>

            {/* All traits revealed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {profile.traits.map((t, i) => {
                const isPos = t.value > 0
                const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: isPos ? 'rgba(124,224,168,0.07)' : 'rgba(255,77,109,0.07)', border: `1px solid ${isPos ? 'rgba(124,224,168,0.2)' : 'rgba(255,77,109,0.2)'}`, borderRadius: 6 }}>
                    <CardNo no={t.card} color={isPos ? C.teal : C.accent} />
                    <div style={{ flex: 1, fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.cream, lineHeight: 1.35 }}>{t.text}</div>
                    <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)', fontFamily: ANTON, fontSize: 14, color: isPos ? C.teal : C.accent }}>{scoreStr}</div>
                  </div>
                )
              })}
            </div>

            {/* Each human's result */}
            {state.players.filter(pl => !pl.isNPC).map(pl => { const myResult = results[pl.id]; const realPlayer = pl; return myResult && (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: myResult.pts > 0 ? `${C.teal}12` : myResult.pts < 0 ? `${C.accent}12` : C.card, border: `1px solid ${myResult.pts > 0 ? 'rgba(124,224,168,0.2)' : myResult.pts < 0 ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream }}>
                  {realPlayer?.avatar} {state.mode === 'single' ? 'YOU' : realPlayer?.name}
                  <span style={{ fontWeight: 400, color: '#555' }}> — {
                    myResult.action === 'ghost' || myResult.action === 'therapy_ghost' ? '◌'
                    : myResult.action === 'steal' ? '⚡'
                    : myResult.action === 'double_date' ? '♥♥'
                    : '♥'
                  }{myResult.isRedFlag && !myResult.isCatfish ? ' 🚩' : ''}{myResult.isCatfish && myResult.action !== 'ghost' && myResult.action !== 'therapy_ghost' ? ' 🪝' : ''}</span>
                </div>
                <div style={{ fontFamily: ANTON, fontSize: 24, color: myResult.pts > 0 ? C.teal : myResult.pts < 0 ? C.accent : '#555' }}>
                  {myResult.pts > 0 ? `+${myResult.pts}` : myResult.pts === 0 ? '±0' : myResult.pts}
                </div>
              </div>
            )})}

          </div>
        </div>

        {/* NEXT button — always pinned at bottom */}
        <div style={{ flexShrink: 0, padding: '8px 24px 14px', background: '#0e0b12', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => dispatch({ type: 'NEXT_ROUND' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
            {state.currentRound >= 6 ? 'SEE FINAL RESULTS →' : 'NEXT MATCH →'}
          </button>
        </div>
      </div>
    )
  }

  if (state.roundPhase === 'revealing') {
    const hidden   = profile.traits.filter(t => !t.startVisible).length
    const allShown = state.revealStep >= hidden
    const revealedCount = profile.traits.filter((t, i) => t.startVisible || traitInReveal(i)).length
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
        <Hud players={state.players} currentRound={state.currentRound} mode={state.mode} currentPlayer={curPlayer} />

        {/* Profile hero strip */}
        <div style={{ flexShrink: 0, padding: '18px 24px 14px', borderBottom: `1px solid rgba(255,255,255,0.06)`, background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
          <RivalBar players={state.players} decisions={state.roundDecisions} mode={state.mode} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: 38, lineHeight: 1 }}>{profile.emoji}</span>
            <div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.22em', marginBottom: 4 }}>FLIP THE CARDS WITH THE APP</div>
              <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 30, lineHeight: 1, letterSpacing: '0.02em' }}>
                {profile.name.toUpperCase()}<span style={{ color: '#555', fontFamily: WS, fontWeight: 300, fontSize: 18 }}>, {profile.age}</span>
              </div>
              {profile.archetype && (
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold, letterSpacing: '0.2em', marginTop: 3 }}>{profile.archetype.toUpperCase()}</div>
              )}
            </div>
          </div>
        </div>

        {/* Trait cards — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {profile.traits.map((t, i) => {
              const show = t.startVisible || traitInReveal(i)
              const isPos = t.value > 0
              const accentCol = !show ? 'transparent' : isPos ? C.teal : C.accent
              const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px',
                  background: !show ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : 'rgba(255,77,109,0.07)',
                  border: `1px solid ${!show ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : 'rgba(255,77,109,0.2)'}`,
                  borderRadius: 6,
                  transition: 'all 0.2s ease',
                }}>
                  <CardNo no={t.card} color={!show ? '#555' : isPos ? C.teal : C.accent} />
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#555', lineHeight: 1.35 }}>
                    {show ? t.text : 'Flip it…'}
                  </div>
                  <div style={{
                    flexShrink: 0, minWidth: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)',
                    fontFamily: ANTON, fontSize: 14, color: accentCol,
                  }}>
                    {show ? scoreStr : '?'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress + action button */}
        <div style={{ flexShrink: 0, padding: '10px 20px 16px', background: '#0e0b12', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          {/* progress dots */}
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
            {profile.traits.map((_, i) => {
              const filled = profile.traits[i].startVisible || traitInReveal(i)
              return <div key={i} style={{ width: filled ? 16 : 6, height: 4, borderRadius: 2, background: filled ? C.accent : 'rgba(255,255,255,0.12)', transition: 'width 0.25s ease, background 0.25s ease' }} />
            })}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })}
                style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', color: '#555', fontSize: 13, letterSpacing: '0.15em', border: `1px solid rgba(255,255,255,0.1)`, minHeight: 46, borderRadius: 6, cursor: 'pointer' }}>
                FLIP NEXT CARD ▼
              </button>
            : <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })}
                style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', border: 'none', minHeight: 52, borderRadius: 6, cursor: 'pointer', boxShadow: `0 0 20px rgba(255,77,109,0.35)` }}>
                SEE SCORES →
              </button>
          }
        </div>
      </div>
    )
  }

  // deciding phase — the app deals, the table holds the cards
  const canGhost  = (curPlayer?.ghosts ?? 0) > 0
  const profilePhoto = profile.isCatfish && profile.doll
    ? (CATFISH_PHOTO[DOLL_GENDER[profile.doll]] ?? DOLL_PHOTO[profile.doll])
    : (profile.doll ? DOLL_PHOTO[profile.doll] : (profile.photo ?? null))
  const canLook   = (curPlayer?.looks ?? 0) > 0 && !!profilePhoto && !(dec.lookUsed ?? false)
  const faceUp    = profile.traits.filter(t => t.startVisible)
  const faceDown  = profile.traits.filter(t => !t.startVisible)
  const alreadyDealt = state.mode === 'multi' && state.decidingPlayerIdx > 0

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
      <Hud players={state.players} currentRound={state.currentRound} mode={state.mode} currentPlayer={curPlayer} />
      {state.mode === 'multi' && (
        <div style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '6px 16px', textAlign: 'center', background: C.card, color: C.accent, borderBottom: hairline }}>
          {curPlayer?.avatar} {curPlayer?.name?.toUpperCase()}'S TURN
        </div>
      )}

      {/* Profile card — fixed height, no grow */}
      <div style={{ flex: '0 0 auto' }}>
        <ProfileCard profile={profile} goldTheme={false} lookUnlocked={dec.lookUsed ?? false} />
      </div>

      {/* Deal: which physical trait cards go on the table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 6px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: 'auto 0', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: C.accent }}>{alreadyDealt ? 'ON THE TABLE' : 'DEAL THESE CARDS'}</span>
            <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#666' }}>{alreadyDealt ? 'already dealt' : 'face-up first'}</span>
          </div>

          {/* Face-up: the visible traits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {faceUp.map(t => {
              const col = t.value > 0 ? C.teal : t.value < 0 ? C.accent : C.gold
              return (
                <div key={t.card} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: `${col}12`, border: `1px solid ${col}33`, borderRadius: 6 }}>
                  <CardNo no={t.card} color={col} />
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.cream, lineHeight: 1.3 }}>{t.text}</div>
                  <div style={{ fontFamily: ANTON, fontSize: 15, color: col }}>{t.value > 0 ? `+${t.value}` : t.value}</div>
                </div>
              )
            })}
          </div>

          {/* Face-down: numbers only — the cards stay hidden until the flip */}
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, letterSpacing: '0.18em', color: '#666', marginBottom: 6 }}>FACE-DOWN</div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${faceDown.length}, 1fr)`, gap: 6 }}>
            {faceDown.map(t => (
              <div key={t.card} style={{ aspectRatio: '5 / 7', maxHeight: 92, background: C.bg, border: `1px solid ${C.accent}44`, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundImage: 'radial-gradient(circle, rgba(239,230,220,0.07) 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
                <span style={{ fontFamily: ANTON, fontSize: 20, color: C.cream, letterSpacing: '0.04em' }}>{typeof t.card === 'number' ? `#${String(t.card).padStart(2, '0')}` : t.card}</span>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: C.gold, marginTop: 10, textAlign: 'center' }}>
            🔍 Stalk with your chips — secretly peek at one face-down card.
          </div>
        </div>
      </div>

      {/* Action buttons — always pinned at bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 24px 12px', background: '#0e0b12' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => dispatch({ type: 'DECIDE', action: 'date' })}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
            ♥ DATE
          </button>
          <button onClick={() => dispatch({ type: 'DECIDE', action: 'ghost' })} disabled={!canGhost}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: 'transparent', border: `1px solid ${canGhost ? 'rgba(255,255,255,0.1)' : C.slate}`, color: canGhost ? '#888' : '#444', fontSize: 13, letterSpacing: '0.1em', height: 46, borderRadius: 6, cursor: canGhost ? 'pointer' : 'not-allowed' }}>
            ◌ GHOST {curPlayer?.ghosts ?? 0}
          </button>
        </div>
        <button onClick={() => dispatch({ type: 'USE_LOOK' })} disabled={!canLook}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', height: 38, background: canLook ? `${C.teal}10` : 'transparent', border: `1px dashed ${canLook ? C.teal : C.slate}`, color: canLook ? C.teal : '#3a3535', borderRadius: 6, cursor: canLook ? 'pointer' : 'not-allowed' }}>
          👁 LOOK {dec.lookUsed ? '· PHOTO SHOWN' : `· ${curPlayer?.looks ?? 0} LEFT`}
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
      <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: 400, margin: 'auto', width: '100%', padding: '28px 24px', textAlign: 'center' }}>
          <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 32, marginBottom: 8 }} />
          <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 16, letterSpacing: '0.2em' }}>THE ONE</div>
          <div style={{ fontFamily: ANTON, fontSize: 52, color: score >= 7 ? C.teal : C.accent, lineHeight: 1 }}>
            {score > 0 ? `+${score}` : score}
          </div>
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em', marginBottom: 20 }}>COMPATIBILITY SCORE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', marginBottom: 20 }}>
            {profile.traits.map((t, i) => {
              const isPos = t.value > 0
              const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: isPos ? 'rgba(124,224,168,0.07)' : 'rgba(255,77,109,0.07)', border: `1px solid ${isPos ? 'rgba(124,224,168,0.2)' : 'rgba(255,77,109,0.2)'}`, borderRadius: 6 }}>
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.cream, lineHeight: 1.35 }}>{t.text}</div>
                  <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)', fontFamily: ANTON, fontSize: 14, color: isPos ? C.teal : C.accent }}>{scoreStr}</div>
                </div>
              )
            })}
          </div>
          {qualPlayers.map(pl => {
            const r = results[pl.id]
            if (!r) return null
            const isMe = !pl.isNPC
            const label = isMe && state.mode === 'single' ? 'YOU' : pl.name
            return (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isMe ? `${C.accent}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${isMe ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 6, marginBottom: 6, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{pl.avatar}</span>
                  <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: isMe ? C.cream : '#888' }}>{label}</span>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: r.foundTheOne ? C.teal : r.action === 'walk_away' ? '#555' : C.accent, letterSpacing: '0.08em' }}>
                  {r.foundTheOne ? '♛ +10' : r.action === 'walk_away' ? 'WALKED' : '♥̸ −10'}
                </div>
              </div>
            )
          })}
          <button onClick={() => dispatch({ type: 'FINISH_THE_ONE' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 10, boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
        {/* Hero strip */}
        <div style={{ flexShrink: 0, padding: '18px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
          <RivalBar players={qualPlayers} decisions={state.theOneDecisions} mode={state.mode} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: 38 }}>{profile.emoji}</span>
            <div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, letterSpacing: '0.22em', marginBottom: 4 }}>THE ONE</div>
              <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 30, lineHeight: 1 }}>
                {profile.name.toUpperCase()}<span style={{ color: '#555', fontFamily: WS, fontWeight: 300, fontSize: 18 }}>, {profile.age}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Trait cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {profile.traits.map((t, i) => {
              const show = t.startVisible || traitInReveal(i)
              const isPos = t.value > 0
              const accentCol = !show ? 'transparent' : isPos ? C.teal : C.accent
              const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: !show ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : 'rgba(255,77,109,0.07)', border: `1px solid ${!show ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : 'rgba(255,77,109,0.2)'}`, borderRadius: 6, transition: 'all 0.2s ease' }}>
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#3a3535', lineHeight: 1.35 }}>{show ? t.text : '?????'}</div>
                  <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)', fontFamily: ANTON, fontSize: 14, color: accentCol }}>{show ? scoreStr : '?'}</div>
                </div>
              )
            })}
          </div>
        </div>
        {/* Progress + button */}
        <div style={{ flexShrink: 0, padding: '10px 20px 16px', background: '#0e0b12', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
            {profile.traits.map((_, i) => {
              const filled = profile.traits[i].startVisible || traitInReveal(i)
              return <div key={i} style={{ width: filled ? 16 : 6, height: 4, borderRadius: 2, background: filled ? C.gold : 'rgba(255,255,255,0.12)', transition: 'width 0.25s ease' }} />
            })}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', color: '#555', fontSize: 13, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.1)', minHeight: 46, borderRadius: 6, cursor: 'pointer' }}>TAP TO REVEAL ▼</button>
            : <button onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 15, letterSpacing: '0.12em', border: 'none', minHeight: 52, borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(228,196,106,0.3)' }}>SEE THE RESULT →</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{ flex: '0 0 auto', padding: '10px 24px 8px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
        <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 16, letterSpacing: '0.2em' }}>THE ONE</div>
        <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#999', margin: '2px 0 0' }}>No cards for this one — it all plays out on screen.</p>
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

      {/* Traits — scrollable rounded cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 6px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {profile.traits.map((t, i) => {
            const show = traitVisible(i)
            const isPos = t.value > 0
            const isNeg = t.value < 0
            const accentCol = !show ? 'transparent' : isPos ? C.teal : isNeg ? C.accent : C.gold
            const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
            const stalked = (dec.stalkedIdxs ?? []).includes(i) && !t.startVisible
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.07)' : isNeg ? 'rgba(255,77,109,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${!show ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : isNeg ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 6, transition: 'all 0.2s ease',
              }}>
                <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#3a3535', lineHeight: 1.35 }}>
                  {show ? t.text : '?????'}
                  {stalked && <span style={{ marginLeft: 5, fontSize: 9, color: C.gold }}>🔎</span>}
                </div>
                <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : isNeg ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.08)', fontFamily: ANTON, fontSize: 14, color: !show ? '#3a3535' : accentCol }}>
                  {show ? scoreStr : '?'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Buttons — pinned bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 24px 14px', background: '#0e0b12' }}>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'take_chance' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(228,196,106,0.3)' }}>
          ♛ TAKE A CHANCE
        </button>
        <button onClick={() => dispatch({ type: 'DECIDE', action: 'walk_away' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', fontSize: 14, letterSpacing: '0.12em', height: 46, borderRadius: 6, cursor: 'pointer' }}>
          ◌ WALK AWAY
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
        {/* Hero strip */}
        <div style={{ flexShrink: 0, padding: '18px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
          <RivalBar players={tied} decisions={state.tbDecisions} mode={state.mode} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: 38 }}>{profile.emoji}</span>
            <div>
              <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, letterSpacing: '0.22em', marginBottom: 4 }}>⚡ SPEED DATING</div>
              <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 30, lineHeight: 1 }}>
                {profile.name.toUpperCase()}<span style={{ color: '#555', fontFamily: WS, fontWeight: 300, fontSize: 18 }}>, {profile.age}</span>
              </div>
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', marginTop: 3 }}>Tiebreaker. Whoever made the better call wins.</div>
            </div>
          </div>
        </div>
        {/* Trait cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {profile.traits.map((t, i) => {
              const show = t.startVisible || traitInReveal(i)
              const isPos = t.value > 0
              const accentCol = !show ? 'transparent' : isPos ? C.teal : C.accent
              const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: !show ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : 'rgba(255,77,109,0.07)', border: `1px solid ${!show ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : 'rgba(255,77,109,0.2)'}`, borderRadius: 6, transition: 'all 0.2s ease' }}>
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#3a3535', lineHeight: 1.35 }}>{show ? t.text : '?????'}</div>
                  <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)', fontFamily: ANTON, fontSize: 14, color: accentCol }}>{show ? scoreStr : '?'}</div>
                </div>
              )
            })}
          </div>
        </div>
        {/* Progress + button */}
        <div style={{ flexShrink: 0, padding: '10px 20px 16px', background: '#0e0b12', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
            {profile.traits.map((_, i) => {
              const filled = profile.traits[i].startVisible || traitInReveal(i)
              return <div key={i} style={{ width: filled ? 16 : 6, height: 4, borderRadius: 2, background: filled ? C.gold : 'rgba(255,255,255,0.12)', transition: 'width 0.25s ease' }} />
            })}
          </div>
          {!allShown
            ? <button onClick={() => dispatch({ type: 'TB_ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', color: '#555', fontSize: 13, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.1)', minHeight: 46, borderRadius: 6, cursor: 'pointer' }}>TAP TO REVEAL ▼</button>
            : <button onClick={() => dispatch({ type: 'TB_ADVANCE_REVEAL' })} style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.gold, color: '#131011', fontSize: 15, letterSpacing: '0.12em', border: 'none', minHeight: 52, borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(228,196,106,0.3)' }}>♛ CROWN THE CATCH →</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flex: '0 0 auto', padding: '10px 24px 8px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
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

      {/* Traits — scrollable rounded cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 6px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {profile.traits.map((t, i) => {
            const show = t.startVisible
            const isPos = t.value > 0
            const isNeg = t.value < 0
            const accentCol = !show ? 'transparent' : isPos ? C.teal : isNeg ? C.accent : C.gold
            const scoreStr = t.value > 0 ? `+${t.value}` : `${t.value}`
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                background: !show ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : isNeg ? 'rgba(255,77,109,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${!show ? 'rgba(255,255,255,0.05)' : isPos ? 'rgba(124,224,168,0.2)' : isNeg ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 6, transition: 'all 0.2s ease',
              }}>
                <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#3a3535', lineHeight: 1.35 }}>
                  {show ? t.text : '?????'}
                </div>
                <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: !show ? 'rgba(255,255,255,0.04)' : isPos ? 'rgba(124,224,168,0.15)' : isNeg ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.08)', fontFamily: ANTON, fontSize: 14, color: !show ? '#3a3535' : accentCol }}>
                  {show ? scoreStr : '?'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Buttons — pinned bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 24px 14px', background: '#0e0b12' }}>
        <button onClick={() => dispatch({ type: 'TB_DECIDE', action: 'date' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
          ♥ DATE
        </button>
        <button onClick={() => dispatch({ type: 'TB_DECIDE', action: 'ghost' })}
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', fontSize: 14, letterSpacing: '0.12em', height: 46, borderRadius: 6, cursor: 'pointer' }}>
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
    <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 400, margin: 'auto', width: '100%', padding: '28px 24px' }}>
        {/* Winner/your result card */}
        {winner && (
          <div style={{ textAlign: 'center', marginBottom: 24, padding: 22, background: 'rgba(228,196,106,0.08)', border: `1px solid ${C.gold}88`, borderRadius: 12 }}>
            <img src="/thecatch/brand/hook-heart.png" alt="" style={{ width: 30, marginBottom: 10 }} />
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
              <div key={p.id} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: isMe ? `${C.accent}12` : 'rgba(255,255,255,0.04)', border: (state.mode === 'multi' && p.id === winner?.id) ? `1px solid ${C.gold}55` : isMe ? `1px solid ${C.accent}30` : hairline, borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: ANTON, fontSize: 13, color: '#444', minWidth: 18 }}>#{rank + 1}</span>
                    <span style={{ fontSize: 20 }}>{p.avatar}</span>
                    <div>
                      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe && state.mode === 'single' ? 'YOU' : p.name}</div>
                      <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 10, color: '#555', letterSpacing: '0.08em' }}>{persona.title}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: ANTON, fontSize: 20, color: p.loveScore >= 0 ? C.teal : C.accent }}>{p.loveScore >= 0 ? '+' : ''}{p.loveScore}</div>
                    <div style={{ fontSize: 10 }}>{[0,1,2].map(i => <span key={i} style={{ color: C.accent, opacity: i < p.hearts ? 1 : 0.18 }}>♥</span>)}</div>
                  </div>
                </div>
                {isMe && p.achievements?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 10px', background: `${C.velvet}88`, border: `1px solid ${C.gold}22`, borderTop: 'none' }}>
                    {p.achievements.map(achId => {
                      const ach = ACHIEVEMENTS.find(a => a.id === achId)
                      return ach ? (
                        <span key={achId} title={ach.desc} style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.gold, background: `${C.gold}18`, border: `1px solid ${C.gold}44`, padding: '2px 6px', borderRadius: 2, letterSpacing: '0.08em' }}>
                          {ach.emoji} {ach.title}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: state.mode })}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: 'rgba(255,255,255,0.07)', color: C.cream, fontSize: 14, letterSpacing: '0.1em', border: hairline, minHeight: 52, borderRadius: 6, cursor: 'pointer' }}>
            PLAY AGAIN
          </button>
          <button onClick={onClose}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.1em', border: 'none', minHeight: 52, borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
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
    <div style={{ fontFamily: WS, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: C.bg, borderBottom: hairline, height: 48 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
          ← Back
        </button>
        <CatchWordmark size={14} accent={C.accent} cream={C.cream} />
        <div style={{ width: 48 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {state.screen === 'mode_select'   && <PlayerSetupScreen state={state} dispatch={dispatch} />}
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

import { useReducer, useState, useEffect, useRef } from 'react'
import { generateProfiles, TRAIT_POOL, PLAYER_TYPES, THE_ONE_PROFILE, PLAYER_AVATARS, ACHIEVEMENTS, profileScore, getPersonality } from '../data/catchProfiles'
import { Doll, DOLL_BG } from './DollCharacters'

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
  customTraits: [], pendingPlayers: [], customProfiles: [],
}

function reducer(state, { type, ...p }) {
  switch (type) {
    case 'SELECT_MODE': return { ...state, mode: p.mode, screen: 'player_setup' }

    case 'GO_TO_CUSTOM_TRAITS': {
      return { ...state, screen: 'custom_traits', pendingPlayers: p.players, customTraits: [], customProfiles: [] }
    }

    case 'ADD_CUSTOM_PROFILE': {
      return { ...state, customProfiles: [...(state.customProfiles ?? []), p.profile] }
    }

    case 'REMOVE_CUSTOM_PROFILE': {
      return { ...state, customProfiles: (state.customProfiles ?? []).filter((_, i) => i !== p.idx) }
    }

    case 'USE_THERAPY': {
      const bonus   = Math.random() < 0.5 ? 4 : 0
      const newPlayers = state.players.map(pl =>
        pl.id === p.playerId
          ? { ...pl, therapyTokens: 0, therapyActive: true, therapyBonus: bonus, achievements: grantAchievement(pl.achievements, 'therapized') }
          : pl
      )
      return { ...state, players: newPlayers }
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
      const players  = state.pendingPlayers?.length ? state.pendingPlayers : (p.players ?? [])
      const npcs     = state.mode === 'single' ? [makeNPC(0), makeNPC(1)] : []
      const traits   = p.skipCustom ? [] : (state.customTraits ?? [])
      const cProfiles = p.skipCustom ? [] : (state.customProfiles ?? [])
      return { ...INIT, mode: state.mode, players: [...players, ...npcs], profiles: generateProfiles(7, traits, cProfiles), screen: 'round', roundPhase: 'deciding' }
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
      if (!isTO && (p.action === 'ghost' || p.action === 'therapy_ghost')) {
        updPlayers = state.players.map(pl => pl.id === cur.id ? { ...pl, ghosts: pl.ghosts - 1 } : pl)
      }
      if (!isTO && p.action === 'steal') {
        updPlayers = state.players.map(pl => pl.id === cur.id ? { ...pl, stealTokens: pl.stealTokens - 1 } : pl)
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

      // In multi: skip next therapy player automatically
      let nextIdx = state[idxKey] + 1
      while (!isTO && state.mode === 'multi' && nextIdx < humanPool.length && humanPool[nextIdx]?.therapyActive) {
        newDec = { ...newDec, [humanPool[nextIdx].id]: { action: 'therapy_ghost', stalkedIdxs: [] } }
        nextIdx++
      }

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
      // Apply any pending therapy bonuses and reset therapyActive
      const playersAfterTherapy = state.players.map(pl => {
        if (pl.therapyActive) {
          return { ...pl, therapyActive: false, loveScore: pl.loveScore + (pl.therapyBonus ?? 0), therapyBonus: 0 }
        }
        return pl
      })
      if (state.currentRound >= 6) {
        const qualified = playersAfterTherapy.filter(pl => pl.loveScore >= 10 && pl.hearts >= 1)
        if (!qualified.length) return { ...state, players: playersAfterTherapy, screen: 'results' }
        return { ...state, players: playersAfterTherapy, screen: 'the_one', qualifiedIds: qualified.map(pl => pl.id), theOnePhase: 'deciding', theOneDecidingIdx: 0, theOneDecisions: {}, theOneRevealStep: 0, theOneResults: null }
      }
      return { ...state, players: playersAfterTherapy, currentRound: state.currentRound + 1, roundPhase: 'deciding', decidingPlayerIdx: 0, roundDecisions: {}, revealStep: 0, roundResults: null }
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
          <span>🔎{p.stalkTokens}</span>
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

// ─── TIMER BAR ────────────────────────────────────────────────────────────────
function TimerBar({ seconds, total = 30 }) {
  const pct = (seconds / total) * 100
  const color = seconds <= 8 ? C.accent : seconds <= 15 ? C.gold : C.teal
  return (
    <div style={{ height: 3, background: C.slate, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: 'width 1s linear, background 0.3s ease' }} />
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

// ─── MODE SELECT ──────────────────────────────────────────────────────────────
function ModeSelectScreen({ dispatch }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: DVH, padding: '0 24px', background: '#0e0b12' }}>
      <div style={{ marginBottom: 48, textAlign: 'center', userSelect: 'none' }}>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(60px,16vw,108px)', color: C.accent, lineHeight: 0.88 }}>THE</div>
        <div style={{ fontFamily: ANTON, fontSize: 'clamp(60px,16vw,108px)', color: C.cream, lineHeight: 0.88 }}>CATCH</div>
        <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: '#555', marginTop: 20 }}>Same rules. Louder consequences.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'single' })}
          style={{ fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
          SINGLE PLAYER
        </button>
        <button onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'multi' })}
          style={{ fontFamily: WS, fontWeight: 700, background: 'transparent', border: `1px solid ${C.accent}`, color: C.accent, fontSize: 15, letterSpacing: '0.12em', minHeight: 52, borderRadius: 6, cursor: 'pointer' }}>
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
      ? [{ name: '', avatar: '😊', playerType: PLAYER_TYPES[0] }]
      : [{ name: '', avatar: '😊', playerType: PLAYER_TYPES[0] }, { name: '', avatar: '😎', playerType: PLAYER_TYPES[0] }]
  )
  const update   = (i, key, val) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl))
  const canStart = slots.every(s => s.name.trim().length > 0) && (state.mode === 'single' || slots.length >= 2)
  const start    = () => dispatch({ type: 'GO_TO_CUSTOM_TRAITS', players: slots.map((sl, i) => makePlayer(`p${i}`, sl.name.trim(), sl.avatar, sl.playerType)) })

  if (state.mode === 'single') {
    const sl = slots[0]
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column', padding: '0 28px 32px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 400, margin: 'auto', width: '100%' }}>
          {/* Header */}
          <div style={{ padding: '24px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)', marginBottom: 20, marginLeft: -28, marginRight: -28, paddingLeft: 28, paddingRight: 28 }}>
            <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 'clamp(38px,11vw,56px)', lineHeight: 0.88 }}>WHO'S</div>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 'clamp(38px,11vw,56px)', lineHeight: 0.88 }}>PLAYING?</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: '#555', marginTop: 10 }}>Pick your look. Your rep follows you all game.</p>
          </div>

          {/* Avatar row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {PLAYER_AVATARS.map(av => (
              <button key={av} onClick={() => update(0, 'avatar', av)}
                style={{ width: 46, height: 46, fontSize: 22, background: sl.avatar === av ? C.accent : 'rgba(255,255,255,0.05)', border: sl.avatar === av ? `1px solid ${C.accent}` : hairline, borderRadius: 2, cursor: 'pointer' }}>
                {av}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            style={{ width: '100%', fontFamily: ANTON, fontSize: 28, letterSpacing: '0.04em', background: 'rgba(255,255,255,0.05)', color: C.cream, border: sl.name ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '14px 16px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
            placeholder="YOUR NAME"
            value={sl.name}
            onChange={e => update(0, 'name', e.target.value)}
            maxLength={16}
            autoFocus
          />

          {/* Player type picker */}
          <div style={{ marginTop: 16, marginBottom: 4 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.2em', marginBottom: 8 }}>YOUR TYPE</div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {PLAYER_TYPES.map(pt => {
                const selected = slots[0].playerType?.id === pt.id
                return (
                  <button key={pt.id} onClick={() => update(0, 'playerType', pt)}
                    style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 10px', background: selected ? `${C.teal}18` : C.card, border: `1px solid ${selected ? C.teal : '#2a2525'}`, borderRadius: 6, cursor: 'pointer', minWidth: 82 }}>
                    <span style={{ fontSize: 22 }}>{pt.emoji}</span>
                    <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, letterSpacing: '0.12em', color: selected ? C.teal : '#555', textAlign: 'center', lineHeight: 1.2 }}>{pt.label}</span>
                  </button>
                )
              })}
            </div>
            {slots[0].playerType && (
              <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#666', marginTop: 6, paddingLeft: 2 }}>
                {slots[0].playerType.desc}
              </div>
            )}
          </div>

          {/* NPC rival notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.card, border: hairline, marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>🌙🔥</span>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold, letterSpacing: '0.15em' }}>2 RIVALS IN THE ROOM</div>
          </div>

          <button onClick={start} disabled={!canStart}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: canStart ? C.accent : C.slate, color: canStart ? '#fff' : '#555', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: canStart ? 'pointer' : 'not-allowed', boxShadow: canStart ? '0 0 20px rgba(255,77,109,0.35)' : 'none' }}>
            NEXT →
          </button>
        </div>
      </div>
    )
  }

  // Multiplayer setup
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column', padding: '0 28px 32px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: 'auto', width: '100%' }}>
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)', marginBottom: 24, marginLeft: -28, marginRight: -28, paddingLeft: 28, paddingRight: 28 }}>
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
              {/* Type picker — compact */}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.18em', marginBottom: 6 }}>THEIR TYPE</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {PLAYER_TYPES.map(pt => {
                    const sel = sl.playerType?.id === pt.id
                    return (
                      <button key={pt.id} onClick={() => update(i, 'playerType', pt)}
                        title={pt.label + ' — ' + pt.desc}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', background: sel ? `${C.teal}18` : 'transparent', border: `1px solid ${sel ? C.teal : '#333'}`, borderRadius: 2, cursor: 'pointer' }}>
                        <span style={{ fontSize: 14 }}>{pt.emoji}</span>
                        <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: sel ? C.teal : '#555', letterSpacing: '0.1em' }}>{pt.label.replace('THE ', '')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
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
          style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: canStart ? C.accent : C.slate, color: canStart ? '#fff' : '#555', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: canStart ? 'pointer' : 'not-allowed', marginTop: 20, boxShadow: canStart ? '0 0 20px rgba(255,77,109,0.35)' : 'none' }}>
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

  // Custom profile builder state
  const [cpName, setCpName] = useState('')
  const [cpTraitText, setCpTraitText] = useState('')
  const [cpIsGreen, setCpIsGreen] = useState(true)
  const [cpTraits, setCpTraits] = useState([])
  const [cpPhoto, setCpPhoto] = useState(null)
  const [showCpBuilder, setShowCpBuilder] = useState(false)
  const photoInputRef = useRef(null)

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCpPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  // Saved profiles library (persisted in localStorage)
  const [savedProfiles, setSavedProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('catch_saved_profiles') ?? '[]') } catch { return [] }
  })
  const [showLibrary, setShowLibrary] = useState(false)

  const saveToLibrary = (profile) => {
    const entry = { ...profile, id: `custom_${Date.now()}`, savedAt: Date.now() }
    const updated = [entry, ...savedProfiles.filter(p => p.name !== profile.name)]
    setSavedProfiles(updated)
    localStorage.setItem('catch_saved_profiles', JSON.stringify(updated))
  }

  const deleteFromLibrary = (name) => {
    const updated = savedProfiles.filter(p => p.name !== name)
    setSavedProfiles(updated)
    localStorage.setItem('catch_saved_profiles', JSON.stringify(updated))
  }

  const addTrait = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_CUSTOM_TRAIT', text: trimmed, value: isGreen ? 2 : -2 })
    setText('')
  }

  const addCpTrait = () => {
    const trimmed = cpTraitText.trim()
    if (!trimmed) return
    setCpTraits(ts => [...ts, { text: trimmed, value: cpIsGreen ? 2 : -2 }])
    setCpTraitText('')
  }

  const submitCustomProfile = () => {
    const name = cpName.trim()
    if (!name || cpTraits.length < 2) return
    const sorted = [...cpTraits].sort((a, b) => Math.abs(a.value) - Math.abs(b.value))
    const traits = sorted.map((t, i) => ({ ...t, startVisible: i < 2 }))
    const profile = {
      id:        `custom_${Date.now()}`,
      name,
      age:       25,
      emoji:     '👤',
      doll:      null,
      photo:     cpPhoto ?? null,
      archetype: 'CUSTOM PROFILE',
      tags:      ['REAL PERSON', 'CUSTOM BUILD'],
      bio:       `Someone you actually know. Good luck.`,
      traits,
      isCustom:  true,
    }
    dispatch({ type: 'ADD_CUSTOM_PROFILE', profile })
    setCpName(''); setCpTraits([]); setCpTraitText(''); setCpPhoto(null); setShowCpBuilder(false)
  }

  const hasTraits    = state.customTraits.length > 0
  const hasProfiles  = (state.customProfiles ?? []).length > 0
  const hasAnything  = hasTraits || hasProfiles

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0e0b12', display: 'flex', flexDirection: 'column', padding: '0 28px 28px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 400, margin: 'auto', width: '100%' }}>
        <div style={{ padding: '24px 0 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)', marginBottom: 24, marginLeft: -28, marginRight: -28, paddingLeft: 28, paddingRight: 28 }}>
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

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#2a2525' }} />
            <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#444', letterSpacing: '0.14em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#2a2525' }} />
          </div>

          {/* Custom profile builder toggle */}
          <button onClick={() => setShowCpBuilder(s => !s)}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', padding: '12px 0', background: showCpBuilder ? `${C.teal}18` : 'transparent', border: `1px solid ${showCpBuilder ? C.teal : '#333'}`, color: showCpBuilder ? C.teal : '#555', borderRadius: 2, cursor: 'pointer' }}>
            👤 BUILD A REAL PERSON
          </button>
          {savedProfiles.length > 0 && (
            <button onClick={() => setShowLibrary(s => !s)}
              style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', padding: '12px 0', background: showLibrary ? `${C.gold}18` : 'transparent', border: `1px solid ${showLibrary ? C.gold : '#333'}`, color: showLibrary ? C.gold : '#555', borderRadius: 2, cursor: 'pointer' }}>
              📋 MY SAVED PROFILES ({savedProfiles.length})
            </button>
          )}
        </div>

        {/* Saved profiles library */}
        {showLibrary && savedProfiles.length > 0 && (
          <div style={{ padding: 14, background: C.card, border: `1px solid ${C.gold}44`, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold, letterSpacing: '0.2em', marginBottom: 4 }}>SAVED PROFILES</div>
            {savedProfiles.map((sp) => (
              <div key={sp.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: C.cardAlt, borderLeft: `3px solid ${C.gold}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: ANTON, fontSize: 14, color: C.cream, letterSpacing: '0.06em' }}>{sp.name.toUpperCase()}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', marginTop: 1 }}>{sp.traits.length} traits</div>
                </div>
                <button
                  onClick={() => {
                    dispatch({ type: 'ADD_CUSTOM_PROFILE', profile: { ...sp, id: `custom_${Date.now()}` } })
                    setShowLibrary(false)
                  }}
                  style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', padding: '6px 10px', background: `${C.teal}22`, border: `1px solid ${C.teal}`, color: C.teal, borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + USE
                </button>
                <button
                  onClick={() => deleteFromLibrary(sp.name)}
                  style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Custom profile builder */}
        {showCpBuilder && (
          <div style={{ padding: 14, background: C.card, border: `1px solid ${C.teal}44`, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.teal, letterSpacing: '0.2em', marginBottom: 4 }}>CUSTOM PROFILE BUILDER</div>

            {/* Photo upload */}
            <div
              onClick={() => photoInputRef.current?.click()}
              style={{ width: '100%', height: 130, background: cpPhoto ? 'transparent' : C.cardAlt, border: cpPhoto ? 'none' : `1px dashed #333`, borderRadius: 4, cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              {cpPhoto
                ? <img src={cpPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                : <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>📸</div>
                    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.14em', marginTop: 4 }}>ADD PHOTO</div>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 10, color: '#444', marginTop: 2 }}>optional · tap to upload</div>
                  </div>
              }
              {cpPhoto && (
                <button onClick={e => { e.stopPropagation(); setCpPhoto(null) }}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              )}
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />

            <input
              style={{ width: '100%', fontFamily: ANTON, fontSize: 22, letterSpacing: '0.04em', background: C.cardAlt, color: C.cream, border: cpName ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
              placeholder="THEIR NAME"
              value={cpName}
              onChange={e => setCpName(e.target.value)}
              maxLength={16}
            />
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.16em', marginTop: 4 }}>ADD THEIR TRAITS (min 2)</div>
            <input
              style={{ width: '100%', fontFamily: WS, fontWeight: 400, background: C.cardAlt, color: C.cream, fontSize: 13, border: cpTraitText ? `1px solid rgba(239,230,220,0.2)` : hairline, padding: '10px 12px', outline: 'none', boxSizing: 'border-box', caretColor: C.accent }}
              placeholder="A trait you've actually seen from them..."
              value={cpTraitText}
              onChange={e => setCpTraitText(e.target.value)}
              maxLength={80}
              onKeyDown={e => { if (e.key === 'Enter') addCpTrait() }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setCpIsGreen(true)}
                style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: cpIsGreen ? `${C.teal}22` : 'transparent', border: `1px solid ${cpIsGreen ? C.teal : '#333'}`, color: cpIsGreen ? C.teal : '#444', borderRadius: 2, cursor: 'pointer' }}>
                🟢 GREEN
              </button>
              <button onClick={() => setCpIsGreen(false)}
                style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: !cpIsGreen ? `${C.accent}22` : 'transparent', border: `1px solid ${!cpIsGreen ? C.accent : '#333'}`, color: !cpIsGreen ? C.accent : '#444', borderRadius: 2, cursor: 'pointer' }}>
                🚩 RED
              </button>
              <button onClick={addCpTrait} disabled={!cpTraitText.trim()}
                style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 10, padding: '8px 0', background: cpTraitText.trim() ? C.cardAlt : 'transparent', border: cpTraitText.trim() ? hairline : `1px dashed ${C.slate}`, color: cpTraitText.trim() ? C.cream : '#444', borderRadius: 2, cursor: cpTraitText.trim() ? 'pointer' : 'not-allowed' }}>
                + ADD
              </button>
            </div>
            {cpTraits.length > 0 && (
              <div>
                {cpTraits.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: C.cardAlt, borderLeft: `3px solid ${t.value > 0 ? C.teal : C.accent}`, marginBottom: 3 }}>
                    <span style={{ fontFamily: WS, fontSize: 12, color: C.cream, flex: 1 }}>{t.text}</span>
                    <button onClick={() => setCpTraits(ts => ts.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={submitCustomProfile} disabled={!cpName.trim() || cpTraits.length < 2}
                style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', padding: '11px 0', background: cpName.trim() && cpTraits.length >= 2 ? `${C.teal}22` : 'transparent', border: `1px solid ${cpName.trim() && cpTraits.length >= 2 ? C.teal : '#333'}`, color: cpName.trim() && cpTraits.length >= 2 ? C.teal : '#444', borderRadius: 2, cursor: cpName.trim() && cpTraits.length >= 2 ? 'pointer' : 'not-allowed' }}>
                ✓ ADD TO GAME
              </button>
              <button
                disabled={!cpName.trim() || cpTraits.length < 2}
                onClick={() => {
                  if (!cpName.trim() || cpTraits.length < 2) return
                  const sorted = [...cpTraits].sort((a, b) => Math.abs(a.value) - Math.abs(b.value))
                  const traits = sorted.map((t, i) => ({ ...t, startVisible: i < 2 }))
                  saveToLibrary({ name: cpName.trim(), age: 25, emoji: '👤', doll: null, photo: cpPhoto ?? null, archetype: 'CUSTOM PROFILE', tags: ['REAL PERSON', 'CUSTOM BUILD'], bio: 'Someone you actually know. Good luck.', traits, isCustom: true })
                }}
                style={{ flexShrink: 0, fontFamily: WS, fontWeight: 700, fontSize: 20, padding: '8px 14px', background: 'transparent', border: `1px solid ${cpName.trim() && cpTraits.length >= 2 ? C.gold : '#333'}`, color: cpName.trim() && cpTraits.length >= 2 ? C.gold : '#444', borderRadius: 2, cursor: cpName.trim() && cpTraits.length >= 2 ? 'pointer' : 'not-allowed', lineHeight: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                title="Save to library for future games"
              >
                <span>💾</span>
                <span style={{ fontSize: 8, letterSpacing: '0.12em' }}>SAVE</span>
              </button>
            </div>
          </div>
        )}

        {hasTraits && (
          <div style={{ marginBottom: 16 }}>
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

        {hasProfiles && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#444', letterSpacing: '0.2em', marginBottom: 8 }}>CUSTOM PROFILES ({state.customProfiles.length})</div>
            {state.customProfiles.map((cp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: C.card, border: `1px solid ${C.teal}44`, marginBottom: 4, borderLeft: `3px solid ${C.teal}` }}>
                <div>
                  <div style={{ fontFamily: ANTON, fontSize: 14, color: C.cream, letterSpacing: '0.06em' }}>{cp.name.toUpperCase()}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#666', marginTop: 1 }}>{cp.traits.length} traits</div>
                </div>
                <button onClick={() => dispatch({ type: 'REMOVE_CUSTOM_PROFILE', idx: i })}
                  style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: '#666', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button onClick={() => dispatch({ type: 'START_GAME' })}
            style={{ width: '100%', fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 15, letterSpacing: '0.12em', minHeight: 52, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
            {hasAnything ? `START WITH CUSTOM SETUP →` : 'START THE GAME →'}
          </button>
          {hasAnything && (
            <button onClick={() => dispatch({ type: 'START_GAME', skipCustom: true })}
              style={{ width: '100%', fontFamily: WS, fontWeight: 500, background: 'transparent', border: `1px solid rgba(255,255,255,0.1)`, color: '#888', fontSize: 13, letterSpacing: '0.1em', minHeight: 44, borderRadius: 6, cursor: 'pointer' }}>
              SKIP — PLAY WITHOUT CUSTOM
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE CARD (photo + tags, no traits) ───────────────────────────────────
function ProfileCard({ profile, goldTheme, lookUnlocked = false }) {
  const photo    = profile.isCatfish && profile.doll
    ? (CATFISH_PHOTO[DOLL_GENDER[profile.doll]] ?? DOLL_PHOTO[profile.doll])
    : (profile.doll ? DOLL_PHOTO[profile.doll] : (profile.photo ?? null))
  const hasPhoto = !!photo
  const maxLook  = (lookUnlocked && hasPhoto) ? 1 : 0
  const [lookIdx, setLookIdx] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (lookUnlocked && hasPhoto) setLookIdx(1)
  }, [lookUnlocked])

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
        {hasPhoto && (
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

  // Timer for multiplayer deciding phase
  const [timer, setTimer] = useState(30)
  const timerRef = useRef(null)
  useEffect(() => {
    if (state.mode !== 'multi' || state.roundPhase !== 'deciding') { setTimer(30); return }
    setTimer(30)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          dispatch({ type: 'DECIDE', action: 'ghost' })
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [state.decidingPlayerIdx, state.currentRound, state.roundPhase, state.mode])

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
    const realTherapyTokens = realPlayer?.therapyTokens ?? 0
    const realTherapyActive = realPlayer?.therapyActive ?? false

    if (showScorePopup && myResult) {
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
            <ProfileCard profile={profile} goldTheme={false} lookUnlocked={true} />
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
                    <div style={{ flex: 1, fontFamily: WS, fontWeight: 500, fontSize: 13, color: C.cream, lineHeight: 1.35 }}>{t.text}</div>
                    <div style={{ flexShrink: 0, minWidth: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: isPos ? 'rgba(124,224,168,0.15)' : 'rgba(255,77,109,0.15)', fontFamily: ANTON, fontSize: 14, color: isPos ? C.teal : C.accent }}>{scoreStr}</div>
                  </div>
                )
              })}
            </div>

            {/* Your result */}
            {myResult && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: myResult.pts > 0 ? `${C.teal}12` : myResult.pts < 0 ? `${C.accent}12` : C.card, border: `1px solid ${myResult.pts > 0 ? 'rgba(124,224,168,0.2)' : myResult.pts < 0 ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 6, marginBottom: 8 }}>
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
            )}

            {/* Therapy */}
            {realTherapyTokens > 0 && !realTherapyActive && (
              <button onClick={() => dispatch({ type: 'USE_THERAPY', playerId: realPlayer?.id })}
                style={{ width: '100%', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '10px 0', background: C.velvet, border: `1px solid ${C.gold}66`, color: C.gold, borderRadius: 6, cursor: 'pointer' }}>
                🛋️ THERAPY — SKIP ROUND · 50% +4
              </button>
            )}
            {realTherapyActive && (
              <div style={{ padding: '9px 14px', background: C.velvet, border: `1px solid ${C.gold}44`, borderRadius: 2, textAlign: 'center' }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: C.gold, letterSpacing: '0.12em' }}>
                  🛋️ THERAPY ACTIVE{realPlayer?.therapyBonus > 0 ? ` · +${realPlayer.therapyBonus} COMING` : ''}
                </div>
              </div>
            )}
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                  <div style={{ flex: 1, fontFamily: WS, fontWeight: show ? 500 : 300, fontSize: 13, color: show ? C.cream : '#3a3535', lineHeight: 1.35 }}>
                    {show ? t.text : '?????'}
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
                TAP TO REVEAL ▼
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

  // deciding phase
  const canStalk  = curPlayer?.stalkTokens > 0 && (dec.stalkedIdxs ?? []).length < profile.traits.filter(t => !t.startVisible).length
  const canGhost  = (curPlayer?.ghosts ?? 0) > 0
  const canSteal  = (curPlayer?.stealTokens ?? 0) > 0 && state.players.some(pl => pl.id !== curPlayer?.id && pl.loveScore > 0)
  const canDouble = state.mode === 'multi'
  const profilePhoto = profile.isCatfish && profile.doll
    ? (CATFISH_PHOTO[DOLL_GENDER[profile.doll]] ?? DOLL_PHOTO[profile.doll])
    : (profile.doll ? DOLL_PHOTO[profile.doll] : (profile.photo ?? null))
  const canLook   = (curPlayer?.looks ?? 0) > 0 && !!profilePhoto && !(dec.lookUsed ?? false)

  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
      <Hud players={state.players} currentRound={state.currentRound} mode={state.mode} currentPlayer={curPlayer} />
      {state.mode === 'multi' && <TimerBar seconds={timer} />}
      {state.mode === 'multi' && (
        <div style={{ flex: '0 0 auto', fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', padding: '6px 16px', textAlign: 'center', background: C.card, color: C.accent, borderBottom: hairline, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{curPlayer?.avatar} {curPlayer?.name?.toUpperCase()}'S TURN</span>
          <span style={{ color: timer <= 8 ? C.accent : '#555', fontFamily: ANTON, fontSize: 14 }}>{timer}s</span>
        </div>
      )}

      {/* Profile card — fixed height, no grow */}
      <div style={{ flex: '0 0 auto' }}>
        <ProfileCard profile={profile} goldTheme={false} lookUnlocked={dec.lookUsed ?? false} />
      </div>

      {/* Traits — scrollable rounded cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 6px', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                background: !show ? 'rgba(255,255,255,0.03)' : isPos ? 'rgba(124,224,168,0.07)' : isNeg ? 'rgba(255,77,109,0.07)' : 'rgba(255,255,255,0.04)',
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

      {/* Action buttons — always pinned at bottom */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 5, padding: '8px 24px 12px', background: '#0e0b12' }}>
        {/* Main date / ghost row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => dispatch({ type: 'DECIDE', action: 'date' })}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: C.accent, color: '#fff', fontSize: 14, letterSpacing: '0.12em', height: 46, border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 0 20px rgba(255,77,109,0.35)' }}>
            ♥ DATE
          </button>
          <button onClick={() => dispatch({ type: 'DECIDE', action: 'ghost' })} disabled={!canGhost}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, background: 'transparent', border: `1px solid ${canGhost ? 'rgba(255,255,255,0.1)' : C.slate}`, color: canGhost ? '#888' : '#444', fontSize: 13, letterSpacing: '0.1em', height: 46, borderRadius: 6, cursor: canGhost ? 'pointer' : 'not-allowed' }}>
            ◌ GHOST
          </button>
        </div>
        {/* Multiplayer extras: double date + steal */}
        {state.mode === 'multi' && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => dispatch({ type: 'DECIDE', action: 'double_date' })}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', height: 38, background: `${C.accent}18`, border: `1px solid ${C.accent}55`, color: C.accent, borderRadius: 2, cursor: 'pointer' }}>
              ♥♥ DOUBLE
            </button>
            <button onClick={() => dispatch({ type: 'DECIDE', action: 'steal' })} disabled={!canSteal}
              style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', height: 38, background: canSteal ? `${C.gold}18` : 'transparent', border: `1px solid ${canSteal ? C.gold : '#333'}`, color: canSteal ? C.gold : '#444', borderRadius: 2, cursor: canSteal ? 'pointer' : 'not-allowed' }}>
              ⚡ STEAL
            </button>
          </div>
        )}
        {/* Look + Stalk row */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => dispatch({ type: 'USE_LOOK' })} disabled={!canLook}
            style={{ flex: 1, fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', height: 36, background: canLook ? `${C.teal}10` : 'transparent', border: `1px dashed ${canLook ? C.teal : C.slate}`, color: canLook ? C.teal : '#3a3535', borderRadius: 6, cursor: canLook ? 'pointer' : 'not-allowed' }}>
            👁 LOOK {canLook ? curPlayer?.looks ?? 0 : ''}
          </button>
          <button onClick={() => dispatch({ type: 'STALK' })} disabled={!canStalk}
            style={{ flex: 1, fontFamily: WS, fontWeight: 500, fontSize: 11, letterSpacing: '0.12em', height: 36, background: 'transparent', border: `1px dashed ${canStalk ? C.gold : C.slate}`, color: canStalk ? C.gold : '#3a3535', borderRadius: 6, cursor: canStalk ? 'pointer' : 'not-allowed' }}>
            🔍 STALK {canStalk ? curPlayer?.stalkTokens ?? 0 : ''}
          </button>
        </div>
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
            return (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isMe ? `${C.accent}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${isMe ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 6, marginBottom: 6, textAlign: 'left' }}>
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

  const canStalk = curPlayer?.stalkTokens > 0 && (dec.stalkedIdxs ?? []).length < profile.traits.filter(t => !t.startVisible).length
  return (
    <div style={{ height: DVH, display: 'flex', flexDirection: 'column', background: '#0e0b12', overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{ flex: '0 0 auto', padding: '10px 24px 8px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, #1a1020 0%, #0e0b12 100%)' }}>
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

      {/* Traits — scrollable rounded cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 6px', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
        <button onClick={() => dispatch({ type: 'STALK' })} disabled={!canStalk}
          style={{ width: '100%', fontFamily: WS, fontWeight: 500, color: canStalk ? C.gold : '#3a3535', fontSize: 12, letterSpacing: '0.12em', background: 'transparent', border: `1px dashed ${canStalk ? C.gold : C.slate}`, borderRadius: 6, height: 38, cursor: canStalk ? 'pointer' : 'not-allowed' }}>
          🔍 STALK {canStalk ? curPlayer?.stalkTokens ?? 0 : ''}
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 6px', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: isMe ? C.cream : '#888' }}>{isMe ? 'YOU' : p.name}</div>
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
    <div style={{ fontFamily: WS, height: '100dvh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: C.bg, borderBottom: hairline, height: 48 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
          ← Back
        </button>
        <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 14, letterSpacing: '0.12em' }}>THE CATCH</div>
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

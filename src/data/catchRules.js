// The Catch — scoring rules shared by the table companion and online mode.
//
// A player is { score, hearts, ghosts, dates, redFlags, ... }.
// decisions[id] is { action: 'date' | 'ghost', total } where `total` is that
// player's type-adjusted card sum (typed in at the table; computed online).
// Everything below is layered on automatically.

export const ROUNDS = 7
export const HEARTS = 3
export const GHOSTS = 3
export const STALKS = 3

export function scoreMatch(players, decisions, isCatfish) {
  const daters = players.filter(p => decisions[p.id]?.action === 'date')
  const results = {}
  const next = players.map(p => {
    const d = decisions[p.id] ?? { action: 'ghost' }
    if (d.action === 'ghost') {
      const pts = isCatfish ? 1 : 0
      results[p.id] = { action: 'ghost', pts, notes: isCatfish ? ['Dodged the catfish +1'] : [] }
      return { ...p, score: p.score + pts, ghosts: Math.max(0, p.ghosts - 1) }
    }
    const raw = d.total
    let pts = raw, heartsLost = 0, redFlag = false
    const notes = []
    if (isCatfish) {
      pts -= 4; heartsLost = 1
      notes.push('Catfished −4')
    } else {
      if (raw < 0) heartsLost = 1
      if (raw <= -5) { pts -= 2; redFlag = true; notes.push('Red flag −2') }
      if (raw >= 7 && daters.length === 1) { pts += 2; notes.push('Chemistry +2') }
    }
    if (p.hearts === 0 && pts > 0) { pts = Math.floor(pts / 2); notes.push('Heartbroken: halved') }
    if (heartsLost) notes.push('Lost a heart')
    results[p.id] = { action: 'date', raw, pts, notes }
    return { ...p, score: p.score + pts, hearts: Math.max(0, p.hearts - heartsLost), dates: p.dates + 1, redFlags: p.redFlags + (redFlag ? 1 : 0) }
  })
  return { players: next, results }
}

// Highest score wins; a tie goes to whoever kept more hearts; still tied = shared.
export function rankPlayers(players) {
  return [...players].sort((a, b) => b.score - a.score || b.hearts - a.hearts)
}

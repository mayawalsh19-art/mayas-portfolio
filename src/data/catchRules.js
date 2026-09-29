// The Catch — scoring rules shared by the table companion and online mode.
//
// A player is { score, ghosts, dates, redFlags, ... }. It's purely a points game.
// decisions[id] is { action: 'date' | 'ghost', total } where `total` is that
// player's type-adjusted card sum (typed in at the table; computed online).
// Everything below is layered on automatically.

export const ROUNDS = 7
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
    let pts = raw, redFlag = false
    const notes = []
    if (isCatfish) {
      pts -= 4
      notes.push('Catfished −4')
    } else {
      if (raw <= -5) { pts -= 2; redFlag = true; notes.push('Red flag −2') }
      if (raw >= 7 && daters.length === 1) { pts += 2; notes.push('Chemistry +2') }
    }
    results[p.id] = { action: 'date', raw, pts, notes }
    return { ...p, score: p.score + pts, dates: p.dates + 1, redFlags: p.redFlags + (redFlag ? 1 : 0) }
  })
  return { players: next, results }
}

// Points are everything: highest score wins, a tie is a shared win.
export function rankPlayers(players) {
  return [...players].sort((a, b) => b.score - a.score)
}

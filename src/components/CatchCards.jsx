import { CatchWordmark } from './CatchBrand'

// The printed trait cards and stalk chip, drawn in code for the case study.
// Keep these matching the print deck.

const C = { bg: '#131011', card: '#1E1A1B', accent: '#FF4D6D', teal: '#7CE0A8', gold: '#E4C46A', cream: '#EFE6DC' }
const ANTON = "'Anton', sans-serif"
const WS    = "'Work Sans', sans-serif"

function flagOf(v) {
  if (v <= -4) return ['DEALBREAKER', C.accent]
  if (v >= 1)  return ['GREEN FLAG', C.teal]
  if (v >= -1) return ['YELLOW FLAG', C.gold]
  return ['RED FLAG', C.accent]
}

// `compact` shrinks the type for cards ~110px wide (three across a phone).
export function TraitCardFront({ text, value, blank = false, green = true, compact = false }) {
  const [label, col] = blank ? (green ? ['GREEN FLAG', C.teal] : ['RED FLAG', C.accent]) : flagOf(value)
  const val = blank ? (green ? '+2' : '−2') : value > 0 ? `+${value}` : value === 0 ? '±0' : `−${Math.abs(value)}`
  const s = compact ? { pad: '8px 7px 7px 9px', no: 9, tag: 5, text: 9.5, mark: 5.5, val: 19, border: 4 }
                    : { pad: '12px 12px 11px 14px', no: 11, tag: 6, text: 11.5, mark: 7, val: 26, border: 5 }
  return (
    <div style={{ aspectRatio: '5 / 7', background: C.card, borderLeft: `${s.border}px solid ${col}`, padding: s.pad, display: 'flex', flexDirection: 'column', boxShadow: '0 16px 32px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
        {blank && <span style={{ fontFamily: ANTON, fontSize: s.no - 2, letterSpacing: '0.08em', color: 'rgba(239,230,220,0.55)', whiteSpace: 'nowrap' }}>WRITE YOUR OWN</span>}
        <span style={{ fontFamily: WS, fontWeight: 700, fontSize: s.tag, letterSpacing: '0.14em', color: label === 'DEALBREAKER' ? C.bg : col, background: label === 'DEALBREAKER' ? col : 'transparent', border: `1px solid ${col}`, padding: '2px 3px', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      {blank
        ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>{[0, 1, 2].map(i => <div key={i} style={{ borderBottom: '1px solid rgba(239,230,220,0.22)' }} />)}</div>
        : <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontFamily: WS, fontWeight: 500, fontSize: s.text, lineHeight: 1.3, color: C.cream }}>{text}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <CatchWordmark size={s.mark} accent={C.accent} cream="rgba(239,230,220,0.6)" />
        <span style={{ fontFamily: ANTON, fontSize: s.val, lineHeight: 0.9, color: col }}>{val}</span>
      </div>
    </div>
  )
}

export function TraitCardBack({ compact = false }) {
  return (
    <div style={{ aspectRatio: '5 / 7', background: C.bg, backgroundImage: 'radial-gradient(circle, rgba(239,230,220,0.07) 1px, transparent 1px)', backgroundSize: '8px 8px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 32px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', inset: compact ? 5 : 8, border: `1px solid ${C.accent}73` }} />
      <img src="/thecatch/brand/logo-full.svg" alt="" style={{ width: '72%' }} />
      <div style={{ position: 'absolute', bottom: compact ? 10 : 16, fontFamily: WS, fontWeight: 700, fontSize: compact ? 5 : 6.5, letterSpacing: '0.3em', color: C.accent }}>TRAIT CARD</div>
    </div>
  )
}

export function StalkChip({ size = 96 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: C.card, border: `${Math.round(size * 0.045)}px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px rgba(0,0,0,0.5)', flexShrink: 0, boxSizing: 'border-box' }}>
      <div style={{ width: '78%', height: '78%', borderRadius: '50%', border: `1px solid ${C.gold}55`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: ANTON, fontSize: size * 0.2, lineHeight: 1, letterSpacing: '0.1em', paddingLeft: '0.1em', color: C.gold }}>STALK</div>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: size * 0.055, lineHeight: 1, letterSpacing: '0.12em', paddingLeft: '0.12em', whiteSpace: 'nowrap', color: 'rgba(239,230,220,0.55)', marginTop: size * 0.06 }}>PEEK AT 1 CARD</div>
      </div>
    </div>
  )
}

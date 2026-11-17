// Plot's supporting cast: the brand pieces used around the Subscription Graveyard app.
// Same artwork as the app (graveyard-app/app.js). Motion lives in index.css (gy-* classes).

const INK = '#1E1B2E', PLUM = '#3B2F5C', BONE = '#F6F1E7', STONE = '#C9C4D6', DIRT = '#6B4A3A', MOSS = '#7FD67A', CANDLE = '#FFD166', BLUSH = '#FF9EC4', PUMPKIN = '#FF8A3D'

export function Ghost({ size = 60, letter }) {
  return (
    <svg width={size} height={size * 70 / 60} viewBox="0 0 60 70" aria-hidden="true" style={{ overflow: 'visible' }}>
      <path d="M6 64V30a24 24 0 0 1 48 0v34l-8-6-8 6-8-6-8 6-8-6z" fill={BONE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="23" cy="29" rx="3.5" ry="5" fill={INK} /><ellipse cx="37" cy="29" rx="3.5" ry="5" fill={INK} />
      <ellipse cx="16" cy="38" rx="4" ry="2.4" fill={BLUSH} opacity=".7" /><ellipse cx="44" cy="38" rx="4" ry="2.4" fill={BLUSH} opacity=".7" />
      {letter && <text x="30" y="53" textAnchor="middle" fontFamily="'Bagel Fat One', sans-serif" fontSize="13" fill={PLUM}>{letter}</text>}
    </svg>
  )
}

export function Bat({ width = 90, lead, color = MOSS, letter = 'S', ink = INK }) {
  return (
    <svg width={width} height={width * 36 / 60} viewBox="0 0 60 36" aria-hidden="true" style={{ overflow: 'visible' }}>
      <path className="gy-wl" d="M30 15C22 5 10 3 2 9c6 1 8 5 7 9 4-3 8-1 9 3 3-4 8-3 12 0z" fill={INK} stroke={BONE} strokeWidth="1.2" strokeLinejoin="round" />
      <path className="gy-wr" d="M30 15c8-10 20-12 28-6-6 1-8 5-7 9-4-3-8-1-9 3-3-4-8-3-12 0z" fill={INK} stroke={BONE} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M24.5 12L24 4l4.5 5.5zM35.5 12l.5-8-4.5 5.5z" fill={INK} />
      <ellipse cx="30" cy="18" rx="7.5" ry="9.5" fill={INK} />
      {lead && <><circle cx="30" cy="22" r="4.6" fill={color} /><text x="30" y="24.6" textAnchor="middle" fontFamily="'Bagel Fat One', sans-serif" fontSize="7" fill={ink}>{letter}</text></>}
      <circle cx="27" cy="15.5" r="1.8" fill={CANDLE} /><circle cx="33" cy="15.5" r="1.8" fill={CANDLE} />
      <path d="M28.3 19.5l.8 1.8.8-1.8M30.1 19.5l.8 1.8.8-1.8" fill="#fff" />
    </svg>
  )
}

export function Zombie({ width = 120, color = '#7FD3FF', letter = 'D', ink = INK }) {
  const hand = x => <path d={`M${x - 9} 30c-1-6 0-12 2-17 1-3 4-3 4 0l0 7 1-11c0-3 4-3 4 0l0 10 1-10c0-3 4-3 4 0l0 11 1-7c0-3 4-3 4 0 0 6-1 12-3 17z`} fill="#A8C98F" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
  return (
    <svg width={width} height={width * 172 / 120} viewBox="0 0 120 172" aria-hidden="true" style={{ overflow: 'visible' }}>
      <g className="gy-arm-l"><path d="M38 98L24 34" stroke={INK} strokeWidth="15" strokeLinecap="round" /><path d="M38 98L24 34" stroke="#A8C98F" strokeWidth="9" strokeLinecap="round" /><path d="M38 98L32 72" stroke={color} strokeWidth="13" strokeLinecap="round" />{hand(24)}</g>
      <g className="gy-arm-r"><path d="M82 98L96 34" stroke={INK} strokeWidth="15" strokeLinecap="round" /><path d="M82 98L96 34" stroke="#A8C98F" strokeWidth="9" strokeLinecap="round" /><path d="M82 98L88 72" stroke={color} strokeWidth="13" strokeLinecap="round" />{hand(96)}</g>
      <path d="M30 172V108c0-10 8-16 18-16h24c10 0 18 6 18 16v64z" fill={color} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M44 172l4-8 5 6 4-9 5 8 5-7 4 10" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" opacity=".55" />
      <text x="60" y="146" textAnchor="middle" fontFamily="'Bagel Fat One', sans-serif" fontSize="30" fill={ink}>{letter}</text>
      <g className="gy-head">
        <path d="M34 62c0-18 10-28 26-28s26 10 26 28v14c0 10-8 18-18 18H52c-10 0-18-8-18-18z" fill="#A8C98F" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M46 34l4-7 4 6 5-8 3 8 6-5-1 7" fill="#6B8A5E" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M64 44l12 6M67 42l-2 5M71 44l-2 5M75 46l-2 5" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="49" cy="62" r="8" fill="#fff" stroke={INK} strokeWidth="3" /><circle cx="51" cy="64" r="3" fill={INK} />
        <circle cx="72" cy="63" r="5" fill="#fff" stroke={INK} strokeWidth="3" /><path d="M66 58h12" stroke={INK} strokeWidth="3.5" strokeLinecap="round" /><circle cx="72" cy="64.5" r="2" fill={INK} />
        <path d="M47 81q8-4 16 0t10-1" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" /><path d="M55 80.5l2 4 2-4" fill="#fff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="40" cy="74" rx="4" ry="2.5" fill={BLUSH} opacity=".55" />
      </g>
    </svg>
  )
}

export function Cobweb({ size = 26, color = PLUM }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round"><path d="M24 0L10 14M24 0L6 4M24 0L20 18M24 0L15 9" /><path d="M14 1.5q1.5 2 3.6 1.4M19 6.4q-2 .6-2.4 2.7M21.8 11q-1.4-.4-2.6.8M8.6 2.6q1.6 1.4 1 3.8M16.5 13.3q-2-.3-3.5 1.4" /></g>
      <path className="gy-spider" d="M18.5 15.5v4" stroke={color} strokeWidth="1" /><circle className="gy-spider" cx="18.5" cy="20.6" r="1.4" fill={color} />
    </svg>
  )
}

export function Candle({ height = 70 }) {
  return (
    <svg width={height * 30 / 46} height={height} viewBox="0 0 30 46" aria-hidden="true" style={{ overflow: 'visible' }}>
      <ellipse className="gy-glow" cx="15" cy="12" rx="9" ry="11" fill={CANDLE} opacity=".3" />
      <path className="gy-flame" d="M15 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill={PUMPKIN} stroke={INK} strokeWidth="1.5" />
      <path d="M15 9c1.4 2 2 3 2 4.2a2 2 0 0 1-4 0c0-1.2.6-2.2 2-4.2z" fill={CANDLE} />
      <rect x="8" y="19" width="14" height="24" rx="3" fill={BONE} stroke={INK} strokeWidth="2" />
      <path d="M8 24q3 3 5 0t4 2 5-2" fill="none" stroke={STONE} strokeWidth="2" />
      <rect x="5" y="42" width="20" height="3.5" rx="1.75" fill={INK} />
    </svg>
  )
}

export function MoonStars({ width = 180 }) {
  return (
    <svg width={width} height={width * 70 / 120} viewBox="0 0 120 70" aria-hidden="true">
      <path d="M92 14a16 16 0 1 0 14 24 13 13 0 1 1-14-24z" fill={CANDLE} />
      <g fill={BONE}>
        <path className="gy-tw" d="M60 12l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" />
        <circle className="gy-tw gy-d2" cx="40" cy="30" r="1.4" /><circle className="gy-tw gy-d3" cx="78" cy="50" r="1.2" />
        <circle className="gy-tw gy-d4" cx="112" cy="58" r="1.4" /><circle className="gy-tw gy-d2" cx="22" cy="10" r="1" />
      </g>
    </svg>
  )
}

export function Fence() {
  return (
    <svg viewBox="0 0 320 40" preserveAspectRatio="none" className="w-full h-[34px] block" aria-hidden="true">
      <path d="M0 34q40-6 80 0t80 0 80 0 80 0V40H0z" fill={DIRT} />
      <path d="M6 33l3-8 3 8M60 32l2-7 3 7M150 34l3-9 2 9M232 33l2-6 3 6M300 33l3-8 2 8" stroke={MOSS} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g fill={STONE} stroke={INK} strokeWidth="2"><path d="M96 33V20a8 8 0 0 1 16 0v13z" /><path d="M176 34V16a10 10 0 0 1 20 0v18z" /><path d="M262 33V22a7 7 0 0 1 14 0v11z" /></g>
    </svg>
  )
}

export function IronFence() {
  return (
    <svg viewBox="0 0 330 50" preserveAspectRatio="none" className="w-full h-[46px] block" aria-hidden="true">
      <path d="M0 46q80-5 165 0t165 0V50H0z" fill={DIRT} />
      <g fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        {Array.from({ length: 13 }, (_, i) => { const x = 6 + i * 25.5; return <path key={i} d={`M${x} 44V14l4-8 4 8v30`} /> })}
        <rect x="0" y="20" width="330" height="3" rx="1.5" /><rect x="0" y="36" width="330" height="3" rx="1.5" />
      </g>
    </svg>
  )
}

const EV = {
  Buried: [PLUM, <><path d="M6 20V10a6 6 0 0 1 12 0v10z" fill={STONE} stroke={INK} strokeWidth="2" strokeLinejoin="round" /><path d="M3 21h18" stroke={DIRT} strokeWidth="3" strokeLinecap="round" /><path d="M10 12h4M12 10v5" stroke={INK} strokeWidth="1.6" strokeLinecap="round" /></>],
  Resurrected: [MOSS, <><path d="M8 22v-7c0-1 .6-1.6 1.4-1.6S11 14 11 15V7.5c0-1 .6-1.6 1.4-1.6s1.4.6 1.4 1.6V13l.6-4c.2-.9.8-1.3 1.6-1.1.8.2 1.1.9.9 1.8L15.6 17c-.4 2.5-1.6 5-3.6 5z" fill="#A8C98F" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" /><path d="M4 22h16" stroke={DIRT} strokeWidth="3" strokeLinecap="round" /></>],
  Switched: [CANDLE, <path d="M5 8h12l-3-3M19 16H7l3 3" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />],
}
export function EventIcon({ type = 'Buried', size = 44 }) {
  const [bg, art] = EV[type]
  return (
    <span className="grid place-items-center shrink-0" style={{ width: size, height: size, borderRadius: size * 0.34, background: bg, border: `2px solid ${INK}` }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" aria-hidden="true">{art}</svg>
    </span>
  )
}

// One particle shape per service, used for the burial send-off
const SHAPES = {
  note: c => <><path d="M9 17V5l10-2v12" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6.5" cy="17.5" r="3" fill={c} /><circle cx="16.5" cy="15.5" r="3" fill={c} /></>,
  star: c => <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill={c} />,
  box: c => <><rect x="3" y="6" width="18" height="14" rx="1.5" fill={c} /><path d="M3 10.5h18M12 6v4.5" stroke={INK} strokeWidth="1.6" /></>,
  feather: c => <><path d="M12 1.5c5.5 5.5 5.5 14.5 0 21-5.5-6.5-5.5-15.5 0-21z" fill={c} /><circle cx="12" cy="9" r="2.6" fill={INK} /></>,
  flame: c => <path d="M12 1.5c1.2 4.2 6.5 6.4 6.5 12.5a6.5 6.5 0 0 1-13 0c0-3.2 2-5.4 3.2-6.4 0 2.2 1 3.4 2.2 3.4 0-4.2-1-6.5 1.1-9.5z" fill={c} />,
  film: c => <><rect x="3" y="3.5" width="18" height="17" rx="2" fill={c} /><path d="M6.5 6.5v1M6.5 11.5v1M6.5 16.5v1M17.5 6.5v1M17.5 11.5v1M17.5 16.5v1" stroke={INK} strokeWidth="2" strokeLinecap="round" /></>,
}
export function Particle({ shape, color, size = 26 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ filter: 'drop-shadow(0 1.5px 0 rgba(30,27,46,.55))', overflow: 'visible' }}>{SHAPES[shape](color)}</svg>
}

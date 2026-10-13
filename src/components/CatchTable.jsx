import { useEffect, useRef, useState } from 'react'
import { TraitCardFront, TraitCardBack, StalkChip } from './CatchCards'
import { TRAIT_POOL } from '../data/catchProfiles'

// The printed deck laid out on a game-night table, like a product photo.
// Everything is the real card art from CatchCards, so it always matches the deck.
// The scene is drawn on a fixed 1300 x 640 canvas and scaled to fit; on phones it
// crops the edges instead of shrinking the cards too far.

const W = 1300
const H = 640
const CARD = 172            // card width on the table
const BASE = 140            // width the card art is drawn at (its type is tuned for this)
const RADIUS = '5% / 3.57%'
const card = n => TRAIT_POOL[n - 1]
const FOCUS_X = 930        // centre of the dealt cards, kept in view on phones

// Walnut: stretched noise for the grain, fine noise for the surface
const grain = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='2600' height='700' viewBox='0 0 2600 700' preserveAspectRatio='none'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.0016 0.07' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.55'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`)}")`
const fine = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(#f)'/></svg>`)}")`

const contact = '0 1px 1px rgba(0,0,0,0.55), 0 4px 8px rgba(0,0,0,0.35), 0 18px 34px rgba(0,0,0,0.38)'
const lifted  = '0 2px 2px rgba(0,0,0,0.45), 0 14px 22px rgba(0,0,0,0.35), 0 34px 56px rgba(0,0,0,0.42)'

// One card on the table: drawn at BASE, scaled to CARD, with a soft sheen like coated stock
function TableCard({ x, y, rot = 0, origin = '50% 50%', lift = false, z, base = BASE, children }) {
  const [hover, setHover] = useState(false)
  const up = lift && hover
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute', left: x, top: y, width: CARD, height: CARD * 1.4, zIndex: up ? 20 : z,
        transform: `rotate(${rot}deg) translateY(${up ? -18 : 0}px)`, transformOrigin: origin,
        transition: 'transform 260ms cubic-bezier(.2,.7,.2,1), box-shadow 260ms', borderRadius: RADIUS,
        boxShadow: up ? lifted : contact,
      }}
    >
      <div style={{ width: base, transform: `scale(${CARD / base})`, transformOrigin: 'top left' }}>
        <div className="catch-table-card">{children}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(255,240,220,0.10) 0%, rgba(255,240,220,0) 38%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.14) 100%)' }} />
    </div>
  )
}

// The deck: cream card edges stacked under the top card, so it reads as a real pile
function Deck({ x, y, rot }) {
  const layers = 14
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: CARD, height: CARD * 1.4, transform: `rotate(${rot}deg)`, zIndex: 3 }}>
      {Array.from({ length: layers }, (_, i) => {
        const d = layers - i
        return <div key={i} style={{ position: 'absolute', left: d * 0.55, top: d * 0.9, width: CARD, height: CARD * 1.4, borderRadius: RADIUS, background: i % 3 === 0 ? '#bfb4a6' : '#d8cec0', boxShadow: d === layers ? contact : 'none' }} />
      })}
      <TableCard x={0} y={0} z={2}><TraitCardBack /></TableCard>
    </div>
  )
}

// A short stack of stalk chips: each one sits a little higher, so their rims show
function Chips({ x, y, count, size = 96 }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, zIndex: 6 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: -i * 0.6, top: -i * 5, filter: `brightness(${0.62 + 0.38 * (i / Math.max(1, count - 1))})`, borderRadius: '50%', boxShadow: i === 0 ? '0 3px 4px rgba(0,0,0,0.55), 0 14px 26px rgba(0,0,0,0.45)' : 'none' }}>
          <StalkChip size={size} />
        </div>
      ))}
    </div>
  )
}

function useScale(ref) {
  const [w, setW] = useState(W)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  const scale = Math.min(1, w / 720)
  // Wide screens: centre the scene. Narrow screens: keep the trait cards in view.
  const left = W * scale <= w ? (w - W * scale) / 2 : Math.min(0, Math.max(w - W * scale, w / 2 - FOCUS_X * scale))
  return { scale, left }
}

// Four cards dealt in a rising row: each one only covers the empty top-right
// corner of the card before it, so every trait and point value stays readable
const DEALT = [
  { n: 10, x: 630,  y: 300, rot: -4 },
  { n: 40, x: 785,  y: 238, rot: 3 },
  { n: 48, x: 940,  y: 176, rot: -2 },
  { n: 65, x: 1095, y: 114, rot: 5 },
]

export default function CatchTable() {
  const ref = useRef(null)
  const { scale, left } = useScale(ref)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: H * scale, overflow: 'hidden', background: '#2b1a11' }}>
      <style>{'.catch-table-card > div { box-shadow: none !important }'}</style>
      {/* walnut tabletop */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `${fine}, ${grain}, linear-gradient(180deg, #3a2417, #2a190f)`, backgroundSize: '240px 240px, max(2600px, 100%) 100%, 100% 100%', backgroundPosition: '0 0, center, 0 0' }} />

      {/* the scene, scaled from its 1300 x 640 canvas and centred */}
      <div style={{ position: 'absolute', top: 0, left, width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* how-to sheet from the box, under everything */}
        <div style={{ position: 'absolute', left: 60, top: 100, width: 320, transform: 'rotate(-8deg)', zIndex: 1, boxShadow: contact }}>
          <img src="/thecatch/screens/howto.jpg" alt="The how-to sheet that comes in the box" style={{ display: 'block', width: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,235,210,0.06), rgba(0,0,0,0.22))' }} />
        </div>

        <Deck x={420} y={190} rot={5} />

        {DEALT.map((c, i) => (
          <TableCard key={c.n} x={c.x} y={c.y} rot={c.rot} lift z={10 + i}>
            {c.blank ? <TraitCardFront blank /> : <TraitCardFront text={card(c.n).text} value={card(c.n).value} />}
          </TableCard>
        ))}

        {/* a blank card, ready for the table to write its own */}
        <TableCard x={1112} y={378} rot={7} z={5} base={185}><TraitCardFront blank /></TableCard>

        <Chips x={310} y={480} count={5} />
        <Chips x={600} y={95} count={2} size={88} />
      </div>

      {/* warm light over the table, falling off to the edges, blending into the page */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 70% at 52% 42%, rgba(255,214,170,0.13), rgba(255,214,170,0) 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 95% at 52% 45%, rgba(0,0,0,0) 50%, rgba(10,6,4,0.6) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, #131011 0%, rgba(19,16,17,0) 7%, rgba(19,16,17,0) 93%, #131011 100%)' }} />
    </div>
  )
}

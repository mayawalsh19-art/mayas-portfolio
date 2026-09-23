// Shared "THE CATCH" brand mark.
//
// The full logo (hook-and-heart wordmark, flanking hearts) is the exact SVG
// the user supplied — public/thecatch/brand/logo-full.svg — used as-is, not
// redrawn in code. Earlier versions tried to hand-recreate it and never
// matched; don't go back to that. Unlike the older PNG version, this SVG
// does NOT bake in the "SAME RULES. LOUDER CONSEQUENCES." tagline, so
// CatchHero renders that as real text underneath instead.

const ANTON = "'Anton', sans-serif"
const WS = "'Work Sans', sans-serif"

// Compact single-line two-tone wordmark for nav bars, footers, and small
// labels, where the full logo image is too small to read.
export function CatchWordmark({ size = 14, accent = '#FF4D6D', cream = '#EFE6DC', style }) {
  return (
    <span style={{ fontFamily: ANTON, fontSize: size, letterSpacing: '0.12em', whiteSpace: 'nowrap', ...style }}>
      <span style={{ color: accent }}>THE </span>
      <span style={{ color: cream }}>CATCH</span>
    </span>
  )
}

// Full hero lockup — the exact reference artwork, used as-is. `subtitle`
// replaces the default tagline for a placement that needs different
// context copy (e.g. online multiplayer's "SEPARATE DEVICES · ONLINE").
export function CatchHero({ maxWidth = 560, subtitle, subtitleColor = 'rgba(239,230,220,0.4)', style }) {
  return (
    <div style={{ textAlign: 'center', ...style }}>
      <img
        src="/thecatch/brand/logo-full.svg"
        alt="THE CATCH"
        style={{ width: '100%', maxWidth, display: 'inline-block' }}
      />
      <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: subtitleColor, letterSpacing: '0.18em', margin: '10px 0 0' }}>
        {subtitle || 'SAME RULES. LOUDER CONSEQUENCES.'}
      </p>
    </div>
  )
}

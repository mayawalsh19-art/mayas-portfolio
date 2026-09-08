import { useEffect } from 'react'

// ─── Design tokens (mirror the game) ─────────────────────────────────────────
const C = {
  bg:      '#131011',
  card:    '#1E1A1B',
  cardAlt: '#2C2729',
  accent:  '#FF4D6D',
  teal:    '#7CE0A8',
  gold:    '#E4C46A',
  cream:   '#EFE6DC',
  velvet:  '#3B2E4A',
}
const ANTON = "'Anton', sans-serif"
const WS    = "'Work Sans', sans-serif"
const hair  = `1px solid rgba(239,230,220,0.08)`

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, style = {} }) {
  return (
    <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </section>
  )
}

function Label({ children, color = '#555' }) {
  return (
    <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.22em', color, marginBottom: 14 }}>
      {children}
    </div>
  )
}

function Heading({ children, color = C.cream, size = 'clamp(32px,7vw,56px)' }) {
  return (
    <div style={{ fontFamily: ANTON, color, fontSize: size, lineHeight: 0.92, marginBottom: 20 }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(239,230,220,0.07)', margin: '72px 0' }} />
}

// ─── System flow diagram ──────────────────────────────────────────────────────
function FlowArrow({ label, color = '#444', vertical = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: vertical ? '8px 0' : '0 8px', flexShrink: 0 }}>
      {label && <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color, letterSpacing: '0.16em' }}>{label}</span>}
      <div style={{ width: vertical ? 1 : 24, height: vertical ? 24 : 1, background: '#333' }} />
      <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid #444` }} />
    </div>
  )
}

function FlowNode({ label, sub, color = C.cream, accent = C.accent, dim = false, small = false }) {
  return (
    <div style={{
      padding: small ? '7px 12px' : '10px 16px',
      background: dim ? 'transparent' : C.card,
      border: `1px solid ${dim ? '#2a2525' : accent + '55'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      minWidth: small ? 80 : 120,
    }}>
      <div style={{ fontFamily: ANTON, fontSize: small ? 10 : 12, color: dim ? '#444' : color, letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.2 }}>{label}</div>
      {sub && <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 9, color: '#555', letterSpacing: '0.08em', textAlign: 'center' }}>{sub}</div>}
    </div>
  )
}

function FlowDiamond({ label, color = C.gold }) {
  return (
    <div style={{ position: 'relative', width: 110, height: 52, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: C.card, border: `1px solid ${color}55`,
        transform: 'rotate(0deg) skewX(-12deg)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: ANTON, fontSize: 10, color, letterSpacing: '0.12em', textAlign: 'center' }}>{label}</span>
      </div>
    </div>
  )
}

function SystemFlow() {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ minWidth: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        {/* Entry nodes */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FlowNode label="MODE SELECT" sub="Single / Multiplayer" accent={C.accent} />
            <FlowArrow />
            <FlowNode label="PLAYER SETUP" sub="Name · Avatar · Type" accent={C.teal} />
            <FlowArrow />
            <FlowNode label="CUSTOM TRAITS" sub="Optional" accent={C.gold} dim />
            <FlowArrow label="START" color={C.accent} />

            {/* 7-round loop box */}
            <div style={{ border: `1px dashed ${C.accent}44`, padding: '14px 16px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: -9, left: 12, background: C.bg, padding: '0 6px', fontFamily: WS, fontWeight: 700, fontSize: 8, color: C.accent, letterSpacing: '0.18em' }}>ROUND 1–7</div>

              {/* Deciding phase */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <FlowNode label="DECIDING" sub="Player views profile" accent={C.cream} small />
                </div>

                {/* Action options */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { label: '♥ DATE',        color: C.accent },
                    { label: '◌ GHOST',        color: '#555' },
                    { label: '⚡ STEAL',       color: C.gold },
                    { label: '♥♥ DOUBLE',      color: C.accent },
                    { label: '🔍 STALK',       color: C.teal },
                  ].map(({ label, color }) => (
                    <div key={label} style={{ padding: '4px 8px', border: `1px solid ${color}55`, background: `${color}10` }}>
                      <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color, letterSpacing: '0.1em' }}>{label}</span>
                    </div>
                  ))}
                </div>

                <FlowArrow />
                <FlowNode label="REVEALING" sub="Traits unlock one by one" accent={C.velvet} color={C.cream} small />
                <FlowArrow />
                <FlowNode label="SCORED" sub="Score popup · Therapy option" accent={C.teal} color={C.teal} small />
              </div>
            </div>

            <FlowArrow label="AFTER 7" color="#555" />

            {/* Branching */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              {/* Qualified branch */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlowNode label="THE ONE" sub="Score ≥ 10 + ♥ alive" accent={C.gold} color={C.gold} />
                <FlowArrow />
                <FlowDiamond label="TIE?" color={C.gold} />
                <div style={{ display: 'flex', gap: 8, marginTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FlowArrow label="YES" color={C.gold} />
                    <FlowNode label="TIEBREAKER" sub="Speed dating" accent={C.gold} small />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FlowArrow label="NO" color="#555" />
                    <FlowNode label="RESULTS" accent={C.teal} color={C.teal} small />
                  </div>
                </div>
              </div>
              {/* No qualify */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.14em', marginBottom: 8 }}>NO QUALIFY</div>
                <FlowNode label="RESULTS" accent={C.teal} color={C.teal} small />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mechanic card ─────────────────────────────────────────────────────────────
function MechanicCard({ icon, name, desc, tag, color = C.cream }) {
  return (
    <div style={{ background: C.card, border: hair, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div style={{ fontFamily: ANTON, fontSize: 15, color, letterSpacing: '0.08em' }}>{name}</div>
        </div>
        {tag && (
          <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, letterSpacing: '0.16em', color: '#555', border: `1px solid #2a2525`, padding: '2px 7px' }}>{tag}</span>
        )}
      </div>
      <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Player type pill ─────────────────────────────────────────────────────────
function TypePill({ emoji, label, desc }) {
  return (
    <div style={{ background: C.cardAlt, border: hair, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontFamily: ANTON, fontSize: 12, color: C.teal, letterSpacing: '0.14em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.55)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function Swatch({ hex, name, role }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 64, background: hex, border: hex === C.bg ? `1px solid rgba(239,230,220,0.12)` : 'none' }} />
      <div>
        <div style={{ fontFamily: ANTON, fontSize: 12, color: C.cream, letterSpacing: '0.08em' }}>{name}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', marginTop: 2 }}>{hex}</div>
        <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>{role}</div>
      </div>
    </div>
  )
}

// ─── Component states ────────────────────────────────────────────────────────
function StateCol({ name, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {children}
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: '#9a9090', letterSpacing: '0.15em', textAlign: 'center' }}>{name}</div>
    </div>
  )
}

function StatesRow({ label, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#7a7070', letterSpacing: '0.18em', marginBottom: 16, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {children}
      </div>
    </div>
  )
}

function MiniScreen({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 150, background: C.bg, border: `1px solid rgba(239,230,220,0.07)`, overflow: 'hidden' }}>
        {children}
      </div>
      <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 8, color: '#9a9090', letterSpacing: '0.15em' }}>{label}</div>
    </div>
  )
}

function ComponentStates() {
  const WS_BTN = { fontFamily: WS, fontWeight: 700, letterSpacing: '0.12em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }

  return (
    <div>
      {/* PRIMARY CTA */}
      <StatesRow label="Primary CTA — ▶ Play Game">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: C.accent, color: '#fff' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: C.accent, color: '#fff', boxShadow: `0 0 28px rgba(255,77,109,0.55)`, transform: 'scale(1.035)' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: '#cc3d56', color: 'rgba(255,255,255,0.8)', transform: 'scale(0.96)' }}>▶ PLAY</div>
        </StateCol>
        <StateCol name="DISABLED">
          <div style={{ ...WS_BTN, fontSize: 13, padding: '13px 30px', background: '#252020', color: '#3a3535', cursor: 'not-allowed' }}>▶ PLAY</div>
        </StateCol>
      </StatesRow>

      {/* DATE ACTION */}
      <StatesRow label="Game Action — ♥ Date">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}55`, color: C.cream, background: 'transparent' }}>♥ DATE</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}99`, color: C.cream, background: `${C.accent}16`, boxShadow: `0 0 14px rgba(255,77,109,0.18)` }}>♥ DATE</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid ${C.accent}`, color: '#fff', background: C.accent, transform: 'scale(0.96)' }}>♥ DATE</div>
        </StateCol>
        <StateCol name="DISABLED (no hearts)">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #2a2525`, color: '#333', background: 'transparent', cursor: 'not-allowed' }}>♥ DATE</div>
        </StateCol>
      </StatesRow>

      {/* GHOST ACTION */}
      <StatesRow label="Game Action — ◌ Ghost">
        <StateCol name="DEFAULT">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #3a3535`, color: '#888', background: 'transparent' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #555`, color: '#aaa', background: '#1a1818' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="ACTIVE / PRESSED">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #666`, color: '#ccc', background: '#222', transform: 'scale(0.96)' }}>◌ GHOST</div>
        </StateCol>
        <StateCol name="DISABLED (0 left)">
          <div style={{ ...WS_BTN, fontSize: 12, padding: '10px 20px', border: `1px solid #1e1a1b`, color: '#2a2525', background: 'transparent', cursor: 'not-allowed' }}>◌ GHOST</div>
        </StateCol>
      </StatesRow>

      {/* STALK TOKENS */}
      <StatesRow label="Token Chip — 🔍 Stalk (3 per game)">
        <StateCol name="FULL (3 / 3)">
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ padding: '6px 11px', background: `${C.gold}16`, border: `1px solid ${C.gold}55`, fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold }}>🔍</div>)}
          </div>
        </StateCol>
        <StateCol name="PARTIAL (1 / 3)">
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ padding: '6px 11px', background: `${C.gold}16`, border: `1px solid ${C.gold}55`, fontFamily: WS, fontWeight: 700, fontSize: 10, color: C.gold }}>🔍</div>
            {[1,2].map(i => <div key={i} style={{ padding: '6px 11px', background: 'transparent', border: `1px solid #2a2525`, fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#2a2525' }}>◇</div>)}
          </div>
        </StateCol>
        <StateCol name="DEPLETED (0 / 3)">
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ padding: '6px 11px', background: 'transparent', border: `1px solid #1e1a1b`, fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#2a2525' }}>◇</div>)}
          </div>
        </StateCol>
      </StatesRow>

      {/* ONE-USE TOKENS */}
      <StatesRow label="One-Use Token — ⚡ Steal / 🛋️ Therapy">
        <StateCol name="AVAILABLE">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: `${C.gold}12`, border: `1px solid ${C.gold}44`, color: C.gold }}>⚡ STEAL</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: `${C.gold}22`, border: `1px solid ${C.gold}88`, color: C.gold, boxShadow: `0 0 12px rgba(228,196,106,0.18)` }}>⚡ STEAL</div>
        </StateCol>
        <StateCol name="USED / DISABLED">
          <div style={{ ...WS_BTN, fontSize: 11, padding: '9px 18px', background: 'transparent', border: `1px solid #1e1a1b`, color: '#2a2525', cursor: 'not-allowed' }}>⚡ STEAL</div>
        </StateCol>
      </StatesRow>

      {/* NAV TEXT BUTTON */}
      <StatesRow label="Nav / Text Button — ← Back">
        <StateCol name="DEFAULT">
          <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.38)', letterSpacing: '0.04em', padding: '6px 0', cursor: 'pointer' }}>← Back to Work</div>
        </StateCol>
        <StateCol name="HOVER">
          <div style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.85)', letterSpacing: '0.04em', padding: '6px 0', cursor: 'pointer' }}>← Back to Work</div>
        </StateCol>
      </StatesRow>

      {/* SCREEN STATES */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#444', letterSpacing: '0.18em', marginBottom: 20, textTransform: 'uppercase' }}>Screen States</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* DECIDING */}
          <MiniScreen label="DECIDING">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7, color: C.accent, letterSpacing: '0.1em' }}>ROUND 3</div>
              <div style={{ fontFamily: WS, fontSize: 8, color: '#666' }}>♥ ♥ ♥</div>
            </div>
            <div style={{ margin: '7px 7px 0', background: C.card, padding: '7px 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.cream, marginBottom: 4 }}>ALEX M.</div>
              <div style={{ height: 1, background: 'rgba(239,230,220,0.07)', marginBottom: 5 }} />
              {[{t:'Texts back quickly',v:'+1',c:C.teal},{t:'Ugly laughs freely',v:'+2',c:C.teal}].map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:3, paddingLeft:3, borderLeft:`2px solid ${r.c}` }}>
                  <span style={{ fontFamily:WS, fontSize:6.5, color:'rgba(239,230,220,0.55)' }}>{r.t}</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:6.5, color:r.c }}>{r.v}</span>
                </div>
              ))}
              {[1,2,3,4].map(i=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:3, paddingLeft:3, borderLeft:`2px solid #2a2525` }}>
                  <span style={{ fontFamily:WS, fontSize:6.5, color:'#2a2525' }}>?????</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:6.5, color:'#2a2525' }}>?</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'5px 7px 7px', display:'flex', gap:4 }}>
              <div style={{ flex:1, padding:'4px 0', border:`1px solid ${C.accent}55`, textAlign:'center', fontFamily:WS, fontWeight:700, fontSize:6.5, color:C.cream }}>♥ DATE</div>
              <div style={{ flex:1, padding:'4px 0', border:`1px solid #3a3535`, textAlign:'center', fontFamily:WS, fontWeight:700, fontSize:6.5, color:'#666' }}>◌ GHOST</div>
            </div>
          </MiniScreen>

          {/* SCORED */}
          <MiniScreen label="SCORED">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7, color: C.accent, letterSpacing: '0.1em' }}>ROUND 3</div>
              <div style={{ fontFamily: WS, fontSize: 8, color: '#666' }}>♥ ♥ ♥</div>
            </div>
            <div style={{ margin: '7px 7px 0', background: C.cardAlt, border: `1px solid ${C.teal}44`, padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 26, color: C.teal, lineHeight: 1 }}>+3</div>
              <div style={{ fontFamily: WS, fontSize: 6.5, color: 'rgba(239,230,220,0.45)', marginTop: 3, letterSpacing: '0.1em' }}>TOTAL: 9 PTS</div>
            </div>
            <div style={{ margin: '5px 7px 7px', background: C.card, padding: '6px 7px' }}>
              {[{t:'Texts back quickly',v:'+1',c:C.teal},{t:'Gets jealous easily',v:'−2',c:C.accent},{t:'Ugly laughs freely',v:'+2',c:C.teal},{t:'Cancels plans often',v:'−1',c:C.gold}].map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:3, paddingLeft:3, borderLeft:`2px solid ${r.c}` }}>
                  <span style={{ fontFamily:WS, fontSize:6.5, color:'rgba(239,230,220,0.55)' }}>{r.t}</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:6.5, color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
          </MiniScreen>

          {/* THE ONE */}
          <MiniScreen label="THE ONE">
            <div style={{ background: C.velvet, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.gold, letterSpacing: '0.14em', marginBottom: 2 }}>💘 THE ONE</div>
              <div style={{ fontFamily: WS, fontSize: 6.5, color: 'rgba(239,230,220,0.45)', letterSpacing: '0.1em' }}>LEGENDARY PROFILE</div>
            </div>
            <div style={{ height: 1, background: `${C.gold}33` }} />
            <div style={{ margin: '7px 7px 0', background: 'rgba(0,0,0,0.3)', padding: '7px 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 8, color: C.gold, marginBottom: 5 }}>JORDAN ★</div>
              {[{t:'Makes you feel seen',v:'+3',c:C.teal},{t:'Remembers everything',v:'+2',c:C.teal},{t:'?????',v:'?',c:'#3a3535'}].map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:3, paddingLeft:3, borderLeft:`2px solid ${r.c}` }}>
                  <span style={{ fontFamily:WS, fontSize:6.5, color:'rgba(239,230,220,0.55)' }}>{r.t}</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:6.5, color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ margin: '5px 7px 7px', padding: '5px', background: C.gold, textAlign: 'center', fontFamily: ANTON, fontSize: 7.5, color: '#131011', letterSpacing: '0.1em' }}>♥ DATE THE ONE</div>
          </MiniScreen>

          {/* RESULTS */}
          <MiniScreen label="RESULTS">
            <div style={{ height: 26, background: C.card, borderBottom: `1px solid rgba(239,230,220,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
              <div style={{ fontFamily: ANTON, fontSize: 7.5, color: C.cream, letterSpacing: '0.1em' }}>FINAL RESULTS</div>
            </div>
            <div style={{ padding: '7px 10px' }}>
              {[{n:'Maya',p:24,r:'🥇'},{n:'Jordan',p:18,r:'🥈'},{n:'Alex',p:11,r:'🥉'}].map((p,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 0', borderBottom:i<2?`1px solid rgba(239,230,220,0.06)`:'none' }}>
                  <span style={{ fontSize:8 }}>{p.r}</span>
                  <span style={{ fontFamily:WS, fontWeight:700, fontSize:7.5, color:C.cream, flex:1 }}>{p.n}</span>
                  <span style={{ fontFamily:ANTON, fontSize:9, color:i===0?C.gold:C.cream }}>{p.p}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:'0 8px 8px', display:'flex', gap:4, flexWrap:'wrap' }}>
              {['🎣','👻','⚡'].map(e=>(
                <div key={e} style={{ padding:'2px 5px', background:C.cardAlt, border:`1px solid ${C.gold}33`, fontSize:8 }}>{e}</div>
              ))}
            </div>
          </MiniScreen>

        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TheCatchCaseStudy({ onClose, onPlay, onPlayOnline }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: C.bg, fontFamily: WS }}>

      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 56,
        background: 'rgba(19,16,17,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: hair,
      }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.04em' }}>
          ← Back to Work
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: ANTON, color: C.accent, fontSize: 14, letterSpacing: '0.14em', pointerEvents: 'none' }}>THE CATCH</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onPlayOnline && (
            <button onClick={onPlayOnline} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: C.accent, background: 'transparent', border: `1px solid ${C.accent}44`, padding: '8px 14px', cursor: 'pointer' }}>
              ↗ ONLINE
            </button>
          )}
          <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: '#fff', background: C.accent, border: 'none', padding: '8px 18px', cursor: 'pointer' }}>
            ▶ PLAY
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: C.bg, paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(239,230,220,0.06) 1px, transparent 1px)`, backgroundSize: '20px 20px', pointerEvents: 'none' }} />
        {/* Scanline */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '30%', background: `linear-gradient(to bottom, transparent, rgba(255,77,109,0.04), transparent)`, animation: 'catch-scan 6s linear infinite' }} />
        </div>
        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: C.accent, animation: 'catch-bar-glow 3s ease-in-out infinite' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(76px,16vw,140px)', color: C.accent, lineHeight: 0.85, marginBottom: 0 }}>THE</div>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(76px,16vw,140px)', color: C.cream, lineHeight: 0.85, marginBottom: 28 }}>CATCH</div>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 'clamp(13px,2vw,17px)', color: 'rgba(239,230,220,0.45)', letterSpacing: '0.14em', marginBottom: 36 }}>
            SAME RULES. LOUDER CONSEQUENCES.
          </p>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              ['TYPE', 'Game Design'],
              ['PLATFORM', 'Web / Mobile'],
              ['STACK', 'React + Vite'],
              ['YEAR', '2025'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '6px 14px', border: hair, background: C.card }}>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#555', letterSpacing: '0.18em' }}>{k}: </span>
                <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.cream, letterSpacing: '0.1em' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onPlay} style={{
              fontFamily: WS, fontWeight: 700, fontSize: 15, letterSpacing: '0.14em',
              color: '#fff', background: C.accent, border: 'none',
              padding: '16px 40px', cursor: 'pointer',
              boxShadow: `0 0 40px rgba(255,77,109,0.35)`,
            }}>
              ▶ PLAY SOLO
            </button>
            {onPlayOnline && (
              <button onClick={onPlayOnline} style={{
                fontFamily: WS, fontWeight: 700, fontSize: 15, letterSpacing: '0.14em',
                color: C.accent, background: 'transparent',
                border: `1px solid ${C.accent}55`, padding: '16px 40px', cursor: 'pointer',
              }}>
                ↗ PLAY ONLINE
              </button>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="/thecatch/rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em',
              color: 'rgba(239,230,220,0.35)', textDecoration: 'none', borderBottom: `1px solid rgba(239,230,220,0.12)`,
              paddingBottom: 2,
            }}>
              ↓ DOWNLOAD RULEBOOK PDF
            </a>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ paddingTop: 80, paddingBottom: 120 }}>

        {/* Overview */}
        <Section>
          <Label color={C.accent}>01 — OVERVIEW</Label>
          <Heading>A dating sim where<br />every flag counts.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(239,230,220,0.65)', lineHeight: 1.75, maxWidth: 640 }}>
            The Catch is an interactive game built into my portfolio — a fully custom React game engine disguised as a Hinge-style dating sim. Players swipe through profiles, reading visible green flags and hidden red ones, deciding who to date and who to ghost. The twist: every trait has a numeric value, every decision has real consequences, and nothing plays out the same twice.
          </p>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 'clamp(14px,2vw,17px)', color: 'rgba(239,230,220,0.65)', lineHeight: 1.75, maxWidth: 640, marginTop: 20 }}>
            The project started as a question: what if a portfolio piece could be both a design artefact <em>and</em> the thing it's demonstrating? The Catch is a fully shipped game with two modes — solo (you vs. AI opponents) and live online multiplayer where everyone joins from their own device via WebRTC — plus achievements, a catfish mechanic, and six player personalities, all running in the browser with no backend.
          </p>
        </Section>

        <Divider />

        {/* Problem & Brief */}
        <Section>
          <Label color={C.accent}>02 — THE BRIEF</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE CHALLENGE</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                Build something that demonstrates interaction design, visual identity, and systems thinking — all at once. No mockups. No static screens. A live, playable artifact.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.teal}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE APPROACH</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                Design a game with a complete visual identity, a state machine game engine, and enough depth to replay multiple times. Every mechanic should feel intentional — not just functional, but expressive.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.gold}44`, padding: '28px 24px' }}>
              <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 12, letterSpacing: '0.18em', marginBottom: 12 }}>THE CONSTRAINT</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.7)', lineHeight: 1.7, margin: 0 }}>
                It had to run entirely client-side. No backend, no database. All state managed in a single reducer. For online multiplayer, it had to stay in sync across separate devices with no server — just peer-to-peer WebRTC.
              </p>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Competitive Landscape */}
        <Section>
          <Label color={C.accent}>03 — COMPETITIVE LANDSCAPE</Label>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 32 }}>
            Two existing games occupy the dating-game space — one narrative, one IP-driven. The Catch sits in neither category.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>

            {/* Fog of Love */}
            <div style={{ background: C.card, border: `1px solid rgba(239,230,220,0.1)`, padding: '24px 22px' }}>
              <img src="/competitors/fog-of-love.jpg" alt="Fog of Love box art" style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'center top', display: 'block', marginBottom: 18 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 16, letterSpacing: '0.08em' }}>FOG OF LOVE</div>
                  <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em', marginTop: 3 }}>2019 · HUSH HUSH PROJECTS</div>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#9a9090', letterSpacing: '0.15em', border: '1px solid #3a3535', padding: '4px 9px' }}>PHYSICAL</div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                {[['2', 'PLAYERS'], ['40–90', 'MINUTES'], ['$40', 'COST']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 14 }}>{val}</div>
                    <div style={{ fontFamily: WS, fontSize: 9, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.15em', marginBottom: 8 }}>STRENGTHS</div>
                {['Rich narrative roleplay — you live a full relationship arc', 'Deep emotional mechanics, high replayability', 'Beautifully crafted physical component'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.teal, fontSize: 11, lineHeight: 1.5 }}>+</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.15em', marginBottom: 8 }}>GAPS</div>
                {['Exactly 2 players — no group or solo play', 'Long sessions; heavy rulebook, high barrier to entry', 'Physical only, requires purchase (~$40)'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.accent, fontSize: 11, lineHeight: 1.5 }}>–</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Bachelor */}
            <div style={{ background: C.card, border: `1px solid rgba(239,230,220,0.1)`, padding: '24px 22px' }}>
              <div style={{ width: '100%', height: 180, marginBottom: 18, background: 'linear-gradient(135deg, #1a0a0f 0%, #2d0e18 50%, #1a0a0f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(180,20,60,0.18) 0%, transparent 70%)' }} />
                <div style={{ fontSize: 40, lineHeight: 1 }}>🌹</div>
                <div style={{ fontFamily: ANTON, color: '#e8c4c4', fontSize: 13, letterSpacing: '0.3em', textAlign: 'center' }}>THE BACHELOR</div>
                <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 9, color: 'rgba(232,196,196,0.45)', letterSpacing: '0.2em' }}>BOARD GAME</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 16, letterSpacing: '0.08em' }}>THE BACHELOR</div>
                  <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em', marginTop: 3 }}>2018 · IMAGINATION GAMING</div>
                </div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: '#9a9090', letterSpacing: '0.15em', border: '1px solid #3a3535', padding: '4px 9px' }}>PHYSICAL</div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                {[['3–7', 'PLAYERS'], ['30–60', 'MINUTES'], ['$25', 'COST']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: ANTON, color: C.cream, fontSize: 14 }}>{val}</div>
                    <div style={{ fontFamily: WS, fontSize: 9, color: 'rgba(239,230,220,0.4)', letterSpacing: '0.1em' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.teal, letterSpacing: '0.15em', marginBottom: 8 }}>STRENGTHS</div>
                {['Familiar IP lowers the barrier to entry', 'Party-friendly competitive elimination format', 'Accessible rules, fast to learn'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.teal, fontSize: 11, lineHeight: 1.5 }}>+</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 9, color: C.accent, letterSpacing: '0.15em', marginBottom: 8 }}>GAPS</div>
                {['Passive mimicry of a TV show — no original mechanics', 'No deduction, hidden information, or strategy layer', 'Tied to IP, requires purchase, no digital play'].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: C.accent, fontSize: 11, lineHeight: 1.5 }}>–</span>
                    <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: 'rgba(239,230,220,0.65)', lineHeight: 1.5 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Positioning statement */}
          <div style={{ background: C.cardAlt, border: `1px solid ${C.accent}33`, padding: '20px 22px' }}>
            <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 11, letterSpacing: '0.16em', marginBottom: 10 }}>WHERE THE CATCH FITS</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.7)', margin: 0, lineHeight: 1.7 }}>
              Neither competitor offers free, instant, browser-based play — or any deduction mechanic. The Catch combines the group-competitive format of The Bachelor with original hidden-information mechanics (the catfish, trait reveals, action economy), delivers it free with no setup, and scales from solo to 8-player online multiplayer. It's a new genre of game, not a reskin of an existing one.
            </p>
          </div>
        </Section>

        <Divider />

        {/* Design System */}
        <Section>
          <Label color={C.accent}>04 — DESIGN SYSTEM</Label>
          <Heading>After Hours.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            The visual identity was built around late-night tension — dark backgrounds, neon accents, high-contrast typography. Every color carries meaning inside the game logic.
          </p>

          {/* Colors */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>COLOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 16 }}>
              <Swatch hex={C.bg}     name="MIDNIGHT"  role="Background" />
              <Swatch hex={C.accent} name="NEON RED"   role="Danger · Date" />
              <Swatch hex={C.teal}   name="MINT"       role="Safe · Positive" />
              <Swatch hex={C.gold}   name="GOLD"       role="The One · Premium" />
              <Swatch hex={C.cream}  name="CREAM"      role="Primary text" />
              <Swatch hex={C.velvet} name="VELVET"     role="The One screen" />
            </div>
          </div>

          {/* Typography */}
          <div>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 20 }}>TYPOGRAPHY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '20px 24px', background: C.card, border: hair, display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: ANTON, fontSize: 48, color: C.cream, lineHeight: 1, flexShrink: 0 }}>CATCH</div>
                <div>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.18em' }}>ANTON — DISPLAY</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 4 }}>Headlines · Scores · Action labels · Game titles</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', background: C.card, border: hair, display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 22, color: C.cream, lineHeight: 1, flexShrink: 0 }}>THE SELECTIVE</div>
                <div>
                  <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: '0.18em' }}>WORK SANS — BODY</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#555', marginTop: 4 }}>UI labels · Trait text · Descriptions · All caps tags</div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Component States */}
        <Section>
          <Label color={C.accent}>05 — COMPONENT STATES</Label>
          <Heading>Every element,<br />every state.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            All interactive elements were designed with four distinct states: Default, Hover, Active/Pressed, and Disabled. State transitions communicate system feedback through color shifts, glow intensity, and scale — keeping players oriented without UI clutter.
          </p>
          <ComponentStates />
        </Section>

        <Divider />

        {/* System Flow */}
        <Section>
          <Label color={C.accent}>06 — SYSTEM FLOW</Label>
          <Heading>How the state<br />machine works.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            The entire game runs on a single <code style={{ fontFamily: 'monospace', background: C.cardAlt, padding: '2px 6px', fontSize: 12, color: C.teal }}>useReducer</code>. Every screen transition, score update, and mechanic is a dispatched action. Below is the full game state graph.
          </p>
          <SystemFlow />

          {/* State table */}
          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#9a9090', marginBottom: 16 }}>KEY STATE FIELDS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {[
                { field: 'screen', desc: 'Active view (mode_select, round, the_one, results…)' },
                { field: 'roundPhase', desc: 'deciding → pass_device → revealing → scored' },
                { field: 'roundDecisions', desc: 'Map of playerId → {action, stalkedIdxs}' },
                { field: 'revealStep', desc: 'Index of the currently-revealed hidden trait' },
                { field: 'players[]', desc: 'Full player state: score, hearts, tokens, achievements' },
                { field: 'profiles[]', desc: 'Generated fresh every game, includes 1 catfish' },
                { field: 'qualifiedIds', desc: 'Players who hit score ≥ 10 to face The One' },
                { field: 'customTraits', desc: 'Player-added traits injected into profile generation' },
              ].map(({ field, desc }) => (
                <div key={field} style={{ padding: '12px 14px', background: C.cardAlt, border: hair }}>
                  <code style={{ fontFamily: 'monospace', fontSize: 11, color: C.teal, display: 'block', marginBottom: 4 }}>{field}</code>
                  <div style={{ fontFamily: WS, fontWeight: 400, fontSize: 11, color: 'rgba(239,230,220,0.6)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Figma downloads */}
          <div style={{ marginTop: 40, padding: '20px 22px', background: C.card, border: `1px solid ${C.gold}33`, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: ANTON, fontSize: 11, color: C.gold, letterSpacing: '0.16em' }}>FIGMA-EDITABLE FILES</div>
            <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.55)', margin: 0, lineHeight: 1.6 }}>
              Both SVG files below import into Figma as fully editable vector layers — every node, label, and color is adjustable. File → Import in Figma, or drag-and-drop into any frame.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/thecatch/system-flow.svg" download="TheCatch-SystemFlow.svg" style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: C.gold, border: `1px solid ${C.gold}44`, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
                ↓ SYSTEM FLOW SVG
              </a>
              <a href="/thecatch/design-system.svg" download="TheCatch-DesignSystem.svg" style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: C.gold, border: `1px solid ${C.gold}44`, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
                ↓ DESIGN SYSTEM SVG
              </a>
            </div>
          </div>
        </Section>

        <Divider />

        {/* Profile generation */}
        <Section>
          <Label color={C.accent}>07 — PROFILE GENERATION</Label>
          <Heading>No two games<br />play the same.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Every game generates 7 profiles procedurally from a pool of 65 real dating behaviors. Each profile gets 6 traits — 2 visible on load, 4 hidden behind stalk tokens. Trait extremity determines visibility order.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ background: C.card, border: `1px solid ${C.teal}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.teal, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>TRAIT CATEGORIES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Green Flags', 'value +1 to +3', C.teal],
                  ['Yellow Flags', 'value 0 to −1', C.gold],
                  ['Red Flags', 'value −2 to −3', C.accent],
                ].map(([label, range, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: hair }}>
                    <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, color }}>{label}</span>
                    <span style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555' }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.accent, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>🪝 THE CATFISH</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>
                One catfish is injected into every game at a random position (rounds 1–5). Visible traits are all positive. Hidden traits are all −3. Dating them costs −4 extra. Ghosting them earns +1 and the "Catfish Dodger" achievement.
              </p>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.gold}44`, padding: '22px 20px' }}>
              <div style={{ fontFamily: ANTON, color: C.gold, fontSize: 11, letterSpacing: '0.18em', marginBottom: 10 }}>💘 THE ONE</div>
              <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.6, margin: 0 }}>
                A legendary profile with a 1% drop rate vibe. Only players who scored ≥ 10 points and kept at least one heart get to face them. Their hidden trait is worth +5 — enough to flip the entire game.
              </p>
            </div>
          </div>

          {/* Trait example */}
          <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', color: '#555', marginBottom: 12 }}>TRAIT EXAMPLE — VISIBLE VS HIDDEN</div>
          <div style={{ background: C.card, border: hair, overflow: 'hidden' }}>
            {[
              { text: 'Texts back within a reasonable amount of time', value: 1, visible: true },
              { text: 'Will ugly laugh with you and not care how they look', value: 2, visible: true },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
              { text: '?????', value: null, visible: false },
            ].map((t, i) => {
              const color = !t.visible ? '#2a2525' : t.value > 0 ? C.teal : C.accent
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderLeft: `3px solid ${color}`, borderBottom: i < 5 ? hair : 'none' }}>
                  <span style={{ fontFamily: WS, fontWeight: t.visible ? 400 : 300, fontSize: 13, color: t.visible ? C.cream : '#3a3535', flex: 1, lineHeight: 1.3 }}>{t.text}</span>
                  <span style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, color: t.visible ? color : '#3a3535', minWidth: 28, textAlign: 'right' }}>
                    {t.visible ? (t.value > 0 ? `+${t.value}` : t.value) : '?'}
                  </span>
                </div>
              )
            })}
          </div>
        </Section>

        <Divider />

        {/* Mechanics */}
        <Section>
          <Label color={C.accent}>08 — GAME MECHANICS</Label>
          <Heading>Every action<br />has a cost.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Each mechanic was designed to create meaningful decisions with real tradeoffs — not just UI controls.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            <MechanicCard icon="♥" name="DATE" color={C.accent} tag="CORE"
              desc="Score the profile's traits. Positive totals earn points. Negative totals cost you a heart. If you date a catfish you get hit with a −4 penalty on top." />
            <MechanicCard icon="◌" name="GHOST" color="#888" tag="CORE"
              desc="Skip the round. No points, no hearts lost. You only have 3 ghosts per game — spend them wisely. Ghosting a catfish earns +1 bonus point." />
            <MechanicCard icon="🔍" name="STALK" color={C.gold} tag="INTEL"
              desc="Reveal one hidden trait early. Costs a stalk token. You start with 3. Use them to make a more informed call before committing." />
            <MechanicCard icon="⚡" name="STEAL" color={C.gold} tag="MULTIPLAYER"
              desc="Take 3 points directly from the current leader. One-time use. Earns the Smooth Criminal achievement. Works on NPCs too." />
            <MechanicCard icon="♥♥" name="DOUBLE DATE" color={C.accent} tag="MULTIPLAYER"
              desc="Both players go on the date together and split the score. Lower risk, lower reward. If only one person picks it, it reverts to a regular date." />
            <MechanicCard icon="🛋️" name="THERAPY" color={C.velvet} tag="RECOVERY"
              desc="Use after a rough round. Auto-skip next round, then roll 50/50 for +4 or +0. One use per game. Worth it when you're in a hole." />
          </div>
        </Section>

        <Divider />

        {/* Player types */}
        <Section>
          <Label color={C.accent}>09 — PLAYER TYPES</Label>
          <Heading>Who you are<br />changes the math.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            Each player type applies a different scoring adjustment to every trait value. The same profile can score completely differently depending on who's reading it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            <TypePill emoji="💘" label="THE ROMANTIC"
              desc="Green flags hit harder. Any positive trait gets +1. You fall fast and you score for it — until you don't." />
            <TypePill emoji="🎯" label="THE SELECTIVE"
              desc="Red flags cost double. Any negative trait loses 1 more. Your standards are a feature, not a bug." />
            <TypePill emoji="🔥" label="THE CHAOTIC ONE"
              desc="Red flags barely sting. Negative traits get +2 forgiveness. Boring is the only dealbreaker." />
            <TypePill emoji="🌀" label="THE OVERTHINKER"
              desc="Yellow flags become red flags. −1 traits become −3. Patterns are everywhere. Your gut is always right." />
            <TypePill emoji="🚪" label="THE AVOIDANT"
              desc="Too intense is a red flag. Traits of +3 or worse drop by 1. Traits of −2 or worse also drop. Space is your love language." />
            <TypePill emoji="💰" label="THE GOLD DIGGER"
              desc="Stability pays. Strong positives (+2 and above) score +1 more. Strong negatives hurt worse. The math maths." />
          </div>
        </Section>

        <Divider />

        {/* Achievements */}
        <Section>
          <Label color={C.accent}>10 — ACHIEVEMENTS</Label>
          <Heading>Rewarding<br />the story, not just the score.</Heading>
          <p style={{ fontFamily: WS, fontWeight: 300, fontSize: 14, color: 'rgba(239,230,220,0.55)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
            11 achievements track behaviors across a full game. They toast during play and appear on the results screen — turning each run into a story you can share.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {[
              ['🎣', 'CATFISH DODGER', 'Ghost the catfish'],
              ['🪝', 'GOT CATFISHED', 'Date the catfish'],
              ['👻', 'GHOST MASTER', 'Use all 3 ghosts'],
              ['🔥', 'CHAOS ENJOYER', 'Date multiple red flags'],
              ['🚩', 'RED FLAG RADAR', 'Spot the pattern early'],
              ['🛋️', 'THERAPIZED', 'Use the therapy action'],
              ['⚡', 'SMOOTH CRIMINAL', 'Successfully steal points'],
              ['♥♥', 'DOUBLE DATER', 'Both players pick double date'],
              ['💘', 'FOUND THE ONE', 'Win at The One round'],
              ['💔', 'UNMATCHED', 'Lose at The One round'],
              ['☠️', 'NO SURVIVORS', 'Every date was a red flag'],
            ].map(([emoji, title, trigger]) => (
              <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: C.cardAlt, border: hair }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <div style={{ fontFamily: ANTON, fontSize: 10, color: C.gold, letterSpacing: '0.1em', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 11, color: '#555', lineHeight: 1.4 }}>{trigger}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Design decisions */}
        <Section>
          <Label color={C.accent}>11 — DESIGN DECISIONS</Label>
          <Heading>What I'd<br />do differently.</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: 'Why reveal traits automatically instead of on-tap?',
                a: 'The original version required tapping each hidden trait. It felt like work. The auto-reveal creates a rhythm — you watch the profile unfold. The tension of waiting is the mechanic.',
              },
              {
                q: 'Why put the score popup before the full breakdown?',
                a: 'Playtesting showed players were looking for their result first, then reading the context. Leading with the number (large, glowing) lets the emotion land, then the breakdown gives it meaning.',
              },
              {
                q: 'Why a single reducer instead of multiple state slices?',
                a: 'The game has deeply interdependent state — player scores, round decisions, active mechanics, and screen transitions all interact. A single reducer keeps every transition explicit and auditable with no hidden side effects.',
              },
              {
                q: 'Why phone-width on desktop?',
                a: "The game is built to feel like a phone app. Keeping the viewport at 390px max enforces the social context — it always feels like something on your phone, not something filling a monitor. In online multiplayer, everyone is literally on their own device.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '22px 24px', background: C.card, border: hair, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: WS, fontWeight: 700, fontSize: 13, color: C.cream, lineHeight: 1.4 }}>↳ {q}</div>
                <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 13, color: 'rgba(239,230,220,0.6)', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* CTA */}
        <Section style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,10vw,80px)', color: C.cream, lineHeight: 0.9, marginBottom: 6 }}>READY TO</div>
          <div style={{ fontFamily: ANTON, fontSize: 'clamp(48px,10vw,80px)', color: C.accent, lineHeight: 0.9, marginBottom: 32 }}>PLAY?</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button onClick={onPlay} style={{
              fontFamily: WS, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em',
              color: '#fff', background: C.accent, border: 'none',
              padding: '18px 48px', cursor: 'pointer',
              boxShadow: `0 0 48px rgba(255,77,109,0.4)`,
            }}>
              ▶ PLAY SOLO
            </button>
            {onPlayOnline && (
              <button onClick={onPlayOnline} style={{
                fontFamily: WS, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em',
                color: C.accent, background: 'transparent',
                border: `1px solid ${C.accent}55`,
                padding: '18px 48px', cursor: 'pointer',
              }}>
                ↗ ONLINE MULTIPLAYER
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: WS, fontWeight: 300, fontSize: 12, color: '#444', letterSpacing: '0.1em' }}>
              SOLO · ONLINE MULTIPLAYER · 7 ROUNDS · 1% CHANCE AT THE ONE
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <a href="/thecatch/rulebook.pdf" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.14em',
              color: 'rgba(239,230,220,0.35)', textDecoration: 'none',
              border: `1px solid rgba(239,230,220,0.1)`, padding: '8px 20px', display: 'inline-block',
            }}>
              ↓ OFFICIAL RULEBOOK PDF
            </a>
          </div>
        </Section>

      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: hair, padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onClose} style={{ fontFamily: WS, fontWeight: 500, fontSize: 13, color: 'rgba(239,230,220,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.06em' }}>
          ← Back to Portfolio
        </button>
        <div style={{ fontFamily: ANTON, color: '#2a2525', fontSize: 12, letterSpacing: '0.12em' }}>THE CATCH · MAYA WALSH</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onPlayOnline && (
            <button onClick={onPlayOnline} style={{ fontFamily: WS, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: C.accent, background: 'transparent', border: `1px solid ${C.accent}33`, padding: '8px 14px', cursor: 'pointer' }}>
              ↗ ONLINE
            </button>
          )}
          <button onClick={onPlay} style={{ fontFamily: WS, fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', color: C.accent, background: 'transparent', border: `1px solid ${C.accent}55`, padding: '8px 18px', cursor: 'pointer' }}>
            ▶ PLAY
          </button>
        </div>
      </div>

    </div>
  )
}

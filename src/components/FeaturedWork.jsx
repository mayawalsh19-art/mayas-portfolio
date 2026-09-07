import { useState, useRef, useEffect } from 'react'
import CredifyModal from './CredifyModal'
import CoraModal from './CoraModal'
import DutchBrosModal from './DutchBrosModal'
import SelfPortraitModal from './SelfPortraitModal'
import WildFireModal from './WildFireModal'
import HellgrimModal from './HellgrimModal'
import FanFormationModal from './FanFormationModal'
import TheCatchModal from './TheCatchModal'


function Card({ title, desc, link = true, bg = 'bg-white', full = false, onClick, children }) {
  return (
    <div
      onClick={onClick}
      className={[
      'bg-white rounded-2xl overflow-hidden flex flex-col',
      'shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]',
      'md:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]',
      'transition-transform duration-200',
      onClick ? 'cursor-pointer hover:scale-[1.02]' : '',
      full ? 'md:col-span-2' : '',
    ].join(' ')}>
      {/* Preview */}
      <div className={`${bg} flex items-center justify-center h-48 md:h-64 flex-shrink-0`}>
        {children}
      </div>
      {/* Text */}
      <div className="p-5 md:p-6 flex flex-col gap-2">
        <h3 className="font-lexend font-bold text-[#334e6f] text-xl md:text-2xl leading-tight">{title}</h3>
        <p className="font-lexend text-sm md:text-base leading-relaxed text-[rgba(51,78,111,0.7)]">{desc}</p>
        {link && (
          <a href="#" className="font-lexend font-medium text-sm md:text-base text-[#334e6f] mt-1 hover:opacity-70 transition-opacity">
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}

function TheCatchCard({ onClick }) {
  const [hov, setHov] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const INK = '#131011'
  const SMOKE = '#1E1A1B'
  const CREAM = '#EFE6DC'
  const NEON = '#FF4D6D'
  const ANTON = "'Anton', sans-serif"
  const WS = "'Work Sans', sans-serif"

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: '#fff',
        boxShadow: hov
          ? `0 0 0 1px rgba(255,77,109,0.45), 0 20px 60px rgba(255,77,109,0.18), 0 4px 12px rgba(0,0,0,0.5)`
          : '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.5s ease, transform 0.2s ease',
        transform: hov ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* ── Preview area ── */}
      <div style={{ position: 'relative', height: '16rem', overflow: 'hidden', background: INK }}>

        {/* Dot-grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(circle, rgba(239,230,220,0.07) 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '28%',
            background: `linear-gradient(to bottom, transparent, rgba(255,77,109,0.05), transparent)`,
            animation: 'catch-scan 5s linear infinite',
          }} />
        </div>

        {/* Horizontal accent line — left edge, slides in */}
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          height: '1px', width: hov ? '32px' : '0px',
          background: NEON,
          opacity: 0.5,
          transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
          marginTop: '-1px',
        }} />
        <div style={{
          position: 'absolute', top: '50%', right: 0,
          height: '1px', width: hov ? '32px' : '0px',
          background: NEON,
          opacity: 0.5,
          transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
          marginTop: '-1px',
        }} />

        {/* Center text — parent handles hover Y shift */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          transform: hov ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* THE — slides in from left */}
          <div style={{
            fontFamily: ANTON,
            fontSize: 'clamp(62px, 10.5vw, 116px)',
            color: NEON,
            lineHeight: 0.88,
            animation: visible ? 'catch-pulse 3.5s ease-in-out infinite' : 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-48px)',
            transition: 'opacity 0.55s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s',
          }}>THE</div>

          {/* CATCH — slides in from right */}
          <div style={{
            fontFamily: ANTON,
            fontSize: 'clamp(62px, 10.5vw, 116px)',
            color: CREAM,
            lineHeight: 0.88,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(48px)',
            transition: 'opacity 0.55s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}>CATCH</div>
        </div>

        {/* Tagline — slides up from bottom on hover */}
        <div style={{
          position: 'absolute', bottom: 18, left: 0, right: 0,
          textAlign: 'center',
          fontFamily: WS,
          fontWeight: 300,
          fontSize: 10,
          letterSpacing: '0.18em',
          color: `rgba(239,230,220,0.45)`,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.38s ease 0.08s, transform 0.42s cubic-bezier(0.22,1,0.36,1) 0.08s',
        }}>SAME RULES. LOUDER CONSEQUENCES.</div>

        {/* Bottom neon bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px',
          background: NEON,
          animation: 'catch-bar-glow 3s ease-in-out infinite',
          transition: 'opacity 0.4s ease',
        }} />

        {/* PLAY chip — appears on hover, top-right */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '4px 10px',
          background: `rgba(255,77,109,0.12)`,
          border: `1px solid rgba(255,77,109,0.35)`,
          borderRadius: 2,
          fontFamily: WS,
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.14em',
          color: NEON,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.3s ease 0.1s, transform 0.35s cubic-bezier(0.22,1,0.36,1) 0.1s',
        }}>▶ PLAY</div>
      </div>

      {/* ── Label area — matches standard Card style ── */}
      <div className="bg-white p-5 md:p-6 flex flex-col gap-2">
        <h3 className="font-lexend font-bold text-[#334e6f] text-xl md:text-2xl leading-tight">The Catch</h3>
        <p className="font-lexend text-sm md:text-base leading-relaxed text-[rgba(51,78,111,0.7)]">A game design project with a bold, high-contrast visual identity.</p>
      </div>
    </div>
  )
}

export default function FeaturedWork() {
  const [showCredify, setShowCredify] = useState(false)
  const [showCora, setShowCora] = useState(false)
  const [showDutchBros, setShowDutchBros] = useState(false)
  const [showSelfPortrait, setShowSelfPortrait] = useState(false)
  const [showWildFire, setShowWildFire] = useState(false)
  const [showHellgrim, setShowHellgrim] = useState(false)
  const [showFanFormation, setShowFanFormation] = useState(false)
  const [showTheCatch, setShowTheCatch] = useState(false)

  return (
    <>
    {showCredify && <CredifyModal onClose={() => setShowCredify(false)} />}
    {showCora && <CoraModal onClose={() => setShowCora(false)} />}
    {showDutchBros && <DutchBrosModal onClose={() => setShowDutchBros(false)} />}
    {showSelfPortrait && <SelfPortraitModal onClose={() => setShowSelfPortrait(false)} />}
    {showWildFire && <WildFireModal onClose={() => setShowWildFire(false)} />}
    {showHellgrim && <HellgrimModal onClose={() => setShowHellgrim(false)} />}
    {showFanFormation && <FanFormationModal onClose={() => setShowFanFormation(false)} />}
    {showTheCatch && <TheCatchModal onClose={() => setShowTheCatch(false)} />}
    <section id="work" className="bg-[#f2e9da] w-full py-12 md:py-24 px-6 md:px-[74.5px]">
      <h2 className="font-lexend font-black text-[#334e6f] text-[30px] md:text-[48px] leading-none mb-8 md:mb-12">
        Featured Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* Credify */}
        <Card title="Credify" bg="bg-[#ff6900]" link={false}
          onClick={() => setShowCredify(true)}
          desc="A credit app that helps young professionals build credit and reach their personal financial goals.">
          <span className="font-lexend font-black text-white text-[32px] md:text-[48px] leading-none">Credify</span>
        </Card>

        {/* Cora */}
        <Card title="Cora" bg="bg-[#fff6e8]" link={false}
          onClick={() => setShowCora(true)}
          desc="A health app, revolving around a happy heart that helps new and pregnant moms connect with one another.">
          <span
            className="text-[#d85050] leading-none select-none"
            style={{ fontFamily: "'Libre Caslon Display', serif", fontSize: 'clamp(72px, 12vw, 220px)' }}
          >
            cora
          </span>
        </Card>

        {/* Dutch Bros */}
        <Card title="Dutch Bros App Redesign" bg="bg-white" link={false}
          onClick={() => setShowDutchBros(true)}
          desc="Redesigned app to make it more user-friendly for loyal customers.">
          <span className="font-black text-center leading-tight" style={{ fontFamily: "'Futura', 'Century Gothic', sans-serif", color: '#00629c', fontSize: 'clamp(28px, 4vw, 52px)' }}>
            Dutch Bros<br />App Redesign
          </span>
        </Card>

        {/* Self Portrait */}
        <Card title="Self Portrait" bg="bg-[#fad1e3]" link={false}
          onClick={() => setShowSelfPortrait(true)}
          desc="A self portrait icon showing vectorized skills and personality.">
          <div className="self-stretch w-full overflow-hidden">
            <img src="/selfportrait/icon_single.png" alt="Self Portrait" className="w-full h-full object-cover" />
          </div>
        </Card>

        {/* Wild Fire */}
        <Card title="Wild Fire" bg="bg-white" link={false}
          onClick={() => setShowWildFire(true)}
          desc="Wild Fire explores editorial and publication design through the translation of a long-form NYT Magazine article.">
          <div className="flex flex-col items-center leading-none select-none" style={{ gap: '0.05em' }}>
            <span style={{ fontFamily: "'Bely Display', serif", fontSize: 'clamp(52px, 9vw, 108px)', color: '#111', lineHeight: 1 }}>WILD</span>
            <span style={{ fontFamily: "'Bely Display', serif", fontSize: 'clamp(52px, 9vw, 108px)', color: '#cc0000', lineHeight: 1 }}>FIRE</span>
          </div>
        </Card>

        {/* Hellgrim */}
        <Card title="Hellgrim" bg="bg-black" link={false}
          onClick={() => setShowHellgrim(true)}
          desc="Hellgrim explores modular typography through the design of a rule-based typeface.">
          <span className="font-lexend font-black text-white leading-none select-none" style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}>
            hellgrim
          </span>
        </Card>

        {/* Fan Formation — full width on desktop */}
        <Card title="Fan Formation" bg="bg-white" link={false}
          onClick={() => setShowFanFormation(true)}
          desc="Fan Formation is a wearable system that synchronizes crowd energy into a coordinated and inclusive stadium experience.">
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 6vw, 72px)', color: '#334e6f', letterSpacing: '-0.02em' }}>
            Fan Formation
          </span>
        </Card>

        {/* The Catch */}
        <TheCatchCard onClick={() => setShowTheCatch(true)} />

      </div>
    </section>
    </>
  )
}

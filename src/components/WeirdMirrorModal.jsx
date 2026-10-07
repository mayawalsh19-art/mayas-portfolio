import { useEffect, useRef, useState } from 'react'

// Weird Mirror — case study for the interactive TouchDesigner piece.

const INK = '#334e6f'          // site text colour
const KU = '#0051BA'           // KU blue
const NIGHT = '#0b0d14'
const REPO = 'https://github.com/mayawalsh19-art/Walsh-Weird-Mirror-Project'

// A muted, looping clip that only downloads once it scrolls into view (shows a still until then)
function LazyVideo({ src, poster, label }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect() } }, { rootMargin: '200px' })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <video ref={ref} poster={poster} src={show ? src : undefined} autoPlay muted loop playsInline aria-label={label}
      className="w-full rounded-2xl block shadow-[0_4px_24px_rgba(0,0,0,0.12)]" style={{ aspectRatio: '16 / 9', objectFit: 'cover', background: '#0b0d14' }} />
  )
}

function Section({ kicker, title, children, wide = false }) {
  return (
    <section className={`${wide ? 'max-w-5xl' : 'max-w-3xl'} mx-auto px-6 md:px-12 py-12 md:py-16`}>
      {kicker && <p className="font-lexend font-semibold text-sm mb-3" style={{ color: KU }}>{kicker}</p>}
      {title && <h2 className="font-lexend font-black text-[28px] md:text-[40px] leading-[1.1] mb-6" style={{ color: INK }}>{title}</h2>}
      {children}
    </section>
  )
}

const P = ({ children }) => <p className="font-lexend text-base md:text-lg leading-relaxed mb-4" style={{ color: 'rgba(51,78,111,0.85)' }}>{children}</p>

const STEPS = [
  ['/weirdmirror/stills/1-mirror.png', 'You, in sequins', 'Walk up and the screen is a mirror made of 20,000 tiny sequins. Move fast and your pixels lag and break apart.'],
  ['/weirdmirror/stills/2-half.png', 'Swipe to flip', 'Sweep a hand to the right and every sequin it passes flips over. Sweep back and you return.'],
  ['/weirdmirror/stills/3-full.png', 'Become the Jayhawk', 'Underneath is the Jayhawk in Allen Fieldhouse, sized and lined up to your face.'],
  [null, 'Fill it and it comes alive', 'Flip the whole screen and the KU fight song plays. The Jayhawk dances, and when you move its pixels break apart like yours did.'],
]

const HOOD = [
  ['A mirror made of sequins', 'The webcam is mirrored and reduced to a 192 × 108 grid. A shader with feedback remembers which side each sequin shows, and dips it dark mid-flip, like a real sequin turning edge-on.'],
  ['Hands, not bodies', 'Hand and body tracking (MediaPipe) runs in a separate Python program and sends positions to TouchDesigner. Only a hand moving sideways flips sequins; your face never can.'],
  ['Works close up and far away', 'Up close the hand tracker finds open hands. From across the room, a raised wrist from the body tracker stands in. A hand holding a phone doesn’t count.'],
  ['The Jayhawk fits you', 'The body tracker measures your head and shoulders, so the Jayhawk grows as you walk closer, shrinks as you step back, and its eye sits on yours.'],
  ['The payoff', 'At 95% the last gaps flip in by themselves, so the face area never blocks the ending. Then the song plays, a light sweeps the sequins and the Jayhawk dances to the music.'],
  ['Ready for the next stranger', 'After 20 seconds with nobody in front of it, every sequin flips back to the plain mirror.'],
]

const PROCESS = [
  ['Face into fruit', 'The first experiment drew a peach over any face OpenCV found. Fun, but it didn’t ask anything of the person.'],
  ['The sequin swipe', 'The idea that stuck came from flip-sequin shirts: brush one way and a picture appears, brush back and it’s gone.'],
  ['Only hands', 'Motion and skin-colour detection let bodies, heads and tank tops flip sequins. Real hand tracking fixed it, but MediaPipe froze TouchDesigner, so it moved into its own program.'],
  ['Less is more', 'A run of extra rules (deliberate-swipe checks, auto-wipes, thresholds) each tested fine but together made it feel finicky. I rolled back to the simple swipe and changed one thing at a time.'],
  ['A place for the Jayhawk', 'The Jayhawk (from my KU Prints poster) moved into Allen Fieldhouse, learned to dance to the fight song and started fitting itself to whoever is in front of it.'],
]

export default function WeirdMirrorModal({ onClose }) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">

      {/* Sticky nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity">
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: NIGHT }}>
        {/* Allen Fieldhouse fills the hero; the whole Jayhawk always fits on top (dimmed behind the title) */}
        <img src="/weirdmirror/card-fieldhouse.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ imageRendering: 'pixelated', opacity: 0.35 }} />
        <img src="/weirdmirror/card-jayhawk.png" alt="" aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto" style={{ height: '92%', imageRendering: 'pixelated', opacity: 0.45 }} />
        <div className="relative flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
          <p className="font-lexend text-white/60 text-sm mb-5">IXD 415</p>
          <h1 className="font-lexend font-black text-white leading-none mb-4" style={{ fontSize: 'clamp(40px, 8vw, 92px)' }}>Weird Mirror</h1>
          <p className="font-lexend text-white/80 text-base md:text-lg leading-relaxed max-w-xl mb-8">
            An interactive mirror made of sequins. Swipe your hand across your reflection and turn into the Jayhawk.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['Interactive Installation', 'TouchDesigner', 'Computer Vision'].map(tag => (
              <span key={tag} className="font-lexend text-xs font-semibold px-3 py-1 rounded-full bg-white" style={{ color: KU }}>{tag}</span>
            ))}
          </div>
          <a href={REPO} target="_blank" rel="noopener noreferrer"
            className="font-lexend font-semibold text-sm text-white mt-8 px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
            View the project on GitHub ↗
          </a>
        </div>
      </div>

      {/* Documentation video */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 md:pt-16">
        {/* Final demo: vertical phone video with sound; only downloads when played */}
        <div className="flex flex-col items-center">
          <video src="/weirdmirror/video/weird-mirror-demo.mp4" poster="/weirdmirror/video/weird-mirror-demo-poster.jpg"
            controls playsInline preload="none" aria-label="Weird Mirror final demo"
            className="block rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.18)] bg-black"
            style={{ height: 'min(78vh, 760px)', aspectRatio: '9 / 16', maxWidth: '100%', objectFit: 'contain' }} />
          <p className="font-lexend text-sm mt-4" style={{ color: 'rgba(51,78,111,0.65)' }}>The final demo (sound on).</p>
        </div>
      </div>

      <Section kicker="The brief" title="Build a mirror a stranger can’t walk past.">
        <P>The assignment was an interactive installation where a stranger’s presence changes the piece, with no explanation on screen and nobody there to help. It had to run for three minutes straight without crashing or anyone touching it.</P>
      </Section>

      <Section kicker="The idea" title="Brush it one way and it changes.">
        <P>Flip-sequin shirts show one picture brushed one way and another brushed back. Weird Mirror does that with your reflection: the screen is you, made of sequins, and a swipe flips them to reveal the Jayhawk underneath. Swipe back and you return.</P>
        <P>The Jayhawk comes from my own KU Prints poster, and it stands in Allen Fieldhouse, so revealing it feels like walking onto the court.</P>
      </Section>

      {/* How it works */}
      <Section kicker="How it works" title="Four moments, no instructions." wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map(([src, t, d], i) => (
            <div key={t}>
              {src
                ? <img src={src} alt={t} className="w-full rounded-2xl block shadow-[0_4px_24px_rgba(0,0,0,0.12)]" style={{ imageRendering: 'pixelated', aspectRatio: '16 / 9', objectFit: 'cover' }} />
                : <LazyVideo src="/weirdmirror/video/jayhawk-dance.mp4" poster="/weirdmirror/video/jayhawk-dance-poster.jpg" label="The Jayhawk dancing once the screen is full" />}
              <p className="font-lexend font-semibold text-sm mt-4" style={{ color: KU }}>Step {i + 1}</p>
              <h3 className="font-lexend font-bold text-xl mt-1" style={{ color: INK }}>{t}</h3>
              <p className="font-lexend text-base leading-relaxed mt-2" style={{ color: 'rgba(51,78,111,0.75)' }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Under the hood */}
      <div style={{ background: '#f7f9fc' }}>
        <Section kicker="Under the hood" title="How it’s built." wide>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {HOOD.map(([t, d]) => (
              <div key={t}>
                <h3 className="font-lexend font-bold text-lg" style={{ color: INK }}>{t}</h3>
                <p className="font-lexend text-base leading-relaxed mt-2" style={{ color: 'rgba(51,78,111,0.75)' }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <img src="/weirdmirror/td-network.png" alt="The Weird Mirror TouchDesigner network" className="w-full rounded-2xl block shadow-[0_4px_24px_rgba(0,0,0,0.12)]" />
            <p className="font-lexend text-sm leading-relaxed mt-3" style={{ color: 'rgba(51,78,111,0.65)' }}>
              The TouchDesigner network. I built it together with Claude, an AI assistant connected live to TouchDesigner, which created and wired nodes from my descriptions while I tested every change on camera.
            </p>
          </div>
        </Section>
      </div>

      {/* Process */}
      <Section kicker="Process" title="What changed along the way.">
        <div className="flex flex-col">
          {PROCESS.map(([t, d], i) => (
            <div key={t} className="grid gap-4 py-6" style={{ gridTemplateColumns: '40px 1fr', borderTop: '1px solid rgba(51,78,111,0.12)' }}>
              <span className="font-lexend font-black text-2xl" style={{ color: KU }}>{i + 1}</span>
              <div>
                <h3 className="font-lexend font-bold text-lg" style={{ color: INK }}>{t}</h3>
                <p className="font-lexend text-base leading-relaxed mt-1" style={{ color: 'rgba(51,78,111,0.75)' }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Details */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-2 md:grid-cols-3 gap-8">
        {[['Course', 'IXD 415'], ['Type', 'Interactive installation'], ['Year', '2026'], ['Tools', 'TouchDesigner, Python, MediaPipe, OpenCV, GLSL']].map(([k, v]) => (
          <div key={k}>
            <p className="font-lexend text-sm" style={{ color: 'rgba(51,78,111,0.55)' }}>{k}</p>
            <p className="font-lexend font-semibold text-base mt-1" style={{ color: INK }}>{v}</p>
          </div>
        ))}
        <div>
          <p className="font-lexend text-sm" style={{ color: 'rgba(51,78,111,0.55)' }}>Code and build log</p>
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="font-lexend font-semibold text-base mt-1 inline-block underline underline-offset-4 hover:opacity-70" style={{ color: KU }}>GitHub ↗</a>
        </div>
      </div>

      <div className="text-center pb-16">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] hover:opacity-60 transition-opacity">← Back to Work</button>
      </div>
    </div>
  )
}

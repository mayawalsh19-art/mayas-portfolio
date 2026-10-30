import { useEffect } from 'react'

// Ref Drop — case study for the Chrome extension, in the Ref Drop brand
// (graphite folder + drop icon, Courier wordmark, Courier Prime + Hanken Grotesk).

const INK = '#111111'
const MUTED = '#545A62'
const PAPER = '#EEF1F3'
const SURFACE = '#F8FAFB'
const FOLDER = '#2E3237'
const CHROME = '#CACFD2'
const ICE = '#D8ECF5'
const WATER = '#1F6A92'
const LINE = '#D3D8DC'
const MONO = "'Courier Prime', 'Courier New', monospace"
const UI = "'Hanken Grotesk', 'Lexend', sans-serif"
const ZIP = '/refdrop/ref-drop-extension.zip'

// Keeps the last two words of a line of text together so no word sits alone (same as The Catch)
const tie = t => (typeof t === 'string' ? t.replace(/ (\S+)$/, '\u00a0$1') : t)

const shot = 'w-full block rounded-2xl shadow-[0_4px_24px_rgba(17,17,17,0.12)]'

function Section({ kicker, title, children, id }) {
  return (
    <section id={id} className="cs-container py-12 md:py-16">
      {kicker && <p className="text-sm mb-3" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>{kicker}</p>}
      {title && <h2 className="text-[30px] md:text-[44px] leading-[1.08] mb-6" style={{ fontFamily: MONO, fontWeight: 700, color: INK, letterSpacing: '-0.01em', textWrap: 'balance' }}>{title}</h2>}
      {children}
    </section>
  )
}

const P = ({ children }) => (
  <p className="text-base md:text-lg leading-relaxed mb-4 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie(children)}</p>
)

const Caption = ({ children }) => (
  <p className="text-sm leading-relaxed mt-3" style={{ fontFamily: UI, color: MUTED }}>{tie(children)}</p>
)

function AddButton({ dark = false }) {
  return (
    <a href={ZIP} download
      className="inline-flex items-center gap-3 rounded-lg px-5 py-3 font-semibold text-base transition-opacity hover:opacity-90"
      style={{ fontFamily: UI, background: dark ? CHROME : FOLDER, color: dark ? INK : '#F8FAFB' }}>
      <img src="/refdrop/folder-icon.png" alt="" className="w-7 h-7 object-contain" />
      Add Ref Drop to Chrome
    </a>
  )
}

const STEPS = [
  {
    t: 'Save without leaving the page',
    d: 'Right-click and choose Save to moodboard, or turn on Collect and just click images.',
    imgs: [['/refdrop/collect-page.jpg', 'Collect mode on a page: the clicked image outlined, a Saved to Futuristic Fashion No. 13 message and the Collecting bar']],
  },
  {
    t: 'Stays open while you browse',
    d: 'Ref Drop sits in Chrome’s side panel. Click any ref to see its source and add a note.',
    imgs: [['/refdrop/panel-grid.jpg', 'The Ref Drop side panel with a grid of saved refs'], ['/refdrop/panel-detail.jpg', 'A single ref with its source, date saved and a note field']],
    tall: true,
  },
  {
    t: 'Boards and quick cleanup',
    d: 'Keep a board per project. Delete one image, or select several at once.',
    imgs: [['/refdrop/panel-select.jpg', 'Select mode with three refs ticked and a Delete 3 button'], ['/refdrop/panel-empty.jpg', 'The empty state: No refs yet']],
    tall: true,
  },
  {
    t: 'A board ready to show',
    d: 'Every image numbered, with a color palette and sources pulled out for you.',
    imgs: [['/refdrop/board-sheet.jpg', 'The board view: info column with palette and sources beside a grid of numbered images']],
  },
  {
    t: 'Save as PDF',
    d: 'A moodboard page and a credits page, saved straight to your Desktop.',
    imgs: [['/refdrop/pdf-moodboard.jpg', 'PDF page one: the moodboard sheet'], ['/refdrop/pdf-credits.jpg', 'PDF page two: numbered credits with sources']],
  },
]

const COMPARE = [
  ['', 'Are.na', 'Eagle', 'Ref Drop'],
  ['What it is', 'A website for collecting ideas into channels', 'A paid desktop app for design files, plus an extension', 'A free Chrome extension'],
  ['Keeps the source', 'Yes, on each block', 'Yes, in the info panel', 'Yes, on every ref and in every export'],
  ['Credits for a case study', 'No', 'No', 'Credits page and credits file'],
  ['Choose where it goes', 'After saving', 'While batch saving', 'Before saving, with boards and Collect'],
]

const PROCESS = [
  ['The pitch', 'One feature: save an image with its source, export the credits.', null],
  ['First direction', 'Archival and Swiss, with one loud orange. Strong, but not mine yet.', ['/refdrop/first-direction-moodboard.jpg', 'The first brand moodboard: archive, Swiss grid and signal orange']],
  ['My own logo', 'A folder holding a drop of water, and a wordmark where the f runs into the D.', null],
  ['A system from the icon', 'Every color comes from the folder. Courier for anything filed, Hanken Grotesk for the rest.', null],
  ['Testing it for real', 'Using it on real research gave me the side panel, Collect, boards, delete and Save as PDF.', null],
]

const INSTALL = [
  ['Download', 'Download and unzip.'],
  ['Open', 'Go to chrome://extensions.'],
  ['Developer mode', 'Turn it on, top right.'],
  ['Load', 'Load unpacked, pick the folder.'],
  ['Pin', 'Pin Ref Drop to the toolbar.'],
]

export default function RefDropModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const jump = id => e => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#fff' }}>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity">
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero */}
      <div style={{ background: PAPER }}>
        <div className="cs-container pt-14 md:pt-20 pb-12 md:pb-16 flex flex-col items-center text-center">
          <img src="/refdrop/lockup.svg" alt="Ref Drop" className="w-[260px] md:w-[360px] h-auto" />
          <p className="mt-8 text-[22px] md:text-[32px] leading-tight" style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>
            Save the image. Keep the source.
          </p>
          <p className="mt-4 text-base md:text-lg leading-relaxed max-w-xl" style={{ fontFamily: UI, color: MUTED }}>
            A Chrome extension that saves images with their source, then makes the moodboard and credits for you.
          </p>
          <div className="flex gap-2 flex-wrap justify-center mt-6">
            {['Chrome Extension', 'Branding', 'UX / UI'].map(tag => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ fontFamily: UI, background: SURFACE, color: FOLDER, border: `1px solid ${LINE}` }}>{tag}</span>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap justify-center mt-8">
            <AddButton />
            <a href="#install" onClick={jump('install')} className="inline-flex items-center rounded-lg px-5 py-3 font-semibold text-base hover:opacity-70 transition-opacity"
              style={{ fontFamily: UI, color: INK, border: `1px solid #7D848C` }}>How to install</a>
          </div>
        </div>
        <div className="cs-container pb-14 md:pb-20">
          <img src="/refdrop/hero-browser.jpg" alt="Chrome with Ref Drop open in the side panel while collecting images from a page" className={shot} />
          <Caption>Click an image and it lands on your board, source included.</Caption>
        </div>
      </div>

      <Section kicker="The problem" title="A folder full of mystery screenshots.">
        <P>My inspiration ends up as files like “Screenshot 3.59.08 PM”, and by the case study I can’t say where any of it came from.</P>
      </Section>

      <Section kicker="The fix" title="One click. Source included.">
        <P>Right-click any image and save it with its source. The credits write themselves.</P>
      </Section>

      {/* How it works */}
      <div style={{ background: SURFACE }}>
        <Section kicker="How it works" title="How it works.">
          <div className="flex flex-col gap-16 md:gap-20">
            {STEPS.map((s, i) => (
              <div key={s.t}>
                <p className="text-sm" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>No. {String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-xl md:text-2xl font-semibold mt-1" style={{ fontFamily: UI, color: INK }}>{s.t}</h3>
                <p className="text-base leading-relaxed mt-2 mb-6 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie(s.d)}</p>
                <div className={s.imgs.length > 1 ? `grid grid-cols-1 sm:grid-cols-2 gap-6 ${s.tall ? 'md:max-w-[760px]' : ''}` : ''}>
                  {s.imgs.map(([src, alt]) => <img key={src} src={src} alt={alt} loading="lazy" className={shot} />)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Research */}
      <Section kicker="Research" title="Are.na and Eagle.">
        <P>Both keep sources. Neither gives you credits for a case study.</P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <figure>
            <img src="/refdrop/competitor-arena.jpg" alt="An Are.na channel shown as a grid" loading="lazy" className={shot} />
            <Caption>Are.na: calm grid, source on every block.</Caption>
          </figure>
          <figure>
            <img src="/refdrop/competitor-eagle.jpg" alt="Eagle's batch save picker" loading="lazy" className={shot} />
            <Caption>Eagle: pick the folder before saving. This inspired Collect.</Caption>
          </figure>
        </div>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm" style={{ fontFamily: UI, borderCollapse: 'collapse' }}>
            <tbody>
              {COMPARE.map((row, r) => (
                <tr key={r} style={{ borderBottom: `1px solid ${LINE}` }}>
                  {row.map((cell, c) => r === 0
                    ? <th key={c} className="text-left py-3 px-3 font-semibold" style={{ background: c === 3 ? FOLDER : 'transparent', color: c === 3 ? '#F8FAFB' : INK, borderRadius: c === 3 ? '8px 8px 0 0' : 0 }}>{cell}</th>
                    : <td key={c} className="py-3 px-3 align-top" style={{ color: c === 0 ? INK : MUTED, fontWeight: c === 0 ? 600 : 400, background: c === 3 ? ICE : 'transparent' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Process */}
      <div style={{ background: SURFACE }}>
        <Section kicker="Process" title="How it got here.">
          <div className="flex flex-col">
            {PROCESS.map(([t, d, img], i) => (
              <div key={t} className="grid gap-4 py-8" style={{ gridTemplateColumns: '64px 1fr', borderTop: `1px solid ${LINE}` }}>
                <span className="text-lg" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>No. {i + 1}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: UI, color: INK }}>{t}</h3>
                  <p className="text-base leading-relaxed mt-2 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie(d)}</p>
                  {img && <img src={img[0]} alt={img[1]} loading="lazy" className={`${shot} mt-6`} />}
                  {t === 'My own logo' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      <div className="rounded-2xl flex items-center justify-center p-8" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
                        <img src="/refdrop/wordmark.svg" alt="The finished Ref Drop wordmark" className="w-full max-w-[300px]" />
                      </div>
                      <div className="rounded-2xl flex items-center justify-center p-8" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
                        <img src="/refdrop/lockup.svg" alt="The Ref Drop lockup with the folder tucked above “rop”" className="w-full max-w-[300px]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Brand */}
      <Section kicker="Brand" title="Graphite, chrome and one drop of water.">
        <P>A filing cabinet for inspiration. The drop is the thing you just saved.</P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[['brand-overview', 'Brand overview'], ['brand-logo', 'Logo and app icon'], ['brand-color', 'Color palette'], ['brand-type', 'Typography']].map(([f, alt]) => (
            <img key={f} src={`/refdrop/${f}.jpg`} alt={alt} loading="lazy" className={shot} />
          ))}
        </div>
      </Section>

      {/* Install */}
      <div id="install" style={{ background: FOLDER }}>
        <section className="cs-container py-12 md:py-16">
          <div className="flex items-center gap-4 mb-6">
            <img src="/refdrop/folder-icon.png" alt="" className="w-14 h-14 object-contain" />
            <img src="/refdrop/lockup-light.svg" alt="Ref Drop" className="h-12 w-auto" />
          </div>
          <h2 className="text-[30px] md:text-[44px] leading-[1.08] mb-4" style={{ fontFamily: MONO, fontWeight: 700, color: '#F8FAFB' }}>Add it to your Chrome.</h2>
          <p className="text-base md:text-lg leading-relaxed mb-8 cs-solo" style={{ fontFamily: UI, color: CHROME }}>
            Free, and everything stays on your computer. Not on the Chrome Web Store yet, so it installs in Developer mode.
          </p>
          <AddButton dark />
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10 list-none p-0">
            {INSTALL.map(([t, d], i) => (
              <li key={t} className="rounded-xl p-5" style={{ background: 'rgba(248,250,251,0.06)', border: '1px solid rgba(202,207,210,0.2)' }}>
                <p className="text-sm" style={{ fontFamily: MONO, fontWeight: 700, color: ICE }}>No. {String(i + 1).padStart(2, '0')}</p>
                <p className="font-semibold mt-2" style={{ fontFamily: UI, color: '#F8FAFB' }}>{t}</p>
                <p className="text-sm leading-relaxed mt-1" style={{ fontFamily: UI, color: CHROME }}>{tie(d)}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Details */}
      <div className="cs-container py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[['Project', 'Project 2: The 1% Fix'], ['Type', 'Chrome extension and brand'], ['Year', '2026'], ['Built with', 'JavaScript (Manifest V3), IndexedDB, Figma, Claude Code']].map(([k, v]) => (
          <div key={k}>
            <p className="text-sm" style={{ fontFamily: UI, color: MUTED }}>{k}</p>
            <p className="font-semibold text-base mt-1" style={{ fontFamily: UI, color: INK }}>{v}</p>
          </div>
        ))}
      </div>

      <div className="text-center pb-16">
        <button onClick={onClose} className="font-lexend text-sm text-[#334e6f] hover:opacity-60 transition-opacity">← Back to Work</button>
      </div>
    </div>
  )
}

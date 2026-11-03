import { useEffect, useState } from 'react'

// Ref Drop — case study for the Chrome extension, in the Ref Drop brand
// (graphite folder + drop icon, Courier wordmark, Courier Prime + Hanken Grotesk).
// Shareable links: /ref-drop opens the case study, /ref-drop/install opens the install guide.
// vercel.json rewrites both paths to index.html.

const INK = '#111111'
const MUTED = '#545A62'
const PAPER = '#EEF1F3'
const SURFACE = '#F8FAFB'
const FOLDER = '#2E3237'
const TAB = '#62666D'
const CHROME = '#CACFD2'
const ICE = '#D8ECF5'
const WATER = '#1F6A92'
const LINE = '#D3D8DC'
const LINE_STRONG = '#7D848C'
const ON_FOLDER = '#F8FAFB'
const MONO = "'Courier Prime', 'Courier New', monospace"
const UI = "'Hanken Grotesk', 'Lexend', sans-serif"

const VERSION = '1.7.1'
const ZIP = '/refdrop/ref-drop.zip'
const ZIP_SIZE = '288 KB'
const CASE_PATH = '/ref-drop'
const INSTALL_PATH = '/ref-drop/install'
const INSTALL_URL = 'https://bymayawalsh.design/ref-drop/install'

const currentPath = () => window.location.pathname.replace(/\/+$/, '')
const viewFromPath = () => (currentPath() === INSTALL_PATH ? 'install' : 'case')

// Keeps the last two words of a line of text together so no word sits alone (same as The Catch)
const tie = t => (typeof t === 'string' ? t.replace(/ (\S+)$/, ' $1') : t)
const no = i => 'No. ' + String(i + 1).padStart(2, '0')

const shot = 'w-full block rounded-2xl'
const shotStyle = { boxShadow: '0 1px 2px rgba(17,17,17,0.06), 0 12px 32px rgba(17,17,17,0.10)' }

/* ---------- Shared pieces ---------- */

const Kicker = ({ children, light }) => (
  <p className="text-sm mb-3 flex items-center gap-2" style={{ fontFamily: MONO, fontWeight: 700, color: light ? ICE : WATER }}>
    <Drop color={light ? ICE : WATER} /> {children}
  </p>
)

const H2 = ({ children, light }) => (
  <h2 className="text-[30px] md:text-[46px] leading-[1.06] mb-5" style={{ fontFamily: MONO, fontWeight: 700, color: light ? ON_FOLDER : INK, letterSpacing: '-0.01em', textWrap: 'balance' }}>
    {children}
  </h2>
)

const P = ({ children, light, className = '' }) => (
  <p className={`text-base md:text-lg leading-relaxed mb-4 cs-solo ${className}`} style={{ fontFamily: UI, color: light ? CHROME : MUTED }}>{tie(children)}</p>
)

const Caption = ({ children }) => (
  <p className="text-sm leading-relaxed mt-3" style={{ fontFamily: UI, color: MUTED }}>{tie(children)}</p>
)

// The drop from the icon, as a small glyph
function Drop({ color = WATER, size = 12 }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 10 13" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M5 0.5C5 0.5 0.8 5.6 0.8 8.3a4.2 4.2 0 0 0 8.4 0C9.2 5.6 5 0.5 5 0.5z" fill={color} />
    </svg>
  )
}

function Section({ id, bg = PAPER, children, className = '' }) {
  return (
    <div id={id} style={{ background: bg }}>
      <section className={`cs-container py-14 md:py-20 ${className}`}>{children}</section>
    </div>
  )
}

function DownloadButton({ dark = false, size = 'lg' }) {
  return (
    <a href={ZIP} download="ref-drop.zip"
      className={`inline-flex items-center gap-3 rounded-lg font-semibold transition-opacity hover:opacity-90 ${size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2.5 text-sm'}`}
      style={{ fontFamily: UI, background: dark ? CHROME : FOLDER, color: dark ? INK : ON_FOLDER }}>
      <img src="/refdrop/folder-icon.png" alt="" className="w-7 h-7 object-contain" />
      Download Ref Drop
    </a>
  )
}

function OutlineLink({ href, onClick, children, light }) {
  return (
    <a href={href} onClick={onClick}
      className="inline-flex items-center rounded-lg px-5 py-3 font-semibold text-base hover:opacity-70 transition-opacity"
      style={{ fontFamily: UI, color: light ? ON_FOLDER : INK, border: `1px solid ${light ? 'rgba(202,207,210,0.5)' : LINE_STRONG}` }}>
      {children}
    </a>
  )
}

function Nav({ onBack, backLabel, right }) {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-sm flex items-center justify-between px-6 md:px-16 h-[60px]"
      style={{ background: 'rgba(238,241,243,0.88)', borderBottom: `1px solid ${LINE}` }}>
      <button onClick={onBack} className="text-sm flex items-center gap-2 hover:opacity-60 transition-opacity" style={{ fontFamily: UI, color: INK }}>
        ← {backLabel}
      </button>
      {right}
    </nav>
  )
}

/* ---------- Case study content ---------- */

const META = [
  ['Role', 'Design, brand and code'],
  ['Type', 'Chrome extension'],
  ['Timeline', 'Oct – Nov 2026'],
  ['Built with', 'JavaScript (Manifest V3), IndexedDB, Figma, Claude Code'],
]

const MYSTERY = [
  ['Screenshot 2026-10-12 at 3.59.08 PM.png', '2.1 MB'],
  ['Screenshot 2026-10-12 at 3.59.41 PM.png', '1.8 MB'],
  ['IMG_4471.jpeg', '940 KB'],
  ['download (3).webp', '212 KB'],
  ['Screenshot 2026-10-14 at 11.02.17 AM.png', '3.4 MB'],
  ['pin-image-final-FINAL.jpg', '486 KB'],
]

const PROMISES = [
  ['Source on every ref', 'The page it came from is saved with the image, and it stays even if the site deletes it.'],
  ['Credits written for you', 'Every export comes with a numbered credits list, ready to paste into a case study.'],
  ['Stays on your computer', 'No account and no server. Your boards live in Chrome on your machine.'],
]

const FEATURES = [
  {
    t: 'Save without leaving the page',
    d: 'Right-click any image and choose Save to moodboard. Or turn on Collect and just click images. Search boxes, menus and icons are left alone, so you can keep searching.',
    imgs: [['/refdrop/collect-page.jpg', 'Collect mode on a page: the clicked bag outlined in blue, a Saved to Futuristic Fashion No. 13 message and the Collecting bar']],
  },
  {
    t: 'A side panel that stays open',
    d: 'Ref Drop sits beside the page while you browse. Hover a ref for its number and source. Click it to add a note.',
    imgs: [['/refdrop/panel-grid.jpg', 'The Ref Drop side panel with a grid of saved refs'], ['/refdrop/panel-detail.jpg', 'A single ref with its source, date saved and a note']],
    narrow: true,
  },
  {
    t: 'A board for every project',
    d: 'Rename a board with the pencil, delete it with the trash, or select several refs and remove them at once. Everything asks before it deletes.',
    imgs: [['/refdrop/panel-rename.jpg', 'Renaming the Futuristic Fashion board'], ['/refdrop/panel-delete.jpg', 'The delete board confirmation: Delete Futuristic Fashion and its 12 refs?'], ['/refdrop/panel-select.jpg', 'Select mode with three refs ticked and a Delete 3 button']],
    narrow: true,
  },
  {
    t: 'A board ready to show',
    d: 'Every image numbered, with a color palette and sources pulled from what you saved.',
    imgs: [['/refdrop/board-sheet.jpg', 'The board view: title, palette and sources beside a grid of numbered images']],
  },
  {
    t: 'Save as PDF',
    d: 'One click makes a moodboard page and a credits page with clickable sources, and saves it to your Desktop.',
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
  ['My own logo', 'A folder holding a drop of water, and a wordmark where the f runs into the D.', 'logo'],
  ['A system from the icon', 'Every color comes from the folder. Courier for anything filed, Hanken Grotesk for the rest.', null],
  ['Testing it for real', 'Using it on real research gave me the side panel, Collect, boards, delete and Save as PDF.', null],
  ['Ready to share', 'A download anyone can install, a step-by-step guide, and a round of testing in a real browser before handing it out.', null],
]

const TESTED = [
  'Saving by right-click and by Collect',
  'Search boxes and dropdowns ignored',
  'Images under clickable overlays',
  'Pages that stay put, no surprise links',
  'Rename, delete and new boards',
  'Select and Clear all, with confirms',
  'Board view, palette and credits',
  'PDF and zip exports',
  'Still working after an update',
  'No account, nothing uploaded',
]

const SWATCHES = [
  ['folder', '#2E3237', ON_FOLDER],
  ['folder-tab', '#62666D', ON_FOLDER],
  ['chrome', '#CACFD2', INK],
  ['ice', '#D8ECF5', INK],
  ['paper', '#EEF1F3', INK],
  ['link', '#1F6A92', ON_FOLDER],
]

/* ---------- Install guide content ---------- */

const STEPS = [
  { t: 'Download and unzip', d: 'Download ref-drop.zip, then double-click it (on Windows, right-click and choose Extract All). You get a folder called Ref Drop.', art: 'zip' },
  { t: 'Keep the folder somewhere safe', d: 'Move the Ref Drop folder into Documents. Chrome runs Ref Drop from this folder, so don’t delete it later.', art: 'folder' },
  { t: 'Open the extensions page', d: 'In Chrome, type chrome://extensions in the address bar and press Enter.', art: 'url' },
  { t: 'Turn on Developer mode', d: 'It’s the switch in the top right corner of the page.', art: 'toggle' },
  { t: 'Click Load unpacked', d: 'Choose the Ref Drop folder, the one with manifest.json inside, and click Select.', art: 'load' },
  { t: 'Pin it to your toolbar', d: 'Click the puzzle piece next to the address bar, then the pin next to Ref Drop.', art: 'pin' },
]

const USE = [
  ['Save', 'Right-click any image and choose Save to moodboard.'],
  ['Collect', 'Turn on Collect in the panel, then click images. Esc stops it.'],
  ['Share', 'Open board, then Save as PDF or Export .zip.'],
]

const HELP = [
  ['“Manifest file is missing or unreadable”', 'You picked the folder around Ref Drop. On Windows, unzipping often makes a folder inside a folder. Choose the inner Ref Drop folder, the one with manifest.json in it.'],
  ['Collect doesn’t work on a page', 'Pages that were already open before you installed need a refresh first.'],
  ['Clicking the folder icon does nothing', 'Go to chrome://extensions and click the reload arrow on Ref Drop.'],
  ['Chrome warns about developer mode extensions', 'That’s Chrome’s standard note for any extension from outside its store. Keep Ref Drop turned on.'],
  ['Getting a newer version', 'Download the new zip and replace the files in your Ref Drop folder, then click the reload arrow on Ref Drop at chrome://extensions. Your boards stay put.'],
  ['Removing it', 'Click Remove on Ref Drop at chrome://extensions. This deletes your boards too, so export anything you want to keep first.'],
]

/* ---------- Little drawings for the install steps ---------- */

function Art({ kind }) {
  const box = 'w-full h-[150px] rounded-xl flex items-center justify-center gap-3 px-4'
  const bg = { background: PAPER, border: `1px solid ${LINE}` }
  const chip = (children, active) => (
    <span className="rounded-md px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap" style={{ fontFamily: UI, background: active ? ICE : SURFACE, color: active ? INK : MUTED, border: `1px solid ${active ? WATER : LINE}`, boxShadow: active ? `0 0 0 2px ${ICE}` : 'none' }}>{children}</span>
  )
  if (kind === 'zip') return (
    <div className={box} style={bg}>
      <div className="flex flex-col items-center gap-1">
        <svg width="40" height="48" viewBox="0 0 40 48" aria-hidden="true"><path d="M4 2h22l10 10v34H4z" fill={SURFACE} stroke={LINE_STRONG} /><path d="M26 2v10h10" fill="none" stroke={LINE_STRONG} />{[10, 16, 22, 28].map(y => <rect key={y} x="17" y={y} width="6" height="3" fill={TAB} />)}</svg>
        <span className="text-[11px]" style={{ fontFamily: MONO, color: MUTED }}>ref-drop.zip</span>
      </div>
      <span style={{ color: LINE_STRONG }}>→</span>
      <div className="flex flex-col items-center gap-1">
        <img src="/refdrop/folder-icon.png" alt="" className="w-12 h-12 object-contain" />
        <span className="text-[11px]" style={{ fontFamily: MONO, color: INK, fontWeight: 700 }}>Ref Drop</span>
      </div>
    </div>
  )
  if (kind === 'folder') return (
    <div className={box} style={bg}>
      <div className="rounded-lg w-full max-w-[220px] overflow-hidden" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
        <div className="px-3 py-1 text-[11px] font-semibold" style={{ fontFamily: UI, color: MUTED, borderBottom: `1px solid ${LINE}` }}>Documents</div>
        {['Class projects', 'Ref Drop', 'Resume.pdf'].map(n => (
          <div key={n} className="flex items-center gap-2 px-3 py-1 text-[12px]" style={{ fontFamily: UI, color: INK, background: n === 'Ref Drop' ? ICE : 'transparent' }}>
            {n === 'Ref Drop' ? <img src="/refdrop/folder-icon.png" alt="" className="w-4 h-4" /> : <span className="w-4 h-3 rounded-sm" style={{ background: n.endsWith('pdf') ? LINE : CHROME }} />}{n}
          </div>
        ))}
      </div>
    </div>
  )
  if (kind === 'url') return (
    <div className={box} style={bg}>
      <div className="w-full max-w-[240px] rounded-full px-4 py-2 text-[13px] flex items-center gap-2" style={{ background: SURFACE, border: `2px solid ${WATER}`, fontFamily: MONO, color: INK, fontWeight: 700 }}>
        chrome://extensions<span className="w-[2px] h-4 animate-pulse" style={{ background: INK }} />
      </div>
    </div>
  )
  if (kind === 'toggle') return (
    <div className={box} style={bg}>
      <span className="text-[13px] font-semibold" style={{ fontFamily: UI, color: INK }}>Developer mode</span>
      <span className="relative w-10 h-6 rounded-full" style={{ background: WATER, boxShadow: `0 0 0 3px ${ICE}` }}><span className="absolute top-1 right-1 w-4 h-4 rounded-full" style={{ background: SURFACE }} /></span>
    </div>
  )
  if (kind === 'load') return (
    <div className={`${box} flex-wrap content-center`} style={bg}>
      {chip('Load unpacked', true)}{chip('Pack extension')}{chip('Update')}
    </div>
  )
  return (
    <div className={box} style={bg}>
      <div className="rounded-lg w-full max-w-[220px] py-1" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
        {['Other extension', 'Ref Drop'].map(n => (
          <div key={n} className="flex items-center gap-2 px-3 py-1.5 text-[12px]" style={{ fontFamily: UI, color: n === 'Ref Drop' ? INK : MUTED, background: n === 'Ref Drop' ? ICE : 'transparent' }}>
            {n === 'Ref Drop' ? <img src="/refdrop/folder-icon.png" alt="" className="w-4 h-4" /> : <span className="w-4 h-4 rounded" style={{ background: LINE }} />}
            {n}
            <svg className="ml-auto" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 1.5l4 4-2.2.6-2.6 2.6.3 3.3-1 1-2.8-2.8L2 14.4 1.6 14l4.2-4.2L3 7l1-1 3.3.3 2.6-2.6z" fill={n === 'Ref Drop' ? WATER : LINE_STRONG} /></svg>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Install guide page ---------- */

function InstallGuide({ onBack, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(INSTALL_URL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
  }
  return (
    <>
      <Nav onBack={onBack} backLabel="Ref Drop case study"
        right={<button onClick={onClose} className="text-sm hover:opacity-60 transition-opacity" style={{ fontFamily: UI, color: MUTED }}>Maya Walsh</button>} />

      <Section>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <img src="/refdrop/lockup.svg" alt="Ref Drop" className="h-14 md:h-16 w-auto mb-8" />
            <Kicker>Install guide</Kicker>
            <h1 className="text-[36px] md:text-[56px] leading-[1.04]" style={{ fontFamily: MONO, fontWeight: 700, color: INK, letterSpacing: '-0.01em' }}>Add Ref Drop to Chrome.</h1>
            <P className="mt-5">About two minutes. Ref Drop isn’t in the Chrome Web Store, so you add it yourself in Developer mode. Free, and everything you save stays on your computer.</P>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <DownloadButton />
          <button onClick={copy} className="inline-flex items-center rounded-lg px-5 py-3 font-semibold text-base hover:opacity-70 transition-opacity"
            style={{ fontFamily: UI, color: INK, border: `1px solid ${LINE_STRONG}` }}>
            {copied ? 'Link copied' : 'Copy link to this guide'}
          </button>
        </div>
        <p className="text-sm mt-4" style={{ fontFamily: MONO, color: MUTED }}>Version {VERSION} · {ZIP_SIZE} · Google Chrome on Mac or Windows</p>
        <p className="md:hidden text-sm mt-4 rounded-lg px-4 py-3" style={{ fontFamily: UI, background: ICE, color: INK }}>Ref Drop runs in Chrome on a computer. Open this page on your laptop to install it.</p>
      </Section>

      <Section bg={SURFACE}>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
              <Art kind={s.art} />
              <div>
                <p className="text-sm" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>{no(i)}</p>
                <h3 className="text-lg font-semibold mt-1" style={{ fontFamily: UI, color: INK }}>{s.t}</h3>
                <p className="text-[15px] leading-relaxed mt-1" style={{ fontFamily: UI, color: MUTED }}>{tie(s.d)}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <h3 className="text-2xl" style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>Then a welcome page opens.</h3>
            <p className="text-base leading-relaxed mt-2 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie('It shows the same pin step, in case you missed it. After that, click the folder icon any time to open Ref Drop beside the page.')}</p>
          </div>
          <img src="/refdrop/welcome-pin.jpg" alt="The Ref Drop welcome page: Pin Ref Drop to your toolbar" loading="lazy" className={shot} style={shotStyle} />
        </div>
      </Section>

      <Section>
        <Kicker>Start using it</Kicker>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {USE.map(([t, d], i) => (
            <div key={t} className="rounded-2xl p-6" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
              <p className="text-sm" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>{no(i)}</p>
              <p className="text-lg font-semibold mt-1" style={{ fontFamily: UI, color: INK }}>{t}</p>
              <p className="text-[15px] leading-relaxed mt-1" style={{ fontFamily: UI, color: MUTED }}>{tie(d)}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl mt-16 mb-6" style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>If something’s off</h2>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${LINE}` }}>
          {HELP.map(([q, a]) => (
            <details key={q} className="group py-4" style={{ borderBottom: `1px solid ${LINE}` }}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-base" style={{ fontFamily: UI, color: INK }}>
                {q}<span className="text-xl transition-transform group-open:rotate-45" style={{ color: WATER }}>+</span>
              </summary>
              <p className="text-[15px] leading-relaxed mt-2 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie(a)}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section bg={FOLDER}>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <img src="/refdrop/folder-icon.png" alt="" className="w-20 h-20 object-contain" />
          <div>
            <h2 className="text-2xl md:text-3xl" style={{ fontFamily: MONO, fontWeight: 700, color: ON_FOLDER }}>Your refs stay yours.</h2>
            <p className="text-base leading-relaxed mt-2 cs-solo" style={{ fontFamily: UI, color: CHROME }}>{tie('Ref Drop has no account and no server. Images, sources and notes are saved in Chrome on your computer, and nothing is uploaded.')}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <DownloadButton dark />
          <OutlineLink href={CASE_PATH} onClick={e => { e.preventDefault(); onBack() }} light>Read the case study</OutlineLink>
        </div>
      </Section>
    </>
  )
}

/* ---------- Case study page ---------- */

function CaseStudy({ onClose, onInstall }) {
  const toInstall = e => { e.preventDefault(); onInstall() }
  return (
    <>
      <Nav onBack={onClose} backLabel="Back to Work"
        right={<a href={INSTALL_PATH} onClick={toInstall} className="text-sm font-semibold hover:opacity-60 transition-opacity" style={{ fontFamily: UI, color: WATER }}>Install guide</a>} />

      {/* Hero */}
      <div style={{ background: PAPER }}>
        <div className="cs-container pt-14 md:pt-20 pb-10 flex flex-col items-center text-center">
          <img src="/refdrop/lockup.svg" alt="Ref Drop" className="w-[240px] md:w-[340px] h-auto" />
          <h1 className="mt-10 mb-2 text-[34px] md:text-[60px] leading-[1.02]" style={{ fontFamily: MONO, fontWeight: 700, color: INK, letterSpacing: '-0.015em', textWrap: 'balance' }}>
            Save the image.<br />Keep the source.
          </h1>
          <p className="mt-5 text-base md:text-xl leading-relaxed max-w-xl" style={{ fontFamily: UI, color: MUTED }}>
            {tie('A Chrome extension that saves images with the page they came from, then makes the moodboard and the credits for you.')}
          </p>
          <div className="flex gap-3 flex-wrap justify-center mt-8">
            <DownloadButton />
            <OutlineLink href={INSTALL_PATH} onClick={toInstall}>How to install</OutlineLink>
          </div>
          <p className="text-sm mt-5" style={{ fontFamily: MONO, color: MUTED }}>Free · Version {VERSION} · Google Chrome</p>
        </div>
        <div className="cs-container pb-12 md:pb-16">
          <img src="/refdrop/hero-browser.jpg" alt="Chrome with Ref Drop open in the side panel while collecting images from a page" className="w-full block" />
        </div>
        <div className="cs-container pb-14 md:pb-20">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: LINE, border: `1px solid ${LINE}` }}>
            {META.map(([k, v]) => (
              <div key={k} className="p-5 md:p-6" style={{ background: SURFACE }}>
                <dt className="text-[11px] font-semibold uppercase" style={{ fontFamily: UI, color: MUTED, letterSpacing: '0.08em' }}>{k}</dt>
                <dd className="font-semibold text-[15px] mt-1.5 leading-snug" style={{ fontFamily: UI, color: INK }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Problem */}
      <Section bg={SURFACE}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <Kicker>The problem</Kicker>
            <H2>A folder full of mystery screenshots.</H2>
            <P>My inspiration ends up as files like “Screenshot 3.59.08 PM”. By the time I write the case study, I can’t say where any of it came from, so I can’t credit it.</P>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${LINE}`, ...shotStyle }}>
            <div className="flex items-center gap-2 px-4 h-10" style={{ background: PAPER, borderBottom: `1px solid ${LINE}` }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              <span className="ml-3 text-[13px] font-semibold" style={{ fontFamily: UI, color: MUTED }}>Downloads</span>
            </div>
            {MYSTERY.map(([n, s], i) => (
              <div key={n} className="flex items-center gap-3 px-4 py-2.5 text-[13px]" style={{ fontFamily: MONO, color: INK, background: i % 2 ? PAPER : '#fff' }}>
                <span className="w-6 h-5 rounded-sm flex-none" style={{ background: [CHROME, LINE, TAB, CHROME, LINE, TAB][i] }} />
                <span className="truncate flex-1">{n}</span>
                <span className="flex-none" style={{ color: MUTED }}>{s}</span>
                <span className="flex-none hidden sm:inline" style={{ color: '#B42318' }}>source ?</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* The fix: one ref, filed like a catalog card */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 md:gap-14 items-center">
          <div>
            <Kicker>The fix</Kicker>
            <H2>One click. Source included.</H2>
            <P>Every image you save becomes a ref: the image, the page it came from, the date and your note, filed like a card in a catalog.</P>
            <div className="flex flex-col gap-5 mt-8">
              {PROMISES.map(([t, d]) => (
                <div key={t} className="grid gap-3" style={{ gridTemplateColumns: '20px 1fr' }}>
                  <span className="mt-1"><Drop /></span>
                  <div>
                    <p className="font-semibold text-base" style={{ fontFamily: UI, color: INK }}>{t}</p>
                    <p className="text-[15px] leading-relaxed mt-0.5" style={{ fontFamily: UI, color: MUTED }}>{tie(d)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute -top-3 left-6 h-6 w-28 rounded-t-lg" style={{ background: TAB }} />
            <div className="relative rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${LINE}`, ...shotStyle }}>
              <div className="relative">
                <img src="/refdrop/ref-sample.jpg" alt="A saved ref: silver jewelry from Pinterest" className="w-full h-[300px] object-cover rounded-lg" />
                <span className="absolute left-2 bottom-2 rounded px-2 py-0.5 text-[12px]" style={{ fontFamily: MONO, fontWeight: 700, background: FOLDER, color: ON_FOLDER }}>No. 11</span>
              </div>
              <dl className="mt-4 grid gap-3">
                {[['Source', 'pinterest.com/pin/4600778979…', true], ['Saved', 'Nov 3, 2026'], ['Note', 'Liquid metal against skin. Use for the lookbook cover.']].map(([k, v, link]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-semibold uppercase" style={{ fontFamily: UI, color: MUTED, letterSpacing: '0.08em' }}>{k}</dt>
                    <dd className="text-[13px] mt-0.5" style={{ fontFamily: link ? MONO : UI, color: link ? WATER : INK, textDecoration: link ? 'underline' : 'none' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </figure>
        </div>
      </Section>

      {/* How it works */}
      <Section bg={SURFACE}>
        <Kicker>How it works</Kicker>
        <H2>Collect, keep, share.</H2>
        <div className="flex flex-col gap-20 md:gap-28 mt-12">
          {FEATURES.map((f, i) => (
            <div key={f.t} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
              <div className="md:col-span-4">
                <p className="text-sm" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>{no(i)}</p>
                <div className="h-px my-3" style={{ background: LINE }} />
                <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: UI, color: INK }}>{f.t}</h3>
                <p className="text-base leading-relaxed mt-3" style={{ fontFamily: UI, color: MUTED }}>{tie(f.d)}</p>
              </div>
              <div className={`md:col-span-8 grid gap-5 ${f.imgs.length === 3 ? 'grid-cols-3' : f.imgs.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {f.imgs.map(([src, alt]) => <img key={src} src={src} alt={alt} loading="lazy" className={shot} style={shotStyle} />)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Research */}
      <Section>
        <Kicker>Research</Kicker>
        <H2>Are.na and Eagle.</H2>
        <P>Both keep sources. Neither gives you credits for a case study, and neither lets you pick the board before you save.</P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <figure>
            <img src="/refdrop/competitor-arena.jpg" alt="An Are.na channel shown as a grid" loading="lazy" className={shot} style={shotStyle} />
            <Caption>Are.na: calm grid, source on every block.</Caption>
          </figure>
          <figure>
            <img src="/refdrop/competitor-eagle.jpg" alt="Eagle's batch save picker" loading="lazy" className={shot} style={shotStyle} />
            <Caption>Eagle: pick the folder before saving. This inspired Collect.</Caption>
          </figure>
        </div>
        <div className="mt-10 overflow-x-auto rounded-2xl" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
          <table className="w-full min-w-[640px] text-sm" style={{ fontFamily: UI, borderCollapse: 'collapse' }}>
            <tbody>
              {COMPARE.map((row, r) => (
                <tr key={r} style={{ borderBottom: r < COMPARE.length - 1 ? `1px solid ${LINE}` : 'none' }}>
                  {row.map((cell, c) => r === 0
                    ? <th key={c} className="text-left py-3.5 px-4 font-semibold" style={{ background: c === 3 ? FOLDER : 'transparent', color: c === 3 ? ON_FOLDER : INK, fontFamily: c === 3 ? MONO : UI }}>{cell}</th>
                    : <td key={c} className="py-3.5 px-4 align-top" style={{ color: c === 0 ? INK : c === 3 ? INK : MUTED, fontWeight: c === 0 || c === 3 ? 600 : 400, background: c === 3 ? ICE : 'transparent' }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Process */}
      <Section bg={SURFACE}>
        <Kicker>Process</Kicker>
        <H2>How it got here.</H2>
        <div className="flex flex-col mt-6">
          {PROCESS.map(([t, d, img], i) => (
            <div key={t} className="grid gap-4 md:gap-8 py-8" style={{ gridTemplateColumns: '72px 1fr', borderTop: `1px solid ${LINE}` }}>
              <span className="text-base" style={{ fontFamily: MONO, fontWeight: 700, color: WATER }}>{no(i)}</span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: UI, color: INK }}>{t}</h3>
                <p className="text-base leading-relaxed mt-2 cs-solo" style={{ fontFamily: UI, color: MUTED }}>{tie(d)}</p>
                {Array.isArray(img) && <img src={img[0]} alt={img[1]} loading="lazy" className={`${shot} mt-6`} style={shotStyle} />}
                {img === 'logo' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                    <div className="rounded-2xl flex items-center justify-center p-8" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                      <img src="/refdrop/folder-icon.png" alt="The Ref Drop app icon: a graphite folder holding a drop of water" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="rounded-2xl flex items-center justify-center p-8" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                      <img src="/refdrop/wordmark.svg" alt="The Ref Drop wordmark" className="w-full max-w-[220px]" />
                    </div>
                    <div className="rounded-2xl flex items-center justify-center p-8" style={{ background: FOLDER }}>
                      <img src="/refdrop/lockup-light.svg" alt="The Ref Drop lockup on graphite" className="w-full max-w-[220px]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Brand */}
      <Section>
        <Kicker>Brand</Kicker>
        <H2>Graphite, chrome and one drop of water.</H2>
        <P>A filing cabinet for inspiration. Every color is lifted from the icon, and the drop is the one moment of light: the thing you just saved.</P>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
          {SWATCHES.map(([n, hex, fg]) => (
            <div key={n} className="rounded-xl h-28 md:h-36 p-3 flex flex-col justify-end" style={{ background: hex, color: fg, border: hex === PAPER ? `1px solid ${LINE}` : 'none' }}>
              <span className="text-[13px] font-semibold" style={{ fontFamily: UI }}>{n}</span>
              <span className="text-[12px]" style={{ fontFamily: MONO }}>{hex}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl p-6" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
            <p className="text-[11px] font-semibold uppercase" style={{ fontFamily: UI, color: MUTED, letterSpacing: '0.08em' }}>Display · Courier Prime</p>
            <p className="text-[40px] leading-tight mt-3" style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>No. 07</p>
            <p className="text-sm mt-2" style={{ fontFamily: UI, color: MUTED }}>Anything filed: board titles, ref numbers, sources.</p>
          </div>
          <div className="rounded-xl p-6" style={{ background: SURFACE, border: `1px solid ${LINE}` }}>
            <p className="text-[11px] font-semibold uppercase" style={{ fontFamily: UI, color: MUTED, letterSpacing: '0.08em' }}>Interface · Hanken Grotesk</p>
            <p className="text-[40px] leading-tight mt-3 font-semibold" style={{ fontFamily: UI, color: INK }}>Save to moodboard</p>
            <p className="text-sm mt-2" style={{ fontFamily: UI, color: MUTED }}>Everything you read or click.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[['brand-overview', 'Brand overview'], ['brand-logo', 'Logo and app icon'], ['brand-color', 'Color palette'], ['brand-type', 'Typography']].map(([f, alt]) => (
            <img key={f} src={`/refdrop/${f}.jpg`} alt={alt} loading="lazy" className={shot} style={shotStyle} />
          ))}
        </div>
      </Section>

      {/* Tested */}
      <Section bg={SURFACE}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <Kicker>Before sharing it</Kicker>
            <H2>Tested in a real browser.</H2>
            <P>Before handing it to classmates, I ran Ref Drop through 48 automated checks in Chrome, clicking through every feature the way a person would.</P>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none p-0 m-0">
            {TESTED.map(t => (
              <li key={t} className="flex items-center gap-3 rounded-lg px-4 py-3 text-[15px]" style={{ fontFamily: UI, color: INK, background: '#fff', border: `1px solid ${LINE}` }}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flex: 'none' }}><circle cx="8" cy="8" r="8" fill={ICE} /><path d="M4.5 8.2l2.3 2.3 4.7-4.9" fill="none" stroke={WATER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Get it */}
      <Section id="install" bg={FOLDER}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <img src="/refdrop/lockup-light.svg" alt="Ref Drop" className="h-12 md:h-14 w-auto mb-8" />
            <H2 light>Try it in your Chrome.</H2>
            <P light>Free, and everything stays on your computer. Download it, load it in Developer mode, and pin the folder. The guide walks you through it in six steps.</P>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <DownloadButton dark />
          <OutlineLink href={INSTALL_PATH} onClick={toInstall} light>Step-by-step install guide</OutlineLink>
        </div>
        <p className="text-sm mt-4" style={{ fontFamily: MONO, color: CHROME }}>Version {VERSION} · {ZIP_SIZE}</p>
      </Section>

      <div className="text-center py-12" style={{ background: PAPER }}>
        <button onClick={onClose} className="text-sm hover:opacity-60 transition-opacity" style={{ fontFamily: UI, color: INK }}>← Back to Work</button>
      </div>
    </>
  )
}

export default function RefDropModal({ onClose }) {
  const [view, setView] = useState(viewFromPath) // 'case' | 'install'

  const goTo = next => {
    window.history.pushState(null, '', next === 'install' ? INSTALL_PATH : CASE_PATH)
    setView(next)
    document.getElementById('refdrop-scroll')?.scrollTo({ top: 0 })
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    const sync = () => setView(viewFromPath())
    window.addEventListener('keydown', onKey)
    window.addEventListener('popstate', sync)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', sync)
    }
  }, [onClose])

  return (
    <div id="refdrop-scroll" className="fixed inset-0 z-50 overflow-y-auto" style={{ background: PAPER }}>
      {view === 'install'
        ? <InstallGuide onBack={() => goTo('case')} onClose={onClose} />
        : <CaseStudy onClose={onClose} onInstall={() => goTo('install')} />}
    </div>
  )
}

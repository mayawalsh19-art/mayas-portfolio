import { useEffect } from 'react'

const PRIMARY   = '#7a2020'
const ACCENT    = '#d85050'
const CARD_BG   = '#fde8e3'

const RESEARCH_CARDS = [
  {
    title: 'First-Time Pregnancy Challenges',
    text: 'New mothers face a steep learning curve — from physical changes to emotional shifts — often without adequate guidance or support networks in place.',
  },
  {
    title: 'Overwhelm and Confusion',
    text: 'The abundance of conflicting online information leaves pregnant women feeling overwhelmed, unsure of what advice to trust during a vulnerable time.',
  },
  {
    title: 'Support Systems and Community',
    text: 'Many first-time mothers lack access to a strong support community, leading to isolation during pregnancy and the critical postpartum period.',
  },
  {
    title: 'Opportunities for Better Design',
    text: 'Existing apps focus heavily on tracking and data but underinvest in emotional support, community connection, and mental wellness features.',
  },
  {
    title: 'Common Pregnancy Apps',
    text: 'Popular apps like What to Expect and BabyCenter prioritize week-by-week tracking but offer limited postpartum mental health resources.',
  },
  {
    title: 'Mental Health Risk and Vulnerability',
    text: 'Postpartum depression affects 1 in 5 new mothers, yet most pregnancy apps do not provide dedicated mental health check-ins or peer support tools.',
  },
  {
    title: 'Main Gaps in Current Tools',
    text: 'Current tools lack continuity — they stop at birth, leaving mothers without support precisely when postpartum challenges are most acute.',
  },
  {
    title: 'Postpartum Apps and Mental Health',
    text: 'A growing body of research supports app-based interventions for postpartum mood disorders, highlighting an underserved but high-impact design opportunity.',
  },
]

const ONBOARDING_FLOW = [
  ['Welcome', 'Create Account', 'Name & DOB', 'Due Date'],
  ['Pregnancy Stage', 'Health Goals', 'Community Prefs', 'Notifications'],
  ['Home Dashboard'],
]

const MAIN_FLOW = [
  ['Home'],
  ['Community Feed', 'Health Tracker', 'Resources'],
  ['Post / Connect', 'Log Mood / Symptoms', 'Articles & Tips'],
  ['Profile & Settings'],
]

const JOURNEY_ROWS = [
  {
    label: 'Actions',
    cells: [
      'Hears about app from a friend',
      'Downloads Cora, creates account',
      'Completes onboarding profile',
      'Explores community & tips',
      'Tracks mood, connects with moms',
    ],
  },
  {
    label: 'Thoughts',
    cells: [
      'Will this actually help me?',
      'I hope this is easy to use',
      'Finally something made for me',
      'Other moms feel the same way',
      'I feel less alone now',
    ],
  },
  {
    label: 'Pain Points',
    cells: [
      'Skeptical of another app',
      'Privacy concerns',
      'Too many questions upfront',
      'Hard to find relevant content',
      'Needs faster mood check-ins',
    ],
  },
  {
    label: 'Opportunities',
    cells: [
      'Peer referral features',
      'Trust-building onboarding',
      'Personalised, short setup',
      'Smart content filtering',
      'Daily wellness nudges',
    ],
  },
]

const TESTING_QUOTES = [
  '"I love that it doesn\'t just stop at pregnancy — it actually cares about how I\'m doing after."',
  '"The community aspect made me feel like I wasn\'t going through this alone."',
  '"It feels warm and supportive, not clinical. That matters so much right now."',
  '"I wish I had this with my first pregnancy. The mental health check-ins are so needed."',
  '"The design is calming. Everything about it made me feel safe."',
  '"Finally an app that treats postpartum like it\'s just as important as pregnancy."',
]

export default function CoraModal({ onClose }) {
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
        <button
          onClick={onClose}
          className="font-lexend text-sm text-[#334e6f] flex items-center gap-2 hover:opacity-60 transition-opacity"
        >
          ← Back to Work
        </button>
        <span className="font-lexend font-bold text-[#334e6f] text-sm">Maya Walsh</span>
      </nav>

      {/* Hero */}
      <div style={{ backgroundColor: PRIMARY }} className="flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
        <span
          className="leading-none select-none mb-6"
          style={{ fontFamily: "'Libre Caslon Display', serif", fontSize: 'clamp(72px, 14vw, 180px)', color: ACCENT }}
        >
          cora
        </span>
        <p className="font-lexend font-medium text-white/90 text-base md:text-lg italic mb-4">
          Care that puts you first
        </p>
        <p className="font-lexend text-white/75 text-sm md:text-base max-w-xl leading-relaxed">
          Cora is a health app designed to support first-time young mothers through pregnancy and postpartum mental wellness.
        </p>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-20">

        {/* Problem Statement */}
        <section className="rounded-2xl p-8 md:p-14" style={{ backgroundColor: PRIMARY }}>
          <h2 className="font-lexend font-black text-white text-2xl md:text-[36px] leading-none mb-6">
            Problem Statement
          </h2>
          <p className="font-lexend text-white/90 text-base md:text-lg leading-relaxed">
            How can we help first time young mothers not just throughout pregnancy but with mental health postpartum.
          </p>
        </section>

        {/* Secondary Research */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Secondary Research
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {RESEARCH_CARDS.map((c, i) => (
              <div key={i} className="rounded-2xl p-6 flex flex-col gap-3" style={{ backgroundColor: CARD_BG }}>
                <h3 className="font-lexend font-bold text-sm" style={{ color: PRIMARY }}>{c.title}</h3>
                <p className="font-lexend text-sm leading-relaxed" style={{ color: 'rgba(122,32,32,0.75)' }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Journey */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Journey
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr style={{ backgroundColor: PRIMARY }}>
                  {['', 'Discovery', 'Sign Up', 'Onboarding', 'Explore', 'Connect'].map((h, i) => (
                    <th key={i} className="font-lexend font-bold text-white text-xs md:text-sm p-4 text-left first:w-24">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOURNEY_ROWS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : ''} style={i % 2 !== 0 ? { backgroundColor: '#fff5f3' } : {}}>
                    <td className="font-lexend font-bold text-xs p-4 whitespace-nowrap" style={{ color: PRIMARY }}>{row.label}</td>
                    {row.cells.map((c, j) => (
                      <td key={j} className="font-lexend text-xs p-4 leading-relaxed" style={{ color: 'rgba(122,32,32,0.75)' }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Flow */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* On Boarding */}
            <div className="rounded-2xl p-6 md:p-8 flex flex-col gap-5" style={{ backgroundColor: CARD_BG }}>
              <h3 className="font-lexend font-bold text-sm uppercase tracking-widest" style={{ color: PRIMARY }}>on boarding</h3>
              <div className="flex flex-col gap-3">
                {ONBOARDING_FLOW.map((row, ri) => (
                  <div key={ri} className="flex flex-wrap gap-2">
                    {row.map((step, si) => (
                      <span
                        key={si}
                        className="font-lexend text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: ri === 0 ? PRIMARY : ri === 1 ? ACCENT : '#c04040' }}
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Flow */}
            <div className="rounded-2xl p-6 md:p-8 flex flex-col gap-5" style={{ backgroundColor: CARD_BG }}>
              <h3 className="font-lexend font-bold text-sm uppercase tracking-widest" style={{ color: PRIMARY }}>main flow</h3>
              <div className="flex flex-col gap-3">
                {MAIN_FLOW.map((row, ri) => (
                  <div key={ri} className="flex flex-wrap gap-2">
                    {row.map((step, si) => (
                      <span
                        key={si}
                        className="font-lexend text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: ri === 0 ? PRIMARY : ri === MAIN_FLOW.length - 1 ? '#c04040' : ACCENT }}
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* User Testing Insights */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Testing Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {TESTING_QUOTES.map((q, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: CARD_BG }}>
                <p className="font-lexend text-sm leading-relaxed italic" style={{ color: PRIMARY }}>{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prototype */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Prototype
          </h2>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
              src="https://embed.figma.com/proto/Kfq3tRWCL2HPqBFEnEjjHF/Perry-and-Maya-Project-3?node-id=80-235&scaling=scale-down&content-scaling=fixed&page-id=80%3A234&starting-point-node-id=80%3A235&embed-host=share"
              allowFullScreen
            />
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="py-10 flex justify-center" style={{ backgroundColor: PRIMARY }}>
        <button
          onClick={onClose}
          className="font-lexend font-medium text-white hover:opacity-70 transition-opacity"
        >
          ← Back to Portfolio
        </button>
      </div>

    </div>
  )
}

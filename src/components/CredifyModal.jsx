import { useEffect } from 'react'

const imgCredifyLogo = "/credify/icon.png"

const RESEARCH_CARDS = [
  {
    icon: '📋',
    title: 'Credit Awareness Gap',
    text: 'Many young adults (18–25) report never receiving formal education about credit scores or how they work.',
  },
  {
    icon: '📱',
    title: 'App Dissatisfaction',
    text: 'Existing credit apps are perceived as complex, data-heavy, and emotionally detached from users\' real financial goals.',
  },
  {
    icon: '🧠',
    title: 'Behavioral Motivation',
    text: 'Users respond better to progress-based feedback and small wins rather than abstract numerical scores.',
  },
  {
    icon: '🚩',
    title: 'Anxiety Around Credit',
    text: 'Credit is often associated with fear and shame — users feel overwhelmed rather than empowered by their current tools.',
  },
]

const INTERVIEW_QUOTES = [
  '"I wish I\'d known earlier that opening one credit card young and just using it responsibly can make a huge difference later."',
  '"I thought credit was only for people with money, but it\'s really just about habits."',
]

const TESTING_QUOTES = [
  '"It looks fresh and not like a boring bank app. The layout feels inviting."',
  '"The gamified reminders would definitely be more convenient than boring bank emails."',
  '"I actually feel less scared of credit now. It feels like something I can manage, not just something to worry about."',
  '"It reframed credit for me — it\'s not something risky, it follows good habits. I wish I had this during college."',
  '"Friendly and motivating. The colors and layout make it feel less stressful."',
  '"I could actually see why my score changed instead of just guessing."',
]

const JOURNEY_ROWS = [
  {
    label: 'Actions',
    cells: [
      'Hears about credit issues from peers',
      'Searches for credit apps',
      'Downloads Credify, creates account',
      'Views score, sets goals',
      'Follows tips, sees score improve',
    ],
  },
  {
    label: 'Thoughts',
    cells: [
      'Why does my credit matter?',
      'Which app is easiest to use?',
      'I hope this isn\'t overwhelming',
      'What does this number mean?',
      'This is actually working!',
    ],
  },
  {
    label: 'Pain Points',
    cells: [
      'No one taught me this',
      'Too many complex options',
      'Worried about privacy',
      'Data feels abstract',
      'Want faster progress',
    ],
  },
  {
    label: 'Opportunities',
    cells: [
      'Peer-driven awareness',
      'Simple, clear onboarding',
      'Trust-building UX',
      'Visual progress tracking',
      'Gamified milestone rewards',
    ],
  },
]

export default function CredifyModal({ onClose }) {
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
      <div className="bg-[#ff6900] flex flex-col items-center justify-center py-20 md:py-28 px-6 text-center">
        <img src={imgCredifyLogo} alt="Credify" className="w-20 md:w-28 h-auto mb-8 block" />
        <h1 className="font-lexend font-black text-white text-[36px] md:text-[64px] leading-none mb-6">
          Credify
        </h1>
        <p className="font-lexend text-white/90 text-base md:text-xl max-w-xl leading-relaxed">
          Credify is a credit app that helps young professionals build credit and reach their personal financial goals.
        </p>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-20">

        {/* Secondary Research */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Secondary Research
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {RESEARCH_CARDS.map((c, i) => (
              <div key={i} className="bg-[#fff3eb] rounded-2xl p-6 flex flex-col gap-3">
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-lexend font-bold text-[#334e6f] text-base">{c.title}</h3>
                <p className="font-lexend text-sm text-[rgba(51,78,111,0.8)] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.8)] leading-relaxed">
            Secondary research revealed a significant gap in financial literacy among young adults. Most apps prioritise data density over emotional engagement, leaving users feeling overwhelmed rather than empowered. Understanding this gap shaped Credify's core design philosophy: make credit simple, visual, and rewarding.
          </p>
        </section>

        {/* User Persona */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Persona
          </h2>
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
            <div className="bg-[#ff6900] h-2" />
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
              {/* Avatar placeholder */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#ffd4b8] flex-shrink-0 flex items-center justify-center text-5xl self-start">
                👤
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <h3 className="font-lexend font-black text-[#334e6f] text-2xl mb-3">Jason Smith</h3>
                  <div className="flex flex-col gap-1 font-lexend text-sm text-[rgba(51,78,111,0.8)]">
                    <span><strong className="text-[#334e6f]">Age:</strong> 24</span>
                    <span><strong className="text-[#334e6f]">Job Title:</strong> Recent Graduate</span>
                    <span><strong className="text-[#334e6f]">Location:</strong> Los Angeles, CA</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-lexend font-bold text-[#334e6f] text-sm mb-2">Objectives</h4>
                  <p className="font-lexend text-sm text-[rgba(51,78,111,0.8)] leading-relaxed">
                    Build a strong credit score to qualify for better loan rates and eventually purchase a home. Wants to feel financially confident without the confusion.
                  </p>
                </div>
                <div>
                  <h4 className="font-lexend font-bold text-[#334e6f] text-sm mb-2">Goals</h4>
                  <ul className="font-lexend text-sm text-[rgba(51,78,111,0.8)] leading-relaxed space-y-1 list-disc list-inside">
                    <li>Understand what actually affects his credit score</li>
                    <li>Get personalised tips without financial jargon</li>
                    <li>Track progress in a way that feels motivating, not stressful</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-[#e85500] rounded-2xl p-8 md:p-14">
          <h2 className="font-lexend font-black text-white text-2xl md:text-[36px] leading-none mb-6">
            Problem Statement
          </h2>
          <p className="font-lexend text-white/95 text-base md:text-lg leading-relaxed">
            Young professionals lack accessible, emotionally engaging tools to help them understand and manage their credit. Current fragmented, data-heavy credit apps create an experience that leaves users overwhelmed and uncertain about how their actions affect their scores. This complex topic is so expansive, inconsistent, and intrusive — badly shaping financial anxiety and instability.
          </p>
        </section>

        {/* User Journey */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Journey
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-[#ff6900]">
                  {['', 'Awareness', 'Research', 'Sign Up', 'Track', 'Improve'].map((h, i) => (
                    <th key={i} className="font-lexend font-bold text-white text-xs md:text-sm p-4 text-left first:w-24">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOURNEY_ROWS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fff8f4]'}>
                    <td className="font-lexend font-bold text-[#334e6f] text-xs p-4 whitespace-nowrap">{row.label}</td>
                    {row.cells.map((c, j) => (
                      <td key={j} className="font-lexend text-xs text-[rgba(51,78,111,0.8)] p-4 leading-relaxed">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Interview Insights */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Interview Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INTERVIEW_QUOTES.map((q, i) => (
              <div key={i} className="bg-[#ff6900] rounded-2xl p-8 flex items-center">
                <p className="font-lexend text-white text-base md:text-lg leading-relaxed italic">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Testing */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            User Testing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {TESTING_QUOTES.map((q, i) => (
              <div key={i} className="bg-[#fff3eb] rounded-2xl p-6">
                <p className="font-lexend text-sm text-[#334e6f] leading-relaxed italic">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prototype */}
        <section>
          <h2 className="font-lexend font-black text-[#334e6f] text-2xl md:text-[36px] leading-none mb-8">
            Prototype
          </h2>
          {/* 16:9 responsive container */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.12)]" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
              src="https://embed.figma.com/proto/uwN05e30mVgp5G1gHWWagS/Sajedah--Leandra--and-Maya?node-id=259-7&scaling=scale-down&content-scaling=fixed&page-id=176%3A195&starting-point-node-id=259%3A7&embed-host=share"
              allowFullScreen
            />
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="bg-[#ff6900] py-10 flex justify-center">
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

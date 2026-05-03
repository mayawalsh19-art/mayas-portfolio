import { useState } from 'react'
import CredifyModal from './CredifyModal'
import CoraModal from './CoraModal'
import DutchBrosModal from './DutchBrosModal'
import SelfPortraitModal from './SelfPortraitModal'
import WildFireModal from './WildFireModal'
import HellgrimModal from './HellgrimModal'
import FanFormationModal from './FanFormationModal'

const imgCredifyIcon  = "https://www.figma.com/api/mcp/asset/1eb13b72-9af5-4450-877c-74f7ef7fc3df"
const imgDutchBros    = "https://www.figma.com/api/mcp/asset/e757a7f6-6a27-4e42-8174-237e030154df"
const imgSelfPortrait = "https://www.figma.com/api/mcp/asset/d005406a-44df-4c11-97ad-cf18ae20aab1"
const imgWildFire     = "https://www.figma.com/api/mcp/asset/f59a4198-9661-4094-a94c-004b72b5391d"
const imgHellgrim     = "https://www.figma.com/api/mcp/asset/86065aec-e9b5-4f68-9ac6-5afbaa6f295a"

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

export default function FeaturedWork() {
  const [showCredify, setShowCredify] = useState(false)
  const [showCora, setShowCora] = useState(false)
  const [showDutchBros, setShowDutchBros] = useState(false)
  const [showSelfPortrait, setShowSelfPortrait] = useState(false)
  const [showWildFire, setShowWildFire] = useState(false)
  const [showHellgrim, setShowHellgrim] = useState(false)
  const [showFanFormation, setShowFanFormation] = useState(false)

  return (
    <>
    {showCredify && <CredifyModal onClose={() => setShowCredify(false)} />}
    {showCora && <CoraModal onClose={() => setShowCora(false)} />}
    {showDutchBros && <DutchBrosModal onClose={() => setShowDutchBros(false)} />}
    {showSelfPortrait && <SelfPortraitModal onClose={() => setShowSelfPortrait(false)} />}
    {showWildFire && <WildFireModal onClose={() => setShowWildFire(false)} />}
    {showHellgrim && <HellgrimModal onClose={() => setShowHellgrim(false)} />}
    {showFanFormation && <FanFormationModal onClose={() => setShowFanFormation(false)} />}
    <section id="work" className="bg-[#f2e9da] w-full py-12 md:py-24 px-6 md:px-[74.5px]">
      <h2 className="font-lexend font-black text-[#334e6f] text-[30px] md:text-[48px] leading-none mb-8 md:mb-12">
        Featured Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* Credify */}
        <Card title="Credify" bg="bg-[#ff6900]" link={false}
          onClick={() => setShowCredify(true)}
          desc="A credit app that helps young professionals build credit and reach their personal financial goals.">
          <div className="flex flex-col items-center gap-3">
            <img src={imgCredifyIcon} alt="" className="w-14 md:w-20 h-auto shrink-0 block" />
            <span className="font-lexend font-black text-white text-[32px] md:text-[48px] leading-none">Credify</span>
          </div>
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
          <img src={imgDutchBros} alt="Dutch Bros" className="h-32 md:h-44 w-auto shrink-0 block" />
        </Card>

        {/* Self Portrait */}
        <Card title="Self Portrait" bg="bg-[#fad1e3]" link={false}
          onClick={() => setShowSelfPortrait(true)}
          desc="A self portrait icon showing vectorized skills and personality.">
          <div className="h-36 md:h-52 rounded-xl overflow-hidden shrink-0">
            <img src={imgSelfPortrait} alt="Self Portrait" className="h-full w-auto block" />
          </div>
        </Card>

        {/* Wild Fire */}
        <Card title="Wild Fire" bg="bg-white" link={false}
          onClick={() => setShowWildFire(true)}
          desc="Wild Fire explores editorial and publication design through the translation of a long-form NYT Magazine article.">
          <img src={imgWildFire} alt="Wild Fire" className="h-32 md:h-44 w-auto shrink-0 block" />
        </Card>

        {/* Hellgrim */}
        <Card title="Hellgrim" bg="bg-black" link={false}
          onClick={() => setShowHellgrim(true)}
          desc="Hellgrim explores modular typography through the design of a rule-based typeface.">
          <img src={imgHellgrim} alt="Hellgrim" className="h-16 md:h-20 w-auto shrink-0 block" />
        </Card>

        {/* Fan Formation — full width on desktop */}
        <Card title="Fan Formation" bg="bg-white" full link={false}
          onClick={() => setShowFanFormation(true)}
          desc="Fan Formation is a wearable system that synchronizes crowd energy into a coordinated and inclusive stadium experience.">
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 6vw, 72px)', color: '#334e6f', letterSpacing: '-0.02em' }}>
            Fan Formation
          </span>
        </Card>

      </div>
    </section>
    </>
  )
}

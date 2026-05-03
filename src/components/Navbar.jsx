const logoIcon = "https://www.figma.com/api/mcp/asset/97d48bdb-721b-466c-8496-3852a4c9353a"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 h-[68px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 h-9 w-14">
          <img src={logoIcon} alt="MW" className="h-full w-full object-contain" />
        </div>
        <span className="font-lexend font-bold text-[#334e6f] text-xl hidden md:block">Maya Walsh</span>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex gap-6">
        {['Work', 'About', 'Contact'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="font-lexend text-[#334e6f] text-sm tracking-[-0.01em] hover:opacity-70 transition-opacity">{l}</a>
        ))}
      </div>
      {/* Mobile links */}
      <div className="flex md:hidden gap-6">
        {['Home', 'About', 'Work', 'Contact'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="font-lexend font-medium text-[#334e6f] text-xs tracking-[-0.02em]">{l}</a>
        ))}
      </div>
    </nav>
  )
}

const logoIcon = "https://www.figma.com/api/mcp/asset/97d48bdb-721b-466c-8496-3852a4c9353a"

export default function Footer() {
  return (
    <footer className="bg-[#334e6f] w-full px-6 md:px-[74.5px] py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="shrink-0 h-9 w-14">
          <img src={logoIcon} alt="MW" className="h-full w-full object-contain" />
        </div>
        <span className="font-lexend font-bold text-white text-lg">Maya Walsh</span>
      </div>
      <p className="font-lexend text-sm text-white/70">
        © 2026 Maya Walsh. All rights reserved.
      </p>
    </footer>
  )
}

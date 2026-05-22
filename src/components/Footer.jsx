export default function Footer() {
  return (
    <footer className="bg-[#334e6f] w-full px-6 md:px-[74.5px] py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="shrink-0 h-10 w-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
          <img src="/mw_logo_clean.png" alt="MW" className="w-full h-full object-contain p-1" />
        </div>
        <span className="font-lexend font-bold text-white text-lg">Maya Walsh</span>
      </div>
      <p className="font-lexend text-sm text-white/70">
        © 2026 Maya Walsh. All rights reserved.
      </p>
    </footer>
  )
}

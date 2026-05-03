export default function Contact() {
  return (
    <section id="contact" className="bg-[#f2e9da] w-full py-16 md:py-24 px-6 md:px-[74.5px] flex flex-col items-center text-center gap-8">
      <h2 className="font-lexend font-black text-[#334e6f] text-[32px] md:text-[56px] leading-tight max-w-3xl">
        Let's Create Together
      </h2>
      <p className="font-lexend text-base md:text-lg text-[rgba(51,78,111,0.75)] leading-relaxed max-w-2xl">
        I'm always open to new opportunities and collaborations. Whether you have a project in mind or just want to chat about design, I'd love to hear from you.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-2">
        {/* Email — filled */}
        <a
          href="mailto:mayawalsh2004@icloud.com"
          className="flex items-center gap-2 border border-[#334e6f] text-[#334e6f] font-lexend text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#334e6f] hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          mayawalsh2004@icloud.com
        </a>

        {/* LinkedIn — outlined */}
        <a
          href="https://www.linkedin.com/in/maya-walsh-632872252"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-[#334e6f] text-[#334e6f] font-lexend text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#334e6f] hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          LinkedIn
        </a>

        {/* Behance — outlined */}
        <a
          href="https://www.behance.net/mayawalsh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-[#334e6f] text-[#334e6f] font-lexend text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#334e6f] hover:text-white transition-colors"
        >
          Behance
        </a>
      </div>
    </section>
  )
}

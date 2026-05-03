const paragraphs = [
  `Hi, I'm Maya Walsh – a UI/UX designer who believes that great digital experiences are born from the perfect blend of aesthetics and functionality.`,
  `With a keen eye for detail and a love for minimalist design, I specialize in creating user-centered interfaces that are both beautiful and intuitive. My work spans across web design, brand identity, and interactive experiences.`,
  `I thrive in collaborative, team-driven environments where ideas are built through shared feedback and iteration. I actively integrate AI tools like Figma's AI features, Gemini, and ChatGPT into my workflow to enhance ideation, streamline design processes, and explore solutions more efficiently. By combining human-centered thinking with emerging technologies, I'm able to move quickly while still prioritizing thoughtful, intuitive design.`,
]

export default function AboutMe() {
  return (
    <section id="about" className="bg-white w-full py-12 md:py-16">
      <div className="px-6 md:px-16 lg:px-24">
        <h2 className="font-lexend font-black text-[#334e6f] text-[30px] md:text-[48px] leading-none mb-8">
          About Me
        </h2>
        <div className="flex flex-col gap-5 md:gap-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-lexend text-sm md:text-[18px] leading-relaxed text-[rgba(51,78,111,0.8)]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

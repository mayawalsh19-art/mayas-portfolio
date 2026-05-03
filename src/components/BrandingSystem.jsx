const COLORS = [
  '#334e6f',
  '#7fa8c9',
  '#b5cfe0',
  '#a8bfcc',
]

const TYPE_LEFT   = ['Light', 'Regular', 'SemiBold', 'Black']
const TYPE_MID    = ['Extra Light', 'Thin', 'Medium', 'Bold']
const TYPE_RIGHT  = ['Extra Bold']

const WEIGHT_MAP = {
  'Light':       300,
  'Regular':     400,
  'Extra Light': 200,
  'Thin':        100,
  'SemiBold':    600,
  'Medium':      500,
  'Black':       900,
  'Bold':        700,
  'Extra Bold':  800,
}

const BARS = [
  { color: '#334e6f', w: '100%' },
  { color: '#7fa8c9', w: '68%'  },
  { color: '#b5cfe0', w: '48%'  },
]

export default function BrandingSystem() {
  return (
    <section className="bg-white w-full py-12 md:py-24 px-6 md:px-[74.5px]">
      <h2 className="font-lexend font-black text-[#334e6f] text-[30px] md:text-[48px] leading-none mb-8 md:mb-12">
        Branding System
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* Color */}
        <div className="bg-[#f2e9da] rounded-2xl p-8 md:p-10 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h3 className="font-lexend font-black text-[#334e6f] text-xl md:text-2xl">Color</h3>
            <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.75)] leading-relaxed">
              Carefully curated palettes that evoke emotion and create visual hierarchy. Every hue serves a purpose.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((c, i) => (
              <div
                key={i}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/60 shadow-sm flex-shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="bg-[#f2e9da] rounded-2xl p-8 md:p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-lexend font-black text-[#334e6f] text-xl md:text-2xl">Typography</h3>
            <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.75)] leading-relaxed">
              Lexend font family brings clarity and readability. From thin to black, every weight has its place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              {TYPE_LEFT.map(w => (
                <span key={w} className="font-lexend text-sm text-[#334e6f]" style={{ fontWeight: WEIGHT_MAP[w] }}>{w}</span>
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              {TYPE_MID.map(w => (
                <span key={w} className="font-lexend text-sm text-[#334e6f]" style={{ fontWeight: WEIGHT_MAP[w] }}>{w}</span>
              ))}
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-2">
              {TYPE_RIGHT.map(w => (
                <span key={w} className="font-lexend text-sm text-[#334e6f]" style={{ fontWeight: WEIGHT_MAP[w] }}>{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Simplicity */}
        <div className="bg-[#f2e9da] rounded-2xl p-8 md:p-10 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h3 className="font-lexend font-black text-[#334e6f] text-xl md:text-2xl">Simplicity</h3>
            <p className="font-lexend text-sm md:text-base text-[rgba(51,78,111,0.75)] leading-relaxed">
              Clean, minimal interfaces that let content breathe. Less is more, but every detail matters.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {BARS.map((b, i) => (
              <div
                key={i}
                className="h-8 md:h-10 rounded-full"
                style={{ backgroundColor: b.color, width: b.w }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

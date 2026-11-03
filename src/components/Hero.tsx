import React from 'react';

interface HeroProps {
  doneCount: number;
  totalTopics: number;
  scoreCount: number;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  doneCount,
  totalTopics,
  scoreCount,
  onExploreClick,
}) => {
  return (
    <section id="home" className="py-8 md:py-16 border-b border-white/10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/15 text-xs font-bold tracking-widest text-neutral-200 uppercase backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
            <span>ITV-304</span>
            <span className="w-1 h-1 rounded-full bg-white/40"></span>
            <span>B.VOC IoT</span>
            <span className="w-1 h-1 rounded-full bg-white/40"></span>
            <span>3 CREDITS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Master the <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent underline decoration-white/30 decoration-2 underline-offset-8">
              8051.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#a8b2c2] max-w-xl leading-relaxed">
            Learning the 8051 gets much easier when you can see what is happening, try it yourself, and come back to it whenever you need.
            This space brings your five ITV-304 units together with clear explanations in English and Hindi, visual guides, assembly practice, and exam preparation.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {['5 Units', 'English + Hindi', 'Visual diagrams', 'Interactive Simulator', 'Exam practice'].map((c) => (
              <span
                key={c}
                className="px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/15 text-xs font-semibold text-neutral-200 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md pt-2">
            <div className="frost-glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">5</span>
              <span className="text-xs text-[#a0aab8] font-medium">Syllabus Units</span>
            </div>
            <div className="frost-glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                {doneCount}<span className="text-xs text-[#777] font-normal">/{totalTopics}</span>
              </span>
              <span className="text-xs text-[#a0aab8] font-medium">Topics Done</span>
            </div>
            <div className="frost-glass rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">{scoreCount}</span>
              <span className="text-xs text-[#a0aab8] font-medium">Quiz Points</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={onExploreClick}
              className="frost-btn-primary px-6 py-3 rounded-xl font-extrabold text-sm active:scale-95"
            >
              Let’s Start Learning →
            </button>
            <a
              href="#simulator"
              className="frost-btn px-5 py-3 rounded-xl text-white font-bold text-sm"
            >
              Try the Simulator 💻
            </a>
            <a
              href="#baud-solver"
              className="frost-btn px-5 py-3 rounded-xl text-cyan-300 font-bold text-sm border-cyan-500/30 hover:border-cyan-400"
            >
              Baud Solver 📐
            </a>
            <a
              href="#theory"
              className="frost-btn px-5 py-3 rounded-xl text-white font-bold text-sm border-white/20 hover:border-white/40"
            >
              Theory Modules 🏛️
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="frost-glass rounded-3xl p-6 sm:p-7 relative overflow-hidden group shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-3.5 right-4 text-[10px] tracking-widest text-[#7d8799] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
              MCS-51 DIP-40
            </div>

            <svg
              viewBox="0 0 440 300"
              className="w-full h-auto drop-shadow-2xl select-none"
              role="img"
              aria-label="Illustration of an 8051 microcontroller"
            >
              {/* IC Main Glass Body */}
              <rect
                x="130"
                y="35"
                width="180"
                height="230"
                rx="18"
                fill="rgba(16, 22, 32, 0.85)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2.5"
              />
              <path
                d="M190 35a30 30 0 0 1 60 0"
                fill="none"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2.5"
              />
              <text
                x="220"
                y="145"
                fill="#ffffff"
                fontSize="34"
                textAnchor="middle"
                fontWeight="900"
                fontFamily="Inter, sans-serif"
              >
                8051
              </text>
              <text
                x="220"
                y="173"
                fill="#cbd5e1"
                fontSize="12"
                textAnchor="middle"
                letterSpacing="3"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                MICROCONTROLLER
              </text>

              <g stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M130 65H70M130 95H70M130 125H70M130 155H70M130 185H70M130 215H70M310 65H370M310 95H370M310 125H370M310 155H370M310 185H370M310 215H370" />
              </g>

              <g fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace">
                <text x="24" y="69">P1 (1-8)</text>
                <text x="24" y="99">RST (9)</text>
                <text x="24" y="129">P3 (10-17)</text>
                <text x="24" y="159">XTAL (18/19)</text>
                <text x="24" y="189">GND (20)</text>
                <text x="24" y="219">VCC (40)</text>

                <text x="376" y="69">P0 (39-32)</text>
                <text x="376" y="99">EA (31)</text>
                <text x="376" y="129">ALE (30)</text>
                <text x="376" y="159">PSEN (29)</text>
                <text x="376" y="189">P2 (21-28)</text>
              </g>

              <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2">
                <path d="M150 265v20m20-20v20m20-20v20m20-20v20m20-20v20m20-20v20m20-20v20m20-20v20" />
              </g>
            </svg>

            <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-[#a0aab8]">
              <span>CPU + 128B RAM + 4KB ROM</span>
              <span className="font-mono text-white/90">40-Pin Dual Inline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

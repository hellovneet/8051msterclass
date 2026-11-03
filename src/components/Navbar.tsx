import React from 'react';

interface NavbarProps {
  language: 'both' | 'en' | 'hi';
  onLanguageChange: (lang: 'both' | 'en' | 'hi') => void;
  doneCount: number;
  score: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  doneCount,
  score,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#06080c]/65 backdrop-blur-2xl border-b border-white/10 px-4 md:px-8 py-3 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_30px_-10px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <a href="#home" className="flex items-center gap-2.5 text-white font-black tracking-wider text-base md:text-lg group">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/95 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(255,255,255,0.4),inset_0_1px_1px_#fff] group-hover:scale-105 transition-transform">
            ⚡
          </span>
          <span className="tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
            8051 MASTERCLASS
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 text-xs font-semibold text-[#a8b2c2] no-scrollbar">
          {[
            { href: '#home', label: 'Home' },
            { href: '#syllabus', label: 'Syllabus' },
            { href: '#learn', label: 'Learn' },
            { href: '#simulator', label: 'Simulator' },
            { href: '#baud-solver', label: 'Baud Solver' },
            { href: '#theory', label: 'Theory Modules' },
            { href: '#circuits', label: 'Circuits' },
            { href: '#labmanual', label: 'Lab Manual' },
            { href: '#exambank', label: 'Exam Bank' },
            { href: '#studytools', label: 'Tools' },
            { href: '#flashcards', label: 'Flashcards' },
            { href: '#programs', label: 'Programs' },
            { href: '#quiz', label: 'Quiz' },
            { href: '#revision', label: 'Revision' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 rounded-lg border border-transparent hover:border-white/20 hover:bg-white/[0.08] hover:text-white hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 text-xs text-[#a0aab8] border border-white/10 px-3 py-1.5 rounded-xl bg-white/[0.04] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <span>Done: <strong className="text-white font-mono">{doneCount}</strong></span>
            <span className="text-white/20">•</span>
            <span>Score: <strong className="text-white font-mono">{score}</strong></span>
          </div>

          <select
            id="language"
            aria-label="Language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as 'both' | 'en' | 'hi')}
            className="bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs border border-white/20 rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/50 cursor-pointer font-medium backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all"
          >
            <option value="both" className="bg-[#0b0e14] text-white">English + हिंदी</option>
            <option value="en" className="bg-[#0b0e14] text-white">English</option>
            <option value="hi" className="bg-[#0b0e14] text-white">हिंदी</option>
          </select>
        </div>
      </div>
    </header>
  );
};

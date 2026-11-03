import React from 'react';
import { revisionData } from '../data/revision';
import { BookCheck } from 'lucide-react';

export const RevisionSection: React.FC = () => {
  return (
    <section id="revision" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          BEFORE THE EXAM
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Rapid Revision Sheet
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Key facts, SFR memory maps, mark distribution frameworks, and critical architectural distinctions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revisionData.map((card, idx) => (
          <div
            key={idx}
            className="frost-glass rounded-3xl p-6 flex flex-col justify-between hover:border-white/25 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-white/10">
                <BookCheck className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {card.title}
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-[#b8c4d4] leading-relaxed">
                {card.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 opacity-80 shadow-[0_0_6px_#fff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/10 text-[10px] text-[#718096] font-mono text-right">
              ITV-304 Key Reference
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

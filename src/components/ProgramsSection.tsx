import React, { useState } from 'react';
import { assemblyPrograms } from '../data/programs';
import { Code2, Check, Copy } from 'lucide-react';

export const ProgramsSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="programs" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          ASSEMBLY PRACTICE
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          8051 Program Examples
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Essential handwritten assembly snippets frequently requested in lab tests and theory papers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assemblyPrograms.slice(0, 3).map((prog, idx) => (
          <div
            key={idx}
            className="frost-glass rounded-3xl p-6 flex flex-col justify-between hover:border-white/25 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-white" />
                  <span>{prog.title}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleCopy(prog.code, idx)}
                  className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 bg-white/[0.06] border border-white/15 px-2.5 py-1 rounded-lg transition-colors hover:bg-white/[0.12]"
                  title="Copy assembly code"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span className="text-white text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#030508]/85 border border-white/15 rounded-2xl p-4 font-mono text-xs sm:text-sm text-[#f5f8fc] overflow-x-auto leading-relaxed mb-4 select-all backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <pre className="whitespace-pre">{prog.code}</pre>
              </div>
            </div>

            <p className="text-xs text-[#8e9bb0] frost-glass-panel p-3.5 rounded-2xl leading-relaxed">
              {prog.explanation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

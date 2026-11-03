import React, { useState } from 'react';
import { labExperiments } from '../data/labExperiments';
import { BookOpen, Copy, Check, HelpCircle, CircuitBoard } from 'lucide-react';

interface LabManualSectionProps {
  language: 'both' | 'en' | 'hi';
}

export const LabManualSection: React.FC<LabManualSectionProps> = ({ language }) => {
  const [selectedExpIdx, setSelectedExpIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const exp = labExperiments[selectedExpIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exp.assemblyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showEn = language !== 'hi';
  const showHi = language !== 'en';

  return (
    <section id="labmanual" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          PRACTICAL LABORATORY MANUAL
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          8051 Lab Experiments & Viva Voce
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Full university-grade laboratory writeups including aims, algorithms, tested assembly codes, schematics, and viva examination questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Experiments Index Sidebar */}
        <div className="lg:col-span-4 frost-glass rounded-3xl p-5 sticky top-24 max-h-[75vh] flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-[#9aa4b4] pb-3.5 mb-3 border-b border-white/10 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-white" />
            <span>Experiments ({labExperiments.length})</span>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {labExperiments.map((item, idx) => {
              const active = idx === selectedExpIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedExpIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs font-medium transition-all flex items-start gap-2.5 border ${
                    active
                      ? 'bg-white/[0.12] border-white/40 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_16px_rgba(255,255,255,0.1)]'
                      : 'bg-white/[0.02] border-transparent text-[#b0bccf] hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-xs text-neutral-400 mt-0.5 shrink-0">
                    #{item.id}.
                  </span>
                  <span className="line-clamp-2 leading-relaxed">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Experiment Details */}
        <div className="lg:col-span-8 frost-glass rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/20 text-[10px] font-mono text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                EXPERIMENT {exp.id}
              </span>
              <span className="text-xs text-[#808c9f]">ITV-304 Practical Syllabus</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {exp.title}
            </h3>
          </div>

          {/* Aim & Components */}
          <div className="frost-glass-panel rounded-2xl p-4 space-y-3 text-xs">
            <div>
              <strong className="text-white block mb-1 font-semibold">Aim:</strong>
              <p className="text-neutral-300 leading-relaxed">{exp.aim}</p>
            </div>
            <div>
              <strong className="text-white block mb-1 font-semibold">Required Components:</strong>
              <div className="flex flex-wrap gap-1.5">
                {exp.components.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Theory (Bilingual) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Theoretical Background
            </h4>
            <div className={`grid gap-4 ${showEn && showHi ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {showEn && (
                <div className="frost-glass-panel rounded-2xl p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">🇬🇧 English</span>
                  <p className="text-neutral-300 leading-relaxed">{exp.theoryEn}</p>
                </div>
              )}
              {showHi && (
                <div className="frost-glass-panel rounded-2xl p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">🇮🇳 हिंदी</span>
                  <p className="text-neutral-300 leading-relaxed">{exp.theoryHi}</p>
                </div>
              )}
            </div>
          </div>

          {/* Hardware Circuit Notes */}
          <div className="frost-glass-panel rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <CircuitBoard className="w-4 h-4 text-neutral-300" />
              <span>Hardware Setup & Pin Connections</span>
            </div>
            <p className="text-[#a0aec0] leading-relaxed">{exp.circuitNotes}</p>
          </div>

          {/* Algorithm */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Step-by-Step Algorithm
            </h4>
            <div className="frost-glass-panel rounded-2xl p-4 space-y-1.5 text-neutral-300">
              {exp.algorithm.map((step, i) => (
                <div key={i} className="leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Assembly Program Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Tested 8051 Assembly Program
              </h4>
              <button
                type="button"
                onClick={handleCopyCode}
                className="frost-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="bg-[#030508]/85 border border-white/15 rounded-2xl p-4 font-mono text-xs text-[#f5f8fc] overflow-x-auto leading-relaxed select-all backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <pre className="whitespace-pre">{exp.assemblyCode}</pre>
            </div>
          </div>

          {/* Expected Result */}
          <div className="frost-glass-panel border-white/20 rounded-2xl p-4 text-xs text-neutral-200 space-y-1">
            <strong className="text-white block font-semibold">Expected Experimental Result:</strong>
            <p className="leading-relaxed text-[#c8d2df]">{exp.expectedResult}</p>
          </div>

          {/* Viva Questions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
              <HelpCircle className="w-4 h-4 text-neutral-300" />
              <span>Oral Viva Voce Questions & Answers</span>
            </div>
            <div className="space-y-3">
              {exp.vivaQuestions.map((v, i) => (
                <div key={i} className="frost-glass-panel rounded-2xl p-4 space-y-2 text-xs">
                  <div className="text-white font-bold">Q{i + 1}: {v.q}</div>
                  <div className="text-neutral-300 pl-3.5 border-l-2 border-white/30 space-y-1">
                    <div><strong>En:</strong> {v.aEn}</div>
                    {showHi && <div className="text-neutral-400"><strong>Hi:</strong> {v.aHi}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

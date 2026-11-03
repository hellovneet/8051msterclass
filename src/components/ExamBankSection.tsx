import React, { useState } from 'react';
import { examQuestionsBank } from '../data/examQuestions';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface ExamBankSectionProps {
  language: 'both' | 'en' | 'hi';
}

export const ExamBankSection: React.FC<ExamBankSectionProps> = ({ language }) => {
  const [filterMarks, setFilterMarks] = useState<number | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('eq1');

  const filtered = filterMarks === 'all'
    ? examQuestionsBank
    : examQuestionsBank.filter((q) => q.marks === filterMarks);

  const showEn = language !== 'hi';
  const showHi = language !== 'en';

  return (
    <section id="exambank" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
            EXAM PREPARATION PORTAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            University Question Bank & Model Solutions
          </h2>
          <p className="text-sm text-[#8895a7] mt-1">
            Categorized 2-Mark, 5-Mark, and 10-Mark university exam questions with complete scoring breakdowns and numerical timer solutions.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          {(['all', 2, 5, 10] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFilterMarks(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filterMarks === m
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'border-transparent text-[#8e9bb0] hover:text-white'
              }`}
            >
              {m === 'all' ? 'All Questions' : `${m} Marks`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="frost-glass rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/25 shadow-lg"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.08] border border-white/20 text-[10px] font-mono font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                      {item.marks} MARKS
                    </span>
                    <span className="text-xs text-[#808c9f]">Unit {item.unit}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.question}
                  </h3>
                  {showHi && (
                    <div className="text-xs text-[#a0aec0] font-medium">
                      {item.questionHi}
                    </div>
                  )}
                </div>

                <div className="text-neutral-300 p-1.5 rounded-xl bg-white/[0.06] border border-white/15 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-4 text-xs">
                  {/* Model Answer */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#9aa4b4]">
                      Standard University Model Answer
                    </div>

                    {showEn && (
                      <div className="frost-glass-panel rounded-2xl p-4 text-neutral-200 leading-relaxed whitespace-pre-line font-normal">
                        {item.modelAnswerEn}
                      </div>
                    )}

                    {showHi && (
                      <div className="frost-glass-panel rounded-2xl p-4 text-neutral-300 leading-relaxed whitespace-pre-line font-normal">
                        <strong className="text-white block mb-1">हिंदी में उत्तर:</strong>
                        {item.modelAnswerHi}
                      </div>
                    )}
                  </div>

                  {/* Marking Scheme Key Points */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Examiner Checklist / Mandatory Scoring Points</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[#a0aec0]">
                      {item.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

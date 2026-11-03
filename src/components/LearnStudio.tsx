import React from 'react';
import { Unit } from '../data/units';
import { Check, Star, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

interface LearnStudioProps {
  units: Unit[];
  currentUnit: number;
  currentTopic: number;
  language: 'both' | 'en' | 'hi';
  completedSet: Set<string>;
  bookmarkedSet: Set<string>;
  onSelectUnit: (unitIdx: number) => void;
  onSelectTopic: (topicIdx: number) => void;
  onToggleDone: () => void;
  onToggleBookmark: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const LearnStudio: React.FC<LearnStudioProps> = ({
  units,
  currentUnit,
  currentTopic,
  language,
  completedSet,
  bookmarkedSet,
  onSelectUnit,
  onSelectTopic,
  onToggleDone,
  onToggleBookmark,
  onPrev,
  onNext,
}) => {
  const unit = units[currentUnit];
  const topic = unit?.topics[currentTopic] || unit?.topics[0];
  const topicKey = `${currentUnit}-${currentTopic}`;
  const isDone = completedSet.has(topicKey);
  const isBookmarked = bookmarkedSet.has(topicKey);

  const showEn = language !== 'hi';
  const showHi = language !== 'en';

  return (
    <section id="learn" className="py-12 scroll-mt-20 border-t border-white/10">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-black text-white px-2.5 py-0.5 rounded-lg bg-white/[0.08] border border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
              UNIT 0{currentUnit + 1}
            </span>
            <span className="text-xs text-[#8e9bb0]">
              Lesson {currentTopic + 1} of {unit.topics.length}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {topic.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#8e9bb0] mt-0.5">
            {unit.title}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isBookmarked
                ? 'bg-[#3b3014]/70 border-[#eab308]/60 text-[#fef08a] shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                : 'frost-btn text-neutral-200'
            }`}
            title="Bookmark this topic for quick revision"
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#fef08a]' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleDone}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              isDone
                ? 'bg-white/[0.12] border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'frost-btn-primary'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isDone ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Topic Navigator */}
        <aside className="lg:col-span-4 frost-glass rounded-3xl p-5 sticky top-24 max-h-[75vh] flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9aa4b4]">
              Unit Topics ({unit.topics.length})
            </span>
            <select
              value={currentUnit}
              onChange={(e) => onSelectUnit(Number(e.target.value))}
              className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs border border-white/20 rounded-lg px-2.5 py-1 cursor-pointer focus:outline-none backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              {units.map((u, i) => (
                <option key={u.id} value={i} className="bg-[#0c0f16] text-white">
                  Unit {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {unit.topics.map((t, i) => {
              const selected = i === currentTopic;
              const completed = completedSet.has(`${currentUnit}-${i}`);
              const marked = bookmarkedSet.has(`${currentUnit}-${i}`);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectTopic(i)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 border ${
                    selected
                      ? 'bg-white/[0.12] border-white/40 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_16px_rgba(255,255,255,0.1)]'
                      : 'bg-white/[0.02] border-transparent text-[#b0bccf] hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="line-clamp-2">
                    {i + 1}. {t.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {marked && <Star className="w-3 h-3 text-[#fef08a] fill-[#fef08a]" />}
                    {completed && (
                      <span className="w-4 h-4 rounded-full bg-white/[0.15] border border-white/30 flex items-center justify-center text-[10px] text-white font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Lesson Body */}
        <article className="lg:col-span-8 frost-glass rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[11px] font-mono text-neutral-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              UNIT 0{currentUnit + 1}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[11px] font-mono text-neutral-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              CORE CONCEPT
            </span>
            {isDone && (
              <span className="px-3 py-1 rounded-lg bg-white/[0.12] border border-white/30 text-[11px] font-mono text-white font-bold">
                COMPLETED
              </span>
            )}
          </div>

          {/* Bilingual Explanations */}
          <div className={`grid gap-5 ${showEn && showHi ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {showEn && (
              <div className="frost-glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
                  <span>🇬🇧</span>
                  <h4>English Explanation</h4>
                </div>
                <p className="text-sm text-[#d4dde8] leading-relaxed">
                  {topic.enExplanation}
                </p>
                <div className="bg-white/[0.04] border border-white/15 rounded-xl p-3 text-xs text-[#a0aab8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <strong className="text-white block mb-1">Key Point to Remember:</strong>
                  {topic.enRemember}
                </div>
              </div>
            )}

            {showHi && (
              <div className="frost-glass-panel rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
                  <span>🇮🇳</span>
                  <h4>हिंदी में समझें</h4>
                </div>
                <p className="text-sm text-[#d4dde8] leading-relaxed">
                  {topic.hiExplanation}
                </p>
                <div className="bg-white/[0.04] border border-white/15 rounded-xl p-3 text-xs text-[#a0aab8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <strong className="text-white block mb-1">याद रखें:</strong>
                  {topic.hiRemember}
                </div>
              </div>
            )}
          </div>

          {/* Visual Concept Map Diagram */}
          <div className="frost-glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Visual Concept Flow
              </h3>
              <span className="text-[11px] text-[#808c9f] font-mono">Exam Blueprint</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <div className="bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-center min-w-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <div className="font-bold text-white text-sm">Concept</div>
                <div className="text-[11px] text-[#909dae]">Understand definition</div>
              </div>
              <div className="text-white/40 text-lg font-bold">→</div>
              <div className="bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-center min-w-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <div className="font-bold text-white text-sm">Working</div>
                <div className="text-[11px] text-[#909dae]">Pins, registers, bus</div>
              </div>
              <div className="text-white/40 text-lg font-bold">→</div>
              <div className="bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-center min-w-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <div className="font-bold text-white text-sm">Application</div>
                <div className="text-[11px] text-[#909dae]">Code & hardware hookup</div>
              </div>
            </div>

            <p className="text-xs text-[#808c9f] text-center border-t border-white/10 pt-3">
              Use this flow to explain the topic in an exam: <strong>definition → working → example/application</strong>.
            </p>
          </div>

          {/* Exam writing tip */}
          <div className="frost-glass-panel border-white/20 rounded-2xl p-4 text-xs text-[#c8d2df] leading-relaxed flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Exam writing tip:</strong>
              Start with a precise definition, add a labelled diagram where relevant, explain working in numbered steps, and finish with an application or example.
            </div>
          </div>

          {/* Bottom navigation buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentUnit === 0 && currentTopic === 0}
              className="frost-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Topic</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={currentUnit === units.length - 1 && currentTopic === unit.topics.length - 1}
              className="frost-btn-primary flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>Next Topic</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

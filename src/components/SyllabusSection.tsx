import React from 'react';
import { Unit } from '../data/units';
import { ArrowRight, Check } from 'lucide-react';

interface SyllabusSectionProps {
  units: Unit[];
  completedSet: Set<string>;
  onSelectUnit: (unitIndex: number) => void;
}

export const SyllabusSection: React.FC<SyllabusSectionProps> = ({
  units,
  completedSet,
  onSelectUnit,
}) => {
  return (
    <section id="syllabus" className="py-12 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
            YOUR LEARNING PATH
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Five units. One clear journey.
          </h2>
          <p className="text-sm text-[#8895a7] mt-1">
            Select any unit to open its structured study module and visual concepts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {units.map((unit, idx) => {
          const completedInUnit = unit.topics.filter((_, tIdx) =>
            completedSet.has(`${idx}-${tIdx}`)
          ).length;
          const percentage = Math.round((completedInUnit / unit.topics.length) * 100);
          const isFinished = percentage === 100;

          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(idx)}
              className="frost-glass frost-glass-hover rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-black text-neutral-300 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    UNIT 0{idx + 1}
                  </span>
                  {isFinished ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-white bg-white/[0.1] border border-white/30 px-2.5 py-1 rounded-full font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                      <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" /> Complete
                    </span>
                  ) : (
                    <span className="text-xs text-[#808c9f] font-mono">
                      {completedInUnit}/{unit.topics.length} done
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors mb-2 leading-snug">
                  {unit.title}
                </h3>

                <p className="text-xs text-[#808c9f] mb-5">
                  {unit.topics.length} detailed lessons & syllabus topics
                </p>
              </div>

              <div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4 p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-white/70 to-white rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs font-bold text-white group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <span>Explore unit</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { flashcardsData } from '../data/flashcards';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

interface FlashcardsSectionProps {
  language: 'both' | 'en' | 'hi';
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({ language }) => {
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const card = flashcardsData[index];

  const handleNext = () => {
    setIsRevealed(false);
    setIndex((prev) => (prev + 1) % flashcardsData.length);
  };

  const handlePrev = () => {
    setIsRevealed(false);
    setIndex((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
  };

  return (
    <section id="flashcards" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          ACTIVE RECALL
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Flashcards
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Test your immediate memory on high-frequency 8051 viva and exam questions.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="frost-glass rounded-3xl p-7 sm:p-9 relative min-h-[280px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)]">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/15">
                CARD {index + 1} OF {flashcardsData.length}
              </span>
              <span className="text-xs text-[#808c9f]">
                {isRevealed ? 'Answer Mode' : 'Question Mode'}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                {card.question}
              </h3>

              {isRevealed ? (
                <div className="frost-glass-panel rounded-2xl p-5 space-y-3.5 animate-fadeIn">
                  {language !== 'hi' && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                        English Answer
                      </span>
                      <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                        {card.enAnswer}
                      </p>
                    </div>
                  )}
                  {language !== 'en' && (
                    <div className={language === 'both' ? 'border-t border-white/10 pt-3' : ''}>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block mb-1">
                        हिंदी में उत्तर
                      </span>
                      <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                        {card.hiAnswer}
                      </p>
                    </div>
                  )}
                  {card.keyNote && (
                    <div className="border-t border-white/10 pt-2.5 text-[11px] text-[#fef08a] font-mono">
                      Note: {card.keyNote}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#808c9f] italic py-4">
                  Think carefully before revealing. Formulate the answer in your own words first.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsRevealed(!isRevealed)}
              className="frost-btn flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
            >
              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="frost-btn px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-200 hover:text-white"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="frost-btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold"
              >
                <span>Next card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

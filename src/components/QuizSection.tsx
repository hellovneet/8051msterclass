import React, { useState } from 'react';
import { quizQuestions } from '../data/questions';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizSectionProps {
  score: number;
  onIncrementScore: () => void;
  onResetScore: () => void;
}

type QuizCard = { questionIndex: number; optionOrder: number[] };

const createQuizDeck = (avoidQuestionId?: string): QuizCard[] => {
  const order = quizQuestions.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (avoidQuestionId && order.length > 1 && quizQuestions[order[0]].id === avoidQuestionId) {
    const swapIndex = order.findIndex((index) => quizQuestions[index].id !== avoidQuestionId);
    [order[0], order[swapIndex]] = [order[swapIndex], order[0]];
  }
  return order.map((questionIndex) => {
    const optionOrder = quizQuestions[questionIndex].options.map((_, index) => index);
    for (let i = optionOrder.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
    }
    return { questionIndex, optionOrder };
  });
};

export const QuizSection: React.FC<QuizSectionProps> = ({
  score,
  onIncrementScore,
  onResetScore,
}) => {
  const [qIndex, setQIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<QuizCard[]>(() => createQuizDeck());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentCard = deck[qIndex];
  const currentQ = quizQuestions[currentCard.questionIndex];
  const currentOptions = currentCard.optionOrder.map((optionIndex) => currentQ.options[optionIndex]);
  const correctDisplayIndex = currentCard.optionOrder.indexOf(currentQ.correctIndex);
  const isCorrect = selectedAnswer === correctDisplayIndex;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === correctDisplayIndex) {
      onIncrementScore();
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (qIndex + 1 < deck.length) {
      setQIndex((prev) => prev + 1);
    } else {
      setDeck(createQuizDeck(currentQ.id));
      setQIndex(0);
      setRound((prev) => prev + 1);
    }
  };

  return (
    <section id="quiz" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
            CHECK YOUR UNDERSTANDING
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Quick Exam Quiz
          </h2>
          <p className="text-sm text-[#8895a7] mt-1">
            Answer the multiple choice questions to assess your conceptual clarity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="frost-glass px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs">
            <Award className="w-4 h-4 text-white" />
            <span className="text-[#9aa4b4]">Total Score:</span>
            <strong className="text-white font-mono text-sm">{score}</strong>
          </div>
          {score > 0 && (
            <button
              type="button"
              onClick={onResetScore}
              className="frost-btn text-[#8895a7] hover:text-white p-2 rounded-xl"
              title="Reset score"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="frost-glass rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)]">
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/15">
              ROUND {round} · QUESTION {qIndex + 1} / {deck.length}
            </span>
            <span className="text-xs text-[#808c9f] font-mono">
              Topic: Unit {currentQ.unit}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentOptions.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              let optionStyles = 'bg-white/[0.04] border-white/15 text-neutral-200 hover:bg-white/[0.08] hover:text-white hover:border-white/30';

              if (isAnswered) {
                if (idx === correctDisplayIndex) {
                  optionStyles = 'bg-white text-black border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]';
                } else if (idx === selectedAnswer) {
                  optionStyles = 'bg-[#331111]/70 border-[#ef4444]/60 text-[#fca5a5] font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                } else {
                  optionStyles = 'bg-white/[0.02] border-white/5 text-[#556275] opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/[0.08] border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && idx === correctDisplayIndex && (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  )}
                  {isAnswered && idx === selectedAnswer && idx !== correctDisplayIndex && (
                    <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className={`p-4 rounded-2xl border mb-6 text-xs sm:text-sm ${
              isCorrect
                ? 'frost-glass-panel border-white/30 text-white'
                : 'bg-[#291212]/80 border-[#ef4444]/40 text-[#fca5a5]'
            }`}>
              <div className="font-bold mb-1">
                {isCorrect ? '✓ Correct! Well done.' : '✗ Not quite.'}
              </div>
              <div className="text-neutral-200 text-xs leading-relaxed space-y-1">
                <div>{currentQ.explanationEn}</div>
                <div className="text-neutral-300">{currentQ.explanationHi}</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="frost-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold"
            >
              <span>{qIndex === deck.length - 1 ? 'Start new shuffled round' : 'Next question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

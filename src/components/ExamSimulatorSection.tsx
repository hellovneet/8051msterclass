import React, { useEffect, useMemo, useState } from 'react';
import { qb2024MCQs } from './QB2024Section';
import { AlarmClock, ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Circle, RotateCcw, Send, Target } from 'lucide-react';

type ExamItem = (typeof qb2024MCQs)[number];
type Phase = 'setup' | 'active' | 'results';

const shuffled = (items: ExamItem[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return minutes + ':' + seconds;
};

export const ExamSimulatorSection: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [unitFilter, setUnitFilter] = useState<number | 'all'>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [items, setItems] = useState<ExamItem[]>([]);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showMissedOnly, setShowMissedOnly] = useState(false);

  useEffect(() => {
    if (phase !== 'active') return;
    if (secondsLeft <= 0) {
      setPhase('results');
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, secondsLeft]);

  const eligible = useMemo(
    () => unitFilter === 'all' ? qb2024MCQs : qb2024MCQs.filter(item => item.unit === unitFilter),
    [unitFilter]
  );

  const startExam = () => {
    const exam = shuffled(eligible).slice(0, Math.min(questionCount, eligible.length));
    setItems(exam);
    setAnswers(Array(exam.length).fill(null));
    setMarked(new Set());
    setIndex(0);
    setSecondsLeft(durationMinutes * 60);
    setShowMissedOnly(false);
    setPhase('active');
  };

  const current = items[index];
  const correctCount = items.reduce((total, item, i) => total + (answers[i] === item.correctIndex ? 1 : 0), 0);
  const answeredCount = answers.filter(answer => answer !== null).length;
  const missedItems = items.filter((item, i) => answers[i] !== item.correctIndex);

  const unitResults = useMemo(() => {
    const byUnit = new Map<number, { correct: number; total: number }>();
    items.forEach((item, i) => {
      const result = byUnit.get(item.unit) ?? { correct: 0, total: 0 };
      result.total += 1;
      if (answers[i] === item.correctIndex) result.correct += 1;
      byUnit.set(item.unit, result);
    });
    return [...byUnit.entries()].sort((a, b) => a[0] - b[0]);
  }, [items, answers]);

  const selectAnswer = (choice: number) => {
    setAnswers(previous => previous.map((answer, i) => i === index ? choice : answer));
  };

  const toggleMarked = () => {
    setMarked(previous => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const submitExam = () => setPhase('results');

  return <section id="exam-simulator" className="py-12 scroll-mt-20 border-t border-white/10">
    <div className="mb-7">
      <p className="text-xs font-black tracking-widest text-amber-200 uppercase mb-1">REAL EXAM PRACTICE</p>
      <h2 className="text-2xl sm:text-3xl font-extrabold">8051 Exam Simulator</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-3xl">Take a timed mock test from the 2024 QB. Review difficult questions, then use the unit breakdown to choose what to revise next.</p>
    </div>

    {phase === 'setup' && <div className="frost-glass rounded-3xl p-5 sm:p-7 max-w-4xl">
      <div className="flex items-start gap-3 mb-6"><div className="rounded-xl bg-amber-200/10 p-3 text-amber-100"><Target className="w-5 h-5"/></div><div><h3 className="font-bold text-lg">Build your mock test</h3><p className="text-sm text-slate-400 mt-1">Questions are selected at random with no repeats in a test. Answers and explanations appear after submission.</p></div></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="text-xs font-bold text-slate-400">UNIT
          <select value={unitFilter} onChange={event => setUnitFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))} className="mt-2 w-full bg-[#10151d] border border-white/10 rounded-xl px-3 py-3 text-sm text-white">
            <option value="all">All units</option>{[1,2,3,4,5].map(unit => <option key={unit} value={unit}>Unit {unit}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-400">QUESTION COUNT
          <select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value))} className="mt-2 w-full bg-[#10151d] border border-white/10 rounded-xl px-3 py-3 text-sm text-white">{[5,10,15,20].map(count=><option key={count} value={count}>{count} questions</option>)}</select>
        </label>
        <label className="text-xs font-bold text-slate-400">TIME LIMIT
          <select value={durationMinutes} onChange={event => setDurationMinutes(Number(event.target.value))} className="mt-2 w-full bg-[#10151d] border border-white/10 rounded-xl px-3 py-3 text-sm text-white">{[5,10,15,20,30].map(minutes=><option key={minutes} value={minutes}>{minutes} minutes</option>)}</select>
        </label>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">
        <p className="text-xs text-slate-500">{eligible.length} eligible MCQs · Questions are shuffled for each attempt.</p>
        <button type="button" disabled={!eligible.length} onClick={startExam} className="frost-btn-primary rounded-xl px-5 py-3 text-sm font-extrabold disabled:opacity-40"><AlarmClock className="inline w-4 h-4 mr-2"/>Start mock test</button>
      </div>
    </div>}

    {phase === 'active' && current && <div className="max-w-4xl grid lg:grid-cols-[1fr_220px] gap-4">
      <div className="frost-glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <span className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-1.5 text-xs font-mono font-bold">QUESTION {index + 1} / {items.length} · UNIT {current.unit}</span>
          <span className={secondsLeft < 60 ? 'rounded-lg px-3 py-1.5 text-sm font-mono font-bold bg-rose-300/10 text-rose-200' : 'rounded-lg px-3 py-1.5 text-sm font-mono font-bold bg-white/5 text-slate-200'}><AlarmClock className="inline w-4 h-4 mr-1.5"/>{formatTime(secondsLeft)}</span>
        </div>
        <div role="progressbar" aria-label="Mock test progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={answeredCount} className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-6"><div className="h-full bg-amber-200 transition-all" style={{width:(answeredCount / items.length * 100)+'%'}}/></div>
        <h3 className="text-lg sm:text-xl font-bold leading-relaxed mb-6">{current.question}</h3>
        <div className="grid gap-3">{current.options.map((option, choice) => {
          const selected = answers[index] === choice;
          return <button key={option} type="button" aria-pressed={selected} onClick={() => selectAnswer(choice)} className={selected ? 'w-full rounded-2xl border border-amber-200/50 bg-amber-200/10 text-amber-50 text-left p-4 text-sm' : 'w-full rounded-2xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.07] text-slate-200 text-left p-4 text-sm'}><span className="font-mono font-bold mr-3">{String.fromCharCode(65 + choice)}.</span>{option}</button>;
        })}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-white/10">
          <button type="button" onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0} className="frost-btn rounded-xl px-4 py-2.5 text-sm disabled:opacity-30"><ArrowLeft className="inline w-4 h-4 mr-1"/>Previous</button>
          <button type="button" onClick={toggleMarked} aria-pressed={marked.has(index)} className={marked.has(index) ? 'rounded-xl px-4 py-2.5 text-sm bg-violet-300/15 text-violet-100 border border-violet-200/30' : 'frost-btn rounded-xl px-4 py-2.5 text-sm'}><Bookmark className="inline w-4 h-4 mr-1.5"/>{marked.has(index) ? 'Marked for review' : 'Mark for review'}</button>
          {index < items.length - 1 ? <button type="button" onClick={() => setIndex(value => Math.min(items.length - 1, value + 1))} className="frost-btn-primary rounded-xl px-4 py-2.5 text-sm font-bold">Next<ArrowRight className="inline w-4 h-4 ml-1"/></button> : <button type="button" onClick={submitExam} className="rounded-xl px-4 py-2.5 text-sm font-bold bg-emerald-200 text-black"><Send className="inline w-4 h-4 mr-1.5"/>Submit test</button>}
        </div>
      </div>
      <aside className="frost-glass rounded-3xl p-4 sm:p-5 h-fit">
        <h3 className="text-sm font-bold mb-3">Test overview</h3>
        <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">{items.map((_, i)=><button key={i} type="button" aria-label={'Go to question ' + (i + 1)} onClick={()=>setIndex(i)} className={i===index?'rounded-lg h-9 bg-amber-200 text-black text-xs font-bold':marked.has(i)?'rounded-lg h-9 bg-violet-300/20 text-violet-100 border border-violet-200/30 text-xs font-bold':answers[i]!==null?'rounded-lg h-9 bg-emerald-300/15 text-emerald-100 text-xs font-bold':'rounded-lg h-9 bg-white/5 text-slate-400 border border-white/10 text-xs'}>{i+1}</button>)}</div>
        <div className="mt-4 space-y-2 text-xs text-slate-400"><p><CheckCircle2 className="inline w-3.5 h-3.5 mr-1 text-emerald-200"/>Answered: {answeredCount}</p><p><Bookmark className="inline w-3.5 h-3.5 mr-1 text-violet-200"/>Marked: {marked.size}</p><p><Circle className="inline w-3.5 h-3.5 mr-1 text-slate-500"/>Unanswered: {items.length - answeredCount}</p></div>
        <button type="button" onClick={submitExam} className="w-full mt-5 rounded-xl bg-emerald-200 text-black px-4 py-3 text-sm font-extrabold">Submit test</button>
      </aside>
    </div>}

    {phase === 'results' && <div className="max-w-5xl">
      <div className="frost-glass rounded-3xl p-5 sm:p-7 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div><p className="text-xs uppercase tracking-widest text-amber-200 font-bold">MOCK TEST COMPLETE</p><h3 className="text-2xl font-extrabold mt-1">Score: {correctCount} / {items.length}</h3><p className="text-sm text-slate-400 mt-1">{items.length ? Math.round(correctCount / items.length * 100) : 0}% correct · {missedItems.length} to review</p></div>
          <div className="flex gap-2"><button type="button" onClick={()=>setShowMissedOnly(value=>!value)} className="frost-btn rounded-xl px-4 py-2.5 text-sm">{showMissedOnly?'Show all questions':'Review missed'}</button><button type="button" onClick={()=>setPhase('setup')} className="frost-btn-primary rounded-xl px-4 py-2.5 text-sm font-bold"><RotateCcw className="inline w-4 h-4 mr-1"/>New test</button></div>
        </div>
      </div>
      <div className="frost-glass rounded-3xl p-5 sm:p-7 mb-4">
        <h3 className="font-bold mb-4">Unit-wise performance</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{unitResults.map(([unit, result])=><div key={unit} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="flex justify-between text-sm mb-2"><span>Unit {unit}</span><strong>{result.correct}/{result.total}</strong></div><div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-200" style={{width:(result.correct / result.total * 100)+'%'}}/></div><p className="text-xs text-slate-500 mt-2">{result.correct === result.total ? 'Strong area' : result.correct === 0 ? 'Start revision here' : 'Worth another review'}</p></div>)}</div>
        {unitResults.length>0 && <p className="text-sm text-amber-100 mt-5">Suggested next step: revise Unit {unitResults.reduce((weakest, current)=>current[1].correct/current[1].total < weakest[1].correct/weakest[1].total ? current : weakest)[0]} first, then retake a fresh test.</p>}
      </div>
      <div className="space-y-3">{(showMissedOnly?missedItems:items).map(item=>{
        const originalIndex=items.findIndex(testItem=>testItem.id===item.id);
        const userAnswer=answers[originalIndex];
        const isRight=userAnswer===item.correctIndex;
        return <article key={item.id} className="frost-glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3"><span className={isRight?'text-emerald-200 mt-0.5':'text-rose-200 mt-0.5'}>{isRight?'✓':'✗'}</span><div className="flex-1"><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Unit {item.unit}</p><h4 className="font-semibold text-sm leading-relaxed">{item.question}</h4><p className="text-xs mt-3 text-slate-400">Your answer: <span className={isRight?'text-emerald-100':'text-rose-100'}>{userAnswer===null?'Not answered':item.options[userAnswer]}</span></p><p className="text-xs mt-1 text-slate-300">Correct answer: <span className="text-emerald-100">{item.options[item.correctIndex]}</span></p><p className="text-sm leading-relaxed mt-3 text-slate-400">{item.explanationEn}</p></div></div>
        </article>;
      })}</div>
      <button type="button" onClick={()=>setPhase('setup')} className="mt-5 frost-btn rounded-xl px-4 py-2.5 text-sm"><ArrowLeft className="inline w-4 h-4 mr-1"/>Back to setup</button>
    </div>}
  </section>;
};

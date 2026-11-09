import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SyllabusSection } from './components/SyllabusSection';
import { LearnStudio } from './components/LearnStudio';
import { SimulatorSection } from './components/SimulatorSection';
import { BaudRateCalculator } from './components/BaudRateCalculator';
import { TheoryModules } from './components/TheoryModules';
import { CircuitLabSection } from './components/CircuitLabSection';
import { LabManualSection } from './components/LabManualSection';
import { ExamBankSection } from './components/ExamBankSection';
import { QB2024Section } from './components/QB2024Section';
import { StudyTools } from './components/StudyTools';
import { FlashcardsSection } from './components/FlashcardsSection';
import { ProgramsSection } from './components/ProgramsSection';
import { QuizSection } from './components/QuizSection';
import { RevisionSection } from './components/RevisionSection';
import { Footer } from './components/Footer';
import { unitsData } from './data/units';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<'both' | 'en' | 'hi'>(() => {
    return (localStorage.getItem('8051_lang') as 'both' | 'en' | 'hi') || 'both';
  });
  const [currentUnit, setCurrentUnit] = useState<number>(0);
  const [currentTopic, setCurrentTopic] = useState<number>(0);
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('8051_done');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('8051_marks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [score, setScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('8051_score');
      return saved ? Number(saved) : 0;
    } catch { return 0; }
  });

  useEffect(() => { localStorage.setItem('8051_lang', language); }, [language]);
  useEffect(() => { localStorage.setItem('8051_done', JSON.stringify([...completedSet])); }, [completedSet]);
  useEffect(() => { localStorage.setItem('8051_marks', JSON.stringify([...bookmarkedSet])); }, [bookmarkedSet]);
  useEffect(() => { localStorage.setItem('8051_score', String(score)); }, [score]);

  const totalTopics = unitsData.reduce((acc, u) => acc + u.topics.length, 0);
  const handleSelectUnit = (unitIdx: number) => {
    setCurrentUnit(unitIdx);
    setCurrentTopic(0);
    document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSelectTopicKey = (unitIdx: number, topicIdx: number) => {
    setCurrentUnit(unitIdx);
    setCurrentTopic(topicIdx);
    document.getElementById('learn')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleToggleDone = () => {
    const key = `${currentUnit}-${currentTopic}`;
    setCompletedSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const handleToggleBookmark = () => {
    const key = `${currentUnit}-${currentTopic}`;
    setBookmarkedSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const handleRemoveBookmark = (key: string) => {
    setBookmarkedSet(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };
  const handlePrevTopic = () => {
    if (currentTopic > 0) setCurrentTopic(currentTopic - 1);
    else if (currentUnit > 0) {
      const prevUnitIdx = currentUnit - 1;
      setCurrentUnit(prevUnitIdx);
      setCurrentTopic(unitsData[prevUnitIdx].topics.length - 1);
    }
  };
  const handleNextTopic = () => {
    if (currentTopic < unitsData[currentUnit].topics.length - 1) setCurrentTopic(currentTopic + 1);
    else if (currentUnit < unitsData.length - 1) {
      setCurrentUnit(currentUnit + 1);
      setCurrentTopic(0);
    }
  };
  const handleIncrementScore = () => setScore(prev => prev + 1);
  const handleResetScore = () => setScore(0);

  return (
    <div className="min-h-screen bg-[#040608] text-[#f5f8fc] flex flex-col font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      <Navbar language={language} onLanguageChange={setLanguage} doneCount={completedSet.size} score={score} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full space-y-6">
        <Hero doneCount={completedSet.size} totalTopics={totalTopics} scoreCount={score} onExploreClick={() => handleSelectUnit(0)} />
        <SyllabusSection units={unitsData} completedSet={completedSet} onSelectUnit={handleSelectUnit} />
        <LearnStudio units={unitsData} currentUnit={currentUnit} currentTopic={currentTopic} language={language} completedSet={completedSet} bookmarkedSet={bookmarkedSet} onSelectUnit={setCurrentUnit} onSelectTopic={setCurrentTopic} onToggleDone={handleToggleDone} onToggleBookmark={handleToggleBookmark} onPrev={handlePrevTopic} onNext={handleNextTopic} />
        <SimulatorSection />
        <BaudRateCalculator />
        <TheoryModules language={language} />
        <CircuitLabSection />
        <LabManualSection language={language} />
        <ExamBankSection language={language} />
        <QB2024Section />
        <StudyTools units={unitsData} bookmarkedSet={bookmarkedSet} onSelectTopicKey={handleSelectTopicKey} onRemoveBookmark={handleRemoveBookmark} />
        <FlashcardsSection language={language} />
        <ProgramsSection />
        <QuizSection score={score} onIncrementScore={handleIncrementScore} onResetScore={handleResetScore} />
        <RevisionSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;

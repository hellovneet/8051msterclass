import React, { useState, useEffect, useMemo } from 'react';
import { Unit } from '../data/units';
import { Search, Star, Clock, Play, Pause, RotateCcw, X } from 'lucide-react';

interface StudyToolsProps {
  units: Unit[];
  bookmarkedSet: Set<string>;
  onSelectTopicKey: (unitIdx: number, topicIdx: number) => void;
  onRemoveBookmark: (key: string) => void;
}

export const StudyTools: React.FC<StudyToolsProps> = ({
  units,
  bookmarkedSet,
  onSelectTopicKey,
  onRemoveBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      setTimerFinished(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds]);

  const handleStartTimer = () => {
    setTimerFinished(false);
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(1500);
    setTimerFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: { unitIdx: number; topicIdx: number; title: string; unitTitle: string }[] = [];
    units.forEach((u, uIdx) => {
      u.topics.forEach((t, tIdx) => {
        const text = `${t.title} ${t.enExplanation} ${t.hiExplanation} ${t.enRemember} ${t.hiRemember}`.toLowerCase();
        if (text.includes(query)) {
          results.push({
            unitIdx: uIdx,
            topicIdx: tIdx,
            title: t.title,
            unitTitle: `Unit ${uIdx + 1}`,
          });
        }
      });
    });
    return results.slice(0, 15);
  }, [searchQuery, units]);

  const bookmarksList = useMemo(() => {
    const list: { key: string; unitIdx: number; topicIdx: number; title: string; unitTitle: string }[] = [];
    bookmarkedSet.forEach((key) => {
      const [uStr, tStr] = key.split('-');
      const u = Number(uStr);
      const t = Number(tStr);
      if (units[u]?.topics[t]) {
        list.push({
          key,
          unitIdx: u,
          topicIdx: t,
          title: units[u].topics[t].title,
          unitTitle: `Unit ${u + 1}`,
        });
      }
    });
    return list;
  }, [bookmarkedSet, units]);

  return (
    <section id="studytools" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          YOUR STUDY WORKSPACE
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Study Tools
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Instant curriculum search, revision bookmarks, and focused Pomodoro study timer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Lessons Card */}
        <div className="frost-glass rounded-3xl p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3.5 text-white font-bold text-base">
            <Search className="w-4 h-4 text-white" />
            <h3>Search Lessons</h3>
          </div>
          <div className="relative mb-3.5">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any topic, e.g. TMOD, keypad, ISR..."
              className="w-full bg-[#030508]/80 text-white text-xs border border-white/15 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-[#64748b] backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#718096] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-56 pr-1 space-y-2 text-xs">
            {!searchQuery ? (
              <p className="text-xs text-[#718096] py-2">
                Type above to search keywords, mnemonics, pin names, and formulas across all five units.
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-xs text-[#718096] py-2">
                No matching topics found for "{searchQuery}".
              </p>
            ) : (
              searchResults.map((res) => (
                <button
                  key={`${res.unitIdx}-${res.topicIdx}`}
                  type="button"
                  onClick={() => onSelectTopicKey(res.unitIdx, res.topicIdx)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-neutral-200 hover:text-white flex items-center justify-between gap-2 group transition-all"
                >
                  <span className="truncate">{res.title}</span>
                  <span className="text-[10px] text-[#808c9f] font-mono group-hover:text-white shrink-0">
                    {res.unitTitle} →
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Bookmarks Card */}
        <div className="frost-glass rounded-3xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Star className="w-4 h-4 text-[#fef08a] fill-[#fef08a]" />
              <h3>Bookmarks</h3>
            </div>
            <span className="text-xs text-[#808c9f] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
              {bookmarksList.length} saved
            </span>
          </div>

          <p className="text-xs text-[#8895a7] mb-3.5">
            Quickly return to flagged topics for rapid revision before exams.
          </p>

          <div className="flex-1 overflow-y-auto max-h-56 pr-1 space-y-2 text-xs">
            {bookmarksList.length === 0 ? (
              <p className="text-xs text-[#606d80] py-2">
                No bookmarks yet. Click the "Bookmark" button while reading any lesson to save it here.
              </p>
            ) : (
              bookmarksList.map((bm) => (
                <div
                  key={bm.key}
                  className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2 group hover:border-white/25 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => onSelectTopicKey(bm.unitIdx, bm.topicIdx)}
                    className="text-left text-neutral-200 hover:text-white truncate flex-1 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fef08a] shrink-0 shadow-[0_0_6px_#fef08a]"></span>
                    <span className="truncate">{bm.title}</span>
                    <span className="text-[10px] text-[#808c9f] font-mono shrink-0">({bm.unitTitle})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(bm.key)}
                    className="text-[#606d80] hover:text-white p-1"
                    title="Remove bookmark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Focus Timer Card */}
        <div className="frost-glass rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white font-bold text-base">
              <Clock className="w-4 h-4 text-white" />
              <h3>Focus Timer</h3>
            </div>
            <p className="text-xs text-[#8895a7] mb-4">
              Standard 25-minute Pomodoro block for deep study retention.
            </p>
          </div>

          <div className="py-3 text-center">
            <div className="text-4xl font-mono font-black tracking-wider text-white select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {formatTime(timerSeconds)}
            </div>

            {timerFinished && (
              <div className="mt-3 text-xs font-bold text-white bg-white/[0.12] border border-white/30 py-2 px-3.5 rounded-xl animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                🎉 Focus session complete! Take a 5-minute break.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-3">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="frost-btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Start</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="frost-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTimer}
              className="frost-btn px-3.5 py-2.5 rounded-xl text-neutral-300 font-bold text-xs hover:text-white"
              title="Reset timer to 25:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

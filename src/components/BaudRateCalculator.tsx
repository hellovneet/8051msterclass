import React, { useState, useMemo } from 'react';
import {
  calculateBaudRate,
  calculateTimerDelay,
  getStandardBaudTable,
  getCommonBaudDerivations,
  type DetailedBaudDerivation,
  BaudCalculationResult,
  TimerDelayResult
} from '../utils/baudCalculator';


export const BaudRateCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'baud' | 'timer' | 'syncAsync' | 'numericals'>('baud');

  // Baud rate state
  const [foscMHz, setFoscMHz] = useState<number>(11.0592);
  const [customFosc, setCustomFosc] = useState<string>('11.0592');
  const [targetBaud, setTargetBaud] = useState<number>(9600);
  const [smod, setSmod] = useState<0 | 1>(0);
  const [copiedBaudCode, setCopiedBaudCode] = useState<boolean>(false);

  // Common derivations showcase state
  const [selectedDerivationKey, setSelectedDerivationKey] = useState<string>('9600');
  const [copiedDerivationCode, setCopiedDerivationCode] = useState<boolean>(false);
  const commonDerivations: DetailedBaudDerivation[] = useMemo(() => getCommonBaudDerivations(), []);
  const activeDerivation: DetailedBaudDerivation = useMemo(
    () => commonDerivations.find((d) => d.presetKey === selectedDerivationKey) || commonDerivations[0],
    [commonDerivations, selectedDerivationKey]
  );



  // Timer delay state
  const [timerFoscMHz, setTimerFoscMHz] = useState<number>(12.0);
  const [delayMs, setDelayMs] = useState<number>(5);
  const [timerMode, setTimerMode] = useState<1 | 2>(1);
  const [copiedTimerCode, setCopiedTimerCode] = useState<boolean>(false);

  // Sync vs Async interactive demo state
  const [demoByteHex, setDemoByteHex] = useState<string>('41'); // 'A' = 0x41 = 01000001
  const [sm2State, setSm2State] = useState<boolean>(false);
  const [isAddressFrame, setIsAddressFrame] = useState<boolean>(false);

  // Calculate Baud Rate
  const baudResult: BaudCalculationResult = useMemo(() => {
    const foscHz = foscMHz * 1_000_000;
    return calculateBaudRate(foscHz, targetBaud, smod);
  }, [foscMHz, targetBaud, smod]);

  // Calculate Timer Delay
  const timerResult: TimerDelayResult = useMemo(() => {
    const foscHz = timerFoscMHz * 1_000_000;
    return calculateTimerDelay(foscHz, delayMs, timerMode);
  }, [timerFoscMHz, delayMs, timerMode]);

  const standardBaudTable = useMemo(() => getStandardBaudTable(), []);

  const handleCopyBaudAsm = () => {
    navigator.clipboard.writeText(baudResult.assemblyCode);
    setCopiedBaudCode(true);
    setTimeout(() => setCopiedBaudCode(false), 2000);
  };

  const handleCopyTimerAsm = () => {
    navigator.clipboard.writeText(timerResult.assemblyCode);
    setCopiedTimerCode(true);
    setTimeout(() => setCopiedTimerCode(false), 2000);
  };

  // Convert hex input to 8-bit binary string
  const demoByteNum = parseInt(demoByteHex, 16) || 0;
  const bitArray = useMemo(() => {
    const bits: number[] = [];
    for (let i = 0; i < 8; i++) {
      bits.push((demoByteNum >> i) & 1); // LSB first D0 to D7
    }
    return bits;
  }, [demoByteNum]);

  // Exam numerical presets
  const examNumericals = [
    {
      title: "Problem 1: 9600 Baud with 11.0592 MHz (Standard SMOD=0)",
      description: "Find the initial reload value for Timer 1 in Mode 2 to achieve 9600 baud rate at 11.0592 MHz crystal frequency.",
      fosc: 11.0592,
      baud: 9600,
      smod: 0 as const,
      category: "Baud Rate"
    },
    {
      title: "Problem 2: Double Baud Rate (19200 Baud) using SMOD = 1",
      description: "Calculate Timer 1 reload value when SMOD bit in PCON is set to 1 for 19200 baud with 11.0592 MHz.",
      fosc: 11.0592,
      baud: 19200,
      smod: 1 as const,
      category: "Baud Rate"
    },
    {
      title: "Problem 3: 12 MHz Crystal Percentage Error Analysis for 9600 Baud",
      description: "Analyze the percentage error if a 12 MHz crystal is used instead of 11.0592 MHz for 9600 baud.",
      fosc: 12.0,
      baud: 9600,
      smod: 0 as const,
      category: "Error Analysis"
    },
    {
      title: "Problem 4: 2400 Baud Rate with 11.0592 MHz Crystal",
      description: "Determine TH1 reload value in hexadecimal and decimal for 2400 baud serial communication.",
      fosc: 11.0592,
      baud: 2400,
      smod: 0 as const,
      category: "Baud Rate"
    },
    {
      title: "Problem 5: 1200 Baud with 16 MHz Crystal (High Clock)",
      description: "Find TH1 value and calculate percentage error when using an external 16.0 MHz oscillator at 1200 baud.",
      fosc: 16.0,
      baud: 1200,
      smod: 0 as const,
      category: "High Speed"
    }
  ];

  return (
    <section id="baud-solver" className="my-10 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-xs font-semibold text-white/90 mb-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Engineering Studio · Kenneth J. Ayala Reference
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Baud Rate & Serial Numerical Solver
          </h2>
          <p className="text-sm text-[#94a3b8] max-w-3xl mt-1">
            Complete mathematical derivations, TH1 reload calculations, baud error percentage analyzer, and Synchronous vs Asynchronous transmission visualizer.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('baud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'baud'
                ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Baud Rate Solver
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timer'
                ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Timer Delay Solver
          </button>
          <button
            onClick={() => setActiveTab('syncAsync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'syncAsync'
                ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Sync vs Async Lab
          </button>
          <button
            onClick={() => setActiveTab('numericals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'numericals'
                ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.3)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Exam Numericals
          </button>
        </div>
      </div>

      {/* TAB 1: BAUD RATE SOLVER */}
      {activeTab === 'baud' && (
        <div className="space-y-8">
          {/* TOP SECTION: COMMON BAUD RATES DERIVATION SHOWCASE */}
          <div className="p-6 rounded-3xl bg-[#070b12]/90 border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 mb-1.5">
                  <span>📐</span> Standard Syllabus & Exam Derivations · Mode 2 Auto-Reload
                </div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Common Baud Rates: Step-by-Step Mathematical Walkthrough
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Click any standard configuration below to view the complete mathematical proof from oscillator crystal frequency to TH1 register reload.
                </p>
              </div>

              {/* Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                {commonDerivations.map((d) => (
                  <button
                    key={d.presetKey}
                    onClick={() => setSelectedDerivationKey(d.presetKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedDerivationKey === d.presetKey
                        ? d.isReliable
                          ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.4)]'
                          : 'bg-rose-500 text-white shadow-[0_2px_10px_rgba(244,63,94,0.4)]'
                        : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {d.targetBaud} bps {d.smod === 1 ? '(SMOD=1)' : ''} {d.presetKey === '12mhz' ? '(12 MHz ⚠️)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Derivation Header Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Summary Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b111e]/90 border border-white/15 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                      activeDerivation.isReliable
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    }`}>
                      {activeDerivation.badge}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300">
                      Fosc: {activeDerivation.foscMHz.toFixed(4)} MHz
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white leading-snug">
                    {activeDerivation.title}
                  </h4>
                  <p className="text-xs text-[#94a3b8] mt-2 italic border-l-2 border-white/20 pl-2.5">
                    {activeDerivation.ayalaQuote}
                  </p>
                </div>

                {/* Quick Results Matrix */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">TH1 Register</div>
                    <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                      {activeDerivation.th1Hex}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748b]">
                      Dec: {activeDerivation.th1Decimal}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">SMOD Bit</div>
                    <div className="text-lg font-black font-mono text-white mt-0.5">
                      {activeDerivation.smod}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300">
                      {activeDerivation.smod === 1 ? 'Prescaler ÷16' : 'Prescaler ÷32'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Baud Error</div>
                    <div className={`text-lg font-black font-mono mt-0.5 ${
                      activeDerivation.errorPercentage === 0
                        ? 'text-emerald-400'
                        : activeDerivation.errorPercentage <= 2.5
                        ? 'text-yellow-400'
                        : 'text-rose-400'
                    }`}>
                      {activeDerivation.errorPercentage.toFixed(2)}%
                    </div>
                    <div className="text-[10px] font-mono text-[#64748b]">
                      {activeDerivation.isReliable ? 'Pass (≤2.5%)' : 'Fail (>2.5%)'}
                    </div>
                  </div>
                </div>

                {/* Sync Button */}
                <button
                  onClick={() => {
                    setFoscMHz(activeDerivation.foscMHz);
                    setCustomFosc(activeDerivation.foscMHz.toString());
                    setTargetBaud(activeDerivation.targetBaud);
                    setSmod(activeDerivation.smod);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Load this Configuration into Live Custom Solver
                </button>
              </div>

              {/* Right: Master Formula Breakdown */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#090e17]/90 border border-white/15 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    The 8051 Master Baud Rate Equation
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs sm:text-sm text-center text-white space-y-1.5">
                    <div className="text-cyan-300 font-bold">
                      Baud Rate = [ 2<sup>SMOD</sup> / 32 ] × [ F<sub>osc</sub> / (12 × (256 - TH1)) ]
                    </div>
                    <div className="text-[#94a3b8] text-xs">
                      ⟺ Baud Rate = [ 2<sup>SMOD</sup> × F<sub>osc</sub> ] / [ 384 × (256 - TH1) ]
                    </div>
                    <div className="text-emerald-400 font-bold text-xs pt-1 border-t border-white/10">
                      ⟹ (256 - TH1) = [ 2<sup>SMOD</sup> × F<sub>osc</sub> ] / [ 384 × Baud Rate ]
                    </div>
                  </div>
                </div>

                {/* Hardware Signal Flow Diagram */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                    Hardware Clock Division Pipeline (Ayala Fig. 9-4)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                      <span className="text-[10px] text-[#64748b] block">Stage 1</span>
                      <strong className="text-white">{activeDerivation.foscMHz} MHz</strong>
                      <span className="text-[10px] text-cyan-300 block">XTAL Oscillator</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                      <span className="text-[10px] text-[#64748b] block">Stage 2 (÷12)</span>
                      <strong className="text-white">{(activeDerivation.foscHz / 12 / 1000).toFixed(1)} kHz</strong>
                      <span className="text-[10px] text-cyan-300 block">Machine Cycle</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                      <span className="text-[10px] text-[#64748b] block">Stage 3 (÷N)</span>
                      <strong className="text-emerald-400">N = {activeDerivation.reloadCount}</strong>
                      <span className="text-[10px] text-emerald-300 block">Timer 1 (TH1)</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                      <span className="text-[10px] text-[#64748b] block">Stage 4 (÷{activeDerivation.smod === 1 ? '16' : '32'})</span>
                      <strong className="text-white">{activeDerivation.actualBaud.toFixed(0)} bps</strong>
                      <span className="text-[10px] text-cyan-300 block">UART TxD/RxD</span>
                    </div>
                  </div>
                </div>

                {/* Bilingual Takeaway */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <div className="font-bold text-white mb-1">
                    💡 Pedagogical Insight / परीक्षा में याद रखने योग्य तथ्य:
                  </div>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {activeDerivation.conceptualTakeawayEn}
                  </p>
                  <p className="text-[#94a3b8] text-[11px] mt-1 leading-relaxed border-t border-white/5 pt-1">
                    {activeDerivation.conceptualTakeawayHi}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Derivation Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📝</span> Detailed Step-by-Step Mathematical Derivation
                </h4>
                <span className="text-xs font-mono text-[#94a3b8]">
                  {activeDerivation.steps.length} Rigorous Stages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {activeDerivation.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      step.highlight
                        ? 'bg-[#0f172a]/90 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                          Step {step.stepNumber}
                        </span>
                        {step.highlight && (
                          <span className="text-[10px] font-bold text-cyan-300">
                            ★ Key Result
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-white">
                        {step.title}
                      </h5>

                      <div className="my-2 p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] space-y-1">
                        <div className="text-[#94a3b8]">{step.formula}</div>
                        <div className="text-white font-bold">{step.substitution}</div>
                        <div className="text-emerald-400 font-black border-t border-white/10 pt-1">
                          = {step.result}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#cbd5e1] space-y-1">
                      <p>{step.explanationEn}</p>
                      <p className="text-[#94a3b8] text-[10px] border-t border-white/5 pt-1">
                        {step.explanationHi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assembly Initialization Code for Active Derivation */}
            <div className="p-4 rounded-2xl bg-[#04070e] border border-white/15">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Ready-to-Assemble 8051 Assembly Subroutine ({activeDerivation.targetBaud} Baud)
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeDerivation.assemblyCode);
                    setCopiedDerivationCode(true);
                    setTimeout(() => setCopiedDerivationCode(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                >
                  {copiedDerivationCode ? '✓ Copied' : '📋 Copy Subroutine'}
                </button>
              </div>
              <pre className="font-mono text-xs text-[#a7f3d0] bg-[#010409] p-3.5 rounded-xl overflow-x-auto border border-white/10 leading-relaxed">
                {activeDerivation.assemblyCode}
              </pre>
            </div>
          </div>

          {/* BOTTOM SECTION: LIVE INTERACTIVE CUSTOM SOLVER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls Panel */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Live Custom Baud Rate & Error Solver
                </h3>
                <span className="text-[11px] font-mono text-[#64748b]">Mode 1 & Mode 3</span>
              </div>

              {/* Crystal Frequency */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-2">
                  Oscillator Frequency (<span className="text-cyan-400 font-mono">Fosc</span>)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {[
                    { label: '11.0592 MHz', val: 11.0592, sub: 'Standard UART' },
                    { label: '12.0000 MHz', val: 12.0, sub: '1 µs cycle' },
                    { label: '16.0000 MHz', val: 16.0, sub: 'High speed' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setFoscMHz(item.val);
                        setCustomFosc(item.val.toString());
                      }}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        foscMHz === item.val
                          ? 'bg-white/15 border-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                          : 'bg-white/[0.03] border-white/10 text-[#94a3b8] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{item.label}</div>
                      <div className="text-[10px] text-[#64748b]">{item.sub}</div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94a3b8]">Custom (MHz):</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="1"
                    max="40"
                    value={customFosc}
                    onChange={(e) => {
                      setCustomFosc(e.target.value);
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num) && num > 0) setFoscMHz(num);
                    }}
                    className="flex-1 bg-white/[0.05] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>

              {/* Target Baud Rate */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-2">
                  Desired Baud Rate (bits per second)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1200, 2400, 4800, 9600, 19200, 28800, 38400, 57600].map((b) => (
                    <button
                      key={b}
                      onClick={() => setTargetBaud(b)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                        targetBaud === b
                          ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                          : 'bg-white/[0.03] border-white/10 text-[#94a3b8] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* SMOD Bit Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#cbd5e1]">
                    PCON.7 (SMOD) Baud Rate Doubler
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                    PCON: 87H
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSmod(0)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      smod === 0
                        ? 'bg-white/15 border-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-[#94a3b8] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">SMOD = 0</div>
                    <div className="text-[10px] text-[#64748b]">Standard Division (/32)</div>
                  </button>
                  <button
                    onClick={() => setSmod(1)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      smod === 1
                        ? 'bg-white/15 border-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-[#94a3b8] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">SMOD = 1 (Doubled)</div>
                    <div className="text-[10px] text-[#64748b]">Fast Prescaler (/16)</div>
                  </button>
                </div>
              </div>

              {/* Status Alert Box */}
              <div
                className={`p-3.5 rounded-xl border ${
                  baudResult.isReliable
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-base">{baudResult.isReliable ? '✅' : '⚠️'}</span>
                  <div className="text-xs leading-relaxed">
                    <strong className="block font-semibold mb-0.5">
                      {baudResult.isReliable ? 'Transmission Stable' : 'Framing Error Warning'}
                    </strong>
                    {baudResult.statusMessage}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Derivation & Calculation Output */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Output Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">TH1 Reload (Hex)</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    {baudResult.th1Hex}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    Dec: {baudResult.th1Decimal} (-{baudResult.roundedReloadCount})
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Actual Baud</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    {baudResult.actualBaud.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] font-mono">
                    Target: {baudResult.targetBaud}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Baud Error %</div>
                  <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
                    baudResult.errorPercentage === 0
                      ? 'text-emerald-400'
                      : baudResult.errorPercentage <= 2.5
                      ? 'text-yellow-400'
                      : 'text-rose-400'
                  }`}>
                    {baudResult.errorPercentage.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    {baudResult.errorPercentage === 0 ? '0% Error (Exact)' : '< 2.5% safe limit'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Machine Cycle</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    {baudResult.machineCyclePeriodUs.toFixed(3)} µs
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {(baudResult.machineCycleHz / 1000).toFixed(1)} kHz
                  </div>
                </div>
              </div>

              {/* Step-by-Step Derivation */}
              <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📐</span> Step-by-Step Mathematical Derivation for Custom Values
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-300">Live Evaluator</span>
                </div>

                <div className="space-y-3 font-mono text-xs text-[#cbd5e1]">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">1. Master 8051 Baud Rate Formula:</span>
                    <span className="text-white font-bold">
                      Baud Rate = [ 2<sup>SMOD</sup> / 32 ] × [ Timer 1 Overflow Rate ]
                    </span>
                    <div className="text-[11px] text-[#94a3b8] mt-1">
                      Timer 1 Overflow Rate = F<sub>osc</sub> / [ 12 × (256 - TH1) ]
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">2. Combine into Unified Equation:</span>
                    <span className="text-white font-bold">
                      Baud Rate = [ 2<sup>{smod}</sup> × {foscMHz} MHz ] / [ 384 × (256 - TH1) ]
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">3. Solve for Reload Count (256 - TH1):</span>
                    <div className="text-white font-bold">
                      (256 - TH1) = [ 2<sup>{smod}</sup> × {baudResult.foscHz} ] / [ 384 × {targetBaud} ]
                    </div>
                    <div className="text-cyan-400 mt-1">
                      = {baudResult.exactReloadCount.toFixed(4)} → Rounded integer = <strong className="text-white">{baudResult.roundedReloadCount}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">4. Determine TH1 Register Value:</span>
                    <div className="text-white font-bold">
                      TH1 = 256 - {baudResult.roundedReloadCount} = <span className="text-emerald-400">{baudResult.th1Decimal}</span> (Decimal) = <span className="text-emerald-400">{baudResult.th1Hex}</span> (Hexadecimal)
                    </div>
                    <div className="text-[11px] text-[#94a3b8] mt-1">
                      In assembly, 256 - {baudResult.roundedReloadCount} is written as <code className="text-white">MOV TH1, #-{baudResult.roundedReloadCount}</code> or <code className="text-white">MOV TH1, #{baudResult.th1Hex}</code>.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">5. Actual Baud & Error Verification:</span>
                    <div>
                      Actual Baud = [ 2<sup>{smod}</sup> × {baudResult.foscHz} ] / [ 384 × {baudResult.roundedReloadCount} ] = <strong className="text-white">{baudResult.actualBaud.toFixed(2)}</strong> bps
                    </div>
                    <div className="mt-1">
                      % Error = |({baudResult.actualBaud.toFixed(2)} - {targetBaud}) / {targetBaud}| × 100% = <strong className={baudResult.errorPercentage === 0 ? "text-emerald-400" : "text-yellow-400"}>{baudResult.errorPercentage.toFixed(2)}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-Generated Assembly Code */}
              <div className="p-4 rounded-2xl bg-black border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Generated 8051 Assembly Initialization Code
                  </div>
                  <button
                    onClick={handleCopyBaudAsm}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    {copiedBaudCode ? '✓ Copied' : '📋 Copy ASM'}
                  </button>
                </div>
                <pre className="font-mono text-xs text-[#a7f3d0] bg-[#020508] p-3 rounded-xl overflow-x-auto border border-white/10 leading-relaxed">
                  {baudResult.assemblyCode}
                </pre>
              </div>
            </div>
          </div>

          {/* Reference Table (Ayala Ch. 9 Table 9-3) */}
          <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📊</span> Standard Baud Rate Lookup Table (Kenneth J. Ayala Table 9-3)
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Why 11.0592 MHz is universally chosen: 11.0592 MHz yields EXACT 0.00% error across all standard PC baud rates.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/15 text-[#94a3b8] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Baud Rate</th>
                    <th className="py-2.5 px-3">Crystal (Fosc)</th>
                    <th className="py-2.5 px-3">SMOD</th>
                    <th className="py-2.5 px-3">TH1 (Hex)</th>
                    <th className="py-2.5 px-3">Actual Baud</th>
                    <th className="py-2.5 px-3">Error %</th>
                    <th className="py-2.5 px-3">Reliability & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {standardBaudTable.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                      onClick={() => {
                        setFoscMHz(row.foscMHz);
                        setCustomFosc(row.foscMHz.toString());
                        setTargetBaud(row.baud);
                        setSmod(row.smod);
                      }}
                    >
                      <td className="py-2 px-3 font-bold text-white">{row.baud}</td>
                      <td className="py-2 px-3 text-cyan-300">{row.foscMHz.toFixed(4)} MHz</td>
                      <td className="py-2 px-3 text-white">{row.smod}</td>
                      <td className="py-2 px-3 font-bold text-emerald-400">{row.th1Hex}</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">{row.actualBaud}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.errorPercentage === 0
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : row.errorPercentage <= 2.5
                            ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-500/30'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        }`}>
                          {row.errorPercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#94a3b8]">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMER DELAY SOLVER */}
      {activeTab === 'timer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Timer Delay Parameters
                </h3>
                <span className="text-xs text-[#94a3b8]">Mode 1 (16-bit) & Mode 2 (8-bit)</span>
              </div>

              {/* Crystal Frequency */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-2">
                  Crystal Frequency
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '12.0000 MHz', val: 12.0, sub: '1 µs / machine cycle' },
                    { label: '11.0592 MHz', val: 11.0592, sub: '1.085 µs / machine cycle' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setTimerFoscMHz(item.val)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        timerFoscMHz === item.val
                          ? 'bg-white/15 border-white text-white'
                          : 'bg-white/[0.03] border-white/10 text-[#94a3b8]'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{item.label}</div>
                      <div className="text-[10px] text-[#64748b]">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Mode */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-2">
                  Timer Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTimerMode(1)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      timerMode === 1
                        ? 'bg-white/15 border-white text-white'
                        : 'bg-white/[0.03] border-white/10 text-[#94a3b8]'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">Mode 1 (16-bit)</div>
                    <div className="text-[10px] text-[#64748b]">Max 65,536 counts (~65.5 ms)</div>
                  </button>
                  <button
                    onClick={() => setTimerMode(2)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      timerMode === 2
                        ? 'bg-white/15 border-white text-white'
                        : 'bg-white/[0.03] border-white/10 text-[#94a3b8]'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">Mode 2 (8-bit)</div>
                    <div className="text-[10px] text-[#64748b]">Auto-reload, Max 256 counts</div>
                  </button>
                </div>
              </div>

              {/* Desired Delay Input */}
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-2">
                  Desired Delay (milliseconds)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[1, 5, 10, 25].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDelayMs(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                        delayMs === d
                          ? 'bg-white text-black border-white'
                          : 'bg-white/[0.03] border-white/10 text-[#94a3b8]'
                      }`}
                    >
                      {d} ms
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94a3b8]">Custom (ms):</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.001"
                    max="1000"
                    value={delayMs}
                    onChange={(e) => setDelayMs(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-white/[0.05] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Derivation & Assembly */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">TH0 Register</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    {timerResult.thHex}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">High byte</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">TL0 Register</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    {timerResult.tlHex}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">Low byte</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0b1019]/90 border border-white/15 backdrop-blur-xl col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Ticks Required</div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                    {timerResult.requiredTicks}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] font-mono">
                    Initial: {timerResult.initialCount}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Derivation */}
              <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl space-y-3 font-mono text-xs">
                <div className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-white/10 pb-2">
                  <span>⏱️</span> Step-by-Step Timer Calculation
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">1. Machine Cycle Period (T):</span>
                  <div>T = 12 / {timerFoscMHz} MHz = <strong className="text-white">{timerResult.machineCycleUs.toFixed(3)} µs</strong></div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">2. Clock Pulses (N) Required:</span>
                  <div>N = Desired Delay / T = {timerResult.delayUs} µs / {timerResult.machineCycleUs.toFixed(3)} µs = <strong className="text-white">{timerResult.requiredTicks} pulses</strong></div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">3. Initial Count Calculation:</span>
                  <div>Initial Value = {timerResult.maxPossibleTicks} - {timerResult.requiredTicks} = <strong className="text-emerald-400">{timerResult.initialCount}</strong> (Dec)</div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">
                    Hex: TH0 = <strong className="text-white">{timerResult.thHex}</strong>, TL0 = <strong className="text-white">{timerResult.tlHex}</strong>
                  </div>
                </div>
              </div>

              {/* Assembly Subroutine */}
              <div className="p-4 rounded-2xl bg-black border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Complete Assembly Delay Routine
                  </div>
                  <button
                    onClick={handleCopyTimerAsm}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    {copiedTimerCode ? '✓ Copied' : '📋 Copy ASM'}
                  </button>
                </div>
                <pre className="font-mono text-xs text-[#93c5fd] bg-[#020508] p-3 rounded-xl overflow-x-auto border border-white/10 leading-relaxed">
                  {timerResult.assemblyCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYNCHRONOUS VS ASYNCHRONOUS LAB (Kenneth J. Ayala Ch. 9) */}
      {activeTab === 'syncAsync' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asynchronous Mode 1 Card */}
            <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    Asynchronous Communication (UART Mode 1)
                  </h3>
                  <div className="text-xs text-[#94a3b8]">Framed Transmission without Shared Clock</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  Full Duplex
                </span>
              </div>

              <div className="text-xs text-[#cbd5e1] leading-relaxed space-y-2">
                <p>
                  In <strong>Asynchronous serial transmission</strong>, transmitter and receiver do NOT share a common clock line. Instead, synchronization is established on a <strong>frame-by-frame basis</strong> using <strong>Start (Logic 0)</strong> and <strong>Stop (Logic 1)</strong> framing bits.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="font-bold text-white text-[11px] mb-1">Standard 10-bit UART Frame:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[#94a3b8]">
                    <li><strong>1 Start Bit:</strong> Always LOW (0), alerts receiver to incoming character</li>
                    <li><strong>8 Data Bits:</strong> Transmitted LSB (D0) to MSB (D7)</li>
                    <li><strong>1 Stop Bit:</strong> Always HIGH (1), marks frame completion</li>
                    <li><strong>Clock Tolerance:</strong> Both crystal frequencies must match within <span className="text-emerald-400 font-bold">±2.5%</span>!</li>
                  </ul>
                </div>
              </div>

              {/* Interactive Bit Framing Inspector */}
              <div className="p-4 rounded-xl bg-black border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Live UART 10-Bit Frame for Byte:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#94a3b8]">Hex Value:</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={demoByteHex}
                      onChange={(e) => setDemoByteHex(e.target.value.toUpperCase())}
                      className="w-12 bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-center font-mono text-cyan-300 focus:outline-none"
                    />
                    <span className="text-[11px] text-[#94a3b8]">('{String.fromCharCode(demoByteNum || 32)}')</span>
                  </div>
                </div>

                {/* 10-Bit Waveform visualization */}
                <div className="grid grid-cols-10 gap-1 text-center font-mono">
                  {/* Start Bit */}
                  <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300">
                    <div className="text-[9px] uppercase font-bold text-rose-400">Start</div>
                    <div className="text-sm font-extrabold">0</div>
                    <div className="text-[8px] text-rose-400/80">LOW</div>
                  </div>

                  {/* 8 Data Bits */}
                  {bitArray.map((b, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded-lg border transition-all ${
                        b === 1
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                          : 'bg-white/[0.04] border-white/10 text-[#94a3b8]'
                      }`}
                    >
                      <div className="text-[9px] font-bold text-[#64748b]">D{i}</div>
                      <div className="text-sm font-extrabold">{b}</div>
                      <div className="text-[8px] text-[#64748b]">{b ? 'HIGH' : 'LOW'}</div>
                    </div>
                  ))}

                  {/* Stop Bit */}
                  <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    <div className="text-[9px] uppercase font-bold text-emerald-400">Stop</div>
                    <div className="text-sm font-extrabold">1</div>
                    <div className="text-[8px] text-emerald-400/80">HIGH</div>
                  </div>
                </div>

                <div className="text-[10px] text-[#64748b] text-center">
                  ← Transmitted First (Start Bit) · · · Transmitted Last (Stop Bit) →
                </div>
              </div>
            </div>

            {/* Synchronous Mode 0 Card */}
            <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Synchronous Communication (Shift Register Mode 0)
                  </h3>
                  <div className="text-xs text-[#94a3b8]">Shared Clock Shift Register for I/O Expansion</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  Half Duplex
                </span>
              </div>

              <div className="text-xs text-[#cbd5e1] leading-relaxed space-y-2">
                <p>
                  In <strong>Synchronous serial transmission (Mode 0)</strong>, data bits are clocked out simultaneously with an explicit clock signal. In the 8051:
                </p>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="font-bold text-white text-[11px] mb-1">Key Characteristics:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[#94a3b8]">
                    <li><strong>RXD (P3.0):</strong> Bidirectional Serial Data in/out (8 bits, LSB first)</li>
                    <li><strong>TXD (P3.1):</strong> Shift Clock output with fixed frequency: <strong className="text-white">Fosc / 12</strong> (1 MHz @ 12 MHz!)</li>
                    <li><strong>Framing:</strong> <strong>NO Start or Stop bits</strong>; pure 8-bit stream</li>
                    <li><strong>Primary Application:</strong> I/O Port Expansion using 74HC164/165 or CD4094 shift registers</li>
                  </ul>
                </div>
              </div>

              {/* Mode 0 Timing Diagram */}
              <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
                <div className="text-xs font-bold text-white">Mode 0 Hardware Pin Roles:</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-white/[0.04] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px]">TXD (Pin 11):</span>
                    <span className="text-emerald-400 font-bold">Shift Clock</span>
                    <span className="text-[10px] text-[#64748b] block">Fixed at Fosc / 12</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.04] border border-white/10">
                    <span className="text-[#94a3b8] block text-[10px]">RXD (Pin 10):</span>
                    <span className="text-cyan-400 font-bold">8-bit Data Line</span>
                    <span className="text-[10px] text-[#64748b] block">LSB (D0) to MSB (D7)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multiprocessor Communication & SM2 Bit (Ayala Ch. 9) */}
          <div className="p-5 rounded-2xl bg-[#080d15]/80 border border-white/15 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🛰️</span> Multiprocessor Communication & The SM2 Bit (Modes 2 & 3)
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  How a Master 8051 talks to multiple Slave 8051 microcontrollers on a single serial bus without software overhead.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8]">Slave SM2 Bit:</span>
                <button
                  onClick={() => setSm2State(!sm2State)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    sm2State
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/10 text-white/70 border-white/20'
                  }`}
                >
                  SM2 = {sm2State ? '1 (Filter Active)' : '0 (Accept All)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="font-bold text-white">1. Master Transmits Address</div>
                <p className="text-[#94a3b8] leading-relaxed">
                  The Master sets the 9th bit (TB8 in SCON) to <strong className="text-white">1</strong> to indicate that this byte is an <strong>Address byte</strong> (e.g., target Slave ID 05H).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="font-bold text-white">2. Slaves Check SM2 Filtering</div>
                <p className="text-[#94a3b8] leading-relaxed">
                  All listening Slaves have <strong className="text-white">SM2 = 1</strong>. When the 9th bit is 1, the RI interrupt is asserted. All slaves wake up and check if the address matches their own.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="font-bold text-white">3. Selected Slave Clears SM2</div>
                <p className="text-[#94a3b8] leading-relaxed">
                  The addressed Slave clears its <strong className="text-emerald-400">SM2 = 0</strong> to receive subsequent data bytes (where 9th bit = 0). Unaddressed slaves keep SM2=1 and ignore all data traffic!
                </p>
              </div>
            </div>

            {/* Interactive Simulation Panel */}
            <div className="p-4 rounded-xl bg-black border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddressFrame(!isAddressFrame)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    isAddressFrame
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-white/10 text-white/70 border-white/20'
                  }`}
                >
                  9th Bit (TB8): {isAddressFrame ? '1 (ADDRESS FRAME)' : '0 (DATA FRAME)'}
                </button>
                <span className="text-xs text-[#94a3b8]">
                  Frame Type: <strong className="text-white">{isAddressFrame ? 'Address Byte' : 'Data Byte'}</strong>
                </span>
              </div>

              <div className="text-xs font-mono">
                Slave Status:{' '}
                {sm2State && !isAddressFrame ? (
                  <span className="text-rose-400 font-bold">⛔ Ignored (SM2=1 filtered data byte, RI not set)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">🔔 Interrupt Generated (RI = 1, Slave CPU wakes up)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM NUMERICALS */}
      {activeTab === 'numericals' && (
        <div className="space-y-4">
          <div className="text-xs text-[#94a3b8] mb-2">
            Click on any standard university exam numerical problem to instantly load its parameters into the solver and view the complete step-by-step solution:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examNumericals.map((prob, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#080d15]/80 border border-white/15 hover:border-white/30 transition-all flex flex-col justify-between gap-3 group cursor-pointer"
                onClick={() => {
                  setFoscMHz(prob.fosc);
                  setCustomFosc(prob.fosc.toString());
                  setTargetBaud(prob.baud);
                  setSmod(prob.smod);
                  setActiveTab('baud');
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                      {prob.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748b]">
                      Fosc: {prob.fosc} MHz · SMOD: {prob.smod}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs font-mono text-cyan-400">
                  <span>Target: {prob.baud} Baud</span>
                  <span className="group-hover:translate-x-1 transition-transform">Solve in Engine →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

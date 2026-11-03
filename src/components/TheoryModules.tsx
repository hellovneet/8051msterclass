import React, { useState } from 'react';

interface TheoryModulesProps {
  language?: 'both' | 'en' | 'hi';
}

type ActiveTopic = 'syncAsync' | 'harvardVonNeumann' | 'mpuVsMcu' | 'riscVsCisc';

export const TheoryModules: React.FC<TheoryModulesProps> = ({ language = 'both' }) => {
  const [activeTopic, setActiveTopic] = useState<ActiveTopic>('syncAsync');

  // Interactive demo states for Sync vs Async
  const [syncDemoMode, setSyncDemoMode] = useState<'sync' | 'async'>('async');
  const [asyncTestByte, setAsyncTestByte] = useState<string>('A'); // ASCII 'A' = 0x41 = 01000001

  // Interactive demo states for Harvard vs Von Neumann
  const [archMode, setArchMode] = useState<'harvard' | 'vonNeumann' | 'mcs51'>('mcs51');

  // Convert char to binary for Async visualizer
  const charCode = asyncTestByte.charCodeAt(0) || 65;
  const bitString = charCode.toString(2).padStart(8, '0');
  const bitsLSBFirst = bitString.split('').reverse().map(Number); // D0 to D7


  return (
    <section id="theory" className="my-12 scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/15 text-xs font-semibold text-white/90 mb-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Foundational Syllabus Theory · High-Weightage Exam Concepts
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Foundational Theory & Architectural Blueprints
          </h2>
          <p className="text-sm text-[#94a3b8] max-w-3xl mt-1">
            Deep-dive bilingual explanations, interactive timing diagrams, silicon architecture schematics, and university exam comparison matrices for core syllabus topics.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">
          {[
            { id: 'syncAsync', label: 'Sync vs Async', badge: 'Unit 3 Serial' },
            { id: 'harvardVonNeumann', label: 'Harvard vs Von Neumann', badge: 'Unit 1 CPU' },
            { id: 'mpuVsMcu', label: 'µP vs µC', badge: 'Unit 1 Basics' },
            { id: 'riscVsCisc', label: 'RISC vs CISC', badge: 'Unit 1 Arch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTopic(tab.id as ActiveTopic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTopic === tab.id
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.4)]'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                activeTopic === tab.id ? 'bg-black/10 text-neutral-800' : 'bg-white/10 text-white/60'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: SYNCHRONOUS VS ASYNCHRONOUS COMMUNICATION
          ========================================================================= */}
      {activeTopic === 'syncAsync' && (
        <div className="space-y-6">
          {/* Top Banner Card */}
          <div className="p-6 rounded-3xl bg-[#080d15]/90 border border-white/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                    Unit 3 · Serial Port Fundamentals
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] font-mono">
                    Ayala Chapter 9 & Mazidi Chapter 10
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Synchronous vs Asynchronous Serial Communication
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                  How microcontrollers transmit bitstreams across serial links: with a shared clock line vs self-synchronizing framing bits.
                </p>
              </div>

              {/* Mode Toggle for Interactive Diagram */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                <button
                  onClick={() => setSyncDemoMode('async')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncDemoMode === 'async'
                      ? 'bg-white text-black shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Asynchronous (UART Mode 1)
                </button>
                <button
                  onClick={() => setSyncDemoMode('sync')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncDemoMode === 'sync'
                      ? 'bg-white text-black shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Synchronous (Shift Reg Mode 0)
                </button>
              </div>
            </div>

            {/* Interactive Signal Flow & Timing Diagram */}
            <div className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Interactive Waveform Visualizer: {syncDemoMode === 'async' ? 'Asynchronous UART Frame (10 Bits)' : 'Synchronous Shift Register Stream'}
                </div>

                {syncDemoMode === 'async' && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#94a3b8]">Test ASCII Character:</span>
                    <input
                      type="text"
                      maxLength={1}
                      value={asyncTestByte}
                      onChange={(e) => setAsyncTestByte(e.target.value.toUpperCase() || 'A')}
                      className="w-10 text-center py-1 bg-white/10 border border-white/20 rounded font-mono font-bold text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <span className="font-mono text-cyan-300 text-[11px]">
                      0x{charCode.toString(16).toUpperCase()} ({bitString}b)
                    </span>
                  </div>
                )}
              </div>

              {/* Diagram Rendering */}
              {syncDemoMode === 'async' ? (
                <div className="space-y-4">
                  {/* Asynchronous 10-bit Frame Waveform */}
                  <div className="p-4 rounded-xl bg-[#03060c] border border-white/10 font-mono overflow-x-auto">
                    <div className="min-w-[640px] space-y-3">
                      {/* Frame Labels */}
                      <div className="grid grid-cols-12 gap-1 text-[10px] text-center font-bold">
                        <div className="p-1 rounded bg-neutral-800/60 text-[#94a3b8]">Idle (1)</div>
                        <div className="p-1 rounded bg-rose-950/70 text-rose-300 border border-rose-500/40">Start (0)</div>
                        {bitsLSBFirst.map((b, i) => (
                          <div key={i} className="p-1 rounded bg-cyan-950/60 text-cyan-200 border border-cyan-500/30">
                            D{i} ({b})
                          </div>
                        ))}
                        <div className="p-1 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">Stop (1)</div>
                        <div className="p-1 rounded bg-neutral-800/60 text-[#94a3b8]">Idle (1)</div>
                      </div>

                      {/* Physical Voltage Logic Waveform */}
                      <div className="relative h-16 bg-[#0a0f18] rounded-lg border border-white/15 p-2 flex items-center">
                        {/* High line guide */}
                        <div className="absolute top-3 left-0 right-0 border-t border-dashed border-white/20" />
                        <span className="absolute top-1 left-2 text-[9px] text-[#64748b]">HIGH (Mark = Logic 1)</span>

                        {/* Low line guide */}
                        <div className="absolute bottom-3 left-0 right-0 border-t border-dashed border-white/20" />
                        <span className="absolute bottom-1 left-2 text-[9px] text-[#64748b]">LOW (Space = Logic 0)</span>

                        {/* Voltage line blocks */}
                        <div className="w-full grid grid-cols-12 gap-1 z-10 h-8 items-center text-center">
                          <div className="h-full border-t-2 border-white flex items-start justify-center text-[10px] text-white">1</div>
                          <div className="h-full border-b-2 border-rose-400 flex items-end justify-center text-[10px] text-rose-400 font-bold">0</div>
                          {bitsLSBFirst.map((b, idx) => (
                            <div
                              key={idx}
                              className={`h-full flex justify-center text-[10px] font-bold ${
                                b === 1
                                  ? 'border-t-2 border-cyan-400 items-start text-cyan-300'
                                  : 'border-b-2 border-cyan-400 items-end text-cyan-300'
                              }`}
                            >
                              {b}
                            </div>
                          ))}
                          <div className="h-full border-t-2 border-emerald-400 flex items-start justify-center text-[10px] text-emerald-400 font-bold">1</div>
                          <div className="h-full border-t-2 border-white flex items-start justify-center text-[10px] text-white">1</div>
                        </div>
                      </div>

                      {/* 16x Baud Oversampling Strobe Indicator */}
                      <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Receiver uses <strong>16× oversampling clock</strong>. Detection starts at falling edge of Start Bit.</span>
                        </div>
                        <div className="font-mono text-cyan-300 text-[10px]">
                          Sample Point: 8th clock tick (50% mid-bit)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Signal Path: TxD / RxD (2 Wires Only) */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 font-mono font-bold text-white text-center">
                        8051 (TxD / P3.1)
                      </div>
                      <span className="text-cyan-400 font-mono">── Serial Data Line ──▶</span>
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 font-mono font-bold text-white text-center">
                        Receiver (RxD / P3.0)
                      </div>
                    </div>
                    <div className="text-[#94a3b8] text-[11px]">
                      ⚡ <strong>NO shared clock line required!</strong> Both sides rely on internal timers programmed to the same Baud Rate (e.g. 9600 bps).
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Synchronous Mode 0 Waveform */}
                  <div className="p-4 rounded-xl bg-[#03060c] border border-white/10 font-mono overflow-x-auto">
                    <div className="min-w-[640px] space-y-3">
                      <div className="text-xs text-[#cbd5e1] font-bold">
                        8051 Mode 0: Shift Register Mode (Fixed Baud = Fosc / 12 = 921.6 kHz @ 11.0592 MHz)
                      </div>

                      {/* Shared Clock Waveform */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-300 block">CLOCK (TXD / P3.1) — Shift Clock pulses output by 8051:</span>
                        <div className="grid grid-cols-8 gap-1 h-8">
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((pulse) => (
                            <div key={pulse} className="border border-cyan-400/50 rounded flex items-center justify-center text-[10px] text-cyan-300 bg-cyan-950/30">
                              Pulse #{pulse + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Data Stream Waveform */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-emerald-300 block">DATA (RXD / P3.0) — Bidirectional data synchronized to clock edges:</span>
                        <div className="grid grid-cols-8 gap-1 h-8">
                          {['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'].map((bit, idx) => (
                            <div key={idx} className="border border-emerald-400/50 rounded flex items-center justify-center text-[10px] text-emerald-300 bg-emerald-950/30 font-bold">
                              {bit}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-[#94a3b8] pt-1">
                        Notice: <strong>Zero Start bits and Zero Stop bits!</strong> All 8 clock cycles carry pure data.
                      </div>
                    </div>
                  </div>

                  {/* Hardware Signal Path: TxD (Clock) + RxD (Data) */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-bold">TXD (P3.1):</span>
                        <span className="text-[#cbd5e1]">Dedicated Synchronous Clock Output Line</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-300 font-bold">RXD (P3.0):</span>
                        <span className="text-[#cbd5e1]">Bidirectional Serial Data Line</span>
                      </div>
                    </div>
                    <div className="text-[#94a3b8] text-[11px]">
                      Ideal for: <strong>74HC595 / 74HC165 I/O Expansion</strong>, SPI peripherals, and high-speed on-board telemetry.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bilingual Core Explanations */}
            <div className={`grid gap-4 mt-6 ${language === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* English */}
              {(language === 'both' || language === 'en') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <span>🇬🇧</span> In-Depth Conceptual Breakdown (English)
                  </div>
                  <div className="text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">Synchronous Communication:</strong> Transmitter and receiver share a dedicated physical clock line. Data bits are sampled in lockstep on the rising or falling edges of the clock. Because the clock signal is explicitly provided, framing bits (start and stop bits) are not needed. This maximizes data bandwidth and eliminates timing drift, but requires extra wiring and is impractical over long distances.
                    </p>
                    <p>
                      <strong className="text-white">Asynchronous Communication:</strong> No shared clock wire exists between devices. Each side has its own independent internal oscillator. Data is transmitted in packaged "frames" wrapped between a <strong>Start Bit (Logic 0)</strong> and one or two <strong>Stop Bits (Logic 1)</strong>. The falling edge of the Start bit wakes up the receiver's internal counter, which uses a 16× oversampling clock to sample each data bit right at the midpoint (8th count) for maximum reliability.
                    </p>
                  </div>
                </div>
              )}

              {/* Hindi */}
              {(language === 'both' || language === 'hi') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <span>🇮🇳</span> आसान हिंदी व्याख्या (Hindi Explanation)
                  </div>
                  <div className="text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">सिन्क्रोनस (Synchronous) संचार:</strong> इसमें डेटा भेजने वाले (Transmitter) और प्राप्त करने वाले (Receiver) के बीच एक अलग से <strong>साझा क्लॉक तार (Shared Clock Wire)</strong> जुड़ा होता है। डेटा बिट्स क्लॉक पल्स के साथ कदम से कदम मिलाकर ट्रांसफर होते हैं। इसमें किसी स्टार्ट (Start) या स्टॉप (Stop) बिट की आवश्यकता नहीं होती, इसलिए डेटा ट्रांसफर की गति तेज होती है।
                    </p>
                    <p>
                      <strong className="text-white">असिन्क्रोनस (Asynchronous) संचार:</strong> इसमें दोनों डिवाइसों के बीच कोई क्लॉक तार नहीं होता। दोनों डिवाइस अपने-अपने आंतरिक टाइमर (Baud Rate) पर चलते हैं। डेटा के प्रत्येक बाइट के आगे <strong>1 स्टार्ट बिट (0)</strong> और पीछे <strong>1 या 2 स्टॉप बिट (1)</strong> जोड़े जाते हैं। स्टार्ट बिट रिसीवर को संकेत देता है कि नया डेटा आ रहा है, और रिसीवर 16× ओवरसैंपलिंग क्लॉक द्वारा बिट के ठीक मध्य (8वें काउंट) में डेटा पढ़ता है।
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Comprehensive University Exam Comparison Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
                <span>📊</span> 8-Point University Exam Comparison Matrix (Ayala Section 9.1 & 9.2)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/15 bg-white/[0.04] text-[#94a3b8] uppercase text-[10px]">
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3 text-cyan-300">Synchronous Communication</th>
                      <th className="py-2.5 px-3 text-emerald-300">Asynchronous Communication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/40">
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Clock Line</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Dedicated shared physical clock wire required</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">No clock line; uses separate local baud generators</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Framing Overhead</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">0% (Pure continuous bitstream)</td>
                      <td className="py-2 px-3 text-yellow-400">20% to 25% overhead (Start bit + Stop bits)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">8051 Hardware Mode</td>
                      <td className="py-2 px-3 text-cyan-300">Mode 0 (Shift Register: TXD=Clock, RXD=Data)</td>
                      <td className="py-2 px-3 text-emerald-300">Mode 1 (8-bit UART), Mode 2 & Mode 3 (9-bit UART)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Baud Rate Source</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Fixed at Fosc / 12 (921.6 kHz @ 11.0592 MHz)</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Variable; generated by Timer 1 Mode 2 auto-reload</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Distance Suitability</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Short distance on same PCB (clock skew over cable)</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Long distance; ideal for RS-232, RS-422, RS-485 cables</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Clock Drift Sensitivity</td>
                      <td className="py-2 px-3 text-emerald-400">Immune (Receiver uses transmitter's clock)</td>
                      <td className="py-2 px-3 text-yellow-400">High sensitivity; Baud error must stay ≤ 2.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Transmission Speed</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Very High (Megabits per second)</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Low to Medium (Typically 1200 to 115200 bps)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Common Examples</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">SPI, I2C, 74HC595 shift registers</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">PC COM port, Bluetooth HC-05, GPS Neo-6M, GSM SIM900</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* University Exam Writing Tip Box */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <span className="text-xl">✍️</span>
              <div className="text-xs text-[#cbd5e1] space-y-1">
                <strong className="block text-white font-bold">How to Answer in University Exam (5 or 10 Marks):</strong>
                <p>
                  1. Begin with the precise definition of clock synchronization.
                  2. Draw the <strong>10-bit Asynchronous Frame Diagram</strong> (Idle → Start [0] → D0..D7 → Stop [1]) with 16× sampling arrows.
                  3. Draw the <strong>Synchronous Clock vs Data timing diagram</strong> showing clock edges latching bits.
                  4. Reproduce the comparison table above covering Clock Line, Framing overhead, 8051 Mode 0 vs Mode 1, and RS-232 application.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: HARVARD VS VON NEUMANN ARCHITECTURE
          ========================================================================= */}
      {activeTopic === 'harvardVonNeumann' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#080d15]/90 border border-white/15 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                    Unit 1 · CPU Architecture
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] font-mono">
                    Ayala Chapter 1 & 2
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Harvard vs Von Neumann Architecture
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                  Memory organization and bus topology: Why the 8051 implements a Modified Harvard Architecture with separate Program ROM and Data RAM.
                </p>
              </div>

              {/* Architecture Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                <button
                  onClick={() => setArchMode('vonNeumann')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    archMode === 'vonNeumann'
                      ? 'bg-white text-black shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Von Neumann
                </button>
                <button
                  onClick={() => setArchMode('harvard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    archMode === 'harvard'
                      ? 'bg-white text-black shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Pure Harvard
                </button>
                <button
                  onClick={() => setArchMode('mcs51')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    archMode === 'mcs51'
                      ? 'bg-cyan-400 text-black shadow-[0_2px_8px_rgba(6,182,212,0.4)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  8051 Modified Harvard ★
                </button>
              </div>
            </div>

            {/* Architecture Architectural Diagram */}
            <div className="p-5 rounded-2xl bg-black/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Silicon Bus Schematic: {archMode === 'vonNeumann' ? 'Von Neumann (Shared Memory & Bus)' : archMode === 'harvard' ? 'Harvard (Dual Independent Buses)' : '8051 Modified Harvard Architecture'}
                </div>
                <span className="text-[10px] font-mono text-[#94a3b8]">Interactive Bus Visualizer</span>
              </div>

              {/* Mode 1: Von Neumann Schematic */}
              {archMode === 'vonNeumann' && (
                <div className="p-5 rounded-xl bg-[#040811] border border-white/10 font-mono space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* CPU Block */}
                    <div className="md:col-span-4 p-4 rounded-xl bg-white/[0.04] border border-white/20 text-center space-y-2">
                      <div className="text-[10px] uppercase font-bold text-cyan-300">Processing Core</div>
                      <div className="text-base font-black text-white">CPU</div>
                      <div className="text-[10px] text-[#94a3b8] space-y-0.5">
                        <div>ALU · Control Unit</div>
                        <div>Registers · PC</div>
                      </div>
                    </div>

                    {/* Shared Bus Block */}
                    <div className="md:col-span-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-center space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-rose-300">⚠️ Single Shared Bus</div>
                      <div className="text-xs text-white font-bold">Shared Address / Data Bus</div>
                      <div className="text-[10px] text-rose-200">
                        "Von Neumann Bottleneck": Cannot fetch opcode and read data memory in the same cycle!
                      </div>
                    </div>

                    {/* Unified Memory Block */}
                    <div className="md:col-span-4 p-4 rounded-xl bg-white/[0.04] border border-white/20 text-center space-y-2">
                      <div className="text-[10px] uppercase font-bold text-emerald-300">Unified Memory Space</div>
                      <div className="text-base font-black text-white">Code + Data RAM</div>
                      <div className="text-[10px] text-[#94a3b8]">
                        Programs & Variables share the exact same physical addresses.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-[#cbd5e1]">
                    <strong>Bottleneck Explanation:</strong> Because instruction fetching and data read/writes must take turns over the single bus, the processor must execute memory accesses sequentially.
                  </div>
                </div>
              )}

              {/* Mode 2: Pure Harvard Schematic */}
              {archMode === 'harvard' && (
                <div className="p-5 rounded-xl bg-[#040811] border border-white/10 font-mono space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* CPU Block */}
                    <div className="md:col-span-4 p-5 rounded-xl bg-white/[0.04] border border-white/20 text-center space-y-2">
                      <div className="text-[10px] uppercase font-bold text-cyan-300">Processing Core</div>
                      <div className="text-base font-black text-white">CPU</div>
                      <div className="text-[10px] text-[#94a3b8]">
                        Dual Simultaneous Bus Controllers
                      </div>
                    </div>

                    {/* Parallel Buses */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                        <span className="text-[10px] text-cyan-300 block font-bold">Instruction Bus (Code) ──▶</span>
                        <span className="text-[9px] text-[#94a3b8]">Dedicated Opcode Fetching</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                        <span className="text-[10px] text-emerald-300 block font-bold">◀── Data Bus (Variables) ──▶</span>
                        <span className="text-[9px] text-[#94a3b8]">Dedicated Operand Read/Write</span>
                      </div>
                    </div>

                    {/* Dual Memories */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-center">
                        <div className="text-xs font-bold text-cyan-300">Program Memory (ROM)</div>
                        <div className="text-[9px] text-[#94a3b8]">Contains executable instructions</div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                        <div className="text-xs font-bold text-emerald-300">Data Memory (RAM)</div>
                        <div className="text-[9px] text-[#94a3b8]">Contains runtime variables</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                    <strong>Parallel Access Advantage:</strong> The CPU fetches the NEXT instruction from ROM at the exact same moment it reads or writes variable data in RAM! Pipelining is maximized.
                  </div>
                </div>
              )}

              {/* Mode 3: 8051 Modified Harvard Architecture */}
              {archMode === 'mcs51' && (
                <div className="p-5 rounded-xl bg-[#040811] border border-cyan-500/30 font-mono space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                    {/* 8051 CPU */}
                    <div className="md:col-span-4 p-4 rounded-xl bg-white/[0.04] border border-white/20 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-cyan-400">MCS-51 Central Core</div>
                        <div className="text-lg font-black text-white mt-1">8051 CPU</div>
                        <div className="text-[10px] text-[#94a3b8] mt-2 space-y-1">
                          <div>• PC (16-bit): Code Pointer</div>
                          <div>• DPTR (16-bit): Data Pointer</div>
                          <div>• SP (8-bit): Stack Pointer</div>
                        </div>
                      </div>
                      <div className="mt-3 p-2 rounded bg-black/60 border border-white/10 text-[9px] text-cyan-300">
                        Separate Hardware Strobes
                      </div>
                    </div>

                    {/* Memory Partitions */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Program ROM */}
                      <div className="p-3.5 rounded-xl bg-[#091522] border border-cyan-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-cyan-300 uppercase">Code Memory (ROM)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400 text-black font-bold">64 KB Max</span>
                        </div>
                        <div className="text-xs font-bold text-white">4 KB On-Chip + 60 KB External</div>
                        <div className="text-[10px] text-[#94a3b8] space-y-0.5">
                          <div>• Pin 29 (<span className="text-white font-bold">/PSEN</span>) is the read strobe</div>
                          <div>• Pin 31 (<span className="text-white font-bold">/EA</span>) selects internal vs external</div>
                          <div>• Instruction: <code className="text-cyan-300 font-bold">MOVC A, @A+DPTR</code></div>
                        </div>
                      </div>

                      {/* External Data RAM */}
                      <div className="p-3.5 rounded-xl bg-[#061914] border border-emerald-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase">External Data (RAM)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-black font-bold">64 KB Max</span>
                        </div>
                        <div className="text-xs font-bold text-white">External XRAM (0000H–FFFFH)</div>
                        <div className="text-[10px] text-[#94a3b8] space-y-0.5">
                          <div>• P3.7 (<span className="text-white font-bold">/RD</span>) strobe reads from RAM</div>
                          <div>• P3.6 (<span className="text-white font-bold">/WR</span>) strobe writes to RAM</div>
                          <div>• Instruction: <code className="text-emerald-300 font-bold">MOVX A, @DPTR</code></div>
                        </div>
                      </div>

                      {/* Internal RAM 128B */}
                      <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/15 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase">Internal Scratchpad RAM & SFRs</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold">256 Bytes Total</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                          <div className="p-1.5 rounded bg-black/40 border border-white/10">
                            <span className="text-white block font-bold">Bank 0–3</span>
                            <span className="text-[#64748b]">00H–1FH</span>
                          </div>
                          <div className="p-1.5 rounded bg-black/40 border border-white/10">
                            <span className="text-cyan-300 block font-bold">Bit-RAM</span>
                            <span className="text-[#64748b]">20H–2FH (128 bits)</span>
                          </div>
                          <div className="p-1.5 rounded bg-black/40 border border-white/10">
                            <span className="text-white block font-bold">General RAM</span>
                            <span className="text-[#64748b]">30H–7FH</span>
                          </div>
                          <div className="p-1.5 rounded bg-black/40 border border-white/10">
                            <span className="text-emerald-300 block font-bold">SFR Space</span>
                            <span className="text-[#64748b]">80H–FFH (P0–P3, TMOD)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
                    💡 <strong>Why 8051 is "Modified" Harvard:</strong> Even though address <code>0000H</code> exists in both Program ROM and Data RAM, the 8051 uses different hardware control signals (<span className="text-white">/PSEN</span> for ROM vs <span className="text-white">/RD</span> and <span className="text-white">/WR</span> for RAM) and completely distinct assembly instructions (<code>MOVC</code> vs <code>MOVX</code>) to access them without ambiguity!
                  </div>
                </div>
              )}
            </div>

            {/* Bilingual Explanations */}
            <div className={`grid gap-4 mt-6 ${language === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* English */}
              {(language === 'both' || language === 'en') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <span>🇬🇧</span> Architectural Principles (English)
                  </div>
                  <div className="text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">Von Neumann Architecture:</strong> Proposed by mathematician John von Neumann in 1945. Both program instructions and data variables share the same physical memory space and the same address/data bus lines. The major drawback is the <em>Von Neumann Bottleneck</em>: instruction fetch and data read/write cannot occur concurrently.
                    </p>
                    <p>
                      <strong className="text-white">Harvard Architecture:</strong> Originating from the Harvard Mark I relay-based computer. Program memory (ROM) and data memory (RAM) are physically separated, each having its own dedicated address bus and data bus. The CPU can fetch the next opcode from ROM while simultaneously reading or writing a data operand in RAM.
                    </p>
                  </div>
                </div>
              )}

              {/* Hindi */}
              {(language === 'both' || language === 'hi') && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <span>🇮🇳</span> आसान हिंदी व्याख्या (Hindi Explanation)
                  </div>
                  <div className="text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">वॉन न्यूमैन (Von Neumann) आर्किटेक्चर:</strong> इसमें प्रोग्राम कोड (Instructions) और डेटा (Variables) दोनों एक ही मेमोरी स्पेस में रखे जाते हैं और एक ही साझा बस (Shared Bus) का उपयोग करते हैं। इसका मुख्य नुकसान <em>Von Neumann Bottleneck</em> है, क्योंकि एक ही समय पर कोड और डेटा दोनों को एक साथ एक्सेस नहीं किया जा सकता।
                    </p>
                    <p>
                      <strong className="text-white">हार्वर्ड (Harvard) आर्किटेक्चर:</strong> इसमें कोड मेमोरी (ROM) और डेटा मेमोरी (RAM) भौतिक रूप से पूरी तरह अलग-अलग होती हैं और दोनों की अपनी अलग एड्रेस व डेटा बस होती है। CPU एक ही समय में ROM से अगला निर्देश पढ़ सकता है और RAM में डेटा लिख सकता है। 8051 इसी आर्किटेक्चर पर आधारित है!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Matrix Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
                <span>📊</span> 8-Point University Exam Comparison Table
              </h4>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/15 bg-white/[0.04] text-[#94a3b8] uppercase text-[10px]">
                      <th className="py-2.5 px-3">Feature</th>
                      <th className="py-2.5 px-3 text-cyan-300">Harvard Architecture (e.g. 8051)</th>
                      <th className="py-2.5 px-3 text-emerald-300">Von Neumann Architecture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/40">
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Memory Structure</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Physically separate Code ROM and Data RAM</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Single unified memory for both code and data</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Bus Architecture</td>
                      <td className="py-2 px-3 text-cyan-300">Separate code address/data bus and data bus</td>
                      <td className="py-2 px-3 text-emerald-300">Single shared address and data bus</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Execution Speed</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">Faster; instruction fetch and data access happen in parallel</td>
                      <td className="py-2 px-3 text-yellow-400">Slower; must wait for bus sequentially (Bottleneck)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Bus Bottleneck</td>
                      <td className="py-2 px-3 text-emerald-400">None; dual buses operate concurrently</td>
                      <td className="py-2 px-3 text-rose-400 font-bold">Severe "Von Neumann Bottleneck"</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Code Security</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">High; data writes cannot accidentally overwrite code ROM</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Lower; buffer overflow can corrupt instructions</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">8051 Hardware Pins</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Pin 29 (/PSEN) for ROM; P3.6 (/WR) and P3.7 (/RD) for RAM</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Single common read/write strobe</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">8051 Instructions</td>
                      <td className="py-2 px-3 text-[#cbd5e1]"><code>MOVC</code> for Code ROM; <code>MOVX</code> for External RAM</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Uniform load/store memory instructions</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Typical Examples</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Intel 8051, Microchip PIC, Atmel AVR, DSP processors</td>
                      <td className="py-2 px-3 text-[#cbd5e1]">Intel x86 (8086), Motorola 68000, ARM Cortex-A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: MICROPROCESSOR VS MICROCONTROLLER
          ========================================================================= */}
      {activeTopic === 'mpuVsMcu' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#080d15]/90 border border-white/15 backdrop-blur-2xl">
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                Unit 1 · Foundational Terminology
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Microprocessor vs Microcontroller
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1">
                Comparing general-purpose computational CPUs (e.g. 8086, Intel Core) against dedicated embedded System-on-Chips (e.g. 8051, ESP32).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase font-mono">Microprocessor (µP / MPU)</div>
                <h4 className="text-base font-bold text-white">CPU on a Chip (Requires External Peripherals)</h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Contains only the Central Processing Unit (ALU, Registers, Program Counter). It does <strong>NOT</strong> contain on-chip RAM, ROM, I/O ports, or timers. Designers must connect external RAM chips, ROM chips, 8255 PPI, and 8253 timer ICs on the PCB to create a functional system.
                </p>
                <div className="pt-2 text-[11px] text-[#94a3b8] border-t border-white/5">
                  <strong>Examples:</strong> Intel 8085, 8086, Pentium, AMD Ryzen, Apple M-series.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-emerald-300 uppercase font-mono">Microcontroller (µC / MCU)</div>
                <h4 className="text-base font-bold text-white">Entire Computer on a Single Silicon Die</h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Integrates CPU + <strong>on-chip RAM + on-chip ROM + digital I/O ports + hardware timers + serial UART</strong> on a single monolithic IC. Requires only a DC power supply and crystal to start running control programs.
                </p>
                <div className="pt-2 text-[11px] text-[#94a3b8] border-t border-white/5">
                  <strong>Examples:</strong> Intel 8051, ATmega328P, PIC16F877A, STM32, ESP32.
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.04] text-[#94a3b8] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Criteria</th>
                    <th className="py-2.5 px-3 text-cyan-300">Microprocessor (8086)</th>
                    <th className="py-2.5 px-3 text-emerald-300">Microcontroller (8051)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/40">
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Internal Hardware</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Only CPU; no internal RAM, ROM, or I/O</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">CPU + 128B RAM + 4KB ROM + Timers + UART</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">System Size & Cost</td>
                    <td className="py-2 px-3 text-yellow-400">Bulky PCB; expensive due to external ICs</td>
                    <td className="py-2 px-3 text-emerald-400">Compact single-chip; extremely inexpensive</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Power Consumption</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">High power; unsuitable for battery operation</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Very low power; power-down & idle modes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Bit Handling</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Byte/Word oriented; weak bit manipulation</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">Boolean processor with dedicated bit instructions</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Primary Focus</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">High-speed general computing (PCs, Laptops)</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Dedicated hardware control (Washing machines, ECUs)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: RISC VS CISC ARCHITECTURE
          ========================================================================= */}
      {activeTopic === 'riscVsCisc' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#080d15]/90 border border-white/15 backdrop-blur-2xl">
            <div className="border-b border-white/10 pb-4 mb-6">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                Unit 1 · Instruction Set Classification
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                RISC vs CISC Architecture
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1">
                Comparing Reduced Instruction Set Computers against Complex Instruction Set Computers — Why 8051 is classified as a classic CISC processor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase font-mono">CISC (Complex Instruction Set Computer)</div>
                <h4 className="text-base font-bold text-white">The 8051 Model (Emphasis on Hardware Microcode)</h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Has a large repertoire of instructions (8051 has 111 distinct instructions) of varying length (1, 2, or 3 bytes) taking variable clock cycles (1 to 4 machine cycles). Instructions like <code>MUL AB</code> and <code>DIV AB</code> perform multi-step arithmetic in hardware microcode.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-emerald-300 uppercase font-mono">RISC (Reduced Instruction Set Computer)</div>
                <h4 className="text-base font-bold text-white">The Modern Pipelined Model (ARM, AVR, RISC-V)</h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Uses a small, optimized set of uniform-length instructions (typically 32-bit fixed) that execute in a single clock cycle through hardwired execution pipelines. Uses a pure Load/Store architecture where ALU operations only occur between CPU registers.
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.04] text-[#94a3b8] uppercase text-[10px]">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3 text-cyan-300">CISC (8051 MCS-51)</th>
                    <th className="py-2.5 px-3 text-emerald-300">RISC (ARM, AVR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/40">
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Instruction Count</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Many instructions (111 in 8051)</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Fewer, highly optimized instructions (&lt; 50)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Instruction Size</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Variable (1, 2, or 3 bytes in 8051)</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Fixed size (32-bit or 16-bit uniform)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Cycles per Instruction</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Variable (1, 2, or 4 machine cycles)</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">Uniform 1 cycle execution via pipelining</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Addressing Modes</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Many complex addressing modes (5 in 8051)</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Fewer, simple addressing modes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-white">Memory Access</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">ALU can directly operate on RAM operands</td>
                    <td className="py-2 px-3 text-[#cbd5e1]">Strict Load/Store; ALU operates only on registers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

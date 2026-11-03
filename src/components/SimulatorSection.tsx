import React, { useState, useEffect, useRef } from 'react';
import {
  createInitialState,
  parseAssembly,
  executeStep,
  CPUState,
  ParsedInstruction,
} from '../simulator/emulator';
import { assemblyPrograms } from '../data/programs';
import { Play, Pause, StepForward, RotateCcw, Terminal, Cpu } from 'lucide-react';

export const SimulatorSection: React.FC = () => {
  const [selectedProgramIdx, setSelectedProgramIdx] = useState(0);
  const [code, setCode] = useState(assemblyPrograms[0].code);
  const [cpuState, setCpuState] = useState<CPUState>(createInitialState);
  const [currentInstIdx, setCurrentInstIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(['8051 Virtual Core Ready.']);
  const [viewTab, setViewTab] = useState<'registers' | 'ram' | 'ports' | 'serial'>('registers');

  const parsedRef = useRef<{
    instructions: ParsedInstruction[];
    labels: Record<string, number>;
  }>({ instructions: [], labels: {} });

  const handleSelectPreset = (idx: number) => {
    setSelectedProgramIdx(idx);
    setCode(assemblyPrograms[idx].code);
    handleReset(assemblyPrograms[idx].code, assemblyPrograms[idx].initialState.RAM);
  };

  const handleReset = (newCode?: string, initialRam?: Record<number, number>) => {
    setIsRunning(false);
    const codeToParse = newCode !== undefined ? newCode : code;
    const parsed = parseAssembly(codeToParse);
    parsedRef.current = {
      instructions: parsed.instructions,
      labels: parsed.labels,
    };
    const fresh = createInitialState();
    if (initialRam) {
      Object.entries(initialRam).forEach(([k, v]) => {
        fresh.RAM[Number(k)] = v;
      });
    }
    setCpuState(fresh);
    setCurrentInstIdx(0);
    setLogs(['Core reset. Registers and internal RAM initialized.']);
  };

  useEffect(() => {
    handleReset(code);
  }, []);

  const step = () => {
    const { instructions, labels } = parsedRef.current;
    if (currentInstIdx >= instructions.length) {
      setIsRunning(false);
      setLogs((prev) => [...prev.slice(-20), 'Program reached END or halt.']);
      return;
    }

    const nextState = {
      ...cpuState,
      R: [...cpuState.R],
      PSW: { ...cpuState.PSW },
      RAM: new Uint8Array(cpuState.RAM),
      SFR: { ...cpuState.SFR },
    };

    const res = executeStep(nextState, currentInstIdx, instructions, labels);
    setCpuState(nextState);
    setCurrentInstIdx(res.nextInstIdx);
    setLogs((prev) => [...prev.slice(-20), `[${res.nextInstIdx}] ${res.log}`]);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        const { instructions } = parsedRef.current;
        if (currentInstIdx >= instructions.length) {
          setIsRunning(false);
        } else {
          step();
        }
      }, 250);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, currentInstIdx, cpuState]);

  const toHex = (n: number, pad = 2) =>
    (n || 0).toString(16).toUpperCase().padStart(pad, '0') + 'H';

  const toBin = (n: number) =>
    (n || 0).toString(2).padStart(8, '0');

  const currentLine = parsedRef.current.instructions[currentInstIdx]?.lineNum;

  return (
    <section id="simulator" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
            INTERACTIVE LEARNING LAB
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Virtual 8051 Microcontroller Simulator
          </h2>
          <p className="text-sm text-[#8895a7] mt-1">
            Write or load handwritten 8051 assembly code, single-step instructions, inspect CPU registers, and view internal RAM in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#808c9f] hidden sm:inline">Load Sample:</span>
          <select
            value={selectedProgramIdx}
            onChange={(e) => handleSelectPreset(Number(e.target.value))}
            className="bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs border border-white/20 rounded-xl px-3 py-2 cursor-pointer focus:outline-none backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all"
          >
            {assemblyPrograms.map((p, i) => (
              <option key={p.id} value={i} className="bg-[#0c0f16] text-white">
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Editor & Execution Controls */}
        <div className="lg:col-span-6 frost-glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-white" />
              <span>Assembly Source Code</span>
            </div>
            <div className="text-xs text-[#8e9bb0] font-mono">
              Cycles: <strong className="text-white">{cpuState.cycles} µs</strong>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isRunning ? (
              <button
                type="button"
                onClick={() => {
                  parsedRef.current = parseAssembly(code);
                  setIsRunning(true);
                }}
                className="frost-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Run</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRunning(false)}
                className="frost-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={step}
              disabled={isRunning}
              className="frost-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>Single Step</span>
            </button>

            <button
              type="button"
              onClick={() => handleReset(code)}
              className="frost-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#b0bccf] hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Code Textarea with Line indicator */}
          <div className="relative font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                parsedRef.current = parseAssembly(e.target.value);
              }}
              rows={12}
              className="w-full bg-[#030508]/80 border border-white/15 rounded-2xl p-4 text-[#e2e8f0] font-mono leading-relaxed focus:outline-none focus:border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] resize-y select-text backdrop-blur-md"
              spellCheck={false}
            />
            {currentLine !== undefined && (
              <div className="text-[11px] font-mono text-[#8e9bb0] bg-white/[0.05] border border-white/15 px-3.5 py-2 rounded-xl mt-2 flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <span>Active Line: <strong className="text-white font-mono">{currentLine + 1}</strong></span>
                <span className="text-neutral-300 truncate max-w-[280px]">
                  {parsedRef.current.instructions[currentInstIdx]?.raw.trim() || 'Halted'}
                </span>
              </div>
            )}
          </div>

          {/* Execution Log */}
          <div className="frost-glass-panel rounded-2xl p-3.5 text-xs font-mono max-h-32 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#718096] tracking-wider mb-1 flex items-center gap-1">
              <Terminal className="w-3 h-3" /> Execution Trace
            </div>
            {logs.map((log, i) => (
              <div key={i} className="text-[#a0aec0]">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Virtual CPU Dashboard & Memory */}
        <div className="lg:col-span-6 frost-glass rounded-3xl p-6 space-y-4">
          {/* Dashboard Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'registers', label: 'CPU Registers' },
                { id: 'ram', label: 'Internal RAM (128B)' },
                { id: 'ports', label: 'I/O Ports' },
                { id: 'serial', label: 'UART Console' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    viewTab === tab.id
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'bg-white/[0.04] text-[#a0aab8] border-white/10 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: CPU Registers */}
          {viewTab === 'registers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="frost-glass-panel rounded-2xl p-3.5">
                  <div className="text-[10px] text-[#808c9f] uppercase font-bold">ACC (A)</div>
                  <div className="text-xl font-mono font-bold text-white">{toHex(cpuState.A)}</div>
                  <div className="text-[10px] text-[#808c9f] font-mono">{cpuState.A} (dec)</div>
                </div>

                <div className="frost-glass-panel rounded-2xl p-3.5">
                  <div className="text-[10px] text-[#808c9f] uppercase font-bold">B Register</div>
                  <div className="text-xl font-mono font-bold text-white">{toHex(cpuState.B)}</div>
                  <div className="text-[10px] text-[#808c9f] font-mono">{cpuState.B} (dec)</div>
                </div>

                <div className="frost-glass-panel rounded-2xl p-3.5">
                  <div className="text-[10px] text-[#808c9f] uppercase font-bold">DPTR</div>
                  <div className="text-xl font-mono font-bold text-white">{toHex(cpuState.DPTR, 4)}</div>
                  <div className="text-[10px] text-[#808c9f] font-mono">DPH:DPL</div>
                </div>

                <div className="frost-glass-panel rounded-2xl p-3.5">
                  <div className="text-[10px] text-[#808c9f] uppercase font-bold">Stack (SP)</div>
                  <div className="text-xl font-mono font-bold text-white">{toHex(cpuState.SP)}</div>
                  <div className="text-[10px] text-[#808c9f] font-mono">Reset: 07H</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9aa4b4] mb-2">
                  Active Register Bank (R0 – R7)
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {cpuState.R.map((rVal, idx) => (
                    <div
                      key={idx}
                      className="frost-glass-panel rounded-xl p-2 text-center"
                    >
                      <div className="text-[10px] text-[#808c9f] font-mono font-bold">R{idx}</div>
                      <div className="text-xs font-mono font-bold text-white">{toHex(rVal)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="frost-glass-panel rounded-2xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9aa4b4] mb-2.5 flex items-center justify-between">
                  <span>Program Status Word (PSW - D0H)</span>
                  <span className="text-[10px] text-[#718096] font-mono">Flag Status</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
                  {[
                    { name: 'CY', val: cpuState.PSW.CY, desc: 'Carry' },
                    { name: 'AC', val: cpuState.PSW.AC, desc: 'Aux Carry' },
                    { name: 'F0', val: cpuState.PSW.F0, desc: 'Flag 0' },
                    { name: 'RS1', val: cpuState.PSW.RS1, desc: 'Bank Sel 1' },
                    { name: 'RS0', val: cpuState.PSW.RS0, desc: 'Bank Sel 0' },
                    { name: 'OV', val: cpuState.PSW.OV, desc: 'Overflow' },
                    { name: 'P', val: cpuState.PSW.P, desc: 'Parity' },
                  ].map((fl) => (
                    <div
                      key={fl.name}
                      className={`p-2 rounded-xl border transition-all ${
                        fl.val
                          ? 'bg-white text-black border-white font-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                          : 'bg-white/[0.02] text-[#606d80] border-white/10'
                      }`}
                      title={`${fl.desc}: ${fl.val ? '1' : '0'}`}
                    >
                      <div className="text-[10px]">{fl.name}</div>
                      <div className="font-bold">{fl.val ? '1' : '0'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="frost-glass-panel rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#808c9f]">Timer 0</div>
                  <div className="flex justify-between text-neutral-300">
                    <span>TMOD:</span>
                    <strong className="text-white font-mono">{toHex(cpuState.TMOD)}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>TH0 / TL0:</span>
                    <strong className="text-white font-mono">
                      {toHex(cpuState.TH0)} / {toHex(cpuState.TL0)}
                    </strong>
                  </div>
                </div>

                <div className="frost-glass-panel rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#808c9f]">Timer 1 / Control</div>
                  <div className="flex justify-between text-neutral-300">
                    <span>TCON:</span>
                    <strong className="text-white font-mono">{toHex(cpuState.TCON)}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>TH1 / TL1:</span>
                    <strong className="text-white font-mono">
                      {toHex(cpuState.TH1)} / {toHex(cpuState.TL1)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Internal RAM Hex Grid */}
          {viewTab === 'ram' && (
            <div className="space-y-3">
              <div className="text-xs text-[#8e9bb0] flex items-center justify-between">
                <span>Internal 128 Bytes RAM Map (00H – 7FH)</span>
                <span className="text-[10px] font-mono text-[#718096]">Non-zero cells highlighted</span>
              </div>
              <div className="frost-glass-panel rounded-2xl p-3 max-h-72 overflow-y-auto">
                <div className="grid grid-cols-9 gap-1 font-mono text-[10px] text-center">
                  <div className="text-[#718096] font-bold">Base</div>
                  {Array.from({ length: 8 }).map((_, col) => (
                    <div key={col} className="text-[#718096] font-bold">+{col}</div>
                  ))}
                  {Array.from({ length: 16 }).map((_, row) => {
                    const rowBase = row * 8;
                    return (
                      <React.Fragment key={row}>
                        <div className="text-[#8e9bb0] font-bold bg-white/[0.04] py-1 rounded-md border border-white/5">
                          {toHex(rowBase)}
                        </div>
                        {Array.from({ length: 8 }).map((_, col) => {
                          const addr = rowBase + col;
                          const val = cpuState.RAM[addr] || 0;
                          return (
                            <div
                              key={addr}
                              className={`py-1 rounded-md transition-all border ${
                                val > 0
                                  ? 'bg-white text-black font-extrabold border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                                  : 'bg-white/[0.02] text-[#606d80] border-transparent'
                              }`}
                              title={`RAM Address ${toHex(addr)}: ${toHex(val)} (${val})`}
                            >
                              {toHex(val, 2).replace('H', '')}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: I/O Ports */}
          {viewTab === 'ports' && (
            <div className="space-y-4">
              <div className="text-xs text-[#8e9bb0]">
                Real-time Port Pin Logic Levels (1 = HIGH / Floating input, 0 = LOW / Sink GND)
              </div>
              {[
                { name: 'Port 0 (80H - Open Drain)', val: cpuState.P0 },
                { name: 'Port 1 (90H - General I/O)', val: cpuState.P1 },
                { name: 'Port 2 (A0H - High Address)', val: cpuState.P2 },
                { name: 'Port 3 (B0H - Alternate Functions)', val: cpuState.P3 },
              ].map((port) => (
                <div key={port.name} className="frost-glass-panel rounded-2xl p-3.5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white">{port.name}</span>
                    <span className="font-mono text-[#a0aec0]">{toHex(port.val)} ({toBin(port.val)})</span>
                  </div>
                  <div className="grid grid-cols-8 gap-2 text-center">
                    {Array.from({ length: 8 }).map((_, bit) => {
                      const isHigh = (port.val & (1 << (7 - bit))) !== 0;
                      return (
                        <div
                          key={bit}
                          className={`p-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                            isHigh
                              ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                              : 'bg-white/[0.02] text-[#556275] border-white/5'
                          }`}
                        >
                          <div className="text-[9px] text-[#718096]">.{7 - bit}</div>
                          <div>{isHigh ? '1' : '0'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Serial UART Console */}
          {viewTab === 'serial' && (
            <div className="space-y-3">
              <div className="text-xs text-[#8e9bb0] flex items-center justify-between">
                <span>Hardware UART Terminal (TXD / RXD at 9600 Baud)</span>
                <button
                  type="button"
                  onClick={() => setCpuState({ ...cpuState, serialOutput: '' })}
                  className="text-[10px] text-neutral-300 hover:text-white underline"
                >
                  Clear Console
                </button>
              </div>
              <div className="bg-[#030508]/85 border border-white/15 rounded-2xl p-4 font-mono text-xs text-[#86efac] min-h-[160px] whitespace-pre-wrap select-all backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                {cpuState.serialOutput || '> [Waiting for SBUF transmission...]'}
              </div>
              <div className="text-[11px] text-[#718096] font-mono">
                SBUF: {toHex(cpuState.SBUF)} | SCON: {toHex(cpuState.SCON)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

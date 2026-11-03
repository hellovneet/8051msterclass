import React, { useState, useEffect } from 'react';
import { Lightbulb, Radio, Volume2, Grid3X3 } from 'lucide-react';

export const CircuitLabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'led' | 'traffic' | 'sevenseg' | 'keypad' | 'buzzer'>('led');

  // LED & Switch State
  const [switchClosed, setSwitchClosed] = useState(false);

  // Traffic Light State
  const [trafficLight, setTrafficLight] = useState<'red' | 'yellow' | 'green'>('red');
  const [trafficTimer, setTrafficTimer] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrafficTimer((prev) => {
        if (prev <= 1) {
          if (trafficLight === 'red') {
            setTrafficLight('green');
            return 5;
          } else if (trafficLight === 'green') {
            setTrafficLight('yellow');
            return 2;
          } else {
            setTrafficLight('red');
            return 5;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [trafficLight]);

  // Seven-Segment state
  const [currentDigit, setCurrentDigit] = useState<number>(0);
  const segPatterns: Record<number, { hex: string; bits: string }> = {
    0: { hex: '3FH', bits: '00111111' },
    1: { hex: '06H', bits: '00000110' },
    2: { hex: '5BH', bits: '01011011' },
    3: { hex: '4FH', bits: '01001111' },
    4: { hex: '66H', bits: '01100110' },
    5: { hex: '6DH', bits: '01101101' },
    6: { hex: '7DH', bits: '01111101' },
    7: { hex: '07H', bits: '00000111' },
    8: { hex: '7FH', bits: '01111111' },
    9: { hex: '6FH', bits: '01101111' },
    10: { hex: '77H', bits: '01110111' },
    11: { hex: '7CH', bits: '01111100' },
    12: { hex: '39H', bits: '00111001' },
    13: { hex: '5EH', bits: '01011110' },
    14: { hex: '79H', bits: '01111001' },
    15: { hex: '71H', bits: '01110001' },
  };

  // 4x4 Keypad State
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [activeScanRow, setActiveScanRow] = useState<number>(0);

  const keys = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D'],
  ];

  const handleKeyPress = (k: string, rowIdx: number) => {
    setActiveScanRow(rowIdx);
    setPressedKey(k);
    setTimeout(() => setPressedKey(null), 1500);
  };

  const [toneHz, setToneHz] = useState<number>(1000);

  return (
    <section id="circuits" className="py-12 scroll-mt-20 border-t border-white/10">
      <div className="mb-8">
        <div className="text-xs font-black tracking-widest text-[#9aa4b4] uppercase mb-1">
          HARDWARE VISUALIZATION
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Virtual Circuit Interfacing Lab
        </h2>
        <p className="text-sm text-[#8895a7] mt-1">
          Interactive schematic animations demonstrating real-world pin connections, voltage logic levels, and transducer interfacing with the 8051.
        </p>
      </div>

      {/* Circuit Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {[
          { id: 'led', label: '1. LED & Switch Interfacing', icon: Lightbulb },
          { id: 'traffic', label: '2. Traffic Light Sequence', icon: Radio },
          { id: 'sevenseg', label: '3. 7-Segment Display (BCD)', icon: Grid3X3 },
          { id: 'keypad', label: '4. 4×4 Matrix Keypad', icon: Grid3X3 },
          { id: 'buzzer', label: '5. Speaker Frequency Generator', icon: Volume2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.04] text-[#a0aab8] border-white/10 hover:bg-white/[0.08] hover:text-white backdrop-blur-md'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="frost-glass rounded-3xl p-6 sm:p-8">
        {/* TAB 1: LED & Switch */}
        {activeTab === 'led' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[10px] font-mono text-neutral-200">
                P1.0 (LED Output) · P3.3 (Active-Low Switch Input)
              </span>
              <h3 className="text-xl font-bold text-white">
                Push Button & LED Interfacing
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Port 3.3 is configured as an input pin with an external 10kΩ pull-up resistor. Pressing the tactile button pulls P3.3 to Ground (Logic 0). The 8051 reads P3.3; when 0 is detected, it writes 1 to P1.0 to illuminate the LED.
              </p>

              <div className="frost-glass-panel p-4 rounded-2xl space-y-2 text-xs">
                <div className="text-white font-bold">Interfacing Pin Connections:</div>
                <div className="text-[#8895a7] font-mono leading-relaxed">
                  • 8051 Pin 1 (P1.0) → 330Ω Resistor → LED Anode → LED Cathode to GND<br />
                  • 8051 Pin 13 (P3.3) → Push Button → GND (with 10kΩ Pull-up to +5V)
                </div>
              </div>

              <div className="bg-[#030508]/80 p-3.5 rounded-2xl border border-white/15 text-xs font-mono text-[#dcdcdc] backdrop-blur-md">
                <div className="text-[#718096] mb-1">; 8051 Assembly Logic</div>
                SETB P3.3      ; Make P3.3 an input pin<br />
                CHECK: JNB P3.3,TURN_ON ; Jump if switch pressed (0)<br />
                CLR P1.0       ; Turn LED OFF<br />
                SJMP CHECK<br />
                TURN_ON: SETB P1.0 ; Turn LED ON<br />
                SJMP CHECK
              </div>
            </div>

            <div className="lg:col-span-6 frost-glass-panel rounded-3xl p-7 flex flex-col items-center justify-center space-y-6">
              <div className="text-xs text-[#808c9f] uppercase font-mono tracking-widest">
                Interactive Circuit Simulation
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                  <div className="text-xs text-[#a0aec0] font-mono">Switch (P3.3)</div>
                  <button
                    type="button"
                    onClick={() => setSwitchClosed(!switchClosed)}
                    className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold border transition-all ${
                      switchClosed
                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.06] text-[#8e9bb0] border-white/15 hover:border-white/30'
                    }`}
                  >
                    {switchClosed ? 'CLOSED (0V)' : 'OPEN (+5V)'}
                  </button>
                  <div className="text-[10px] text-[#718096]">Click to toggle switch</div>
                </div>

                <div className="text-white/40 font-bold text-lg">→ 8051 →</div>

                <div className="text-center space-y-2">
                  <div className="text-xs text-[#a0aec0] font-mono">LED (P1.0)</div>
                  <div
                    className={`w-14 h-14 rounded-full mx-auto border-2 flex items-center justify-center transition-all duration-300 ${
                      switchClosed
                        ? 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.9),inset_0_1px_2px_#fff]'
                        : 'bg-white/[0.04] border-white/15 text-[#556275]'
                    }`}
                  >
                    <Lightbulb className={`w-6 h-6 ${switchClosed ? 'stroke-[2.5]' : ''}`} />
                  </div>
                  <div className="text-xs font-mono font-bold text-white">
                    {switchClosed ? 'LED ON' : 'LED OFF'}
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-[#808c9f] border-t border-white/10 pt-3 w-full">
                Simulated circuit response: Switch Closed pulls P3.3 LOW → Microcontroller drives P1.0 HIGH.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Traffic Light */}
        {activeTab === 'traffic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[10px] font-mono text-neutral-200">
                P1.0 (Red) · P1.1 (Yellow) · P1.2 (Green)
              </span>
              <h3 className="text-xl font-bold text-white">
                Automated Traffic Light Controller
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Traffic intersections use fixed or sensor-driven state sequences. In this 8051 routine, Timer 0 produces standard delay intervals: 5 seconds Red (Stop), 5 seconds Green (Go), and 2 seconds Yellow (Prepare).
              </p>
              <div className="frost-glass-panel p-4 rounded-2xl text-xs font-mono space-y-1.5 text-[#8895a7]">
                <div>• RED LED on P1.0: 5 Seconds Hold</div>
                <div>• GREEN LED on P1.2: 5 Seconds Hold</div>
                <div>• YELLOW LED on P1.1: 2 Seconds Transition</div>
              </div>
            </div>

            <div className="lg:col-span-6 frost-glass-panel rounded-3xl p-7 flex flex-col items-center justify-center space-y-4">
              <div className="bg-[#05080e]/90 border border-white/20 rounded-3xl p-5 w-28 flex flex-col items-center gap-4 shadow-2xl backdrop-blur-md">
                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                    trafficLight === 'red'
                      ? 'bg-white border-white text-black shadow-[0_0_24px_#fff]'
                      : 'bg-white/[0.03] border-white/10 text-[#556275]'
                  }`}
                >
                  RED
                </div>

                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                    trafficLight === 'yellow'
                      ? 'bg-white border-white text-black shadow-[0_0_24px_#fff]'
                      : 'bg-white/[0.03] border-white/10 text-[#556275]'
                  }`}
                >
                  YLW
                </div>

                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                    trafficLight === 'green'
                      ? 'bg-white border-white text-black shadow-[0_0_24px_#fff]'
                      : 'bg-white/[0.03] border-white/10 text-[#556275]'
                  }`}
                >
                  GRN
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-[#808c9f] font-mono">Current Phase Countdown:</span>
                <div className="text-2xl font-mono font-bold text-white">{trafficTimer}s</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Seven Segment */}
        {activeTab === 'sevenseg' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[10px] font-mono text-neutral-200">
                P2.0–P2.7 (Segments a through g + DP)
              </span>
              <h3 className="text-xl font-bold text-white">
                Seven-Segment Display Hex Pattern Table
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Each segment (a to g) of a Common-Cathode display requires a logic 1 to light up. Select any hex numeral below to view its 8-bit bus pattern and corresponding assembly lookup byte.
              </p>

              <div className="grid grid-cols-8 gap-1.5">
                {Array.from({ length: 16 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentDigit(idx)}
                    className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      currentDigit === idx
                        ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {idx.toString(16).toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="frost-glass-panel p-4 rounded-2xl text-xs font-mono space-y-1">
                <div className="text-white font-bold">Selected Digit: {currentDigit.toString(16).toUpperCase()}</div>
                <div className="text-neutral-300">Port 2 Hex Pattern: <strong className="text-white">{segPatterns[currentDigit].hex}</strong></div>
                <div className="text-neutral-400">Binary Bitfield (dp-g-f-e-d-c-b-a): {segPatterns[currentDigit].bits}</div>
              </div>
            </div>

            <div className="lg:col-span-6 frost-glass-panel rounded-3xl p-8 flex flex-col items-center justify-center">
              <div className="border-4 border-white/20 rounded-3xl bg-[#030508]/90 p-8 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.1)]">
                <span className="font-mono text-7xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                  {currentDigit.toString(16).toUpperCase()}
                </span>
              </div>
              <div className="mt-4 text-xs font-mono text-[#808c9f]">
                Common-Cathode Output Active
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Keypad */}
        {activeTab === 'keypad' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[10px] font-mono text-neutral-200">
                P1.0–P1.3 (Rows Out) · P1.4–P1.7 (Columns In)
              </span>
              <h3 className="text-xl font-bold text-white">
                4×4 Matrix Keypad Scanning
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Click any key on the simulated matrix keypad. Watch the row driver pulse LOW to identify the row, and read the active column return line to register the key.
              </p>

              <div className="frost-glass-panel p-4 rounded-2xl text-xs font-mono space-y-2">
                <div className="text-white font-bold">Scanner Register Status:</div>
                <div className="text-neutral-400">Active Grounded Row: Row {activeScanRow} (P1.{activeScanRow} = 0)</div>
                <div className="text-neutral-300">
                  Last Key Pressed: <strong className="text-white text-sm">{pressedKey || 'None'}</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 frost-glass-panel rounded-3xl p-6 flex flex-col items-center justify-center">
              <div className="bg-[#05080e]/90 border border-white/20 rounded-3xl p-5 grid grid-cols-4 gap-3 shadow-2xl backdrop-blur-md">
                {keys.map((row, rIdx) =>
                  row.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKeyPress(k, rIdx)}
                      className={`w-12 h-12 rounded-2xl font-mono text-sm font-bold border transition-all active:scale-90 ${
                        pressedKey === k
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                          : 'bg-white/[0.06] text-white border-white/15 hover:border-white/40 hover:bg-white/[0.12]'
                      }`}
                    >
                      {k}
                    </button>
                  ))
                )}
              </div>
              <div className="text-[11px] text-[#808c9f] mt-3.5 font-mono">
                Click keys to trigger hardware scan routine
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Buzzer */}
        {activeTab === 'buzzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-[10px] font-mono text-neutral-200">
                P1.5 → BC547 Transistor Driver → 8Ω Speaker
              </span>
              <h3 className="text-xl font-bold text-white">
                Speaker Tone & Frequency Generation
              </h3>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                The 8051 output port cannot source enough current (max 10-15 mA) to directly drive an electromagnetic speaker. A BC547 NPN transistor acts as a current amplifier. Toggling P1.5 at periodic intervals generates pure square wave audio frequencies.
              </p>

              <div className="flex gap-2 flex-wrap">
                {[500, 1000, 2000, 4000].map((hz) => (
                  <button
                    key={hz}
                    type="button"
                    onClick={() => setToneHz(hz)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      toneHz === hz
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.04] text-neutral-300 border-white/15 hover:border-white/30'
                    }`}
                  >
                    {hz} Hz
                  </button>
                ))}
              </div>

              <div className="frost-glass-panel p-4 rounded-2xl text-xs font-mono space-y-1">
                <div>Period T: {(1000 / toneHz).toFixed(2)} ms</div>
                <div>Half-period toggle: {(500 / toneHz).toFixed(2)} ms</div>
                <div>Timer 0 Ticks needed at 12 MHz: {Math.round(500000 / toneHz)} ticks</div>
              </div>
            </div>

            <div className="lg:col-span-6 frost-glass-panel rounded-3xl p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-full bg-[#030508]/85 border border-white/15 rounded-2xl p-5 font-mono text-center backdrop-blur-md">
                <div className="text-[11px] text-[#808c9f] mb-2 uppercase font-bold tracking-wider">
                  Simulated Square Wave Output
                </div>
                <div className="h-20 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 300 60" className="w-full h-full stroke-white fill-none stroke-2 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                    <path d="M0 50 H30 V10 H60 V50 H90 V10 H120 V50 H150 V10 H180 V50 H210 V10 H240 V50 H270 V10 H300" />
                  </svg>
                </div>
                <div className="text-xs text-neutral-300 font-bold mt-2">
                  Frequency: {toneHz} Hz (Period = {(1000 / toneHz).toFixed(2)} ms)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * 8051 Baud Rate & Timer Calculation Engine
 * Reference: Kenneth J. Ayala, "The 8051 Microcontroller", Chapters 2, 7 & 9
 */

export interface BaudCalculationResult {
  foscHz: number;
  foscMHz: number;
  machineCycleHz: number;
  machineCyclePeriodUs: number;
  targetBaud: number;
  smod: 0 | 1;
  timer1ClockHz: number;
  uartPrescaler: number;
  desiredOverflowRateHz: number;
  exactReloadCount: number;
  roundedReloadCount: number;
  th1Decimal: number;
  th1Hex: string;
  actualBaud: number;
  errorPercentage: number;
  isReliable: boolean;
  statusMessage: string;
  assemblyCode: string;
}

export interface TimerDelayResult {
  foscHz: number;
  delayMs: number;
  delayUs: number;
  machineCycleUs: number;
  requiredTicks: number;
  mode: 1 | 2; // 1 = 16-bit, 2 = 8-bit auto-reload
  maxPossibleTicks: number;
  isOverflow: boolean;
  initialCount: number;
  thHex: string;
  tlHex: string;
  assemblyCode: string;
}

export interface BaudTableEntry {
  baud: number;
  foscMHz: number;
  smod: 0 | 1;
  th1Hex: string;
  actualBaud: number;
  errorPercentage: number;
  notes: string;
}

/**
 * Calculates Timer 1 Mode 2 reload value and baud rate parameters for 8051 UART Mode 1/3
 * Formula:
 * Baud Rate = (2^SMOD / 32) * (Timer 1 Overflow Rate)
 * Timer 1 Overflow Rate = Fosc / (12 * (256 - TH1))
 * => Baud Rate = (2^SMOD * Fosc) / (384 * (256 - TH1))
 * => (256 - TH1) = (2^SMOD * Fosc) / (384 * Baud Rate)
 */
export function calculateBaudRate(
  foscHz: number,
  targetBaud: number,
  smod: 0 | 1
): BaudCalculationResult {
  const foscMHz = foscHz / 1_000_000;
  const machineCycleHz = foscHz / 12;
  const machineCyclePeriodUs = 12_000_000 / foscHz;

  // SMOD doubles the baud rate by changing prescaler from 32 to 16
  const uartPrescaler = smod === 1 ? 16 : 32;
  const timer1ClockHz = machineCycleHz;

  // Desired overflow rate for Timer 1
  const desiredOverflowRateHz = targetBaud * uartPrescaler;

  // Exact (256 - TH1)
  const exactReloadCount = (Math.pow(2, smod) * foscHz) / (384 * targetBaud);

  // Clamped rounded count between 1 and 256
  let roundedReloadCount = Math.round(exactReloadCount);
  if (roundedReloadCount < 1) roundedReloadCount = 1;
  if (roundedReloadCount > 256) roundedReloadCount = 256;

  // TH1 = 256 - roundedReloadCount (or 0 if reload count is 256)
  const th1Decimal = (256 - roundedReloadCount) & 0xff;
  const th1Hex = (th1Decimal < 16 ? '0' : '') + th1Decimal.toString(16).toUpperCase() + 'H';
  const th1FormattedAsm = th1Decimal >= 10 && th1Decimal <= 15 || th1Hex.match(/^[A-F]/) 
    ? '0' + th1Hex 
    : (th1Decimal < 16 ? '0' + th1Hex : th1Hex);

  // Actual generated baud rate
  const actualBaud = (Math.pow(2, smod) * foscHz) / (384 * roundedReloadCount);
  const errorPercentage = Math.abs((actualBaud - targetBaud) / targetBaud) * 100;

  // In asynchronous serial communication, UART tolerates up to ~2.5% frequency drift
  const isReliable = errorPercentage <= 2.5;

  let statusMessage = '';
  if (errorPercentage === 0) {
    statusMessage = 'Perfect match (0.00% error). Ideal for error-free PC/UART communication.';
  } else if (isReliable) {
    statusMessage = `Acceptable (${errorPercentage.toFixed(2)}% error). Within standard 2.5% UART tolerance.`;
  } else {
    statusMessage = `High Error (${errorPercentage.toFixed(2)}% error)! Exceeds 2.5% tolerance; frame/parity errors will occur. Use 11.0592 MHz crystal.`;
  }

  // Generate assembly code snippet
  const smodAsm = smod === 1 
    ? `MOV A, PCON\nSETB ACC.7           ; SMOD = 1 (Double baud rate)\nMOV PCON, A\n`
    : `; Standard baud rate (SMOD = 0 in PCON)\n`;

  const assemblyCode = `; --- 8051 UART Mode 1 Initialization (${targetBaud} Baud, ${foscMHz.toFixed(4)} MHz) ---
${smodAsm}MOV TMOD, #20H       ; Timer 1, Mode 2 (8-bit auto-reload)
MOV TH1, #${th1FormattedAsm}      ; Reload value for ${targetBaud} baud
MOV SCON, #50H       ; Mode 1 (8-bit UART), REN=1 (Receiver Enabled)
SETB TR1             ; Start Timer 1
; UART is now ready for TX (via SBUF/TI) and RX (via SBUF/RI)`;

  return {
    foscHz,
    foscMHz,
    machineCycleHz,
    machineCyclePeriodUs,
    targetBaud,
    smod,
    timer1ClockHz,
    uartPrescaler,
    desiredOverflowRateHz,
    exactReloadCount,
    roundedReloadCount,
    th1Decimal,
    th1Hex,
    actualBaud,
    errorPercentage,
    isReliable,
    statusMessage,
    assemblyCode
  };
}

/**
 * Calculates Timer delay parameters for Mode 1 (16-bit) or Mode 2 (8-bit)
 */
export function calculateTimerDelay(
  foscHz: number,
  delayMs: number,
  mode: 1 | 2
): TimerDelayResult {
  const delayUs = delayMs * 1000;
  const machineCycleUs = 12_000_000 / foscHz;
  const requiredTicks = Math.round(delayUs / machineCycleUs);
  const maxPossibleTicks = mode === 1 ? 65536 : 256;
  const isOverflow = requiredTicks > maxPossibleTicks;

  const initialCount = isOverflow ? 0 : (maxPossibleTicks - requiredTicks);

  let thHex = '00H';
  let tlHex = '00H';

  if (mode === 1) {
    const th = (initialCount >> 8) & 0xff;
    const tl = initialCount & 0xff;
    thHex = (th < 16 ? '0' : '') + th.toString(16).toUpperCase() + 'H';
    tlHex = (tl < 16 ? '0' : '') + tl.toString(16).toUpperCase() + 'H';
    if (thHex.match(/^[A-F]/)) thHex = '0' + thHex;
    if (tlHex.match(/^[A-F]/)) tlHex = '0' + tlHex;
  } else {
    const th = initialCount & 0xff;
    thHex = (th < 16 ? '0' : '') + th.toString(16).toUpperCase() + 'H';
    tlHex = thHex;
    if (thHex.match(/^[A-F]/)) thHex = '0' + thHex;
  }

  const modeHex = mode === 1 ? '01H' : '02H';
  const assemblyCode = isOverflow 
    ? `; Delay exceeds single timer capacity (${(maxPossibleTicks * machineCycleUs / 1000).toFixed(2)} ms max).
; Use a looping software counter or lower delay value.`
    : `; --- 8051 Timer 0 Delay Routine (${delayMs} ms @ ${(foscHz / 1e6).toFixed(4)} MHz) ---
DELAY:
    MOV TMOD, #${modeHex}     ; Timer 0 Mode ${mode}
    MOV TL0, #${tlHex}      ; Load low byte
    MOV TH0, #${thHex}      ; Load high byte
    CLR TF0            ; Clear overflow flag
    SETB TR0           ; Start Timer 0
WAIT_LOOP:
    JNB TF0, WAIT_LOOP ; Poll TF0 until overflow
    CLR TR0            ; Stop Timer 0
    CLR TF0            ; Clear TF0 flag for next use
    RET`;

  return {
    foscHz,
    delayMs,
    delayUs,
    machineCycleUs,
    requiredTicks,
    mode,
    maxPossibleTicks,
    isOverflow,
    initialCount,
    thHex,
    tlHex,
    assemblyCode
  };
}

/**
 * Standard reference table comparing standard frequencies (Kenneth J. Ayala Table 9-3)
 */
export function getStandardBaudTable(): BaudTableEntry[] {
  return [
    { baud: 9600, foscMHz: 11.0592, smod: 0, th1Hex: 'FDH (-3)', actualBaud: 9600, errorPercentage: 0.0, notes: 'Standard UART PC communication (Exact 0% error)' },
    { baud: 4800, foscMHz: 11.0592, smod: 0, th1Hex: 'FAH (-6)', actualBaud: 4800, errorPercentage: 0.0, notes: 'Exact integer reload value' },
    { baud: 2400, foscMHz: 11.0592, smod: 0, th1Hex: 'F4H (-12)', actualBaud: 2400, errorPercentage: 0.0, notes: 'Exact integer reload value' },
    { baud: 1200, foscMHz: 11.0592, smod: 0, th1Hex: 'E8H (-24)', actualBaud: 1200, errorPercentage: 0.0, notes: 'Exact integer reload value' },
    { baud: 19200, foscMHz: 11.0592, smod: 1, th1Hex: 'FDH (-3)', actualBaud: 19200, errorPercentage: 0.0, notes: 'Double baud with SMOD = 1 (PCON.7)' },
    { baud: 38400, foscMHz: 11.0592, smod: 1, th1Hex: 'FFH (-1)', actualBaud: 28800, errorPercentage: 25.0, notes: 'Cannot achieve cleanly without external clock' },
    { baud: 9600, foscMHz: 12.0000, smod: 0, th1Hex: 'FDH (-3)', actualBaud: 10416, errorPercentage: 8.51, notes: 'Severe error (>8.5%) - PC receiver framing error' },
    { baud: 9600, foscMHz: 12.0000, smod: 1, th1Hex: 'F9H (-7)', actualBaud: 8928, errorPercentage: 7.00, notes: 'Double baud still has ~7% error' },
    { baud: 2400, foscMHz: 12.0000, smod: 0, th1Hex: 'F3H (-13)', actualBaud: 2403, errorPercentage: 0.16, notes: 'Low error, acceptable for 2400 baud' },
    { baud: 1200, foscMHz: 16.0000, smod: 0, th1Hex: 'BBH (-69)', actualBaud: 1207, errorPercentage: 0.64, notes: 'Usable with 16 MHz microcontroller' },
    { baud: 9600, foscMHz: 16.0000, smod: 0, th1Hex: 'F7H (-9)', actualBaud: 9259, errorPercentage: 3.55, notes: 'Marginal error > 2.5%, framing errors possible' },
  ];
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  formula: string;
  substitution: string;
  result: string;
  explanationEn: string;
  explanationHi: string;
  highlight?: boolean;
}

export interface DetailedBaudDerivation {
  id: string;
  presetKey: string;
  badge: string;
  title: string;
  targetBaud: number;
  foscMHz: number;
  foscHz: number;
  smod: 0 | 1;
  th1Hex: string;
  th1Decimal: number;
  reloadCount: number;
  actualBaud: number;
  errorPercentage: number;
  isReliable: boolean;
  steps: DerivationStep[];
  assemblyCode: string;
  ayalaQuote: string;
  conceptualTakeawayEn: string;
  conceptualTakeawayHi: string;
}

/**
 * Returns comprehensive pedagogical derivations for the standard 8051 baud rates
 */
export function getCommonBaudDerivations(): DetailedBaudDerivation[] {
  return [
    {
      id: 'baud-9600-standard',
      presetKey: '9600',
      badge: 'Standard PC UART',
      title: '9600 Baud Rate using 11.0592 MHz Crystal & SMOD = 0',
      targetBaud: 9600,
      foscMHz: 11.0592,
      foscHz: 11059200,
      smod: 0,
      th1Hex: 'FDH',
      th1Decimal: 253,
      reloadCount: 3,
      actualBaud: 9600,
      errorPercentage: 0.0,
      isReliable: true,
      ayalaQuote: 'Ayala Section 9.3: "By choosing an 11.0592 MHz crystal, all standard baud rates from 110 to 19,200 baud can be generated with 0% error."',
      conceptualTakeawayEn: 'At 11.0592 MHz, the machine cycle clock is 921.6 kHz. Dividing by 32 UART prescaler yields 28,800 Hz. Dividing by 9600 baud yields EXACTLY 3. Hence TH1 = 256 - 3 = 253 (0FDH).',
      conceptualTakeawayHi: '11.0592 MHz पर मशीन साइकल 921.6 kHz बनता है। 32 से भाग देने पर 28,800 Hz मिलता है। 9600 बॉड के लिए ठीक 3 का भागफल आता है। इसलिए TH1 = 256 - 3 = 253 (0FDH) शून्य त्रुटि (0% error) देता है।',
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate 8051 Internal Machine Cycle Frequency (Fmc)',
          formula: 'F_mc = F_osc / 12',
          substitution: 'F_mc = 11,059,200 Hz / 12',
          result: '921,600 Hz = 921.6 kHz',
          explanationEn: 'The 8051 internal oscillator divides the external crystal frequency by 12 to generate 1 machine cycle.',
          explanationHi: '8051 की आंतरिक टाइमिंग सर्किटरी क्रिस्टल फ्रीक्वेंसी को 12 से विभाजित करके 1 मशीन साइकल बनाती है।'
        },
        {
          stepNumber: 2,
          title: 'UART Prescaler Stage (SMOD = 0 in PCON.7)',
          formula: 'UART Clock = F_mc / (32 / 2^SMOD)',
          substitution: 'UART Clock = 921,600 Hz / (32 / 2^0) = 921,600 / 32',
          result: '28,800 Hz',
          explanationEn: 'When SMOD = 0, the internal UART divider divides the timer overflow rate by 32.',
          explanationHi: 'जब SMOD = 0 होता है, तो UART का आंतरिक डिवाइडर टाइमर 1 के ओवरफ्लो को 32 से भाग देता है।'
        },
        {
          stepNumber: 3,
          title: 'Calculate Required Timer 1 Overflow Rate for 9600 Baud',
          formula: 'Overflow Rate = Desired Baud Rate × 32',
          substitution: 'Overflow Rate = 9600 × 32',
          result: '307,200 Hz (Overflows per second)',
          explanationEn: 'Timer 1 must overflow 307,200 times per second so that after division by 32, exactly 9600 pulses/sec enter the UART.',
          explanationHi: 'टाइमर 1 को प्रति सेकंड 307,200 बार ओवरफ्लो होना चाहिए ताकि 32 से भाग होने के बाद UART को ठीक 9600 पल्स/सेकंड मिलें।'
        },
        {
          stepNumber: 4,
          title: 'Solve for Timer 1 Mode 2 Reload Count (256 - TH1)',
          formula: 'Reload Count = F_mc / Overflow Rate = F_osc / [ 384 × Baud Rate ]',
          substitution: 'Reload Count = 11,059,200 / [ 384 × 9600 ] = 11,059,200 / 3,686,400',
          result: '3 (Exact integer!)',
          explanationEn: 'The required counter count is exactly 3. Mode 2 auto-reloads this value into TL1 after every 3 machine cycles.',
          explanationHi: 'आवश्यक गिनती ठीक 3 है। मोड 2 में टाइमर 1 हर 3 मशीन चक्रों के बाद खुद को स्वतः रीलोड करता है।',
          highlight: true
        },
        {
          stepNumber: 5,
          title: 'Calculate TH1 Register Hexadecimal Value',
          formula: 'TH1 = 256 - Reload Count (or in 2\'s complement: -Count)',
          substitution: 'TH1 = 256 - 3 = 253 (decimal) = -3',
          result: '253 = 0FDH (Binary: 1111 1101b)',
          explanationEn: 'In 8051 assembly, we write MOV TH1, #0FDH or MOV TH1, #-3. The assembler converts -3 to 0FDH automatically.',
          explanationHi: 'असेंबली भाषा में हम MOV TH1, #0FDH या MOV TH1, #-3 लिखते हैं। दोनों का मान एक ही (0FDH) होता है।'
        },
        {
          stepNumber: 6,
          title: 'Actual Baud Rate & Error Verification',
          formula: 'Actual Baud = F_osc / [ 384 × 3 ]',
          substitution: 'Actual Baud = 11,059,200 / 1,152',
          result: '9600.00 bps (0.00% Error - Perfect Synchronization)',
          explanationEn: 'The generated baud rate matches 9600 bps with zero mathematical error. Stop bits and start bits sample at exactly mid-bit.',
          explanationHi: 'उत्पन्न बॉड दर बिना किसी त्रुटि के 9600 bps से मेल खाती है। रिसीवर बिना किसी फ्रेमिंग एरर के डेटा पढ़ता है।'
        }
      ],
      assemblyCode: `; ==============================================================
; 8051 UART Initialization Routine: 9600 Baud (Mode 1)
; Crystal: 11.0592 MHz | SMOD = 0 | TH1 = 0FDH (-3)
; ==============================================================
INIT_UART_9600:
    MOV TMOD, #20H      ; Timer 1 in Mode 2 (8-bit auto-reload)
    MOV TH1, #0FDH      ; Load reload value for 9600 baud (-3)
    MOV SCON, #50H      ; Mode 1 (8-bit UART, variable baud), REN=1 (Enable RX)
    SETB TR1            ; Start Timer 1 running
    RET                 ; Ready for serial transfer via SBUF`
    },
    {
      id: 'baud-19200-smod1',
      presetKey: '19200',
      badge: 'SMOD = 1 Baud Doubler',
      title: '19200 Baud Rate using 11.0592 MHz Crystal & SMOD = 1',
      targetBaud: 19200,
      foscMHz: 11.0592,
      foscHz: 11059200,
      smod: 1,
      th1Hex: 'FDH',
      th1Decimal: 253,
      reloadCount: 3,
      actualBaud: 19200,
      errorPercentage: 0.0,
      isReliable: true,
      ayalaQuote: 'Ayala Section 9.4: "Setting bit 7 in PCON (SMOD) doubles the serial port baud rate by dividing the timer overflow rate by 16 instead of 32."',
      conceptualTakeawayEn: 'Notice that TH1 remains 0FDH! By simply setting SMOD=1 (bit 7 of PCON at 87H), the internal prescaler switches from /32 to /16, instantly doubling 9600 to 19200 without changing timer reload value.',
      conceptualTakeawayHi: 'ध्यान दें कि TH1 का मान 0FDH ही रहता है! PCON रजिस्टर (87H) के 7वें बिट SMOD को 1 करने से डिवाइडर 32 के बजाय 16 हो जाता है, जिससे बॉड दर बिना TH1 बदले 9600 से 19200 हो जाती है।',
      steps: [
        {
          stepNumber: 1,
          title: 'Examine Master Formula with SMOD = 1',
          formula: 'Baud Rate = [ 2^SMOD / 32 ] × [ F_osc / (12 × (256 - TH1)) ]',
          substitution: 'Baud Rate = [ 2^1 / 32 ] × [ 11,059,200 / (12 × (256 - TH1)) ] = [ 1 / 16 ] × [ F_mc / (256 - TH1) ]',
          result: 'Prescaler divisor halves from 32 to 16',
          explanationEn: '2^1 = 2. 2 / 32 = 1 / 16. The baud rate is doubled for any given timer overflow frequency.',
          explanationHi: '2^1 = 2। 2/32 = 1/16। टाइमर 1 की ओवरफ्लो दर अब 16 से विभाजित होती है, जिससे बॉड रेट दोगुना हो जाता है।'
        },
        {
          stepNumber: 2,
          title: 'Calculate Reload Count (256 - TH1) for 19200 Baud',
          formula: 'Reload Count = [ 2^1 × F_osc ] / [ 384 × Baud Rate ]',
          substitution: 'Reload Count = [ 2 × 11,059,200 ] / [ 384 × 19,200 ] = 22,118,400 / 7,372,800',
          result: '3 (Exact integer!)',
          explanationEn: 'Reload count is still 3! 256 - 3 = 253 = 0FDH.',
          explanationHi: 'रीलोड काउंट अभी भी 3 ही है! 256 - 3 = 253 = 0FDH।'
        },
        {
          stepNumber: 3,
          title: 'Setting SMOD in Assembly Language',
          formula: 'PCON.7 = 1 (PCON is byte-addressable at 87H)',
          substitution: 'MOV A, PCON; SETB ACC.7; MOV PCON, A',
          result: 'SMOD = 1 configured',
          explanationEn: 'Because PCON is NOT bit-addressable, we cannot write SETB PCON.7. We must read PCON into Accumulator, set bit 7 with SETB ACC.7, and write back to PCON.',
          explanationHi: 'PCON बिट-एड्रेसेबल नहीं है, इसलिए सीधे SETB PCON.7 नहीं लिख सकते। हमें पहले PCON को Accumulator में लाना होता है, ACC.7 को 1 करना होता है, फिर PCON में वापस लिखना होता है।'
        },
        {
          stepNumber: 4,
          title: 'Actual Baud Rate & Error Verification',
          formula: 'Actual Baud = [ 2 × 11,059,200 ] / [ 384 × 3 ]',
          substitution: 'Actual Baud = 22,118,400 / 1,152',
          result: '19,200.00 bps (0.00% Error)',
          explanationEn: 'Exact high-speed 19200 bps transmission with zero timing jitter.',
          explanationHi: 'शून्य त्रुटि (0.00% error) के साथ 19200 bps की हाई स्पीड ट्रांसमिशन प्राप्त होती है।'
        }
      ],
      assemblyCode: `; ==============================================================
; 8051 UART Initialization Routine: 19200 Baud (Mode 1)
; Crystal: 11.0592 MHz | SMOD = 1 | TH1 = 0FDH (-3)
; ==============================================================
INIT_UART_19200:
    MOV A, PCON         ; Read current PCON register
    SETB ACC.7          ; Set SMOD bit (D7) to double baud rate
    MOV PCON, A         ; Write back to PCON (87H)
    MOV TMOD, #20H      ; Timer 1 in Mode 2 (8-bit auto-reload)
    MOV TH1, #0FDH      ; Reload value remains 0FDH (-3)
    MOV SCON, #50H      ; Mode 1 (8-bit UART), REN=1
    SETB TR1            ; Start Timer 1
    RET`
    },
    {
      id: 'baud-4800-standard',
      presetKey: '4800',
      badge: 'Medium Speed UART',
      title: '4800 Baud Rate using 11.0592 MHz Crystal & SMOD = 0',
      targetBaud: 4800,
      foscMHz: 11.0592,
      foscHz: 11059200,
      smod: 0,
      th1Hex: 'FAH',
      th1Decimal: 250,
      reloadCount: 6,
      actualBaud: 4800,
      errorPercentage: 0.0,
      isReliable: true,
      ayalaQuote: 'Ayala Section 9.3: "Halving the baud rate from 9600 to 4800 simply doubles the timer reload count from 3 to 6."',
      conceptualTakeawayEn: 'Since 4800 baud is half of 9600 baud, Timer 1 must overflow at half the speed. The count doubles from 3 to 6. TH1 = 256 - 6 = 250 = 0FAH.',
      conceptualTakeawayHi: 'चूंकि 4800 बॉड 9600 का आधा है, इसलिए टाइमर 1 को आधी गति से ओवरफ्लो होना होगा। काउंट 3 से दोगुना होकर 6 हो जाता है। TH1 = 256 - 6 = 250 = 0FAH बनता है।',
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Machine Cycle & UART Frequency',
          formula: 'F_mc = F_osc / 12 = 921.6 kHz | UART Prescaler = 32',
          substitution: 'UART Base Clock = 921,600 / 32',
          result: '28,800 Hz',
          explanationEn: 'The base prescaler frequency remains 28,800 Hz.',
          explanationHi: 'आधार प्रेस्कैलर आवृत्ति 28,800 Hz ही रहती है।'
        },
        {
          stepNumber: 2,
          title: 'Solve for Reload Count (256 - TH1)',
          formula: 'Reload Count = F_osc / [ 384 × Baud Rate ]',
          substitution: 'Reload Count = 11,059,200 / [ 384 × 4800 ] = 11,059,200 / 1,843,200',
          result: '6 (Exact integer!)',
          explanationEn: 'Timer 1 counts 6 machine cycles per overflow.',
          explanationHi: 'टाइमर 1 प्रति ओवरफ्लो 6 मशीन चक्र गिनता है।'
        },
        {
          stepNumber: 3,
          title: 'Determine TH1 Register Value',
          formula: 'TH1 = 256 - 6 (Decimal) = -6 (2\'s Complement)',
          substitution: '256 - 6 = 250 (Decimal)',
          result: '250 = 0FAH (Hexadecimal)',
          explanationEn: '250 in hex: 250 / 16 = 15 (F) with remainder 10 (A) -> 0FAH.',
          explanationHi: '250 को 16 से भाग देने पर 15 (F) और शेष 10 (A) आता है, यानी 0FAH।'
        },
        {
          stepNumber: 4,
          title: 'Error Verification',
          formula: 'Actual Baud = 11,059,200 / [ 384 × 6 ]',
          substitution: '11,059,200 / 2,304',
          result: '4800.00 bps (0.00% Error)',
          explanationEn: 'Exact match with zero error.',
          explanationHi: 'शून्य प्रतिशत त्रुटि के साथ सटीक मिलान।'
        }
      ],
      assemblyCode: `; ==============================================================
; 8051 UART Initialization Routine: 4800 Baud (Mode 1)
; Crystal: 11.0592 MHz | SMOD = 0 | TH1 = 0FAH (-6)
; ==============================================================
INIT_UART_4800:
    MOV TMOD, #20H      ; Timer 1 in Mode 2 (8-bit auto-reload)
    MOV TH1, #0FAH      ; Reload value for 4800 baud (-6)
    MOV SCON, #50H      ; Mode 1, 8-bit UART, REN=1
    SETB TR1            ; Start Timer 1
    RET`
    },
    {
      id: 'baud-2400-standard',
      presetKey: '2400',
      badge: 'Industrial Long-Haul UART',
      title: '2400 Baud Rate using 11.0592 MHz Crystal & SMOD = 0',
      targetBaud: 2400,
      foscMHz: 11.0592,
      foscHz: 11059200,
      smod: 0,
      th1Hex: 'F4H',
      th1Decimal: 244,
      reloadCount: 12,
      actualBaud: 2400,
      errorPercentage: 0.0,
      isReliable: true,
      ayalaQuote: 'Ayala Section 9.3: "2400 baud requires an overflow count of 12. TH1 = 256 - 12 = 244 = F4H."',
      conceptualTakeawayEn: '2400 baud is half of 4800. The reload count doubles from 6 to 12. TH1 = 256 - 12 = 244 = 0F4H.',
      conceptualTakeawayHi: '2400 बॉड 4800 का आधा है। रीलोड काउंट 6 से दोगुना होकर 12 हो जाता है। TH1 = 256 - 12 = 244 = 0F4H होता है।',
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Reload Count (256 - TH1)',
          formula: 'Reload Count = F_osc / [ 384 × 2400 ]',
          substitution: '11,059,200 / [ 384 × 2400 ] = 11,059,200 / 921,600',
          result: '12 (Exact integer!)',
          explanationEn: '28,800 / 2400 = exactly 12.',
          explanationHi: '28,800 / 2400 = ठीक 12।'
        },
        {
          stepNumber: 2,
          title: 'Determine TH1 Register Value',
          formula: 'TH1 = 256 - 12 = 244 (Decimal)',
          substitution: '244 = 15 × 16 + 4',
          result: '244 = 0F4H (-12)',
          explanationEn: 'In assembly: MOV TH1, #0F4H or MOV TH1, #-12.',
          explanationHi: 'असेंबली में: MOV TH1, #0F4H या MOV TH1, #-12 लिखा जाता है।'
        },
        {
          stepNumber: 3,
          title: 'Error Verification',
          formula: 'Actual Baud = 11,059,200 / [ 384 × 12 ] = 11,059,200 / 4,608',
          substitution: '11,059,200 / 4,608',
          result: '2400.00 bps (0.00% Error)',
          explanationEn: 'Exact match with zero error.',
          explanationHi: 'शून्य त्रुटि के साथ सटीक 2400 bps।'
        }
      ],
      assemblyCode: `; ==============================================================
; 8051 UART Initialization Routine: 2400 Baud (Mode 1)
; Crystal: 11.0592 MHz | SMOD = 0 | TH1 = 0F4H (-12)
; ==============================================================
INIT_UART_2400:
    MOV TMOD, #20H      ; Timer 1 in Mode 2 (8-bit auto-reload)
    MOV TH1, #0F4H      ; Reload value for 2400 baud (-12)
    MOV SCON, #50H      ; Mode 1, 8-bit UART, REN=1
    SETB TR1            ; Start Timer 1
    RET`
    },
    {
      id: 'baud-1200-standard',
      presetKey: '1200',
      badge: 'Telemetry & Modem Speed',
      title: '1200 Baud Rate using 11.0592 MHz Crystal & SMOD = 0',
      targetBaud: 1200,
      foscMHz: 11.0592,
      foscHz: 11059200,
      smod: 0,
      th1Hex: 'E8H',
      th1Decimal: 232,
      reloadCount: 24,
      actualBaud: 1200,
      errorPercentage: 0.0,
      isReliable: true,
      ayalaQuote: 'Ayala Section 9.3: "For 1200 baud, 28,800 / 1200 = 24. TH1 = 256 - 24 = 232 = E8H."',
      conceptualTakeawayEn: '28,800 / 1200 = 24. TH1 = 256 - 24 = 232 = 0E8H. Perfect for long-distance RS-232 telemetry cables.',
      conceptualTakeawayHi: '28,800 / 1200 = 24। TH1 = 256 - 24 = 232 = 0E8H। लंबी दूरी की RS-232 केबल के लिए आदर्श है।',
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Reload Count (256 - TH1)',
          formula: 'Reload Count = F_osc / [ 384 × 1200 ]',
          substitution: '11,059,200 / [ 384 × 1200 ] = 11,059,200 / 460,800',
          result: '24 (Exact integer!)',
          explanationEn: '28,800 / 1200 = exactly 24.',
          explanationHi: '28,800 / 1200 = ठीक 24।'
        },
        {
          stepNumber: 2,
          title: 'Determine TH1 Register Value',
          formula: 'TH1 = 256 - 24 = 232 (Decimal)',
          substitution: '232 = 14 × 16 + 8',
          result: '232 = 0E8H (-24)',
          explanationEn: 'In assembly: MOV TH1, #0E8H or MOV TH1, #-24.',
          explanationHi: 'असेंबली में: MOV TH1, #0E8H या MOV TH1, #-24 लिखा जाता है।'
        },
        {
          stepNumber: 3,
          title: 'Error Verification',
          formula: 'Actual Baud = 11,059,200 / [ 384 × 24 ]',
          substitution: '11,059,200 / 9,216',
          result: '1200.00 bps (0.00% Error)',
          explanationEn: 'Exact match with zero error.',
          explanationHi: 'शून्य त्रुटि के साथ सटीक 1200 bps।'
        }
      ],
      assemblyCode: `; ==============================================================
; 8051 UART Initialization Routine: 1200 Baud (Mode 1)
; Crystal: 11.0592 MHz | SMOD = 0 | TH1 = 0E8H (-24)
; ==============================================================
INIT_UART_1200:
    MOV TMOD, #20H      ; Timer 1 in Mode 2 (8-bit auto-reload)
    MOV TH1, #0E8H      ; Reload value for 1200 baud (-24)
    MOV SCON, #50H      ; Mode 1, 8-bit UART, REN=1
    SETB TR1            ; Start Timer 1
    RET`
    },
    {
      id: 'baud-9600-12mhz-error',
      presetKey: '12mhz',
      badge: '⚠️ Classic Exam Pitfall (Error Analysis)',
      title: '9600 Baud Rate using 12.0000 MHz Crystal (Why 12 MHz Fails!)',
      targetBaud: 9600,
      foscMHz: 12.0000,
      foscHz: 12000000,
      smod: 0,
      th1Hex: 'FDH',
      th1Decimal: 253,
      reloadCount: 3,
      actualBaud: 10416.67,
      errorPercentage: 8.51,
      isReliable: false,
      ayalaQuote: 'Ayala Section 9.3: "With a 12 MHz crystal, the reload count for 9600 baud is 3.255. Rounding to 3 produces 10,416 baud — an 8.5% error that exceeds RS-232 UART tolerance."',
      conceptualTakeawayEn: 'Why does 12 MHz fail? 12,000,000 / (384 * 9600) = 3.2552. A digital timer register cannot store fractional counts. Rounding to 3 produces 10,416.7 bps (+8.51% error). Over a 10-bit serial frame (Start + 8 data + Stop), the receiver bit sampler drifts by 85% of a bit period and samples the wrong voltage, producing Framing Errors (FE) and garbled text!',
      conceptualTakeawayHi: '12 MHz क्यों फेल हो जाता है? 12,000,000 / (384 * 9600) = 3.2552 आता है। डिजिटल टाइमर केवल पूर्णांक (integer) स्टोर कर सकता है। 3 रीलोड करने पर बॉड दर 10,416.7 bps हो जाती है (8.51% त्रुटि)। RS-232 में अधिकतम 2.5% त्रुटि की अनुमति होती है। 8.51% पर 10वें बिट तक आते-आते क्लॉक 85% खिसक जाती है और गलत डेटा पढ़ा जाता है!',
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Machine Cycle for 12.0000 MHz',
          formula: 'F_mc = F_osc / 12',
          substitution: '12,000,000 Hz / 12',
          result: '1,000,000 Hz = 1.000 MHz (Machine cycle = exactly 1.0 µs)',
          explanationEn: 'While 1.0 µs machine cycle is convenient for delay calculations, it causes fractional frequencies for UART baud rates.',
          explanationHi: 'यद्यपि 1.0 µs मशीन साइकल सामान्य डिले गणना के लिए आसान है, लेकिन UART के लिए यह दशमलव वाली विषम संख्याएं बनाता है।'
        },
        {
          stepNumber: 2,
          title: 'Solve for Exact Required Reload Count (256 - TH1)',
          formula: 'Reload Count = F_osc / [ 384 × Baud Rate ]',
          substitution: '12,000,000 / [ 384 × 9600 ] = 12,000,000 / 3,686,400',
          result: '3.255208... (Fractional number!)',
          explanationEn: 'Timer 1 register TH1 is an 8-bit digital register; it CANNOT store 3.2552. It can only store integers (3 or 4).',
          explanationHi: 'TH1 एक 8-बिट डिजिटल रजिस्टर है; यह 3.2552 स्टोर नहीं कर सकता। यह केवल पूर्णांक 3 या 4 ही रख सकता है।',
          highlight: true
        },
        {
          stepNumber: 3,
          title: 'Evaluate Nearest Integer Rounding (N = 3 -> TH1 = 0FDH)',
          formula: 'TH1 = 256 - 3 = 253 = 0FDH',
          substitution: 'Actual Baud = 12,000,000 / [ 384 × 3 ] = 12,000,000 / 1,152',
          result: 'Actual Baud = 10,416.67 bps',
          explanationEn: 'The microcontroller will transmit at 10,416.67 bps instead of 9600 bps!',
          explanationHi: 'माइक्रोकंट्रोलर 9600 bps के बजाय 10,416.67 bps की गति से डेटा भेजने लगेगा!'
        },
        {
          stepNumber: 4,
          title: 'Calculate Baud Rate Error Percentage',
          formula: '% Error = [ |Actual Baud - Target Baud| / Target Baud ] × 100%',
          substitution: '[ |10,416.67 - 9600| / 9600 ] × 100% = [ 816.67 / 9600 ] × 100%',
          result: '+8.51% Fatal Baud Error (Permissible limit is ≤ 2.5%)',
          explanationEn: 'An 8.51% error is more than triple the allowable UART tolerance (2.5%). Characters sent to a PC will show up as gibberish (e.g.  or random garbage characters).',
          explanationHi: '8.51% की त्रुटि मानक टॉलरेंस (2.5%) से तीन गुना अधिक है। कंप्यूटर टर्मिनल पर कैरेक्टर कचरा (garbled symbols) बनकर दिखाई देंगे।'
        },
        {
          stepNumber: 5,
          title: 'What If We Round Up to N = 4 (TH1 = 0FCH = 252)?',
          formula: 'Actual Baud = 12,000,000 / [ 384 × 4 ] = 12,000,000 / 1,536',
          substitution: 'Actual Baud = 7812.5 bps',
          result: '% Error = |7812.5 - 9600| / 9600 × 100% = -18.62% Error (Even worse!)',
          explanationEn: 'Rounding to 4 is even worse (-18.62%). This mathematically proves why an 11.0592 MHz crystal MUST be used for 9600 baud serial communication!',
          explanationHi: '4 रीलोड करने पर -18.62% त्रुटि आती है जो और भी खराब है। यह गणितीय रूप से सिद्ध करता है कि 8051 में UART के लिए 11.0592 MHz क्रिस्टल ही क्यों अनिवार्य है!'
        }
      ],
      assemblyCode: `; ==============================================================
; WARNING: 12.0 MHz Crystal generates 10416 Baud (+8.51% Error)
; Use 11.0592 MHz crystal for reliable 9600 Baud PC communication.
; ==============================================================
INIT_UART_12MHZ_FAULTY:
    MOV TMOD, #20H      ; Timer 1 in Mode 2
    MOV TH1, #0FDH      ; Reload value 3 -> yields 10416.67 bps (+8.51% error!)
    MOV SCON, #50H      ; Mode 1, 8-bit UART
    SETB TR1            ; Start Timer 1 (Framing errors will occur!)
    RET`
    }
  ];
}


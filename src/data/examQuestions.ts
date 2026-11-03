export interface ExamQuestion {
  id: string;
  marks: 2 | 5 | 10;
  unit: number;
  question: string;
  questionHi: string;
  modelAnswerEn: string;
  modelAnswerHi: string;
  keyPoints: string[];
}

export const examQuestionsBank: ExamQuestion[] = [
  {
    id: 'eq1',
    marks: 2,
    unit: 1,
    question: "Differentiate between a Microprocessor and a Microcontroller.",
    questionHi: "माइक्रोप्रोसेसर और माइक्रोकंट्रोलर में अंतर स्पष्ट करें।",
    modelAnswerEn: "A microprocessor contains only the CPU (ALU, registers, control logic) and requires external RAM, ROM, and I/O peripherals (e.g. Intel 8085). A microcontroller integrates the CPU, RAM, ROM, timers, and I/O ports on a single silicon chip (e.g. 8051), making it ideal for compact embedded control.",
    modelAnswerHi: "माइक्रोप्रोसेसर में केवल CPU होता है तथा RAM, ROM और I/O को बाहर से जोड़ना पड़ता है। माइक्रोकंट्रोलर में CPU, RAM, ROM, टाइमर और I/O पोर्ट्स एक ही चिप पर मौजूद होते हैं।",
    keyPoints: ["Microprocessor = CPU only", "Microcontroller = CPU + RAM + ROM + I/O on single chip", "Cost & board size significantly reduced"]
  },
  {
    id: 'eq2',
    marks: 2,
    unit: 1,
    question: "State the functions of the ALE and PSEN pins in 8051.",
    questionHi: "8051 में ALE और PSEN पिन्स के कार्य बताएं।",
    modelAnswerEn: "ALE (Address Latch Enable, Pin 30) outputs a pulse to demultiplex the lower address/data bus (Port 0) into separate address lines A0–A7 using an external latch (74LS373). PSEN (Program Store Enable, Pin 29) is the active-low read strobe to fetch opcodes from external Program ROM.",
    modelAnswerHi: "ALE (Pin 30) Port 0 के multiplexed address/data को अलग करने हेतु 74LS373 लैच को सिग्नल देता है। PSEN (Pin 29) बाहरी Program ROM से कोड पढ़ने का रीड सिग्नल है।",
    keyPoints: ["ALE = Address demultiplexing", "PSEN = External ROM read strobe"]
  },
  {
    id: 'eq3',
    marks: 2,
    unit: 2,
    question: "Explain the difference between SJMP, AJMP, and LJMP instructions.",
    questionHi: "SJMP, AJMP और LJMP निर्देशों में क्या अंतर है?",
    modelAnswerEn: "SJMP (Short Jump) is a 2-byte instruction using an 8-bit relative offset (-128 to +127 bytes). AJMP (Absolute Jump) is a 2-byte instruction targeting within the same 2 KB page using an 11-bit address. LJMP (Long Jump) is a 3-byte instruction with a full 16-bit destination address anywhere in the 64 KB code space.",
    modelAnswerHi: "SJMP 2 बाइट का -128 से +127 बाइट्स का जंप है। AJMP 2 बाइट में उसी 2 KB पेज के अंदर जंप करता है। LJMP 3 बाइट का निर्देश है जो पूरे 64 KB में कहीं भी जंप कर सकता है।",
    keyPoints: ["SJMP: 2 bytes, relative ±128 bytes", "AJMP: 2 bytes, 2 KB page boundary", "LJMP: 3 bytes, entire 64 KB address space"]
  },
  {
    id: 'eq4',
    marks: 5,
    unit: 3,
    question: "Explain the bit structure of TMOD register and show configuration for Timer 0 in Mode 1.",
    questionHi: "TMOD रजिस्टर का बिट स्ट्रक्चर समझाएं तथा Timer 0 को Mode 1 में कॉन्फ़िगर करें।",
    modelAnswerEn: "TMOD (Timer Mode, 89H) is an 8-bit register divided into two nibbles. Upper nibble controls Timer 1; lower nibble controls Timer 0. Each nibble has GATE, C/T, M1, M0 bits.\n- GATE: When 0, timer starts via TR bit alone. When 1, timer starts only if INT pin is high AND TR is set.\n- C/T: 0 = Timer (internal clock), 1 = Counter (external pin pulses).\n- M1,M0: 00 = Mode 0 (13-bit), 01 = Mode 1 (16-bit), 10 = Mode 2 (8-bit auto-reload), 11 = Mode 3 (split).\nTo set Timer 0 in Mode 1 as internal timer: TMOD = 0000 0001B = 01H.",
    modelAnswerHi: "TMOD (89H) 8-बिट रजिस्टर है। ऊपरी 4 बिट्स Timer 1 और निचले 4 बिट्स Timer 0 को नियंत्रित करते हैं। प्रत्येक में GATE, C/T, M1, M0 होते हैं। Mode 1 के लिए M1:M0 = 01 होता है। Timer 0 Mode 1 के लिए निर्देश: MOV TMOD,#01H।",
    keyPoints: ["Upper nibble: Timer 1, Lower nibble: Timer 0", "GATE, C/T, M1, M0 bit roles", "Mode 1 = 16-bit timer (0 to 65535)"]
  },
  {
    id: 'eq5',
    marks: 5,
    unit: 3,
    question: "Calculate the initial reload value for Timer 0 Mode 1 to generate a 5 ms delay at 12 MHz.",
    questionHi: "12 MHz क्रिस्टल पर Timer 0 Mode 1 में 5 ms देरी उत्पन्न करने के लिए इनिशियल रिलोड वैल्यू की गणना करें।",
    modelAnswerEn: "Step 1: Clock frequency Fosc = 12 MHz.\nStep 2: Machine cycle clock = 12 MHz / 12 = 1 MHz. Machine cycle period Tm = 1 / 1 MHz = 1 µs.\nStep 3: Required delay = 5 ms = 5,000 µs.\nStep 4: Number of clock ticks required N = 5,000 µs / 1 µs = 5,000 ticks.\nStep 5: Mode 1 is a 16-bit timer counting up to 65,536.\nStep 6: Initial count = 65,536 - 5,000 = 60,536.\nStep 7: Convert to hexadecimal: 60,536 = EC78H.\nTherefore: TH0 = ECH, TL0 = 78H.\nAssembly code:\nMOV TMOD,#01H\nMOV TL0,#78H\nMOV TH0,#0ECH\nSETB TR0",
    modelAnswerHi: "12 MHz पर 1 मशीन साइकिल = 1 µs। 5 ms देरी के लिए आवश्यक काउंट = 5000। 16-बिट टाइमर में इनिशियल वैल्यू = 65536 - 5000 = 60536 = EC78H। अतः TH0 = ECH और TL0 = 78H।",
    keyPoints: ["Fosc = 12 MHz -> 1 machine cycle = 1 µs", "Required count = 5000", "Initial value = 65536 - 5000 = 60536 = EC78H", "TH0 = ECH, TL0 = 78H"]
  },
  {
    id: 'eq6',
    marks: 10,
    unit: 1,
    question: "Draw the internal architecture block diagram of 8051 and explain each functional block in detail.",
    questionHi: "8051 का इंटरनल आर्किटेक्चर ब्लॉक डायग्राम बनाएं और प्रत्येक भाग को विस्तार से समझाएं।",
    modelAnswerEn: "The 8051 architecture comprises the following key blocks:\n1. 8-bit CPU: Consisting of the ALU, Accumulator (ACC, E0H), B Register (F0H), Program Status Word (PSW, D0H), and Program Counter (PC, 16-bit).\n2. Memory: 4 KB on-chip Program ROM (0000H–0FFFH) and 128 bytes Internal RAM (00H–7FH).\n3. RAM Organization: 00H–1FH (4 Register Banks 0–3, 8 registers R0–R7 each); 20H–2FH (128 bit-addressable locations 00H–7FH); 30H–7FH (80 bytes general purpose scratchpad).\n4. Special Function Registers: 128 bytes direct-addressed registers (80H–FFH) controlling timers, serial port, interrupts, and I/O latches.\n5. Four 8-bit I/O Ports: Port 0 (multiplexed AD0–AD7), Port 1 (general I/O), Port 2 (A8–A15), Port 3 (alternate functions including RXD, TXD, INT0, INT1, T0, T1, WR, RD).\n6. Timers/Counters: Two independent 16-bit timer units (Timer 0 & Timer 1).\n7. Full-Duplex UART: Hardware serial channel with programmable baud rate.\n8. Interrupt Control: 5 interrupt vectors with 2 priority levels.\n9. Oscillator Circuit: Driven by external crystal (XTAL1 & XTAL2, typically 11.0592 MHz or 12 MHz).",
    modelAnswerHi: "8051 में 8-बिट CPU (ALU, ACC, B, PSW, PC), 4 KB ROM, 128 बाइट्स आंतरिक RAM, 21 SFRs, चार 8-बिट पोर्ट्स (P0-P3), दो 16-बिट टाइमर/काउंटर, फुल-डुप्लेक्स UART तथा 5 इंटरप्ट सोर्सेज होते हैं।",
    keyPoints: ["8-bit ALU + ACC + B", "128B RAM: Register banks, bit-addressable, scratchpad", "Four 8-bit ports (P0 to P3)", "Two 16-bit timers & UART"]
  },
  {
    id: 'eq7',
    marks: 10,
    unit: 5,
    question: "Explain the interfacing of a 4×4 Matrix Keypad to 8051 with circuit diagram, scanning algorithm, and complete assembly code.",
    questionHi: "8051 के साथ 4x4 मैट्रिक्स कीपैड इंटरफेसिंग को सर्किट, स्कैनिंग एल्गोरिथम और असेंबली कोड के साथ समझाएं।",
    modelAnswerEn: "A 4×4 matrix keypad connects 16 tactile switches across 4 rows (outputs) and 4 columns (inputs with 10kΩ pull-up resistors to +5V). Without pressing any key, all columns read HIGH (Logic 1).\n\nScanning Principle:\n1. All rows are driven LOW (0) and column status is checked. If any column is 0, a key press is detected.\n2. A 20 ms debounce delay is introduced to eliminate mechanical contact bounce.\n3. Rows are grounded one by one (Row 0 = 0, others 1; then Row 1 = 0, etc.).\n4. For the grounded row, columns are read. The zero column reveals the exact intersecting key.\n5. The row and column coordinates are converted into key codes (0–F) using an indexed lookup table in ROM.",
    modelAnswerHi: "4x4 कीपैड में 16 कुंजियाँ 4 रो और 4 कॉलम में व्यवस्थित होती हैं। रो को आउटपुट और कॉलम को पुल-अप के साथ इनपुट बनाया जाता है। रो को बारी-बारी से 0 करके कॉलम को पढ़ने से दबी हुई कुंजी पहचानी जाती है। 20 ms डिबाउंसिंग से मैकेनिकल कंपन दूर होता है।",
    keyPoints: ["4 rows (outputs) + 4 columns (inputs with pull-ups)", "Grounding one row at a time", "20 ms software debouncing routine", "Lookup table conversion to ASCII/Hex"]
  },
  {
    id: 'eq8',
    marks: 5,
    unit: 3,
    question: "NUMERICAL: Calculate the reload value for TH1 in hexadecimal and decimal to produce 9600 baud rate using Timer 1 in Mode 2 with a 11.0592 MHz crystal and SMOD = 0. Show complete derivation.",
    questionHi: "न्यूमेरिकल: 11.0592 MHz क्रिस्टल और SMOD = 0 के साथ Timer 1 Mode 2 में 9600 बॉड रेट उत्पन्न करने के लिए TH1 रिलोड मान की हेक्साडेसिमल और दशमलव में पूरी गणना करें।",
    modelAnswerEn: "Step 1: Given data:\n- Crystal frequency Fosc = 11.0592 MHz = 11,059,200 Hz\n- Target Baud Rate = 9600 bps\n- SMOD = 0 (standard prescaler = 32)\n\nStep 2: Machine cycle frequency = Fosc / 12 = 11,059,200 / 12 = 921,600 Hz.\n\nStep 3: UART prescaler frequency = 921,600 Hz / 32 = 28,800 Hz.\n\nStep 4: Formula for Baud Rate:\nBaud Rate = (2^SMOD / 32) × (Timer 1 Overflow Rate)\nTimer 1 Overflow Rate = Fosc / [12 × (256 - TH1)]\nBaud Rate = Fosc / [384 × (256 - TH1)]\n\nStep 5: Rearranging to solve for (256 - TH1):\n(256 - TH1) = Fosc / (384 × Baud Rate)\n(256 - TH1) = 11,059,200 / (384 × 9600) = 11,059,200 / 3,686,400 = 3.\n\nStep 6: Calculate TH1:\nTH1 = 256 - 3 = 253 (Decimal).\nConverting 253 to Hexadecimal: 253 = 0FDH.\nIn assembly notation: MOV TH1, #-3 or MOV TH1, #0FDH.\nActual Baud = 11,059,200 / (384 × 3) = 9600 bps (0.00% Error).",
    modelAnswerHi: "चरण 1: Fosc = 11.0592 MHz, Baud = 9600, SMOD = 0।\nचरण 2: मशीन साइकिल = 11.0592 MHz / 12 = 921,600 Hz।\nचरण 3: UART क्लॉक = 921,600 / 32 = 28,800 Hz।\nचरण 4: सूत्र: (256 - TH1) = Fosc / (384 × Baud)\n(256 - TH1) = 11,059,200 / (384 × 9600) = 3।\nचरण 5: TH1 = 256 - 3 = 253 (Decimal) = FDH (Hexadecimal)।\nअतः असेंबली निर्देश: MOV TH1, #0FDH।\nवास्तविक बॉड रेट = 9600 bps (त्रुटि = 0%)।",
    keyPoints: [
      "Fosc / 12 = 921,600 Hz",
      "UART prescaler = 28,800 Hz",
      "(256 - TH1) = 11059200 / (384 * 9600) = 3",
      "TH1 = 256 - 3 = 253 = 0FDH",
      "Error = 0.00%"
    ]
  },
  {
    id: 'eq9',
    marks: 5,
    unit: 3,
    question: "NUMERICAL: A student connects a 12.0000 MHz crystal to an 8051 and attempts to configure Timer 1 Mode 2 for 9600 baud with SMOD = 0. Calculate the required reload value, the nearest integer TH1, the actual generated baud rate, and the percentage error. Explain why communication fails.",
    questionHi: "न्यूमेरिकल: यदि 8051 में 12 MHz क्रिस्टल लगाकर 9600 बॉड (SMOD=0) कॉन्फ़िगर किया जाए, तो रिलोड मान, निकटतम पूर्णांक TH1, वास्तविक बॉड रेट तथा प्रतिशत त्रुटि ज्ञात करें। समझाएं कि संचार क्यों विफल होता है।",
    modelAnswerEn: "Step 1: Given:\n- Fosc = 12.0000 MHz = 12,000,000 Hz\n- Desired Baud Rate = 9600 bps\n- SMOD = 0\n\nStep 2: Theoretical Reload Value:\n(256 - TH1) = Fosc / (384 × Baud Rate)\n(256 - TH1) = 12,000,000 / (384 × 9600) = 12,000,000 / 3,686,400 = 3.2552.\n\nStep 3: Nearest Integer Reload Value:\nSince 8-bit registers only accept integers, the timer reload count must be rounded to 3.\nTH1 = 256 - 3 = 253 = 0FDH.\n\nStep 4: Actual Generated Baud Rate:\nActual Baud = 12,000,000 / (384 × 3) = 12,000,000 / 1152 = 10,416.67 bps.\n\nStep 5: Percentage Error Calculation:\n% Error = |(Actual Baud - Desired Baud) / Desired Baud| × 100%\n% Error = |(10,416.67 - 9600) / 9600| × 100% = (816.67 / 9600) × 100% = +8.51%.\n\nExplanation:\nAsynchronous UART communication requires clock synchronization within ±2.5% tolerance across a 10-bit frame. An 8.51% error causes bit sampling to drift past the stop bit boundary, resulting in continuous Framing Errors (FE) and garbled ASCII characters on standard PC terminals.",
    modelAnswerHi: "चरण 1: Fosc = 12 MHz, Baud = 9600।\nचरण 2: सैद्धांतिक काउंट = 12,000,000 / (384 × 9600) = 3.2552।\nचरण 3: निकटतम पूर्णांक = 3, अतः TH1 = 256 - 3 = 253 = FDH।\nचरण 4: वास्तविक बॉड = 12,000,000 / (384 × 3) = 10,416.67 bps।\nचरण 5: प्रतिशत त्रुटि = |10416.67 - 9600| / 9600 × 100% = 8.51%।\nनिष्कर्ष: UART संचार में अधिकतम 2.5% त्रुटि मान्य होती है। 8.51% त्रुटि से बिट सैंपलिंग गलत समय पर होती है और स्क्रीन पर फ्रेमिंग एरर के कारण कचरा करैक्टर आते हैं।",
    keyPoints: [
      "Exact reload count = 3.2552",
      "Rounded integer count = 3 (TH1 = FDH)",
      "Actual baud = 10,416.67 bps",
      "Error = +8.51%",
      "Exceeds 2.5% UART tolerance, causing framing errors"
    ]
  },
  {
    id: 'eq10',
    marks: 5,
    unit: 3,
    question: "NUMERICAL: Show how the SMOD bit in PCON is used to double the baud rate to 19200 with an 11.0592 MHz crystal. Calculate TH1 and write the assembly initialization sequence.",
    questionHi: "न्यूमेरिकल: 11.0592 MHz क्रिस्टल पर 19200 बॉड प्राप्त करने हेतु PCON के SMOD बिट का उपयोग समझाएं। TH1 की गणना करें और असेंबली इनिशियलाइज़ेशन कोड लिखें।",
    modelAnswerEn: "Step 1: Formula with SMOD = 1:\nBaud Rate = [2^1 × Fosc] / [384 × (256 - TH1)] = [2 × 11,059,200] / [384 × (256 - TH1)]\n\nStep 2: Solve for (256 - TH1) for 19,200 Baud:\n(256 - TH1) = [2 × 11,059,200] / [384 × 19,200] = 22,118,400 / 7,372,800 = 3.\n\nStep 3: TH1 Register Value:\nTH1 = 256 - 3 = 253 = 0FDH.\nNotice that TH1 remains 0FDH, but setting SMOD = 1 doubles the baud rate from 9600 to 19200 bps.\n\nStep 4: Assembly Code:\nMOV A, PCON\nSETB ACC.7           ; Set SMOD bit (Bit 7 of PCON)\nMOV PCON, A          ; PCON is not bit-addressable\nMOV TMOD, #20H       ; Timer 1 Mode 2 (8-bit auto-reload)\nMOV TH1, #0FDH       ; Reload for 19200 baud\nMOV SCON, #50H       ; Mode 1, 8-bit UART, REN = 1\nSETB TR1             ; Start Timer 1",
    modelAnswerHi: "चरण 1: SMOD = 1 होने पर बॉड रेट का सूत्र:\n(256 - TH1) = (2 × Fosc) / (384 × Baud)\n(256 - TH1) = (2 × 11,059,200) / (384 × 19,200) = 3।\nचरण 2: TH1 = 256 - 3 = 253 = 0FDH।\nअर्थात TH1 वही 0FDH रहता है, लेकिन SMOD=1 करने से बॉड रेट 9600 से बढ़कर 19200 हो जाता है।\nचरण 3: PCON को सीधे बिट से नहीं बदल सकते, अतः Accumulator के ACC.7 को सेट करके PCON में मूव किया जाता है।",
    keyPoints: [
      "SMOD=1 doubles UART prescaler clock",
      "(256 - TH1) = (2 * 11059200) / (384 * 19200) = 3",
      "TH1 = 0FDH",
      "PCON is not bit-addressable: use MOV A, PCON; SETB ACC.7; MOV PCON, A"
    ]
  },
  {
    id: 'eq11',
    marks: 5,
    unit: 3,
    question: "Compare Synchronous and Asynchronous Serial Communication in 8051 (Ayala Chapter 9). Detail pin assignments, framing, clock sources, and typical applications.",
    questionHi: "8051 में Synchronous और Asynchronous सीरियल संचार की तुलना करें। पिन असाइनमेंट, फ्रेमिंग, क्लॉक सोर्स और अनुप्रयोगों का विवरण दें।",
    modelAnswerEn: "Comparison Table:\n\n1. Clock Transmission:\n- Synchronous (Mode 0): Clock signal is transmitted simultaneously over TXD (Pin 11) at fixed frequency Fosc / 12.\n- Asynchronous (Modes 1, 2, 3): No clock line is shared. Transmitter and receiver have independent local clock generators synchronized by start bits.\n\n2. Data Lines & Duplex Mode:\n- Synchronous: Half-duplex bidirectional data on RXD (Pin 10).\n- Asynchronous: Full-duplex independent lines (TXD = Pin 11 transmit, RXD = Pin 10 receive).\n\n3. Framing & Overhead:\n- Synchronous: 0% framing overhead. Transmits raw 8-bit bytes without start or stop bits.\n- Asynchronous: 20% to 27% overhead. Each frame includes 1 Start bit, 8 (or 9) Data bits, and 1 Stop bit.\n\n4. Baud Rate Generation:\n- Synchronous: Fixed at Fosc / 12 (e.g. 1 MHz at 12 MHz crystal).\n- Asynchronous: Programmable variable baud rate using Timer 1 Mode 2 auto-reload.\n\n5. Typical Applications:\n- Synchronous: Local board-level I/O pin expansion using serial-in parallel-out shift registers (74HC164, CD4094).\n- Asynchronous: Long-distance inter-device communication (PC COM port, GPS modules, Bluetooth, RS-232, RS-485).",
    modelAnswerHi: "तुलना:\n1. क्लॉक: Synchronous में TXD पिन पर साझा क्लॉक (Fosc/12) जाती है; Asynchronous में कोई क्लॉक लाइन नहीं होती, दोनों की अपनी क्लॉक होती है।\n2. डुप्लेक्स: Synchronous हाफ-डुप्लेक्स (RXD पर डेटा); Asynchronous फुल-डुप्लेक्स (TXD और RXD अलग-अलग)।\n3. फ्रेमिंग: Synchronous में कोई Start/Stop बिट नहीं होता; Asynchronous में 1 Start और 1 Stop बिट फ्रेमिंग होती है।\n4. बॉड रेट: Synchronous में फिक्स्ड (Fosc/12); Asynchronous में Timer 1 द्वारा प्रोग्रामेबल बॉड।\n5. उपयोग: Synchronous 74HC164 लैच से पिन बढ़ाने हेतु; Asynchronous PC, GPS, ब्लूटूथ से जुड़ने हेतु।",
    keyPoints: [
      "Synchronous: Shared clock on TXD, data on RXD, no start/stop bits",
      "Asynchronous: Separate TXD/RXD, full duplex, 1 start + 1 stop bit framing",
      "Synchronous baud = Fosc / 12 (fixed)",
      "Asynchronous baud = variable via Timer 1 Mode 2"
    ]
  },
  {
    id: 'eq12',
    marks: 10,
    unit: 3,
    question: "Explain the four operating modes of the 8051 Serial Interface (Ayala Chapter 2 & 9). Tabulate their baud rate equations, framing formats, and explain the multiprocessor communication feature using the SM2 bit.",
    questionHi: "8051 सीरियल इंटरफेस के चारों ऑपरेटिंग मोड्स (Mode 0, 1, 2, 3) को समझाइए। बॉड रेट सूत्र, फ्रेम फॉर्मेट और SM2 बिट द्वारा मल्टीप्रोसेसर संचार की कार्यप्रणाली स्पष्ट करें।",
    modelAnswerEn: "The 8051 serial port is controlled by SM0 and SM1 in SCON (98H):\n\n1. Mode 0 (SM0=0, SM1=0) — Synchronous 8-bit Shift Register:\n- Frame: 8 data bits, no start/stop bits.\n- Baud Rate = Fosc / 12 (Fixed).\n- Pins: TXD = Shift clock output, RXD = Bidirectional serial data.\n\n2. Mode 1 (SM0=0, SM1=1) — Standard 8-bit UART:\n- Frame: 10 bits total (1 Start bit [0], 8 Data bits LSB first, 1 Stop bit [1]).\n- Baud Rate = (2^SMOD / 32) × (Timer 1 Overflow Rate).\n- Variable baud rate driven by Timer 1 in Mode 2.\n\n3. Mode 2 (SM0=1, SM1=0) — 9-bit UART with Fixed Baud Rate:\n- Frame: 11 bits total (1 Start, 8 Data, 1 Programmable 9th bit [TB8/RB8], 1 Stop).\n- Baud Rate = (2^SMOD / 64) × Fosc (Fixed at Fosc/64 or Fosc/32).\n\n4. Mode 3 (SM0=1, SM1=1) — 9-bit UART with Variable Baud Rate:\n- Frame: 11 bits total (1 Start, 8 Data, 1 Programmable 9th bit, 1 Stop).\n- Baud Rate = (2^SMOD / 32) × (Timer 1 Overflow Rate).\n\nMultiprocessor Communication (SM2 Bit in SCON):\nIn distributed systems with one Master and multiple Slaves:\n- Master transmits an Address byte with 9th bit TB8 = 1.\n- All Slaves have SM2 = 1. The 8051 hardware checks the 9th bit: if 9th bit = 1, the Receive Interrupt (RI) flag is set, waking all slave CPUs to read the address.\n- The designated slave whose address matches clears its SM2 = 0 to accept the subsequent data bytes (where 9th bit = 0).\n- Slaves with SM2 = 1 ignore all subsequent data bytes with 9th bit = 0 without interrupting their CPUs, eliminating bus contention and CPU overhead.",
    modelAnswerHi: "8051 सीरियल पोर्ट के 4 मोड्स:\nMode 0: 8-बिट शिफ्ट रजिस्टर, क्लॉक = Fosc/12 (फिक्स्ड), RXD=डेटा, TXD=क्लॉक।\nMode 1: 8-बिट UART, 10-बिट फ्रेम (1 Start, 8 Data, 1 Stop), Timer 1 द्वारा परिवर्तनीय बॉड।\nMode 2: 9-बिट UART, फिक्स्ड बॉड (Fosc/32 या Fosc/64), 11-बिट फ्रेम।\nMode 3: 9-बिट UART, परिवर्तनीय बॉड (Timer 1 द्वारा), 11-बिट फ्रेम।\n\nमल्टीप्रोसेसर संचार (SM2):\nमास्टर जब एड्रेस भेजता है तो 9वीं बिट TB8=1 रखता है। स्लेव्स में SM2=1 होने पर केवल 9वीं बिट 1 होने पर ही RI इंटरप्ट आता है। सही स्लेव अपना SM2=0 कर लेता है ताकि आने वाला डेटा ले सके, जबकि अन्य स्लेव्स SM2=1 रखकर डेटा को बिना समय गंवाए छोड़ देते हैं।",
    keyPoints: [
      "Mode 0: Shift register, Fosc/12",
      "Mode 1: 8-bit UART, variable baud via Timer 1",
      "Mode 2: 9-bit UART, fixed baud Fosc/64 or Fosc/32",
      "Mode 3: 9-bit UART, variable baud via Timer 1",
      "SM2=1 enables address filtering on 9th bit for multiprocessor communication"
    ]
  },
  {
    id: 'eq13',
    marks: 5,
    unit: 3,
    question: "Explain the interfacing of the MAX232 level converter IC with 8051. Explain why direct connection to PC serial port damages the microcontroller.",
    questionHi: "8051 के साथ MAX232 लेवल कनवर्टर IC की इंटरफेसिंग समझाइए। समझाएं कि सीधे PC सीरियल पोर्ट से जोड़ने पर माइक्रोकंट्रोलर क्यों खराब हो सकता है।",
    modelAnswerEn: "Why Direct Connection Damages 8051:\n8051 uses standard TTL logic levels: Logic 0 = 0V, Logic 1 = +5V. Its I/O pins cannot tolerate voltages exceeding +5.5V or negative voltages. RS-232 specifies bipolar inverted voltages: Logic 0 = +3V to +15V, Logic 1 = -3V to -15V. Applying -12V to an 8051 pin will forward-bias internal substrate protection diodes, causing catastrophic latch-up and destruction of the chip.\n\nMAX232 Operation:\nThe MAX232 contains:\n1. Dual Charge Pump: Uses four external 0.1 µF (or 1 µF) capacitors (C1+, C1-, C2+, C2-) to generate +10V and -10V rails internally from the single +5V VCC supply.\n2. Transmitter Driver (T1IN -> T1OUT): Pin 11 connects to 8051 TXD (0-5V TTL); Pin 14 outputs RS-232 levels (±10V) to PC DB9 Pin 2 (RXD).\n3. Receiver Driver (R1IN -> R1OUT): Pin 13 receives RS-232 levels from PC DB9 Pin 3 (TXD); Pin 12 outputs inverted 0-5V TTL to 8051 RXD (Pin 10).",
    modelAnswerHi: "सीधे कनेक्शन से नुकसान:\n8051 TTL लेवल्स (0V और 5V) पर काम करता है जबकि RS-232 में -3V से -15V (लॉजिक 1) और +3V से +15V (लॉजिक 0) होते हैं। -12V सीधे 8051 पर जाने से चिप तुरंत जल जाएगी।\n\nMAX232 का कार्य:\nइसमें 4 कैपेसिटर्स (0.1 µF) लगे होते हैं जो चार्ज-पंप से 5V को +10V और -10V में बदलते हैं। 8051 TXD (पिन 11) से आने वाले TTL सिग्नल को RS-232 में बदलकर PC DB9 को भेजा जाता है, और PC से आने वाले RS-232 सिग्नल को TTL में बदलकर 8051 RXD (पिन 10) को दिया जाता है।",
    keyPoints: [
      "TTL: 0V (0), +5V (1)",
      "RS-232: +3V to +15V (0), -3V to -15V (1)",
      "Direct connection destroys 8051 due to negative voltage",
      "MAX232 uses 4 charge pump capacitors to step up and invert 5V to ±10V"
    ]
  },
  {
    id: 'eq14',
    marks: 5,
    unit: 5,
    question: "Explain the interfacing of ADC0804 to 8051. Describe the timing handshake signals (CS, WR, INTR, RD) and calculate the digital output for an input voltage of 1.95V with Vref = 5.0V.",
    questionHi: "8051 के साथ ADC0804 की इंटरफेसिंग समझाएं। टाइमिंग हैंडशेक सिग्नल्स (CS, WR, INTR, RD) का वर्णन करें तथा Vref = 5.0V पर 1.95V इनपुट के लिए डिजिटल आउटपुट ज्ञात करें।",
    modelAnswerEn: "ADC0804 Handshake Timing:\n1. CS = 0 to select the ADC.\n2. Start of Conversion (SOC): Apply a active-low pulse on WR pin (minimum 100 ns). This resets the internal SAR registers and starts analog sampling.\n3. Conversion in Progress: INTR pin goes HIGH during conversion (takes approx 100 µs with 640 kHz clock).\n4. End of Conversion (EOC): When conversion finishes, INTR goes LOW.\n5. Read Data: When INTR goes LOW, 8051 asserts an active-low pulse on RD pin. This enables the tri-state output buffers, placing the 8-bit digital result on D0–D7.\n\nNumerical Calculation:\n- Resolution = Vref / 2^8 = 5.0V / 256 = 19.53125 mV per step.\n- Analog Input Vin = 1.95V = 1950 mV.\n- Digital Output (Decimal) = Vin / Step Size = 1950 mV / 19.53125 mV = 99.84 ≈ 100.\n- Converting to Hexadecimal: 100 = 64H.\nDigital byte read into Accumulator = 64H (0110 0100B).",
    modelAnswerHi: "ADC0804 हैंडशेक:\n1. CS = 0 चिप सेलेक्ट।\n2. WR पर LOW पल्स देकर कन्वर्जन शुरू होता है।\n3. कन्वर्जन के दौरान INTR HIGH रहता है।\n4. कन्वर्जन समाप्त होने पर INTR LOW हो जाता है।\n5. RD पर LOW पल्स देकर 8051 डेटा D0-D7 से पढ़ लेता है।\n\nगणना:\nस्टेप साइज = 5V / 256 = 19.53 mV।\nडिजिटल काउंट = 1.95V / 19.53 mV = 100।\nहेक्साडेसिमल में 100 = 64H।",
    keyPoints: [
      "Handshake: WR pulse starts conversion -> INTR goes low when done -> RD pulse reads data",
      "Step size = 5V / 256 = 19.53 mV",
      "Digital output for 1.95V = 1.95 / 0.01953 = 100 (64H)"
    ]
  },
  {
    id: 'eq15',
    marks: 5,
    unit: 5,
    question: "Explain the command format, control pins (RS, R/W, E), and initialization sequence for interfacing a 16×2 LCD with 8051.",
    questionHi: "8051 के साथ 16x2 LCD इंटरफेसिंग के लिए कमांड फॉर्मेट, कंट्रोल पिन्स (RS, R/W, E) और इनिशियलाइज़ेशन अनुक्रम समझाइए।",
    modelAnswerEn: "16×2 LCD Control Pins:\n- RS (Register Select, Pin 4): RS = 0 selects Command Register (instruction codes); RS = 1 selects Data Register (ASCII characters to display).\n- R/W (Read/Write, Pin 5): R/W = 0 for writing data/commands to LCD; R/W = 1 for reading data or checking Busy Flag (D7).\n- E (Enable, Pin 6): High-to-Low pulse (min 450 ns width) latches data present on D0–D7 into the LCD controller.\n\nMandatory Initialization Sequence (8-bit Mode):\n1. Send 38H: 2 lines, 5×7 matrix font, 8-bit interface mode.\n2. Send 0EH (or 0CH): Display ON, cursor ON (0CH for display ON, cursor OFF).\n3. Send 01H: Clear entire display screen and reset DDRAM address.\n4. Send 06H: Entry mode set — auto-increment cursor to the right after each character.\n5. Send 80H: Set cursor to beginning of Line 1 (DDRAM address 00H). Line 2 begins at address 0C0H.",
    modelAnswerHi: "16x2 LCD कंट्रोल पिन्स:\n- RS: 0 = कमांड, 1 = डेटा।\n- R/W: 0 = लिखना, 1 = पढ़ना (Busy Flag D7)।\n- E (Enable): High-to-Low पल्स से डेटा लैच होता है।\n\nइनिशियलाइज़ेशन कोड्स:\n1. 38H: 2 पंक्तियाँ, 5x7 मैट्रिक्स, 8-बिट मोड।\n2. 0EH: डिस्प्ले ऑन, कर्सर ऑन।\n3. 01H: स्क्रीन क्लियर करें।\n4. 06H: ऑटो-इन्क्रीमेंट कर्सर।\n5. 80H: पंक्ति 1 की शुरुआत (पंक्ति 2 के लिए C0H)।",
    keyPoints: [
      "RS=0: Command, RS=1: Data",
      "E pin requires high-to-low pulse to latch byte",
      "Essential init codes: 38H (function set), 0EH (display on), 01H (clear), 06H (entry mode)"
    ]
  }
];

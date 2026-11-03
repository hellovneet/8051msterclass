export interface Flashcard {
  id: string;
  category: 'Terminology' | 'Instructions' | 'SFRs' | 'Pins' | 'Timers' | 'Interrupts';
  question: string;
  enAnswer: string;
  hiAnswer: string;
  keyNote?: string;
}

export const flashcardsData: Flashcard[] = [
  {
    id: 'f1',
    category: 'Timers',
    question: "What is the function of the TMOD register?",
    enAnswer: "TMOD (Timer Mode, 89H) selects timer/counter operation (C/T bit), gate control (GATE bit), and timer mode (M1, M0) for Timer 0 and Timer 1.",
    hiAnswer: "TMOD (Timer Mode, 89H) Timer 0 और Timer 1 के लिए Timer/Counter ऑपरेशन (C/T bit), Gate कंट्रोल (GATE bit) तथा Mode (M1, M0) का चयन करता है।",
    keyNote: "TMOD is not bit-addressable. Byte address = 89H."
  },
  {
    id: 'f2',
    category: 'SFRs',
    question: "What is the function of SBUF (99H)?",
    enAnswer: "SBUF is the Serial Data Buffer. Writing to SBUF initiates UART transmission; reading from SBUF accesses the byte received by the UART receiver.",
    hiAnswer: "SBUF (99H) सीरियल डेटा बफ़र है। SBUF में लिखने पर ट्रांसमिशन शुरू होता है और इसे पढ़ने पर प्राप्त हुआ बाइट मिलता है।",
    keyNote: "Physically two separate registers sharing the same 99H SFR address."
  },
  {
    id: 'f3',
    category: 'Interrupts',
    question: "What does the RETI instruction do?",
    enAnswer: "RETI (Return from Interrupt) pops the return address from the stack and clears the internal interrupt-in-service flip-flop, allowing lower/equal priority interrupts to be serviced again.",
    hiAnswer: "RETI (Return from Interrupt) स्टैक से रिटर्न एड्रेस निकालता है और इंटरप्ट-इन-सर्विस फ़्लिप-फ़्लॉप को रीसेट करता है ताकि नए इंटरप्ट प्रोसेस हो सकें।",
    keyNote: "Never use RET in an ISR; RET does not clear the interrupt priority flip-flop!"
  },
  {
    id: 'f4',
    category: 'Instructions',
    question: "What is Immediate Addressing in 8051?",
    enAnswer: "Immediate addressing provides the numeric constant directly inside the instruction using the '#' prefix, e.g., MOV A,#25H.",
    hiAnswer: "Immediate Addressing में डेटा कॉन्स्टेंट निर्देश के अंदर ही '#' चिह्न के साथ दिया जाता है, जैसे MOV A,#25H।",
    keyNote: "MOV A,25H reads RAM location 25H; MOV A,#25H loads constant 25H."
  },
  {
    id: 'f5',
    category: 'Pins',
    question: "How many I/O lines does the classic 8051 provide?",
    enAnswer: "32 programmable I/O lines arranged into four 8-bit bidirectional ports: Port 0, Port 1, Port 2, and Port 3.",
    hiAnswer: "क्लासिक 8051 में कुल 32 प्रोग्रामेबल I/O लाइन्स होती हैं जो चार 8-बिट पोर्ट्स (P0, P1, P2, P3) में विभाजित हैं।",
    keyNote: "Port 0 is open-drain and requires external 10kΩ pull-up resistors for general I/O."
  },
  {
    id: 'f6',
    category: 'Pins',
    question: "What is the function of the ALE pin (Pin 30)?",
    enAnswer: "ALE (Address Latch Enable) outputs a pulse to demultiplex Port 0, signaling an external latch (like 74LS373) to capture lower address bits A0–A7.",
    hiAnswer: "ALE (Address Latch Enable) Port 0 को डीमल्टीप्लेक्स करने के लिए पल्स देता है, जिससे 74LS373 लैच A0–A7 एड्रेस बिट्स को होल्ड कर लेता है।",
    keyNote: "ALE pulses at 1/6th of oscillator frequency during normal execution."
  },
  {
    id: 'f7',
    category: 'Interrupts',
    question: "What are the 5 vector addresses for standard 8051 interrupts?",
    enAnswer: "External Interrupt 0: 0003H; Timer 0: 000BH; External Interrupt 1: 0013H; Timer 1: 001BH; Serial Port (TI/RI): 0023H.",
    hiAnswer: "External 0: 0003H; Timer 0: 000BH; External 1: 0013H; Timer 1: 001BH; Serial Port: 0023H।",
    keyNote: "Vector addresses are spaced 8 bytes apart in code ROM."
  },
  {
    id: 'f8',
    category: 'Terminology',
    question: "How long is a machine cycle in a classic 8051?",
    enAnswer: "One machine cycle consists of 12 oscillator clock periods (6 states: S1 to S6, each having 2 clock pulses P1 and P2). At 12 MHz, 1 machine cycle = 1 µs.",
    hiAnswer: "क्लासिक 8051 में एक मशीन साइकिल 12 ऑसिलेटर क्लॉक पीरियड्स (6 स्टेट्स) के बराबर होती है। 12 MHz पर 1 मशीन साइकिल = 1 µs।",
    keyNote: "Machine cycle = 12 / Oscillator Frequency."
  },
  {
    id: 'f9',
    category: 'Instructions',
    question: "What is the difference between MOV, MOVC, and MOVX?",
    enAnswer: "MOV operates on internal RAM and SFRs; MOVC reads constants from Program Code Memory (ROM); MOVX reads/writes External Data Memory (RAM).",
    hiAnswer: "MOV आंतरिक RAM और SFRs के लिए है; MOVC कोड मेमोरी (ROM) से डेटा पढ़ने के लिए है; MOVX बाहरी डेटा मेमोरी (RAM) को एक्सेस करता है।",
    keyNote: "MOVC uses DPTR or PC: MOVC A,@A+DPTR. MOVX uses DPTR or Ri: MOVX @DPTR,A."
  },
  {
    id: 'f10',
    category: 'SFRs',
    question: "What is the default value of the Stack Pointer (SP) upon hardware reset?",
    enAnswer: "The Stack Pointer is initialized to 07H upon reset. The first PUSH operation stores data at internal RAM address 08H (Register Bank 1).",
    hiAnswer: "हार्डवेयर रीसेट पर स्टैक पॉइंटर 07H पर सेट होता है। पहला PUSH ऑपरेशन डेटा को RAM लोकेशन 08H (बैंक 1) पर रखता है।",
    keyNote: "Typically re-initialized in user code to 30H or higher to avoid overwriting Register Banks."
  },
  {
    id: 'f11',
    category: 'Timers',
    question: "Why is an 11.0592 MHz crystal used for 8051 serial communication?",
    enAnswer: "11.0592 MHz divided by 12 and then by 32 produces exactly 28,800 Hz. All standard PC baud rates (9600, 4800, 2400, 1200) divide evenly into 28,800, yielding exact integer timer reloads with 0.00% frequency error.",
    hiAnswer: "11.0592 MHz को 12 और फिर 32 से भाग देने पर 28,800 Hz मिलता है। यह संख्या 9600, 4800, 2400 से पूरी कट जाती है, जिससे 0.00% त्रुटि के साथ सटीक बॉड रेट मिलता है।",
    keyNote: "TH1 = 256 - [11059200 / (384 * Baud)]. For 9600 baud, TH1 = 0FDH."
  },
  {
    id: 'f12',
    category: 'SFRs',
    question: "What is the function of the SMOD bit in the PCON register (87H)?",
    enAnswer: "SMOD (Bit 7 of PCON) is the Baud Rate Doubler bit. Setting SMOD = 1 cuts the UART division prescaler from 32 to 16, doubling the serial baud rate without changing Timer 1 reload value.",
    hiAnswer: "PCON का बिट 7 (SMOD) बॉड रेट को दोगुना करता है। SMOD=1 करने से UART प्रेस्केलर 32 के बजाय 16 हो जाता है, जिससे बॉड रेट दोगुना हो जाता है।",
    keyNote: "PCON is not bit-addressable. Set SMOD via: MOV A,PCON; SETB ACC.7; MOV PCON,A."
  },
  {
    id: 'f13',
    category: 'Terminology',
    question: "How does Synchronous Serial Mode 0 differ from Asynchronous UART Mode 1?",
    enAnswer: "Mode 0 is a Synchronous Shift Register: TXD outputs a fixed clock (Fosc/12) and RXD carries 8-bit data with NO start/stop bits (used for port expansion). Mode 1 is an Asynchronous UART with 10-bit framing (1 start, 8 data, 1 stop) and variable baud rate from Timer 1.",
    hiAnswer: "Mode 0 सिंक्रोनस शिफ्ट रजिस्टर है: TXD पर क्लॉक (Fosc/12) और RXD पर डेटा जाता है (बिना Start/Stop बिट)। Mode 1 एसिंक्रोनस UART है जिसमें 10-बिट फ्रेमिंग और Timer 1 द्वारा बॉड रेट तय होता है।",
    keyNote: "Mode 0 baud is fixed at Fosc / 12 (1 MHz @ 12 MHz crystal)."
  },
  {
    id: 'f14',
    category: 'SFRs',
    question: "What is the role of SM2 bit in Multiprocessor Serial Communication?",
    enAnswer: "In Mode 2 and 3, setting SM2 = 1 instructs the slave 8051 to ignore all received bytes unless the 9th bit (RB8) is 1 (address byte). Once addressed, the slave clears SM2 = 0 to receive the following data bytes.",
    hiAnswer: "Mode 2 और 3 में SM2=1 होने पर स्लेव 8051 केवल तभी इंटरप्ट (RI) उत्पन्न करता है जब 9वीं बिट 1 (एड्रेस) हो। एड्रेस मैच होने पर स्लेव SM2=0 करके डेटा स्वीकार करता है।",
    keyNote: "Master sends address with TB8=1, and data with TB8=0."
  }
];

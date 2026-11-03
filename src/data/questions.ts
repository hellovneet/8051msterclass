export interface QuizQuestion {
  id: string;
  unit: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    unit: 1,
    question: "Which of the following internal blocks in the classic 8051 is 8-bit?",
    options: ["ALU (Arithmetic Logic Unit)", "Program Counter (PC)", "Data Pointer (DPTR)", "External Address Bus"],
    correctIndex: 0,
    explanationEn: "The 8051 has an 8-bit ALU, Accumulator, and Data Bus. The Program Counter and DPTR are 16-bit registers capable of addressing 64 KB of memory.",
    explanationHi: "8051 में ALU, Accumulator और Data Bus 8-बिट के होते हैं। Program Counter और DPTR 16-बिट के होते हैं जिससे वे 64 KB एड्रेस कर सकते हैं।"
  },
  {
    id: 'q2',
    unit: 2,
    question: "Which instruction loads an immediate constant into the accumulator?",
    options: ["MOV A,#25H", "MOV A,25H", "MOV A,@R0", "MOVC A,@A+DPTR"],
    correctIndex: 0,
    explanationEn: "The '#' symbol explicitly denotes immediate addressing. Without '#', '25H' is interpreted as a direct internal RAM address.",
    explanationHi: "'#' सिंबल Immediate Addressing दर्शाता है। '#' न होने पर '25H' को डायरेक्ट RAM एड्रेस समझा जाता है।"
  },
  {
    id: 'q3',
    unit: 3,
    question: "Which Special Function Register is used to select Timer 0 and Timer 1 operating modes?",
    options: ["TMOD", "TCON", "SCON", "PCON"],
    correctIndex: 0,
    explanationEn: "TMOD (89H) selects the operating mode (Modes 0-3), Timer/Counter mode, and GATE control for Timer 0 and 1. TCON controls starting/stopping and overflow flags.",
    explanationHi: "TMOD (89H) टाइमर के मोड और टाइमर/काउंटर ऑपरेशन का चयन करता है। TCON टाइमर को स्टार्ट/स्टॉप करने और ओवरफ़्लो फ़्लैग्स के लिए है।"
  },
  {
    id: 'q4',
    unit: 3,
    question: "Which bit flag in TCON indicates that Timer 0 has rolled over from FFFFH to 0000H?",
    options: ["TF0", "TR0", "TF1", "TI"],
    correctIndex: 0,
    explanationEn: "TF0 (Timer 0 Flag) is set to 1 when Timer 0 overflows. TR0 is the run bit that starts/stops Timer 0.",
    explanationHi: "TF0 (Timer 0 Flag) तब 1 हो जाता है जब Timer 0 ओवरफ़्लो करता है। TR0 टाइमर को चालू/बंद करने वाला बिट है।"
  },
  {
    id: 'q5',
    unit: 4,
    question: "Which instruction must be used as the last instruction in an 8051 Interrupt Service Routine (ISR)?",
    options: ["RETI", "RET", "SJMP HERE", "NOP"],
    correctIndex: 0,
    explanationEn: "RETI pops the return address AND resets the internal interrupt status logic, enabling pending interrupts. Standard RET does not clear the interrupt priority flip-flop.",
    explanationHi: "RETI स्टैक से रिटर्न एड्रेस निकालता है और इंटरप्ट स्टेटस को रीसेट करता है। सामान्य RET इंटरप्ट लॉजिक को रीसेट नहीं करता।"
  },
  {
    id: 'q6',
    unit: 3,
    question: "Which Port 3 pin serves the alternate hardware function of Serial Data Reception (RXD)?",
    options: ["P3.0", "P3.1", "P3.2", "P3.3"],
    correctIndex: 0,
    explanationEn: "Pin 10 (P3.0) is RXD (receive) and Pin 11 (P3.1) is TXD (transmit). P3.2 and P3.3 are external interrupt pins INT0 and INT1.",
    explanationHi: "P3.0 (पिन 10) RXD रिसीव पिन है और P3.1 (पिन 11) TXD ट्रांसमिट पिन है।"
  },
  {
    id: 'q7',
    unit: 2,
    question: "Which instruction accesses lookup table data stored in Program Code Memory (ROM)?",
    options: ["MOVC A,@A+DPTR", "MOVX A,@DPTR", "MOV A,@R0", "XCH A,@R0"],
    correctIndex: 0,
    explanationEn: "MOVC ('Move Code') uses indexed addressing with DPTR or PC to read byte constants from Program ROM.",
    explanationHi: "MOVC कोड मेमोरी (ROM) से लुकअप टेबल का डेटा पढ़ने के लिए इंडेक्स एड्रेसिंग का उपयोग करता है।"
  },
  {
    id: 'q8',
    unit: 4,
    question: "What is the primary role of the ORG assembler directive?",
    options: ["Sets the location counter for subsequent instructions", "Turns on Timer 0", "Enables global interrupts", "Configures the stack pointer"],
    correctIndex: 0,
    explanationEn: "ORG (Origin) tells the assembler at what memory address the subsequent machine code or data definition should be placed.",
    explanationHi: "ORG (Origin) असेंबलर को बताता है कि आने वाले कोड या डेटा को किस मेमोरी एड्रेस पर स्टोर करना है।"
  },
  {
    id: 'q9',
    unit: 5,
    question: "In a 4×4 matrix keypad interface, how many microcontroller I/O pins are required?",
    options: ["8 pins (4 rows + 4 columns)", "16 pins (1 pin per switch)", "4 pins", "2 pins"],
    correctIndex: 0,
    explanationEn: "Matrix scanning uses multiplexing: 4 pins drive rows, and 4 pins sense columns, allowing 16 switches to be read using just 8 port lines.",
    explanationHi: "4x4 मैट्रिक्स कीपैड में 4 रो और 4 कॉलम होते हैं, जिससे केवल 8 पिन्स की मदद से 16 कुंजियाँ पढ़ी जा सकती हैं।"
  },
  {
    id: 'q10',
    unit: 5,
    question: "For a Common-Cathode 7-segment display, what logic level illuminates a segment?",
    options: ["Logic 1 (HIGH, +5V)", "Logic 0 (LOW, GND)", "High-Impedance", "AC Frequency only"],
    correctIndex: 0,
    explanationEn: "In common-cathode displays, all cathode terminals are tied to Ground (0V). Applying Logic 1 (+5V) forward biases the LED segment and turns it ON.",
    explanationHi: "Common-Cathode डिस्प्ले में सभी कैथोड ग्राउंड (GND) से जुड़े होते हैं। लॉजिक 1 (+5V) देने पर संबंधित सेगमेंट जलता है।"
  },
  {
    id: 'q11',
    unit: 3,
    question: "What reload value must be loaded into TH1 to achieve 9600 baud rate at 11.0592 MHz (SMOD=0)?",
    options: ["0FDH (-3)", "0FAH (-6)", "0F4H (-12)", "0E8H (-24)"],
    correctIndex: 0,
    explanationEn: "(256 - TH1) = 11,059,200 / (384 × 9600) = 3. Therefore TH1 = 256 - 3 = 253 = 0FDH.",
    explanationHi: "(256 - TH1) = 11,059,200 / (384 × 9600) = 3। अतः TH1 = 256 - 3 = 253 = 0FDH।"
  },
  {
    id: 'q12',
    unit: 3,
    question: "What happens when SMOD bit (PCON.7) is set to 1 in serial Mode 1?",
    options: ["Baud rate is doubled", "Baud rate is halved", "Serial port is disabled", "Parity checking is enabled"],
    correctIndex: 0,
    explanationEn: "SMOD=1 reduces the internal UART prescaler division from 32 to 16, thereby doubling the baud rate generated by Timer 1.",
    explanationHi: "SMOD=1 करने से UART प्रेस्केलर 32 के बजाय 16 से भाग देता है, जिससे बॉड रेट ठीक दोगुना हो जाता है।"
  },
  {
    id: 'q13',
    unit: 3,
    question: "In 8051 Serial Mode 0 (Shift Register), what is the fixed baud rate?",
    options: ["Fosc / 12", "Fosc / 32", "Fosc / 64", "Determined by Timer 1"],
    correctIndex: 0,
    explanationEn: "Mode 0 operates as a synchronous shift register clocked directly by the CPU machine cycle clock: Fosc / 12.",
    explanationHi: "Mode 0 एक सिंक्रोनस शिफ्ट रजिस्टर है जिसकी क्लॉक दर सीधे मशीन साइकिल यानी Fosc / 12 होती है।"
  },
  {
    id: 'q14',
    unit: 3,
    question: "Which IC is commonly used to convert 8051 TTL (0V/5V) logic to RS-232 (±10V) levels?",
    options: ["MAX232", "74LS373", "ULN2003", "ADC0804"],
    correctIndex: 0,
    explanationEn: "The MAX232 contains on-chip charge-pump capacitors that step up +5V to ±10V to meet bipolar RS-232 standards.",
    explanationHi: "MAX232 आईसी चार्ज-पंप की मदद से +5V से ±10V उत्पन्न करके TTL और RS-232 के बीच वोल्टेज लेवल कनवर्ट करती है।"
  }
];

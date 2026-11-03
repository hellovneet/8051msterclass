export interface AssemblyProgram {
  id: string;
  title: string;
  category: 'Arithmetic' | 'Data Transfer' | 'Looping' | 'Timers' | 'Hardware Interfacing';
  descriptionEn: string;
  descriptionHi: string;
  code: string;
  explanation: string;
  initialState: {
    A: number;
    B: number;
    R0: number;
    R1: number;
    R2: number;
    DPTR: number;
    RAM: Record<number, number>;
  };
}

export const assemblyPrograms: AssemblyProgram[] = [
  {
    id: 'p1',
    title: "Add two 8-bit numbers and store result in RAM 30H",
    category: 'Arithmetic',
    descriptionEn: "Loads 25H into Accumulator, adds 13H, and saves the sum (38H) at internal RAM location 30H.",
    descriptionHi: "Accumulator में 25H लोड करता है, 13H जोड़ता है, और परिणाम (38H) को RAM एड्रेस 30H पर स्टोर करता है।",
    code: `ORG 0000H
MOV A,#25H    ; Load first byte 25H into Accumulator
ADD A,#13H    ; Add second byte 13H to Accumulator
MOV 30H,A     ; Store sum (38H) into internal RAM address 30H
HERE: SJMP HERE ; Halt execution in infinite loop
END`,
    explanation: "25H (37 decimal) + 13H (19 decimal) = 38H (56 decimal). Carry flag is 0, Auxiliary Carry is 0.",
    initialState: {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      DPTR: 0,
      RAM: {}
    }
  },
  {
    id: 'p2',
    title: "Copy a block of data using Register Indirect Addressing",
    category: 'Data Transfer',
    descriptionEn: "Copies a data byte from internal RAM location 40H to 41H using pointer register R0.",
    descriptionHi: "पॉइंटर रजिस्टर R0 की मदद से RAM लोकेशन 40H के डेटा को 41H पर कॉपी करता है।",
    code: `ORG 0000H
MOV R0,#40H   ; Set pointer R0 to source address 40H
MOV A,@R0     ; Read contents of RAM[40H] into Accumulator
INC R0        ; Advance pointer R0 to destination address 41H
MOV @R0,A     ; Write Accumulator content into RAM[41H]
HERE: SJMP HERE ; Halt
END`,
    explanation: "Register indirect addressing uses @R0 or @R1 to dynamically read/write internal RAM without hardcoding destination addresses.",
    initialState: {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      DPTR: 0,
      RAM: { 0x40: 0x7F }
    }
  },
  {
    id: 'p3',
    title: "Count down from 05H to 00H using DJNZ loop",
    category: 'Looping',
    descriptionEn: "Loads 05H into register R2 and loops 5 times, decrementing R2 each time until zero is reached.",
    descriptionHi: "R2 में 05H लोड करता है और DJNZ निर्देश के ज़रिए 5 बार लूप चलाकर 0 तक घटता है।",
    code: `ORG 0000H
MOV R2,#05H   ; Initialize loop counter with 5
LOOP: 
DEC A         ; Decrement Accumulator as dummy work
DJNZ R2,LOOP  ; Decrement R2, branch to LOOP if R2 != 0
HERE: SJMP HERE ; Exit loop
END`,
    explanation: "DJNZ (Decrement and Jump if Not Zero) is a 2-cycle instruction ideal for delay routines and repetition counters.",
    initialState: {
      A: 10,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      DPTR: 0,
      RAM: {}
    }
  },
  {
    id: 'p4',
    title: "Generate a 1 kHz square wave using Timer 0 (Mode 1)",
    category: 'Timers',
    descriptionEn: "Generates a 1 kHz square wave on pin P1.0 using Timer 0 in 16-bit mode at 12 MHz oscillator frequency.",
    descriptionHi: "12 MHz क्रिस्टल पर Timer 0 Mode 1 की मदद से P1.0 पिन पर 1 kHz स्क्वेयर वेव उत्पन्न करता है।",
    code: `ORG 0000H
MOV TMOD,#01H ; Timer 0 in 16-bit Mode 1
AGAIN:
MOV TL0,#0FEH ; Load low byte of initial count (0FEH)
MOV TH0,#0FFH ; Load high byte of initial count (0FFH)
CPL P1.0      ; Toggle Port 1.0 output pin
SETB TR0      ; Start Timer 0
WAIT:
JNB TF0,WAIT  ; Wait until Timer 0 overflows (TF0 = 1)
CLR TR0       ; Stop Timer 0
CLR TF0       ; Clear overflow flag
SJMP AGAIN    ; Repeat continuously
END`,
    explanation: "For 1 kHz square wave, period T = 1 ms, half-period = 500 µs. At 12 MHz, 1 machine cycle = 1 µs, so 500 ticks are needed. Initial count = 65536 - 500 = 65036 = FE0CH.",
    initialState: {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      DPTR: 0,
      RAM: {}
    }
  },
  {
    id: 'p5',
    title: "Seven-Segment Display Hex Counter via Lookup Table",
    category: 'Hardware Interfacing',
    descriptionEn: "Outputs common-cathode 7-segment hex character codes (0-F) onto Port 2 using MOVC lookup table.",
    descriptionHi: "MOVC और लुकअप टेबल की सहायता से Port 2 पर 0-F अंकों का 7-सेगमेंट पैटर्न भेजता है।",
    code: `ORG 0000H
MOV DPTR,#TABLE ; Point DPTR to base of lookup table
MOV A,#00H      ; Select digit index 0 (displays '0')
MOVC A,@A+DPTR  ; Fetch 7-segment code: 3FH
MOV P2,A        ; Output to display connected on Port 2
HERE: SJMP HERE ; Halt

ORG 0100H
TABLE:
DB 3FH, 06H, 5BH, 4FH, 66H, 6DH, 7DH, 07H
DB 7FH, 6FH, 77H, 7CH, 39H, 5EH, 79H, 71H
END`,
    explanation: "For common cathode, 3FH turns on segments a, b, c, d, e, f for '0'. MOVC indexed addressing reads the constant table from Program ROM.",
    initialState: {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      DPTR: 0,
      RAM: {}
    }
  }
];

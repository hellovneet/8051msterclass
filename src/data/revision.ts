export interface RevisionCard {
  title: string;
  items: string[];
}

export const revisionData: RevisionCard[] = [
  {
    title: "8051 Core Architecture Facts",
    items: [
      "8-bit CISC microcontroller architecture (Intel MCS-51)",
      "4 KB on-chip program ROM in classic 8051 (expandable up to 64 KB)",
      "128 bytes on-chip data RAM (00H–7FH) + 128 bytes SFR area (80H–FFH)",
      "32 programmable bidirectional I/O lines across Ports 0, 1, 2, and 3",
      "Two 16-bit timers/counters (Timer 0 and Timer 1)",
      "One full-duplex serial UART port with hardware baud generation",
      "5 interrupt sources with 2 priority levels",
      "On-chip oscillator supporting standard 11.0592 MHz / 12 MHz crystals"
    ]
  },
  {
    title: "Crucial Special Function Registers",
    items: [
      "TMOD (89H) – Timer mode register (GATE, C/T, M1, M0 for T1 & T0)",
      "TCON (88H) – Timer control register (TF1, TR1, TF0, TR0, IE1, IT1, IE0, IT0)",
      "SCON (98H) – Serial port control register (SM0, SM1, SM2, REN, TB8, RB8, TI, RI)",
      "SBUF (99H) – Serial data buffer for transmission and reception",
      "IE (A8H) – Interrupt enable register (EA, -, ET2, ES, ET1, EX1, ET0, EX0)",
      "IP (B8H) – Interrupt priority register (sets high/low priority)",
      "PSW (D0H) – Program Status Word (CY, AC, F0, RS1, RS0, OV, -, P)",
      "PCON (87H) – Power control register (contains SMOD baud rate doubler)"
    ]
  },
  {
    title: "University Exam Answer Framework",
    items: [
      "2-Mark Questions: Clear definition + 1 architectural equation / pin number",
      "5-Mark Questions: Definition, labeled block diagram or bit-field register map, step-by-step working principle, and a clean assembly code snippet",
      "10-Mark Questions: Introduction, full 40-pin or memory map diagram, internal working with registers and buses, timing/machine-cycle breakdown, and practical interfacing application",
      "Assembly Questions: State assumptions, define ORG addresses, add inline comments for every instruction, and show register contents before and after"
    ]
  },
  {
    title: "Key Architectural Distinctions",
    items: [
      "MOV vs MOVC vs MOVX: MOV accesses internal RAM/SFR; MOVC accesses ROM constants; MOVX accesses external RAM",
      "RET vs RETI: RET returns from subroutine; RETI returns from ISR AND resets interrupt priority hardware",
      "AJMP/ACALL vs LJMP/LCALL vs SJMP: SJMP is 2-byte relative (-128 to +127); AJMP is 2-byte 2KB page; LJMP is 3-byte full 64KB",
      "Timer vs Counter: Timer counts internal machine cycles (Fosc/12); Counter counts external pulses on T0 (P3.4) or T1 (P3.5)",
      "Common Anode vs Cathode: Common cathode uses Logic 1 to light segment; Common anode uses Logic 0"
    ]
  }
];

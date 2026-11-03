// Lightweight step-by-step 8051 Assembly Simulator Engine

export interface CPUState {
  A: number;
  B: number;
  R: number[]; // R0 to R7 for current bank
  PC: number;
  SP: number;
  DPTR: number;
  PSW: {
    CY: boolean;
    AC: boolean;
    F0: boolean;
    RS1: boolean;
    RS0: boolean;
    OV: boolean;
    P: boolean;
  };
  RAM: Uint8Array; // 128 bytes internal RAM (00H to 7FH)
  SFR: Record<number, number>; // 80H to FFH
  P0: number;
  P1: number;
  P2: number;
  P3: number;
  TMOD: number;
  TCON: number;
  TH0: number;
  TL0: number;
  TH1: number;
  TL1: number;
  SCON: number;
  SBUF: number;
  cycles: number;
  serialOutput: string;
}

export function createInitialState(): CPUState {
  const ram = new Uint8Array(128);
  const sfr: Record<number, number> = {};

  return {
    A: 0,
    B: 0,
    R: [0, 0, 0, 0, 0, 0, 0, 0],
    PC: 0x0000,
    SP: 0x07,
    DPTR: 0x0000,
    PSW: {
      CY: false,
      AC: false,
      F0: false,
      RS1: false,
      RS0: false,
      OV: false,
      P: false,
    },
    RAM: ram,
    SFR: sfr,
    P0: 0xff,
    P1: 0xff,
    P2: 0xff,
    P3: 0xff,
    TMOD: 0x00,
    TCON: 0x00,
    TH0: 0x00,
    TL0: 0x00,
    TH1: 0x00,
    TL1: 0x00,
    SCON: 0x00,
    SBUF: 0x00,
    cycles: 0,
    serialOutput: '',
  };
}

export interface ParsedInstruction {
  lineNum: number;
  label?: string;
  mnemonic: string;
  operands: string[];
  raw: string;
}

export function parseAssembly(code: string): {
  instructions: ParsedInstruction[];
  labels: Record<string, number>; // label -> instruction index
  errors: string[];
} {
  const lines = code.split('\n');
  const instructions: ParsedInstruction[] = [];
  const labels: Record<string, number> = {};
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    // Remove comments
    const commentIdx = line.indexOf(';');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }
    if (!line) continue;

    let label: string | undefined;
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      label = line.substring(0, colonIdx).trim().toUpperCase();
      line = line.substring(colonIdx + 1).trim();
      labels[label] = instructions.length;
    }
    if (!line) continue;

    const parts = line.split(/\s+/);
    const mnemonic = parts[0].toUpperCase();
    const rest = line.substring(parts[0].length).trim();
    const operands = rest
      ? rest.split(',').map((op) => op.trim().toUpperCase())
      : [];

    instructions.push({
      lineNum: i,
      label,
      mnemonic,
      operands,
      raw: lines[i],
    });
  }

  return { instructions, labels, errors };
}

function parseNumber(str: string): number {
  str = str.trim();
  if (str.startsWith('#')) str = str.substring(1);
  if (str.endsWith('H') || str.endsWith('h')) {
    return parseInt(str.slice(0, -1), 16) || 0;
  }
  if (str.endsWith('B') || str.endsWith('b')) {
    return parseInt(str.slice(0, -1), 2) || 0;
  }
  return parseInt(str, 10) || 0;
}

function calculateParity(a: number): boolean {
  let count = 0;
  let val = a & 0xff;
  while (val > 0) {
    if (val & 1) count++;
    val >>= 1;
  }
  return count % 2 !== 0; // P = 1 if odd number of 1s in Accumulator
}

export function executeStep(
  state: CPUState,
  instIdx: number,
  instructions: ParsedInstruction[],
  labels: Record<string, number>
): { nextInstIdx: number; log: string } {
  if (instIdx >= instructions.length) {
    return { nextInstIdx: instIdx, log: 'Program finished.' };
  }

  const inst = instructions[instIdx];
  const { mnemonic, operands } = inst;
  let nextIdx = instIdx + 1;
  let log = `${inst.mnemonic} ${operands.join(', ')}`;

  // Handle directives like ORG, END
  if (mnemonic === 'ORG' || mnemonic === 'END' || mnemonic === 'DB' || mnemonic === 'EQU') {
    return { nextInstIdx: nextIdx, log: `Directive: ${mnemonic}` };
  }

  switch (mnemonic) {
    case 'MOV': {
      const dest = operands[0];
      const src = operands[1];
      let val = 0;

      // Determine source value
      if (src.startsWith('#')) {
        val = parseNumber(src);
      } else if (src === 'A') {
        val = state.A;
      } else if (src === 'B') {
        val = state.B;
      } else if (src.startsWith('R') && src.length === 2) {
        const rNum = parseInt(src[1], 10);
        val = state.R[rNum];
      } else if (src === '@R0') {
        const addr = state.R[0] & 0x7f;
        val = state.RAM[addr];
      } else if (src === '@R1') {
        const addr = state.R[1] & 0x7f;
        val = state.RAM[addr];
      } else if (src === 'P0') {
        val = state.P0;
      } else if (src === 'P1') {
        val = state.P1;
      } else if (src === 'P2') {
        val = state.P2;
      } else if (src === 'P3') {
        val = state.P3;
      } else {
        const addr = parseNumber(src);
        val = addr < 128 ? state.RAM[addr] : (state.SFR[addr] || 0);
      }

      // Assign to destination
      if (dest === 'A') {
        state.A = val & 0xff;
        state.PSW.P = calculateParity(state.A);
      } else if (dest === 'B') {
        state.B = val & 0xff;
      } else if (dest === 'DPTR') {
        state.DPTR = parseNumber(src);
      } else if (dest.startsWith('R') && dest.length === 2) {
        const rNum = parseInt(dest[1], 10);
        state.R[rNum] = val & 0xff;
      } else if (dest === '@R0') {
        const addr = state.R[0] & 0x7f;
        state.RAM[addr] = val & 0xff;
      } else if (dest === '@R1') {
        const addr = state.R[1] & 0x7f;
        state.RAM[addr] = val & 0xff;
      } else if (dest === 'P0') {
        state.P0 = val & 0xff;
      } else if (dest === 'P1') {
        state.P1 = val & 0xff;
      } else if (dest === 'P2') {
        state.P2 = val & 0xff;
      } else if (dest === 'P3') {
        state.P3 = val & 0xff;
      } else if (dest === 'TMOD') {
        state.TMOD = val & 0xff;
      } else if (dest === 'TCON') {
        state.TCON = val & 0xff;
      } else if (dest === 'TH0') {
        state.TH0 = val & 0xff;
      } else if (dest === 'TL0') {
        state.TL0 = val & 0xff;
      } else if (dest === 'TH1') {
        state.TH1 = val & 0xff;
      } else if (dest === 'TL1') {
        state.TL1 = val & 0xff;
      } else if (dest === 'SCON') {
        state.SCON = val & 0xff;
      } else if (dest === 'SBUF') {
        state.SBUF = val & 0xff;
        state.serialOutput += String.fromCharCode(val & 0xff);
      } else {
        const addr = parseNumber(dest);
        if (addr < 128) {
          state.RAM[addr] = val & 0xff;
        } else {
          state.SFR[addr] = val & 0xff;
        }
      }
      state.cycles += 1;
      break;
    }

    case 'ADD':
    case 'ADDC': {
      const src = operands[1];
      let val = 0;
      if (src.startsWith('#')) {
        val = parseNumber(src);
      } else if (src.startsWith('R') && src.length === 2) {
        val = state.R[parseInt(src[1], 10)];
      } else if (src === '@R0') {
        val = state.RAM[state.R[0] & 0x7f];
      } else if (src === '@R1') {
        val = state.RAM[state.R[1] & 0x7f];
      } else {
        const addr = parseNumber(src);
        val = state.RAM[addr & 0x7f];
      }

      const carryIn = mnemonic === 'ADDC' && state.PSW.CY ? 1 : 0;
      const sum = state.A + val + carryIn;

      // Auxiliary carry (lower nibble carry)
      const lowSum = (state.A & 0x0f) + (val & 0x0f) + carryIn;
      state.PSW.AC = lowSum > 0x0f;

      state.PSW.CY = sum > 0xff;
      state.PSW.OV =
        ((state.A ^ sum) & (val ^ sum) & 0x80) !== 0;

      state.A = sum & 0xff;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 1;
      break;
    }

    case 'SUBB': {
      const src = operands[1];
      let val = 0;
      if (src.startsWith('#')) {
        val = parseNumber(src);
      } else if (src.startsWith('R') && src.length === 2) {
        val = state.R[parseInt(src[1], 10)];
      } else {
        const addr = parseNumber(src);
        val = state.RAM[addr & 0x7f];
      }

      const borrowIn = state.PSW.CY ? 1 : 0;
      const diff = state.A - val - borrowIn;

      state.PSW.CY = diff < 0;
      state.PSW.OV =
        ((state.A ^ val) & (state.A ^ diff) & 0x80) !== 0;

      state.A = (diff + 256) & 0xff;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 1;
      break;
    }

    case 'INC': {
      const dest = operands[0];
      if (dest === 'A') {
        state.A = (state.A + 1) & 0xff;
        state.PSW.P = calculateParity(state.A);
      } else if (dest === 'DPTR') {
        state.DPTR = (state.DPTR + 1) & 0xffff;
      } else if (dest.startsWith('R') && dest.length === 2) {
        const r = parseInt(dest[1], 10);
        state.R[r] = (state.R[r] + 1) & 0xff;
      } else {
        const addr = parseNumber(dest);
        state.RAM[addr & 0x7f] = (state.RAM[addr & 0x7f] + 1) & 0xff;
      }
      state.cycles += 1;
      break;
    }

    case 'DEC': {
      const dest = operands[0];
      if (dest === 'A') {
        state.A = (state.A - 1 + 256) & 0xff;
        state.PSW.P = calculateParity(state.A);
      } else if (dest.startsWith('R') && dest.length === 2) {
        const r = parseInt(dest[1], 10);
        state.R[r] = (state.R[r] - 1 + 256) & 0xff;
      } else {
        const addr = parseNumber(dest);
        state.RAM[addr & 0x7f] = (state.RAM[addr & 0x7f] - 1 + 256) & 0xff;
      }
      state.cycles += 1;
      break;
    }

    case 'MUL': {
      const prod = state.A * state.B;
      state.A = prod & 0xff;
      state.B = (prod >> 8) & 0xff;
      state.PSW.OV = state.B > 0;
      state.PSW.CY = false;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 4;
      break;
    }

    case 'DIV': {
      if (state.B === 0) {
        state.PSW.OV = true;
      } else {
        const quot = Math.floor(state.A / state.B);
        const rem = state.A % state.B;
        state.A = quot & 0xff;
        state.B = rem & 0xff;
        state.PSW.OV = false;
      }
      state.PSW.CY = false;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 4;
      break;
    }

    case 'ANL':
    case 'ORL':
    case 'XRL': {
      const dest = operands[0];
      const src = operands[1];
      let val = 0;
      if (src.startsWith('#')) val = parseNumber(src);
      else if (src === 'A') val = state.A;
      else val = state.RAM[parseNumber(src) & 0x7f];

      if (dest === 'A') {
        if (mnemonic === 'ANL') state.A &= val;
        else if (mnemonic === 'ORL') state.A |= val;
        else if (mnemonic === 'XRL') state.A ^= val;
        state.A &= 0xff;
        state.PSW.P = calculateParity(state.A);
      }
      state.cycles += 1;
      break;
    }

    case 'CPL': {
      const op = operands[0];
      if (op === 'A') {
        state.A = ~state.A & 0xff;
        state.PSW.P = calculateParity(state.A);
      } else if (op === 'C') {
        state.PSW.CY = !state.PSW.CY;
      } else if (op === 'P1.0') {
        state.P1 ^= 0x01;
      }
      state.cycles += 1;
      break;
    }

    case 'CLR': {
      const op = operands[0];
      if (op === 'A') {
        state.A = 0;
        state.PSW.P = false;
      } else if (op === 'C') {
        state.PSW.CY = false;
      } else if (op === 'P1.0') {
        state.P1 &= ~0x01;
      }
      state.cycles += 1;
      break;
    }

    case 'SETB': {
      const op = operands[0];
      if (op === 'C') state.PSW.CY = true;
      else if (op === 'TR0') state.TCON |= 0x10;
      else if (op === 'TR1') state.TCON |= 0x40;
      else if (op === 'EA') state.SFR[0xa8] = (state.SFR[0xa8] || 0) | 0x80;
      else if (op === 'P1.0') state.P1 |= 0x01;
      state.cycles += 1;
      break;
    }

    case 'RL': {
      const msb = (state.A & 0x80) ? 1 : 0;
      state.A = ((state.A << 1) | msb) & 0xff;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 1;
      break;
    }

    case 'RR': {
      const lsb = (state.A & 0x01) ? 0x80 : 0;
      state.A = ((state.A >> 1) | lsb) & 0xff;
      state.PSW.P = calculateParity(state.A);
      state.cycles += 1;
      break;
    }

    case 'DJNZ': {
      const reg = operands[0];
      const target = operands[1];
      let newCount = 0;
      if (reg.startsWith('R') && reg.length === 2) {
        const r = parseInt(reg[1], 10);
        state.R[r] = (state.R[r] - 1 + 256) & 0xff;
        newCount = state.R[r];
      }
      if (newCount !== 0 && labels[target] !== undefined) {
        nextIdx = labels[target];
        log += ` -> Jump to ${target} (Remaining: ${newCount})`;
      } else {
        log += ` -> Zero reached, no branch`;
      }
      state.cycles += 2;
      break;
    }

    case 'SJMP':
    case 'LJMP':
    case 'AJMP': {
      const target = operands[0];
      if (labels[target] !== undefined) {
        nextIdx = labels[target];
        log += ` -> Branch to ${target}`;
      }
      state.cycles += 2;
      break;
    }

    case 'JZ': {
      const target = operands[0];
      if (state.A === 0 && labels[target] !== undefined) {
        nextIdx = labels[target];
      }
      state.cycles += 2;
      break;
    }

    case 'JNZ': {
      const target = operands[0];
      if (state.A !== 0 && labels[target] !== undefined) {
        nextIdx = labels[target];
      }
      state.cycles += 2;
      break;
    }

    case 'JC': {
      const target = operands[0];
      if (state.PSW.CY && labels[target] !== undefined) {
        nextIdx = labels[target];
      }
      state.cycles += 2;
      break;
    }

    case 'JNC': {
      const target = operands[0];
      if (!state.PSW.CY && labels[target] !== undefined) {
        nextIdx = labels[target];
      }
      state.cycles += 2;
      break;
    }

    case 'CJNE': {
      const op1 = operands[0];
      const op2 = operands[1];
      const target = operands[2];
      let v1 = 0;
      let v2 = 0;
      if (op1 === 'A') v1 = state.A;
      else if (op1.startsWith('R')) v1 = state.R[parseInt(op1[1], 10)];
      else v1 = state.RAM[parseNumber(op1) & 0x7f];

      if (op2.startsWith('#')) v2 = parseNumber(op2);
      else if (op2 === 'B') v2 = state.B;
      else if (op2.startsWith('@R')) v2 = state.RAM[state.R[parseInt(op2[2], 10)] & 0x7f];

      state.PSW.CY = v1 < v2;
      if (v1 !== v2 && labels[target] !== undefined) {
        nextIdx = labels[target];
        log += ` -> Not equal (${v1} != ${v2}), jump to ${target}`;
      }
      state.cycles += 2;
      break;
    }

    case 'NOP': {
      state.cycles += 1;
      break;
    }

    default:
      log += ` (Emulated NOP)`;
      state.cycles += 1;
  }

  // Update PC
  state.PC = inst.lineNum * 2; // Simulated instruction address

  return { nextInstIdx: nextIdx, log };
}

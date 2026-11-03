export interface Topic {
  title: string;
  enExplanation: string;
  hiExplanation: string;
  enRemember: string;
  hiRemember: string;
}

export interface Unit {
  id: number;
  title: string;
  topics: Topic[];
}

export const unitsData: Unit[] = [
  {
    id: 1,
    title: "Introduction & 8051 Architecture",
    topics: [
      {
        title: "Introduction and terminology",
        enExplanation: "A microcontroller is a compact computer on a single integrated circuit. It combines a CPU, memory and input/output peripherals. A microprocessor generally needs external memory and peripherals to form a complete system.",
        hiExplanation: "माइक्रोकंट्रोलर एक छोटी कंप्यूटर प्रणाली है जो एक ही IC में CPU, Memory और Input/Output सुविधाएँ जोड़ती है। माइक्रोप्रोसेसर को सामान्यतः पूरा सिस्टम बनाने के लिए बाहरी मेमोरी और पेरिफेरल्स की आवश्यकता होती है।",
        enRemember: "Think of it as a tiny computer dedicated to controlling a device.",
        hiRemember: "इसे किसी उपकरण को नियंत्रित करने वाला छोटा कंप्यूटर समझें।"
      },
      {
        title: "CPU: Central Processing Unit",
        enExplanation: "The CPU fetches instructions, decodes them and executes them. In the 8051 it includes the ALU, accumulator, B register, program counter, data pointer and control logic. The ALU performs arithmetic and logical operations.",
        hiExplanation: "CPU निर्देशों को मेमोरी से लाता है, उनका अर्थ समझता है और उन्हें execute करता है। 8051 में ALU, Accumulator, B register, Program Counter, Data Pointer और Control Logic शामिल हैं। ALU गणितीय और लॉजिकल कार्य करता है।",
        enRemember: "Instruction cycle: Fetch → Decode → Execute.",
        hiRemember: "निर्देश चक्र: Fetch → Decode → Execute."
      },
      {
        title: "Memory",
        enExplanation: "Program memory stores the instructions; data memory stores variables and temporary values. Classic 8051 has 4 KB on-chip program ROM and 128 bytes internal RAM. External program and data memory can also be connected, within the architecture's address limits.",
        hiExplanation: "Program Memory में instructions रखे जाते हैं; Data Memory में variables और अस्थायी data रखा जाता है। Classic 8051 में 4 KB on-chip program ROM और 128 bytes internal RAM होती है। आवश्यकता पर external memory भी जोड़ी जा सकती है।",
        enRemember: "Program memory ≠ data memory. Code and working data have separate spaces.",
        hiRemember: "Program memory और data memory अलग-अलग काम करती हैं।"
      },
      {
        title: "Buses",
        enExplanation: "A bus is a group of signal lines used to transfer information. The address bus identifies a location, the data bus carries data, and the control bus carries read/write and timing signals. 8051 external-memory access multiplexes low address and data on Port 0.",
        hiExplanation: "Bus कई signal lines का समूह है। Address Bus स्थान बताती है, Data Bus जानकारी ले जाती है और Control Bus read/write जैसे संकेत देती है। External memory access में Port 0 पर low address और data multiplex होते हैं।",
        enRemember: "Address = where; Data = what; Control = how/when.",
        hiRemember: "Address = कहाँ, Data = क्या, Control = कैसे/कब।"
      },
      {
        title: "Classification of microcontrollers",
        enExplanation: "Microcontrollers may be classified by data width (8-bit, 16-bit, 32-bit), memory architecture (Harvard or Von Neumann), instruction set (CISC or RISC), and memory type (embedded program memory or externally supplied memory).",
        hiExplanation: "माइक्रोकंट्रोलर को data width (8/16/32-bit), memory architecture (Harvard/Von Neumann), instruction set (CISC/RISC) और program memory के आधार पर वर्गीकृत किया जाता है।",
        enRemember: "8051 is an 8-bit, CISC-family controller with separate code and data spaces.",
        hiRemember: "8051 एक 8-bit controller है और इसमें code तथा data के अलग address spaces हैं।"
      },
      {
        title: "MCS-51 overview",
        enExplanation: "MCS-51 is the microcontroller family associated with the 8051 architecture. The classic 8051 provides an 8-bit CPU, 32 I/O lines, two 16-bit timers/counters, a serial port, interrupt control, on-chip RAM and program memory.",
        hiExplanation: "MCS-51, 8051 architecture से जुड़ी microcontroller family है। Classic 8051 में 8-bit CPU, 32 I/O lines, दो 16-bit timers/counters, serial port, interrupt control, RAM और program memory होती है।",
        enRemember: "The exact memory and peripherals can vary among 8051-family derivatives.",
        hiRemember: "अलग-अलग 8051 derivatives में memory और peripherals अलग हो सकते हैं।"
      },
      {
        title: "Pin details",
        enExplanation: "The standard 8051 package is a 40-pin DIP. Important pins include VCC (40), GND (20), RST (9), XTAL1/XTAL2 (19/18), EA (31), ALE (30), PSEN (29), and ports P0–P3.",
        hiExplanation: "Standard 8051 का package 40-pin DIP होता है। मुख्य pins हैं: VCC (40), GND (20), RST (9), XTAL1/XTAL2 (19/18), EA (31), ALE (30), PSEN (29) और P0–P3।",
        enRemember: "RST is active high; hold it high for at least two machine cycles while the oscillator runs.",
        hiRemember: "RST active-high है; oscillator चलने पर reset के लिए इसे कम-से-कम दो machine cycles तक high रखें।"
      },
      {
        title: "I/O port structure",
        enExplanation: "Ports 0, 1, 2 and 3 are eight bits wide, giving 32 I/O lines. Ports 1, 2 and 3 have internal pull-ups. Port 0 is open-drain when used as general-purpose I/O and needs external pull-ups. Port pins are quasi-bidirectional in the classic design.",
        hiExplanation: "Port 0, 1, 2 और 3 प्रत्येक 8-bit के हैं, इसलिए कुल 32 I/O lines मिलती हैं। Port 1, 2 और 3 में internal pull-ups होते हैं। General I/O के रूप में Port 0 open-drain होता है, इसलिए external pull-ups की जरूरत होती है।",
        enRemember: "Writing 1 to a port latch generally releases the pin for input use.",
        hiRemember: "Input लेने के लिए सामान्यतः port latch में 1 लिखा जाता है।"
      },
      {
        title: "Memory organization",
        enExplanation: "The 8051 uses separate code and data address spaces. Internal RAM 00H–7FH contains register banks, bit-addressable RAM and general-purpose RAM. SFRs occupy direct addresses 80H–FFH. External code memory can be up to 64 KB; external data memory can be up to 64 KB.",
        hiExplanation: "8051 में code और data के अलग address spaces होते हैं। Internal RAM 00H–7FH में register banks, bit-addressable RAM और general-purpose RAM होते हैं। SFRs के direct addresses 80H–FFH होते हैं। External code और data memory प्रत्येक अधिकतम 64 KB तक address की जा सकती हैं।",
        enRemember: "RAM map: 00H–1FH register banks; 20H–2FH bit-addressable; 30H–7FH general RAM.",
        hiRemember: "RAM map याद रखें: 00H–1FH register banks; 20H–2FH bit-addressable; 30H–7FH general RAM."
      },
      {
        title: "Special Function Registers (SFRs)",
        enExplanation: "SFRs are control/status registers mapped in the upper address area. Examples: ACC (E0H), B (F0H), PSW (D0H), SP (81H), DPL (82H), DPH (83H), P0 (80H), TMOD (89H), TCON (88H), SCON (98H), SBUF (99H), IE (A8H), IP (B8H).",
        hiExplanation: "SFRs विशेष control और status registers हैं। ये upper address area में होते हैं। उदाहरण: ACC, B, PSW, SP, DPTR के DPL/DPH, ports, TMOD, TCON, SCON, SBUF, IE और IP।",
        enRemember: "Many SFRs are bit-addressable; not every SFR address is implemented on every derivative.",
        hiRemember: "कई SFRs bit-addressable होते हैं; हर derivative में सभी addresses उपलब्ध हों, यह जरूरी नहीं।"
      },
      {
        title: "External memory",
        enExplanation: "For external memory, Port 0 carries multiplexed AD0–AD7; ALE enables an external latch to hold A0–A7. Port 2 carries A8–A15. PSEN is used to read external program memory; RD and WR control external data-memory reads and writes. EA selects internal/external program-memory use.",
        hiExplanation: "External memory के लिए Port 0 multiplexed AD0–AD7 देता है। ALE external latch को A0–A7 hold करने का signal देता है। Port 2, A8–A15 देता है। PSEN external program memory पढ़ने के लिए और RD/WR external data memory के लिए उपयोग होते हैं।",
        enRemember: "Typical external interface: 8051 + 74LS373 latch + memory chip.",
        hiRemember: "सामान्य interface में 8051, 74LS373 latch और memory chip जुड़ते हैं।"
      }
    ]
  },
  {
    id: 2,
    title: "Instruction Set & Addressing Modes",
    topics: [
      {
        title: "Instruction set",
        enExplanation: "The instruction set is the complete collection of operations understood by the processor. An instruction contains an operation code (mnemonic) and, where required, operands. 8051 instructions operate on registers, internal RAM, SFRs, code memory, external data memory and bits.",
        hiExplanation: "Instruction Set उन सभी operations का समूह है जिन्हें processor समझता है। Instruction में mnemonic और जरूरत के अनुसार operands होते हैं। 8051 instructions registers, RAM, SFRs, code memory, external memory और bits पर काम करते हैं।",
        enRemember: "Example: MOV A,#25H loads the constant 25H into A.",
        hiRemember: "उदाहरण: MOV A,#25H, A में 25H constant डालता है।"
      },
      {
        title: "Register addressing",
        enExplanation: "The operand is a CPU register such as A, B or R0–R7. Example: MOV A,R3 copies the contents of R3 into A. The active register bank determines which physical R register is used.",
        hiExplanation: "Operand CPU register जैसे A, B या R0–R7 होता है। उदाहरण: MOV A,R3, R3 का data A में copy करता है। कौन-सा physical register उपयोग होगा, यह active register bank पर निर्भर करता है।",
        enRemember: "No RAM address is written in the instruction.",
        hiRemember: "Instruction में RAM address लिखने की जरूरत नहीं होती।"
      },
      {
        title: "Direct addressing",
        enExplanation: "The instruction contains the direct address of internal RAM or an SFR. Example: MOV A,30H reads internal RAM location 30H into A; MOV P1,A writes A to Port 1.",
        hiExplanation: "Instruction में internal RAM या SFR का direct address दिया जाता है। उदाहरण: MOV A,30H, RAM location 30H का data A में लाता है। MOV P1,A, A का data Port 1 पर भेजता है।",
        enRemember: "The address is explicit in the instruction.",
        hiRemember: "Address instruction में साफ लिखा होता है।"
      },
      {
        title: "Indirect addressing",
        enExplanation: "The address of the data is held in a register, usually R0 or R1 for internal RAM. The @ symbol means access the memory location pointed to by the register. Example: MOV A,@R0.",
        hiExplanation: "Data का address किसी register में रखा जाता है। Internal RAM के लिए आमतौर पर R0 या R1 उपयोग होते हैं। @ का अर्थ है register द्वारा बताए गए memory address को access करना। उदाहरण: MOV A,@R0।",
        enRemember: "If R0 = 40H, MOV A,@R0 reads RAM[40H].",
        hiRemember: "यदि R0 = 40H है, तो MOV A,@R0, RAM[40H] पढ़ेगा।"
      },
      {
        title: "Immediate addressing",
        enExplanation: "The constant value is part of the instruction and is marked with #. Example: MOV A,#25H loads 25H into A. Without #, the operand may be interpreted as a direct address.",
        hiExplanation: "Constant value instruction के अंदर होता है और # से दर्शाया जाता है। उदाहरण: MOV A,#25H, A में 25H डालता है। # हटाने पर operand को direct address समझा जा सकता है।",
        enRemember: "# means the value itself, not the address.",
        hiRemember: "# का अर्थ value खुद है, उसका address नहीं।"
      },
      {
        title: "Relative addressing",
        enExplanation: "Short conditional and unconditional branches use a signed 8-bit relative offset from the address after the branch instruction. Example: SJMP LOOP. The destination must be within −128 to +127 bytes of that reference point.",
        hiExplanation: "Short branch instructions signed 8-bit relative offset का उपयोग करती हैं। उदाहरण: SJMP LOOP। Target, branch instruction के बाद वाले address से −128 से +127 bytes की सीमा में होना चाहिए।",
        enRemember: "Used by SJMP, JZ, JNZ, JC, JNC and DJNZ.",
        hiRemember: "SJMP, JZ, JNZ, JC, JNC और DJNZ में उपयोग होता है।"
      },
      {
        title: "Absolute addressing",
        enExplanation: "AJMP and ACALL use an 11-bit destination address within the same 2 KB page as the next instruction. They are shorter than long jump/call instructions.",
        hiExplanation: "AJMP और ACALL 11-bit destination address उपयोग करते हैं, जो अगले instruction वाले 2 KB page के अंदर होना चाहिए। ये long jump/call से छोटे होते हैं।",
        enRemember: "AJMP label is not a full 16-bit jump.",
        hiRemember: "AJMP पूरा 16-bit jump नहीं है।"
      },
      {
        title: "Long addressing",
        enExplanation: "LJMP and LCALL use a full 16-bit code address, allowing transfer anywhere in the 64 KB code address space.",
        hiExplanation: "LJMP और LCALL पूरा 16-bit code address उपयोग करते हैं। इससे 64 KB code address space में कहीं भी control transfer किया जा सकता है।",
        enRemember: "LJMP 1234H transfers execution to code address 1234H.",
        hiRemember: "LJMP 1234H execution को 1234H पर भेजता है।"
      },
      {
        title: "Indexed addressing",
        enExplanation: "Indexed addressing combines the accumulator A with DPTR or the program counter to read lookup-table data from code memory using MOVC. Example: MOVC A,@A+DPTR.",
        hiExplanation: "Indexed addressing में accumulator A को DPTR या Program Counter के साथ जोड़कर code memory की lookup table से data पढ़ा जाता है। इसके लिए MOVC instruction उपयोग होता है।",
        enRemember: "Useful for seven-segment lookup tables and constant arrays.",
        hiRemember: "Seven-segment lookup table और constant arrays के लिए उपयोगी।"
      },
      {
        title: "Arithmetic instructions",
        enExplanation: "Arithmetic instructions include ADD, ADDC, SUBB, INC, DEC, MUL AB, DIV AB and DA A. ADD adds; ADDC adds with carry; SUBB subtracts with borrow; INC/DEC change a value by one. MUL and DIV use A and B.",
        hiExplanation: "Arithmetic instructions में ADD, ADDC, SUBB, INC, DEC, MUL AB, DIV AB और DA A शामिल हैं। ADD जोड़ता है; ADDC carry सहित जोड़ता है; SUBB borrow सहित घटाता है; INC/DEC एक बढ़ाते/घटाते हैं। MUL और DIV में A तथा B उपयोग होते हैं।",
        enRemember: "Example: MOV A,#05H; ADD A,#03H → A = 08H.",
        hiRemember: "उदाहरण: 05H + 03H = 08H।"
      },
      {
        title: "Logical instructions",
        enExplanation: "ANL performs bitwise AND, ORL performs OR, XRL performs XOR, CPL complements bits, CLR clears and RL/RR rotate accumulator bits. These are useful for masking, setting and testing bit patterns.",
        hiExplanation: "ANL bitwise AND, ORL OR, XRL XOR करता है। CPL bits उलटता है, CLR clear करता है और RL/RR accumulator के bits rotate करते हैं। ये masking और bit manipulation में उपयोगी हैं।",
        enRemember: "Example: ANL A,#0FH keeps only the lower four bits.",
        hiRemember: "उदाहरण: ANL A,#0FH केवल lower four bits रखता है।"
      },
      {
        title: "Data transfer instructions",
        enExplanation: "MOV transfers data between permitted operands; MOVC reads code memory; MOVX accesses external data memory; PUSH and POP use the stack; XCH exchanges data. Not every source/destination combination is legal.",
        hiExplanation: "MOV allowed operands के बीच data transfer करता है; MOVC code memory पढ़ता है; MOVX external data memory access करता है; PUSH/POP stack उपयोग करते हैं; XCH data exchange करता है। हर operand combination valid नहीं होता।",
        enRemember: "MOV, MOVC and MOVX are different—learn their memory spaces.",
        hiRemember: "MOV, MOVC और MOVX के memory spaces अलग हैं।"
      },
      {
        title: "Boolean instructions",
        enExplanation: "Boolean instructions operate on individual bits and the carry flag. Examples: SETB bit sets a bit, CLR bit clears it, CPL bit toggles it, MOV C,bit copies a bit to carry, and ANL C,bit / ORL C,bit combine bit values with carry.",
        hiExplanation: "Boolean instructions individual bits और Carry flag पर काम करती हैं। SETB bit को set, CLR clear, CPL toggle करता है। MOV C,bit bit को carry में copy करता है। ANL C,bit और ORL C,bit carry के साथ logic करते हैं।",
        enRemember: "Bit addresses include bit-addressable RAM and bit-addressable SFRs.",
        hiRemember: "Bit address, bit-addressable RAM और SFRs में मिलते हैं।"
      },
      {
        title: "Program branching instructions",
        enExplanation: "Branching instructions change program flow. JMP instructions jump; CALL instructions save a return address and call a subroutine; RET returns; conditional branches test flags or accumulator; DJNZ decrements and jumps if not zero.",
        hiExplanation: "Branching instructions program का flow बदलती हैं। JMP jump करता है; CALL return address save करके subroutine बुलाता है; RET वापस आता है; conditional branches flags जाँचती हैं; DJNZ decrement करके zero न होने पर jump करता है।",
        enRemember: "RETI is specifically used at the end of an interrupt service routine.",
        hiRemember: "Interrupt Service Routine के अंत में RETI उपयोग होता है।"
      }
    ]
  },
  {
    id: 3,
    title: "Timers & Serial Communication",
    topics: [
      {
        title: "Timer operation",
        enExplanation: "The 8051 has Timer 0 and Timer 1. A timer counts internal machine-cycle pulses; a counter counts external pulses at the T0 or T1 input. Each is controlled by mode, run and flag bits.",
        hiExplanation: "8051 में Timer 0 और Timer 1 होते हैं। Timer internal machine-cycle pulses गिनता है; Counter, T0 या T1 input पर external pulses गिनता है। इनके mode, run और flag bits से control होता है।",
        enRemember: "Timer = internal clock events; Counter = external events.",
        hiRemember: "Timer internal clock गिनता है; Counter बाहरी pulses गिनता है।"
      },
      {
        title: "Timer Mode Register (TMOD)",
        enExplanation: "TMOD is an 8-bit register at 89H. Upper nibble controls Timer 1; lower nibble controls Timer 0. Each nibble contains GATE, C/T, M1 and M0. GATE enables external gating; C/T selects timer or counter; M1:M0 select mode.",
        hiExplanation: "TMOD 89H address पर 8-bit register है। Upper nibble Timer 1 और lower nibble Timer 0 को control करता है। हर nibble में GATE, C/T, M1 और M0 bits होती हैं।",
        enRemember: "TMOD = 20H selects Timer 1 Mode 2, with timer operation and gate off.",
        hiRemember: "TMOD = 20H, Timer 1 Mode 2 चुनता है।"
      },
      {
        title: "Timer Control Register (TCON)",
        enExplanation: "TCON is an 8-bit bit-addressable SFR at 88H. TF1/TR1 control Timer 1 overflow/run; TF0/TR0 do the same for Timer 0; IE1/IT1 and IE0/IT0 relate to external interrupts.",
        hiExplanation: "TCON 88H पर bit-addressable SFR है। TF1/TR1 Timer 1 का overflow/run control करते हैं; TF0/TR0 Timer 0 के लिए हैं। IE1/IT1 और IE0/IT0 external interrupts से जुड़े हैं।",
        enRemember: "TR0=1 starts Timer 0; TR0=0 stops it.",
        hiRemember: "TR0=1 से Timer 0 start और TR0=0 से stop होता है।"
      },
      {
        title: "Timer modes and overflow flag",
        enExplanation: "Mode 0 is a 13-bit timer; Mode 1 is 16-bit; Mode 2 is 8-bit auto-reload; Mode 3 splits Timer 0 into two 8-bit timers. When the counter rolls over, its overflow flag TF0 or TF1 is set.",
        hiExplanation: "Mode 0, 13-bit; Mode 1, 16-bit; Mode 2, 8-bit auto-reload; Mode 3, Timer 0 को दो 8-bit timers में बाँटता है। Counter overflow होने पर TF0 या TF1 flag set होता है।",
        enRemember: "Mode 1 counts from the loaded value through FFFFH, then overflows.",
        hiRemember: "Mode 1 loaded value से FFFFH तक count करके overflow करता है।"
      },
      {
        title: "Clocking sources",
        enExplanation: "In timer mode (C/T=0), the timer increments once per machine cycle. In classic 12-clock 8051, one machine cycle is 12 oscillator periods. In counter mode (C/T=1), external transitions at T0/T1 are counted, subject to sampling limits.",
        hiExplanation: "Timer mode (C/T=0) में timer हर machine cycle पर बढ़ता है। Classic 12-clock 8051 में एक machine cycle = oscillator के 12 periods। Counter mode (C/T=1) में T0/T1 के external transitions गिने जाते हैं।",
        enRemember: "At 12 MHz on a classic 12-clock core, timer tick = 1 μs.",
        hiRemember: "12 MHz classic core पर timer tick = 1 μs।"
      },
      {
        title: "Starting, stopping and controlling timers",
        enExplanation: "Load THx/TLx with an initial value, configure TMOD, clear the overflow flag if needed, and set TRx to start. Poll TFx or enable the timer interrupt. Stop by clearing TRx. Reload the registers for another interval when using Mode 1.",
        hiExplanation: "THx/TLx में initial value डालें, TMOD configure करें, जरूरत हो तो overflow flag clear करें और start करने के लिए TRx set करें। TFx poll करें या timer interrupt enable करें। Stop करने के लिए TRx clear करें।",
        enRemember: "Typical order: configure → load → clear flag → start → wait → stop/reload.",
        hiRemember: "सामान्य क्रम: configure → load → flag clear → start → wait → stop/reload।"
      },
      {
        title: "Initializing and accessing timer registers",
        enExplanation: "Timer registers are accessed through their SFR names: TMOD, TCON, TH0, TL0, TH1 and TL1. Example setup for Timer 0 Mode 1: MOV TMOD,#01H; MOV TH0,#...; MOV TL0,#...; CLR TF0; SETB TR0.",
        hiExplanation: "Timer registers को SFR names TMOD, TCON, TH0, TL0, TH1 और TL1 से access करते हैं। Timer 0 Mode 1 setup का उदाहरण: MOV TMOD,#01H; TH0/TL0 load करें; CLR TF0; SETB TR0।",
        enRemember: "For Mode 1, initial count = 65536 − required timer ticks.",
        hiRemember: "Mode 1 में initial count = 65536 − आवश्यक timer ticks।"
      },
      {
        title: "Short, medium and long intervals",
        enExplanation: "A single timer overflow can create a short delay. Repeating overflows with a software counter creates medium or long delays. For long accurate timing, use a suitable reload value, interrupts and account for instruction/interrupt overhead.",
        hiExplanation: "एक timer overflow से short delay बनाया जा सकता है। कई overflows को software counter से गिनकर medium या long delay बनाया जाता है। Long accurate timing में reload value और interrupt overhead का ध्यान रखें।",
        enRemember: "Delay duration = timer ticks × timer tick period, plus software overhead.",
        hiRemember: "Delay = timer ticks × timer tick period, साथ में software overhead।"
      },
      {
        title: "Baud rate generation & Timer 1 formula",
        enExplanation: "Baud rate is the rate at which serial data bits are transmitted per second. In 8051 serial Mode 1 and 3, Timer 1 in Mode 2 (8-bit auto-reload) is configured as the baud rate generator. The fundamental equation is:\nBaud Rate = (2^SMOD / 32) × (Timer 1 Overflow Rate)\nWhere Timer 1 Overflow Rate = Fosc / (12 × [256 - TH1]).\nCombining these yields:\n(256 - TH1) = (2^SMOD × Fosc) / (384 × Baud Rate).\nFor standard 11.0592 MHz crystal and SMOD=0, 9600 baud requires (256 - TH1) = 3, meaning TH1 = 253 = 0FDH (giving 0.00% error).",
        hiExplanation: "Baud rate प्रति सेकंड भेजे जाने वाले डेटा बिट्स की दर है। 8051 में Serial Mode 1 और 3 के लिए Timer 1 को Mode 2 (8-bit auto-reload) में बॉड रेट जनरेटर बनाया जाता है।\nमुख्य सूत्र:\nBaud Rate = (2^SMOD / 32) × (Timer 1 Overflow Rate)\nजहाँ Timer 1 Overflow Rate = Fosc / (12 × [256 - TH1]) होता है।\nहल करने पर:\n(256 - TH1) = (2^SMOD × Fosc) / (384 × Baud Rate)\n11.0592 MHz क्रिस्टल और SMOD=0 पर, 9600 बॉड के लिए TH1 = 256 - 3 = 253 = FDH होता है (बिल्कुल 0% त्रुटि)।",
        enRemember: "Formula: TH1 = 256 - [2^SMOD × Fosc / (384 × Baud)]. FDH = 9600, FAH = 4800, F4H = 2400 @ 11.0592 MHz.",
        hiRemember: "सूत्र: TH1 = 256 - [2^SMOD × Fosc / (384 × Baud)]। 11.0592 MHz पर FDH=9600, FAH=4800, F4H=2400 बॉड देता है।"
      },
      {
        title: "Synchronous vs. Asynchronous Serial Data Communication (Ayala Ch. 9)",
        enExplanation: "Kenneth J. Ayala divides serial transmission into two distinct categories:\n1. Synchronous Transmission (Mode 0): Data bits are accompanied by a shared clock line (TXD = clock at Fosc/12, RXD = data). No start or stop bits are used, yielding high data density. Used for board-level I/O expansion (e.g. CD4094, 74HC164).\n2. Asynchronous Transmission (Modes 1, 2, 3): No common clock line is shared between sender and receiver. Instead, each character is framed with 1 Start bit (low) and 1 Stop bit (high). Clocks at both ends must match within ±2.5% tolerance to prevent framing errors.",
        hiExplanation: "Kenneth J. Ayala की पाठ्यपुस्तक के अनुसार सीरियल संचार दो प्रकार का होता है:\n1. Synchronous (Mode 0): इसमें ट्रांसमीटर और रिसीवर के बीच साझा क्लॉक (TXD = Fosc/12) भेजी जाती है। इसमें Start या Stop बिट नहीं होते। यह 74HC164/165 लैच द्वारा I/O पोर्ट्स बढ़ाने में काम आता है।\n2. Asynchronous (Modes 1, 2, 3): इसमें कोई क्लॉक लाइन नहीं होती। डेटा के साथ 1 Start बिट (0) और 1 Stop बिट (1) भेजा जाता है। दोनों उपकरणों की क्लॉक दर 2.5% की सीमा में समान होनी चाहिए वर्ना फ्रेमिंग एरर आ जाता है।",
        enRemember: "Synchronous = shared clock, no start/stop framing. Asynchronous = independent clocks, start/stop frame bits.",
        hiRemember: "Synchronous = साझा क्लॉक, बिना Start/Stop बिट्स। Asynchronous = स्वतंत्र क्लॉक, Start/Stop फ्रेमिंग बिट्स।"
      },
      {
        title: "The 11.0592 MHz Crystal Mystery & Baud Rate Error Analysis",
        enExplanation: "Why does virtually every 8051 board use 11.0592 MHz instead of 12.0000 MHz? Because 11.0592 MHz divided by 12 gives exactly 921.6 kHz. Further divided by 32 in the UART gives 28,800 Hz. The standard PC baud rates (9600, 4800, 2400, 1200) divide into 28,800 evenly with exact integer quotients (3, 6, 12, 24). Conversely, a 12 MHz crystal yields a fractional reload value (3.255), forcing an 8.51% frequency error which causes garbled characters on PC serial terminals.",
        hiExplanation: "8051 बोर्ड्स में 12 MHz के स्थान पर 11.0592 MHz क्रिस्टल क्यों लगाया जाता है? क्योंकि 11.0592 MHz को 12 से भाग देने पर 921.6 kHz आता है, और 32 से भाग देने पर 28,800 Hz मिलता है। यह संख्या 9600, 4800, 2400, 1200 से पूर्णतः विभाजित हो जाती है (भागफल 3, 6, 12, 24), जिससे 0.00% त्रुटि आती है। 12 MHz क्रिस्टल पर 8.51% त्रुटि आती है जिससे कंप्यूटर पर गलत अक्षर दिखाई देते हैं।",
        enRemember: "11.0592 MHz yields EXACT integer division for 9600, 4800, 2400 baud with 0% error.",
        hiRemember: "11.0592 MHz क्रिस्टल 9600, 4800, 2400 बॉड के लिए बिल्कुल शून्य त्रुटि (0%) प्रदान करता है।"
      },
      {
        title: "PCON Register & The SMOD Baud Doubler Bit",
        enExplanation: "PCON (Power Control Register at 87H) is not bit-addressable. Bit 7 is SMOD (Serial Baud Rate Doubler). When SMOD = 0 (default at reset), the Timer 1 overflow rate is divided by 32 to clock the UART. When SMOD = 1, the division factor is reduced to 16, exactly doubling the baud rate for the same TH1 reload value. For instance, TH1=FDH at 11.0592 MHz yields 9600 baud when SMOD=0, but 19200 baud when SMOD=1.\nAssembly instruction to double baud:\nMOV A, PCON\nSETB ACC.7\nMOV PCON, A",
        hiExplanation: "PCON (Power Control, 87H) बिट-एड्रेसेबल नहीं है। इसका बिट 7 'SMOD' कहलाता है। रीसेट पर SMOD = 0 होता है, जिससे टाइमर ओवरफ्लो 32 से भाग होता है। जब SMOD = 1 सेट किया जाता है, तो भाग 16 से होता है जिससे बॉड रेट ठीक दुगुना हो जाता है। उदाहरण के लिए, TH1=FDH पर SMOD=0 में 9600 बॉड मिलता है, पर SMOD=1 करने पर 19200 बॉड मिल जाता है।",
        enRemember: "SMOD=1 cuts UART prescaler from 32 to 16, doubling baud rate.",
        hiRemember: "SMOD=1 करने से UART प्रेस्केलर 32 से 16 हो जाता है, जिससे बॉड रेट दुगुना हो जाता है।"
      },
      {
        title: "Serial Operating Modes 0, 1, 2, and 3 (Ayala Ch. 2 & 9)",
        enExplanation: "The 8051 serial interface supports four distinct operating modes configured via SM0 and SM1 in SCON (98H):\n- Mode 0 (SM0=0, SM1=0): 8-bit Shift Register. Baud rate = Fosc / 12 (fixed). TXD outputs shift clock; RXD carries data.\n- Mode 1 (SM0=0, SM1=1): 8-bit UART with 10-bit frame (1 Start, 8 Data, 1 Stop). Variable baud rate driven by Timer 1.\n- Mode 2 (SM0=1, SM1=0): 9-bit UART with 11-bit frame (1 Start, 8 Data, 9th bit TB8/RB8, 1 Stop). Fixed baud rate: Fosc / 64 (SMOD=0) or Fosc / 32 (SMOD=1).\n- Mode 3 (SM0=1, SM1=1): 9-bit UART with variable baud rate from Timer 1. Used in multiprocessor systems.",
        hiExplanation: "SCON रजिस्टर में SM0 और SM1 द्वारा 8051 के 4 सीरियल मोड्स चुने जाते हैं:\n- Mode 0 (00): 8-बिट शिफ्ट रजिस्टर, फिक्स्ड बॉड (Fosc / 12)। TXD क्लॉक है, RXD डेटा।\n- Mode 1 (01): 8-बिट मानक UART, 10-बिट फ्रेम (1 Start, 8 Data, 1 Stop), Timer 1 द्वारा परिवर्तनीय बॉड रेट।\n- Mode 2 (10): 9-बिट UART, 11-बिट फ्रेम (1 Start, 8 Data, 1 Address/Data, 1 Stop), फिक्स्ड बॉड रेट (Fosc / 32 या 64)।\n- Mode 3 (11): 9-बिट UART, परिवर्तनीय बॉड रेट (Timer 1 द्वारा)। मल्टीप्रोसेसर संचार में प्रयुक्त।",
        enRemember: "Mode 0: Shift Reg (Fosc/12). Mode 1: 8-bit UART (Timer 1). Mode 2: 9-bit UART (Fixed). Mode 3: 9-bit UART (Timer 1).",
        hiRemember: "Mode 0: शिफ्ट रजिस्टर। Mode 1: 8-बिट UART। Mode 2: 9-बिट फिक्स्ड बॉड। Mode 3: 9-बिट वेरिएबल बॉड।"
      },
      {
        title: "Multiprocessor Communication & The SM2 Bit",
        enExplanation: "In multiprocessor topologies, one Master 8051 communicates with multiple Slave 8051 microcontrollers on a single serial line using Mode 2 or 3 (9-bit UART). The 9th bit (TB8) signifies Address (1) or Data (0). All Slaves initialize with SM2 = 1 in SCON, which suppresses receive interrupts (RI) as long as the received 9th bit is 0. When the Master broadcasts an Address byte (TB8=1), all Slaves are interrupted to examine the address. The matching Slave clears its SM2 to 0 to accept the following data stream, while other Slaves keep SM2=1 and ignore all traffic without CPU overhead.",
        hiExplanation: "मल्टीप्रोसेसर प्रणाली में एक मास्टर 8051 कई स्लेव 8051 से एक ही लाइन पर 9-बिट मोड (Mode 2 या 3) में बात करता है। 9वीं बिट (TB8) बताती है कि भेजा गया बाइट एड्रेस है (1) या डेटा (0)। सभी स्लेव SM2 = 1 रखते हैं, जिससे सामान्य डेटा आने पर कोई इंटरप्ट (RI) नहीं आता। जब मास्टर एड्रेस बाइट (TB8=1) भेजता है, तो सभी स्लेव जागकर एड्रेस जांचते हैं। जिस स्लेव का एड्रेस मिलता है वह SM2 = 0 कर लेता है ताकि आने वाला डेटा प्राप्त हो सके।",
        enRemember: "SM2=1 causes slave to ignore serial data unless 9th bit (RB8) is 1 (address byte).",
        hiRemember: "SM2=1 होने पर स्लेव डेटा को तब तक अनदेखा करता है जब तक 9वीं बिट 1 (एड्रेस) न हो।"
      },
      {
        title: "RS-232 Standard & MAX232 Voltage Level Converter",
        enExplanation: "Standard 8051 TTL logic levels (0V for logic 0, +5V for logic 1) cannot be directly connected to PC COM ports or RS-232 lines because RS-232 uses bipolar inverted voltages:\n- Logic 0 (Space): +3V to +15V\n- Logic 1 (Mark): -3V to -15V\nThe MAX232 IC solves this by incorporating an internal charge pump with four 0.1 µF (or 1 µF) capacitors that step up and invert the single +5V supply to ±10V. Pin 11 (T1IN) receives 8051 TXD (0-5V) and outputs RS-232 levels on Pin 14 (T1OUT). Pin 13 (R1IN) receives RS-232 levels and outputs TTL to 8051 RXD on Pin 12 (R1OUT).",
        hiExplanation: "8051 के TTL वोल्टेज (0V और +5V) को सीधे PC के RS-232 से नहीं जोड़ सकते क्योंकि RS-232 में इनवर्टेड वोल्टेज होते हैं:\n- लॉजिक 0 (Space) = +3V से +15V\n- लॉजिक 1 (Mark) = -3V से -15V\nMAX232 आईसी चार 0.1 µF कैपेसिटर्स के साथ चार्ज-पंप से 8051 के 5V को ±10V में बदलकर TTL और RS-232 के बीच वोल्टेज लेवल कंवर्जन करती है।",
        enRemember: "MAX232 converts TTL (0V/5V) to RS-232 (±10V) using 4 charge-pump capacitors.",
        hiRemember: "MAX232 आईसी 4 कैपेसिटर्स की मदद से TTL (0V/5V) को RS-232 (±10V) में बदलती है।"
      },
      {
        title: "Serial communication",
        enExplanation: "Serial communication sends data one bit at a time over a communication line. The 8051 serial port supports full-duplex operation, meaning it can transmit and receive simultaneously. UART frames typically include a start bit, data bits and a stop bit.",
        hiExplanation: "Serial communication में data एक समय में एक bit करके भेजा जाता है। 8051 serial port full-duplex है, यानी एक साथ transmit और receive कर सकता है। UART frame में सामान्यतः start bit, data bits और stop bit होते हैं।",
        enRemember: "P3.0 is RXD; P3.1 is TXD.",
        hiRemember: "P3.0 = RXD और P3.1 = TXD।"
      },
      {
        title: "Serial Port Buffer Register (SBUF)",
        enExplanation: "SBUF is the serial data buffer at address 99H. Writing to SBUF starts transmission. Reading SBUF obtains the received byte. Transmit and receive paths are logically separate even though the same SFR address is used.",
        hiExplanation: "SBUF 99H address पर serial data buffer है। SBUF में लिखने से transmission शुरू होता है। SBUF पढ़ने से received byte मिलता है। Transmit और receive paths logically अलग होते हैं।",
        enRemember: "MOV SBUF,A sends the byte in A.",
        hiRemember: "MOV SBUF,A, A में मौजूद byte भेजता है।"
      },
      {
        title: "Serial Port Control Register (SCON)",
        enExplanation: "SCON is at 98H and configures serial mode and status flags. SM0/SM1 select mode; SM2 supports multiprocessor communication; REN enables reception; TB8/RB8 are ninth data bits in 9-bit modes; TI and RI are transmit/receive flags.",
        hiExplanation: "SCON 98H पर होता है और serial mode तथा status flags configure करता है। SM0/SM1 mode चुनते हैं; REN reception enable करता है; TB8/RB8 ninth bit हैं; TI और RI transmit/receive flags हैं।",
        enRemember: "SCON=50H selects Mode 1 and enables reception (REN=1).",
        hiRemember: "SCON=50H, Mode 1 चुनता है और reception enable करता है।"
      },
      {
        title: "Initializing and accessing serial registers",
        enExplanation: "A common serial Mode 1 initialization at 11.0592 MHz is: MOV TMOD,#20H; TH1=FDH; SCON=50H; set TR1. To transmit, write SBUF and wait for TI; clear TI. To receive, wait for RI, read SBUF and clear RI.",
        hiExplanation: "11.0592 MHz पर Serial Mode 1 का सामान्य setup: TMOD=20H; TH1=FDH; SCON=50H; TR1 set करें। Transmit के लिए SBUF में लिखें और TI का wait करें; TI clear करें। Receive के लिए RI wait करें, SBUF पढ़ें और RI clear करें।",
        enRemember: "Always check the exact oscillator and baud-rate formula for your 8051 derivative.",
        hiRemember: "अपने 8051 derivative का oscillator और baud formula जरूर जाँचें।"
      }
    ]
  },
  {
    id: 4,
    title: "Interrupts & Assembly Language Programming – 1",
    topics: [
      {
        title: "8051 interrupt organization",
        enExplanation: "The classic 8051 has five interrupt sources: external interrupt 0, Timer 0, external interrupt 1, Timer 1 and serial port. The IE register enables sources and EA globally enables/disables interrupts. IP selects priority levels.",
        hiExplanation: "Classic 8051 में पाँच interrupt sources होते हैं: External 0, Timer 0, External 1, Timer 1 और Serial Port। IE register sources enable करता है और EA global enable है। IP priority level चुनता है।",
        enRemember: "Vector addresses: 0003H, 000BH, 0013H, 001BH and 0023H respectively.",
        hiRemember: "Vector addresses क्रमशः 0003H, 000BH, 0013H, 001BH और 0023H हैं।"
      },
      {
        title: "Processing interrupts",
        enExplanation: "When an enabled interrupt is accepted, the CPU completes the current instruction, saves the return address on the stack, branches to the interrupt vector and executes the ISR. RETI ends the ISR and restores normal program flow. Priority and interrupt nesting rules apply.",
        hiExplanation: "Enabled interrupt स्वीकार होने पर CPU current instruction पूरा करता है, return address stack पर save करता है, interrupt vector पर जाता है और ISR चलाता है। RETI से ISR समाप्त होकर program वापस चलता है। Priority और nesting rules लागू होते हैं।",
        enRemember: "ISR = Interrupt Service Routine.",
        hiRemember: "ISR का अर्थ Interrupt Service Routine है।"
      },
      {
        title: "Assembler operation",
        enExplanation: "An assembler translates assembly mnemonics and operands into machine-code bytes. It checks syntax, resolves labels and symbols, calculates addresses and produces object/listing or HEX output depending on the toolchain. A linker may combine object modules.",
        hiExplanation: "Assembler assembly mnemonics और operands को machine-code bytes में बदलता है। यह syntax check करता है, labels/symbols resolve करता है, addresses calculate करता है और tool के अनुसार object/listing या HEX output बनाता है।",
        enRemember: "Source (.asm) → assembler → object/listing → HEX → programmer.",
        hiRemember: "Source (.asm) → assembler → object/listing → HEX → programmer।"
      },
      {
        title: "Assembly language program format",
        enExplanation: "A typical line contains an optional label, mnemonic, operands and comment. Example: LOOP: DJNZ R2,LOOP ; repeat until R2 is zero. Labels identify addresses; mnemonics specify operations; operands identify data; comments explain intent.",
        hiExplanation: "Assembly की एक line में optional label, mnemonic, operands और comment होते हैं। उदाहरण: LOOP: DJNZ R2,LOOP ; R2 zero होने तक दोहराएँ। Label address बताता है; mnemonic operation; operands data; comment explanation देता है।",
        enRemember: "Only the mnemonic is essential on a normal instruction line; exact syntax depends on assembler.",
        hiRemember: "सामान्य instruction में mnemonic आवश्यक है; exact syntax assembler पर निर्भर है।"
      },
      {
        title: "Assembler directives",
        enExplanation: "Directives guide the assembler and generally do not become CPU instructions. ORG sets the assembly location; EQU assigns a constant name; DB defines bytes; DW defines words; DS reserves storage; BIT names a bit address; END marks the source end.",
        hiExplanation: "Directives assembler को निर्देश देते हैं और सामान्यतः CPU instruction नहीं बनते। ORG location set करता है; EQU constant का नाम देता है; DB bytes, DW words define करता है; DS space reserve करता है; BIT bit address नामित करता है; END source समाप्त करता है।",
        enRemember: "Example: COUNT EQU 05H; ORG 0000H; TABLE: DB 01H,02H,03H; END.",
        hiRemember: "उदाहरण: COUNT EQU 05H; ORG 0000H; TABLE: DB 01H,02H,03H; END।"
      }
    ]
  },
  {
    id: 5,
    title: "Assembly Programming – 2 & Interfacing",
    topics: [
      {
        title: "Keypad interface",
        enExplanation: "A matrix keypad connects keys in rows and columns, reducing the number of pins needed. The 8051 drives one row at a time and reads columns. A detected active column identifies the pressed key. Debouncing is needed because mechanical contacts can bounce.",
        hiExplanation: "Matrix keypad में keys rows और columns में जुड़ी होती हैं, जिससे pins कम लगते हैं। 8051 एक समय में एक row drive करता है और columns पढ़ता है। Active column से pressed key पहचानी जाती है। Mechanical bounce रोकने के लिए debouncing जरूरी है।",
        enRemember: "A 4×4 keypad uses 8 I/O lines for 16 keys.",
        hiRemember: "4×4 keypad में 16 keys के लिए 8 I/O lines लगती हैं।"
      },
      {
        title: "7-segment interface",
        enExplanation: "A seven-segment display has segments a–g and often a decimal point. Common-cathode displays turn a segment on with logic 1; common-anode displays generally turn it on with logic 0. A lookup table maps digits to segment patterns. Current-limiting resistors are required.",
        hiExplanation: "7-segment display में a–g segments और अक्सर decimal point होता है। Common-cathode में logic 1 से segment ON होता है; common-anode में सामान्यतः logic 0 से ON होता है। Lookup table digits को segment patterns में बदलती है। Current-limiting resistors जरूरी हैं।",
        enRemember: "For common-cathode, 3FH is a common pattern for digit 0 (bit/segment wiring convention matters).",
        hiRemember: "Common-cathode में digit 0 के लिए 3FH सामान्य pattern है; wiring convention ध्यान रखें।"
      },
      {
        title: "Speaker interface",
        enExplanation: "A speaker or buzzer can be driven by toggling an output pin to create a square wave. A timer can control the toggle interval and therefore the tone frequency. A transistor driver is often used because a port pin cannot safely supply high speaker current.",
        hiExplanation: "Speaker या buzzer को output pin toggle करके square wave से चलाया जा सकता है। Timer toggle interval control करके tone frequency तय करता है। अधिक current के लिए transistor driver उपयोग किया जाता है क्योंकि port pin सीधे ज्यादा current नहीं दे सकता।",
        enRemember: "Frequency = 1 / period; a shorter toggle period produces a higher tone.",
        hiRemember: "Frequency = 1/period; छोटा period होने पर tone ऊँची होती है।"
      },
      {
        title: "Input/output expansion",
        enExplanation: "When the 8051's 32 I/O lines are insufficient, external I/O devices can be mapped into external data memory space. Address decoding selects a device; latches hold output data and buffers read input data. MOVX accesses external data memory; RD/WR control transfers.",
        hiExplanation: "जब 8051 की 32 I/O lines पर्याप्त न हों, external I/O devices को external data memory space में map किया जा सकता है। Address decoder device चुनता है; latch output रखता है और buffer input पढ़ता है। MOVX external data memory access करता है; RD/WR transfer control करते हैं।",
        enRemember: "Examples include 74LS373 output latch and 74LS244 input buffer.",
        hiRemember: "उदाहरण: 74LS373 output latch और 74LS244 input buffer।"
      },
      {
        title: "Introduction to single-board computers",
        enExplanation: "A single-board computer (SBC) is a complete computer built on one circuit board, typically containing a processor, memory, storage interfaces and I/O. An 8051 trainer board is a microcontroller development board rather than a modern general-purpose SBC, but it serves a similar educational purpose for embedded-system practice.",
        hiExplanation: "Single-board computer (SBC) एक circuit board पर बना पूरा computer होता है, जिसमें processor, memory, storage interfaces और I/O होते हैं। 8051 trainer board microcontroller development board है, आधुनिक general-purpose SBC नहीं; लेकिन embedded practice के लिए उपयोगी है।",
        enRemember: "Examples of modern SBCs include Raspberry Pi; an 8051 trainer kit is used to practise 8051 interfacing.",
        hiRemember: "Modern SBC का उदाहरण Raspberry Pi है; 8051 trainer kit से 8051 interfacing सीखते हैं।"
      },
      {
        title: "ADC0804 Analog-to-Digital Converter Interfacing (Ayala Ch. 8)",
        enExplanation: "The ADC0804 is an 8-bit successive approximation ADC with differential analog inputs and an on-chip clock generator. Handshake sequence:\n1. Select chip (CS = 0).\n2. Send a LOW pulse on WR (Start Conversion).\n3. Poll INTR pin or connect to INT0. When conversion completes (approx 100 µs), INTR goes LOW.\n4. Send a LOW pulse on RD to enable tri-state outputs and read digital byte into Port 1 or accumulator.\nResolution = Vref / 256. For Vref = 5V, step size = 5V / 256 = 19.53 mV.",
        hiExplanation: "ADC0804 एक 8-बिट Successive Approximation एनालॉग-टू-डिजिटल कनवर्टर है।\nहैंडशेक प्रक्रिया:\n1. CS = 0 करें।\n2. WR पिन पर LOW पल्स देकर कन्वर्जन शुरू करें (Start of Conversion)।\n3. INTR पिन को जांचें। लगभग 100 µs बाद कन्वर्जन पूरा होते ही INTR LOW हो जाता है (End of Conversion)।\n4. RD पिन पर LOW पल्स देकर 8-बिट डिजिटल डेटा पोर्ट पर पढ़कर इनपुट करें।\n5V रेफरेंस पर स्टेप साइज = 5V / 256 = 19.53 mV होता है।",
        enRemember: "ADC0804: WR low pulse starts conversion; INTR goes low when done; RD low pulse reads data.",
        hiRemember: "ADC0804: WR पल्स कन्वर्जन शुरू करता है; INTR पूरा होने पर LOW होता है; RD पल्स से डेटा पढ़ा जाता है।"
      },
      {
        title: "DAC0808 Digital-to-Analog Converter & Waveform Generation (Ayala Ch. 8)",
        enExplanation: "The DAC0808 (or MC1408) is an 8-bit multiplying digital-to-analog converter using an R-2R ladder network. It outputs an analog current Iout proportional to the digital input byte:\nIout = Iref × (D7/2 + D6/4 + ... + D0/256).\nAn external op-amp (such as 741 or LM358) in transimpedance configuration converts this current to an output voltage: Vout = -Iout × Rf. By sending sequential values from 8051 ports in a loop, waveforms such as Square wave, Sawtooth ramp, Triangular, and Sine waves (via lookup table) are generated.",
        hiExplanation: "DAC0808 एक 8-बिट R-2R लैडर डिजिटल-टू-एनालॉग कनवर्टर है। यह डिजिटल इनपुट के अनुपात में एनालॉग करंट (Iout) उत्पन्न करता है। 741 ऑप-एम्प जोड़कर इस करंट को वोल्टेज में बदला जाता है (Vout = -Iout × Rf)। 8051 के पोर्ट पर लूप में वैल्यूज भेजकर स्क्वायर वेव, सॉ-टूथ रैंप, ट्रायंगुलर और लुकअप टेबल द्वारा साइन वेव बनाई जाती है।",
        enRemember: "DAC0808 generates current Iout; external op-amp converts it to voltage Vout.",
        hiRemember: "DAC0808 करंट Iout निकालता है; बाहरी op-amp इसे वोल्टेज Vout में बदलता है।"
      },
      {
        title: "16×2 Alphanumeric LCD Interfacing (HD44780 Controller)",
        enExplanation: "A 16×2 LCD module (Hitachi HD44780 compatible) displays 2 lines of 16 ASCII characters. Control pins:\n- RS (Register Select): RS = 0 for Command Register (e.g. 38H for 8-bit mode, 0EH for display on/cursor on, 01H for clear display); RS = 1 for Data Register (ASCII character code).\n- R/W: 0 = Write to LCD, 1 = Read (busy flag check on D7).\n- E (Enable): High-to-Low pulse (minimum 450 ns width) latches data/command into the LCD controller.\nCan operate in either 8-bit mode (D0–D7) or pin-saving 4-bit mode (D4–D7 sent as two nibbles).",
        hiExplanation: "16×2 LCD में 16 अक्षरों की 2 पंक्तियाँ होती हैं।\nनियंत्रण पिन्स:\n- RS: RS = 0 पर कमांड रजिस्टर (जैसे 38H = 8-बिट मोड, 01H = स्क्रीन क्लियर, 0EH = डिस्प्ले ऑन); RS = 1 पर डेटा (ASCII करैक्टर)।\n- R/W: 0 = लिखना, 1 = व्यस्त फ्लैग (Busy Flag D7) पढ़ना।\n- E (Enable): High-to-Low पल्स द्वारा डेटा लैच होता है।\nयह 8-बिट या 4-बिट (D4-D7) दोनों मोड्स में काम कर सकता है।",
        enRemember: "RS=0: Command, RS=1: Data; High-to-low pulse on Enable pin latches information.",
        hiRemember: "RS=0: कमांड, RS=1: डेटा; Enable पिन पर High-to-Low पल्स से डेटा लैच होता है।"
      },
      {
        title: "Stepper Motor Interfacing & Driver Sequences (Ayala Ch. 8)",
        enExplanation: "A 4-phase unipolar stepper motor converts electrical pulses into precise mechanical angular rotation (e.g., 1.8° step angle = 200 steps/revolution). Because 8051 port pins supply only ~10-15 mA, a ULN2003 Darlington transistor array is required as a current buffer.\nExcitation sequences for clockwise rotation:\n- Wave Drive (Single phase): 01H, 02H, 04H, 08H.\n- Full-Step (High torque dual phase): 03H, 06H, 0CH, 09H.\n- Half-Step (0.9° fine resolution): 01H, 03H, 02H, 06H, 04H, 0CH, 08H, 09H.\nMotor speed is controlled by the software delay inserted between consecutive step pulses.",
        hiExplanation: "स्टेपर मोटर इलेक्ट्रिकल पल्स को सटीक कोणीय गति (स्टेप एंगल जैसे 1.8°) में बदलती है। 8051 के पोर्ट पिन मोटर का करंट वहन नहीं कर सकते, इसलिए ULN2003 डार्लिंगटन ड्राइवर आईसी का उपयोग होता है।\nरोटेशन अनुक्रम:\n- फुल स्टेप (उच्च टॉर्क): 03H, 06H, 0CH, 09H।\n- हाफ स्टेप (0.9° सूक्ष्म नियंत्रण): 01H, 03H, 02H, 06H, 04H, 0CH, 08H, 09H।\nदो स्टेप्स के बीच सॉफ्टवेयर डिले बदलकर मोटर की गति नियंत्रित की जाती है।",
        enRemember: "ULN2003 drives motor coils; step sequence (03H, 06H, 0CH, 09H) controls rotation; delay sets speed.",
        hiRemember: "ULN2003 मोटर कॉइल्स को ड्राइव करता है; स्टेप सीक्वेंस से दिशा और डिले से गति नियंत्रित होती है।"
      }
    ]
  }
];

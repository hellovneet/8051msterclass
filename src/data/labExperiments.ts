export interface LabExperiment {
  id: number;
  title: string;
  aim: string;
  components: string[];
  theoryEn: string;
  theoryHi: string;
  circuitNotes: string;
  algorithm: string[];
  assemblyCode: string;
  expectedResult: string;
  vivaQuestions: { q: string; aEn: string; aHi: string }[];
}

export const labExperiments: LabExperiment[] = [
  {
    id: 1,
    title: "8-bit Addition and Subtraction",
    aim: "To write and execute an 8051 assembly language program to add and subtract two 8-bit numbers stored in internal RAM.",
    components: ["8051 Microcontroller Kit / Simulator", "Power supply (+5V)", "Keil µVision or 8051 Assembler"],
    theoryEn: "Addition is performed using ADD A,Rn or ADD A,#data. If the sum exceeds FFH, the Carry Flag (CY) in PSW is set. Subtraction is performed using SUBB A,Rn, which automatically subtracts the carry (borrow) flag as well.",
    theoryHi: "जोड़ ADD निर्देश से और घटाव SUBB निर्देश से किया जाता है। यदि परिणाम FFH से अधिक होता है तो Carry Flag (CY) 1 हो जाता है। SUBB निर्देश कैरी (बॉरो) फ़्लैग को भी साथ में घटाता है।",
    circuitNotes: "Standalone microcontroller with reset circuit (10µF + 10kΩ) and 12 MHz crystal with 33pF capacitors.",
    algorithm: [
      "1. Clear the Carry flag using CLR C.",
      "2. Load first 8-bit operand from RAM 30H into Accumulator.",
      "3. Add second operand from RAM 31H using ADD A,31H.",
      "4. Store result in RAM 32H and save carry in RAM 33H.",
      "5. For subtraction, load minuend, clear borrow flag, subtract subtrahend using SUBB A,31H, and store in RAM 34H.",
      "6. Terminate program with infinite SJMP loop."
    ],
    assemblyCode: `ORG 0000H
CLR C         ; Clear carry flag
MOV A,30H     ; Load first number from RAM 30H
ADD A,31H     ; Add second number from RAM 31H
MOV 32H,A     ; Store sum in RAM 32H
MOV A,#00H    ; Clear Accumulator to capture carry
ADDC A,#00H   ; Add carry flag
MOV 33H,A     ; Store carry in RAM 33H

; Subtraction routine:
CLR C         ; Clear borrow before SUBB
MOV A,30H     ; Load minuend
SUBB A,31H    ; Subtract subtrahend with borrow
MOV 34H,A     ; Store difference in RAM 34H
HERE: SJMP HERE ; Halt
END`,
    expectedResult: "If RAM[30H]=25H and RAM[31H]=13H, then Sum RAM[32H]=38H, Carry RAM[33H]=00H, Difference RAM[34H]=12H.",
    vivaQuestions: [
      {
        q: "Why must you execute CLR C before SUBB?",
        aEn: "Because 8051 does not have a simple SUB instruction without borrow; SUBB always subtracts the current Carry flag value along with the operand.",
        aHi: "क्योंकि 8051 में बिना बॉरो का SUB निर्देश नहीं होता; SUBB हमेशा कैरी फ़्लैग को भी घटाता है।"
      },
      {
        q: "Which flags in PSW are affected by ADD instruction?",
        aEn: "Carry Flag (CY), Auxiliary Carry (AC), Overflow Flag (OV), and Parity Flag (P).",
        aHi: "Carry (CY), Auxiliary Carry (AC), Overflow (OV), और Parity (P) फ़्लैग्स प्रभावित होते हैं।"
      }
    ]
  },
  {
    id: 2,
    title: "8-bit Multiplication and Division",
    aim: "To write and execute an 8051 assembly language program to multiply and divide two 8-bit unsigned integers using MUL AB and DIV AB.",
    components: ["8051 Kit / Simulator", "UART interface / Keil IDE"],
    theoryEn: "MUL AB multiplies the 8-bit unsigned values in registers A and B. The 16-bit result is placed with lower byte in A and upper byte in B. If product > FFH, Overflow flag OV is set. DIV AB divides A by B; quotient is placed in A, remainder in B. If B=0, OV is set indicating division by zero.",
    theoryHi: "MUL AB रजिस्टर A और B के मानों को गुणा करता है। परिणाम का निचला बाइट A में और ऊपरी बाइट B में आता है। DIV AB, A को B से भाग देता है; भागफल A में और शेषफल B में जाता है। B=0 होने पर OV फ़्लैग 1 हो जाता है।",
    circuitNotes: "On-chip registers A and B are used directly; execution takes 4 machine cycles (4 µs at 12 MHz).",
    algorithm: [
      "1. Load multiplicand into Accumulator A.",
      "2. Load multiplier into register B.",
      "3. Execute MUL AB.",
      "4. Store lower byte from A into RAM 40H and higher byte from B into RAM 41H.",
      "5. Load dividend into A and divisor into B.",
      "6. Execute DIV AB.",
      "7. Store quotient from A into RAM 42H and remainder from B into RAM 43H.",
      "8. End program."
    ],
    assemblyCode: `ORG 0000H
MOV A,#0AH    ; Multiplicand = 10 (0AH)
MOV B,#05H    ; Multiplier = 5 (05H)
MUL AB        ; Multiply: Product = 50 (32H) -> A=32H, B=00H
MOV 40H,A     ; Store low byte of product
MOV 41H,B     ; Store high byte of product

MOV A,#5FH    ; Dividend = 95 (5FH)
MOV B,#0AH    ; Divisor = 10 (0AH)
DIV AB        ; Divide: Quotient = 9 (09H) in A, Remainder = 5 (05H) in B
MOV 42H,A     ; Store quotient
MOV 43H,B     ; Store remainder
HERE: SJMP HERE ; Halt
END`,
    expectedResult: "Product RAM[40H]=32H, RAM[41H]=00H; Division Quotient RAM[42H]=09H, Remainder RAM[43H]=05H.",
    vivaQuestions: [
      {
        q: "How many machine cycles do MUL AB and DIV AB take?",
        aEn: "Both MUL AB and DIV AB require 4 machine cycles (48 oscillator clocks), making them the slowest arithmetic instructions in 8051.",
        aHi: "दोनों निर्देश 4 मशीन साइकिल लेते हैं जो 12 MHz पर 4 µs का समय होता है।"
      },
      {
        q: "What happens if you divide by zero in 8051?",
        aEn: "The overflow flag (OV) is set to 1, while the contents of A and B become undefined.",
        aHi: "Overflow flag (OV) 1 हो जाता है तथा A और B के मान अनिश्चित हो जाते हैं।"
      }
    ]
  },
  {
    id: 3,
    title: "Array Block Move in Internal RAM",
    aim: "To write an assembly program to transfer an array of N consecutive bytes from source internal RAM block to destination internal RAM block.",
    components: ["8051 Microcontroller Kit / Simulator"],
    theoryEn: "Indirect addressing via registers R0 and R1 allows dynamic block transfer without hardcoding addresses. R0 acts as the source pointer, R1 as the destination pointer, and R2 as the loop counter.",
    theoryHi: "रजिस्टर R0 और R1 इनडायरेक्ट एड्रेसिंग पॉइंटर्स की तरह कार्य करते हैं। R0 सोर्स और R1 डेस्टिनेशन एड्रेस को पॉइंट करता है, जबकि R2 लूप काउंटर बनता है।",
    circuitNotes: "Entirely executed inside on-chip scratchpad RAM (30H to 7FH).",
    algorithm: [
      "1. Load loop counter R2 with array length N.",
      "2. Load source start address into pointer R0.",
      "3. Load destination start address into pointer R1.",
      "4. Fetch byte from source RAM location using MOV A,@R0.",
      "5. Store byte into destination RAM location using MOV @R1,A.",
      "6. Increment both pointers (INC R0, INC R1).",
      "7. Decrement counter R2 and repeat loop until R2 reaches 0 (DJNZ R2,LOOP).",
      "8. Terminate."
    ],
    assemblyCode: `ORG 0000H
MOV R2,#05H   ; Array size = 5 bytes
MOV R0,#30H   ; Source address starting at 30H
MOV R1,#50H   ; Destination address starting at 50H

COPY_LOOP:
MOV A,@R0     ; Read byte from source RAM
MOV @R1,A     ; Write byte to destination RAM
INC R0        ; Point to next source address
INC R1        ; Point to next destination address
DJNZ R2,COPY_LOOP ; Repeat until 5 bytes transferred

HERE: SJMP HERE ; Halt
END`,
    expectedResult: "Five consecutive bytes stored from RAM 30H–34H are faithfully duplicated into RAM 50H–54H.",
    vivaQuestions: [
      {
        q: "Can R2 or R3 be used for internal RAM indirect addressing?",
        aEn: "No. Only R0 and R1 can be used for indirect addressing with internal RAM (@R0, @R1).",
        aHi: "नहीं, आंतरिक RAM इनडायरेक्ट एड्रेसिंग के लिए केवल R0 और R1 का उपयोग किया जा सकता है।"
      }
    ]
  },
  {
    id: 4,
    title: "Finding Largest and Smallest Number in an Array",
    aim: "To find the maximum and minimum numbers from an array of 8-bit unsigned integers stored in memory.",
    components: ["8051 Kit / Simulator"],
    theoryEn: "CJNE (Compare and Jump if Not Equal) compares two operands and sets the carry flag CY if the first operand is less than the second operand (A < direct). This allows branch decisions for finding max/min values.",
    theoryHi: "CJNE निर्देश दो मानों की तुलना करता है। यदि Accumulator का मान दूसरे ऑपरेंड से छोटा होता है तो Carry flag (CY) सेट हो जाता है।",
    circuitNotes: "Result is stored in dedicated RAM locations 60H (Largest) and 61H (Smallest).",
    algorithm: [
      "1. Load array length N-1 into counter R2.",
      "2. Set pointer R0 to start of array.",
      "3. Load first element into Accumulator as current maximum.",
      "4. Advance pointer, compare next element using CJNE.",
      "5. If next element > Accumulator, update Accumulator.",
      "6. Decrement counter and repeat until array is exhausted.",
      "7. Store largest value in RAM."
    ],
    assemblyCode: `ORG 0000H
MOV R2,#04H   ; Array length minus 1 (5 numbers)
MOV R0,#40H   ; Start address of array
MOV A,@R0     ; Assume first number is largest

FIND_MAX:
INC R0        ; Move to next element
MOV B,@R0     ; Read candidate into B
CJNE A,B,CHECK ; Compare A with B
SJMP NEXT_ELEM ; If equal, skip update

CHECK:
JNC NEXT_ELEM ; If CY=0, then A > B, keep A
MOV A,B       ; Else B > A, so update largest with B

NEXT_ELEM:
DJNZ R2,FIND_MAX ; Repeat for all elements
MOV 60H,A     ; Store largest number in RAM 60H
HERE: SJMP HERE ; Halt
END`,
    expectedResult: "Largest value among RAM 40H–44H is correctly identified and placed at RAM 60H.",
    vivaQuestions: [
      {
        q: "How does CJNE set the Carry flag?",
        aEn: "CJNE sets CY = 1 if the first operand is strictly less than the second operand (dest < src), otherwise CY = 0.",
        aHi: "CJNE तब Carry = 1 करता है जब पहला ऑपरेंड दूसरे ऑपरेंड से छोटा होता है।"
      }
    ]
  },
  {
    id: 5,
    title: "LED Flashing and Ring Counter on Port 1",
    aim: "To interface 8 discrete LEDs to Port 1 and generate sequential running light and blinking patterns with a software delay.",
    components: ["8051 Board", "8x LEDs", "8x 330Ω current-limiting resistors", "Jumper wires"],
    theoryEn: "8051 Port 1 pins have internal pull-up resistors and can source small currents or sink up to 10-15 mA. In common-anode LED configuration, writing 0 turns the LED ON. In common-cathode, writing 1 turns the LED ON with buffer driver.",
    theoryHi: "Port 1 के साथ 8 LEDs को 330Ω प्रतिरोधकों के माध्यम से जोड़ा जाता है। RL A निर्देश द्वारा बिट को रोटेट करके रनिंग लाइट पैटर्न तैयार किया जाता है।",
    circuitNotes: "P1.0 to P1.7 connected to LED anodes with cathodes through 330Ω resistors to Ground.",
    algorithm: [
      "1. Initialize Accumulator with 01H (single LED ON).",
      "2. Output Accumulator value to Port 1.",
      "3. Call software delay subroutine.",
      "4. Rotate Accumulator left by one bit using RL A.",
      "5. Repeat indefinitely."
    ],
    assemblyCode: `ORG 0000H
MOV A,#01H    ; Pattern: 00000001B (LED 0 ON)

MAIN_LOOP:
MOV P1,A      ; Output pattern to Port 1 LEDs
ACALL DELAY   ; Wait 200 ms
RL A          ; Rotate left: shift illuminated LED to next pin
SJMP MAIN_LOOP ; Infinite loop

DELAY:
MOV R3,#02H   ; Outer loop
D1: MOV R2,#0FFH ; Middle loop
D2: MOV R1,#0FFH ; Inner loop
D3: DJNZ R1,D3
DJNZ R2,D2
DJNZ R3,D1
RET           ; Return from subroutine
END`,
    expectedResult: "LEDs on Port 1 light up sequentially one by one from P1.0 to P1.7 in a smooth continuous running ring pattern.",
    vivaQuestions: [
      {
        q: "Why are current-limiting resistors (330Ω) mandatory with LEDs?",
        aEn: "Without resistors, LEDs draw excessive current, dropping port voltage and potentially burning the microcontroller's internal output transistors.",
        aHi: "बिना प्रतिरोधक के LED अत्यधिक करंट खींचती है जिससे माइक्रो-कंट्रोलर की पिन खराब हो सकती है।"
      }
    ]
  },
  {
    id: 6,
    title: "Square Wave Generation using Timer 0 in Mode 1",
    aim: "To generate a 2 kHz square wave with 50% duty cycle on Port 1.0 using Timer 0 in 16-bit timer mode.",
    components: ["8051 Board", "Digital Storage Oscilloscope (DSO)", "Probes", "12 MHz Crystal"],
    theoryEn: "At 12 MHz, machine cycle = 1 µs. A 2 kHz square wave has period T = 1/2000 = 500 µs. Half-period = 250 µs. We need 250 timer ticks. In Mode 1 (16-bit), initial count = 65536 - 250 = 65286 = FF06H.",
    theoryHi: "12 MHz क्रिस्टल पर 1 मशीन साइकिल 1 µs की होती है। 2 kHz वेव का आधा पीरियड 250 µs होता है। अतः टाइमर को 65536 - 250 = FF06H से लोड किया जाता है।",
    circuitNotes: "P1.0 pin connected directly to Channel 1 of DSO, GND connected to DSO probe ground alligator clip.",
    algorithm: [
      "1. Configure TMOD with 01H (Timer 0, 16-bit Mode 1).",
      "2. Load TH0 with high byte (FFH) and TL0 with low byte (06H).",
      "3. Invert pin P1.0 using CPL P1.0.",
      "4. Start Timer 0 using SETB TR0.",
      "5. Monitor TF0 flag until it rolls over to 1 (JNB TF0,$).",
      "6. Stop timer (CLR TR0), clear flag (CLR TF0).",
      "7. Repeat continuously."
    ],
    assemblyCode: `ORG 0000H
MOV TMOD,#01H ; Timer 0 in Mode 1 (16-bit timer)

AGAIN:
MOV TL0,#06H  ; Load low byte for 250 µs delay
MOV TH0,#0FFH ; Load high byte
CPL P1.0      ; Toggle output pin P1.0
SETB TR0      ; Start Timer 0

WAIT_OVF:
JNB TF0,WAIT_OVF ; Loop until Timer 0 overflows (TF0=1)
CLR TR0       ; Stop Timer 0
CLR TF0       ; Clear overflow flag
SJMP AGAIN    ; Repeat loop
END`,
    expectedResult: "Oscilloscope displays a stable 2.0 kHz square wave with 500 µs period and 5.0V peak-to-peak amplitude.",
    vivaQuestions: [
      {
        q: "What is the maximum delay possible with Timer 0 in Mode 1 at 12 MHz?",
        aEn: "Max count = 65,536 ticks × 1 µs = 65,536 µs ≈ 65.536 milliseconds for a single overflow.",
        aHi: "एक बार में अधिकतम लगभग 65.536 मिली-सेकंड की देरी प्राप्त की जा सकती है।"
      }
    ]
  },
  {
    id: 7,
    title: "Full-Duplex UART Serial Communication at 9600 Baud",
    aim: "To initialize the 8051 serial port in Mode 1 (8-bit UART) and continuously transmit the ASCII character string '8051 MASTERCLASS' at 9600 baud using 11.0592 MHz crystal.",
    components: ["8051 Kit", "MAX232 Level Converter / FT232 USB-UART Cable", "PC Serial Terminal (PuTTY / RealTerm)"],
    theoryEn: "Serial Mode 1 uses Timer 1 in Mode 2 (8-bit auto-reload). For 11.0592 MHz crystal, machine cycle = 12 / 11.0592 MHz = 1.085 µs. Timer 1 reload value TH1 = 256 - (11059200 / (12 × 32 × 9600)) = 256 - 3 = 253 = FDH. SCON is set to 50H (Mode 1, REN=1).",
    theoryHi: "11.0592 MHz क्रिस्टल पर 9600 बॉड रेट के लिए Timer 1 Mode 2 (Auto-reload) में TH1 को FDH से लोड किया जाता है। SCON=50H से 8-बिट UART और रिसीविंग सक्षम होती है।",
    circuitNotes: "P3.1 (TXD) connected to MAX232 T1IN, MAX232 T1OUT connected to PC RXD; GND pins connected together.",
    algorithm: [
      "1. Set TMOD = 20H (Timer 1, Mode 2 auto-reload).",
      "2. Load TH1 with FDH for 9600 baud.",
      "3. Set SCON = 50H (8-bit UART, enable receiver REN).",
      "4. Start Timer 1 with SETB TR1.",
      "5. Point DPTR to string lookup table.",
      "6. Load character into Accumulator, send via MOV SBUF,A.",
      "7. Wait until TI flag is set, clear TI flag.",
      "8. Repeat for full string."
    ],
    assemblyCode: `ORG 0000H
MOV TMOD,#20H ; Timer 1, Mode 2 (8-bit auto-reload)
MOV TH1,#0FDH ; 9600 baud reload value for 11.0592 MHz
MOV SCON,#50H ; Mode 1, 8-bit UART, REN enabled
SETB TR1      ; Start Timer 1

SEND_STRING:
MOV DPTR,#MSG ; Base address of string message
LOOP:
CLR A
MOVC A,@A+DPTR ; Fetch character from code ROM
JZ RESTART    ; If null terminator (00H), restart message
MOV SBUF,A    ; Transmit character
WAIT_TX:
JNB TI,WAIT_TX ; Wait until transmission completes
CLR TI        ; Clear transmit interrupt flag
INC DPTR      ; Advance to next character
SJMP LOOP

RESTART:
ACALL DELAY   ; Brief pause between repetitions
SJMP SEND_STRING

DELAY:
MOV R7,#05H
DLY: MOV R6,#0FFH
DLY2: MOV R5,#0FFH
DLY3: DJNZ R5,DLY3
DJNZ R6,DLY2
DJNZ R7,DLY
RET

MSG:
DB "8051 MASTERCLASS - ITV-304", 0DH, 0AH, 00H
END`,
    expectedResult: "PC Serial Terminal receives and prints '8051 MASTERCLASS - ITV-304' with newline at 9600 baud (8-N-1).",
    vivaQuestions: [
      {
        q: "Why is 11.0592 MHz crystal preferred over 12 MHz for serial communication?",
        aEn: "11.0592 MHz divides evenly into standard UART baud rates (9600, 4800, 19200, 1200) with 0% error, whereas 12 MHz introduces an approximate 7% baud error leading to garbled data.",
        aHi: "क्योंकि 11.0592 MHz सभी मानक बॉड रेट्स पर 0% एरर देता है, जबकि 12 MHz पर डेटा करप्ट हो सकता है।"
      }
    ]
  },
  {
    id: 8,
    title: "External Hardware Interrupt (INT0) Service Routine",
    aim: "To demonstrate edge-triggered External Interrupt 0 (INT0) on pin P3.2 that inverts an LED state on Port 1 upon push-button press.",
    components: ["8051 Board", "Push button switch", "10kΩ pull-up resistor", "LED on P1.0"],
    theoryEn: "External interrupt 0 is located at vector address 0003H in code ROM. When configured as edge-triggered (IT0=1 in TCON), a falling edge (HIGH to LOW transition) at pin P3.2 latches IE0 flag and calls the ISR at 0003H. The ISR must conclude with RETI.",
    theoryHi: "एक्सटर्नल इंटरप्ट 0 का वेक्टर एड्रेस 0003H होता है। जब TCON में IT0=1 होता है तो यह नेगेटिव एज-ट्रिगर्ड बन जाता है। बटन दबाने पर P3.2 लो होता है और ISR ट्रिगर होकर LED की स्थिति बदल देता है।",
    circuitNotes: "P3.2 pulled high to +5V through 10kΩ resistor, momentary push button connects P3.2 to Ground.",
    algorithm: [
      "1. Set up interrupt vector table at 0003H with LJMP ISR_INT0.",
      "2. Set IT0 bit in TCON (SETB IT0) for falling-edge trigger.",
      "3. Enable External Interrupt 0 and global interrupts (SETB EX0, SETB EA).",
      "4. Main program executes background task in infinite loop.",
      "5. When button is pressed, CPU jumps to ISR_INT0.",
      "6. In ISR, toggle LED pin P1.0 (CPL P1.0) and return with RETI."
    ],
    assemblyCode: `ORG 0000H
LJMP MAIN     ; Reset vector branches over interrupt table

ORG 0003H     ; Interrupt Vector Address for INT0
LJMP ISR_INT0 ; Branch to Interrupt Service Routine

ORG 0030H     ; Main program start
MAIN:
SETB IT0      ; Configure INT0 for falling-edge trigger
SETB EX0      ; Enable External Interrupt 0 in IE register
SETB EA       ; Enable Global Interrupts (EA=1)
CLR P1.0      ; Turn OFF LED initially

IDLE_LOOP:
SJMP IDLE_LOOP ; Main background program doing idle work

; Interrupt Service Routine:
ISR_INT0:
CPL P1.0      ; Toggle LED on Port 1.0
RETI          ; Return from Interrupt and restore priority logic
END`,
    expectedResult: "Every time the push button connected to P3.2 is pressed, the LED connected to P1.0 immediately toggles state (ON/OFF).",
    vivaQuestions: [
      {
        q: "What is the difference between IT0 = 0 and IT0 = 1 in TCON?",
        aEn: "IT0 = 0 makes INT0 low-level triggered (active as long as pin remains LOW); IT0 = 1 makes INT0 falling-edge triggered (active only on HIGH-to-LOW transition).",
        aHi: "IT0=0 लेवल-ट्रिगर्ड है जबकि IT0=1 फॉलिंग-एज ट्रिगर्ड है।"
      }
    ]
  },
  {
    id: 9,
    title: "4×4 Matrix Keypad Scanning Interface",
    aim: "To interface a 4×4 hexadecimal matrix keypad to Port 1 and read pressed keys using the row-scanning technique.",
    components: ["8051 Kit", "4×4 matrix keypad module", "4x 10kΩ pull-up resistors", "Seven-segment display or LEDs"],
    theoryEn: "A 4×4 matrix keypad connects 16 switches in 4 rows (P1.0–P1.3) and 4 columns (P1.4–P1.7). The rows are driven LOW one at a time while reading the columns. If a switch in that row is closed, the corresponding column reads LOW (0V). Software debouncing verifies contact stability.",
    theoryHi: "4x4 कीपैड में 4 रो और 4 कॉलम होते हैं। एक समय में एक रो को 0 (LOW) किया जाता है और कॉलम की स्थिति जांची जाती है। यदि कोई बटन दबा है तो वह कॉलम 0 पढ़ा जाएगा।",
    circuitNotes: "P1.0–P1.3 output to rows; P1.4–P1.7 input from columns with 10kΩ pull-ups to +5V.",
    algorithm: [
      "1. Ground all rows and check if any key is pressed by reading columns.",
      "2. When key press detected, call 20 ms debounce delay.",
      "3. Drive Row 0 LOW (FEH), read columns. If key found, determine column code.",
      "4. If not found, repeat for Row 1 (FDH), Row 2 (FBH), Row 3 (F7H).",
      "5. Convert row-column position into hex key value (0–F) using lookup table.",
      "6. Output hex value to Port 2."
    ],
    assemblyCode: `ORG 0000H
KEY_SCAN:
MOV P1,#0F0H  ; Make rows output (0) and columns input (1)
MOV A,P1
ANL A,#0F0H   ; Mask out lower row bits
CJNE A,#0F0H,KEY_SCAN ; Wait until all keys released

CHECK_PRESS:
MOV A,P1
ANL A,#0F0H
CJNE A,#0F0H,DEBOUNCE ; Key pressed if any column reads 0
SJMP CHECK_PRESS

DEBOUNCE:
ACALL DELAY_20MS ; Wait 20 ms contact bounce
MOV A,P1
ANL A,#0F0H
CJNE A,#0F0H,IDENTIFY ; Key still held down
SJMP CHECK_PRESS

IDENTIFY:
; Scan Row 0 (P1.0 = 0)
MOV P1,#0FEH
MOV A,P1
ANL A,#0F0H
CJNE A,#0F0H,ROW_0

; Scan Row 1 (P1.1 = 0)
MOV P1,#0FDH
MOV A,P1
ANL A,#0F0H
CJNE A,#0F0H,ROW_1
SJMP KEY_SCAN

ROW_0:
MOV P2,#00H   ; Output key 0
SJMP KEY_SCAN
ROW_1:
MOV P2,#04H   ; Output key 4
SJMP KEY_SCAN

DELAY_20MS:
MOV R4,#30
D_20: MOV R5,#200
DJNZ R5,$
DJNZ R4,D_20
RET
END`,
    expectedResult: "Pressing keys on the keypad reliably registers the corresponding hex digit on Port 2 with zero contact bounce chatter.",
    vivaQuestions: [
      {
        q: "Why is switch debouncing needed for mechanical keypads?",
        aEn: "Mechanical switch contacts physically bounce for 5 to 20 ms upon closing, generating false multiple triggers unless delayed by software or filtered by RC circuits.",
        aHi: "मैकेनिकल स्विच दबने पर 5 से 20 ms तक कांपते हैं जिससे कई बार गलत ट्रिगर हो सकता है, इसलिए डिबाउंसिंग आवश्यक है।"
      }
    ]
  },
  {
    id: 10,
    title: "Seven-Segment Display Multiplexing Interface",
    aim: "To interface a two-digit common-cathode seven-segment display and display a 00–99 counter using multiplexing.",
    components: ["8051 Board", "2-digit 7-segment display", "2x NPN transistors (BC547)", "7x 330Ω resistors"],
    theoryEn: "Multiplexing displays digits sequentially at a rapid rate (> 50 Hz). Due to persistence of vision (POV), human eyes perceive both displays as continuously illuminated while saving I/O pins.",
    theoryHi: "मल्टीप्लेक्सिंग में दोनों डिजिट्स को तेजी से (50 Hz से अधिक) बारी-बारी से जलाया जाता है। आँखों की दृष्टि-धारणा (POV) के कारण दोनों अंक एक साथ लगातार जलते दिखाई देते हैं।",
    circuitNotes: "Segment lines a–g shared on P2.0–P2.6. Digit 1 common cathode enabled by transistor on P1.0, Digit 2 enabled by P1.1.",
    algorithm: [
      "1. Separate counter value into tens digit and units digit.",
      "2. Fetch segment pattern for units digit from lookup table.",
      "3. Output units pattern to Port 2 and activate Digit 1 transistor (P1.0 = 1).",
      "4. Delay for 5 ms.",
      "5. Deactivate Digit 1 transistor.",
      "6. Fetch segment pattern for tens digit, output to Port 2 and activate Digit 2 transistor (P1.1 = 1).",
      "7. Delay for 5 ms, deactivate and repeat."
    ],
    assemblyCode: `ORG 0000H
MOV DPTR,#LUT ; Base address of 7-segment codes

DISPLAY_REFRESH:
; Display Units Digit (e.g. 5)
MOV A,#05H
MOVC A,@A+DPTR ; Fetch pattern
MOV P2,A      ; Put pattern on segment bus
SETB P1.0     ; Enable Digit 1 cathode
ACALL DELAY_5MS
CLR P1.0      ; Turn off Digit 1

; Display Tens Digit (e.g. 2)
MOV A,#02H
MOVC A,@A+DPTR ; Fetch pattern
MOV P2,A
SETB P1.1     ; Enable Digit 2 cathode
ACALL DELAY_5MS
CLR P1.1      ; Turn off Digit 2

SJMP DISPLAY_REFRESH

DELAY_5MS:
MOV R6,#10
D5: MOV R7,#250
DJNZ R7,$
DJNZ R6,D5
RET

LUT:
DB 3FH, 06H, 5BH, 4FH, 66H, 6DH, 7DH, 07H, 7FH, 6FH
END`,
    expectedResult: "Display shows stable non-flickering two-digit numeral '25' using only 9 microcontroller I/O pins.",
    vivaQuestions: [
      {
        q: "What minimum refresh frequency is required to prevent noticeable display flicker?",
        aEn: "At least 50 Hz (refreshing each digit every 20 milliseconds or faster).",
        aHi: "कम से कम 50 Hz (प्रत्येक डिजिट को हर 20 मिलीसेकंड में रीफ्रेश करना)।"
      }
    ]
  }
];

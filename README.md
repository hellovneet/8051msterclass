# 8051 MASTERCLASS

**A practical learning space for ITV-304 Microcontrollers (8051)**  
Created by **Vineet Sharma** · English + हिंदी · © 2026 Vineet Sharma. All rights reserved.

Learning a microcontroller can feel abstract when it is only explained in paragraphs. This project is meant to make the 8051 easier to understand by bringing lessons, diagrams, code examples, practice tools and revision material into one place.

The site is built for B.Voc / undergraduate learners following the five-unit ITV-304 syllabus. It is designed to work as a study companion: read a concept, look at how it works, try a small program, and test what you remember.

## What you can explore

- **Five-unit syllabus area** with topic-by-topic learning content in English and Hindi.
- **Learning workspace** for moving between topics, marking lessons complete and bookmarking topics.
- **8051 assembly simulator** with a supported instruction set, register views, internal RAM display and UART output.
- **Circuit learning area** with visual demonstrations for selected input/output and interfacing concepts.
- **Timer and baud-rate helper** for working through common 8051 calculations.
- **Practical lab manual** with experiment-oriented material and viva practice.
- **Exam practice** with short- and long-answer prompts, MCQs and revision material.
- **Flashcards and assembly examples** for active recall and hands-on practice.

> **A note about the simulator:** it is an educational software model, not a physical 8051 chip or a complete replacement for hardware testing. Check the simulator's supported instruction list before relying on it for a program. Hardware timing and peripheral behaviour can vary between original 8051 parts and modern derivatives.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## Run it on your computer

### Requirements

- Node.js 18 or newer (Node.js 20 LTS is a good choice)
- npm

### 1. Get the project

```bash
git clone https://github.com/hellovneet/8051msterclass.git
cd 8051msterclass
```

If you downloaded the ZIP instead, extract it and open a terminal in the project folder.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite. The project currently uses port `3000`.

### 4. Create a production build

```bash
npm run build
```

Vite writes the deployable website to the `dist/` folder.

To preview that production build locally:

```bash
npm run preview
```

## Deploy on Vercel

This project uses Vite and produces a static site, so it can be deployed directly on Vercel.

1. Push the project to a GitHub repository.
2. Open [Vercel](https://vercel.com/new) and import that repository.
3. Vercel should detect **Vite**. If it asks for settings, use:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Install Command | `npm install` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Root Directory | `.` |

4. Select **Deploy**.

A `vercel.json` file is included so direct navigation and refreshes resolve to the app entry point. No server-side environment variables are required for the current client-side version.

### Deploy from the Vercel CLI (optional)

```bash
npm install
npm run build
npx vercel
```

For a production deployment:

```bash
npx vercel --prod
```

## GitHub checks

A GitHub Actions workflow is included at `.github/workflows/ci.yml`. It installs dependencies and runs the production build on pushes and pull requests, helping catch TypeScript or build errors before merging.

## Project layout

```text
.
├── public/
│   └── assets/                 # Static learning resources
├── src/
│   ├── components/              # Page sections and learning tools
│   ├── data/                    # Unit content, questions, programs and labs
│   ├── simulator/               # 8051 educational emulator
│   ├── utils/                   # Calculators and helpers
│   ├── App.tsx                  # Main application
│   ├── index.css                # Global styles
│   └── main.tsx                 # React entry point
├── index.html
├── package.json
├── vercel.json
└── README.md
```

## Learning progress and privacy

The current app stores selected preferences, completed topics, bookmarks and quiz score in the browser's `localStorage`. That means progress stays in the same browser on the same device; it is not currently synced to an online account or shared between devices.

## Content and technical accuracy

The lessons are intended as a study aid, not a substitute for your prescribed textbook, lab instructions or instructor's guidance. The classic 8051 family has many derivatives, and details such as oscillator timing, memory size and peripheral behaviour may differ. Where a calculation or example depends on a particular clock frequency or device variant, check the stated assumptions.

The project includes syllabus-oriented content and additional practice tools. Please verify any exam-specific requirements against the latest official ITV-304 syllabus and notices from your institution.

## Contributing / improving the project

If you are improving the site:

1. Create a branch for your change.
2. Keep lesson content separate from UI components where practical.
3. Preserve the English + Hindi learning experience.
4. Run `npm run build` before opening a pull request.
5. Mention which syllabus topics or features changed in your PR.

## Author

**Vineet Sharma**  
Project: **8051 MASTERCLASS**  
Subject: **ITV-304 — Microcontrollers (8051)**

---

© 2026 Vineet Sharma. All rights reserved.

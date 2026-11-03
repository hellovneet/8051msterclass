import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#040608]/80 backdrop-blur-2xl py-12 px-4 text-center text-xs text-[#808c9f] space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="text-base font-black tracking-wider text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
          8051 MASTERCLASS
        </div>
        <p className="text-xs text-[#a0aec0]">
          Complete Microcontroller Learning Platform · ITV-304 B.Voc IoT Curriculum
        </p>
        <p className="text-xs text-neutral-200 font-semibold">
          Designed & Developed by Vineet Sharma
        </p>
        <div className="pt-2 text-[11px] text-[#606d80]">
          © 2026 Vineet Sharma. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

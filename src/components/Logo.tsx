import React from 'react';

export default function CCILogo({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center bg-[#2A41E8] rounded-full px-5 py-2.5 gap-3 h-14 ${className}`}>
      {/* Icon portion */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/30" />
        <div className="absolute inset-0 rounded-full border-[3px] border-white border-r-transparent border-b-transparent -rotate-45" />
        <div className="absolute inset-[6px] rounded-full border-[3px] border-white/60" />
        <div className="absolute w-2 h-4 bg-white/10 right-0 top-1/2 -translate-y-1/2 rotate-12" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#2A41E8] rounded-bl-full" />
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute" />
      </div>
      
      {/* Text portion */}
      <div className="flex flex-col text-white font-black leading-[1.1] text-[11px] tracking-tight uppercase">
        <span>Chambre de Commerce</span>
        <span>Et d'Industrie</span>
      </div>
    </div>
  );
}

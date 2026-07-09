import React from 'react';

interface MapViewCalloutProps {
  setCurrentScreen: (screen: 'izlash' | 'xarita' | 'kabinet' | 'saqlanganlar') => void;
}

export const MapViewCallout: React.FC<MapViewCalloutProps> = ({ setCurrentScreen }) => {
  return (
    <div className="md:col-span-2 lg:col-span-3 bg-brand-surface-low rounded-2xl border border-brand-outline-variant overflow-hidden flex flex-col md:flex-row items-center relative mt-4 shadow-xs">
      <div className="p-6 md:w-1/2 flex flex-col gap-3 z-10">
        <h3 className="font-display text-lg font-bold text-brand-text">O'zingizga yaqin ishlarni xaritadan izlang</h3>
        <p className="text-xs text-brand-text-variant leading-relaxed">
          Lokatsiya bo'yicha qidiruv orqali uyingizga eng yaqin ish joylarini toping va yo'lga ketadigan vaqtni tejang.
        </p>
        <button
          onClick={() => setCurrentScreen('xarita')}
          className="bg-brand-primary text-white font-semibold text-xs py-2.5 px-6 rounded-full w-fit hover:bg-brand-primary-container transition-colors mt-2 cursor-pointer shadow-xs"
        >
          Xaritani ochish
        </button>
      </div>
      <div className="md:w-1/2 h-40 md:h-full w-full relative overflow-hidden flex items-center justify-center">
        {/* Styled Map Illustration */}
        <div className="absolute inset-0 bg-sky-50 opacity-90" />
        <svg viewBox="0 0 400 200" className="w-full h-full object-cover relative z-0 opacity-80">
          <path d="M 0 50 Q 150 150 400 30" fill="none" stroke="#cbd5e1" strokeWidth="12" />
          <path d="M 50 0 Q 200 200 350 200" fill="none" stroke="#cbd5e1" strokeWidth="10" />
          <path d="M 0 150 C 100 80 300 120 400 180" fill="none" stroke="#cbd5e1" strokeWidth="8" />
          <circle cx="120" cy="90" r="14" fill="#000666" fillOpacity="0.2" />
          <circle cx="120" cy="90" r="6" fill="#000666" />
          <circle cx="280" cy="60" r="16" fill="#000666" fillOpacity="0.2" />
          <circle cx="280" cy="60" r="7" fill="#000666" />
          <circle cx="180" cy="140" r="12" fill="#000666" fillOpacity="0.2" />
          <circle cx="180" cy="140" r="5" fill="#000666" />
        </svg>
        <div className="absolute inset-0 bg-linear-to-r from-brand-surface-low/100 via-brand-surface-low/40 to-transparent pointer-events-none md:block hidden" />
      </div>
    </div>
  );
};

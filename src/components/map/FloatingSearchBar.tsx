import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface FloatingSearchBarProps {
  setShowRegionSelector: (show: boolean) => void;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  setShowRegionSelector,
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto">
      <div 
        onClick={() => setShowRegionSelector(true)}
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-brand-surface-low transition-all cursor-pointer active:scale-98"
      >
        <Search className="text-brand-outline" size={18} />
        <span className="text-xs text-brand-text font-semibold select-none">
          Viloyat, shahar yoki tuman...
        </span>
        <MapPin className="text-brand-primary ml-auto" size={18} />
      </div>
    </div>
  );
};

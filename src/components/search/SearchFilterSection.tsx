import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  setShowRegionSelector: (show: boolean) => void;
}

export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  filterLocation,
  setFilterLocation,
  filterType,
  setFilterType,
  setShowRegionSelector,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftBlur(container.scrollLeft > 10);
      setShowRightBlur(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();

      const observer = new ResizeObserver(() => {
        handleScroll();
      });
      observer.observe(container);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      if (filterLocation === 'Barchasi') {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const activeElement = activeRef.current;
        if (activeElement) {
          const containerWidth = container.clientWidth;
          const elementOffsetLeft = activeElement.offsetLeft;
          const elementWidth = activeElement.clientWidth;

          const scrollPosition = elementOffsetLeft - (containerWidth / 2) + (elementWidth / 2);
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [filterLocation]);

  return (
    <section className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" size={20} />
        <input
          type="text"
          className="w-full bg-brand-surface-low border border-brand-outline-variant text-brand-text font-sans rounded-full py-3 pl-12 pr-4 focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-brand-outline text-sm"
          placeholder="Kasb, kompaniya yoki kalit so'z..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="relative w-full">
        {/* Left blur fade */}
        <div className={`absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeftBlur ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Right blur fade */}
        <div className={`absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRightBlur ? 'opacity-100' : 'opacity-0'}`} />

        <div ref={scrollContainerRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full flex-nowrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-3.5 py-1.5 rounded-full hover:bg-brand-surface-low transition-colors whitespace-nowrap text-xs font-semibold cursor-pointer shrink-0 ${
              showFilters ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-brand-outline-variant text-brand-text-variant'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtrlar
          </button>

          {Array.from(new Set(['Barchasi', 'Yunusobod', 'Chilonzor', 'Bektemir', filterLocation])).map(loc => (
            <button
              key={loc}
              ref={filterLocation === loc ? activeRef : null}
              onClick={() => setFilterLocation(loc)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterLocation === loc
                  ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                  : 'bg-white border-brand-outline-variant text-brand-text-variant hover:bg-brand-surface-low'
              }`}
            >
              {loc === 'Barchasi' ? 'Barcha hududlar' : loc}
            </button>
          ))}

          <button
            onClick={() => setShowRegionSelector(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-outline-variant bg-white text-brand-text-variant hover:bg-brand-surface-low text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <MapPin size={12} className="text-brand-primary" />
            <span>Boshqa hududlar...</span>
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-outline-variant pt-3 flex flex-col gap-3"
          >
            <div>
              <p className="text-xs font-bold text-brand-text mb-2">Ish grafigi</p>
              <div className="flex flex-wrap gap-1">
                {['Barchasi', 'To\'liq bandlik', 'Smenali grafik', 'Erkin grafik'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      filterType === type
                        ? 'bg-brand-secondary text-white border-brand-secondary'
                        : 'bg-brand-surface-low border-brand-outline-variant text-brand-text-variant hover:bg-brand-surface-lowest'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-brand-surface-low">
              <button
                onClick={() => {
                  setFilterLocation('Barchasi');
                  setFilterType('Barchasi');
                  setSearchTerm('');
                }}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Filtrlarni tozalash
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tayyor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

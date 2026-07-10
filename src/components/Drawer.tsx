import React from 'react';
import { useApp } from '../context/AppContext';
import { X, User, ClipboardList, Settings, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';

interface DrawerProps {
  onOpenModal: (type: 'profile' | 'settings' | 'help') => void;
}

export const Drawer: React.FC<DrawerProps> = ({ onOpenModal }) => {
  const { drawerOpen, setDrawerOpen, currentScreen, setCurrentScreen, setActiveCalendarFilter } = useApp();

  if (!drawerOpen) return null;

  const handleMeningArizalarim = () => {
    setCurrentScreen('kalendar');
    setActiveCalendarFilter('applied');
    setDrawerOpen(false);
  };

  const handleModalOpen = (type: 'profile' | 'settings' | 'help') => {
    setDrawerOpen(false);
    onOpenModal(type);
  };

  return (
    <aside className="fixed inset-0 z-[5000] md:hidden">
      {/* Overlay backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer content */}
      <nav className="relative w-64 h-full bg-white p-5 flex flex-col gap-6 shadow-2xl transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-brand-outline-variant pb-4">
          <Logo sizeClassName="text-[18px]" />
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 rounded-full hover:bg-brand-surface-low text-brand-text-variant hover:text-brand-text cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* 1. Profil */}
          <button
            onClick={() => handleModalOpen('profile')}
            className="flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text"
          >
            <User size={18} className="text-slate-500" />
            <span>Profil</span>
          </button>

          {/* 2. Mening arizalarim */}
          <button
            onClick={handleMeningArizalarim}
            className={`flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer ${
              currentScreen === 'kalendar'
                ? 'bg-brand-surface-low text-brand-primary font-bold'
                : 'text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text'
            }`}
          >
            <ClipboardList size={18} />
            <span>Mening arizalarim</span>
          </button>

          {/* 3. Sozlamalar */}
          <button
            onClick={() => handleModalOpen('settings')}
            className="flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text"
          >
            <Settings size={18} className="text-slate-500" />
            <span>Sozlamalar</span>
          </button>

          {/* 4. Yordam */}
          <button
            onClick={() => handleModalOpen('help')}
            className="flex items-center gap-4 p-3 rounded-xl font-medium text-sm text-left transition-colors cursor-pointer text-brand-text-variant hover:bg-brand-surface-low hover:text-brand-text"
          >
            <HelpCircle size={18} className="text-slate-500" />
            <span>Yordam</span>
          </button>
        </div>

        <div className="mt-auto border-t border-brand-outline-variant pt-4 text-center">
          <p className="text-xs text-brand-text-variant opacity-60">Baito Uzbekistan v1.0.0</p>
        </div>
      </nav>
    </aside>
  );
};

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Drawer } from './components/Drawer';
import { JobSearchScreen } from './components/JobSearchScreen';
import { MapViewScreen } from './components/MapViewScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ChatScreen } from './components/ChatScreen';
import { RegionSelector } from './components/RegionSelector';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const { currentScreen, toastMessage } = useApp();
  const [hasOpenedMap, setHasOpenedMap] = useState(false);

  useEffect(() => {
    if (currentScreen === 'xarita') {
      setHasOpenedMap(true);
    }
  }, [currentScreen]);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'kalendar':
        return <CalendarScreen />;
      case 'xabarlar':
        return <MessagesScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'qidiruv':
      default:
        return <JobSearchScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text antialiased font-sans selection:bg-brand-primary-container selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[999] bg-rose-500 text-white px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(225,29,72,0.3)] flex items-center gap-3 w-[90%] max-w-sm"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[13px] font-medium leading-tight">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Header */}
      <Header />

      {/* Sidebar Drawer Menu for Mobile view */}
      <Drawer />

      {/* Main Content Layout */}
      <main className={`flex-1 w-full ${currentScreen === 'xarita' ? 'max-w-none px-0 md:px-0' : 'max-w-7xl mx-auto px-4 md:px-6'}`}>
        {currentScreen !== 'xarita' && renderActiveScreen()}
        
        {/* Persistently mounted map to avoid Leaflet re-initialization overhead */}
        {hasOpenedMap && (
          <div className={currentScreen === 'xarita' ? 'block' : 'hidden'}>
            <MapViewScreen />
          </div>
        )}
      </main>

      {/* Bottom Nav Bar (Mobile view only) */}
      <BottomNav />

      {/* Region selector full screen overlay */}
      <RegionSelector />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

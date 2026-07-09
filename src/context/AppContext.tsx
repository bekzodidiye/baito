import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Chat, Message } from '../types';
import { initialJobs, initialChats } from '../mockData';

export type ScreenType = 'kalendar' | 'qidiruv' | 'xabarlar' | 'xarita' | 'chat';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: 'yangilari' | 'maosh';
  setSortBy: (sort: 'yangilari' | 'maosh') => void;
  applyToJob: (jobId: string) => void;
  toggleBookmark: (jobId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  addNewMessage: (chatId: string, sender: 'user' | 'recruiter', text: string, hasMap?: boolean, mapLocation?: string) => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
  activeCalendarFilter: 'all' | 'applied' | 'confirmed' | 'todo' | 'completed';
  setActiveCalendarFilter: (filter: 'all' | 'applied' | 'confirmed' | 'todo' | 'completed') => void;
  activeCalendarDay: string; // YYYY-MM-DD format
  setActiveCalendarDay: (day: string) => void;
  showRegionSelector: boolean;
  setShowRegionSelector: (show: boolean) => void;
  mapFocusedJobId: string | null;
  setMapFocusedJobId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('xarita');
  const [jobs, setJobs] = useState<Job[]>(() => {
    const cached = localStorage.getItem('projob_jobs');
    if (cached) {
      const parsed = JSON.parse(cached);
      const containsOldData = parsed.some((j: any) => j.title === 'Katta Buxgalter' || j.title === 'Sotuv bo\'yicha menejer' || j.company === '"Artel Electronics" MChJ');
      if (parsed.length === initialJobs.length && !containsOldData) {
        return parsed;
      }
    }
    localStorage.setItem('projob_jobs', JSON.stringify(initialJobs));
    return initialJobs;
  });
  const [chats, setChats] = useState<Chat[]>(() => {
    const cached = localStorage.getItem('projob_chats');
    return cached ? JSON.parse(cached) : initialChats;
  });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('Barchasi');
  const [filterType, setFilterType] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'yangilari' | 'maosh'>('yangilari');
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [mapFocusedJobId, setMapFocusedJobId] = useState<string | null>(null);

  // Calendar State
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(1);
  const [activeCalendarFilter, setActiveCalendarFilter] = useState<'all' | 'applied' | 'confirmed' | 'todo' | 'completed'>('all');
  const [activeCalendarDay, setActiveCalendarDay] = useState('2026-06-12'); // Mocking June 12, 2026 as active/today

  useEffect(() => {
    localStorage.setItem('projob_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('projob_chats', JSON.stringify(chats));
  }, [chats]);

  const toggleBookmark = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, bookmarked: !job.bookmarked } : job
      )
    );
  };

  const applyToJob = (jobId: string) => {
    // Apply status and calendar event update
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, applied: true, status: 'applied' } : job
      )
    );

    // Dynamic message creation
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      // Find if chat exists, if not create it
      const existingChat = chats.find(c => c.companyName.toLowerCase().includes(job.company.toLowerCase()) || job.company.toLowerCase().includes(c.companyName.toLowerCase()));
      
      const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: Math.random().toString(),
        sender: 'user',
        text: `Assalomu alaykum! Men sizning "${job.title}" ishingizga ariza topshirdim. Mening rezyumem bilan tanishishingizni so'rayman.`,
        time: timeNow
      };

      if (existingChat) {
        setChats(prevChats =>
          prevChats.map(c =>
            c.id === existingChat.id
              ? {
                  ...c,
                  messages: [...c.messages, newMsg],
                  lastMessageTime: timeNow,
                }
              : c
          )
        );
      } else {
        const newChatId = 'c_' + Date.now();
        const newChat: Chat = {
          id: newChatId,
          companyName: job.company.replace(/"/g, ''),
          logoUrl: job.logoUrl,
          recruiterName: 'Mas\'ul xodim',
          recruiterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          online: true,
          unreadCount: 0,
          lastMessageTime: timeNow,
          messages: [newMsg]
        };
        setChats(prevChats => [newChat, ...prevChats]);
      }
    }
  };

  const addNewMessage = (chatId: string, sender: 'user' | 'recruiter', text: string, hasMap?: boolean, mapLocation?: string) => {
    const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Math.random().toString(),
      sender,
      text,
      time: timeNow,
      hasMap,
      mapLocation
    };

    setChats(prevChats =>
      prevChats.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessageTime: timeNow,
            unreadCount: sender === 'recruiter' && selectedChatId !== chatId ? c.unreadCount + 1 : c.unreadCount
          };
        }
        return c;
      })
    );
  };

  const sendMessage = (chatId: string, text: string) => {
    addNewMessage(chatId, 'user', text);

    // Recruiters reply sequence
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setTimeout(() => {
        let reply = 'Tushunarli. Siz bilan tez orada bog\'lanamiz.';
        let hasMap = false;
        let mapLocation = '';

        const txt = text.toLowerCase();
        if (txt.includes('salom') || txt.includes('assalom')) {
          reply = `Assalomu alaykum! Xabaringiz uchun rahmat. Men sizga qanday yordam bera olaman?`;
        } else if (txt.includes('maosh') || txt.includes('oylik') || txt.includes('pul')) {
          reply = `Bizning kompaniyamizda maosh suhbat natijalariga ko'ra belgilanadi va o'z vaqtida plastik kartaga o'tkazib beriladi. Bizda bonuslar ham mavjud!`;
        } else if (txt.includes('manzil') || txt.includes('qayerda') || txt.includes('joylashgan')) {
          reply = `Bizning ofisimiz xaritada ko'rsatilgan. Dushanba kuni soat 10:00 da kutamiz.`;
          hasMap = true;
          mapLocation = 'Tashkent, O\'zbekiston';
        } else if (txt.includes('rahmat') || txt.includes('yaxshi') || txt.includes('ok')) {
          reply = `Sizga ham rahmat! Suhbatda ko'rishguncha xayr.`;
        } else if (txt.includes('diplom') || txt.includes('sertifikat') || txt.includes('hujjat')) {
          reply = `Rahmat! Hujjatlarni qabul qildik, biz ularni tahlil qilib, tez orada javobini aytamiz.`;
        }

        addNewMessage(chatId, 'recruiter', reply, hasMap, mapLocation);
      }, 2500);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        jobs,
        setJobs,
        chats,
        setChats,
        selectedChatId,
        setSelectedChatId,
        drawerOpen,
        setDrawerOpen,
        searchTerm,
        setSearchTerm,
        filterLocation,
        setFilterLocation,
        filterType,
        setFilterType,
        sortBy,
        setSortBy,
        applyToJob,
        toggleBookmark,
        sendMessage,
        addNewMessage,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        activeCalendarFilter,
        setActiveCalendarFilter,
        activeCalendarDay,
        setActiveCalendarDay,
        showRegionSelector,
        setShowRegionSelector,
        mapFocusedJobId,
        setMapFocusedJobId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

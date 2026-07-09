import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, SquarePen, Inbox, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MessagesScreen: React.FC = () => {
  const { chats, setChats, setSelectedChatId, setCurrentScreen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeCompany, setComposeCompany] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  const filteredChats = chats.filter(chat => {
    return (
      chat.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleChatClick = (chatId: string) => {
    // Clear unread count for this chat
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
    setSelectedChatId(chatId);
    setCurrentScreen('chat');
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeCompany || !composeMessage) return;

    const timeNow = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const newChatId = 'c_' + Date.now();
    const newChat = {
      id: newChatId,
      companyName: composeCompany,
      recruiterName: 'Mas\'ul xodim',
      logoUrl: undefined,
      recruiterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      online: true,
      unreadCount: 0,
      lastMessageTime: timeNow,
      messages: [
        {
          id: 'm1',
          sender: 'user' as const,
          text: composeMessage,
          time: timeNow
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setComposeOpen(false);
    setComposeCompany('');
    setComposeMessage('');
    setSelectedChatId(newChatId);
    setCurrentScreen('chat');
  };

  return (
    <div className="flex flex-col gap-3 pb-20 pt-16 md:pt-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-brand-outline" size={20} />
          <input
            type="text"
            className="w-full h-11 pl-11 pr-4 bg-brand-surface-low border border-brand-outline-variant rounded-full text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-brand-primary"
            placeholder="Kompaniya yoki xabarni izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredChats.map((chat, idx) => {
          const lastMsg = chat.messages[chat.messages.length - 1];

          return (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleChatClick(chat.id)}
              className="flex items-center px-4 py-4 hover:bg-brand-surface-low transition-colors cursor-pointer border-b border-brand-surface-low last:border-none group relative"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-surface-low border border-brand-outline-variant">
                  {chat.recruiterAvatar ? (
                    <img src={chat.recruiterAvatar} alt={chat.recruiterName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-bold text-sm">
                      {chat.companyName.charAt(0)}
                    </div>
                  )}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-secondary border-2 border-white rounded-full" />
                )}
              </div>

              <div className="ml-4 flex-grow min-w-0 pr-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display font-bold text-sm text-brand-primary truncate group-hover:text-brand-primary-container transition-colors">
                    {chat.companyName}
                  </h3>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${
                    chat.unreadCount > 0 ? 'text-brand-primary font-bold' : 'text-brand-text-variant'
                  }`}>
                    {chat.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs truncate pr-4 ${
                    chat.unreadCount > 0 ? 'text-brand-text font-semibold' : 'text-brand-text-variant font-medium'
                  }`}>
                    {lastMsg?.text || 'Muloqot boshlanmadi'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-brand-text-variant">
            <Inbox size={40} className="mx-auto text-brand-outline-variant mb-2" />
            <p className="font-display font-bold text-sm">Xabarlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Empty state tip */}
      <div className="mt-4 text-center">
        <p className="text-xs text-brand-text-variant opacity-60 font-semibold">
          Sizda yana 12 ta eski yozishmalar mavjud
        </p>
      </div>

      {/* Floating Action Button (Only on Messages to compose new) */}
      <button
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-brand-primary text-white shadow-xl flex items-center justify-center active:scale-90 hover:bg-brand-primary-container transition-all z-40 cursor-pointer"
        title="Yangi xabar yozish"
      >
        <SquarePen size={22} />
      </button>

      {/* Compose Chat Modal overlay */}
      <AnimatePresence>
        {composeOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComposeOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleComposeSubmit}
              className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-brand-surface-low pb-3">
                <h3 className="font-display font-bold text-base text-brand-primary">Yangi xabar yozish</h3>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="p-1 rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-brand-text-variant uppercase">Kompaniya nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Artel, Korzinka, Yandex..."
                  className="bg-brand-surface-low border border-brand-outline-variant rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-primary focus:outline-hidden"
                  value={composeCompany}
                  onChange={(e) => setComposeCompany(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-brand-text-variant uppercase">Xabar matni</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Assalomu alaykum! Men..."
                  className="bg-brand-surface-low border border-brand-outline-variant rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-primary focus:outline-hidden resize-none"
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-primary-container shadow-md cursor-pointer transition-colors mt-2"
              >
                <span>Xabarni yuborish</span>
                <Send size={14} />
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

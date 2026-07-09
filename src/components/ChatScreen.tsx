import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Phone, MoreVertical, Paperclip, Smile, Send, MapPin, CheckCheck, CircleHelp } from 'lucide-react';
import { motion } from 'motion/react';

export const ChatScreen: React.FC = () => {
  const { chats, selectedChatId, sendMessage, setCurrentScreen } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === selectedChatId);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-brand-text-variant pt-20">
        <CircleHelp size={40} className="mb-2 text-brand-outline-variant" />
        <p className="font-display font-bold text-sm">Suhbat topilmadi</p>
        <button
          onClick={() => setCurrentScreen('xabarlar')}
          className="mt-4 bg-brand-primary text-white font-bold text-xs py-2 px-6 rounded-full cursor-pointer"
        >
          Xabarlarga qaytish
        </button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText;
    sendMessage(activeChat.id, currentText);
    setInputText('');

    // Trigger Typing Indicator sequence
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2400);
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)] bg-white relative pt-0">
      {/* Top App Bar inside Chat */}
      <header className="flex justify-between items-center px-4 h-16 w-full z-50 bg-white border-b border-brand-outline-variant fixed top-0 md:top-16 left-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('xabarlar')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low transition-colors cursor-pointer text-brand-text-variant"
            aria-label="Orqaga"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand-surface-low flex items-center justify-center overflow-hidden border border-brand-outline-variant">
                {activeChat.recruiterAvatar ? (
                  <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-bold text-xs">
                    {activeChat.companyName.charAt(0)}
                  </div>
                )}
              </div>
              {activeChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-secondary rounded-full border-2 border-white animate-pulse" />
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="font-display font-bold text-sm text-brand-primary leading-tight">
                {activeChat.companyName}
              </h1>
              <span className="text-[10px] font-bold text-brand-secondary">
                {activeChat.online ? 'Onlayn' : 'Oflayn'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer transition-colors">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-surface-low text-brand-text-variant cursor-pointer transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <main className="flex-1 mt-16 mb-20 px-4 pt-6 overflow-y-auto no-scrollbar flex flex-col space-y-4">
        {/* Date Separator */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 bg-brand-surface-low text-brand-text-variant font-semibold text-[10px] rounded-full">
            Bugun
          </span>
        </div>

        {/* Message Feed */}
        {activeChat.messages.map((msg, index) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 max-w-[85%] ${
                isUser ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Recruiter Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-brand-surface-low flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-outline-variant shadow-xs">
                  {activeChat.recruiterAvatar ? (
                    <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs text-brand-primary">{activeChat.companyName.charAt(0)}</span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <div
                  className={`p-3 rounded-2xl shadow-xs text-xs font-medium leading-relaxed ${
                    isUser
                      ? 'bg-brand-primary text-white rounded-br-none'
                      : 'bg-brand-surface-low text-brand-text rounded-bl-none border border-brand-outline-variant'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Map Attachment */}
                  {msg.hasMap && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-brand-outline-variant bg-white">
                      {/* Interactive map snippet visual */}
                      <div className="w-full h-24 bg-sky-100 flex items-center justify-center relative">
                        <svg viewBox="0 0 200 100" className="w-full h-full object-cover opacity-70">
                          <rect width="200" height="100" fill="#f8fafc" />
                          <path d="M 0 50 L 200 50" stroke="#cbd5e1" strokeWidth="10" />
                          <path d="M 100 0 L 100 100" stroke="#cbd5e1" strokeWidth="10" />
                          <circle cx="100" cy="50" r="8" fill="#ef4444" />
                        </svg>
                        <MapPin size={24} className="text-red-600 absolute animate-bounce" />
                      </div>
                      <button
                        onClick={() => setCurrentScreen('xarita')}
                        className="w-full p-2 flex items-center justify-center gap-2 hover:bg-brand-surface-low text-brand-primary font-bold text-[10px] border-t border-brand-outline-variant transition-colors cursor-pointer"
                      >
                        <MapPin size={12} />
                        <span>Manzilni xaritada ko'rish</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-1 mt-0.5 ${isUser ? 'justify-end mr-1' : 'ml-1'}`}>
                  <span className="text-[9px] text-brand-text-variant font-bold">
                    {msg.time}
                  </span>
                  {isUser && (
                    <CheckCheck size={11} className="text-brand-primary shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Recruiter Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2" id="typing-indicator">
            <div className="w-8 h-8 rounded-full bg-brand-surface-low overflow-hidden border border-brand-outline-variant">
              {activeChat.recruiterAvatar ? (
                <img src={activeChat.recruiterAvatar} alt={activeChat.recruiterName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-brand-primary">{activeChat.companyName.charAt(0)}</span>
              )}
            </div>
            <div className="flex gap-1 bg-brand-surface-low px-4 py-2.5 rounded-full border border-brand-outline-variant">
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="w-1.5 h-1.5 bg-brand-outline rounded-full animate-bounce [animation-delay:0.6s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Bar Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-brand-outline-variant px-4 py-3 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-surface-low hover:bg-brand-surface-lowest transition-all text-brand-text-variant border border-brand-outline-variant cursor-pointer"
            title="Fayl biriktirish"
          >
            <Paperclip size={18} />
          </button>

          <form onSubmit={handleSend} className="flex-1 relative flex items-center">
            <input
              type="text"
              className="w-full bg-brand-surface-low border border-brand-outline-variant rounded-full px-5 py-3 pr-12 focus:ring-2 focus:ring-brand-primary text-xs font-sans placeholder:text-brand-outline text-brand-text"
              placeholder="Xabar yozing..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 text-brand-text-variant hover:text-brand-primary transition-colors cursor-pointer"
              title="Smayliklar"
            >
              <Smile size={18} />
            </button>
          </form>

          <button
            onClick={handleSend}
            type="submit"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary-container text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            title="Yuborish"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

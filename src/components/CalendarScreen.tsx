import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Star, Calendar, CheckCircle2, AlertCircle, Clock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalendarScreen: React.FC = () => {
  const { jobs, activeCalendarFilter, setActiveCalendarFilter } = useApp();
  const [activeAccordion, setActiveAccordion] = useState<string | null>('arizalar');

  // Filter jobs by their status categories for the calendar list
  const appliedJobs = jobs.filter(j => j.applied || j.status === 'applied');
  const confirmedJobs = jobs.filter(j => j.status === 'confirmed');
  const todoJobs = jobs.filter(j => j.status === 'todo');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  // Generate calendar days for June 2026
  // June 1, 2026 is a Monday (Du). It has 30 days.
  // We can also render 5 trailing days of July as gray.
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2, 3, 4, 5];

  const hasEvent = (day: number) => {
    // Return dots based on day events
    if (day === 12) return { yellow: true }; // Today
    if (day === 15) return { green: true };  // Confirmed interview
    if (day === 17) return { red: true };    // To-do task
    return null;
  };

  return (
    <div className="flex flex-col gap-4 pb-20 pt-16 md:pt-4">
      {/* Calendar Section */}
      <section className="bg-white p-4 rounded-2xl shadow-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold text-red-600">2026-yil Iyun</h2>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-full hover:bg-brand-surface-low text-red-600 transition-colors cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-brand-surface-low text-red-600 transition-colors cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center mb-2 border-b border-brand-surface-low pb-2">
          {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => (
            <div key={d} className="text-xs font-bold text-brand-outline font-display">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center gap-y-3">
          {days.map(day => {
            const isToday = day === 12;
            const isSpecial = day === 30;

            return (
              <div
                key={day}
                className="relative flex flex-col items-center justify-center p-1.5"
              >
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer relative ${
                    isToday
                      ? 'bg-brand-primary text-white font-bold shadow-md scale-105'
                      : isSpecial
                      ? 'text-red-600 font-bold hover:bg-brand-surface-low'
                      : 'text-brand-text hover:bg-brand-surface-low'
                  }`}
                >
                  {day}
                </button>
              </div>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map(day => (
            <div key={`next-${day}`} className="flex items-center justify-center p-1.5">
              <span className="text-xs font-medium text-brand-outline-variant select-none">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Legend status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-brand-outline-variant text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-xs" />
            <span className="text-brand-text">Arizada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-secondary shadow-xs" />
            <span className="text-brand-text">Tasdiqlangan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 shadow-xs" />
            <span className="text-brand-text">Qilinadigan ish</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={12} className="text-brand-primary fill-brand-primary" />
            <span className="text-brand-text">Tugallangan</span>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section className="flex flex-col gap-3">
        {/* Arizadagi ishlar */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleAccordion('arizalar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-yellow-500 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {appliedJobs.length}
              </span>
              <span>Arizadagi ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'arizalar' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'arizalar' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {appliedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hozircha arizadagi ishlar mavjud emas.</p>
                  ) : (
                    appliedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold text-[9px] px-2 py-0.5 rounded-full">
                          Yuborildi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tasdiqlangan ishlar */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleAccordion('tasdiqlangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-secondary text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {confirmedJobs.length}
              </span>
              <span>Tasdiqlangan ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'tasdiqlangan' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'tasdiqlangan' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {confirmedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hozircha tasdiqlangan ishlar mavjud emas.</p>
                  ) : (
                    confirmedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 border border-green-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Suhbat belgilandi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ish tafsilotlari/Hisobotlar */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleAccordion('hisobotlar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {todoJobs.length}
              </span>
              <span>Ish tafsilotlari/Hisobotlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'hisobotlar' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'hisobotlar' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {todoJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Hisobotlar mavjud emas.</p>
                  ) : (
                    todoJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-red-100 text-red-800 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle size={10} />
                          Hujjat topshirish kerak
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tugallangan ishlar */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleAccordion('tugallangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-primary-container text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {completedJobs.length}
              </span>
              <span>Tugallangan ishlar</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-brand-outline-variant transition-transform ${
                activeAccordion === 'tugallangan' ? 'rotate-90 text-brand-text' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {activeAccordion === 'tugallangan' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-brand-surface-low"
              >
                <div className="p-4 flex flex-col gap-2">
                  {completedJobs.length === 0 ? (
                    <p className="text-xs text-brand-text-variant italic">Tugallangan ishlar mavjud emas.</p>
                  ) : (
                    completedJobs.map(job => (
                      <div key={job.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-brand-text">{job.title}</p>
                          <p className="text-[10px] text-brand-text-variant font-medium">{job.company}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-current" />
                          Muvaffaqiyatli yakunlandi
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

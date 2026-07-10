import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Star, Calendar, CheckCircle2, AlertCircle, Clock, Eye } from 'lucide-react';
import { JobSearchModalDetail, getJobHeroImage, getJobDetails } from "./search/JobSearchModalDetail";
import { motion, AnimatePresence } from 'motion/react';
import { Job } from '../types';

const UZBEK_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

export const CalendarScreen: React.FC = () => {
  const { jobs, activeCalendarFilter, setActiveCalendarFilter, toggleBookmark, applyToJob } = useApp();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // June is 5 (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number>(10); // Default is June 10, 2026 (Wednesday)
  const [activeTooltipDay, setActiveTooltipDay] = useState<number | null>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setActiveTooltipDay(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Helper: check if a job belongs to the current year & month
  const isJobInMonth = (job: Job, year: number, month: number): boolean => {
    if (!job.periodText) return false;
    const datePart = job.periodText.split(' ')[0];
    const monthStr = String(month + 1).padStart(2, '0');
    const prefix = `${year}-${monthStr}-`;
    return datePart.startsWith(prefix);
  };

  // Helper: check if a job date is in the future relative to today (June 10, 2026)
  const isJobFutureDay = (job: Job): boolean => {
    if (!job.periodText) return false;
    const dateStr = job.periodText.split(' ')[0];
    const dayStr = dateStr.includes('~') ? dateStr.split('~')[0].split('-')[2] : dateStr.split('-')[2];
    const jobDay = parseInt(dayStr) || 10;
    
    const parts = dateStr.split('-');
    const year = parseInt(parts[0]) || 2026;
    const month = parseInt(parts[1]) || 6;
    
    if (year > 2026) return true;
    if (year < 2026) return false;
    if (month > 6) return true;
    if (month < 6) return false;
    return jobDay > 10; // today is June 10, 2026
  };

  // Filter jobs by their status categories for the calendar list (filtered by selected month)
  const currentMonthJobs = jobs.filter(j => isJobInMonth(j, currentYear, currentMonth));
  const appliedJobs = currentMonthJobs.filter(j => j.applied || j.status === 'applied');
  const confirmedJobs = currentMonthJobs.filter(j => (j.status === 'confirmed' || j.status === 'todo') && isJobFutureDay(j));
  const todoJobs = currentMonthJobs.filter(j => (j.status === 'confirmed' || j.status === 'todo') && !isJobFutureDay(j));
  const completedJobs = currentMonthJobs.filter(j => j.status === 'completed');

  const renderJobCard = (job: Job, badge: React.ReactNode) => (
    <button key={job.id} onClick={() => setSelectedJob(job)} className="w-full text-left p-3.5 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col gap-2">
      <div className="flex justify-between items-start gap-3 w-full">
        <p className="text-[13px] font-bold text-slate-800 leading-snug line-clamp-2">{job.title}</p>
        {badge}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-0.5 w-full">
        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 flex-1 min-w-[100px]">{job.company}</p>
        {job.periodText && (
          <p className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            <Calendar size={10} className="text-slate-400" />
            {job.periodText.split(' ')[0]}
          </p>
        )}
      </div>
    </button>
  );

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  // Generate calendar days dynamically
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  
  // Empty slots / previous month days to pad the start
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = Array.from(
    { length: startDayOfWeek }, 
    (_, i) => daysInPrevMonth - startDayOfWeek + i + 1
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Remaining slots to make full rows (multiples of 7)
  const totalSlotsSoFar = startDayOfWeek + daysInMonth;
  const totalSlotsNeeded = totalSlotsSoFar <= 35 ? 35 : 42;
  const nextMonthDaysCount = totalSlotsNeeded - totalSlotsSoFar;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  // Helper: check if a job falls on a given day in the selected year & month
  const isJobOnDay = (job: Job, day: number, year: number, month: number): boolean => {
    if (!job.periodText) return false;
    const datePart = job.periodText.split(' ')[0];
    const monthStr = String(month + 1).padStart(2, '0');
    const prefix = `${year}-${monthStr}-`;
    if (!datePart.startsWith(prefix)) return false;

    if (datePart.includes('~')) {
      const [start, end] = datePart.split('~');
      const startDay = parseInt(start.split('-')[2], 10);
      const endDay = parseInt(end, 10);
      return day >= startDay && day <= endDay;
    } else {
      const jobDay = parseInt(datePart.split('-')[2], 10);
      return jobDay === day;
    }
  };

  // Map days to specific statuses as requested by the user
  const getDayStatus = (day: number): 'applied' | 'confirmed' | 'todo' | 'completed' | null => {
    const jobsOnDay = jobs.filter(j => isJobOnDay(j, day, currentYear, currentMonth));
    if (jobsOnDay.some(j => j.status === 'completed')) return 'completed';
    
    const activeJobsOnDay = jobsOnDay.filter(j => j.status === 'confirmed' || j.status === 'todo');
    if (activeJobsOnDay.length > 0) {
      // If the date is in the future relative to today (June 10, 2026)
      const isFuture = (currentYear > 2026) || 
                       (currentYear === 2026 && currentMonth > 5) || 
                       (currentYear === 2026 && currentMonth === 5 && day > 10);
      return isFuture ? 'confirmed' : 'todo';
    }
    
    if (jobsOnDay.some(j => j.status === 'applied' || j.applied)) return 'applied';
    return null;
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const status = getDayStatus(day);
    
    if (status) {
      setActiveTooltipDay(prev => prev === day ? null : day);
    } else {
      setActiveTooltipDay(null);
    }

    if (status === 'applied') {
      setActiveAccordion('arizalar');
    } else if (status === 'confirmed') {
      setActiveAccordion('tasdiqlangan');
    } else if (status === 'todo') {
      setActiveAccordion('hisobotlar');
    } else if (status === 'completed') {
      setActiveAccordion('tugallangan');
    }
  };

  const handlePrevMonth = () => {
    setActiveTooltipDay(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(1); // default to first day when changing month
  };

  const handleNextMonth = () => {
    setActiveTooltipDay(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(1); // default to first day when changing month
  };

  return (
    <div className="flex flex-col gap-4 pb-20 pt-16 md:pt-4">
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="star-inset-shadow">
            <feOffset dx="0" dy="2"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.8" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <filter id="star-3d">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.4" floodColor="#0f172a" result="drop-shadow"/>
            
            <feOffset dx="0" dy="1.5" in="SourceAlpha" />
            <feGaussianBlur stdDeviation="1" result="highlight-blur" />
            <feComposite operator="out" in="SourceAlpha" in2="highlight-blur" result="highlight-inverse" />
            <feFlood floodColor="white" floodOpacity="0.8" result="highlight-color" />
            <feComposite operator="in" in="highlight-color" in2="highlight-inverse" result="highlight-final" />
            
            <feOffset dx="0" dy="-2" in="SourceAlpha" />
            <feGaussianBlur stdDeviation="1.5" result="shadow-blur" />
            <feComposite operator="out" in="SourceAlpha" in2="shadow-blur" result="shadow-inverse" />
            <feFlood floodColor="black" floodOpacity="0.6" result="shadow-color" />
            <feComposite operator="in" in="shadow-color" in2="shadow-inverse" result="shadow-final" />
            
            <feMerge>
              <feMergeNode in="drop-shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="highlight-final" />
              <feMergeNode in="shadow-final" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {/* Calendar Section */}
      <section ref={calendarRef} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),_0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold text-slate-800">{currentYear}-yil {UZBEK_MONTHS[currentMonth]}</h2>
          <div className="flex gap-1">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center mb-2 border-b border-slate-100 pb-2">
          {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-400 font-display">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center gap-y-3">
          {/* Previous month days */}
          {prevMonthDays.map(day => (
            <div key={`prev-${day}`} className="flex items-center justify-center p-1">
              <span className="text-xs font-semibold text-slate-300 select-none">
                {day}
              </span>
            </div>
          ))}

          {days.map(day => {
            const isSelected = selectedDay === day;
            const isToday = currentYear === 2026 && currentMonth === 5 && day === 10;
            const status = getDayStatus(day);

            // Determine day button classes & inner elements dynamically
            let buttonClasses = "w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-150 ease-out active:scale-75 active:opacity-95 transform-gpu relative cursor-pointer ";
            let content: React.ReactNode = <span className={isToday ? "-translate-y-[2px]" : ""}>{day}</span>;

            // Set up base styling based on status/day type
            if (status === 'completed') {
              buttonClasses += `bg-transparent text-brand-primary transition-all duration-150 ${!isSelected ? 'hover:scale-105' : ''}`;
              content = (
                <div className="relative w-full h-full flex items-center justify-center transition-transform">
                  <Star 
                    size={36} 
                    className="absolute fill-brand-primary text-brand-primary transition-all"
                    style={isSelected ? { filter: 'url(#star-inset-shadow)' } : { filter: 'url(#star-3d)' }}
                  />
                  <span className={`relative z-10 text-[10px] text-white font-black leading-none pb-[2px] ${isToday ? '-translate-y-[2px]' : ''} ${isSelected ? 'opacity-90' : ''}`}>{day}</span>
                </div>
              );
            } else if (status === 'applied') {
              buttonClasses += `bg-amber-500 text-white shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(146,64,14,0.4),_0_3px_8px_rgba(245,158,11,0.35)] hover:bg-amber-500/90 hover:shadow-[0_4px_12px_rgba(245,158,11,0.45)] ${!isSelected ? 'hover:scale-105' : ''}`;
            } else if (status === 'confirmed') {
              buttonClasses += `bg-emerald-500 text-white shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(6,95,70,0.4),_0_3px_8px_rgba(16,185,129,0.35)] hover:bg-emerald-500/90 hover:shadow-[0_4px_12px_rgba(16,185,129,0.45)] ${!isSelected ? 'hover:scale-105' : ''}`;
            } else if (status === 'todo') {
              buttonClasses += `bg-rose-500 text-white shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(159,18,57,0.4),_0_3px_8px_rgba(244,63,94,0.35)] hover:bg-rose-500/90 hover:shadow-[0_4px_12px_rgba(244,63,94,0.45)] ${!isSelected ? 'hover:scale-105' : ''}`;
            } else if (isToday) {
              buttonClasses += `bg-white border border-brand-primary/50 text-brand-primary font-bold hover:bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] ${!isSelected ? 'hover:scale-105' : ''}`;
            } else {
              buttonClasses += `text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold ${!isSelected ? 'hover:scale-105' : ''}`;
            }

            // Apply selected modifiers (shrink down to look pressed, with satisfying inset shadow)
            if (isSelected) {
              buttonClasses += " scale-90 z-10";
              if (status === 'completed') {
                buttonClasses += " opacity-90";
              } else if (status === 'applied') {
                buttonClasses += " shadow-[inset_0_4px_8px_rgba(120,53,4,0.85)] border border-amber-600/40";
              } else if (status === 'confirmed') {
                buttonClasses += " shadow-[inset_0_4px_8px_rgba(2,48,32,0.85)] border border-emerald-600/40";
              } else if (status === 'todo') {
                buttonClasses += " shadow-[inset_0_4px_8px_rgba(136,19,55,0.85)] border border-rose-600/40";
              } else if (!status) {
                if (isToday) {
                  buttonClasses += " bg-white border-brand-primary shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)]";
                } else {
                  buttonClasses += " bg-white border border-slate-300 text-slate-800 shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)]"; // White background
                }
              }
            }

            const jobsOnThisDay = jobs.filter(j => isJobOnDay(j, day, currentYear, currentMonth) && (j.status !== 'none' || j.applied));
            let tooltipJobs: Job[] = jobsOnThisDay;
            const monthUz = UZBEK_MONTHS[currentMonth];
            let tooltipTitle = `${day}-${monthUz} kungi ishlar`;
            let tooltipColor = 'text-slate-700';
            
            if (status === 'applied') {
              tooltipColor = 'text-amber-600';
            } else if (status === 'confirmed') {
              tooltipColor = 'text-emerald-600';
            } else if (status === 'todo') {
              tooltipColor = 'text-rose-600';
            } else if (status === 'completed') {
              tooltipColor = 'text-brand-primary';
            }

            const slotIndex = startDayOfWeek + day - 1;
            const isFirstTwoRows = Math.floor(slotIndex / 7) <= 1;
            const colIndex = slotIndex % 7;

            return (
              <div
                key={day}
                className="relative flex flex-col items-center justify-center p-1 group"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  onClick={() => handleDayClick(day)}
                  className={buttonClasses}
                >
                  {content}
                  {isToday && (
                    <div className={`absolute bottom-1 w-[5px] h-[5px] rounded-full ${status ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]' : 'bg-brand-primary shadow-xs'}`} />
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {status && tooltipJobs.length > 0 && activeTooltipDay === day && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: isFirstTwoRows ? 5 : -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: isFirstTwoRows ? 5 : -5 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className={`absolute flex z-50 ${
                        isFirstTwoRows ? 'top-full pt-1 flex-col-reverse' : 'bottom-full pb-1 flex-col'
                      } ${
                        colIndex <= 1 ? 'left-0 items-start' : colIndex >= 5 ? 'right-0 items-end' : 'left-1/2 -translate-x-1/2 items-center'
                      }`}
                    >
                      <div className="bg-white p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 w-[220px] max-h-56 overflow-hidden flex flex-col gap-1.5">
                        <span className={`font-bold border-b border-slate-100 pb-1.5 mb-0.5 uppercase tracking-wider text-[10px] ${tooltipColor}`}>
                          {tooltipTitle}
                        </span>
                        {tooltipJobs.slice(0, 3).map(job => (
                          <button key={job.id} onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }} className="w-full p-2 bg-brand-surface-low hover:bg-slate-50 active:bg-slate-100 transition-colors rounded-xl border border-slate-50 flex items-center justify-between text-left cursor-pointer">
                            <div className="flex-1 truncate mr-2">
                              <p className="text-[11px] font-bold text-brand-text truncate">{job.title}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-[9px] text-brand-text-variant font-medium truncate">{job.company}</p>
                                {job.periodText && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                                    <p className="text-[8px] text-slate-500 flex items-center gap-0.5 shrink-0 font-medium">
                                      <Calendar size={8} className="text-slate-400" />
                                      {job.periodText.split(' ')[0]}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            {status === 'applied' && <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Yuborildi</span>}
                            {status === 'confirmed' && <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Tasdiqlandi</span>}
                            {status === 'todo' && <span className="bg-rose-100 text-rose-850 border border-rose-200 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Bugun qilinadi</span>}
                            {status === 'completed' && <span className="bg-indigo-50 text-brand-primary border border-indigo-100 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Yakunlandi</span>}
                          </button>
                        ))}
                        {tooltipJobs.length > 3 && (
                          <div className="text-slate-400 font-medium italic mt-1 text-[10px] text-center">+{tooltipJobs.length - 3} ta yana...</div>
                        )}
                      </div>
                      <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
                        isFirstTwoRows ? 'border-b-[6px] border-b-white relative -bottom-[1px]' : 'border-t-[6px] border-t-white relative -top-[1px]'
                      } ${
                        colIndex <= 1 ? 'ml-[16px]' : colIndex >= 5 ? 'mr-[16px]' : ''
                      }`}></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map(day => (
            <div key={`next-${day}`} className="flex items-center justify-center p-1">
              <span className="text-xs font-semibold text-slate-300 select-none">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Legend status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1px_1.5px_rgba(146,64,14,0.4),_0_1.5px_3.5px_rgba(245,158,11,0.3)] shrink-0 select-none" />
            <span className="text-slate-600">Arizada</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1px_1.5px_rgba(6,95,70,0.4),_0_1.5px_3.5px_rgba(16,185,129,0.3)] shrink-0 select-none" />
            <span className="text-slate-600">Tasdiqlangan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1px_1.5px_rgba(159,18,57,0.4),_0_1.5px_3.5px_rgba(244,63,94,0.3)] shrink-0 select-none" />
            <span className="text-slate-600">Qilinadigan ish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0 select-none">
              <Star 
                size={16} 
                className="fill-brand-primary text-brand-primary"
                style={{ filter: 'url(#star-3d)' }}
              />
            </div>
            <span className="text-slate-600">Tugallangan</span>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section className="flex flex-col gap-3">
        {/* Arizadagi ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('arizalar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-white font-extrabold text-[11px] w-6 h-6 flex items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1.5px_2.5px_rgba(146,64,14,0.4),_0_2px_6px_rgba(245,158,11,0.3)] select-none">
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
                    appliedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center">
                        Yuborildi
                      </span>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tasdiqlangan ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('tasdiqlangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-white font-extrabold text-[11px] w-6 h-6 flex items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1.5px_2.5px_rgba(6,95,70,0.4),_0_2px_6px_rgba(16,185,129,0.3)] select-none">
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
                    confirmedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Tasdiqlandi
                      </span>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Qilinadigan ish */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('hisobotlar')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-rose-500 text-white font-extrabold text-[11px] w-6 h-6 flex items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1.5px_2.5px_rgba(159,18,57,0.4),_0_2px_6px_rgba(244,63,94,0.3)] select-none">
                {todoJobs.length}
              </span>
              <span>Qilinadigan ish</span>
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
                    todoJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <AlertCircle size={10} />
                        Boshlashga tayyor
                      </span>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tugallangan ishlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02),_0_2px_4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden">
          <button
            onClick={() => toggleAccordion('tugallangan')}
            className="w-full p-4 flex items-center justify-between font-display font-bold text-sm text-brand-text hover:bg-brand-surface-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-primary text-white font-extrabold text-[11px] w-6 h-6 flex items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),_inset_0_-1.5px_2.5px_rgba(0,0,0,0.4),_0_2px_6px_rgba(0,6,102,0.3)] select-none">
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
                    completedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-indigo-50 text-brand-primary border border-indigo-100 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-current" />
                        Muvaffaqiyatli yakunlandi
                      </span>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <AnimatePresence>
        {selectedJob && (
          <JobSearchModalDetail 
            selectedJob={selectedJob} 
            setSelectedJob={setSelectedJob} 
            toggleBookmark={toggleBookmark} 
            applyToJob={applyToJob} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

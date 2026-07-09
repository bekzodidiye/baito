import React from 'react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../../types';

interface JobCardItemProps {
  job: Job;
  idx: number;
  onClick: () => void;
  toggleBookmark: (id: string) => void;
}

export const JobCardItem: React.FC<JobCardItemProps> = ({
  job,
  idx,
  onClick,
  toggleBookmark,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 relative transition-all duration-300 cursor-pointer border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-md hover:scale-[1.01] hover:bg-brand-primary/5 transition-all cursor-pointer group"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 shadow-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-100/90">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
          ) : (
            <Briefcase size={18} className="text-slate-400" />
          )}
        </div>
        <div className="min-w-0 pr-6 flex-1">
          <h2 className="font-sans font-bold text-sm text-slate-800 leading-tight truncate group-hover:text-brand-primary transition-colors">
            {job.title}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            {job.company}
          </p>
        </div>
      </div>

      <div className="mt-0.5 flex flex-col">
        <p className="font-sans font-bold text-slate-900 text-[16px] leading-tight">
          {job.salary}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 mt-1">
        {job.tags.slice(0, 2).map((tag, tIdx) => (
          <span
            key={tIdx}
            className="px-2 py-0.5 bg-slate-100/70 text-slate-500 text-[10px] font-semibold rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="h-[1px] bg-slate-100 w-full my-2" />

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
            <Clock size={11} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.periodText || "2026-07-09 11:52~19:52"}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-brand-primary shrink-0 self-end mb-0.5">
          {job.durationLabel || "12 soat"}
        </span>
      </div>
    </motion.article>
  );
};

import React from 'react';
import { motion } from 'motion/react';

interface JobCardSkeletonProps {
  idx: number;
}

export const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({ idx }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: Math.min((idx % 5) * 0.02, 0.1), ease: "easeOut" }}
      className="bg-white rounded-2xl p-5 flex flex-col gap-3.5 relative border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.01),_0_2px_4px_rgba(0,0,0,0.005)] overflow-hidden"
    >
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-100/40 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite] pointer-events-none" />

      {/* Top section: Logo & Title/Company */}
      <div className="flex gap-3.5 items-start">
        {/* Logo box placeholder */}
        <div className="w-11 h-11 rounded-xl bg-slate-100/80 animate-pulse shrink-0 border border-slate-50" />
        
        {/* Title & Company placeholders */}
        <div className="min-w-0 flex-1 flex flex-col gap-2 mt-1">
          <div className="h-4 bg-slate-100/90 rounded-md w-3/4 animate-pulse" />
          <div className="h-3 bg-slate-100/60 rounded-md w-1/2 animate-pulse" />
        </div>
      </div>

      {/* Salary placeholder */}
      <div className="flex flex-col mt-0.5">
        <div className="h-5 bg-slate-100/90 rounded-md w-1/3 animate-pulse" />
      </div>

      {/* Tags placeholders */}
      <div className="flex flex-wrap gap-1.5 mt-0.5">
        <div className="h-6 bg-slate-100/50 rounded-lg w-16 animate-pulse" />
        <div className="h-6 bg-slate-100/50 rounded-lg w-20 animate-pulse" />
        <div className="h-6 bg-slate-100/50 rounded-lg w-14 animate-pulse" />
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-slate-100/50 w-full" />

      {/* Bottom section: Details & Badge */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Time placeholder */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="h-3 bg-slate-100/60 rounded-md w-3/5 animate-pulse" />
          </div>
          {/* Location placeholder */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="h-3 bg-slate-100/60 rounded-md w-4/5 animate-pulse" />
          </div>
        </div>
        {/* Duration badge placeholder */}
        <div className="h-5 bg-slate-100/80 rounded-md w-12 animate-pulse shrink-0 self-end" />
      </div>
    </motion.div>
  );
};

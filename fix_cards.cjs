const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

// Insert the helper function right after `const completedJobs = ...`
const insertPoint = content.indexOf('  const completedJobs = jobs.filter(j => j.status === \'completed\');');
if (insertPoint !== -1) {
  const insertContent = `  const completedJobs = jobs.filter(j => j.status === 'completed');

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
`;
  content = content.replace('  const completedJobs = jobs.filter(j => j.status === \'completed\');\n', insertContent);
}

// 1. appliedJobs
content = content.replace(
  /appliedJobs\.map\(job => \([\s\S]*?<\/button>\n\s*\)\)/,
  `appliedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center">
                        Yuborildi
                      </span>
                    ))`
);

// 2. confirmedJobs
content = content.replace(
  /confirmedJobs\.map\(job => \([\s\S]*?<\/button>\n\s*\)\)/,
  `confirmedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Tasdiqlandi
                      </span>
                    ))`
);

// 3. todoJobs
content = content.replace(
  /todoJobs\.map\(job => \([\s\S]*?<\/button>\n\s*\)\)/,
  `todoJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-red-100 text-red-800 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle size={10} />
                        Kutilmoqda
                      </span>
                    ))`
);

// 4. completedJobs
content = content.replace(
  /completedJobs\.map\(job => \([\s\S]*?<\/button>\n\s*\)\)/,
  `completedJobs.map(job => renderJobCard(job, 
                      <span className="shrink-0 bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-current" />
                        Muvaffaqiyatli yakunlandi
                      </span>
                    ))`
);

fs.writeFileSync('src/components/CalendarScreen.tsx', content);
console.log("Updated cards");

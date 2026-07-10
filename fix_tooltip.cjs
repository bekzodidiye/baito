const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
content = content.replace(
  '<div key={job.id} className="p-2 bg-brand-surface-low rounded-xl border border-slate-50 flex items-center justify-between text-left">',
  '<button key={job.id} onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }} className="w-full p-2 bg-brand-surface-low hover:bg-slate-50 active:bg-slate-100 transition-colors rounded-xl border border-slate-50 flex items-center justify-between text-left cursor-pointer">'
).replace(
  /<\/span>\s*<\/div>\s*\}\)\)/m,
  '</span>\n                          </button>\n                      ))'
);
fs.writeFileSync('src/components/CalendarScreen.tsx', content);

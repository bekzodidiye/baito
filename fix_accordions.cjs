const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
content = content.replace(
  /<div key={job\.id} className="p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between">/g,
  '<button key={job.id} onClick={() => setSelectedJob(job)} className="w-full text-left p-3 bg-brand-surface-low rounded-xl shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">'
).replace(
  /Muvaffaqiyatli yakunlandi\s*<\/span>\s*<\/div>/g,
  'Muvaffaqiyatli yakunlandi\n                        </span>\n                      </button>'
).replace(
  /Boshlanishi kutilmoqda\s*<\/span>\s*<\/div>/g,
  'Boshlanishi kutilmoqda\n                        </span>\n                      </button>'
).replace(
  /Tasdiqlangan\s*<\/span>\s*<\/div>/g,
  'Tasdiqlangan\n                        </span>\n                      </button>'
).replace(
  /Kutilmoqda\s*<\/span>\s*<\/div>/g,
  'Kutilmoqda\n                        </span>\n                      </button>'
);
fs.writeFileSync('src/components/CalendarScreen.tsx', content);

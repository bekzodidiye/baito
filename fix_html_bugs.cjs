const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

// Fix 1: line 249
content = content.replace(
  '                            {status === \'completed\' && <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Yakunlandi</span>}\n                          </div>\n                        ))',
  '                            {status === \'completed\' && <span className="bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">Yakunlandi</span>}\n                          </button>\n                        ))'
);

// Fix 2: line 284
content = content.replace(
  '            <span className="text-slate-600">Tasdiqlangan\n                          </span>\n                        </button>\n          <div className="flex items-center gap-2">',
  '            <span className="text-slate-600">Tasdiqlangan</span>\n          </div>\n          <div className="flex items-center gap-2">'
);

fs.writeFileSync('src/components/CalendarScreen.tsx', content);

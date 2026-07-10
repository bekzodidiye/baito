const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');

// The first script I ran had an error in fixing the tooltips: 
content = content.replace(
  '                          </div>\n                        ))',
  '                          </button>\n                        ))'
);

// I replaced accordion divs with buttons but didn't close them correctly for the first two cases. 
content = content.replace(
  /Yuborildi\s*<\/span>\s*<\/div>/g,
  'Yuborildi\n                          </span>\n                        </button>'
);
content = content.replace(
  /Ish tasdiqlandi\s*<\/span>\s*<\/div>/g,
  'Ish tasdiqlandi\n                          </span>\n                        </button>'
);
content = content.replace(
  /Hujjat topshirish kerak\s*<\/span>\s*<\/div>/g,
  'Hujjat topshirish kerak\n                          </span>\n                        </button>'
);
content = content.replace(
  'Tasdiqlangan\n                          </span>\n                        </button>\n            <div className="flex items-center gap-2">',
  'Tasdiqlangan\n                          </span>\n            <div className="flex items-center gap-2">'
); // Wait, this one was accidentally changed during the first replacement script because of a bad regex match.

fs.writeFileSync('src/components/CalendarScreen.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
content = content.replace(/Tasdiqlangan<\/span>\\n          <\/div>/g, 'Tasdiqlangan</span>\n          </div>');
fs.writeFileSync('src/components/CalendarScreen.tsx', content);

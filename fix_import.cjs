const fs = require('fs');
let content = fs.readFileSync('src/components/search/JobSearchModalDetail.tsx', 'utf8');
content = content.replace(
  "} from 'lucide-react';",
  ", CheckCircle2, PlayCircle } from 'lucide-react';"
);
fs.writeFileSync('src/components/search/JobSearchModalDetail.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
content = content.replace(
  'const { jobs, activeCalendarFilter, setActiveCalendarFilter } = useApp();',
  'const { jobs, activeCalendarFilter, setActiveCalendarFilter, toggleBookmark, applyToJob } = useApp();'
);
content = content.replace(
  '          <JobSearchModalDetail \n            job={selectedJob} \n            onClose={() => setSelectedJob(null)} \n          />',
  '          <JobSearchModalDetail \n            selectedJob={selectedJob} \n            setSelectedJob={setSelectedJob} \n            toggleBookmark={toggleBookmark} \n            applyToJob={applyToJob} \n          />'
);
fs.writeFileSync('src/components/CalendarScreen.tsx', content);

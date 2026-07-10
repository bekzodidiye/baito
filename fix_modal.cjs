const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarScreen.tsx', 'utf8');
content = content.replace(
  '    </div>\n  );\n};',
  `      <AnimatePresence>
        {selectedJob && (
          <JobSearchModalDetail 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};`
);
fs.writeFileSync('src/components/CalendarScreen.tsx', content);

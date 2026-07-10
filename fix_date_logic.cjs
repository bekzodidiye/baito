const fs = require('fs');
let content = fs.readFileSync('src/components/search/JobSearchModalDetail.tsx', 'utf8');

const oldFooterStart = '        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3 sticky bottom-0 z-50">';
const oldFooterEnd = '        </div>\n      </motion.div>\n    </div>\n  );\n};\n';

// Let us just replace the whole footer.
const indexStart = content.indexOf(oldFooterStart);
if (indexStart !== -1) {
  content = content.slice(0, indexStart) + `        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3 sticky bottom-0 z-50">
          {(() => {
            // Get day from periodText (e.g. "2026-06-10 09:00~15:00" -> 10)
            const dateStr = selectedJob.periodText ? selectedJob.periodText.split(' ')[0] : '';
            const dayStr = dateStr.includes('~') ? dateStr.split('~')[0].split('-')[2] : dateStr.split('-')[2];
            const jobDay = parseInt(dayStr) || 10;
            const today = 10;
            const isFuture = jobDay > today;

            if (selectedJob.status === 'completed') {
              return (
                <button
                  disabled
                  className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-blue-600 opacity-90 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  Muvaffaqiyatli yakunlandi
                </button>
              );
            } else if (selectedJob.status === 'confirmed') {
              if (isFuture) {
                return (
                  <button
                    disabled
                    className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-emerald-600 opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Clock size={15} />
                    Boshlanishi kutilmoqda ({jobDay}-iyun)
                  </button>
                );
              } else {
                return (
                  <button
                    onClick={() => {
                      alert("Ish boshlandi!");
                    }}
                    className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={15} />
                    Ishni boshlash
                  </button>
                );
              }
            } else if (selectedJob.status === 'todo') {
              return (
                <button
                  disabled
                  className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-rose-500 opacity-90 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock size={15} />
                  Boshlanishi kutilmoqda
                </button>
              );
            } else if (selectedJob.status === 'applied' || selectedJob.applied) {
              return (
                <button
                  disabled
                  className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-amber-600 opacity-90 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  Ariza yuborilgan
                </button>
              );
            } else {
              return (
                <button
                  onClick={handleApplyClick}
                  className="flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md bg-[#000666] hover:bg-[#000666]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  Ariza topshirish
                </button>
              );
            }
          })()}
        </div>
      </motion.div>
    </div>
  );
};
`;
  fs.writeFileSync('src/components/search/JobSearchModalDetail.tsx', content);
  console.log("Updated footer");
}

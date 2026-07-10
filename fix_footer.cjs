const fs = require('fs');
let content = fs.readFileSync('src/components/search/JobSearchModalDetail.tsx', 'utf8');

const oldFooter = `        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3 sticky bottom-0 z-50">
          <button
            disabled={selectedJob.applied}
            onClick={handleApplyClick}
            className={\`flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer \${
              selectedJob.applied
                ? 'bg-emerald-600 cursor-not-allowed opacity-90'
                : 'bg-[#000666] hover:bg-[#000666]/90'
            }\`}
          >
            <Send size={15} />
            {selectedJob.applied ? 'Ariza topshirilgan' : 'Ariza topshirish'}
          </button>
        </div>`;

const newFooter = `        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3 sticky bottom-0 z-50">
          {(() => {
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
            } else if (selectedJob.status === 'confirmed') {
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
        </div>`;

if (!content.includes(oldFooter)) {
  console.log("Could not find old footer to replace.");
} else {
  content = content.replace(oldFooter, newFooter);
  fs.writeFileSync('src/components/search/JobSearchModalDetail.tsx', content);
  console.log("Replaced footer successfully.");
}


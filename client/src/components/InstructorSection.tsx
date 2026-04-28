const outcomes = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20 L10 13 L15 17 L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 8h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "生產力提升",
    value: "節省 40%",
    desc: "重複性工作時間",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 9v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "快速落地",
    value: "當天可用",
    desc: "學完即帶回工作",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 13h10M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: "產出品質",
    value: "全面升級",
    desc: "文件、簡報、提案",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 18v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "持續進化",
    value: "自主應用",
    desc: "建立 AI 工作習慣",
  },
];

const useCases = [
  {
    dept: "行銷團隊",
    before: "手動撰寫大量文案，每次改稿耗時",
    after: "AI 生成初稿＋優化，產出速度提升 3 倍",
  },
  {
    dept: "業務人員",
    before: "提案製作費時，客製化程度低",
    after: "用 AI 快速生成個性化簡報與報告",
  },
  {
    dept: "管理階層",
    before: "資料整理與彙報耗費大量人力",
    after: "AI 整合數據、自動生成摘要與洞察",
  },
  {
    dept: "HR / 行政",
    before: "重複性文件與流程佔用核心時間",
    after: "AI 處理例行任務，專注高價值工作",
  },
];

export default function InstructorSection() {
  return (
    <section id="instructors" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <p className="text-sm font-semibold text-primary mb-3">課程成效</p>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-snug">
              學完就能用，
              <br />
              讓 AI 真正在企業裡跑起來
            </h2>
          </div>

          {/* Outcome stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {outcomes.map((o) => (
              <div
                key={o.label}
                className="bg-gray-50 rounded-lg px-5 py-6 flex flex-col gap-3"
              >
                <span className="text-primary">{o.icon}</span>
                <div>
                  <p className="text-2xl font-black text-foreground leading-none mb-1">
                    {o.value}
                  </p>
                  <p className="text-xs text-foreground/45 leading-5">{o.desc}</p>
                </div>
                <p className="text-xs font-semibold text-primary mt-auto">{o.label}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="border-t border-border/40 pt-12">
            <p className="text-sm font-semibold text-foreground/40 tracking-widest uppercase mb-8">
              各部門應用場景
            </p>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              {useCases.map((u) => (
                <div key={u.dept} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-block text-xs font-bold text-white bg-primary rounded px-2 py-0.5">
                      {u.dept}
                    </span>
                  </div>
                  <div className="text-sm leading-7">
                    <span className="text-foreground/40 line-through mr-2">{u.before}</span>
                    <br />
                    <span className="text-foreground/75">{u.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

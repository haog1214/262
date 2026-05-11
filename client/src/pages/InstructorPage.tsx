import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const tags = ["#AI實戰應用", "#企業培訓", "#商業思維", "#生產力革命"];

export default function InstructorPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f4f2" }}>
      <SEO
        title="講師介紹"
        description="認識 262學習基地的 AI 課程講師，具備企業培訓、AI 工具應用、商業思維等豐富實戰經驗，帶你學以致用。"
        url="https://www.262.yc311.com.tw/instructor"
        image="https://www.262.yc311.com.tw/instructor-hao.jpg"
      />
      <Header />

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative w-full overflow-hidden">

          {/* Background geometric decoration */}
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
            {/* Diagonal stripe lines - top right */}
            <svg
              className="absolute top-0 right-0 opacity-[0.06]"
              width="420" height="420"
              viewBox="0 0 420 420"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 26 - 60}
                  y1="0"
                  x2={i * 26 + 360}
                  y2="420"
                  stroke="#000"
                  strokeWidth="1.2"
                />
              ))}
            </svg>
            {/* Thin horizontal rule at very top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-black opacity-10" />
          </div>

          {/* ── Section label ── */}
          <div className="relative z-10 flex items-center gap-4 px-8 md:px-16 pt-10 pb-8">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
              Instructor
            </span>
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400">
              01
            </span>
          </div>

          {/* ── Main photo + tagline ── */}
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-0" style={{ paddingLeft: "calc(2rem + 220px)", paddingRight: "2rem" }}>

            {/* Photo wrapper */}
            <div
              className="relative flex-shrink-0"
              style={{ width: "min(47.6vw, 544px)" }}
            >
              <img
                src="/instructor-hao.jpg"
                alt="HAO 老師"
                className="w-full object-cover object-top block"
                style={{ aspectRatio: "4/5" }}
              />

              {/* Subtle inner shadow on photo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.08)",
                }}
              />
            </div>

            {/* Tagline block — floats to the right, anchored to bottom of photo */}
            <div
              className="relative md:absolute md:bottom-0"
              style={{
                left: "min(47.6vw, 544px)",
                width: "max-content",
              }}
            >
              {/* Tagline — each line has CI blue background */}
              <div className="px-8 py-8 md:py-10 flex flex-col gap-2">
                <span
                  className="inline-block text-white font-black leading-snug tracking-wide px-3 py-1"
                  style={{
                    fontSize: "clamp(20px, 2.2vw, 32px)",
                    background: "#1B3A6B",
                    alignSelf: "flex-start",
                  }}
                >
                  從技術邏輯到商業實踐，
                </span>
                <span
                  className="text-white font-black leading-snug tracking-wide px-3 py-1 whitespace-nowrap"
                  style={{
                    fontSize: "clamp(20px, 2.2vw, 32px)",
                    background: "#1B3A6B",
                    display: "inline-block",
                    width: "max-content",
                  }}
                >
                  建立企業可持續進化的 AI 競爭力。
                </span>
              </div>

              {/* Tags row */}
              <div
                className="flex flex-wrap gap-x-4 gap-y-2 px-8 py-5"
                style={{ background: "#e8e8e6" }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-gray-600 tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Identity block ── */}
          <div className="relative z-10 pt-10 pb-16 flex items-start gap-6" style={{ paddingLeft: "calc(2rem + 220px)", paddingRight: "2rem" }}>
            {/* Vertical accent line */}
            <div className="w-[3px] self-stretch bg-black flex-shrink-0" style={{ minHeight: "64px" }} />

            <div>
              <p
                className="text-gray-500 font-medium tracking-widest mb-3"
                style={{ fontSize: "11px" }}
              >
                AI 商業應用培訓｜企業顧問講師
              </p>
              <h1
                className="font-black text-gray-900 tracking-tight leading-none"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                HAO 老師
              </h1>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black opacity-10" aria-hidden />
        </section>

        {/* ── Profile detail section ── */}
        <section
          className="px-8 md:px-16 py-20"
          style={{ background: "#ffffff" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Section marker */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-black" />
              <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                Profile
              </span>
              <div className="w-12 h-px bg-black" />
            </div>

            <p
              className="text-gray-600 leading-[2] mb-16"
              style={{ fontSize: "15px" }}
            >
              專注於協助企業將 AI 工具系統性地融入工作流程，從技術理解到策略落地，提供完整的培訓路徑。課程設計以「可立即應用」為核心原則，帶領學員在每一堂課中完成真實可用的成果。不只是傳授工具操作，而是從商業邏輯出發，建立可複製、可延伸的 AI 工作方法論。
            </p>

            {/* Expertise grid */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-12 h-px bg-black" />
              <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                Expertise
              </span>
              <div className="w-12 h-px bg-black" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "AI 工具實戰",
                  desc: "Gemini、ChatGPT、Copilot 等主流工具的企業導入與員工培訓，從零到可用。",
                },
                {
                  num: "02",
                  title: "商業邏輯整合",
                  desc: "將 AI 能力對應到銷售、行銷、營運等具體業務場景，產生可量化的效益。",
                },
                {
                  num: "03",
                  title: "組織能力建設",
                  desc: "設計可複製的 AI 工作流，幫助團隊建立持續自我升級的長期能力。",
                },
              ].map((item) => (
                <div key={item.num} className="group flex flex-col items-center">
                  <p
                    className="font-black text-gray-200 mb-3 leading-none"
                    style={{ fontSize: "36px" }}
                  >
                    {item.num}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-3 text-base tracking-wide">
                    {item.title}
                  </h3>
                  <div className="w-8 h-[2px] bg-black mb-4" />
                  <p className="text-gray-500 leading-7 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

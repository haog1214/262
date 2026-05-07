import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Users, Lightbulb, TrendingUp, Award, BookOpen, Briefcase, Monitor, Mic, Building2 } from "lucide-react";

const directions = [
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "AI工具應用與企業導入",
    desc: "協助企業與個人學會運用 AI 提升工作效率、內容產出與營運決策能力。",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "數位行銷與品牌經營",
    desc: "從社群內容、短影音、廣告文案到顧客經營，協助品牌建立更有效的行銷流程。",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "電商與系統應用課程",
    desc: "結合傳啓資訊長期服務電商與企業系統的經驗，協助學員理解數位工具如何真正落地。",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "企業內訓與顧問培訓",
    desc: "針對企業需求規劃客製化課程，協助團隊提升數位素養、管理效率與市場競爭力。",
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "跨領域專業講座與工作坊",
    desc: "邀請不同產業的專家分享實務經驗，讓學員接觸更多市場觀點與創新方法。",
  },
];

const pillars = [
  {
    icon: <BookOpen className="w-7 h-7" />,
    label: "企業",
    desc: "協助團隊升級的培訓場域",
  },
  {
    icon: <Award className="w-7 h-7" />,
    label: "講師",
    desc: "穩定開課、建立品牌、連結學員的平台",
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    label: "學員",
    desc: "持續學習新技能、拓展視野、提升職場競爭力的據點",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#1B3A6B", minHeight: "520px" }}>
          {/* Grid decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <svg className="absolute right-0 top-0 w-[560px] h-full opacity-[0.07]" preserveAspectRatio="xMaxYMin slice" viewBox="0 0 560 520">
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="520" stroke="#fff" strokeWidth="1" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="560" y2={i * 50} stroke="#fff" strokeWidth="1" />
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white opacity-10" />
          </div>

          <div className="container relative z-10 py-20 md:py-28">
            {/* Label */}
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#D4AF37" }}>About Us</span>
              <div className="w-16 h-px" style={{ backgroundColor: "#D4AF37" }} />
            </div>

            {/* Headline */}
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6" style={{ color: "#F5F0E8" }}>
                262<br />培訓學院
              </h1>
              <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.75)" }}>
                傳啓資訊打造的專業課程教學平台<br />
                <span className="text-base" style={{ color: "rgba(245,240,232,0.5)" }}>近30年資訊服務經驗 × 實戰型師資 × 台中便利場域</span>
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-10 mt-14">
              {[
                { num: "30", unit: "年", label: "資訊服務經驗" },
                { num: "5+", unit: "", label: "專業課程領域" },
                { num: "262", unit: "號", label: "河南路二段" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black" style={{ color: "#D4AF37" }}>{s.num}</span>
                    <span className="text-lg font-bold mb-1" style={{ color: "#D4AF37" }}>{s.unit}</span>
                  </div>
                  <p className="text-xs tracking-wider mt-1" style={{ color: "rgba(245,240,232,0.5)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="py-20" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A6B" }}>學院簡介</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Text */}
              <div className="space-y-5 text-[16px] leading-relaxed text-gray-700">
                <p>
                  262培訓學院是由深耕資訊服務領域近<strong className="text-gray-900">30年</strong>的傳啓資訊股份有限公司和有椿有限公司共同所打造的專業課程教學平台。長期協助企業進行網站建置、系統開發、電商平台規劃、數位行銷整合與企業數位轉型，累積了豐富的跨產業實戰經驗。
                </p>
                <p>
                  因此，262培訓學院不只是單純提供上課空間，更希望成為一個結合專業知識、實務經驗、產業應用與人才培育的學習基地。
                </p>
                <p>
                  我們相信，好的課程不應該只是知識輸出，而是要協助學員完成「從聽懂、會用，到真正落地」的轉換。
                </p>
              </div>

              {/* Image placeholder */}
              <div
                className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] flex items-center justify-center"
                style={{ backgroundColor: "#dde4ef", border: "2px dashed #1B3A6B30" }}
              >
                <div className="text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: "#1B3A6B40" }} />
                  <p className="text-sm" style={{ color: "#1B3A6B60" }}>學院外觀 / 環境照片</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCATION ── */}
        <section className="py-20 bg-white">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A6B" }}>場域位置</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image placeholder */}
              <div
                className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] flex items-center justify-center order-2 md:order-1"
                style={{ backgroundColor: "#f0f4fa", border: "2px dashed #1B3A6B30" }}
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: "#1B3A6B40" }} />
                  <p className="text-sm" style={{ color: "#1B3A6B60" }}>地點 / 周邊環境照片</p>
                </div>
              </div>

              {/* Text */}
              <div className="order-1 md:order-2 space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ backgroundColor: "#E8EEF7" }}>
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#1B3A6B" }} />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">台中市西屯區河南路二段262號3樓之11</p>
                    <p className="text-sm text-gray-500">鄰近逢甲大學商圈，周邊停車便利</p>
                  </div>
                </div>
                <p className="text-[16px] leading-relaxed text-gray-700">
                  學院鄰近台中國際展覽館、高速公路與快速道路，不論是台中在地學員、外縣市講師，或企業團隊前來參與課程與培訓，都能快速抵達。
                </p>
                <p className="text-[16px] leading-relaxed text-gray-700">
                  適合舉辦企業內訓、專業課程、講座分享、工作坊、顧問培訓與小型交流活動。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO IS IT FOR ── */}
        <section className="py-20" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#F5F0E8" }}>這裡適合誰</h2>
            </div>
            <p className="text-base mb-12 ml-5" style={{ color: "rgba(245,240,232,0.55)" }}>
              三種角色，一個共同成長的空間
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((p) => (
                <div key={p.label} className="rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "#D4AF37" }}>
                    <span style={{ color: "#1B3A6B" }}>{p.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#F5F0E8" }}>{p.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEACHING PHILOSOPHY ── */}
        <section className="py-20" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A6B" }}>專業師資，多元課程</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-5 text-[16px] leading-relaxed text-gray-700">
                <p>
                  262培訓學院重視「<strong className="text-gray-900">實戰型教學</strong>」與「<strong className="text-gray-900">產業型師資</strong>」。我們期待邀請來自不同領域的專業講師、企業顧問、產業實務工作者與數位工具應用專家，共同打造多元化的課程內容。
                </p>
                <p>
                  師資陣容涵蓋 AI 應用、數位行銷、電商經營、品牌經營、影音製作、系統導入、商業簡報、企業管理、財務應用、服務流程優化等領域，讓學員不只學會觀念，更能把所學直接應用在工作與企業經營中。
                </p>
                <p>
                  262培訓學院強調案例教學、工具實作、情境演練與產業經驗分享，讓每一堂課都更貼近真實工作現場。
                </p>
              </div>

              {/* Image placeholder */}
              <div
                className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] flex items-center justify-center"
                style={{ backgroundColor: "#dde4ef", border: "2px dashed #1B3A6B30" }}
              >
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-3" style={{ color: "#1B3A6B40" }} />
                  <p className="text-sm" style={{ color: "#1B3A6B60" }}>課程現場 / 師資照片</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FUTURE DIRECTIONS ── */}
        <section className="py-20 bg-white">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A6B" }}>未來課程方向</h2>
            </div>
            <p className="text-base mb-12 ml-5 text-gray-500">持續發展，與時俱進</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {directions.map((d, i) => (
                <div
                  key={i}
                  className="group rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg"
                  style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#D4AF37"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E8F0"; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#E8EEF7" }}>
                    <span style={{ color: "#1B3A6B" }}>{d.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-[15px]">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRAND SPIRIT ── */}
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <svg className="absolute left-0 bottom-0 opacity-[0.05] w-[400px]" viewBox="0 0 400 400">
              <circle cx="0" cy="400" r="300" fill="none" stroke="#fff" strokeWidth="80" />
            </svg>
          </div>
          <div className="container max-w-3xl relative z-10 text-center">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-6 block" style={{ color: "#D4AF37" }}>Brand Spirit</span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-8" style={{ color: "#F5F0E8" }}>
              不只是教室，<br />而是能力升級的起點
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(245,240,232,0.7)" }}>
              262培訓學院，不只是教室，而是一個讓專業被看見、讓經驗被傳承、讓技能被實踐的學習平台。
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(245,240,232,0.7)" }}>
              我們以近30年的資訊產業經驗為基礎，結合專業師資、便利場地與實務課程，協助企業與個人在快速變動的數位時代中，持續學習、快速應用、穩健成長。
            </p>
            <div className="border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-lg font-light italic" style={{ color: "rgba(245,240,232,0.55)" }}>
                這裡，是課程開始的地方；<br />
                也是能力升級、資源連結與商業機會發生的地方。
              </p>
            </div>
          </div>
        </section>

        {/* ── COMPANY INFO ── */}
        <section className="py-14" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
              <h2 className="text-xl font-bold" style={{ color: "#1B3A6B" }}>公司資訊</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "公司名稱", value: "二六二有限公司" },
                { label: "統一編號", value: "60357703" },
                { label: "公司地址", value: "台中市西屯區河南路二段262號3樓之11" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl px-6 py-5 shadow-sm border border-gray-100">
                  <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#1B3A6B80" }}>{item.label}</p>
                  <p className="text-[15px] font-medium text-gray-800">{item.value}</p>
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

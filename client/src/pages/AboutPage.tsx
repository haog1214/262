import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Monitor, TrendingUp, Briefcase, Users, Mic, Building2 } from "lucide-react";

const directions = [
  { icon: <Monitor className="w-5 h-5" />, title: "AI工具應用與企業導入", desc: "協助企業與個人學會運用 AI 提升工作效率、內容產出與營運決策能力。" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "數位行銷與品牌經營", desc: "從社群內容、短影音、廣告文案到顧客經營，協助品牌建立更有效的行銷流程。" },
  { icon: <Briefcase className="w-5 h-5" />, title: "電商與系統應用課程", desc: "結合傳啓資訊長期服務電商與企業系統的經驗，協助學員理解數位工具如何真正落地。" },
  { icon: <Users className="w-5 h-5" />, title: "企業內訓與顧問培訓", desc: "針對企業需求規劃客製化課程，協助團隊提升數位素養、管理效率與市場競爭力。" },
  { icon: <Mic className="w-5 h-5" />, title: "跨領域專業講座與工作坊", desc: "邀請不同產業的專家分享實務經驗，讓學員接觸更多市場觀點與創新方法。" },
];


export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fff" }}>
      <Header />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#1B3A6B", minHeight: "560px" }}>
          {/* Diagonal stripes - top right */}
          <div className="absolute top-0 right-0 w-[480px] h-full overflow-hidden pointer-events-none" aria-hidden>
            <svg className="absolute top-0 right-0 opacity-[0.08]" width="480" height="560" viewBox="0 0 480 560">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={i} x1={i * 28 - 80} y1="0" x2={i * 28 + 480} y2="560" stroke="#ffffff" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
          {/* Gold accent line top */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#D4AF37" }} />

          <div className="container relative z-10 py-24 md:py-32">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px" style={{ backgroundColor: "#D4AF37" }} />
              <span className="text-[11px] font-semibold tracking-[0.35em] uppercase" style={{ color: "#D4AF37" }}>About Us</span>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight whitespace-nowrap" style={{ color: "#F5F0E8" }}>
                262培訓學院
              </h1>
              <p className="text-base md:text-lg leading-relaxed mb-14" style={{ color: "rgba(245,240,232,0.65)" }}>
                台中西屯專業課程教室，鄰近逢甲大學，交通便利、好停車。<br />
                提供企業內訓、講座活動、AI課程平台
              </p>
              <div className="flex flex-wrap gap-10 md:gap-14">
                {[
                  { value: "30", unit: "年", label: "資訊服務經驗", pct: 0.75 },
                  { value: "1100", unit: "+", label: "輔導過學員", pct: 0.85 },
                  { value: "50", unit: "+", label: "輔導過的企業", pct: 0.65 },
                ].map((s) => {
                  const total = 54;
                  const active = Math.round(total * s.pct);
                  const cx = 50, cy = 50;
                  const tickOuter = 46, tickInnerA = 38, tickInnerI = 43;
                  const endAngle = ((active - 1) / total) * 2 * Math.PI - Math.PI / 2;
                  const dotX = cx + Math.cos(endAngle) * (tickOuter - 1);
                  const dotY = cy + Math.sin(endAngle) * (tickOuter - 1);
                  return (
                    <div key={s.label} className="flex flex-col items-center">
                      <div className="relative" style={{ width: 130, height: 130 }}>
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Corner brackets */}
                          <path d="M6,17 L6,6 L17,6" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.6"/>
                          <path d="M83,6 L94,6 L94,17" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.6"/>
                          <path d="M6,83 L6,94 L17,94" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.6"/>
                          <path d="M94,83 L94,94 L83,94" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.6"/>
                          {/* Inner ring */}
                          <circle cx={cx} cy={cy} r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
                          {/* Tick marks */}
                          {Array.from({ length: total }).map((_, i) => {
                            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
                            const on = i < active;
                            const x1 = cx + Math.cos(angle) * tickOuter;
                            const y1 = cy + Math.sin(angle) * tickOuter;
                            const x2 = cx + Math.cos(angle) * (on ? tickInnerA : tickInnerI);
                            const y2 = cy + Math.sin(angle) * (on ? tickInnerA : tickInnerI);
                            return (
                              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={on ? "#D4AF37" : "rgba(255,255,255,0.13)"}
                                strokeWidth={on ? "2" : "1"}
                                strokeLinecap="round"
                              />
                            );
                          })}
                          {/* End glow dot */}
                          <circle cx={dotX} cy={dotY} r="2.5" fill="#D4AF37" opacity="0.9"/>
                          <circle cx={dotX} cy={dotY} r="4" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3"/>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className="font-black leading-none"
                            style={{
                              color: "#D4AF37",
                              fontSize: s.value.length > 2 ? "1.4rem" : "1.9rem",
                              textShadow: "0 0 18px rgba(212,175,55,0.55)",
                            }}
                          >
                            {s.value}
                          </span>
                          <span className="text-sm font-bold mt-0.5" style={{ color: "#D4AF37" }}>{s.unit}</span>
                        </div>
                      </div>
                      <p className="text-[11px] tracking-widest mt-2 text-center uppercase" style={{ color: "rgba(245,240,232,0.4)" }}>{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="relative">
            {/* Full bleed layout */}
            <div className="flex flex-col md:flex-row min-h-[540px]">

              {/* Left: accent panel */}
              <div className="relative md:w-[45%] flex-shrink-0 p-10 md:p-16 flex flex-col justify-center" style={{ backgroundColor: "#E8EEF7" }}>
                {/* Section label */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-5 h-5 rounded-sm flex-shrink-0" style={{ backgroundColor: "#1B3A6B" }} />
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: "#1B3A6B" }}>Mission</span>
                </div>
                <h2 className="text-[24px] font-black leading-tight mb-4" style={{ color: "#1B3A6B" }}>
                  使命
                </h2>
                <p className="text-[20px] font-bold mb-6" style={{ color: "#1B3A6B" }}>
                  讓專業被看見，讓經驗被傳承
                </p>
                <div className="space-y-4 text-[18px] leading-relaxed" style={{ color: "#334155" }}>
                  <p>
                    262培訓學院是由深耕資訊服務領域近<strong>30年</strong>的傳啓資訊股份有限公司和有椿有限公司共同打造的專業課程教學平台。長期協助企業進行網站建置、系統開發、電商平台規劃、數位行銷整合與企業數位轉型，累積了豐富的跨產業實戰經驗。
                  </p>
                  <p>
                    因此，262培訓學院不只是單純提供上課空間，更希望成為一個結合專業知識、實務經驗、產業應用與人才培育的學習基地。
                  </p>
                  <p>
                    我們相信，好的課程不應該只是知識輸出，而是要協助學員完成「從聽懂、會用，到真正落地」的轉換。
                  </p>
                </div>
              </div>

              {/* Right: photo */}
              <div className="md:w-[55%] flex-shrink-0 relative min-h-[320px] md:min-h-0">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "#dde4ef" }}
                >
                  <div className="text-center">
                    <Building2 className="w-14 h-14 mx-auto mb-3" style={{ color: "#1B3A6B30" }} />
                    <p className="text-sm" style={{ color: "#1B3A6B50" }}>學院外觀 / 環境照片</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── VISION ── */}
        <section className="relative overflow-hidden bg-white">
          {/* Watermark text */}
          <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden" aria-hidden>
            <span
              className="font-black whitespace-nowrap"
              style={{
                fontSize: "clamp(100px, 20vw, 220px)",
                color: "rgba(27,58,107,0.04)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                paddingLeft: "2rem",
              }}
            >
              VISION
            </span>
          </div>
          {/* Diagonal stripes right */}
          <div className="absolute top-0 right-0 w-[300px] h-full overflow-hidden pointer-events-none" aria-hidden>
            <svg className="absolute top-0 right-0 opacity-[0.06]" width="300" height="600" viewBox="0 0 300 600">
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={i} x1={i * 24 - 40} y1="0" x2={i * 24 + 280} y2="600" stroke="#1B3A6B" strokeWidth="2" />
              ))}
            </svg>
          </div>

          <div className="container relative z-10 py-24">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              {/* Left photo */}
              <div className="md:w-1/2">
                <div
                  className="w-full aspect-[4/3] rounded-sm shadow-2xl flex items-center justify-center"
                  style={{ backgroundColor: "#E8EEF7", border: "1px solid #1B3A6B15" }}
                >
                  <div className="text-center">
                    <MapPin className="w-14 h-14 mx-auto mb-3" style={{ color: "#1B3A6B30" }} />
                    <p className="text-sm" style={{ color: "#1B3A6B50" }}>地點 / 周邊環境照片</p>
                  </div>
                </div>
              </div>
              {/* Right text */}
              <div className="md:w-1/2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-5 h-5 rotate-45 flex-shrink-0" style={{ backgroundColor: "#D4AF37" }} />
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: "#D4AF37" }}>Vision</span>
                </div>
                <h2 className="text-[24px] font-black leading-tight mb-4" style={{ color: "#1B3A6B" }}>
                  願景
                </h2>
                <p className="text-[20px] font-bold mb-6" style={{ color: "#1B3A6B" }}>
                  台中最具實戰力的培訓平台
                </p>
                <div className="space-y-4 text-[18px] leading-relaxed text-gray-700">
                  <p>
                    262培訓學院定位為台中地區兼具交通便利、產業實務與專業課程資源的培訓平台。我們希望整合傳啓資訊近30年的資訊服務經驗，結合多元師資與不同產業的專業課程，打造一個適合企業、講師與學員共同成長的知識交流空間。
                  </p>
                  <p>
                    學院鄰近逢甲大學商圈，鄰近台中國際展覽館、高速公路與快速道路，不論是台中在地學員、外縣市講師，或企業團隊前來參與課程與培訓，都能快速抵達。
                  </p>
                  <p>
                    適合舉辦企業內訓、專業課程、講座分享、工作坊、顧問培訓與小型交流活動。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FULL-WIDTH PHOTO BREAK ── */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "340px", backgroundColor: "#c8d3e6" }}
        >
          <div className="text-center">
            <Building2 className="w-14 h-14 mx-auto mb-3" style={{ color: "#1B3A6B30" }} />
            <p className="text-sm" style={{ color: "#1B3A6B50" }}>學院全景 / 課程現場照片（全幅）</p>
          </div>
        </div>

        {/* ── DIRECTIONS ── Image 2 style: bold left header + right list ── */}
        <section className="py-24" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row gap-16">
              {/* Left: large heading */}
              <div className="md:w-[38%] flex-shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-5 h-5 flex-shrink-0" style={{ backgroundColor: "#D4AF37" }} />
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: "#D4AF37" }}>Direction</span>
                </div>
                <h2 className="text-[24px] font-black leading-tight mb-6" style={{ color: "#1B3A6B" }}>
                  未來<br />課程方向
                </h2>
                <p className="text-[18px] leading-relaxed text-gray-600">
                  262培訓學院重視「實戰型教學」與「產業型師資」，持續發展多元課程領域，讓每一堂課都更貼近真實工作現場。
                </p>
              </div>

              {/* Right: list with dividers — Image 2 style */}
              <div className="flex-1 divide-y" style={{ borderColor: "#D4AF3740" }}>
                {directions.map((d) => (
                  <div key={d.title} className="flex items-start gap-5 py-6">
                    <div
                      className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "#E8EEF7" }}
                    >
                      <span style={{ color: "#1B3A6B" }}>{d.icon}</span>
                    </div>
                    <div>
                      <p className="text-[20px] font-bold text-gray-900 mb-1">{d.title}</p>
                      <p className="text-[18px] leading-relaxed text-gray-500">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BRAND SPIRIT — large typography, Image 2 "WHY WE DO THIS" style ── */}
        <section className="relative overflow-hidden py-32" style={{ backgroundColor: "#1B3A6B" }}>
          {/* Circle decoration */}
          <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ border: "80px solid rgba(255,255,255,0.03)" }} aria-hidden />
          <div className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full pointer-events-none" style={{ border: "40px solid rgba(212,175,55,0.07)" }} aria-hidden />

          <div className="container max-w-3xl relative z-10 text-center">
            <span className="text-[11px] font-bold tracking-[0.35em] uppercase block mb-8" style={{ color: "#D4AF37" }}>Brand Spirit</span>
            <h2
              className="font-black leading-tight mb-10"
              style={{ color: "#F5F0E8", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              不只是教室，<br />而是能力升級的起點
            </h2>
            <div className="w-10 h-0.5 mx-auto mb-10" style={{ backgroundColor: "#D4AF37" }} />
            <p className="text-[18px] leading-relaxed mb-6" style={{ color: "rgba(245,240,232,0.65)" }}>
              262培訓學院，不只是教室，而是一個讓專業被看見、讓經驗被傳承、讓技能被實踐的學習平台。我們以近30年的資訊產業經驗為基礎，結合專業師資、便利場地與實務課程，協助企業與個人在快速變動的數位時代中，持續學習、快速應用、穩健成長。
            </p>
            <p
              className="font-light italic"
              style={{ color: "rgba(245,240,232,0.4)", fontSize: "1.05rem", lineHeight: 2 }}
            >
              這裡，是課程開始的地方；<br />
              也是能力升級、資源連結與商業機會發生的地方。
            </p>
          </div>
        </section>

        {/* ── MAP ── */}
        <section className="bg-white">
          {/* Full-width Google Map */}
          <div className="w-full" style={{ height: "420px" }}>
            <iframe
              title="262培訓學院地圖"
              src="https://maps.google.com/maps?q=台中市西屯區河南路二段262號3樓之11&output=embed&hl=zh-TW&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

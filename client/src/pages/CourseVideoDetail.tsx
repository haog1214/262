import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, CheckCircle2, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useCourseSchedules } from "@/hooks/useCourseSchedules";

const COURSE_ID = 1;

const curriculum = [
  {
    no: 1,
    title: "創意發想與視覺生成",
    desc: "AI 腳本導航：利用 AI 快速生成具備吸引力的敘事腳本。",
  },
  {
    no: 2,
    title: "Banana AI 繪圖實務",
    desc: "精準提示詞（Prompt）撰寫，生成一致性風格的高質感圖像。",
  },
  {
    no: 3,
    title: "AI 文字轉語音（TTS）",
    desc: "AI 數位旁白配音，打造影片靈魂。",
  },
  {
    no: 4,
    title: "圖片轉動畫技術",
    desc: "使用 AI 工具讓靜態 Banana 圖像產生自然的動態效果。",
  },
  {
    no: 5,
    title: "影音合成與實作發表",
    desc: "分鏡轉場、配音對位與背景音樂合成。",
  },
];

const targets = [
  {
    icon: "📣",
    label: "社群行銷人員",
    desc: "需大量且快速產出高品質社群廣告或內容者。",
  },
  {
    icon: "🎬",
    label: "個人創作者",
    desc: "欲降低拍攝成本，轉向 AI 自動化影音製作者。",
  },
  {
    icon: "🏢",
    label: "中小企業主",
    desc: "想利用 AI 提升產品行銷視覺，進行數位轉型的經營者。",
  },
  {
    icon: "✨",
    label: "AI 創作初學者",
    desc: "想學會使用 Banana AI 進行創意落地，無須繪圖基礎的人士。",
  },
];

const highlights = [
  "全流程 AI 協作，3 小時學完一條龍",
  "無需繪圖基礎，零門檻入門",
  "Banana AI 高質感圖像生成實作",
  "AI 配音 + 動態化 + 剪輯一次學會",
  "實作發表，課堂完成作品帶回家",
];

export default function CourseVideoDetail() {
  const { sessions } = useCourseSchedules(COURSE_ID);
  const [selectedSession, setSelectedSession] = useState("");
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession((sessions.find(s => !s.isFull && !s.enterprise) ?? sessions[0]).id);
    }
  }, [sessions, selectedSession]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="零基礎也能做專業短片｜AI 短影音製作課"
        description="不需要拍攝設備，用 AI 工具製作吸睛短影音。學習腳本生成、AI 配音、字幕、剪輯一條龍，快速產出高品質內容。台中 AI 課程。"
        url="https://www.262.yc311.com.tw/course/ai-video"
        image="https://www.262.yc311.com.tw/零基礎也能做專業短片.jpg"
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="text-gray-900" style={{ backgroundColor: "#f2f2f2" }}>
          <div className="container py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* 左側文案 */}
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "#E8EEF7", border: "1px solid #1B3A6B", color: "#1B3A6B" }}>
                  6H 特訓班
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  零基礎也能做專業短片
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  從腳本到成品一次完成
                </p>
                <p className="text-base text-gray-600 leading-8">
                  本課程專為追求高效創作的學員設計，採用「全流程 AI 協作」模式。教學內容涵蓋從故事腳本構思、<strong>Banana AI 高質感繪圖</strong>、靜態圖片動態化，到最終的 AI 配音與剪輯合成。學員將在三小時內掌握 AI 影音創作的核心邏輯，並能獨立產出具專業水準的短影音內容。
                </p>

                {/* 課程規格 */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <MapPin className="w-4 h-4 text-red-500" /> 台中市西屯區河南路二段262號7樓3
                  </span>
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Clock className="w-4 h-4" /> 課程時數：6 小時
                  </span>
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Users className="w-4 h-4" /> 適合所有程度
                  </span>
                </div>

                {/* 日期選擇 + 價格 + CTA */}
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
                  {/* 日期選擇 */}
                  <div className="space-y-2" style={{ maxWidth: "460px", width: "100%" }}>
                    {sessions.map((s) => {
                      const isSelected = selectedSession === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => { if (!s.isFull && !s.enterprise) setSelectedSession(s.id); else if (s.enterprise) setSelectedSession(s.id); }}
                          className="w-full text-left rounded-xl px-5 py-4 transition-all border-2"
                          style={{
                            borderColor: s.isFull ? "#e5e7eb" : (isSelected ? "#D4AF37" : "#e5e7eb"),
                            background: s.isFull ? "#f9fafb" : "#fff",
                            cursor: s.isFull ? "not-allowed" : "pointer",
                          }}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: s.isFull ? "#d1d5db" : (isSelected ? "#D4AF37" : "#d1d5db") }}
                              />
                              {s.enterprise ? (
                                <span className="font-semibold text-[17px] text-gray-900">企業包班專案</span>
                              ) : (
                                <>
                                  <span className={`font-semibold text-[17px] ${s.isFull ? "text-gray-400 line-through" : "text-gray-900"}`}>{s.date}（{s.weekday}）</span>
                                  <span className="text-[17px] text-gray-500">{s.time}</span>
                                </>
                              )}
                            </div>
                            {s.enterprise ? (
                              <span className="text-[13px] text-gray-400">滿 10 人以上</span>
                            ) : s.isFull ? (
                              <span className="text-[13px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>額滿</span>
                            ) : (
                              <span className="text-[14px] text-gray-400">{s.remaining}位</span>
                            )}
                          </div>
                          {s.enterprise && (
                            <p className="text-[13px] text-gray-400 pl-[18px] mt-0.5">日期 / 時間：專員洽談</p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* 價格 + 按鈕 */}
                  <div className="flex-shrink-0" style={{ marginLeft: "100px" }}>
                    <p className="text-3xl font-bold text-gray-900">NT$ 4,000</p>
                    <p className="text-gray-400 line-through text-sm mb-3">NT$ 6,000</p>
                    <a
                      href={`/enroll?course=ai-video&session=${selectedSession}`}
                      className="px-8 font-bold rounded-full transition-colors shadow-lg text-base" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF", marginTop: "15px", display: "inline-block", paddingTop: "calc(0.75rem * 0.9)", paddingBottom: "calc(0.75rem * 0.9)" }}
                    >
                      立即報名
                    </a>
                  </div>
                </div>
              </div>

              {/* 右側：導覽按鈕 + 海報 */}
              <div className="hidden md:flex flex-col items-end gap-4">
                {/* 返回 / 下一篇 */}
                <div className="flex items-center gap-3 w-[90%] justify-end">
                  <Link href="/">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white" style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}>
                      <ArrowLeft className="w-4 h-4" />
                      返回課程列表
                    </a>
                  </Link>
                  <Link href="/course/ai-life">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                      下一篇課程
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>

                {/* 海報：縮小 10% */}
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square" style={{ width: "90%" }}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/零基礎也能做專業短片.jpg')" }}
                  />
                </div>
                <a
                  href="https://maps.app.goo.gl/xXbkG9SETJ4N21Do7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  style={{ width: "90%" }}
                >
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>上課地點：台中市西屯區河南路二段262號7樓3</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 1. 課程大綱 */}
        <section className="py-14" style={{ backgroundColor: "#E8EEF7" }}>
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B3A6B" }}>課程大綱</h2>
            <div className="space-y-3">
              {curriculum.map((item) => (
                <div
                  key={item.no}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 group transition-colors"
                  style={{ borderColor: undefined }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#D4AF37")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
                >
                  <span className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: "#E8EEF7", color: "#1B3A6B" }}>
                    {item.no}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-1 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. 你將學到什麼 */}
        <section className="py-14" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "#1B3A6B" }}>你將學到什麼</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#2E7D32" }} />
                  <p className="text-gray-800 text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 適合對象 */}
        <section className="py-14">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B3A6B" }}>適合對象</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {targets.map((t, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all" onMouseEnter={e => (e.currentTarget.style.borderColor = "#D4AF37")} onMouseLeave={e => (e.currentTarget.style.borderColor = "")}>
                  <span className="text-3xl flex-shrink-0">{t.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{t.label}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 報名區塊 */}
        <section id="enroll" className="py-16" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="container max-w-2xl text-center space-y-6" style={{ color: "#F5F0E8" }}>
            <h2 className="text-3xl font-bold">準備好開始了嗎？</h2>
            <p style={{ color: "rgba(245,240,232,0.8)" }}>只需 6 小時，帶走一部屬於你的 AI 短影音作品</p>
            <div>
              <a
                href={`/enroll?course=ai-video&session=${selectedSession}`}
                className="inline-block font-bold rounded-full transition-colors shadow-xl" style={{ backgroundColor: "#D4AF37", color: "#1B3A6B", padding: "calc(1rem * 0.8) calc(2.5rem * 0.8)", fontSize: "calc(1.125rem * 0.8)" }}
              >
                立即報名
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sessions = [
  { id: 1, date: "2026/5/14", weekday: "四", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 2, date: "2026/5/21", weekday: "四", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 3, date: "2026/5/28", weekday: "四", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 99, date: "", weekday: "", time: "", remaining: 0, enterprise: true },
];

const curriculum = [
  {
    no: 1,
    title: "認識 AI 工具",
    desc: "手機如何安裝 ChatGPT、Gemini，協助安裝並設定官方正版工具。",
  },
  {
    no: 2,
    title: "AI 工具對話",
    desc: "Prompt 提問技巧：學習「精準指令」邏輯，讓 ChatGPT 不再胡言亂語，成為你的私人顧問。",
  },
  {
    no: 3,
    title: "Google 生態系整合",
    desc: "實測利用 Gemini 快速彙整 Email、自動排入行事曆、管理待辦清單及筆記記錄。",
  },
  {
    no: 4,
    title: "香蕉（Banana）AI 繪圖",
    desc: "運用最新的繪圖模型，只需輸入文字，即可在手機上創作出專業級畫作。",
  },
  {
    no: 5,
    title: "影像動態化技術",
    desc: "AI 工具將靜態照片轉化為短影片，掌握社群吸睛密碼。",
  },
];

const targets = [
  {
    icon: "👴",
    label: "科技小白／長輩朋友",
    desc: "想了解 AI 卻不知從何下手，需要手把手教學者。",
  },
  {
    icon: "⏰",
    label: "對生活品質有追求的你",
    desc: "想用 AI 管理生活大小事，騰出更多個人時間。",
  },
  {
    icon: "📱",
    label: "手機重度使用者",
    desc: "習慣用手機處理大小事，希望將 AI 無縫融入日常的人。",
  },
  {
    icon: "🌱",
    label: "AI 入門新手",
    desc: "對 AI 充滿好奇但缺乏程式背景，需要零門檻入門課程者。",
  },
];

const highlights = [
  "手機直接操作，零程式碼入門",
  "正版 ChatGPT 與 Gemini 安裝設定全攻略",
  "精準 Prompt 技巧，讓 AI 真正聽懂你",
  "Google 生態系整合：Email、行事曆一鍵搞定",
  "Banana AI 繪圖實作，手機也能創作專業畫作",
  "靜態照片動態化，打造吸睛社群內容",
];

export default function CourseLifeDetail() {
  const [selectedSession, setSelectedSession] = useState(sessions[0].id);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="text-gray-900" style={{ backgroundColor: "#f2f2f2" }}>
          <div className="container py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "#E8EEF7", border: "1px solid #1B3A6B", color: "#1B3A6B" }}>
                  3H 特訓班
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  讓 AI 幫你省時間
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  學會手機 AI 工具應用，掌定生活大小事
                </p>
                <p className="text-base text-gray-600 leading-8">
                  本課程專為科技小白與長輩朋友設計，採「漸進式」教學。從基礎的 <strong>ChatGPT、Gemini 安裝設定</strong>出發，學習精準提問技巧，再深入 Google 生態系整合，最後動手體驗 Banana AI 繪圖與影像動態化，讓一支手機成為你最強大的 AI 工具。
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Clock className="w-4 h-4" /> 課程時數：3 小時
                  </span>
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Users className="w-4 h-4" /> 零基礎友善
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
                  <div className="space-y-2" style={{ maxWidth: "460px", width: "100%" }}>
                    {sessions.map((s) => {
                      const isSelected = selectedSession === s.id;
                      return (
                        <button key={s.id} onClick={() => setSelectedSession(s.id)}
                          className="w-full text-left rounded-xl px-5 py-4 transition-all border-2 bg-white"
                          style={{ borderColor: isSelected ? "#D4AF37" : "#e5e7eb" }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected ? "#D4AF37" : "#d1d5db" }} />
                              {s.enterprise ? (
                                <span className="font-semibold text-[17px] text-gray-900">企業包班專案</span>
                              ) : (
                                <>
                                  <span className="font-semibold text-[17px] text-gray-900">{s.date}（{s.weekday}）</span>
                                  <span className="text-[17px] text-gray-500">{s.time}</span>
                                </>
                              )}
                            </div>
                            {s.enterprise ? (
                              <span className="text-[13px] text-gray-400">滿 10 人以上</span>
                            ) : (
                              <span className="text-[14px] text-gray-400">剩餘 {s.remaining} 個名額</span>
                            )}
                          </div>
                          {s.enterprise && <p className="text-[13px] text-gray-400 pl-[18px] mt-0.5">日期 / 時間：專員洽談</p>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex-shrink-0" style={{ marginLeft: "100px" }}>
                    <p className="text-gray-400 line-through text-sm">NT$ 4,000</p>
                    <p className="text-3xl font-bold text-gray-900 mb-3">NT$ 2,000</p>
                    <a href="/enroll?course=ai-life" className="px-8 font-bold rounded-full transition-colors shadow-lg text-base"
                      style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF", marginTop: "15px", display: "inline-block", paddingTop: "calc(0.75rem * 0.9)", paddingBottom: "calc(0.75rem * 0.9)" }}>
                      立即報名
                    </a>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-4">
                <div className="flex items-center gap-3 w-[90%] justify-end">
                  <Link href="/">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white" style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}>
                      <ArrowLeft className="w-4 h-4" />
                      返回課程列表
                    </a>
                  </Link>
                  <Link href="/course/gemini">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                      下一篇課程
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square bg-gray-200" style={{ width: "90%" }}>
                  <img
                    src="/課程海報_工作區域1複本.webp"
                    alt="AI生活效率班"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 課程大綱 */}
        <section className="py-14" style={{ backgroundColor: "#E8EEF7" }}>
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B3A6B" }}>課程大綱</h2>
            <div className="space-y-3">
              {curriculum.map((item) => (
                <div
                  key={item.no}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#D4AF37")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "")}
                >
                  <span className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8EEF7", color: "#1B3A6B" }}>
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

        {/* 你將學到什麼 */}
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

        {/* 適合對象 */}
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

        {/* 報名 */}
        <section id="enroll" className="py-16" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="container max-w-2xl text-center space-y-6" style={{ color: "#F5F0E8" }}>
            <h2 className="text-3xl font-bold">準備好開始了嗎？</h2>
            <p style={{ color: "rgba(245,240,232,0.8)" }}>只需 3 小時，手機就是你的 AI 生活助理</p>
            <div>
              <a href="/enroll?course=ai-life" className="inline-block font-bold rounded-full transition-colors shadow-xl"
                style={{ backgroundColor: "#D4AF37", color: "#1B3A6B", padding: "calc(1rem * 0.8) calc(2.5rem * 0.8)", fontSize: "calc(1.125rem * 0.8)" }}>
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

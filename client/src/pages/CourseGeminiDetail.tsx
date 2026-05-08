import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, CheckCircle2, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sessions = [
  { id: 1, date: "2026/5/11", weekday: "一", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 2, date: "2026/5/18", weekday: "一", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 3, date: "2026/5/25", weekday: "一", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 99, date: "", weekday: "", time: "", remaining: 0, enterprise: true },
];

const curriculum = [
  {
    no: 1,
    title: "Gemini 核心導論與環境建置",
    desc: "Gemini 模型版本解析（基礎版 vs. 進階訂閱版），對話介面優化技巧與指令（Prompt）邏輯基礎。",
  },
  {
    no: 2,
    title: "Google 生態系深度整合工作術",
    desc: "Gemini 與 Google 生態系統整合（Gmail、Office、行事曆、GoogleMap），規劃旅遊與商務路線。",
  },
  {
    no: 3,
    title: "多媒體創意視覺生成",
    desc: "Nano Banana 進階創作：掌握風格參數，進行高擬真、多風格的影像生成與編輯；利用文字／圖像生成動態影片。",
  },
  {
    no: 4,
    title: "個人化 AI 助手與故事化應用",
    desc: "Gem 專屬機器人設定、Canvas 網頁小程式撰寫、Storybook 多模態敘事創作。",
  },
];

const targets = [
  {
    icon: "💼",
    label: "職場辦公族",
    desc: "希望透過 AI 自動化處理繁瑣郵件與排程，提升工作效率者。",
  },
  {
    icon: "🎨",
    label: "內容創作者",
    desc: "對 AI 繪圖、短影音製作有需求，想縮短創作週期者。",
  },
  {
    icon: "📣",
    label: "行銷規劃人員",
    desc: "需要快速發想創意、產出視覺素材與企劃草案的專業人士。",
  },
  {
    icon: "🌍",
    label: "一般社會人士",
    desc: "想要對 Gemini 更了解，如何落實在生活與工作中。",
  },
];

const highlights = [
  "Gemini 版本全解析，選對方案省荷包",
  "Gmail、行事曆、地圖一鍵 AI 整合",
  "Nano Banana 高擬真影像生成實作",
  "Veo 影片生成技術，文字變動態影片",
  "打造專屬 Gem 機器人，針對你的工作場景客製化",
  "Canvas 網頁小程式，AI 幫你寫 code",
];

export default function CourseGeminiDetail() {
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
                  Gemini讓工作快一倍
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  打造你的AI工作助手
                </p>
                <p className="text-base text-gray-600 leading-8">
                  本課程帶你掌握 Gemini 的核心功能，從基礎模型認知出發，深度對接 <strong>Google 工作術（郵件、文件、行事曆、地圖）</strong>，進階解鎖 Nano Banana 影像藝術與 Veo 影片生成，最後透過自定義 Gem 打造個人化 AI 專家系統。
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <MapPin className="w-4 h-4 text-red-500" /> 台中市西屯區河南路二段262號7樓3
                  </span>
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Clock className="w-4 h-4" /> 課程時數：3 小時
                  </span>
                  <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                    <Users className="w-4 h-4" /> 適合所有程度
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
                    <p className="text-3xl font-bold text-gray-900">NT$ 2,000</p>
                    <p className="text-gray-400 line-through text-sm mb-3">NT$ 4,000</p>
                    <a href="/enroll?course=gemini" className="px-8 font-bold rounded-full transition-colors shadow-lg text-base"
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
                  <Link href="/course/ai-knowledge">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                      下一篇課程
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square" style={{ width: "90%" }}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/讓你的Gemini再進化.jpg')" }}
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
            <p style={{ color: "rgba(245,240,232,0.8)" }}>只需 3 小時，解鎖 Gemini 的全部潛力</p>
            <div>
              <a href="/enroll?course=gemini" className="inline-block font-bold rounded-full transition-colors shadow-xl"
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

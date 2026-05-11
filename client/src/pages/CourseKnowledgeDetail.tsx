import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, CheckCircle2, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const sessions = [
  { id: 1, date: "2026/5/12", weekday: "二", time: "13:30–16:30", remaining: 0, isFull: true, enterprise: false },
  { id: 2, date: "2026/5/19", weekday: "二", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 3, date: "2026/5/26", weekday: "二", time: "13:30–16:30", remaining: 15, enterprise: false },
  { id: 99, date: "", weekday: "", time: "", remaining: 0, enterprise: true },
];

const curriculum = [
  {
    no: 1,
    title: "NotebookLM 簡介",
    desc: "認識 AI 學習助手，協助深度閱讀與報告撰寫，提升知識產出效率。",
  },
  {
    no: 2,
    title: "資料導入整理術",
    desc: "整合 PDF、網頁等多元素材，建立高效索引與結構化來源目錄。",
  },
  {
    no: 3,
    title: "NotebookLM 工具技巧",
    desc: "善用語音轉換、摘要及心智圖工具，製作專屬學習卡片與測驗。",
  },
  {
    no: 4,
    title: "超強簡報製作",
    desc: "從資料收集到邏輯架構建置，協助快速產出專業級的簡報內容。",
  },
  {
    no: 5,
    title: "建立自己的知識庫",
    desc: "系統化管理個人資訊，透過 AI 檢索功能打造專屬數位知識庫。",
  },
  {
    no: 6,
    title: "Gemini + NotebookLM 聯動",
    desc: "聯動 Gemini 與 NotebookLM，實現跨文件的深度搜尋與分析。",
  },
];

const targets = [
  {
    icon: "📚",
    label: "知識工作者",
    desc: "需大量閱讀研究報告、論文或技術文件的專業人士。",
  },
  {
    icon: "📣",
    label: "行銷與企劃人員",
    desc: "需要快速彙整資料、尋找創意靈感的內容創作者。",
  },
  {
    icon: "🎓",
    label: "學生與研究人員",
    desc: "正為期末報告或論文文獻綜述感到頭痛的學習者。",
  },
  {
    icon: "💼",
    label: "企業管理階層",
    desc: "希望快速掌握內部大量會議記錄與經營資訊的經理人。",
  },
];

const highlights = [
  "一站式管理 PDF、網頁、筆記等多元資料來源",
  "AI 語音摘要、心智圖自動生成，告別手動整理",
  "快速建立個人專屬知識庫，隨問隨查",
  "Gemini 聯動，跨文件深度搜尋與分析",
  "從資料到簡報，一條龍 AI 工作流",
  "零基礎可上手，適合所有知識工作者",
];

export default function CourseKnowledgeDetail() {
  const [selectedSession, setSelectedSession] = useState(sessions[1].id);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="資料太多都用不起來？AI 知識管理實戰課"
        description="用 AI 整理海量資料、建立知識庫、提升資訊處理效率。學會 NotebookLM、AI 摘要、知識圖譜等實戰技巧。台中 AI 課程，立即報名。"
        url="https://www.262.yc311.com.tw/course/ai-knowledge"
        image="https://www.262.yc311.com.tw/資料太多都用不起來.jpg"
      />
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
                  資料太多卻用不起來
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  用AI整理PDF與筆記打造知識庫
                </p>
                <p className="text-base text-gray-600 leading-8">
                  本課程分為「核心觀念」、「核心操作」與「場景實戰」三大模組。透過 <strong>Google NotebookLM</strong> 這個 AI 知識管理神器，帶你從零基礎到能獨立建構專屬知識庫，讓海量的 PDF、網頁與筆記真正為你所用。
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
                        <button key={s.id} onClick={() => { if (!s.isFull && !s.enterprise) setSelectedSession(s.id); else if (s.enterprise) setSelectedSession(s.id); }}
                          disabled={false}
                          className="w-full text-left rounded-xl px-5 py-4 transition-all border-2"
                          style={{
                            borderColor: s.isFull ? "#e5e7eb" : (isSelected ? "#D4AF37" : "#e5e7eb"),
                            background: s.isFull ? "#f9fafb" : "#fff",
                            cursor: s.isFull ? "not-allowed" : "pointer",
                          }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.isFull ? "#d1d5db" : (isSelected ? "#D4AF37" : "#d1d5db") }} />
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
                    <a href={`/enroll?course=ai-knowledge&session=${selectedSession}`} className="px-8 font-bold rounded-full transition-colors shadow-lg text-base"
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
                  <Link href="/course/ai-presentation">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                      下一篇課程
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square" style={{ width: "90%" }}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/資料太多都用不起來.jpg')" }}
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
            <p style={{ color: "rgba(245,240,232,0.8)" }}>只需 3 小時，打造你的專屬 AI 知識庫</p>
            <div>
              <a href={`/enroll?course=ai-knowledge&session=${selectedSession}`} className="inline-block font-bold rounded-full transition-colors shadow-xl"
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

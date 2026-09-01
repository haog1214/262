import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useCourseSchedules } from "@/hooks/useCourseSchedules";

const COURSE_ID = 5;

const curriculum = [
  {
    no: 1,
    title: "ChatGPT + Canva：批次視覺流",
    desc: "使用 ChatGPT 撰寫結構化腳本，並匯入 Canva 自動批次生成投影片，快速完成品牌視覺統整。",
  },
  {
    no: 2,
    title: "Gemini + Google 簡報：雲端協作流",
    desc: "利用 Gemini 進行資料蒐集與重點摘要，結合 Google Slides 擴充功能，實現雲端即時編輯與跨裝置同步簡報。",
  },
  {
    no: 3,
    title: "Gamma：一鍵生成神器",
    desc: "實戰演練 Gamma App，從單一指令（Prompt）直接產出完整排版、自帶美圖的簡報，並學習如何進行後續細節微調。",
  },
];

const targets = [
  {
    icon: "📊",
    label: "業務與行銷人員",
    desc: "需要頻繁製作提案簡報，追求視覺吸引力與效率者。",
  },
  {
    icon: "🗂️",
    label: "行政與管理職",
    desc: "常需整理大量會議記錄、報告內容並轉化為簡報者。",
  },
  {
    icon: "🚀",
    label: "創業家與個人品牌",
    desc: "需獨立完成產品介紹或教育訓練教材的人。",
  },
  {
    icon: "✨",
    label: "對 AI 工具感興趣的職場新人",
    desc: "希望透過 AI 數位轉型提升競爭力者。",
  },
];

export default function CoursePresentationDetail() {
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
        title="提升簡報的精美度｜AI 簡報製作實戰課"
        description="用 AI 打造高質感簡報，學習 AI 自動生成大綱、設計排版、配色建議，讓你的簡報脫穎而出。台中 AI 課程，立即報名。"
        url="https://www.262.yc311.com.tw/course/ai-presentation"
        image="https://www.262.yc311.com.tw/提升簡報的精美度.jpg"
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
                  簡報不用做到半夜
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  AI幫你完成內容與排版
                </p>
                <p className="text-base text-gray-600 leading-8">
                  本課程專為追求效率的職場人士設計，透過「邏輯構思、內容生成、自動排版」三大關鍵步驟，將原本需要數天的簡報製作時間縮短至 3 小時內。我們結合 <strong>ChatGPT × Gemini × Gamma</strong> 三大 AI 工具，不只教工具，更教你建立「AI 協作思維」。
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
                              <span className="text-[14px] text-gray-400">{s.remaining}位</span>
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
                    <a href={`/enroll?course=ai-presentation&session=${selectedSession}`} className="px-8 font-bold rounded-full transition-colors shadow-lg text-base"
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
                  <Link href="/course/ai-video">
                    <a className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                      下一篇課程
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square" style={{ width: "90%" }}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/提升簡報的精美度.jpg')" }}
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
            <p style={{ color: "rgba(245,240,232,0.8)" }}>只需 3 小時，縮短 80% 的簡報製作時間</p>
            <div>
              <a href={`/enroll?course=ai-presentation&session=${selectedSession}`} className="inline-block font-bold rounded-full transition-colors shadow-xl"
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

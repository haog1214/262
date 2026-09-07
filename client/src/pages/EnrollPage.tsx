import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCoursesConfig } from "@/lib/coursesStorage";
import { fetchSchedules, fetchEnrollments, type Schedule, type Enrollment } from "@/lib/enrollmentsStorage";

interface EnrollSession {
  id: string;
  date: string;
  weekday: string;
  time: string;
  remaining: number;
  isFull: boolean;
  enterprise: boolean;
}

interface EnrollCourse {
  id: string;
  label: string;
  image: string;
  sessions: EnrollSession[];
}

// The 5 hand-built course detail pages link here with these slugs; each maps
// to the same numeric course id used in Google Sheets so their schedules stay
// in sync with whatever admin sets via the "選擇上課日期" feature.
const STATIC_META: Record<string, { label: string; image: string; courseId: number }> = {
  "gemini": { label: "Gemini讓工作快一倍（3H 特訓班）", image: "/讓你的Gemini再進化.jpg", courseId: 3 },
  "ai-knowledge": { label: "資料太多卻用不起來（3H 特訓班）", image: "/資料太多都用不起來.jpg", courseId: 4 },
  "ai-video": { label: "AI短影音即戰班（3H 特訓班）", image: "/零基礎也能做專業短片.jpg", courseId: 1 },
  "ai-life": { label: "讓手機搞定大小事（3H 特訓班）", image: "/讓手機搞定大小事-2.jpg", courseId: 2 },
  "ai-presentation": { label: "簡報不用做到半夜（3H 特訓班）", image: "/提升簡報的精美度.jpg", courseId: 5 },
};

const STATIC_DETAIL_PATHS = new Set(Object.keys(STATIC_META).map((s) => `/course/${s}`));

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const NO_SESSION_PLACEHOLDER: EnrollSession = { id: "", date: "尚未開放場次", weekday: "", time: "請洽詢我們", remaining: 0, isFull: true, enterprise: false };

function buildSessions(courseId: number, schedules: Schedule[], enrollments: Enrollment[]): EnrollSession[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  const sessions: EnrollSession[] = schedules
    .filter((sc) => sc.courseId === String(courseId) && sc.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((sc) => {
      const count = enrollments.filter((e) => e.scheduleId === sc.id).length;
      const cap = Number(sc.maxCapacity) || 0;
      const d = /^\d{4}-\d{2}-\d{2}$/.test(sc.date) ? new Date(sc.date) : null;
      return {
        id: sc.id,
        date: sc.date,
        weekday: d ? WEEKDAYS[d.getDay()] : "",
        time: sc.time,
        remaining: Math.max(0, cap - count),
        isFull: sc.status === "full" || (cap > 0 && count >= cap),
        enterprise: false,
      };
    });
  return sessions.length > 0 ? sessions : [NO_SESSION_PLACEHOLDER];
}

const initialCourses: EnrollCourse[] = Object.entries(STATIC_META).map(([slug, meta]) => ({
  id: slug,
  label: meta.label,
  image: meta.image,
  sessions: [NO_SESSION_PLACEHOLDER],
}));

const referralOptions = [
  "朋友 / 同事推薦",
  "Facebook / Instagram",
  "Google 搜尋",
  "Line 社群",
  "其他",
];

function firstOpenSession(c: EnrollCourse) {
  return c.sessions.find((s) => !s.isFull) ?? c.sessions[0];
}

export default function EnrollPage() {
  const params = new URLSearchParams(window.location.search);
  const [courses, setCourses] = useState<EnrollCourse[]>(initialCourses);

  const [selectedCourseId, setSelectedCourseId] = useState(params.get("course") ?? initialCourses[0].id);
  const [selectedSessionId, setSelectedSessionId] = useState(params.get("session") ?? "");
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", taxId: "", referral: "", transfer: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([getCoursesConfig(), fetchSchedules(), fetchEnrollments()]).then(([config, schedules, enrollments]) => {
      const staticBuilt: EnrollCourse[] = Object.entries(STATIC_META).map(([slug, meta]) => ({
        id: slug,
        label: meta.label,
        image: meta.image,
        sessions: buildSessions(meta.courseId, schedules, enrollments),
      }));
      const dynamicBuilt: EnrollCourse[] = config.courses
        .filter((c) => c.published !== false && !STATIC_DETAIL_PATHS.has(c.detailPath))
        .map((c) => ({
          id: String(c.id),
          label: `${c.courseCode ? `${c.courseCode} ` : ""}${c.title}${c.badge ? `（${c.badge}）` : ""}`,
          image: c.backgroundImage,
          sessions: buildSessions(c.id, schedules, enrollments),
        }));
      setCourses([...staticBuilt, ...dynamicBuilt]);
    });
  }, []);

  useEffect(() => {
    const current = courses.find((c) => c.id === selectedCourseId);
    if (!current) return;
    const validSession = current.sessions.find((s) => s.id === selectedSessionId);
    if (!validSession || validSession.isFull) {
      setSelectedSessionId(firstOpenSession(current).id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId, courses]);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];

  const handleCourseChange = (id: string) => {
    setSelectedCourseId(id);
    const next = courses.find((c) => c.id === id)!;
    setSelectedSessionId(firstOpenSession(next).id);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "請填寫姓名";
    if (!form.phone.trim()) e.phone = "請填寫電話";
    if (!form.email.trim()) e.email = "請填寫 Email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email 格式不正確";
    return e;
  };

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbxf45_uJ4ExZZTZf3Jg_wivMuOkaj6Yj4bME0luiycLnj48FI6O5OApPhrUAnhoP9jIUg/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId) {
      alert("這門課程目前尚未開放任何場次，請洽詢我們或選擇其他課程。");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const session = currentCourse.sessions.find((s) => s.id === selectedSessionId)!;
    const sessionLabel = session.enterprise
      ? "企業包班專案（日期 / 時間：專員洽談）"
      : `${session.date}（${session.weekday}）${session.time}`;

    setSubmitting(true);
    const payload = {
      course: currentCourse.label,
      session: sessionLabel,
      name: form.name,
      phone: form.phone,
      email: form.email,
      company: form.company,
      taxId: form.taxId,
      referral: form.referral,
      transfer: form.transfer,
      note: form.note,
    };
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetch("/api/notify-enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
      setSubmitted(true);
    } catch {
      alert("送出失敗，請稍後再試或直接來信聯絡我們。");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition-colors ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white focus:border-[#1B3A6B]"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-14" style={{ backgroundColor: "#f7f8fa" }}>
        <div className="container max-w-5xl">
          {/* 頁首 */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">課程報名</h1>
              <p className="text-gray-500 mt-1 text-[15px]">請填寫以下資料，完成後將寄出報名確認信</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0" style={{ marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-white"
                style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
              <Link href="/">
                <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
                  返回課程列表
                </a>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── 左欄 ── */}
              <div className="w-full lg:w-[380px] flex-shrink-0 space-y-5">

                {/* 1. 課程圖片 */}
                <div className="rounded-2xl overflow-hidden shadow-sm aspect-square bg-gray-100">
                  <img
                    key={currentCourse.image}
                    src={currentCourse.image}
                    alt={currentCourse.label}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                </div>

                {/* 2. 課程選擇 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-[15px] text-gray-900 mb-3">選擇課程</h2>
                  <div className="relative">
                    <select
                      value={selectedCourseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#1B3A6B] pr-10"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* 3. 場次選擇 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-[15px] text-gray-900 mb-3">選擇場次</h2>
                  <div className="space-y-2.5">
                    {currentCourse.sessions.map((s) => {
                      const isSelected = selectedSessionId === s.id;
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => { if (!s.isFull) setSelectedSessionId(s.id); }}
                          className="w-full text-left rounded-xl px-4 py-3.5 border-2 transition-all"
                          style={{
                            backgroundColor: s.isFull ? "#f9fafb" : (isSelected ? "#EEF3FB" : "#fafafa"),
                            borderColor: s.isFull ? "#e5e7eb" : (isSelected ? "#1B3A6B" : "#e5e7eb"),
                            cursor: s.isFull ? "not-allowed" : "pointer",
                            opacity: s.isFull ? 0.75 : 1,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-3 h-3 rounded-full flex-shrink-0 border-2 transition-colors"
                                style={{
                                  backgroundColor: s.isFull ? "transparent" : (isSelected ? "#1B3A6B" : "transparent"),
                                  borderColor: s.isFull ? "#d1d5db" : (isSelected ? "#1B3A6B" : "#9ca3af"),
                                }}
                              />
                              <div>
                                {s.enterprise ? (
                                  <>
                                    <p className="font-semibold text-[15px] text-gray-900">企業包班專案</p>
                                    <p className="text-[13px] text-gray-500">日期 / 時間：專員洽談</p>
                                  </>
                                ) : (
                                  <>
                                    <p className={`font-semibold text-[15px] ${s.isFull ? "text-gray-400 line-through" : "text-gray-900"}`}>{s.date}（{s.weekday}）</p>
                                    <p className="text-[13px] text-gray-500">{s.time}</p>
                                  </>
                                )}
                              </div>
                            </div>
                            {s.enterprise ? (
                              <span className="text-[12px] text-gray-400">滿 10 人以上</span>
                            ) : s.isFull ? (
                              <span className="text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>額滿</span>
                            ) : (
                              <span
                                className="text-[12px] px-2 py-0.5 rounded-full transition-colors"
                                style={{
                                  backgroundColor: isSelected ? "#D4AF37" : "#f3f4f6",
                                  color: isSelected ? "#1B3A6B" : "#6b7280",
                                }}
                              >
                                剩 {s.remaining} 名
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── 右欄：報名資料 ── */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-[16px] text-gray-900 mb-6">填寫報名資料</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      公司 / 職稱 <span className="text-gray-400 font-normal">（選填）</span>
                    </label>
                    <input type="text" placeholder="例：自由工作者、OO 公司行銷專員" value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)} className={inputClass("company")} />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input type="text" placeholder="請輸入真實姓名" value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)} className={inputClass("name")} />
                    {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                        手機號碼 <span className="text-red-500">*</span>
                      </label>
                      <input type="tel" placeholder="09xx-xxx-xxx" value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
                      {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input type="email" placeholder="example@mail.com" value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} />
                      {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      統一編號（發票） <span className="text-gray-400 font-normal">（選填）</span>
                    </label>
                    <input type="text" placeholder="請輸入統一編號" value={form.taxId}
                      onChange={(e) => handleChange("taxId", e.target.value)} className={inputClass("taxId")} />
                    <p className="text-gray-400 mt-1.5" style={{ fontSize: "14px" }}>若未填寫統一編號，將一律開立二聯式發票</p>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      如何得知此課程 <span className="text-gray-400 font-normal">（選填）</span>
                    </label>
                    <div className="relative">
                      <select value={form.referral} onChange={(e) => handleChange("referral", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#1B3A6B] pr-10">
                        <option value="">請選擇</option>
                        {referralOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      備註 <span className="text-gray-400 font-normal">（選填）</span>
                    </label>
                    <textarea rows={3} placeholder="有任何問題或特殊需求，歡迎在此說明" value={form.note}
                      onChange={(e) => handleChange("note", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-[#1B3A6B] resize-none" />
                  </div>

                  {/* 匯款資訊公告 */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <p className="text-[13px] font-semibold text-blue-800 mb-1">匯款資訊</p>
                    <p className="text-[13px] text-blue-700">台新銀行 812　逢甲分行 0517</p>
                    <p className="text-[14px] font-bold text-blue-900 tracking-wide">2051-01-0001230-8</p>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                      匯款後五碼 <span className="text-gray-400 font-normal">（選填）</span>
                    </label>
                    <input type="text" placeholder="請輸入匯款帳號後五碼" value={form.transfer}
                      onChange={(e) => handleChange("transfer", e.target.value)} className={inputClass("transfer")} />
                  </div>

                  {submitted ? (
                    <div className="w-full py-6 rounded-xl text-center bg-green-50 border border-green-200">
                      <p className="text-green-700 font-bold text-[17px] mb-1">報名資料已送出！</p>
                      <p className="text-green-600 text-[14px]">我們會在 24 小時內以 Email 與您確認報名細節。</p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl font-bold text-[17px] transition-colors shadow-lg mt-2 disabled:opacity-60"
                      style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}
                    >
                      {submitting ? "送出中…" : "送出報名"}
                    </button>
                  )}

                  {!submitted && (
                    <p className="text-center text-[12px] text-gray-400">
                      送出後我們會在 24 小時內以 Email 回覆確認
                    </p>
                  )}
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

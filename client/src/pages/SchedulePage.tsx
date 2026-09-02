import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { getCoursesConfig } from "@/lib/coursesStorage";
import { fetchSchedules, fetchEnrollments } from "@/lib/enrollmentsStorage";
import { formatPrice } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  course: string;
  subtitle: string;
  badge: string;
  date: string;
  weekday: string;
  time: string;
  location: string;
  originalPrice: string;
  discountPrice: string;
  accentColor: string;
  tagBg: string;
  tagText: string;
  detailPath: string;
  enrollPath: string;
  isFull: boolean;
}

const PALETTE = [
  { accentColor: "#facc15", tagBg: "#fefce8", tagText: "#a16207" },
  { accentColor: "#a78bfa", tagBg: "#f5f3ff", tagText: "#6d28d9" },
  { accentColor: "#fb923c", tagBg: "#fff7ed", tagText: "#c2410c" },
  { accentColor: "#4ade80", tagBg: "#f0fdf4", tagText: "#15803d" },
  { accentColor: "#2dd4bf", tagBg: "#f0fdfa", tagText: "#0f766e" },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCoursesConfig(), fetchSchedules(), fetchEnrollments()]).then(([config, allSchedules, allEnrollments]) => {
      const todayStr = new Date().toISOString().slice(0, 10);
      const items: ScheduleItem[] = [];
      config.courses
        .filter((c) => c.published !== false)
        .forEach((course, ci) => {
          const palette = PALETTE[ci % PALETTE.length];
          allSchedules
            .filter((s) => s.courseId === String(course.id) && s.date >= todayStr)
            .forEach((s) => {
              const count = allEnrollments.filter((e) => e.scheduleId === s.id).length;
              const cap = Number(s.maxCapacity) || 0;
              const isFull = s.status === "full" || (cap > 0 && count >= cap);
              const d = /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? new Date(s.date) : null;
              items.push({
                id: s.id,
                course: course.title,
                subtitle: course.tools,
                badge: course.badge,
                date: d ? `${s.date.slice(0, 4)} / ${s.date.slice(5, 7)} / ${s.date.slice(8, 10)}` : s.date,
                weekday: d ? WEEKDAYS[d.getDay()] : "",
                time: s.time,
                location: course.location ?? "",
                originalPrice: course.originalPrice,
                discountPrice: course.discountPrice,
                detailPath: course.detailPath || `/course/${course.id}`,
                enrollPath: `/enroll?course=${course.id}&session=${s.id}`,
                isFull,
                ...palette,
              });
            });
        });
      items.sort((a, b) => a.date.localeCompare(b.date));
      setSchedules(items);
      setLoading(false);
    });
  }, []);

  const available = schedules.filter((s) => !s.isFull);
  const fullSessions = schedules.filter((s) => s.isFull);

  const renderRow = (s: ScheduleItem, idx: number) => (
    <Link key={s.id} href={s.detailPath}>
      <a
        className="rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center transition-shadow hover:shadow-lg"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", background: s.isFull ? "#f5f5f5" : "#fff", opacity: s.isFull ? 0.75 : 1 }}
      >
        <div className="w-full md:w-1.5 h-1.5 md:h-auto md:self-stretch flex-shrink-0 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl" style={{ background: s.accentColor }} />
        <div className="hidden md:flex items-center justify-center w-14 flex-shrink-0 px-3">
          <span className="text-2xl font-black" style={{ color: "#e8e8e8" }}>{String(idx + 1).padStart(2, "0")}</span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 py-4 mx-4 md:mx-0 rounded-xl md:rounded-none hidden md:flex" style={{ background: s.tagBg }}>
          <span className="text-2xl font-black leading-none" style={{ color: s.accentColor }}>{s.date.split(" / ")[2]}</span>
          <span className="text-[10px] font-semibold mt-1" style={{ color: s.tagText }}>{s.date.split(" / ")[0]}/{s.date.split(" / ")[1]}</span>
          <span className="text-xs font-bold mt-0.5" style={{ color: s.tagText }}>（{s.weekday}）</span>
        </div>
        <div className="flex-1 px-5 py-4 min-w-0">
          <p className="text-xs font-semibold text-gray-400 mb-1 md:hidden">{s.date}（{s.weekday}）</p>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold" style={{ color: s.isFull ? "#9ca3af" : "#111827" }}>{s.course}</h3>
            {s.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.tagBg, color: s.tagText }}>{s.badge}</span>}
            {s.isFull && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>額滿</span>}
          </div>
          <p className="text-sm text-gray-400 mb-2">{s.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            {s.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.time}</span>}
            {s.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.location}</span>}
          </div>
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between px-5 py-4 gap-3 md:gap-2 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100">
          <div className="text-right">
            <p className="text-xs text-gray-300 line-through">{formatPrice(s.originalPrice)}</p>
            <p className="text-base font-black" style={{ color: "#1B3A6B" }}>{formatPrice(s.discountPrice)}</p>
          </div>
          {s.isFull ? (
            <span className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap" style={{ background: "#e5e7eb", color: "#9ca3af" }}>已額滿</span>
          ) : (
            <a
              href={s.enrollPath}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{ background: "#1B3A6B" }}
            >
              立即報名 <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </a>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f2f2f2" }}>
      <SEO
        title="開課日期"
        description="傳啓資訊最新開課時間表，包含 Gemini、AI 知識管理、AI 短影音、AI 生活應用、AI 簡報等課程場次，台中西屯區實體小班教學。"
        url="https://www.262.yc311.com.tw/schedule"
      />
      <Header />

      <main className="flex-1 py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: "#1B3A6B" }}>Course Schedule</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">近期開課場次</h1>
            <p className="text-sm text-gray-400">點擊課程可查看詳情，立即報名鎖定席位</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-20">載入中...</p>
          ) : schedules.length === 0 ? (
            <p className="text-center text-gray-400 py-20">目前尚無開課場次，請關注後續公告</p>
          ) : (
            <>
              {/* Available sessions */}
              {available.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "#E8EEF7", color: "#1B3A6B" }}>可報名場次</span>
                    <span className="text-xs text-gray-400">{available.length} 個場次開放中</span>
                  </div>
                  <div className="space-y-3">{available.map((s, idx) => renderRow(s, idx))}</div>
                </div>
              )}

              {/* Full sessions */}
              {fullSessions.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>已額滿場次</span>
                    <span className="text-xs text-gray-400">以下場次已無名額</span>
                  </div>
                  <div className="space-y-3">{fullSessions.map((s, idx) => renderRow(s, idx))}</div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

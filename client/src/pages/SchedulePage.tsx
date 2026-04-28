import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, MapPin, ArrowRight, CalendarDays } from "lucide-react";

interface ScheduleItem {
  id: number;
  course: string;
  subtitle: string;
  badge: string;
  date: string | null;
  weekday: string | null;
  time: string | null;
  location: string | null;
  originalPrice: string;
  discountPrice: string;
  accentColor: string;
  tagBg: string;
  tagText: string;
  detailPath: string;
  enrollPath: string;
}

const schedules: ScheduleItem[] = [
  {
    id: 3,
    course: "AI短影音即戰班",
    subtitle: "零基礎也能做專業短片",
    badge: "3H特訓班",
    date: "2026 / 05 / 10",
    weekday: "日",
    time: "13:00–17:00",
    location: "台北（地點待定）",
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,600",
    accentColor: "#fb923c",
    tagBg: "#fff7ed",
    tagText: "#c2410c",
    detailPath: "/course/ai-video",
    enrollPath: "/enroll?course=ai-video&session=1",
  },
  {
    id: 4,
    course: "AI短影音即戰班",
    subtitle: "零基礎也能做專業短片",
    badge: "3H特訓班",
    date: "2026 / 05 / 24",
    weekday: "日",
    time: "13:00–17:00",
    location: "台中（地點待定）",
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,600",
    accentColor: "#fb923c",
    tagBg: "#fff7ed",
    tagText: "#c2410c",
    detailPath: "/course/ai-video",
    enrollPath: "/enroll?course=ai-video&session=2",
  },
  {
    id: 5,
    course: "讓 AI 幫你省時間",
    subtitle: "學會手機 AI 工具，掌定生活大小事",
    badge: "3H特訓班",
    date: null,
    weekday: null,
    time: null,
    location: null,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#4ade80",
    tagBg: "#f0fdf4",
    tagText: "#15803d",
    detailPath: "/course/ai-life",
    enrollPath: "/enroll",
  },
  {
    id: 6,
    course: "讓你的 Gemini 再進化",
    subtitle: "打造專屬 Gemini 工作系統",
    badge: "3H特訓班",
    date: null,
    weekday: null,
    time: null,
    location: null,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,600",
    accentColor: "#facc15",
    tagBg: "#fefce8",
    tagText: "#a16207",
    detailPath: "/course/gemini",
    enrollPath: "/enroll",
  },
  {
    id: 7,
    course: "資料太多都用不起來",
    subtitle: "用 AI 整理 PDF 與筆記，打造知識庫",
    badge: "3H特訓班",
    date: null,
    weekday: null,
    time: null,
    location: null,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,600",
    accentColor: "#a78bfa",
    tagBg: "#f5f3ff",
    tagText: "#6d28d9",
    detailPath: "/course/ai-knowledge",
    enrollPath: "/enroll",
  },
  {
    id: 8,
    course: "提升簡報的精美度",
    subtitle: "AI 幫你完成專業簡報",
    badge: "3H特訓班",
    date: null,
    weekday: null,
    time: null,
    location: null,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,600",
    accentColor: "#2dd4bf",
    tagBg: "#f0fdfa",
    tagText: "#0f766e",
    detailPath: "/course/ai-presentation",
    enrollPath: "/enroll",
  },
];

export default function SchedulePage() {
  const upcoming = schedules.filter((s) => s.date !== null);
  const comingSoon = schedules.filter((s) => s.date === null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f2f2f2" }}>
      <Header />

      <main className="flex-1 py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: "#1B3A6B" }}>
              Course Schedule
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              近期開課場次
            </h1>
            <p className="text-sm text-gray-400">點擊課程可查看詳情，立即報名鎖定席位</p>
          </div>

          {/* Upcoming courses */}
          <div className="space-y-3 mb-12">
            {upcoming.map((s, idx) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center transition-shadow hover:shadow-lg"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                {/* Color accent bar */}
                <div
                  className="w-full md:w-1.5 h-1.5 md:h-auto md:self-stretch flex-shrink-0 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
                  style={{ background: s.accentColor }}
                />

                {/* Index */}
                <div className="hidden md:flex items-center justify-center w-14 flex-shrink-0 px-3">
                  <span className="text-2xl font-black" style={{ color: "#e8e8e8" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Date block */}
                <div
                  className="flex-shrink-0 flex flex-col items-center justify-center w-20 py-4 mx-4 md:mx-0 rounded-xl md:rounded-none hidden md:flex"
                  style={{ background: s.tagBg }}
                >
                  <span className="text-2xl font-black leading-none" style={{ color: s.accentColor }}>
                    {s.date?.split(" / ")[2]}
                  </span>
                  <span className="text-[10px] font-semibold mt-1" style={{ color: s.tagText }}>
                    {s.date?.split(" / ")[0]}/{s.date?.split(" / ")[1]}
                  </span>
                  <span className="text-xs font-bold mt-0.5" style={{ color: s.tagText }}>
                    （{s.weekday}）
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 px-5 py-4 min-w-0">
                  {/* Mobile date */}
                  <p className="text-xs font-semibold text-gray-400 mb-1 md:hidden">
                    {s.date}（{s.weekday}）
                  </p>

                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900">{s.course}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: s.tagBg, color: s.tagText }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{s.subtitle}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    {s.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{s.time}
                      </span>
                    )}
                    {s.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{s.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex md:flex-col items-center md:items-end justify-between px-5 py-4 gap-3 md:gap-2 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100">
                  <div className="text-right">
                    <p className="text-xs text-gray-300 line-through">{s.originalPrice}</p>
                    <p className="text-base font-black" style={{ color: "#1B3A6B" }}>{s.discountPrice}</p>
                  </div>
                  <Link href={s.enrollPath}>
                    <a
                      className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-80 whitespace-nowrap"
                      style={{ background: "#1B3A6B" }}
                    >
                      立即報名 <ArrowRight className="w-3 h-3" />
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                即將開課 · Coming Soon
              </p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              {comingSoon.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center opacity-70 hover:opacity-100 transition-opacity"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-full md:w-1.5 h-1.5 md:h-auto md:self-stretch flex-shrink-0"
                    style={{ background: s.accentColor, opacity: 0.5 }}
                  />

                  {/* Info */}
                  <div className="flex-1 px-5 py-4 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-700">{s.course}</h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: s.tagBg, color: s.tagText }}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.subtitle}</p>
                  </div>

                  {/* Price + detail */}
                  <div className="flex items-center justify-between px-5 py-4 gap-4 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100">
                    <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>{s.discountPrice}</p>
                    <Link href={s.detailPath}>
                      <a
                        className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-colors hover:bg-gray-50 whitespace-nowrap"
                        style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}
                      >
                        查看課程 <ArrowRight className="w-3 h-3" />
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

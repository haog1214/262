import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, MapPin, ArrowRight } from "lucide-react";

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
  isFull?: boolean;
}

const schedules: ScheduleItem[] = [
  // Week 1: 5/11–5/15
  {
    id: 1,
    course: "Gemini讓工作快一倍",
    subtitle: "打造你的AI工作助手",
    badge: "3H特訓班",
    date: "2026 / 05 / 11",
    weekday: "一",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#facc15",
    tagBg: "#fefce8",
    tagText: "#a16207",
    detailPath: "/course/gemini",
    enrollPath: "/enroll?course=gemini&session=1",
  },
  {
    id: 2,
    course: "資料太多卻用不起來",
    subtitle: "用AI整理PDF與筆記打造知識庫",
    badge: "3H特訓班",
    date: "2026 / 05 / 12",
    weekday: "二",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#a78bfa",
    tagBg: "#f5f3ff",
    tagText: "#6d28d9",
    detailPath: "/course/ai-knowledge",
    enrollPath: "/enroll?course=ai-knowledge&session=1",
  },
  {
    id: 3,
    course: "AI短影音即戰班",
    subtitle: "零基礎也能做專業短片",
    badge: "全日特訓班",
    date: "2026 / 05 / 13",
    weekday: "三",
    time: "9:00–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#fb923c",
    tagBg: "#fff7ed",
    tagText: "#c2410c",
    detailPath: "/course/ai-video",
    enrollPath: "/enroll?course=ai-video&session=1",
  },
  {
    id: 5,
    course: "讓手機搞定大小事",
    subtitle: "學會手機AI工具應用，搞定生活大小事",
    badge: "3H特訓班",
    date: "2026 / 05 / 14",
    weekday: "四",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#4ade80",
    tagBg: "#f0fdf4",
    tagText: "#15803d",
    detailPath: "/course/ai-life",
    enrollPath: "/enroll?course=ai-life&session=1",
  },
  {
    id: 6,
    course: "簡報不用做到半夜",
    subtitle: "AI幫你完成內容與排版",
    badge: "3H特訓班",
    date: "2026 / 05 / 15",
    weekday: "五",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#2dd4bf",
    tagBg: "#f0fdfa",
    tagText: "#0f766e",
    detailPath: "/course/ai-presentation",
    enrollPath: "/enroll?course=ai-presentation&session=1",
  },
  // Week 2: 5/18–5/22
  {
    id: 7,
    course: "Gemini讓工作快一倍",
    subtitle: "打造你的AI工作助手",
    badge: "3H特訓班",
    date: "2026 / 05 / 18",
    weekday: "一",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#facc15",
    tagBg: "#fefce8",
    tagText: "#a16207",
    detailPath: "/course/gemini",
    enrollPath: "/enroll?course=gemini&session=2",
  },
  {
    id: 8,
    course: "資料太多卻用不起來",
    subtitle: "用AI整理PDF與筆記打造知識庫",
    badge: "3H特訓班",
    date: "2026 / 05 / 19",
    weekday: "二",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#a78bfa",
    tagBg: "#f5f3ff",
    tagText: "#6d28d9",
    detailPath: "/course/ai-knowledge",
    enrollPath: "/enroll?course=ai-knowledge&session=2",
  },
  {
    id: 9,
    course: "AI短影音即戰班",
    subtitle: "零基礎也能做專業短片",
    badge: "全日特訓班",
    date: "2026 / 05 / 20",
    weekday: "三",
    time: "9:00–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#fb923c",
    tagBg: "#fff7ed",
    tagText: "#c2410c",
    detailPath: "/course/ai-video",
    enrollPath: "/enroll?course=ai-video&session=2",
  },
  {
    id: 11,
    course: "讓手機搞定大小事",
    subtitle: "學會手機AI工具應用，搞定生活大小事",
    badge: "3H特訓班",
    date: "2026 / 05 / 21",
    weekday: "四",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#4ade80",
    tagBg: "#f0fdf4",
    tagText: "#15803d",
    detailPath: "/course/ai-life",
    enrollPath: "/enroll?course=ai-life&session=2",
  },
  {
    id: 12,
    course: "簡報不用做到半夜",
    subtitle: "AI幫你完成內容與排版",
    badge: "3H特訓班",
    date: "2026 / 05 / 22",
    weekday: "五",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#2dd4bf",
    tagBg: "#f0fdfa",
    tagText: "#0f766e",
    detailPath: "/course/ai-presentation",
    enrollPath: "/enroll?course=ai-presentation&session=2",
  },
  // Week 3: 5/25–5/29
  {
    id: 13,
    course: "Gemini讓工作快一倍",
    subtitle: "打造你的AI工作助手",
    badge: "3H特訓班",
    date: "2026 / 05 / 25",
    weekday: "一",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#facc15",
    tagBg: "#fefce8",
    tagText: "#a16207",
    detailPath: "/course/gemini",
    enrollPath: "/enroll?course=gemini&session=3",
  },
  {
    id: 14,
    course: "資料太多卻用不起來",
    subtitle: "用AI整理PDF與筆記打造知識庫",
    badge: "3H特訓班",
    date: "2026 / 05 / 26",
    weekday: "二",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#a78bfa",
    tagBg: "#f5f3ff",
    tagText: "#6d28d9",
    detailPath: "/course/ai-knowledge",
    enrollPath: "/enroll?course=ai-knowledge&session=3",
  },
  {
    id: 15,
    course: "AI短影音即戰班",
    subtitle: "零基礎也能做專業短片",
    badge: "全日特訓班",
    date: "2026 / 05 / 27",
    weekday: "三",
    time: "9:00–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#fb923c",
    tagBg: "#fff7ed",
    tagText: "#c2410c",
    detailPath: "/course/ai-video",
    enrollPath: "/enroll?course=ai-video&session=3",
  },
  {
    id: 17,
    course: "讓手機搞定大小事",
    subtitle: "學會手機AI工具應用，搞定生活大小事",
    badge: "3H特訓班",
    date: "2026 / 05 / 28",
    weekday: "四",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#4ade80",
    tagBg: "#f0fdf4",
    tagText: "#15803d",
    detailPath: "/course/ai-life",
    enrollPath: "/enroll?course=ai-life&session=3",
  },
  {
    id: 18,
    course: "簡報不用做到半夜",
    subtitle: "AI幫你完成內容與排版",
    badge: "3H特訓班",
    date: "2026 / 05 / 29",
    weekday: "五",
    time: "13:30–16:30",
    location: "台中西屯分校",
    isFull: true,
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    accentColor: "#2dd4bf",
    tagBg: "#f0fdfa",
    tagText: "#0f766e",
    detailPath: "/course/ai-presentation",
    enrollPath: "/enroll?course=ai-presentation&session=3",
  },
];

export default function SchedulePage() {
  const upcoming = schedules;

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
                className="rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center transition-shadow hover:shadow-lg"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", background: s.isFull ? "#f5f5f5" : "#fff", opacity: s.isFull ? 0.85 : 1 }}
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
                    <h3 className="text-base font-bold" style={{ color: s.isFull ? "#9ca3af" : "#111827" }}>{s.course}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: s.tagBg, color: s.tagText }}
                    >
                      {s.badge}
                    </span>
                    {s.isFull && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>
                        額滿
                      </span>
                    )}
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
                  {s.isFull ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap" style={{ background: "#e5e7eb", color: "#9ca3af" }}>
                      已額滿
                    </span>
                  ) : (
                    <Link href={s.enrollPath}>
                      <a
                        className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-80 whitespace-nowrap"
                        style={{ background: "#1B3A6B" }}
                      >
                        立即報名 <ArrowRight className="w-3 h-3" />
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

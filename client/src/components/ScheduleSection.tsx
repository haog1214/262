import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * Schedule Section Component - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：清晰的課程日期列表、視覺層級、互動按鈕
 */
export default function ScheduleSection() {
  const sectionRef = useScrollReveal();
  const schedules = [
    {
      id: 1,
      course: "Gemini讓工作快一倍",
      date: "2026/5/11（一）",
      time: "13:30–16:30",
      location: "台北（地點待定）",
      badgeColor: "gold",
    },
    {
      id: 2,
      course: "資料太多卻用不起來",
      date: "2026/5/12（二）",
      time: "13:30–16:30",
      location: "台北（地點待定）",
      badgeColor: "purple",
    },
    {
      id: 3,
      course: "零基礎也能做專業短片",
      date: "2026/5/13（三）",
      time: "9:00–16:30",
      location: "台北（地點待定）",
      badgeColor: "orange",
    },
    {
      id: 4,
      course: "讓手機搞定大小事",
      date: "2026/5/14（四）",
      time: "13:30–16:30",
      location: "台北（地點待定）",
      badgeColor: "green",
    },
    {
      id: 5,
      course: "簡報不用做到半夜",
      date: "2026/5/15（五）",
      time: "13:30–16:30",
      location: "台北（地點待定）",
      badgeColor: "teal",
    },
  ];

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "gold":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "purple":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "orange":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "green":
        return "bg-green-100 text-green-700 border border-green-200";
      case "teal":
        return "bg-teal-100 text-teal-700 border border-teal-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <section id="schedule" className="py-20 bg-gradient-to-b from-white to-gray-50" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div className="container">
        {/* 區域標題 */}
        <div className="mb-12 scroll-reveal">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">近期開課場次</h2>
          </div>
          <p className="text-foreground/60 ml-9">
            貼靠加入行事曆，不錯過開課日期
          </p>
        </div>

        {/* 開課日期列表 */}
        <div className="space-y-4 max-w-4xl">
          {schedules.map((schedule, i) => (
            <div
              key={schedule.id}
              className="scroll-reveal flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* 左側課程資訊 */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(schedule.badgeColor)}`}
                  >
                    {schedule.course}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">{schedule.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{schedule.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{schedule.location}</span>
                  </div>
                </div>
              </div>

              {/* 右側按鈕 */}
              <Button
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-full px-8 whitespace-nowrap"
              >
                📅 加入行事曆
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

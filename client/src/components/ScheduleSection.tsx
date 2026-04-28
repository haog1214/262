import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

/**
 * Schedule Section Component - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：清晰的課程日期列表、視覺層級、互動按鈕
 */
export default function ScheduleSection() {
  const schedules = [
    {
      id: 1,
      course: "AI社群經營班",
      date: "2026/4/25（六）",
      time: "10:00–17:00",
      location: "台北 Happ. 小樹屋 - 紅豆杉",
      badgeColor: "pink",
    },
    {
      id: 2,
      course: "AI社群經營班",
      date: "2026/5/7（四）",
      time: "10:00–17:00",
      location: "台北（地點待定）",
      badgeColor: "pink",
    },
    {
      id: 3,
      course: "AI短影音即戰班",
      date: "2026/5/10（日）",
      time: "13:00–17:00",
      location: "台北（地點待定）",
      badgeColor: "orange",
    },
    {
      id: 4,
      course: "AI短影音即戰班",
      date: "2026/5/24（日）",
      time: "13:00–17:00",
      location: "台中（地點待定）",
      badgeColor: "orange",
    },
  ];

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "pink":
        return "bg-pink-100 text-pink-700 border border-pink-200";
      case "orange":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <section id="schedule" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        {/* 區域標題 */}
        <div className="mb-12">
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
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow"
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

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";

/**
 * Course Card Component - 262學院
 * 設計系統：1:1正方形圖片 + 下方文案
 * 特點：清晰的圖片展示、18級文字、簡潔布局
 */
interface CourseSchedule {
  date: string;
  time: string;
  status?: string;
}


interface CourseCardProps {
  courseCode?: string;
  title: string;
  description: string;
  tools: string;
  originalPrice: string;
  discountPrice: string;
  instructorImage: string;
  instructorName: string;
  badge: string;
  badgeColor: "pink" | "purple" | "green" | "gold" | "teal";
  backgroundImage: string;
  detailPath?: string;
  status?: "open" | "full";
  schedules?: CourseSchedule[];
}

export default function CourseCard({
  courseCode,
  title,
  description,
  tools,
  originalPrice,
  discountPrice,
  instructorImage,
  instructorName,
  badge,
  badgeColor,
  backgroundImage,
  detailPath,
  status,
  schedules,
}: CourseCardProps) {
  const getBadgeColorClass = () => {
    switch (badgeColor) {
      case "pink":
        return "bg-pink-400/70 text-white";
      case "purple":
        return "bg-purple-400/70 text-white";
      case "green":
        return "bg-green-400/70 text-white";
      case "gold":
        return "bg-yellow-500/70 text-white";
      case "teal":
        return "bg-teal-400/70 text-white";
      default:
        return "bg-blue-400/70 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 1:1 正方形圖片容器 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 group">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        {/* 徽章放在圖片上方 — 霧面玻璃效果 */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`${getBadgeColorClass()} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md`}
            style={{ border: "1px solid rgba(255,255,255,0.35)" }}
          >
            {badge}
          </div>
        </div>
        {/* 額滿覆蓋層 */}
        {status === "full" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/45 backdrop-blur-sm">
            <span className="text-white text-2xl font-extrabold tracking-widest border-4 border-white rounded-xl px-5 py-2 rotate-[-12deg]">
              額　滿
            </span>
          </div>
        )}
      </div>

      {/* 文案區域 - 放在圖片下方，18級文字 */}
      <div className="flex flex-col flex-grow">
        {/* 標題 - 18級 */}
        <h3 className="text-[18px] font-bold mb-2 text-gray-900">
          {courseCode && <span className="mr-6">{courseCode}</span>}
          {title}
        </h3>

        {/* 副標語 - 16級 */}
        <p className="text-[16px] font-light mb-2 text-gray-600">{tools}</p>

        {/* 內文 - 16級 */}
        <p className="text-[16px] font-light mb-3 text-gray-700 flex-grow line-clamp-2">
          {description}
        </p>

        {/* 開課時間 */}
        {schedules && schedules.length > 0 && (
          <div className="mb-3 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[12px] font-semibold text-gray-500 mb-1">📅 開課時間</p>
            <ul className="space-y-1">
              {schedules.map((s, i) => {
                const isFull = s.status === "full";
                return (
                  <li key={i} className="text-[13px] flex items-center justify-between gap-2">
                    <span className={isFull ? "text-gray-400 line-through" : "text-gray-700"}>
                      <span className="font-medium">{s.date}</span>
                      {s.time && <span className="ml-2 text-gray-500">{s.time}</span>}
                    </span>
                    {isFull && (
                      <span className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5 shrink-0">
                        額滿
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 價格區域 - 18級 */}
        <div className="mb-3">
          <p className="text-[14px] text-gray-500 line-through">{formatPrice(originalPrice)}</p>
          <p className="text-[18px] font-bold text-gray-900">{formatPrice(discountPrice)}</p>
        </div>

        {/* 按鈕 */}
        {detailPath ? (
          <Link href={detailPath}>
            <a className="w-full flex items-center justify-center border-0 font-semibold rounded-lg transition-all text-[18px] py-2 group/btn" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}>
              查看課程詳情
              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Link>
        ) : (
          <Button
            variant="outline"
            className="w-full border-0 font-semibold rounded-lg group/btn transition-all text-[18px] py-2 h-auto" style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}
          >
            查看課程詳情
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}

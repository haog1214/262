import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
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
  const nextSchedule = schedules && schedules.length > 0
    ? [...schedules].sort((a, b) => a.date.localeCompare(b.date))[0]
    : null;

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

        {/* 副標語 - 16級，最多兩行 */}
        <p className="text-[16px] font-light mb-2 text-gray-600 line-clamp-2">{tools}</p>

        {/* 最近上課日期 */}
        <p className="text-[16px] font-light mb-3 flex-grow flex items-center gap-1.5" style={{ marginTop: "15px", color: "#91270F" }}>
          {nextSchedule && <Calendar className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />}
          {nextSchedule
            ? `${nextSchedule.date.replace(/-/g, ".")}${nextSchedule.time ? `    ${nextSchedule.time}` : ""}`
            : description}
        </p>

        {/* 價格區域 - 18級 */}
        <div className="mb-3">
          <p className="text-[18px] font-bold text-gray-900">{formatPrice(discountPrice)}</p>
        </div>

        {/* 按鈕 */}
        {detailPath ? (
          <Link href={detailPath}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center border-0 font-semibold rounded-lg transition-all text-[18px] py-2 group/btn"
              style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF" }}
            >
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

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Clock, Users, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { getCoursesConfig } from "@/lib/coursesStorage";
import { extractPriceDigits } from "@/lib/utils";
import { fetchSchedules, type Schedule } from "@/lib/enrollmentsStorage";
import type { Course } from "@/data/defaultCourses";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function weekdayOf(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? WEEKDAYS[new Date(date).getDay()] : "";
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null | undefined>(undefined);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  useEffect(() => {
    const load = () => {
      Promise.all([getCoursesConfig(), fetchSchedules()]).then(([config, allSchedules]) => {
        const found = config.courses.find((c) => String(c.id) === params.id) ?? null;
        setCourse(found);
        if (found) {
          const own = allSchedules.filter((s) => s.courseId === String(found.id));
          setSchedules(own);
          const firstOpen = own.find((s) => s.status !== "full") ?? own[0];
          if (firstOpen) setSelectedSessionId(prev => prev || firstOpen.id);
        }
      });
    };
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (course === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32 text-gray-400">載入中...</main>
        <Footer />
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-gray-400 text-lg">找不到這門課程</p>
          <Link href="/">
            <a className="text-sm font-medium" style={{ color: "#1B3A6B" }}>← 回到首頁</a>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const enrollHref = `/enroll?course=${course.id}${selectedSessionId ? `&session=${selectedSessionId}` : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title={course.title}
        description={course.description}
        url={`https://www.262.yc311.com.tw/course/${course.id}`}
        image={course.backgroundImage ? `https://www.262.yc311.com.tw${course.backgroundImage}` : undefined}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="text-gray-900" style={{ backgroundColor: "#f2f2f2" }}>
          <div className="container py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  {course.courseCode && <span className="mr-4 text-gray-400 font-normal" style={{ fontSize: "0.6em" }}>{course.courseCode}</span>}
                  {course.title}
                </h1>
                {course.tools && <p className="text-lg text-gray-600 leading-relaxed">{course.tools}</p>}
                {course.description && (
                  <p className="text-base text-gray-600 leading-8">{course.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {course.location && (
                    <span className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-gray-600 border border-gray-200">
                      <MapPin className="w-4 h-4 text-red-500" /> {course.location}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
                  {schedules.length > 0 && (
                    <div className="space-y-2" style={{ maxWidth: "460px", width: "100%" }}>
                      {schedules.map((s) => {
                        const isSelected = selectedSessionId === s.id;
                        const isFull = s.status === "full";
                        return (
                          <button
                            key={s.id}
                            onClick={() => !isFull && setSelectedSessionId(s.id)}
                            className="w-full text-left rounded-xl px-5 py-4 transition-all border-2"
                            style={{
                              borderColor: isFull ? "#e5e7eb" : isSelected ? "#D4AF37" : "#e5e7eb",
                              background: isFull ? "#f9fafb" : "#fff",
                              cursor: isFull ? "not-allowed" : "pointer",
                            }}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: isFull ? "#d1d5db" : isSelected ? "#D4AF37" : "#d1d5db" }} />
                                <span className={`font-semibold text-[17px] ${isFull ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                  {s.date}（{weekdayOf(s.date)}）
                                </span>
                                <span className="text-[17px] text-gray-500">{s.time}</span>
                              </div>
                              {isFull && (
                                <span className="text-[13px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>額滿</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex-shrink-0" style={{ marginLeft: schedules.length > 0 ? "40px" : 0 }}>
                    {course.discountPrice && (
                      <p className="text-3xl font-bold text-gray-900"><span style={{ fontSize: "18px" }}>NT：</span>{extractPriceDigits(course.discountPrice)}</p>
                    )}
                    <a
                      href={enrollHref}
                      className="px-8 font-bold rounded-full transition-colors shadow-lg text-base"
                      style={{ backgroundColor: "#1B3A6B", color: "#FFFFFF", marginTop: "15px", display: "inline-block", paddingTop: "calc(0.75rem * 0.9)", paddingBottom: "calc(0.75rem * 0.9)" }}
                    >
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
                </div>
                {course.backgroundImage && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square" style={{ width: "90%" }}>
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${course.backgroundImage}')` }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 課程大綱 */}
        {course.outline && course.outline.length > 0 && (
          <section className="py-14" style={{ backgroundColor: "#E8EEF7" }}>
            <div className="container max-w-4xl">
              <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B3A6B" }}>課程大綱</h2>
              <div className="space-y-3">
                {course.outline.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <span className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8EEF7", color: "#1B3A6B" }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`font-semibold text-gray-900${item.description ? " mb-1" : ""}`}>{item.title}</p>
                      {item.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-1 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 適合對象 */}
        {course.targetAudience && course.targetAudience.length > 0 && (
          <section className="py-14">
            <div className="container max-w-4xl">
              <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B3A6B" }}>適合對象</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {course.targetAudience.map((t, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                    <div>
                      <p className={`font-bold text-gray-900${t.description ? " mb-1" : ""}`}>{t.title}</p>
                      {t.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{t.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 報名 */}
        <section id="enroll" className="py-16" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="container max-w-2xl text-center space-y-6" style={{ color: "#F5F0E8" }}>
            <h2 className="text-3xl font-bold">準備好開始了嗎？</h2>
            {course.location && (
              <p className="flex items-center justify-center gap-1.5" style={{ color: "rgba(245,240,232,0.8)" }}>
                <Clock className="w-4 h-4" /> {course.location}
              </p>
            )}
            <div>
              <a
                href={enrollHref}
                className="inline-block font-bold rounded-full transition-colors shadow-xl"
                style={{ backgroundColor: "#D4AF37", color: "#1B3A6B", padding: "calc(1rem * 0.8) calc(2.5rem * 0.8)", fontSize: "calc(1.125rem * 0.8)" }}
              >
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

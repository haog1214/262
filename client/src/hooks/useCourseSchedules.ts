import { useEffect, useState } from "react";
import { fetchSchedules, fetchEnrollments } from "@/lib/enrollmentsStorage";

export interface DetailSession {
  id: string;
  date: string;
  weekday: string;
  time: string;
  remaining: number;
  isFull: boolean;
  enterprise: boolean;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

const ENTERPRISE_SESSION: DetailSession = {
  id: "enterprise",
  date: "",
  weekday: "",
  time: "",
  remaining: 0,
  isFull: false,
  enterprise: true,
};

// Pulls a course's upcoming, admin-managed sessions from Google Sheets (via the
// courses backend), so hand-built course detail pages stay in sync with the
// admin "選擇上課日期" feature instead of showing stale hardcoded dates.
export function useCourseSchedules(courseId: number): { sessions: DetailSession[]; loading: boolean } {
  const [sessions, setSessions] = useState<DetailSession[]>([ENTERPRISE_SESSION]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSchedules(), fetchEnrollments()]).then(([schedules, enrollments]) => {
      if (cancelled) return;
      const todayStr = new Date().toISOString().slice(0, 10);
      const own: DetailSession[] = schedules
        .filter((s) => s.courseId === String(courseId) && s.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((s) => {
          const count = enrollments.filter((e) => e.scheduleId === s.id).length;
          const cap = Number(s.maxCapacity) || 0;
          const d = /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? new Date(s.date) : null;
          return {
            id: s.id,
            date: d ? `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}` : s.date,
            weekday: d ? WEEKDAYS[d.getDay()] : "",
            time: s.time,
            remaining: Math.max(0, cap - count),
            isFull: s.status === "full" || (cap > 0 && count >= cap),
            enterprise: false,
          };
        });
      setSessions([...own, ENTERPRISE_SESSION]);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { sessions, loading };
}

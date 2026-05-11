export interface FrontendSession {
  id: string;       // e.g. "gemini-1"
  date: string;     // e.g. "2026/5/11"
  weekday: string;  // e.g. "一"
  time: string;     // e.g. "13:30–16:30"
  isFull: boolean;
  enterprise: boolean;
  remaining: number;
}

// Keyed by the detailPath segment (last part of course.detailPath)
export const courseSessionsMap: Record<string, FrontendSession[]> = {
  "gemini": [
    { id: "gemini-1", date: "2026/5/11", weekday: "一", time: "13:30–16:30", remaining: 0,  isFull: true,  enterprise: false },
    { id: "gemini-2", date: "2026/5/18", weekday: "一", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "gemini-3", date: "2026/5/25", weekday: "一", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "gemini-99", date: "", weekday: "", time: "", remaining: 0, isFull: false, enterprise: true },
  ],
  "ai-knowledge": [
    { id: "ai-knowledge-1", date: "2026/5/12", weekday: "二", time: "13:30–16:30", remaining: 0,  isFull: true,  enterprise: false },
    { id: "ai-knowledge-2", date: "2026/5/19", weekday: "二", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-knowledge-3", date: "2026/5/26", weekday: "二", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-knowledge-99", date: "", weekday: "", time: "", remaining: 0, isFull: false, enterprise: true },
  ],
  "ai-video": [
    { id: "ai-video-1", date: "2026/5/13", weekday: "三", time: "9:00–16:30", remaining: 0,  isFull: true,  enterprise: false },
    { id: "ai-video-2", date: "2026/5/20", weekday: "三", time: "9:00–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-video-3", date: "2026/5/27", weekday: "三", time: "9:00–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-video-99", date: "", weekday: "", time: "", remaining: 0, isFull: false, enterprise: true },
  ],
  "ai-life": [
    { id: "ai-life-1", date: "2026/5/14", weekday: "四", time: "13:30–16:30", remaining: 0,  isFull: true,  enterprise: false },
    { id: "ai-life-2", date: "2026/5/21", weekday: "四", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-life-3", date: "2026/5/28", weekday: "四", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-life-99", date: "", weekday: "", time: "", remaining: 0, isFull: false, enterprise: true },
  ],
  "ai-presentation": [
    { id: "ai-presentation-1", date: "2026/5/15", weekday: "五", time: "13:30–16:30", remaining: 0,  isFull: true,  enterprise: false },
    { id: "ai-presentation-2", date: "2026/5/22", weekday: "五", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-presentation-3", date: "2026/5/29", weekday: "五", time: "13:30–16:30", remaining: 15, isFull: false, enterprise: false },
    { id: "ai-presentation-99", date: "", weekday: "", time: "", remaining: 0, isFull: false, enterprise: true },
  ],
};

export function getSessionsByDetailPath(detailPath: string): FrontendSession[] {
  const key = detailPath.replace(/^\/course\//, "");
  return courseSessionsMap[key] ?? [];
}

import { useState, useRef, useEffect } from "react";
import {
  getCoursesConfig,
  getLocalCoursesConfig,
  saveCoursesToAPI,
  resetCoursesConfig,
  exportCoursesConfig,
  importCoursesConfig,
} from "@/lib/coursesStorage";
import {
  fetchSchedules,
  saveSchedules,
  fetchEnrollments,
  saveEnrollments,
  fetchRegistrations,
  type Schedule,
  type Enrollment,
  type Registration,
} from "@/lib/enrollmentsStorage";
import {
  defaultCoursesConfig,
  type Course,
  type CoursesConfig,
  type BadgeColor,
} from "@/data/defaultCourses";
import { getSessionsByDetailPath } from "@/data/courseSessions";
import CourseCard from "@/components/CourseCard";

const ADMIN_PASSWORD = "84204302";
const BADGE_COLORS: BadgeColor[] = ["pink", "purple", "green", "gold", "teal"];
const BADGE_COLOR_LABELS: Record<BadgeColor, string> = {
  pink: "粉紅",
  purple: "紫色",
  green: "綠色",
  gold: "金色",
  teal: "青色",
};

const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

function emptyCourseDraft(): Omit<Course, "id"> {
  return {
    title: "",
    description: "",
    tools: "",
    originalPrice: "NT$ 0",
    discountPrice: "NT$ 0",
    badge: "",
    badgeColor: "pink",
    backgroundImage: "",
    detailPath: "",
    status: "open",
    published: false,
  };
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,
  header: {
    backgroundColor: "#1B3A6B",
    color: "#fff",
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 16px",
  } as React.CSSProperties,
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "4px",
  } as React.CSSProperties,
  input: {
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    outline: "none",
    marginBottom: "14px",
  } as React.CSSProperties,
  inputSm: {
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    padding: "6px 8px",
    fontSize: "13px",
    boxSizing: "border-box" as const,
    outline: "none",
    width: "100%",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    outline: "none",
    resize: "vertical" as const,
    minHeight: "90px",
    marginBottom: "14px",
  } as React.CSSProperties,
  select: {
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    marginBottom: "14px",
    backgroundColor: "#fff",
  } as React.CSSProperties,
  selectSm: {
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    padding: "6px 8px",
    fontSize: "13px",
    backgroundColor: "#fff",
  } as React.CSSProperties,
  btnPrimary: {
    backgroundColor: "#1B3A6B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  btnDanger: {
    backgroundColor: "#EF4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  btnGhost: {
    backgroundColor: "transparent",
    color: "#6B7280",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    cursor: "pointer",
  } as React.CSSProperties,
  btnGreen: {
    backgroundColor: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  btnIcon: {
    backgroundColor: "transparent",
    border: "1px solid #E5E7EB",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "16px",
    cursor: "pointer",
    lineHeight: 1,
  } as React.CSSProperties,
  btnIconDanger: {
    backgroundColor: "transparent",
    border: "1px solid #FCA5A5",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "16px",
    cursor: "pointer",
    lineHeight: 1,
    color: "#EF4444",
  } as React.CSSProperties,
  courseRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid #F3F4F6",
  } as React.CSSProperties,
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 16px",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "8px 10px",
    backgroundColor: "#F9FAFB",
    borderBottom: "2px solid #E5E7EB",
    fontWeight: 600,
    color: "#374151",
    fontSize: "12px",
  } as React.CSSProperties,
  td: {
    padding: "8px 10px",
    borderBottom: "1px solid #F3F4F6",
    verticalAlign: "middle" as const,
  } as React.CSSProperties,
};

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        backgroundColor: "#1B3A6B",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "10px",
        fontWeight: 600,
        fontSize: "14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {msg}
    </div>
  );
}

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2000);
    }
  };

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...s.card, width: "360px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔒</div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1B3A6B", marginBottom: "4px" }}>
          傳啓資訊 後台管理
        </h1>
        <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "24px" }}>請輸入管理員密碼</p>
        <input
          type="password"
          placeholder="密碼"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ ...s.input, textAlign: "center", fontSize: "16px", letterSpacing: "4px" }}
          autoFocus
        />
        {err && (
          <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px", marginTop: "-10px" }}>
            密碼錯誤，請重新輸入
          </p>
        )}
        <button style={{ ...s.btnPrimary, width: "100%", padding: "12px" }} onClick={submit}>
          登入
        </button>
      </div>
    </div>
  );
}

// ── Course edit form ──────────────────────────────────────────────────────────
function CourseForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Course | Omit<Course, "id">;
  onSave: (c: Course | Omit<Course, "id">) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState({ ...initial });
  const set = (k: string, v: string) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div style={s.card}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button style={s.btnGhost} onClick={onCancel}>← 返回</button>
        <h3 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B", margin: 0 }}>
          {"id" in draft ? `編輯課程` : "新增課程"}
        </h3>
      </div>

      <label style={s.label}>課程標題</label>
      <input style={s.input} value={draft.title} onChange={e => set("title", e.target.value)} placeholder="課程標題" />

      <label style={s.label}>副標語（工具/重點）</label>
      <input style={s.input} value={draft.tools} onChange={e => set("tools", e.target.value)} placeholder="例：從腳本到成品一次完成" />

      <label style={s.label}>課程描述</label>
      <textarea style={s.textarea} value={draft.description} onChange={e => set("description", e.target.value)} placeholder="課程完整說明..." />

      <div style={s.grid2}>
        <div>
          <label style={s.label}>原價</label>
          <input style={s.input} value={draft.originalPrice} onChange={e => set("originalPrice", e.target.value)} placeholder="NT$ 4,000" />
        </div>
        <div>
          <label style={s.label}>優惠價</label>
          <input style={s.input} value={draft.discountPrice} onChange={e => set("discountPrice", e.target.value)} placeholder="NT$ 2,000" />
        </div>
      </div>

      <div style={s.grid2}>
        <div>
          <label style={s.label}>徽章文字</label>
          <input style={s.input} value={draft.badge} onChange={e => set("badge", e.target.value)} placeholder="例：3H特訓班" />
        </div>
        <div>
          <label style={s.label}>徽章顏色</label>
          <select style={s.select} value={draft.badgeColor} onChange={e => set("badgeColor", e.target.value as BadgeColor)}>
            {BADGE_COLORS.map(c => (
              <option key={c} value={c}>{BADGE_COLOR_LABELS[c]}</option>
            ))}
          </select>
        </div>
      </div>

      <label style={s.label}>背景圖片路徑或網址</label>
      <input style={s.input} value={draft.backgroundImage} onChange={e => set("backgroundImage", e.target.value)} placeholder="/課程圖.jpg 或 https://..." />
      {draft.backgroundImage && (
        <img
          src={draft.backgroundImage}
          alt="預覽"
          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "14px", border: "1px solid #E5E7EB" }}
          onError={e => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}

      <label style={s.label}>課程詳情路徑</label>
      <input style={s.input} value={draft.detailPath} onChange={e => set("detailPath", e.target.value)} placeholder="/course/ai-video" />

      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <button style={s.btnPrimary} onClick={() => onSave(draft)}>儲存課程</button>
        <button style={s.btnGhost} onClick={onCancel}>取消</button>
      </div>
    </div>
  );
}

// ── Enrollment view ───────────────────────────────────────────────────────────
function EnrollmentView({
  course,
  allSchedules,
  allEnrollments,
  allRegistrations,
  onBack,
  onToggleStatus,
  showToast,
  onSchedulesChange,
  onEnrollmentsChange,
}: {
  course: Course;
  allSchedules: Schedule[];
  allEnrollments: Enrollment[];
  allRegistrations: Registration[];
  onBack: () => void;
  onToggleStatus: (status: "open" | "full") => Promise<void>;
  showToast: (msg: string) => void;
  onSchedulesChange: (all: Schedule[]) => void;
  onEnrollmentsChange: (all: Enrollment[]) => void;
}) {
  const cid = String(course.id);

  // Seed from frontend sessions if no schedules exist for this course
  const initSchedules = (): Schedule[] => {
    const existing = allSchedules.filter(s => s.courseId === cid);
    if (existing.length > 0) return existing;
    const frontendSessions = getSessionsByDetailPath(course.detailPath);
    return frontendSessions
      .filter(s => !s.enterprise)
      .map(s => ({
        id: s.id,
        courseId: cid,
        date: s.date,
        time: s.time,
        maxCapacity: "20",
        status: s.isFull ? "full" : "open",
      }));
  };

  const [schedules, setSchedules] = useState<Schedule[]>(initSchedules);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(
    allEnrollments.filter(e => e.courseId === cid)
  );
  const [editingSchedId, setEditingSchedId] = useState<string | null>(null);
  const [schedDraft, setSchedDraft] = useState<Schedule | null>(null);
  const [newSchedIds, setNewSchedIds] = useState<Set<string>>(new Set());
  const [editingEnrollId, setEditingEnrollId] = useState<string | null>(null);
  const [enrollDraft, setEnrollDraft] = useState<Enrollment | null>(null);
  const [newEnrollIds, setNewEnrollIds] = useState<Set<string>>(new Set());
  const [filterSchedId, setFilterSchedId] = useState<string>("all");
  const [savingSched, setSavingSched] = useState(false);
  const [savingEnroll, setSavingEnroll] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const hasUnsaved = !!editingSchedId || !!editingEnrollId;

  // Warn before leaving when editing
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsaved]);

  // Auto-seed schedules to Google Sheets on first open
  useEffect(() => {
    const existing = allSchedules.filter(s => s.courseId === cid);
    if (existing.length === 0) {
      const seeded = initSchedules();
      if (seeded.length > 0) {
        const others = allSchedules.filter(s => s.courseId !== cid);
        saveSchedules([...others, ...seeded]).then(result => {
          if (result.ok) onSchedulesChange([...others, ...seeded]);
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSchedules = async (updated: Schedule[]) => {
    setSavingSched(true);
    const others = allSchedules.filter(s => s.courseId !== cid);
    const all = [...others, ...updated];
    const result = await saveSchedules(all);
    setSavingSched(false);
    if (result.ok) {
      onSchedulesChange(all);
      showToast("✅ 梯次已儲存");
    } else {
      showToast(`❌ 儲存失敗：${result.error}`);
    }
    return result.ok;
  };

  const persistEnrollments = async (updated: Enrollment[]) => {
    setSavingEnroll(true);
    const others = allEnrollments.filter(e => e.courseId !== cid);
    const all = [...others, ...updated];
    const result = await saveEnrollments(all);
    setSavingEnroll(false);
    if (result.ok) {
      onEnrollmentsChange(all);
      showToast("✅ 報名資料已儲存");
    } else {
      showToast(`❌ 儲存失敗：${result.error}`);
    }
    return result.ok;
  };

  // ── Schedule actions ──
  const addSchedule = () => {
    const id = genId();
    const newS: Schedule = { id, courseId: cid, date: "", time: "", maxCapacity: "20", status: "open" };
    const updated = [...schedules, newS];
    setSchedules(updated);
    setNewSchedIds(p => new Set(p).add(id));
    setEditingSchedId(id);
    setSchedDraft(newS);
  };

  const startEditSched = (s: Schedule) => {
    setEditingSchedId(s.id);
    setSchedDraft({ ...s });
  };

  const saveSchedRow = async () => {
    if (!schedDraft) return;
    const updated = schedules.map(s => (s.id === schedDraft.id ? schedDraft : s));
    setSchedules(updated);
    setNewSchedIds(p => { const n = new Set(p); n.delete(schedDraft.id); return n; });
    setEditingSchedId(null);
    setSchedDraft(null);
    await persistSchedules(updated);
  };

  const cancelSchedEdit = () => {
    if (schedDraft && newSchedIds.has(schedDraft.id)) {
      setSchedules(prev => prev.filter(s => s.id !== schedDraft.id));
      setNewSchedIds(p => { const n = new Set(p); n.delete(schedDraft.id); return n; });
    }
    setEditingSchedId(null);
    setSchedDraft(null);
  };

  const toggleSchedStatus = async (id: string, newStatus: "open" | "full") => {
    const updated = schedules.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setSchedules(updated);
    await persistSchedules(updated);
  };

  const deleteSched = async (id: string) => {
    if (!confirm("確定要刪除此梯次？相關報名資料也將一併刪除。")) return;
    const updatedScheds = schedules.filter(s => s.id !== id);
    const updatedEnrolls = enrollments.filter(e => e.scheduleId !== id);
    setSchedules(updatedScheds);
    setEnrollments(updatedEnrolls);
    await persistSchedules(updatedScheds);
    await persistEnrollments(updatedEnrolls);
  };

  // ── Enrollment actions ──
  const addEnrollment = () => {
    const id = genId();
    const schedId = filterSchedId === "all" ? (schedules[0]?.id ?? "") : filterSchedId;
    const newE: Enrollment = { id, courseId: cid, scheduleId: schedId, name: "", phone: "", email: "", notes: "" };
    const updated = [...enrollments, newE];
    setEnrollments(updated);
    setNewEnrollIds(p => new Set(p).add(id));
    setEditingEnrollId(id);
    setEnrollDraft(newE);
  };

  const startEditEnroll = (e: Enrollment) => {
    setEditingEnrollId(e.id);
    setEnrollDraft({ ...e });
  };

  const saveEnrollRow = async () => {
    if (!enrollDraft) return;
    const updated = enrollments.map(e => (e.id === enrollDraft.id ? enrollDraft : e));
    setEnrollments(updated);
    setNewEnrollIds(p => { const n = new Set(p); n.delete(enrollDraft.id); return n; });
    setEditingEnrollId(null);
    setEnrollDraft(null);
    await persistEnrollments(updated);
  };

  const cancelEnrollEdit = () => {
    if (enrollDraft && newEnrollIds.has(enrollDraft.id)) {
      setEnrollments(prev => prev.filter(e => e.id !== enrollDraft.id));
      setNewEnrollIds(p => { const n = new Set(p); n.delete(enrollDraft.id); return n; });
    }
    setEditingEnrollId(null);
    setEnrollDraft(null);
  };

  const deleteEnroll = async (id: string) => {
    if (!confirm("確定要刪除此報名資料？")) return;
    const updated = enrollments.filter(e => e.id !== id);
    setEnrollments(updated);
    await persistEnrollments(updated);
  };

  const filteredEnrollments =
    filterSchedId === "all"
      ? enrollments
      : enrollments.filter(e => e.scheduleId === filterSchedId);

  const enrollCountFor = (id: string) =>
    enrollments.filter(e => e.scheduleId === id).length;

  const handleToggleStatus = async (newStatus: "open" | "full") => {
    setTogglingStatus(true);
    await onToggleStatus(newStatus);
    setTogglingStatus(false);
  };

  const saveCurrentEdit = async () => {
    if (editingSchedId) await saveSchedRow();
    if (editingEnrollId) await saveEnrollRow();
  };

  return (
    <div>
      {/* Unsaved warning bar */}
      {hasUnsaved && (
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#FEF3C7",
          border: "1px solid #F59E0B",
          borderRadius: "10px",
          padding: "12px 20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#92400E", fontWeight: 600 }}>
            ⚠️ 有未儲存的變更，請記得儲存
          </div>
          <button
            style={{ ...s.btnPrimary, backgroundColor: "#D97706", padding: "8px 20px", fontSize: "14px" }}
            onClick={saveCurrentEdit}
          >
            💾 儲存
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          style={s.btnGhost}
          onClick={() => {
            if (hasUnsaved && !confirm("有未儲存的變更，確定要離開嗎？")) return;
            onBack();
          }}
        >← 返回課程列表</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#1B3A6B" }}>{course.title}</div>
          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>報名管理</div>
        </div>
      </div>

      {/* Course status toggle */}
      <div style={{ ...s.card, display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ fontWeight: 600, fontSize: "14px", color: "#374151" }}>前台課程狀態：</div>
        <button
          style={{
            ...s.btnGreen,
            opacity: course.status === "open" ? 1 : 0.4,
            outline: course.status === "open" ? "3px solid #059669" : "none",
          }}
          onClick={() => !togglingStatus && handleToggleStatus("open")}
          disabled={togglingStatus || course.status === "open"}
        >
          ✅ 開放報名
        </button>
        <button
          style={{
            ...s.btnDanger,
            opacity: course.status === "full" ? 1 : 0.4,
            outline: course.status === "full" ? "3px solid #DC2626" : "none",
          }}
          onClick={() => !togglingStatus && handleToggleStatus("full")}
          disabled={togglingStatus || course.status === "full"}
        >
          🚫 額滿
        </button>
        {togglingStatus && (
          <span style={{ fontSize: "13px", color: "#9CA3AF" }}>儲存中...</span>
        )}
        <span style={{ fontSize: "12px", color: "#9CA3AF", marginLeft: "auto" }}>
          切換狀態後，前台課程卡片會即時顯示「額滿」覆蓋
        </span>
      </div>

      {/* Schedules */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#1B3A6B", margin: 0 }}>
            課程梯次 {savingSched && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>儲存中...</span>}
          </h3>
          <button style={s.btnGreen} onClick={addSchedule} disabled={!!editingSchedId}>
            ＋ 新增梯次
          </button>
        </div>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>日期</th>
              <th style={s.th}>時間</th>
              <th style={s.th}>人數上限</th>
              <th style={s.th}>已報名</th>
              <th style={{ ...s.th, width: "110px" }}>狀態</th>
              <th style={{ ...s.th, width: "80px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "24px" }}>
                  尚無梯次，點擊「新增梯次」建立
                </td>
              </tr>
            )}
            {schedules.map(sched => {
              const isEditing = editingSchedId === sched.id;
              const d = isEditing ? schedDraft! : sched;
              const isFull = sched.status === "full";
              return (
                <tr key={sched.id} style={{ backgroundColor: isFull ? "#FFF7F7" : "transparent" }}>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.date}
                        onChange={e => setSchedDraft(p => p ? { ...p, date: e.target.value } : p)}
                        placeholder="2025/06/01"
                      />
                    ) : sched.date || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.time}
                        onChange={e => setSchedDraft(p => p ? { ...p, time: e.target.value } : p)}
                        placeholder="10:00–13:00"
                      />
                    ) : sched.time || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={{ ...s.inputSm, width: "80px" }}
                        type="number"
                        value={d.maxCapacity}
                        onChange={e => setSchedDraft(p => p ? { ...p, maxCapacity: e.target.value } : p)}
                      />
                    ) : sched.maxCapacity}
                  </td>
                  <td style={s.td}>
                    {enrollCountFor(sched.id)} / {sched.maxCapacity}
                  </td>
                  {/* 狀態切換 */}
                  <td style={s.td}>
                    <button
                      style={{
                        backgroundColor: isFull ? "#FEE2E2" : "#D1FAE5",
                        color: isFull ? "#DC2626" : "#065F46",
                        border: "none",
                        borderRadius: "14px",
                        padding: "5px 12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap" as const,
                      }}
                      onClick={() => toggleSchedStatus(sched.id, isFull ? "open" : "full")}
                      disabled={savingSched}
                      title={isFull ? "點擊切換為開放" : "點擊切換為額滿"}
                    >
                      {isFull ? "🚫 額滿" : "✅ 開放中"}
                    </button>
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button style={{ ...s.btnPrimary, padding: "5px 10px", fontSize: "13px" }} onClick={saveSchedRow}>
                          💾
                        </button>
                        <button style={{ ...s.btnGhost, padding: "5px 8px", fontSize: "13px" }} onClick={cancelSchedEdit}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button style={s.btnIcon} onClick={() => startEditSched(sched)} title="編輯">✏️</button>
                        <button style={s.btnIconDanger} onClick={() => deleteSched(sched.id)} title="刪除">🗑️</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enrollments */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#1B3A6B", margin: 0 }}>
              報名人員 {savingEnroll && <span style={{ fontSize: "12px", color: "#9CA3AF" }}>儲存中...</span>}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>篩選梯次：</span>
              <select
                style={s.selectSm}
                value={filterSchedId}
                onChange={e => setFilterSchedId(e.target.value)}
              >
                <option value="all">全部（{enrollments.length} 人）</option>
                {schedules.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.date} {s.time}（{enrollCountFor(s.id)} 人）
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button style={s.btnGreen} onClick={addEnrollment} disabled={!!editingEnrollId}>
            ＋ 新增報名
          </button>
        </div>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: "32px" }}>#</th>
              <th style={s.th}>姓名</th>
              <th style={s.th}>電話</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>梯次</th>
              <th style={s.th}>備注</th>
              <th style={{ ...s.th, width: "90px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "24px" }}>
                  尚無報名資料
                </td>
              </tr>
            )}
            {filteredEnrollments.map((enroll, idx) => {
              const isEditing = editingEnrollId === enroll.id;
              const d = isEditing ? enrollDraft! : enroll;
              const schedLabel = schedules.find(s => s.id === enroll.scheduleId);
              return (
                <tr key={enroll.id}>
                  <td style={{ ...s.td, color: "#9CA3AF", fontSize: "12px" }}>{idx + 1}</td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.name}
                        onChange={e => setEnrollDraft(p => p ? { ...p, name: e.target.value } : p)}
                        placeholder="姓名"
                        autoFocus
                      />
                    ) : enroll.name || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.phone}
                        onChange={e => setEnrollDraft(p => p ? { ...p, phone: e.target.value } : p)}
                        placeholder="0912345678"
                      />
                    ) : enroll.phone || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.email}
                        onChange={e => setEnrollDraft(p => p ? { ...p, email: e.target.value } : p)}
                        placeholder="email@example.com"
                      />
                    ) : enroll.email || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <select
                        style={s.selectSm}
                        value={d.scheduleId}
                        onChange={e => setEnrollDraft(p => p ? { ...p, scheduleId: e.target.value } : p)}
                      >
                        <option value="">— 未指定 —</option>
                        {schedules.map(s => (
                          <option key={s.id} value={s.id}>{s.date} {s.time}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>
                        {schedLabel ? `${schedLabel.date} ${schedLabel.time}` : "未指定"}
                      </span>
                    )}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <input
                        style={s.inputSm}
                        value={d.notes}
                        onChange={e => setEnrollDraft(p => p ? { ...p, notes: e.target.value } : p)}
                        placeholder="備注"
                      />
                    ) : enroll.notes || "—"}
                  </td>
                  <td style={s.td}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button style={{ ...s.btnPrimary, padding: "5px 10px", fontSize: "13px" }} onClick={saveEnrollRow}>
                          💾
                        </button>
                        <button style={{ ...s.btnGhost, padding: "5px 8px", fontSize: "13px" }} onClick={cancelEnrollEdit}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button style={s.btnIcon} onClick={() => startEditEnroll(enroll)} title="編輯">✏️</button>
                        <button style={s.btnIconDanger} onClick={() => deleteEnroll(enroll.id)} title="刪除">🗑️</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Google Sheets registrations for this course */}
      {(() => {
        const courseRegs = allRegistrations.filter(r =>
          r.course.includes(course.title.slice(0, 6))
        );
        return courseRegs.length > 0 ? (
          <div style={s.card}>
            <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#1B3A6B", margin: "0 0 16px" }}>
              Google Sheets 報名資料（{courseRegs.length} 筆）
            </h3>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: "28px" }}>#</th>
                  <th style={s.th}>姓名</th>
                  <th style={s.th}>上課時間</th>
                  <th style={s.th}>電話</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>公司</th>
                  <th style={s.th}>得知管道</th>
                  <th style={s.th}>報名時間</th>
                </tr>
              </thead>
              <tbody>
                {courseRegs.map((reg, idx) => (
                  <tr key={idx}>
                    <td style={{ ...s.td, color: "#9CA3AF", fontSize: "12px" }}>{idx + 1}</td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{reg.name || "—"}</td>
                    <td style={{ ...s.td, fontSize: "12px" }}>{reg.sessionDate || "—"}</td>
                    <td style={{ ...s.td, fontSize: "12px" }}>{reg.phone || "—"}</td>
                    <td style={{ ...s.td, fontSize: "12px" }}>{reg.email || "—"}</td>
                    <td style={{ ...s.td, fontSize: "12px" }}>{reg.company || "—"}</td>
                    <td style={{ ...s.td, fontSize: "12px" }}>{reg.referral || "—"}</td>
                    <td style={{ ...s.td, fontSize: "11px", color: "#9CA3AF" }}>{reg.timestamp || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null;
      })()}
    </div>
  );
}

// ── Reorder Modal ─────────────────────────────────────────────────────────────
function ReorderModal({
  courses,
  onSave,
  onClose,
}: {
  courses: Course[];
  onSave: (ordered: Course[]) => void;
  onClose: () => void;
}) {
  const [list, setList] = useState([...courses]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const arr = [...list];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setList(arr);
  };

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (idx !== dragOverIdx) setDragOverIdx(idx);
  };
  const onDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) move(dragIdx, idx);
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const onDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "500px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B" }}>調整課程順序</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>拖曳或點選 ↑↓ 調整，完成後儲存</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9CA3AF", padding: "4px" }}
          >✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 24px" }}>
          {list.map((course, idx) => (
            <div
              key={course.id}
              draggable
              onDragStart={e => onDragStart(e, idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDrop={e => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                marginBottom: "6px",
                borderRadius: "10px",
                border: dragOverIdx === idx && dragIdx !== idx
                  ? "2px solid #1B3A6B"
                  : "1px solid #E5E7EB",
                backgroundColor: dragIdx === idx ? "#F0F4FF" : "#FAFAFA",
                opacity: dragIdx === idx ? 0.5 : 1,
                cursor: "grab",
                transition: "all 0.12s",
              }}
            >
              {/* Drag handle */}
              <div style={{ color: "#CBD5E1", fontSize: "18px", flexShrink: 0, userSelect: "none" }}>⠿</div>

              {/* Number */}
              <div style={{
                width: "24px", height: "24px",
                borderRadius: "50%",
                backgroundColor: "#1B3A6B",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>

              {/* Thumbnail */}
              <div style={{
                width: "44px", height: "44px",
                borderRadius: "6px",
                overflow: "hidden",
                backgroundColor: "#E5E7EB",
                flexShrink: 0,
              }}>
                {course.backgroundImage && (
                  <img
                    src={course.backgroundImage}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                )}
              </div>

              {/* Title */}
              <div style={{ flex: 1, fontWeight: 600, fontSize: "14px", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {course.title || "（無標題）"}
              </div>

              {/* Up/Down buttons */}
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                <button
                  onClick={() => move(idx, idx - 1)}
                  disabled={idx === 0}
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    background: "#fff",
                    width: "30px", height: "30px",
                    cursor: idx === 0 ? "default" : "pointer",
                    opacity: idx === 0 ? 0.3 : 1,
                    fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >↑</button>
                <button
                  onClick={() => move(idx, idx + 1)}
                  disabled={idx === list.length - 1}
                  style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    background: "#fff",
                    width: "30px", height: "30px",
                    cursor: idx === list.length - 1 ? "default" : "pointer",
                    opacity: idx === list.length - 1 ? 0.3 : 1,
                    fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >↓</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          gap: "10px",
          flexShrink: 0,
        }}>
          <button
            style={{ ...s.btnPrimary, flex: 1, padding: "12px" }}
            onClick={() => onSave(list)}
          >
            💾 儲存順序並同步前台
          </button>
          <button style={s.btnGhost} onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
}

// ── Preview modal — 前台呈現效果 ────────────────────────────────────────────
function PreviewModal({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "380px",
        padding: "24px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#1B3A6B" }}>前台呈現效果預覽</div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#9CA3AF" }}
          >✕</button>
        </div>
        <CourseCard
          title={course.title}
          description={course.description}
          tools={course.tools}
          originalPrice={course.originalPrice}
          discountPrice={course.discountPrice}
          instructorImage=""
          instructorName=""
          badge={course.badge}
          badgeColor={course.badgeColor}
          backgroundImage={course.backgroundImage}
          detailPath={course.detailPath}
          status={course.status}
        />
        {!course.published && (
          <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "12px", textAlign: "center" }}>
            此課程目前為「未顯示」狀態，不會出現在首頁
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "enrollment">("list");
  const [config, setConfig] = useState<CoursesConfig>(getLocalCoursesConfig);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [enrollCourseId, setEnrollCourseId] = useState<number | null>(null);
  const [previewCourseId, setPreviewCourseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "knowledge">("courses");
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [enrollCountMap, setEnrollCountMap] = useState<Record<string, number>>({});
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regDetail, setRegDetail] = useState<Registration | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const importRef = useRef<HTMLTextAreaElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showReorder, setShowReorder] = useState(false);

  // Sync view with browser hash navigation
  useEffect(() => {
    // Clear any leftover hash on mount, set to #list
    window.history.replaceState(null, "", window.location.pathname + "#list");

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#edit-")) {
        const raw = hash.replace("#edit-", "");
        const id = raw === "new" ? "new" : Number(raw);
        setEditingId(id as number | "new");
        setView("edit");
      } else if (hash.startsWith("#enrollment-")) {
        const id = Number(hash.replace("#enrollment-", ""));
        setEnrollCourseId(id);
        setView("enrollment");
      } else {
        setView("list");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      // Clean up hash when leaving admin
      window.history.replaceState(null, "", window.location.pathname);
    };
  }, []);

  useEffect(() => {
    getCoursesConfig().then(setConfig);
    fetchEnrollments().then(enrolls => {
      const map: Record<string, number> = {};
      for (const e of enrolls) {
        map[e.courseId] = (map[e.courseId] ?? 0) + 1;
      }
      setEnrollCountMap(map);
      setAllEnrollments(enrolls);
    });
    // Load registrations from Apps Script sheet
    setRegLoading(true);
    fetchRegistrations().then(regs => {
      setRegistrations(regs);
      setRegLoading(false);
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const persist = async (updated: CoursesConfig) => {
    setConfig(updated);
    setSaving(true);
    const result = await saveCoursesToAPI(updated);
    setSaving(false);
    if (result.ok) {
      window.dispatchEvent(new Event("courses-updated"));
      showToast("✅ 已儲存至 Google Sheets");
    } else {
      showToast(`❌ 儲存失敗：${result.error}`);
    }
  };

  const goToList = () => {
    window.location.hash = "#list";
    // hashchange will call setView("list")
  };

  const openEditView = (id: number | "new") => {
    setEditingId(id);
    window.location.hash = `#edit-${id}`;
    // hashchange will call setView("edit")
  };

  const togglePublished = (id: number) => {
    const updated = {
      ...config,
      courses: config.courses.map(c => c.id === id ? { ...c, published: !c.published } : c),
    };
    persist(updated);
  };

  const openEnrollmentView = async (courseId: number) => {
    const [schedData, enrollData] = await Promise.all([
      fetchSchedules(),
      fetchEnrollments(),
    ]);
    setEnrollCourseId(courseId);
    setAllSchedules(schedData);
    setAllEnrollments(enrollData);
    window.location.hash = `#enrollment-${courseId}`;
    // hashchange will call setView("enrollment")
  };

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (idx !== dragOverIndex) setDragOverIndex(idx);
  };
  const onDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const arr = [...config.courses];
      const [item] = arr.splice(dragIndex, 1);
      arr.splice(dragOverIndex, 0, item);
      persist({ ...config, courses: arr });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const saveCourseDraft = (draft: Course | Omit<Course, "id">) => {
    let updated: CoursesConfig;
    if ("id" in draft) {
      updated = {
        ...config,
        courses: config.courses.map(c => (c.id === (draft as Course).id ? (draft as Course) : c)),
      };
    } else {
      const maxId = config.courses.reduce((m, c) => Math.max(m, c.id), 0);
      const newCourse: Course = { ...(draft as Omit<Course, "id">), id: maxId + 1 };
      updated = { ...config, courses: [...config.courses, newCourse] };
    }
    goToList();
    setEditingId(null);
    persist(updated);
  };

  const deleteCourse = (id: number) => {
    if (!confirm("確定要刪除這門課程嗎？")) return;
    persist({ ...config, courses: config.courses.filter(c => c.id !== id) });
  };

  const handleReset = () => {
    if (!confirm("確定要還原為預設課程資料嗎？此操作無法復原。")) return;
    resetCoursesConfig();
    persist(defaultCoursesConfig);
  };

  const handleExport = () => {
    const json = exportCoursesConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 已下載備份檔");
  };

  const handleImport = () => {
    const json = importRef.current?.value ?? "";
    if (importCoursesConfig(json)) {
      const imported = getLocalCoursesConfig();
      persist(imported);
      setShowImport(false);
      showToast("✅ 匯入成功，已同步至 Google Sheets");
    } else {
      alert("格式錯誤，請確認 JSON 內容正確");
    }
  };

  const saveSectionMeta = (field: "sectionTitle" | "sectionSubtitle", val: string) => {
    setConfig(c => ({ ...c, [field]: val }));
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const enrollCourse = enrollCourseId !== null
    ? config.courses.find(c => c.id === enrollCourseId)
    : null;

  // ── Edit view ──
  if (view === "edit") {
    const initial = editingId === "new"
      ? emptyCourseDraft()
      : config.courses.find(c => c.id === editingId) ?? emptyCourseDraft();
    return (
      <div style={s.page}>
        <Toast msg={toast} />
        <div style={s.header}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>傳啓資訊 後台管理</div>
            <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>
              {saving ? "⏳ 儲存中..." : "精選課程編輯 · 已連接 Google Sheets"}
            </div>
          </div>
        </div>
        <div style={s.main}>
          <CourseForm
            initial={initial}
            onSave={saveCourseDraft}
            onCancel={goToList}
          />
        </div>
      </div>
    );
  }

  // ── Enrollment view ──
  if (view === "enrollment" && enrollCourse) {
    return (
      <div style={s.page}>
        <Toast msg={toast} />
        <div style={s.header}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700 }}>傳啓資訊 後台管理</div>
            <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>
              報名管理 · 已連接 Google Sheets
            </div>
          </div>
        </div>
        <div style={s.main}>
          <EnrollmentView
            course={enrollCourse}
            allSchedules={allSchedules}
            allEnrollments={allEnrollments}
            allRegistrations={registrations}
            onBack={goToList}
            onToggleStatus={async (status) => {
              const updated = {
                ...config,
                courses: config.courses.map(c =>
                  c.id === enrollCourse.id ? { ...c, status } : c
                ),
              };
              await persist(updated);
            }}
            showToast={showToast}
            onSchedulesChange={setAllSchedules}
            onEnrollmentsChange={setAllEnrollments}
          />
        </div>
      </div>
    );
  }

  const handleReorderSave = (ordered: Course[]) => {
    setShowReorder(false);
    persist({ ...config, courses: ordered });
    showToast("✅ 課程順序已儲存並同步前台");
  };

  // ── List view (default) ──
  return (
    <div style={s.page}>
      <Toast msg={toast} />
      {showReorder && (
        <ReorderModal
          courses={config.courses}
          onSave={handleReorderSave}
          onClose={() => setShowReorder(false)}
        />
      )}
      {previewCourseId !== null && (() => {
        const previewCourse = config.courses.find(c => c.id === previewCourseId);
        return previewCourse ? (
          <PreviewModal course={previewCourse} onClose={() => setPreviewCourseId(null)} />
        ) : null;
      })()}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>傳啓資訊 後台管理</div>
          <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>
            {saving ? "⏳ 儲存中..." : "精選課程編輯 · 已連接 Google Sheets"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={s.btnGhost} onClick={handleExport}>📥 匯出備份</button>
          <button style={s.btnGhost} onClick={() => setShowImport(v => !v)}>📤 匯入</button>
        </div>
      </div>

      <div style={s.main}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
          {([
            { key: "courses" as const, label: "📚 課程管理" },
            { key: "knowledge" as const, label: "🗂️ 知識庫" },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px 10px 0 0",
                border: "none",
                borderBottom: activeTab === tab.key ? "3px solid #1B3A6B" : "3px solid transparent",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#1B3A6B" : "#9CA3AF",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "courses" && (
        <>
        {/* Import panel */}
        {showImport && (
          <div style={{ ...s.card, border: "2px dashed #D1D5DB" }}>
            <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "12px", color: "#374151" }}>
              匯入備份 JSON
            </h3>
            <textarea
              ref={importRef}
              style={{ ...s.textarea, minHeight: "120px", fontFamily: "monospace", fontSize: "12px" }}
              placeholder="貼上備份的 JSON 內容..."
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={s.btnGreen} onClick={handleImport}>確認匯入</button>
              <button style={s.btnGhost} onClick={() => setShowImport(false)}>取消</button>
            </div>
          </div>
        )}

        {/* Course list */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B" }}>
              課程列表（共 {config.courses.length} 門）
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{ ...s.btnGhost, fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
                onClick={() => setShowReorder(true)}
              >
                ⇅ 調整順序
              </button>
              <button style={s.btnGreen} onClick={() => openEditView("new")}>＋ 新增課程</button>
            </div>
          </div>

          {config.courses.map((course, idx) => (
            <div
              key={course.id}
              style={{
                ...s.courseRow,
                opacity: dragIndex === idx ? 0.4 : 1,
                borderTop: dragOverIndex === idx && dragIndex !== null && dragIndex !== idx
                  ? "2px solid #1B3A6B"
                  : "none",
                cursor: dragIndex !== null ? "grabbing" : "default",
                transition: "opacity 0.15s",
              }}
              draggable
              onDragStart={e => onDragStart(e, idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
            >
              {/* Drag handle */}
              <div
                style={{
                  color: "#CBD5E1",
                  fontSize: "20px",
                  flexShrink: 0,
                  cursor: "grab",
                  userSelect: "none",
                  lineHeight: 1,
                  padding: "0 2px",
                }}
                title="拖拉以調整順序"
              >
                ⠿
              </div>

              {/* Thumbnail */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#E5E7EB",
                flexShrink: 0,
                position: "relative",
              }}>
                {course.backgroundImage && (
                  <img
                    src={course.backgroundImage}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                )}
                {course.status === "full" && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#fff",
                  }}>
                    額滿
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {course.title || "（無標題）"}
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{course.discountPrice} · {course.badge}</span>
                  <span style={{
                    backgroundColor: "#EFF6FF",
                    color: "#1D4ED8",
                    borderRadius: "10px",
                    padding: "1px 8px",
                    fontWeight: 600,
                    fontSize: "11px",
                  }}>
                    已報名 {enrollCountMap[String(course.id)] ?? 0} 人
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: course.status === "full" ? "#FEE2E2" : "#D1FAE5",
                color: course.status === "full" ? "#DC2626" : "#065F46",
                flexShrink: 0,
              }}>
                {course.status === "full" ? "🚫 額滿" : "✅ 開放中"}
              </div>

              {/* Published toggle */}
              <button
                onClick={() => togglePublished(course.id)}
                title={course.published ? "點擊隱藏（不顯示於首頁）" : "點擊顯示於首頁"}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  border: "none", cursor: "pointer",
                  background: "transparent",
                  padding: "4px 2px",
                  flexShrink: 0,
                }}
              >
                <span style={{
                  width: "34px", height: "20px", borderRadius: "10px",
                  backgroundColor: course.published ? "#1B3A6B" : "#D1D5DB",
                  position: "relative",
                  transition: "background-color 0.15s",
                  flexShrink: 0,
                }}>
                  <span style={{
                    position: "absolute", top: "2px",
                    left: course.published ? "16px" : "2px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    backgroundColor: "#fff",
                    transition: "left 0.15s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  }} />
                </span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: course.published ? "#1B3A6B" : "#9CA3AF", width: "36px" }}>
                  {course.published ? "顯示中" : "已隱藏"}
                </span>
              </button>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  style={{ ...s.btnIcon, fontSize: "18px", padding: "6px 12px", borderColor: "#BFDBFE", color: "#1D4ED8" }}
                  onClick={() => setPreviewCourseId(course.id)}
                  title="預覽前台效果"
                >
                  👁️
                </button>
                <button
                  style={{ ...s.btnIcon, fontSize: "18px", padding: "6px 12px" }}
                  onClick={() => openEditView(course.id)}
                  title="編輯課程"
                >
                  ✏️
                </button>
                <button
                  style={{ ...s.btnIconDanger, fontSize: "18px", padding: "6px 12px" }}
                  onClick={() => deleteCourse(course.id)}
                  title="刪除課程"
                >
                  🗑️
                </button>
                <button
                  style={{ ...s.btnIcon, fontSize: "18px", padding: "6px 12px", borderColor: "#BFDBFE", color: "#1D4ED8" }}
                  onClick={() => openEnrollmentView(course.id)}
                  title="報名清單"
                >
                  📋
                </button>
              </div>
            </div>
          ))}

          {config.courses.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
              目前沒有課程，點擊「新增課程」開始建立
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === "knowledge" && (
        <>
        {/* Registration stats table — 報名紀錄知識庫 */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B", margin: 0 }}>
                報名統計表
              </h2>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "4px 0 0" }}>
                來自 Google Sheets 表單報名資料，共 {registrations.length} 筆
              </p>
            </div>
            <button
              style={{ ...s.btnGhost, fontSize: "13px" }}
              onClick={() => { setRegLoading(true); fetchRegistrations().then(r => { setRegistrations(r); setRegLoading(false); }); }}
            >
              🔄 重新整理
            </button>
          </div>

          {regLoading ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#9CA3AF", fontSize: "14px" }}>
              載入中...
            </div>
          ) : registrations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#9CA3AF", fontSize: "14px" }}>
              尚無報名資料（請確認 Google Sheets 設定正確）
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: "32px" }}>#</th>
                  <th style={s.th}>姓名</th>
                  <th style={s.th}>課程</th>
                  <th style={s.th}>上課時間</th>
                  <th style={s.th}>時間戳記</th>
                  <th style={{ ...s.th, width: "70px" }}>詳情</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, idx) => (
                  <tr key={idx}>
                    <td style={{ ...s.td, color: "#9CA3AF", fontSize: "12px" }}>{idx + 1}</td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{reg.name || "—"}</td>
                    <td style={{ ...s.td, fontSize: "13px", maxWidth: "200px" }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {reg.course || "—"}
                      </span>
                    </td>
                    <td style={{ ...s.td, fontSize: "13px", color: "#4B5563" }}>{reg.sessionDate || "—"}</td>
                    <td style={{ ...s.td, fontSize: "11px", color: "#9CA3AF" }}>{reg.timestamp || "—"}</td>
                    <td style={s.td}>
                      <button
                        style={{ ...s.btnIcon, fontSize: "13px", padding: "4px 10px", color: "#1D4ED8", borderColor: "#BFDBFE" }}
                        onClick={() => setRegDetail(reg)}
                      >
                        詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </>
        )}

        {/* Registration detail modal */}
        {regDetail && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={e => { if (e.target === e.currentTarget) setRegDetail(null); }}
          >
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#1B3A6B", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>報名詳情</div>
                <button onClick={() => setRegDetail(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "20px", cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {[
                  ["姓名", regDetail.name],
                  ["課程", regDetail.course],
                  ["上課時間", regDetail.sessionDate],
                  ["手機號碼", regDetail.phone],
                  ["Email", regDetail.email],
                  ["公司/職稱", regDetail.company],
                  ["統一編號", regDetail.taxId],
                  ["得知管道", regDetail.referral],
                  ["備註", regDetail.notes],
                  ["報名時間", regDetail.timestamp],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "90px", fontSize: "12px", color: "#6B7280", fontWeight: 600, flexShrink: 0 }}>{label}</div>
                    <div style={{ fontSize: "13px", color: "#111827", wordBreak: "break-all" }}>{value || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: "12px", color: "#D1D5DB", marginTop: "32px" }}>
          傳啓資訊後台管理系統 · 資料儲存於 Google Sheets
        </p>
      </div>
    </div>
  );
}

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
  type Schedule,
  type Enrollment,
} from "@/lib/enrollmentsStorage";
import {
  defaultCoursesConfig,
  type Course,
  type CoursesConfig,
  type BadgeColor,
} from "@/data/defaultCourses";

const ADMIN_PASSWORD = "262@Admin";
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
          262學院 後台管理
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
  onBack,
  onToggleStatus,
  showToast,
  onSchedulesChange,
  onEnrollmentsChange,
}: {
  course: Course;
  allSchedules: Schedule[];
  allEnrollments: Enrollment[];
  onBack: () => void;
  onToggleStatus: (status: "open" | "full") => Promise<void>;
  showToast: (msg: string) => void;
  onSchedulesChange: (all: Schedule[]) => void;
  onEnrollmentsChange: (all: Enrollment[]) => void;
}) {
  const cid = String(course.id);
  const [schedules, setSchedules] = useState<Schedule[]>(
    allSchedules.filter(s => s.courseId === cid)
  );
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

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button style={s.btnGhost} onClick={onBack}>← 返回課程列表</button>
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
              <th style={{ ...s.th, width: "100px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "24px" }}>
                  尚無梯次，點擊「新增梯次」建立
                </td>
              </tr>
            )}
            {schedules.map(sched => {
              const isEditing = editingSchedId === sched.id;
              const d = isEditing ? schedDraft! : sched;
              return (
                <tr key={sched.id}>
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
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const importRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getCoursesConfig().then(setConfig);
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

  const openEditView = (id: number | "new") => {
    setEditingId(id);
    setView("edit");
  };

  const openEnrollmentView = async (courseId: number) => {
    setEnrollCourseId(courseId);
    const [schedData, enrollData] = await Promise.all([
      fetchSchedules(),
      fetchEnrollments(),
    ]);
    setAllSchedules(schedData);
    setAllEnrollments(enrollData);
    setView("enrollment");
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
    setView("list");
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
            <div style={{ fontSize: "18px", fontWeight: 700 }}>262學院 後台管理</div>
            <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>
              {saving ? "⏳ 儲存中..." : "精選課程編輯 · 已連接 Google Sheets"}
            </div>
          </div>
        </div>
        <div style={s.main}>
          <CourseForm
            initial={initial}
            onSave={saveCourseDraft}
            onCancel={() => setView("list")}
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
            <div style={{ fontSize: "18px", fontWeight: 700 }}>262學院 後台管理</div>
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
            onBack={() => setView("list")}
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

  // ── List view (default) ──
  return (
    <div style={s.page}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>262學院 後台管理</div>
          <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>
            {saving ? "⏳ 儲存中..." : "精選課程編輯 · 已連接 Google Sheets"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={s.btnGhost} onClick={handleExport}>📥 匯出備份</button>
          <button style={s.btnGhost} onClick={() => setShowImport(v => !v)}>📤 匯入</button>
          <button style={{ ...s.btnDanger, padding: "8px 14px", fontSize: "13px" }} onClick={handleReset}>
            🔄 還原預設
          </button>
        </div>
      </div>

      <div style={s.main}>
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

        {/* Section meta */}
        <div style={s.card}>
          <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B", marginBottom: "16px" }}>
            區塊標題設定
          </h2>
          <div style={s.grid2}>
            <div>
              <label style={s.label}>大標題</label>
              <input
                style={s.input}
                value={config.sectionTitle}
                onChange={e => saveSectionMeta("sectionTitle", e.target.value)}
                onBlur={() => persist(config)}
              />
            </div>
            <div>
              <label style={s.label}>副標語</label>
              <input
                style={s.input}
                value={config.sectionSubtitle}
                onChange={e => saveSectionMeta("sectionSubtitle", e.target.value)}
                onBlur={() => persist(config)}
              />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
            輸入完成後點擊其他地方即自動儲存至 Google Sheets
          </p>
        </div>

        {/* Course list */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B" }}>
              課程列表（共 {config.courses.length} 門）
            </h2>
            <button style={s.btnGreen} onClick={() => openEditView("new")}>＋ 新增課程</button>
          </div>

          {config.courses.map(course => (
            <div key={course.id} style={s.courseRow}>
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
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                  {course.discountPrice} · {course.badge}
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

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
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

        <p style={{ textAlign: "center", fontSize: "12px", color: "#D1D5DB", marginTop: "32px" }}>
          262學院後台管理系統 · 資料儲存於 Google Sheets
        </p>
      </div>
    </div>
  );
}

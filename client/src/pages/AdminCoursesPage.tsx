import { useState, useRef } from "react";
import {
  getCoursesConfig,
  saveCoursesConfig,
  resetCoursesConfig,
  exportCoursesConfig,
  importCoursesConfig,
} from "@/lib/coursesStorage";
import { defaultCoursesConfig, type Course, type CoursesConfig, type BadgeColor } from "@/data/defaultCourses";

const ADMIN_PASSWORD = "262@Admin";
const BADGE_COLORS: BadgeColor[] = ["pink", "purple", "green", "gold", "teal"];
const BADGE_COLOR_LABELS: Record<BadgeColor, string> = {
  pink: "粉紅",
  purple: "紫色",
  green: "綠色",
  gold: "金色",
  teal: "青色",
};

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
  };
}

// ── Styles ──────────────────────────────────────────────────────────────────
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
    maxWidth: "960px",
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
};

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

// ── Course form ───────────────────────────────────────────────────────────────
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
      <h3 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B", marginBottom: "20px" }}>
        {"id" in draft ? `編輯課程 #${"id" in draft ? (draft as Course).id : ""}` : "新增課程"}
      </h3>

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

// ── Main admin page ───────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const [authed, setAuthed] = useState(false);
  const [config, setConfig] = useState<CoursesConfig>(getCoursesConfig);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [toast, setToast] = useState("");
  const [showImport, setShowImport] = useState(false);
  const importRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const persist = (updated: CoursesConfig) => {
    saveCoursesConfig(updated);
    setConfig(updated);
    window.dispatchEvent(new Event("courses-updated"));
  };

  const saveSectionMeta = (field: "sectionTitle" | "sectionSubtitle", val: string) => {
    persist({ ...config, [field]: val });
  };

  const saveCourseDraft = (draft: Course | Omit<Course, "id">) => {
    if ("id" in draft && typeof (draft as Course).id === "number") {
      const updated = config.courses.map(c => c.id === (draft as Course).id ? draft as Course : c);
      persist({ ...config, courses: updated });
    } else {
      const maxId = config.courses.reduce((m, c) => Math.max(m, c.id), 0);
      const newCourse: Course = { ...(draft as Omit<Course, "id">), id: maxId + 1 };
      persist({ ...config, courses: [...config.courses, newCourse] });
    }
    setEditingId(null);
    showToast("✅ 已儲存");
  };

  const deleteCourse = (id: number) => {
    if (!confirm("確定要刪除這門課程嗎？")) return;
    persist({ ...config, courses: config.courses.filter(c => c.id !== id) });
    showToast("🗑️ 已刪除");
  };

  const moveCourse = (idx: number, dir: -1 | 1) => {
    const arr = [...config.courses];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    persist({ ...config, courses: arr });
  };

  const handleReset = () => {
    if (!confirm("確定要還原為預設課程資料嗎？此操作無法復原。")) return;
    resetCoursesConfig();
    setConfig(defaultCoursesConfig);
    window.dispatchEvent(new Event("courses-updated"));
    showToast("🔄 已還原預設");
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
      setConfig(getCoursesConfig());
      window.dispatchEvent(new Event("courses-updated"));
      setShowImport(false);
      showToast("✅ 匯入成功");
    } else {
      alert("格式錯誤，請確認 JSON 內容正確");
    }
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const editing = editingId === "new"
    ? emptyCourseDraft()
    : editingId !== null
    ? config.courses.find(c => c.id === editingId)
    : null;

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          backgroundColor: "#1B3A6B", color: "#fff", padding: "12px 20px",
          borderRadius: "10px", fontWeight: 600, fontSize: "14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700 }}>262學院 後台管理</div>
          <div style={{ fontSize: "12px", color: "#93C5FD", marginTop: "2px" }}>精選課程編輯</div>
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
              placeholder='貼上備份的 JSON 內容...'
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
              />
            </div>
            <div>
              <label style={s.label}>副標語</label>
              <input
                style={s.input}
                value={config.sectionSubtitle}
                onChange={e => saveSectionMeta("sectionSubtitle", e.target.value)}
              />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
            修改後即時生效（標題輸入後自動儲存）
          </p>
        </div>

        {/* Course list */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "16px", color: "#1B3A6B" }}>
              課程列表（共 {config.courses.length} 門）
            </h2>
            <button style={s.btnGreen} onClick={() => setEditingId("new")}>＋ 新增課程</button>
          </div>

          {config.courses.map((course, idx) => (
            <div key={course.id} style={s.courseRow}>
              {/* Thumbnail */}
              <div style={{
                width: "56px", height: "56px", borderRadius: "8px", overflow: "hidden",
                backgroundColor: "#E5E7EB", flexShrink: 0,
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

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {course.title || "（無標題）"}
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
                  {course.discountPrice} · {course.badge}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  style={{ ...s.btnGhost, padding: "6px 10px", fontSize: "16px" }}
                  onClick={() => moveCourse(idx, -1)}
                  disabled={idx === 0}
                  title="上移"
                >▲</button>
                <button
                  style={{ ...s.btnGhost, padding: "6px 10px", fontSize: "16px" }}
                  onClick={() => moveCourse(idx, 1)}
                  disabled={idx === config.courses.length - 1}
                  title="下移"
                >▼</button>
                <button style={{ ...s.btnPrimary, padding: "6px 14px", fontSize: "13px" }} onClick={() => setEditingId(course.id)}>
                  編輯
                </button>
                <button style={{ ...s.btnDanger, padding: "6px 10px" }} onClick={() => deleteCourse(course.id)}>
                  刪除
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

        {/* Edit form */}
        {editing !== undefined && editing !== null && (
          <CourseForm
            initial={editing}
            onSave={saveCourseDraft}
            onCancel={() => setEditingId(null)}
          />
        )}

        <p style={{ textAlign: "center", fontSize: "12px", color: "#D1D5DB", marginTop: "32px" }}>
          262學院後台管理系統 · 所有修改即時儲存於此瀏覽器
        </p>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  PenLine,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Type,
  AlignLeft,
  Tag,
} from "lucide-react";
import {
  getCoursesConfig,
  saveCoursesToAPI,
  uploadCourseImage,
} from "@/lib/coursesStorage";
import type { Course, BadgeColor } from "@/data/defaultCourses";
import CourseCard from "@/components/CourseCard";

// ── Design tokens — 日式簡約科技感 ───────────────────────────────────────────
const ink = "#2B2B28";
const inkSoft = "#8C8577";
const accent = "#1B3A6B";
const paper = "#FAF9F6";
const line = "#E3DFD5";
const danger = "#B3564A";
const mono = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";

const BADGE_COLORS: BadgeColor[] = ["pink", "purple", "green", "gold", "teal"];
const BADGE_COLOR_HEX: Record<BadgeColor, string> = {
  pink: "#C98A93",
  purple: "#9C8AAE",
  green: "#8FA688",
  gold: "#C6A15B",
  teal: "#7CA79E",
};
const CSV_COLUMNS = [
  "courseCode",
  "title",
  "tools",
  "description",
  "badge",
  "badgeColor",
  "location",
  "originalPrice",
  "discountPrice",
  "backgroundImage",
  "detailPath",
  "status",
] as const;

const CSV_COLUMN_LABELS: Record<(typeof CSV_COLUMNS)[number], string> = {
  courseCode: "課程編碼(選填,3~5碼數字)",
  title: "課程名稱",
  tools: "副標語",
  description: "課程描述",
  badge: "徽章文字",
  badgeColor: "徽章顏色(pink/purple/green/gold/teal)",
  location: "上課地點(選填)",
  originalPrice: "原價",
  discountPrice: "特價",
  backgroundImage: "封面圖片路徑",
  detailPath: "詳情頁路徑(選填)",
  status: "狀態(open/full)",
};

function emptyDraft(): Omit<Course, "id"> {
  return {
    courseCode: "",
    title: "",
    description: "",
    tools: "",
    originalPrice: "NT$ 4,000",
    discountPrice: "NT$ 2,000",
    badge: "",
    badgeColor: "gold",
    location: "",
    backgroundImage: "",
    detailPath: "",
    status: "open",
    published: false,
  };
}

type Draft = Omit<Course, "id">;

interface Step {
  key: keyof Draft;
  question: string;
  hint?: string;
  required: boolean;
  type: "text" | "textarea" | "image";
  placeholder?: string;
}

const steps: Step[] = [
  { key: "courseCode", question: "課程編碼？（選填）", hint: "3～5 碼數字，例如：262 或 26200", required: false, type: "text", placeholder: "例如：262" },
  { key: "title", question: "課程名稱是什麼？", hint: "會顯示在課程卡片標題", required: true, type: "text", placeholder: "例如：讓手機搞定大小事" },
  { key: "tools", question: "課程副標語是什麼？", hint: "顯示在標題下方的一句話說明", required: true, type: "text", placeholder: "例如：學會手機 AI 工具應用，搞定生活大小事" },
  { key: "backgroundImage", question: "課程封面圖片？", hint: "可上傳本機照片，或直接貼上圖片網址", required: true, type: "image" },
  { key: "description", question: "課程詳細描述？", hint: "顯示在卡片內文，也會用於課程頁面", required: true, type: "textarea", placeholder: "介紹課程內容、對象與學習成果…" },
  { key: "location", question: "上課地點？（選填）", required: false, type: "text", placeholder: "例如：台中市西屯區河南路二段262號3樓之11" },
  { key: "badge", question: "課程關鍵字？", hint: "多個關鍵字請用「、」分隔，例如：3H特訓班、上班族、行銷人員", required: true, type: "text", placeholder: "例如：3H特訓班、上班族、行銷人員" },
  { key: "originalPrice", question: "原價？", required: true, type: "text", placeholder: "NT$ 4,000" },
  { key: "discountPrice", question: "特價？", required: true, type: "text", placeholder: "NT$ 2,000" },
];

const stepTypeIcon: Record<Step["type"], typeof Type> = {
  text: Type,
  textarea: AlignLeft,
  image: ImageIcon,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: "17px",
  padding: "10px 2px",
  border: "none",
  borderBottom: `1px solid ${line}`,
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
  color: ink,
};

const card: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${line}`,
  borderRadius: "2px",
  padding: "48px 44px",
  position: "relative",
};

const kicker: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "11px",
  letterSpacing: "0.2em",
  color: inkSoft,
  fontWeight: 500,
  textTransform: "uppercase",
};

// Blueprint-style corner marks — 科技感點綴
function CornerMarks() {
  const mark: React.CSSProperties = { position: "absolute", width: "14px", height: "14px", pointerEvents: "none" };
  return (
    <>
      <span style={{ ...mark, top: "-1px", left: "-1px", borderTop: `1.5px solid ${accent}`, borderLeft: `1.5px solid ${accent}` }} />
      <span style={{ ...mark, bottom: "-1px", right: "-1px", borderBottom: `1.5px solid ${accent}`, borderRight: `1.5px solid ${accent}` }} />
    </>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ ...card, ...style }}>
      <CornerMarks />
      {children}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "13px 28px",
  background: accent,
  color: "#fff",
  border: `1px solid ${accent}`,
  borderRadius: "2px",
  fontWeight: 500,
  fontSize: "13px",
  letterSpacing: "0.08em",
  cursor: "pointer",
};

const btnOutline: React.CSSProperties = {
  padding: "13px 28px",
  background: "transparent",
  color: accent,
  border: `1px solid ${accent}`,
  borderRadius: "2px",
  fontWeight: 500,
  fontSize: "13px",
  letterSpacing: "0.08em",
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  padding: "10px 4px",
  background: "transparent",
  border: "none",
  color: inkSoft,
  fontSize: "13px",
  letterSpacing: "0.05em",
  cursor: "pointer",
};

// ── CSV helpers ────────────────────────────────────────────────────────────
function csvEscape(v: string): string {
  if (v.includes(",") || v.includes("\n") || v.includes('"')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

function buildTemplateCsv(): string {
  const header = CSV_COLUMNS.map((c) => csvEscape(CSV_COLUMN_LABELS[c])).join(",");
  const example = [
    "262",
    "讓手機搞定大小事",
    "學會手機 AI 工具應用，搞定生活大小事",
    "本課程專為科技小白與長輩朋友設計，採漸進式教學…",
    "3H特訓班",
    "green",
    "台中市西屯區河南路二段262號3樓之11",
    "NT$ 4,000",
    "NT$ 2,000",
    "/課程封面.jpg",
    "",
    "open",
  ].map(csvEscape).join(",");
  return "﻿" + header + "\n" + example + "\n";
}

function downloadTemplate() {
  const csv = buildTemplateCsv();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "課程上架公版.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Minimal RFC4180-style CSV parser (handles quoted fields with commas/newlines)
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim().length > 0));
}

function rowsToDrafts(rows: string[][]): { drafts: Draft[]; errors: string[] } {
  const errors: string[] = [];
  const dataRows = rows.slice(1); // skip header
  const drafts: Draft[] = [];

  dataRows.forEach((r, i) => {
    const lineNo = i + 2;
    const get = (idx: number) => (r[idx] ?? "").trim();
    const title = get(1);
    if (!title) {
      errors.push(`第 ${lineNo} 列：缺少課程名稱，已略過`);
      return;
    }
    let courseCode = get(0).replace(/\D/g, "").slice(0, 5);
    if (courseCode && courseCode.length < 3) {
      errors.push(`第 ${lineNo} 列：課程編碼「${get(0)}」不足 3 碼，已略過此欄位`);
      courseCode = "";
    }
    let badgeColor = get(5).toLowerCase() as BadgeColor;
    if (!BADGE_COLORS.includes(badgeColor)) {
      errors.push(`第 ${lineNo} 列：徽章顏色「${get(5)}」不合法，已改用 gold`);
      badgeColor = "gold";
    }
    let status = get(11).toLowerCase();
    if (status !== "open" && status !== "full") {
      if (status) errors.push(`第 ${lineNo} 列：狀態「${get(11)}」不合法，已改用 open`);
      status = "open";
    }
    drafts.push({
      courseCode,
      title,
      tools: get(2),
      description: get(3),
      badge: get(4),
      badgeColor,
      location: get(6),
      originalPrice: get(7) || "NT$ 0",
      discountPrice: get(8) || "NT$ 0",
      backgroundImage: get(9),
      detailPath: get(10),
      status: status as "open" | "full",
      published: false,
    });
  });

  return { drafts, errors };
}

// ── Mode select landing ──────────────────────────────────────────────────────
function ModeSelect({ onPick }: { onPick: (mode: "manual" | "excel") => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper, padding: "20px" }}>
      <div style={{ width: "620px", maxWidth: "100%" }}>
        <p style={{ ...kicker, textAlign: "center", marginBottom: "14px" }}>Course Publishing</p>
        <h1 style={{ fontSize: "26px", fontWeight: 400, color: ink, textAlign: "center", marginBottom: "8px", letterSpacing: "0.05em" }}>課程上架</h1>
        <p style={{ fontSize: "13px", color: inkSoft, textAlign: "center", marginBottom: "48px" }}>請選擇上架方式</p>

        <div style={{ display: "flex", gap: "1px", background: line, border: `1px solid ${line}` }}>
          <button
            onClick={() => onPick("excel")}
            style={{ flex: 1, background: "#fff", border: "none", padding: "44px 24px", cursor: "pointer", textAlign: "center" }}
          >
            <FileSpreadsheet size={22} strokeWidth={1.3} color={accent} style={{ marginBottom: "16px" }} />
            <p style={{ ...kicker, marginBottom: "16px" }}>01</p>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: ink, marginBottom: "8px", letterSpacing: "0.03em" }}>上傳 Excel 上架</h2>
            <p style={{ fontSize: "12px", color: inkSoft, lineHeight: 1.7 }}>一次上傳多堂課程</p>
          </button>

          <button
            onClick={() => onPick("manual")}
            style={{ flex: 1, background: "#fff", border: "none", padding: "44px 24px", cursor: "pointer", textAlign: "center" }}
          >
            <PenLine size={22} strokeWidth={1.3} color={accent} style={{ marginBottom: "16px" }} />
            <p style={{ ...kicker, marginBottom: "16px" }}>02</p>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: ink, marginBottom: "8px", letterSpacing: "0.03em" }}>手動上架</h2>
            <p style={{ fontSize: "12px", color: inkSoft, lineHeight: 1.7 }}>逐題填寫，一次一堂課</p>
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button onClick={downloadTemplate} style={{ ...btnGhost, borderBottom: `1px solid ${inkSoft}`, display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Download size={13} strokeWidth={1.5} /> 下載課程上架公版
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Excel/CSV batch import ───────────────────────────────────────────────────
function ExcelImport({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCsv(text);
      const { drafts: parsed, errors: parseErrors } = rowsToDrafts(rows);
      setDrafts(parsed);
      setErrors(parseErrors);
    };
    reader.readAsText(file, "utf-8");
  };

  const submitAll = async () => {
    if (!drafts || drafts.length === 0) return;
    setSaving(true);
    setSaveError("");
    try {
      const config = await getCoursesConfig();
      let nextId = config.courses.length > 0 ? Math.max(...config.courses.map((c) => c.id)) + 1 : 1;
      const newCourses: Course[] = drafts.map((d) => {
        const id = nextId++;
        return { id, ...d, detailPath: d.detailPath || `/course/${id}` };
      });
      const updated = { ...config, courses: [...config.courses, ...newCourses] };
      const result = await saveCoursesToAPI(updated);
      if (!result.ok) {
        setSaveError(result.error ?? "儲存失敗，請稍後再試");
        setSaving(false);
        return;
      }
      setDone(true);
    } catch (err) {
      setSaveError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper }}>
        <Panel style={{ width: "440px", maxWidth: "92vw", textAlign: "center" }}>
          <CheckCircle2 size={30} strokeWidth={1.5} color={accent} style={{ marginBottom: "16px" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: ink, marginBottom: "10px" }}>課程已上架</h2>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "32px" }}>已成功加入 {drafts?.length ?? 0} 堂課程</p>
          <button onClick={onBack} style={{ ...btnPrimary, width: "100%", marginBottom: "14px" }}>
            返回
          </button>
          <a href="/" style={{ display: "block", fontSize: "12px", color: inkSoft }}>回到首頁查看</a>
        </Panel>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: paper, padding: "40px 20px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <button onClick={onBack} style={{ ...btnGhost, marginBottom: "20px", padding: "0", display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={14} strokeWidth={1.5} /> 返回
        </button>

        <Panel>
          <p style={{ ...kicker, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileSpreadsheet size={14} strokeWidth={1.5} /> 01 · Excel
          </p>
          <h2 style={{ fontSize: "19px", fontWeight: 600, color: ink, marginBottom: "8px" }}>Excel 批次上架</h2>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "28px", lineHeight: 1.8 }}>
            請先下載公版填寫，另存為 CSV 格式後上傳（Excel 開啟公版後直接編輯即可）。
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ ...btnPrimary, display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <UploadCloud size={15} strokeWidth={1.5} /> 選擇 Excel / CSV 檔案
            </button>
            <button onClick={downloadTemplate} style={{ ...btnOutline, display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Download size={15} strokeWidth={1.5} />
              下載課程上架公版
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>

          {fileName && <p style={{ fontSize: "12px", color: inkSoft, marginBottom: "16px" }}>已選擇檔案　{fileName}</p>}

          {errors.length > 0 && (
            <div style={{ borderLeft: `2px solid ${danger}`, padding: "10px 16px", marginBottom: "20px", background: "#FBF5F3", display: "flex", gap: "10px" }}>
              <AlertTriangle size={14} strokeWidth={1.5} color={danger} style={{ marginTop: "3px", flexShrink: 0 }} />
              <div>
                {errors.map((e, i) => (
                  <p key={i} style={{ fontSize: "12px", color: danger, margin: "3px 0" }}>{e}</p>
                ))}
              </div>
            </div>
          )}

          {drafts && (
            <>
              <div style={{ maxHeight: "360px", overflowY: "auto", border: `1px solid ${line}`, marginBottom: "20px" }}>
                {drafts.length === 0 ? (
                  <p style={{ fontSize: "13px", color: inkSoft, padding: "24px", textAlign: "center" }}>沒有解析到任何課程資料</p>
                ) : (
                  drafts.map((d, i) => (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: i < drafts.length - 1 ? `1px solid ${line}` : "none", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: ink }}>{d.title}</p>
                        <p style={{ fontSize: "12px", color: inkSoft, marginTop: "2px" }}>{d.tools}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: BADGE_COLOR_HEX[d.badgeColor], display: "inline-block" }} />
                        <span style={{ fontSize: "13px", color: ink }}>{d.discountPrice}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {saveError && <p style={{ color: danger, fontSize: "13px", marginBottom: "14px" }}>{saveError}</p>}

              <button
                onClick={submitAll}
                disabled={saving || drafts.length === 0}
                style={{ ...btnPrimary, width: "100%", opacity: saving || drafts.length === 0 ? 0.5 : 1, cursor: saving || drafts.length === 0 ? "default" : "pointer" }}
              >
                {saving ? "上架中" : `確認上架　${drafts.length} 堂課程`}
              </button>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

// ── Manual wizard ──────────────────────────────────────────────────────────
function Wizard({ onBack }: { onBack: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [reviewing, setReviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const set = (k: keyof Draft, v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const handleImagePick = async (file: File) => {
    setUploadingImage(true);
    setUploadError("");
    const result = await uploadCourseImage(file);
    setUploadingImage(false);
    if (!result.ok || !result.url) {
      setUploadError(result.error ?? "上傳失敗，請稍後再試");
      return;
    }
    set("backgroundImage", result.url);
  };

  const step = steps[stepIndex];
  const StepIcon = stepTypeIcon[step.type];
  const progress = Math.round(((reviewing ? steps.length : stepIndex) / steps.length) * 100);

  const currentValid = !step.required || String(draft[step.key]).trim().length > 0;

  const goNext = () => {
    if (!currentValid) return;
    if (stepIndex === steps.length - 1) {
      setReviewing(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const goBack = () => {
    if (reviewing) {
      setReviewing(false);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      onBack();
    }
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const config = await getCoursesConfig();
      const nextId = config.courses.length > 0 ? Math.max(...config.courses.map((c) => c.id)) + 1 : 1;
      const newCourse: Course = { id: nextId, ...draft, detailPath: draft.detailPath || `/course/${nextId}` };
      const updated = { ...config, courses: [...config.courses, newCourse] };
      const result = await saveCoursesToAPI(updated);
      if (!result.ok) {
        setError(result.error ?? "儲存失敗，請稍後再試");
        setSaving(false);
        return;
      }
      setDone(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const startOver = () => {
    setDraft(emptyDraft());
    setStepIndex(0);
    setReviewing(false);
    setDone(false);
    setError("");
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: paper }}>
        <Panel style={{ width: "440px", maxWidth: "92vw", textAlign: "center" }}>
          <CheckCircle2 size={30} strokeWidth={1.5} color={accent} style={{ marginBottom: "16px" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: ink, marginBottom: "10px" }}>課程已上架</h2>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "32px" }}>「{draft.title}」已成功加入課程列表</p>
          <button onClick={startOver} style={{ ...btnPrimary, width: "100%", marginBottom: "14px" }}>
            繼續上架下一堂課
          </button>
          <a href="/" style={{ display: "block", fontSize: "12px", color: inkSoft }}>回到首頁查看</a>
        </Panel>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: paper }}>
      {/* Progress hairline */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: line, zIndex: 10 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: accent, transition: "width 0.25s ease" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 20px" }}>
        <div style={{ width: "540px", maxWidth: "100%" }}>
          <p style={{ ...kicker, marginBottom: "12px" }}>
            課程上架　{reviewing ? "確認資料" : `${String(stepIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`}
          </p>

          {!reviewing ? (
            <Panel>
              <StepIcon size={18} strokeWidth={1.5} color={inkSoft} style={{ position: "absolute", top: "24px", right: "24px" }} />
              <h2 style={{ fontSize: "21px", fontWeight: 600, color: ink, marginBottom: step.hint ? "6px" : "24px", lineHeight: 1.5, paddingRight: "28px" }}>
                {step.question} {step.required && <span style={{ color: danger }}>*</span>}
              </h2>
              {step.hint && <p style={{ fontSize: "12px", color: inkSoft, marginBottom: "24px" }}>{step.hint}</p>}

              {step.type === "text" && (
                <input
                  type="text"
                  inputMode={step.key === "courseCode" ? "numeric" : undefined}
                  value={draft[step.key] as string}
                  onChange={(e) =>
                    set(step.key, step.key === "courseCode" ? e.target.value.replace(/\D/g, "").slice(0, 5) : e.target.value)
                  }
                  onKeyDown={(e) => e.key === "Enter" && goNext()}
                  placeholder={step.placeholder}
                  style={inputStyle}
                  autoFocus
                />
              )}

              {step.key === "badge" && draft.badge.includes("、") && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                  {draft.badge.split("、").map((k) => k.trim()).filter(Boolean).map((k, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        padding: "6px 14px", borderRadius: "999px",
                        border: `1px solid ${line}`, background: paper,
                        fontSize: "12px", color: ink, fontWeight: 500,
                      }}
                    >
                      <Tag size={11} strokeWidth={1.5} color={inkSoft} /> {k}
                    </span>
                  ))}
                </div>
              )}

              {step.type === "textarea" && (
                <textarea
                  value={draft[step.key] as string}
                  onChange={(e) => set(step.key, e.target.value)}
                  placeholder={step.placeholder}
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical" }}
                  autoFocus
                />
              )}

              {step.type === "image" && (
                <div>
                  <input
                    type="text"
                    value={draft.backgroundImage}
                    onChange={(e) => set("backgroundImage", e.target.value)}
                    placeholder="/課程封面.jpg 或貼上圖片網址"
                    style={inputStyle}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "18px" }}>
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      style={{ ...btnOutline, display: "inline-flex", alignItems: "center", gap: "8px", opacity: uploadingImage ? 0.6 : 1 }}
                    >
                      <UploadCloud size={15} strokeWidth={1.5} /> {uploadingImage ? "上傳中" : "上傳本機照片"}
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImagePick(f);
                        e.target.value = "";
                      }}
                    />
                    <div style={{ width: "64px", height: "64px", border: `1px solid ${line}`, overflow: "hidden", background: paper, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {draft.backgroundImage ? (
                        <img
                          src={draft.backgroundImage}
                          alt="預覽"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      ) : (
                        <ImageIcon size={20} strokeWidth={1.3} color={line} />
                      )}
                    </div>
                  </div>
                  {uploadError && <p style={{ color: danger, fontSize: "12px", marginTop: "10px" }}>{uploadError}</p>}
                </div>
              )}
            </Panel>
          ) : (
            <Panel>
              <ClipboardCheck size={18} strokeWidth={1.5} color={inkSoft} style={{ position: "absolute", top: "24px", right: "24px" }} />
              <h2 style={{ fontSize: "21px", fontWeight: 600, color: ink, marginBottom: "6px", paddingRight: "28px" }}>確認課程資料</h2>
              <p style={{ fontSize: "12px", color: inkSoft, marginBottom: "24px" }}>以下為上架後在首頁課程卡片的實際呈現效果</p>

              <div style={{ width: "260px", margin: "0 auto 28px" }}>
                <CourseCard
                  courseCode={draft.courseCode}
                  title={draft.title || "（未填寫課程名稱）"}
                  description={draft.description}
                  tools={draft.tools}
                  originalPrice={draft.originalPrice}
                  discountPrice={draft.discountPrice}
                  instructorImage=""
                  instructorName=""
                  badge={draft.badge}
                  badgeColor={draft.badgeColor}
                  backgroundImage={draft.backgroundImage}
                  status={draft.status}
                />
              </div>

              {error && <p style={{ color: danger, fontSize: "13px", marginBottom: "14px" }}>{error}</p>}
              <button
                onClick={submit}
                disabled={saving}
                style={{ ...btnPrimary, width: "100%", opacity: saving ? 0.5 : 1, cursor: saving ? "default" : "pointer" }}
              >
                {saving ? "上架中" : "確認上架"}
              </button>
            </Panel>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button onClick={goBack} style={{ ...btnGhost, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ArrowLeft size={14} strokeWidth={1.5} /> 上一步
            </button>
            {!reviewing && (
              <button
                onClick={goNext}
                disabled={!currentValid}
                style={{ ...btnPrimary, display: "inline-flex", alignItems: "center", gap: "8px", background: currentValid ? accent : "#D9D5CB", border: `1px solid ${currentValid ? accent : "#D9D5CB"}`, cursor: currentValid ? "pointer" : "default" }}
              >
                {stepIndex === steps.length - 1 ? "檢查資料" : "下一步"} <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadCoursePage() {
  const [mode, setMode] = useState<"select" | "manual" | "excel">("select");

  if (mode === "manual") return <Wizard onBack={() => setMode("select")} />;
  if (mode === "excel") return <ExcelImport onBack={() => setMode("select")} />;
  return <ModeSelect onPick={setMode} />;
}

import type { CSSProperties } from "react";

// Shared design tokens for the admin surfaces (課程後台管理系統 +
// the native student-hours views) — matches course-info-262x.html's
// :root palette (ink-950/ink-600/clay-600/page-bg/line/crit-600) and font stack.
export const ink = "#14150F";
export const inkSoft = "#71735F";
export const accent = "#FF5B22";
export const paper = "#EAECE4";
export const line = "#E7E8DD";
export const danger = "#CF4F39";
export const good = "#1F8F5C";
export const mono = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";
export const bodyFont = "'Manrope', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif";

export const adminStyles = {
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${line}`,
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  } as CSSProperties,
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: ink,
    marginBottom: "6px",
  } as CSSProperties,
  input: {
    width: "100%",
    border: `1px solid ${line}`,
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    outline: "none",
    marginBottom: "14px",
    background: "#fff",
    color: ink,
    fontFamily: bodyFont,
  } as CSSProperties,
  btnPrimary: {
    backgroundColor: accent,
    color: "#fff",
    border: `1px solid ${accent}`,
    borderRadius: "999px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: bodyFont,
  } as CSSProperties,
  btnGhost: {
    backgroundColor: "transparent",
    color: inkSoft,
    border: `1px solid ${line}`,
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: bodyFont,
  } as CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
  } as CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "8px 10px",
    borderBottom: `1px solid ${line}`,
    fontWeight: 700,
    color: inkSoft,
    fontSize: "11px",
  } as CSSProperties,
  td: {
    padding: "10px",
    borderBottom: `1px solid ${line}`,
    color: ink,
  } as CSSProperties,
};

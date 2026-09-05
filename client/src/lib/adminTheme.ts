import type { CSSProperties } from "react";

// Shared design tokens for the admin surfaces (課程後台管理系統 +
// the native student-hours views) — matches course-info-262x.html's
// :root palette (ink-950/ink-600/clay-600/page-bg/line/crit-600) and font stack.
export const ink = "#2F0D01";
export const inkSoft = "#6E5850";
export const accent = "#ED4D0C";
export const paper = "#D6DEE0";
export const line = "#C3CDD0";
// No red/green/yellow anywhere in the system — "danger" and "good" states are
// expressed with the same 3 brand tones (dark ink for stop/critical, the
// accent orange for positive/active), never a separate hue.
export const danger = ink;
export const good = accent;
export const mono = "'SF Mono', ui-monospace, Menlo, Consolas, monospace";
export const bodyFont = "'Manrope', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif";

export const adminStyles = {
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(16px) saturate(160%)",
    WebkitBackdropFilter: "blur(16px) saturate(160%)",
    border: `1px solid rgba(255, 255, 255, 0.6)`,
    boxShadow: "0 8px 32px rgba(47, 13, 1, 0.08)",
    borderRadius: "16px",
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
    color: ink,
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

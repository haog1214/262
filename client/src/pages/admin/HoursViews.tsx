import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CheckSquare, AlertTriangle, Clock3, TrendingUp, TrendingDown, LayoutGrid, Search, X, Upload as UploadIcon, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { hoursApi, fmtHours, type HoursStudent, type HoursSession, type HoursRegistration, type HoursCheckin, type HoursAdjustment, type HoursPlan, type HoursStudentPlan, type ImportRow } from "@/lib/hoursApi";
import { ink, inkSoft, accent, line, danger, good, adminStyles as a } from "@/lib/adminTheme";

const h2Style: React.CSSProperties = { fontWeight: 700, fontSize: "16px", color: ink, margin: "0 0 16px" };
const emptyStyle: React.CSSProperties = { textAlign: "center", padding: "32px", color: "#9CA3AF", fontSize: "13px" };
const iconBtnStyle: React.CSSProperties = {
  backgroundColor: "transparent", border: `1px solid ${line}`, borderRadius: "8px",
  padding: "6px", cursor: "pointer", color: ink,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

function fmtDateTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function useHoursData() {
  const [students, setStudents] = useState<HoursStudent[]>([]);
  const [sessions, setSessions] = useState<HoursSession[]>([]);
  const [registrations, setRegistrations] = useState<HoursRegistration[]>([]);
  const [checkins, setCheckins] = useState<HoursCheckin[]>([]);
  const [adjustments, setAdjustments] = useState<HoursAdjustment[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    return Promise.all([
      hoursApi.listStudents(),
      hoursApi.listSessions(),
      hoursApi.listRegistrations(),
      hoursApi.listCheckins(),
      hoursApi.listAdjustments(),
    ]).then(([st, se, re, ci, ad]) => {
      setStudents(st); setSessions(se); setRegistrations(re); setCheckins(ci); setAdjustments(ad);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  return { students, sessions, registrations, checkins, adjustments, loading, reload };
}

// ── 儀表板 ──────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, iconColor, label, value, unit, badge, badgeColor }: {
  icon: React.ReactNode; iconBg: string; iconColor: string; label: string;
  value: string | number; unit: string; badge: string; badgeColor: string;
}) {
  return (
    <div style={{ ...a.card, flex: 1, minWidth: "220px", marginBottom: 0 }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
        {icon}
      </div>
      <div style={{ fontSize: "13px", color: inkSoft, marginBottom: "8px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span style={{ fontSize: "30px", fontWeight: 800, color: ink }}>{value}</span>
        <span style={{ fontSize: "13px", color: inkSoft }}>{unit}</span>
      </div>
      <div style={{ display: "inline-block", marginTop: "10px", padding: "3px 10px", borderRadius: "999px", background: badgeColor, fontSize: "11px", color: ink, fontWeight: 600 }}>
        {badge}
      </div>
    </div>
  );
}

function sessionStatus(sess: HoursSession): { label: string; color: string; bg: string } {
  const now = new Date();
  const start = new Date(`${sess.session_date}T${sess.start_time}`);
  const end = new Date(`${sess.session_date}T${sess.end_time}`);
  if (now < start) return { label: "未開始", color: inkSoft, bg: "#E4E9EA" };
  if (now > end) return { label: "已結束", color: inkSoft, bg: "#E4E9EA" };
  return { label: "進行中", color: good, bg: "#FBE0D2" };
}

export function DashboardView() {
  const { students, sessions, registrations, checkins, adjustments, loading, reload } = useHoursData();
  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterdayStr = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  const thisMonth = todayStr.slice(0, 7);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);

  const todaySessions = sessions.filter(s => s.session_date === todayStr).sort((x, y) => x.start_time.localeCompare(y.start_time));
  const successCheckins = checkins.filter(c => c.result === "success");
  const todayCheckins = successCheckins.filter(c => (c.checked_in_at || "").slice(0, 10) === todayStr);
  const yesterdayCheckins = successCheckins.filter(c => (c.checked_in_at || "").slice(0, 10) === yesterdayStr);
  const monthHours = successCheckins.filter(c => (c.checked_in_at || "").slice(0, 7) === thisMonth).reduce((n, c) => n + Number(c.hours_deducted), 0);
  const lastMonthHours = successCheckins.filter(c => (c.checked_in_at || "").slice(0, 7) === lastMonth).reduce((n, c) => n + Number(c.hours_deducted), 0);
  const monthChangePct = lastMonthHours > 0 ? Math.round(((monthHours - lastMonthHours) / lastMonthHours) * 100) : 0;

  const lowHours = students.filter(s => s.is_active && Number(s.remaining_hours) < 1.5).sort((x, y) => Number(x.remaining_hours) - Number(y.remaining_hours));
  const studentsById = new Map(students.map(s => [s.id, s]));
  const recentAdjustments = [...adjustments].sort((x, y) => (y.created_at || "").localeCompare(x.created_at || "")).slice(0, 6);

  const todayRegs = registrations.filter(r => todaySessions.some(s => s.id === r.session_id));
  const totalSeatsToday = todayRegs.reduce((n, r) => n + Number(r.seats_total), 0);
  const checkedInToday = todayRegs.reduce((n, r) => n + Number(r.seats_checked_in), 0);
  const attendanceRate = totalSeatsToday > 0 ? Math.round((checkedInToday / totalSeatsToday) * 100) : 0;
  const nearFull = todaySessions.filter(s => {
    const regs = registrations.filter(r => r.session_id === s.id);
    const filled = regs.reduce((n, r) => n + Number(r.seats_checked_in), 0);
    return s.capacity > 0 && filled / s.capacity >= 0.8;
  });
  const totalCapacityToday = todaySessions.reduce((n, s) => n + Number(s.capacity), 0);
  const remainingSeatsToday = Math.max(0, totalCapacityToday - checkedInToday);

  const activeCount = students.filter(s => s.is_active).length;
  const lowCount = lowHours.length;
  const inactiveCount = students.length - activeCount;

  const miniStat = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div style={{ background: "#E4E9EA", borderRadius: "12px", padding: "14px", flex: "1 1 45%", minWidth: "140px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: inkSoft, fontSize: "12px", marginBottom: "8px" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 800, color: ink }}>{value}</div>
    </div>
  );

  return (
    <div>
      <h2 style={h2Style}>儀表板</h2>

      <div style={{ display: "flex", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
        <StatCard
          icon={<BookOpen size={17} strokeWidth={2} />} iconBg="#FBE0D2" iconColor={accent}
          label="今日課程" value={todaySessions.length} unit="場"
          badge={todaySessions[0] ? `最近一場 ${todaySessions[0].start_time.slice(0, 5)} 開始` : "今天沒有場次"} badgeColor="#E4E9EA"
        />
        <StatCard
          icon={<CheckSquare size={17} strokeWidth={2} />} iconBg="#FBE0D2" iconColor={good}
          label="今日報到人次" value={todayCheckins.length} unit="人次"
          badge={`${todayCheckins.length >= yesterdayCheckins.length ? "↗" : "↘"} ${Math.abs(todayCheckins.length - yesterdayCheckins.length)} 較昨日同時段`} badgeColor="#FBE0D2"
        />
        <StatCard
          icon={<AlertTriangle size={17} strokeWidth={2} />} iconBg="#FBE0D2" iconColor="#ED4D0C"
          label="時數偏低學員" value={lowCount} unit="位"
          badge={lowCount > 0 ? `${lowHours.filter(s => Number(s.remaining_hours) <= 0).length} 位已用罄` : "目前都正常"} badgeColor="#FBE0D2"
        />
        <StatCard
          icon={<Clock3 size={17} strokeWidth={2} />} iconBg="#E8DDD8" iconColor={danger}
          label="本月扣除時數" value={fmtHours(monthHours)} unit="小時"
          badge={`${monthChangePct >= 0 ? "↗" : "↘"} ${Math.abs(monthChangePct)}% 較上月`} badgeColor="#E8DDD8"
        />
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "16px" }}>
        <div style={{ ...a.card, flex: "2 1 480px", marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: 0 }}>今日課程場次</h3>
            <button style={{ ...a.btnGhost, border: "none", padding: 0, color: accent }} onClick={() => reload()}>重新整理 →</button>
          </div>
          {todaySessions.length === 0 ? <div style={emptyStyle}>今天沒有排課程場次</div> : todaySessions.map(sess => {
            const st = sessionStatus(sess);
            const regs = registrations.filter(r => r.session_id === sess.id);
            const checkedIn = regs.reduce((n, r) => n + Number(r.seats_checked_in), 0);
            return (
              <div key={sess.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: `1px solid ${line}` }}>
                <div style={{ width: "56px", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: ink }}>{sess.start_time.slice(0, 5)}</div>
                  <div style={{ fontSize: "11px", color: inkSoft }}>{sess.hours_per_checkin ? Math.round(Number(sess.hours_per_checkin) * 60) : ""} 分鐘</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: ink }}>{sess.name}</div>
                  <div style={{ fontSize: "12px", color: inkSoft }}>{sess.teacher}・{sess.room}</div>
                </div>
                <div style={{ fontSize: "13px", color: ink, flexShrink: 0 }}>{checkedIn} / {sess.capacity} 已報到</div>
                <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, color: st.color, background: st.bg, flexShrink: 0 }}>{st.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ ...a.card, flex: "1 1 320px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>課程數據</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {miniStat(<BookOpen size={13} strokeWidth={2} />, "今日場次", `${todaySessions.length} 場`)}
            {miniStat(<CheckSquare size={13} strokeWidth={2} />, "平均出席率", `${attendanceRate}%`)}
            {miniStat(<AlertTriangle size={13} strokeWidth={2} />, "近滿場場次", `${nearFull.length} 場`)}
            {miniStat(<LayoutGrid size={13} strokeWidth={2} />, "剩餘名額", `${remainingSeatsToday} / ${totalCapacityToday} 位`)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ ...a.card, flex: "1 1 300px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>時數偏低 / 已用罄</h3>
          {lowHours.length === 0 ? <div style={emptyStyle}>目前沒有時數偏低的學員</div> : lowHours.slice(0, 6).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${line}`, fontSize: "13px" }}>
              <span style={{ color: ink }}>{s.name}</span>
              <span style={{ color: Number(s.remaining_hours) <= 0 ? danger : "#ED4D0C", fontWeight: 700 }}>{fmtHours(s.remaining_hours)} hr</span>
            </div>
          ))}
        </div>

        <div style={{ ...a.card, flex: "1 1 300px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>最近時數異動</h3>
          {recentAdjustments.length === 0 ? <div style={emptyStyle}>尚無異動紀錄</div> : recentAdjustments.map(x => (
            <div key={x.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", borderBottom: `1px solid ${line}`, fontSize: "13px" }}>
              {Number(x.amount) >= 0
                ? <TrendingUp size={14} strokeWidth={2} color={good} />
                : <TrendingDown size={14} strokeWidth={2} color={danger} />}
              <span style={{ color: ink, flex: 1 }}>{studentsById.get(x.student_id)?.name ?? "—"} {x.reason}</span>
              <span style={{ color: Number(x.amount) >= 0 ? good : danger, fontWeight: 700 }}>{Number(x.amount) >= 0 ? "+" : ""}{x.amount} hr</span>
            </div>
          ))}
        </div>

        <div style={{ ...a.card, flex: "1 1 220px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>學生狀態</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#FBE0D2", color: good, fontSize: "12px", fontWeight: 700 }}>正常</span>
            <span style={{ fontWeight: 700, color: ink }}>{activeCount - lowCount} 位</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#FBE0D2", color: "#ED4D0C", fontSize: "12px", fontWeight: 700 }}>時數偏低</span>
            <span style={{ fontWeight: 700, color: ink }}>{lowCount} 位</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#E4E9EA", color: inkSoft, fontSize: "12px", fontWeight: 700 }}>已停用</span>
            <span style={{ fontWeight: 700, color: ink }}>{inactiveCount} 位</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 課程場次 ────────────────────────────────────────────────────────────────
function SessionForm({ initial, onSave, onCancel }: { initial: HoursSession | null; onSave: (data: Omit<HoursSession, "id" | "created_at">) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.session_date ?? new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState(initial?.start_time?.slice(0, 5) ?? "13:30");
  const [end, setEnd] = useState(initial?.end_time?.slice(0, 5) ?? "16:30");
  const [teacher, setTeacher] = useState(initial?.teacher ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [hoursPer, setHoursPer] = useState(String(initial?.hours_per_checkin ?? 1));
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? 20));

  return (
    <div style={{ ...a.card, border: `2px dashed ${line}` }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>{initial ? "編輯課程場次" : "新增課程場次"}</h3>
      <label style={a.label}>課程名稱</label>
      <input style={a.input} value={name} onChange={e => setName(e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
        <div><label style={a.label}>日期</label><input type="date" style={a.input} value={date} onChange={e => setDate(e.target.value)} /></div>
        <div><label style={a.label}>開始時間</label><input type="time" style={a.input} value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label style={a.label}>結束時間</label><input type="time" style={a.input} value={end} onChange={e => setEnd(e.target.value)} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <div><label style={a.label}>老師</label><input style={a.input} value={teacher} onChange={e => setTeacher(e.target.value)} /></div>
        <div><label style={a.label}>教室</label><input style={a.input} value={room} onChange={e => setRoom(e.target.value)} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <div><label style={a.label}>每次報到扣除時數</label><input type="number" step="0.5" style={a.input} value={hoursPer} onChange={e => setHoursPer(e.target.value)} /></div>
        <div><label style={a.label}>名額上限</label><input type="number" style={a.input} value={capacity} onChange={e => setCapacity(e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={a.btnPrimary}
          onClick={() => onSave({
            name, session_date: date, start_time: start, end_time: end,
            teacher, room, hours_per_checkin: Number(hoursPer), capacity: Number(capacity),
            is_open: initial?.is_open ?? true,
          })}
        >
          儲存
        </button>
        <button style={a.btnGhost} onClick={onCancel}>取消</button>
      </div>
    </div>
  );
}

export function SessionsView() {
  const { sessions, registrations, students, loading, reload } = useHoursData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HoursSession | null>(null);
  const [rosterSessionId, setRosterSessionId] = useState<string | null>(null);
  const [ciSessionId, setCiSessionId] = useState<string | null>(null);
  const [ciPhone, setCiPhone] = useState("");
  const [ciResult, setCiResult] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const todayStr = new Date().toISOString().slice(0, 10);
  const sorted = [...sessions].sort((x, y) => (x.session_date + x.start_time).localeCompare(y.session_date + y.start_time));

  const runSync = async () => {
    if (!confirm("這會清空目前所有課程場次（含模擬資料）與相關報到紀錄，改成用「課程管理」裡真實課程的上課日期自動產生場次，確定要繼續嗎？")) return;
    setSyncing(true);
    try {
      const result = await hoursApi.syncSessionsFromCourses();
      setSyncMsg(`已同步 ${result.count} 場真實課程場次`);
      reload();
    } catch (e) {
      setSyncMsg("同步失敗：" + String(e));
    }
    setSyncing(false);
  };

  const saveSession = async (data: Omit<HoursSession, "id" | "created_at">) => {
    if (editing) await hoursApi.updateSession(editing.id, data);
    else await hoursApi.createSession(data);
    setShowForm(false); setEditing(null);
    reload();
  };

  const runCheckin = async () => {
    if (!ciSessionId || !ciPhone.trim()) return;
    const session = sessions.find(s => s.id === ciSessionId);
    const need = session ? Number(session.hours_per_checkin) : 1;
    try {
      const result = await hoursApi.checkinAttempt(ciPhone.trim(), ciSessionId, need);
      if (result.state === "success") setCiResult(`✅ ${result.student.name} 報到成功，扣 ${fmtHours(need)} hr，剩餘 ${fmtHours(result.student.remaining_hours)} hr`);
      else if (result.state === "notfound") setCiResult("❌ 查無此電話的學員");
      else if (result.state === "notregistered") setCiResult(`⚠️ ${result.student.name} 尚未報名此場次`);
      else if (result.state === "duplicate") setCiResult(`⚠️ ${result.student.name} 已經報到過了`);
      else if (result.state === "insufficient") setCiResult(`⚠️ ${result.student.name} 剩餘時數不足`);
      reload();
    } catch (e) {
      setCiResult("❌ 報到失敗：" + String(e));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h2 style={{ ...h2Style, margin: 0 }}>課程場次（共 {sessions.length} 場）</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={a.btnGhost} disabled={syncing} onClick={runSync}>
            {syncing ? "同步中..." : "↻ 從課程管理同步真實課程"}
          </button>
          <button style={a.btnPrimary} onClick={() => { setEditing(null); setShowForm(true); }}>＋ 新增場次</button>
        </div>
      </div>
      {syncMsg && <div style={{ fontSize: "12px", color: inkSoft, marginBottom: "16px" }}>{syncMsg}</div>}

      {showForm && <SessionForm initial={editing} onSave={saveSession} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      <div style={a.card}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>快速報到</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <select style={{ ...a.input, marginBottom: 0, width: "auto", minWidth: "220px" }} value={ciSessionId ?? ""} onChange={e => setCiSessionId(e.target.value || null)}>
            <option value="">選擇場次...</option>
            {sorted.map(s => <option key={s.id} value={s.id}>{s.name}（{s.session_date} {s.start_time.slice(0, 5)}）</option>)}
          </select>
          <input style={{ ...a.input, marginBottom: 0, width: "160px" }} placeholder="學員電話" value={ciPhone} onChange={e => setCiPhone(e.target.value)} />
          <button style={a.btnPrimary} onClick={runCheckin}>報到</button>
        </div>
        {ciResult && <div style={{ marginTop: "10px", fontSize: "13px", color: ink }}>{ciResult}</div>}
      </div>

      {sorted.length === 0 ? <div style={{ ...a.card, ...emptyStyle }}>目前沒有課程場次</div> : sorted.map(sess => {
        const regs = registrations.filter(r => r.session_id === sess.id);
        const checkedIn = regs.reduce((n, r) => n + Number(r.seats_checked_in), 0);
        const isPast = sess.session_date < todayStr;
        return (
          <div key={sess.id} style={{ ...a.card, opacity: isPast ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: ink }}>{sess.name}</div>
                <div style={{ fontSize: "12px", color: inkSoft, marginTop: "3px" }}>
                  {sess.session_date}　{sess.start_time.slice(0, 5)}–{sess.end_time.slice(0, 5)}　{sess.teacher}・{sess.room}
                </div>
                <div style={{ fontSize: "12px", color: inkSoft, marginTop: "3px" }}>
                  扣 {fmtHours(sess.hours_per_checkin)} hr／人　已報到 {checkedIn} / {sess.capacity}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  style={{ ...a.btnGhost, color: sess.is_open ? good : danger, borderColor: sess.is_open ? good : danger }}
                  onClick={() => hoursApi.updateSession(sess.id, { is_open: !sess.is_open }).then(reload)}
                >
                  {sess.is_open ? "開放中" : "已關閉"}
                </button>
                <button style={a.btnGhost} onClick={() => setRosterSessionId(rosterSessionId === sess.id ? null : sess.id)}>名單</button>
                <button style={a.btnGhost} onClick={() => { setEditing(sess); setShowForm(true); }}>編輯</button>
              </div>
            </div>
            {rosterSessionId === sess.id && (
              <div style={{ marginTop: "14px", borderTop: `1px solid ${line}`, paddingTop: "12px" }}>
                {regs.length === 0 ? <div style={{ fontSize: "13px", color: inkSoft }}>目前尚無人報名</div> : (
                  <table style={a.table}>
                    <thead><tr><th style={a.th}>姓名</th><th style={a.th}>電話</th><th style={a.th}>報到狀態</th></tr></thead>
                    <tbody>
                      {regs.map(r => {
                        const student = students.find(s => s.id === r.student_id);
                        return (
                          <tr key={r.id}>
                            <td style={a.td}>{student?.name ?? "—"}</td>
                            <td style={a.td}>{student?.phone ?? "—"}</td>
                            <td style={a.td}>{r.seats_checked_in} / {r.seats_total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 匯入名單 ────────────────────────────────────────────────────────────────
function StepDots({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "連結 Google Sheets" },
    { n: 2, label: "預覽確認" },
    { n: 3, label: "匯入結果" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700,
              background: step >= s.n ? ink : "#E4E9EA",
              color: step >= s.n ? "#fff" : inkSoft,
            }}>
              {s.n}
            </div>
            <span style={{ fontSize: "13px", fontWeight: step === s.n ? 700 : 500, color: step === s.n ? ink : inkSoft, whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: line, margin: "0 12px" }} />}
        </div>
      ))}
    </div>
  );
}

export function ImportRosterView() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [url, setUrl] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);

  const runPreview = async () => {
    if (!url.trim()) return;
    setBusy(true); setError(null);
    try {
      const { rows: r } = await hoursApi.importPreview(url.trim());
      setRows(r);
      setStep(2);
    } catch (e) {
      setError(String(e));
    }
    setBusy(false);
  };

  const runCommit = async () => {
    setBusy(true);
    try {
      const r = await hoursApi.importCommit(rows);
      setResult(r);
      setStep(3);
    } catch (e) {
      setError(String(e));
    }
    setBusy(false);
  };

  const validRows = rows.filter(r => !r.error);
  const errorRows = rows.filter(r => r.error);

  return (
    <div>
      <h2 style={h2Style}>匯入名單</h2>
      <StepDots step={step} />

      {step === 1 && (
        <div style={a.card}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 8px" }}>從 Google Sheets 匯入課程報名名單</h3>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "16px" }}>
            必要欄位：公司名稱、統一編號、購買時數。統一編號是判斷客戶是否重複的依據——統一編號不存在時新增客戶，統一編號已存在時累加購買時數。
          </p>
          <div style={{ background: "#E4E9EA", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", color: ink }}>學員名單匯入範本</div>
            <div style={{ fontSize: "12px", color: inkSoft, marginTop: "4px" }}>
              公司名稱・統一編號・購買時數・備註（選填）・Email（選填）・課程名稱（選填）・到期日（選填）
            </div>
          </div>
          <label style={a.label}>Google Sheets 共用連結</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={{ ...a.input, marginBottom: 0 }}
              placeholder="貼上 Google Sheets 共用連結，例如 https://docs.google.com/spreadsheets/d/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button style={a.btnPrimary} disabled={busy} onClick={runPreview}>{busy ? "讀取中..." : "匯入資料"}</button>
          </div>
          <p style={{ fontSize: "12px", color: inkSoft, marginTop: "10px" }}>
            請先在 Google Sheets 右上角「共用」設為「知道連結的使用者」可檢視，並依範本欄位順序整理資料，再貼上連結。
          </p>
          {error && <div style={{ marginTop: "12px", fontSize: "13px", color: danger }}>{error}</div>}
        </div>
      )}

      {step === 2 && (
        <div style={a.card}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 8px" }}>預覽確認</h3>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "16px" }}>
            共 {rows.length} 筆，其中 {validRows.length} 筆可匯入{errorRows.length > 0 ? `，${errorRows.length} 筆有錯誤將略過` : ""}。
          </p>
          <div style={{ maxHeight: "360px", overflow: "auto" }}>
            <table style={a.table}>
              <thead><tr><th style={a.th}>公司名稱</th><th style={a.th}>統一編號</th><th style={a.th}>購買時數</th><th style={a.th}>狀態</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={a.td}>{r.name || "—"}</td>
                    <td style={a.td}>{r.taxId || "—"}</td>
                    <td style={a.td}>{r.purchasedHours || "—"}</td>
                    <td style={{ ...a.td, color: r.error ? danger : good }}>{r.error || "OK"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button style={a.btnPrimary} disabled={busy || validRows.length === 0} onClick={runCommit}>{busy ? "匯入中..." : `確認匯入 ${validRows.length} 筆`}</button>
            <button style={a.btnGhost} onClick={() => setStep(1)}>返回</button>
          </div>
          {error && <div style={{ marginTop: "12px", fontSize: "13px", color: danger }}>{error}</div>}
        </div>
      )}

      {step === 3 && result && (
        <div style={a.card}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 8px" }}>匯入結果</h3>
          <p style={{ fontSize: "13px", color: ink, marginBottom: "16px" }}>
            新增 <b>{result.created}</b> 位新客戶，累加 <b>{result.updated}</b> 位既有客戶的時數。
          </p>
          <button style={a.btnPrimary} onClick={() => { setStep(1); setUrl(""); setRows([]); setResult(null); }}>再匯入一次</button>
        </div>
      )}
    </div>
  );
}

// ── 報到紀錄 ────────────────────────────────────────────────────────────────
export function CheckinsView() {
  const { students, checkins, loading, reload } = useHoursData();
  const [q, setQ] = useState("");
  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const studentsById = new Map(students.map(s => [s.id, s]));
  const sorted = [...checkins].sort((x, y) => (y.checked_in_at || "").localeCompare(x.checked_in_at || ""));
  const filtered = q.trim()
    ? sorted.filter(c => (studentsById.get(c.student_id)?.name || "").includes(q) || (c.session_name || "").includes(q))
    : sorted;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ ...h2Style, margin: 0 }}>報到紀錄（共 {checkins.length} 筆）</h2>
        <button style={a.btnGhost} onClick={() => reload()}>重新整理</button>
      </div>
      <div style={a.card}>
        <input style={{ ...a.input, maxWidth: "280px" }} placeholder="搜尋學員姓名或課程名稱..." value={q} onChange={e => setQ(e.target.value)} />
        {filtered.length === 0 ? <div style={emptyStyle}>沒有符合的報到紀錄</div> : (
          <table style={a.table}>
            <thead><tr><th style={a.th}>學員</th><th style={a.th}>課程</th><th style={a.th}>狀態</th><th style={a.th}>扣除時數</th><th style={a.th}>時間</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={a.td}>{studentsById.get(c.student_id)?.name ?? "—"}</td>
                  <td style={a.td}>{c.session_name || "—"}</td>
                  <td style={{ ...a.td, color: c.result === "success" ? good : danger }}>{c.result === "success" ? "成功" : c.result}</td>
                  <td style={a.td}>-{fmtHours(c.hours_deducted)} hr</td>
                  <td style={{ ...a.td, color: inkSoft, fontSize: "12px" }}>{fmtDateTime(c.checked_in_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── 專案名稱 ────────────────────────────────────────────────────────────────
export function PlansView() {
  const [plans, setPlans] = useState<HoursPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editHours, setEditHours] = useState("");

  const reload = () => {
    setLoading(true);
    hoursApi.listPlans().then(list => { setPlans(list); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const addPlan = async () => {
    if (!name.trim() || !hours) return;
    await hoursApi.createPlan({ name: name.trim(), hours: Number(hours) });
    setName(""); setHours("");
    reload();
  };
  const startEdit = (p: HoursPlan) => { setEditingId(p.id); setEditName(p.name); setEditHours(String(p.hours)); };
  const saveEdit = async () => {
    if (!editingId || !editName.trim() || !editHours) return;
    await hoursApi.updatePlan(editingId, { name: editName.trim(), hours: Number(editHours) });
    setEditingId(null);
    reload();
  };
  const removePlan = async (id: string) => {
    if (!confirm("確定要刪除此專案嗎？已使用此專案建立的學員不受影響。")) return;
    await hoursApi.deletePlan(id);
    reload();
  };

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  return (
    <div>
      <h2 style={h2Style}>專案名稱（共 {plans.length} 個）</h2>
      <div style={a.card}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 6px" }}>新增專案</h3>
        <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "14px" }}>
          每個專案定義一組固定時數，供「新增學員」時挑選作為初始時數。
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={a.label}>專案名稱</label>
            <input style={{ ...a.input, marginBottom: 0 }} value={name} onChange={e => setName(e.target.value)} placeholder="例：新生方案" />
          </div>
          <div style={{ width: "140px" }}>
            <label style={a.label}>時數（hr）</label>
            <input type="number" style={{ ...a.input, marginBottom: 0 }} value={hours} onChange={e => setHours(e.target.value)} placeholder="例：15" />
          </div>
          <button style={a.btnPrimary} onClick={addPlan} disabled={!name.trim() || !hours}>新增</button>
        </div>
      </div>

      <div style={a.card}>
        <table style={a.table}>
          <thead><tr><th style={a.th}>專案名稱</th><th style={a.th}>時數</th><th style={a.th}></th></tr></thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                {editingId === p.id ? (
                  <>
                    <td style={a.td}><input style={{ ...a.input, marginBottom: 0 }} value={editName} onChange={e => setEditName(e.target.value)} /></td>
                    <td style={a.td}><input type="number" style={{ ...a.input, marginBottom: 0, width: "100px" }} value={editHours} onChange={e => setEditHours(e.target.value)} /></td>
                    <td style={{ ...a.td, textAlign: "right" as const }}>
                      <button style={{ ...a.btnPrimary, marginRight: "8px" }} onClick={saveEdit}>儲存</button>
                      <button style={a.btnGhost} onClick={() => setEditingId(null)}>取消</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={a.td}>{p.name}</td>
                    <td style={a.td}>{fmtHours(p.hours)} hr</td>
                    <td style={{ ...a.td, textAlign: "right" as const }}>
                      <button style={{ ...a.btnGhost, marginRight: "8px" }} onClick={() => startEdit(p)}>編輯</button>
                      <button style={{ ...a.btnGhost, color: danger, borderColor: danger }} onClick={() => removePlan(p.id)}>刪除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {plans.length === 0 && <div style={emptyStyle}>尚未建立任何專案</div>}
      </div>
    </div>
  );
}

// ── 學生管理 ────────────────────────────────────────────────────────────────
export function StudentsView() {
  const { students, checkins, adjustments, loading, reload } = useHoursData();
  const [q, setQ] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const filtered = q.trim()
    ? students.filter(s => s.name.includes(q) || s.phone.includes(q))
    : students;
  const sorted = [...filtered].sort((x, y) => x.name.localeCompare(y.name));
  const detail = students.find(s => s.id === detailId) ?? null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ ...h2Style, margin: 0 }}>學員管理（共 {students.length} 位）</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={a.btnGhost} onClick={() => setShowImport(true)}>匯入學員</button>
          <button style={a.btnPrimary} onClick={() => setShowAdd(true)}>+ 新增學員</button>
        </div>
      </div>
      <div style={a.card}>
        <input style={{ ...a.input, maxWidth: "280px" }} placeholder="搜尋名稱或統編..." value={q} onChange={e => setQ(e.target.value)} />
        <table style={a.table}>
          <thead><tr><th style={a.th}>名稱</th><th style={a.th}>統編</th><th style={a.th}>剩餘時數</th><th style={a.th}>狀態</th><th style={a.th}></th></tr></thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.id}>
                <td style={a.td}>{s.name}</td>
                <td style={a.td}>{s.phone}</td>
                <td style={a.td}>{fmtHours(s.remaining_hours)} hr</td>
                <td style={a.td}>
                  <span style={{ color: s.is_active ? good : inkSoft, fontWeight: 600, fontSize: "12px" }}>
                    {s.is_active ? "啟用中" : "已停用"}
                  </span>
                </td>
                <td style={{ ...a.td, textAlign: "right" as const }}>
                  <button
                    style={iconBtnStyle}
                    title="查看詳細資訊"
                    onClick={() => setDetailId(s.id)}
                  >
                    <Search size={14} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && <div style={emptyStyle}>沒有符合的學員</div>}
      </div>

      {detail && (
        <StudentDetailModal
          student={detail}
          checkins={checkins.filter(c => c.student_id === detail.id).slice(0, 6)}
          adjustments={adjustments.filter(x => x.student_id === detail.id).slice(0, 6)}
          onClose={() => setDetailId(null)}
          onChanged={reload}
        />
      )}

      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onCreated={() => { setShowAdd(false); reload(); }}
        />
      )}

      {showImport && (
        <ImportStudentsModal
          onClose={() => setShowImport(false)}
          onImported={() => { setShowImport(false); reload(); }}
        />
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [taxId, setTaxId] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookupErr, setLookupErr] = useState("");
  const [name, setName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [found, setFound] = useState(false);
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);
  const [plans, setPlans] = useState<HoursPlan[]>([]);
  const [planId, setPlanId] = useState("");
  const [students, setStudents] = useState<HoursStudent[]>([]);
  const [studentPlans, setStudentPlans] = useState<HoursStudentPlan[]>([]);

  useEffect(() => {
    hoursApi.listPlans().then(setPlans).catch(() => setPlans([]));
    hoursApi.listStudents().then(setStudents).catch(() => setStudents([]));
    hoursApi.listStudentPlans().then(setStudentPlans).catch(() => setStudentPlans([]));
  }, []);
  const selectedPlan = plans.find(p => p.id === planId) ?? null;

  const validTaxId = /^\d{8}$/.test(taxId.trim());
  const matchedStudent = validTaxId ? students.find(s => s.phone === taxId.trim()) ?? null : null;
  const enrollStatus: "new" | "existing" | "duplicate" | null = !validTaxId
    ? null
    : !matchedStudent
      ? "new"
      : (planId && studentPlans.some(sp => sp.student_id === matchedStudent.id && sp.plan_id === planId))
        ? "duplicate"
        : "existing";
  const statusMeta = {
    new: { label: "新增會員", color: good, bg: "#FBE0D2" },
    existing: { label: "原有會員", color: accent, bg: "#FFF3EC" },
    duplicate: { label: "重複會員", color: danger, bg: "#E8DDD8" },
  } as const;

  const runLookup = async () => {
    const id = taxId.trim();
    if (!/^\d{8}$/.test(id)) {
      setLookupErr("統一編號需為 8 碼數字");
      return;
    }
    setLooking(true);
    setLookupErr("");
    try {
      const r = await hoursApi.lookupCompany(id);
      setName(r.name);
      setRepresentative(r.representative);
      setAddress(r.address);
      setFound(true);
      setSource(r.source);
    } catch (err) {
      setFound(false);
      setSource("");
      setName(""); setRepresentative(""); setAddress("");
      setLookupErr(err instanceof Error ? err.message : "查詢失敗，可手動輸入公司資料");
    } finally {
      setLooking(false);
    }
  };

  const submit = async () => {
    if (!taxId.trim() || !name.trim() || !selectedPlan || enrollStatus === "duplicate") return;
    setSaving(true);
    try {
      await hoursApi.enrollStudents(planId, [{
        taxId: taxId.trim(),
        name: name.trim(),
        note: [
          representative && `負責人：${representative}`,
          contactPerson && `聯絡人：${contactPerson}`,
          contactPhone && `聯絡電話：${contactPhone}`,
          address && `登記地址：${address}`,
        ].filter(Boolean).join("｜"),
      }]);
      onCreated();
    } catch (err) {
      setLookupErr(err instanceof Error ? err.message : "新增失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#fff", borderRadius: "18px", width: "100%", maxWidth: "440px",
        maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 56px rgba(0,0,0,0.24)", padding: "27px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontWeight: 800, fontSize: "18px", color: ink }}>新增學員</div>
          <button style={{ ...iconBtnStyle, width: "33px", height: "33px", borderRadius: "50%" }} onClick={onClose} title="關閉">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <label style={a.label}>統一編號</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
          <input
            style={{ ...a.input, marginBottom: 0, flex: 1 }}
            placeholder="請輸入 8 碼統編"
            value={taxId}
            onChange={e => { setTaxId(e.target.value); setFound(false); }}
            maxLength={8}
          />
          <button style={{ ...a.btnGhost, flexShrink: 0 }} onClick={runLookup} disabled={looking}>
            {looking ? "查詢中..." : "查詢"}
          </button>
          {enrollStatus && (
            <span style={{
              flexShrink: 0, alignSelf: "center", fontSize: "12px", fontWeight: 800,
              color: statusMeta[enrollStatus].color, background: statusMeta[enrollStatus].bg,
              padding: "5px 10px", borderRadius: "999px", whiteSpace: "nowrap",
            }}>
              {statusMeta[enrollStatus].label}
            </span>
          )}
        </div>
        {enrollStatus === "duplicate" && (
          <div style={{ fontSize: "12px", color: danger, marginBottom: "10px" }}>
            此統編已加入所選專案，無法重複新增
          </div>
        )}
        {enrollStatus === "existing" && (
          <div style={{ fontSize: "12px", color: accent, marginBottom: "10px" }}>
            此統編已是既有學員，送出後會把此專案加到該學員底下並加總時數
          </div>
        )}
        {lookupErr && <div style={{ fontSize: "12px", color: danger, marginBottom: "10px" }}>{lookupErr}</div>}
        {found && (
          <div style={{ fontSize: "12px", color: good, marginBottom: "10px" }}>
            已從{source || "政府開放資料"}帶入，可手動修改
            {source === "財政部稅籍登記" && "（此來源不含負責人姓名，請視需要手動補上）"}
          </div>
        )}

        <label style={a.label}>公司名稱</label>
        <input style={a.input} value={name} onChange={e => setName(e.target.value)} placeholder="查詢後自動帶入，或手動輸入" />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={a.label}>負責人姓名</label>
            <input style={a.input} value={representative} onChange={e => setRepresentative(e.target.value)} placeholder="（選填）" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={a.label}>聯絡人</label>
            <input style={a.input} value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="（選填）" />
          </div>
        </div>

        <label style={a.label}>聯絡電話</label>
        <input style={a.input} value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="（選填）" />

        <label style={a.label}>登記地址</label>
        <input style={a.input} value={address} onChange={e => setAddress(e.target.value)} placeholder="（選填）" />

        <label style={a.label}>專案名稱</label>
        <select style={a.input} value={planId} onChange={e => setPlanId(e.target.value)}>
          <option value="">請選擇專案</option>
          {plans.map(p => (
            <option key={p.id} value={p.id}>{p.name}（{fmtHours(p.hours)} hr）</option>
          ))}
        </select>
        {plans.length === 0 && (
          <div style={{ fontSize: "12px", color: danger, marginTop: "-10px", marginBottom: "14px" }}>
            尚未建立任何專案，請先到左側「專案名稱」新增
          </div>
        )}
        {selectedPlan && (
          <div style={{ fontSize: "13px", color: inkSoft, marginBottom: "16px" }}>
            初始時數將設定為 <b style={{ color: accent }}>{fmtHours(selectedPlan.hours)} hr</b>（剩餘時數與累計購買皆為此數值），新增後可在學員詳情調整。
          </div>
        )}

        <button
          style={{ ...a.btnPrimary, width: "100%", padding: "12px", fontSize: "15px" }}
          onClick={submit}
          disabled={saving || !taxId.trim() || !name.trim() || !selectedPlan || enrollStatus === "duplicate"}
        >
          {saving ? "新增中..." : "確認新增學員"}
        </button>
      </div>
    </div>
  );
}

type ParsedImportRow = {
  taxId: string; name: string; representative: string; contactPerson: string;
  contactPhone: string; address: string; planName: string;
};
type EnrollStatus = "new" | "existing" | "duplicate";
const ENROLL_STATUS_META: Record<EnrollStatus, { label: string; color: string; bg: string }> = {
  new: { label: "新增會員", color: good, bg: "#FBE0D2" },
  existing: { label: "原有會員", color: accent, bg: "#FFF3EC" },
  duplicate: { label: "重複會員", color: danger, bg: "#E8DDD8" },
};

function ImportStudentsModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [plans, setPlans] = useState<HoursPlan[]>([]);
  const [students, setStudents] = useState<HoursStudent[]>([]);
  const [studentPlans, setStudentPlans] = useState<HoursStudentPlan[]>([]);
  const [rows, setRows] = useState<ParsedImportRow[]>([]);
  const [removedIdx, setRemovedIdx] = useState<Set<number>>(new Set());
  const [planId, setPlanId] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ created: number; updated: number; skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hoursApi.listPlans().then(setPlans).catch(() => setPlans([]));
    hoursApi.listStudents().then(setStudents).catch(() => setStudents([]));
    hoursApi.listStudentPlans().then(setStudentPlans).catch(() => setStudentPlans([]));
  }, []);

  // The file's own 專案名稱 column is only used once, to pre-fill this single
  // selector for the whole batch (may race the plans fetch above, so retry
  // once plans arrive too).
  useEffect(() => {
    if (planId || !rows.length || !plans.length) return;
    const firstName = rows[0].planName.trim();
    if (!firstName) return;
    const matched = plans.find(p => p.name === firstName);
    if (matched) setPlanId(matched.id);
  }, [rows, plans, planId]);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["統一編號", "公司名稱", "負責人姓名", "聯絡人", "聯絡電話", "登記地址", "專案名稱"],
      ["12345678", "範例股份有限公司", "王小明", "李小華", "0912345678", "台中市西屯區某路1號", "新生方案"],
    ]);
    ws["!cols"] = [{ wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 28 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "學員名單");
    XLSX.writeFile(wb, "學員匯入範本.xlsx");
  };

  const onFile = (file: File) => {
    setError("");
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
        const parsed: ParsedImportRow[] = json
          .map(r => ({
            taxId: String(r["統一編號"] ?? "").trim(),
            name: String(r["公司名稱"] ?? "").trim(),
            representative: String(r["負責人姓名"] ?? "").trim(),
            contactPerson: String(r["聯絡人"] ?? "").trim(),
            contactPhone: String(r["聯絡電話"] ?? "").trim(),
            address: String(r["登記地址"] ?? "").trim(),
            planName: String(r["專案名稱"] ?? "").trim(),
          }))
          .filter(r => r.taxId);
        if (!parsed.length) {
          setError("找不到可用資料，請確認欄位名稱與範本一致（第一列需為欄位標題）");
          return;
        }
        setRows(parsed);
        setRemovedIdx(new Set());
        setPlanId("");
        setStep(2);
      } catch {
        setError("檔案解析失敗，請確認是否為 Excel（.xlsx）或 CSV 檔");
      }
    };
    reader.readAsBinaryString(file);
  };

  const taxIdCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach(r => { counts[r.taxId] = (counts[r.taxId] || 0) + 1; });
    return counts;
  }, [rows]);

  const computedRows = useMemo(() => rows.map((r, idx) => {
    const matchedStudent = students.find(s => s.phone === r.taxId) ?? null;
    const status: EnrollStatus = !matchedStudent
      ? "new"
      : (planId && studentPlans.some(sp => sp.student_id === matchedStudent.id && sp.plan_id === planId))
        ? "duplicate"
        : "existing";
    return { ...r, idx, status, inFileDup: taxIdCounts[r.taxId] > 1, removed: removedIdx.has(idx) };
  }), [rows, students, studentPlans, planId, taxIdCounts, removedIdx]);

  const visibleRows = computedRows.filter(r => !r.removed);
  const importableRows = visibleRows.filter(r => r.status !== "duplicate");
  const inFileDupCount = rows.length ? new Set(Object.keys(taxIdCounts).filter(k => taxIdCounts[k] > 1)).size : 0;

  const removeRow = (idx: number) => setRemovedIdx(prev => new Set(prev).add(idx));

  const commit = async () => {
    if (!planId) { setError("請選擇專案名稱"); return; }
    if (!importableRows.length) { setError("沒有可匯入的資料"); return; }
    setBusy(true);
    setError("");
    try {
      const payload = importableRows.map(r => ({
        taxId: r.taxId,
        name: r.name || r.taxId,
        note: [
          r.representative && `負責人：${r.representative}`,
          r.contactPerson && `聯絡人：${r.contactPerson}`,
          r.contactPhone && `聯絡電話：${r.contactPhone}`,
          r.address && `登記地址：${r.address}`,
        ].filter(Boolean).join("｜"),
      }));
      const res = await hoursApi.enrollStudents(planId, payload);
      setResult(res);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "匯入失敗，請稍後再試");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#fff", borderRadius: "18px", width: "100%", maxWidth: step === 1 ? "440px" : "760px",
        maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 56px rgba(0,0,0,0.24)", padding: "27px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontWeight: 800, fontSize: "18px", color: ink }}>匯入學員</div>
          <button style={{ ...iconBtnStyle, width: "33px", height: "33px", borderRadius: "50%" }} onClick={onClose} title="關閉">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {step === 1 && (
          <>
            <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "18px" }}>
              先下載範本填好資料，再上傳同一個檔案。欄位：統一編號（必填）、公司名稱、負責人姓名、聯絡人、聯絡電話、登記地址、專案名稱。
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...a.btnGhost, flex: 1, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={downloadTemplate}
              >
                <Download size={14} strokeWidth={1.5} />
                下載模板
              </button>
              <button
                style={{ ...a.btnPrimary, flex: 1, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon size={14} strokeWidth={1.5} />
                上傳資料
              </button>
              <input
                ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
              />
            </div>
            {error && <div style={{ fontSize: "12px", color: danger, marginTop: "12px" }}>{error}</div>}
          </>
        )}

        {step === 2 && (
          <>
            <label style={a.label}>專案名稱（套用到整批匯入）</label>
            <select style={{ ...a.input, marginBottom: "10px" }} value={planId} onChange={e => setPlanId(e.target.value)}>
              <option value="">請選擇專案</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name}（{fmtHours(p.hours)} hr）</option>
              ))}
            </select>

            {inFileDupCount > 0 && (
              <div style={{ fontSize: "12px", color: danger, marginBottom: "10px" }}>
                檔案內有 {inFileDupCount} 組統一編號重複出現，請確認資料是否正確（重複列已標示）
              </div>
            )}
            <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "12px" }}>
              共 {visibleRows.length} 筆（{visibleRows.filter(r => r.status === "new").length} 筆新增會員・
              {visibleRows.filter(r => r.status === "existing").length} 筆原有會員・
              {visibleRows.filter(r => r.status === "duplicate").length} 筆重複會員，重複會員不會被匯入）。
            </p>

            <div style={{ maxHeight: "360px", overflow: "auto" }}>
              <table style={a.table}>
                <thead>
                  <tr>
                    <th style={a.th}>統一編號</th><th style={a.th}>公司名稱</th>
                    <th style={a.th}>狀態</th><th style={a.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(r => (
                    <tr key={r.idx}>
                      <td style={a.td}>
                        {r.taxId}
                        {r.inFileDup && <span style={{ marginLeft: "6px", fontSize: "11px", color: danger, fontWeight: 700 }}>檔案內重複</span>}
                      </td>
                      <td style={a.td}>{r.name || "—"}</td>
                      <td style={a.td}>
                        <span style={{
                          fontSize: "12px", fontWeight: 800, color: ENROLL_STATUS_META[r.status].color,
                          background: ENROLL_STATUS_META[r.status].bg, padding: "4px 10px", borderRadius: "999px",
                        }}>
                          {ENROLL_STATUS_META[r.status].label}
                        </span>
                      </td>
                      <td style={{ ...a.td, textAlign: "right" as const }}>
                        <button style={iconBtnStyle} title="從清單移除" onClick={() => removeRow(r.idx)}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleRows.length === 0 && <div style={emptyStyle}>沒有可匯入的資料</div>}
            </div>

            {error && <div style={{ fontSize: "12px", color: danger, marginTop: "12px" }}>{error}</div>}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button style={a.btnGhost} onClick={() => setStep(1)}>返回</button>
              <button style={a.btnPrimary} disabled={busy || !planId || importableRows.length === 0} onClick={commit}>
                {busy ? "匯入中..." : `確認匯入 ${importableRows.length} 筆`}
              </button>
            </div>
          </>
        )}

        {step === 3 && result && (
          <>
            <p style={{ fontSize: "14px", color: ink, marginBottom: "16px" }}>
              新增 <b>{result.created}</b> 位新會員，{result.updated} 筆加到既有會員底下並加總時數
              {result.skipped > 0 && `，略過 ${result.skipped} 筆重複資料`}。
            </p>
            <button style={a.btnPrimary} onClick={onImported}>完成</button>
          </>
        )}
      </div>
    </div>
  );
}

function StudentDetailModal({
  student, checkins, adjustments, onClose, onChanged,
}: {
  student: HoursStudent;
  checkins: HoursCheckin[];
  adjustments: HoursAdjustment[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(student.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");
  const [plans, setPlans] = useState<HoursPlan[]>([]);
  const [studentPlans, setStudentPlans] = useState<HoursStudentPlan[]>([]);
  const [tagPlanId, setTagPlanId] = useState("");
  const [tagging, setTagging] = useState(false);

  useEffect(() => {
    hoursApi.listPlans().then(setPlans).catch(() => setPlans([]));
    hoursApi.listStudentPlans().then(setStudentPlans).catch(() => setStudentPlans([]));
  }, [student.id]);

  const myPlanNames = studentPlans
    .filter(sp => sp.student_id === student.id)
    .map(sp => plans.find(p => p.id === sp.plan_id)?.name)
    .filter((n): n is string => Boolean(n));

  const addTag = async () => {
    if (!tagPlanId) return;
    setTagging(true);
    try {
      await hoursApi.tagStudentPlan(student.id, tagPlanId);
      const updated = await hoursApi.listStudentPlans();
      setStudentPlans(updated);
      setTagPlanId("");
    } finally {
      setTagging(false);
    }
  };

  const toggleActive = () => hoursApi.updateStudent(student.id, { is_active: !student.is_active }).then(onChanged);
  const saveName = async () => {
    if (!nameDraft.trim()) return;
    await hoursApi.updateStudent(student.id, { name: nameDraft.trim() });
    setEditingName(false);
    onChanged();
  };
  const confirmDelete = async () => {
    if (deleteInput.trim() !== student.phone) return;
    setDeleting(true);
    setDeleteErr("");
    try {
      await hoursApi.deleteStudent(student.id);
      onChanged();
      onClose();
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "刪除失敗，請稍後再試");
    } finally {
      setDeleting(false);
    }
  };

  const statBoxStyle: React.CSSProperties = {
    flex: 1, textAlign: "center", background: "#E4E9EA",
    border: `1px solid ${line}`, borderRadius: "12px", padding: "13px 8px",
  };
  const bigActionBtnStyle: React.CSSProperties = {
    display: "block", width: "100%", textAlign: "center",
    fontSize: "14px", fontWeight: 700, padding: "12px", borderRadius: "11px",
    border: `2px solid ${line}`, background: "#fff", color: ink, cursor: "pointer",
    marginTop: "9px",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "18px",
        width: "100%",
        maxWidth: "450px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 12px 56px rgba(0,0,0,0.24)",
        padding: "27px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {editingName ? (
            <div style={{ flex: 1 }}>
              <input style={{ ...a.input, fontSize: "15px", padding: "9px 12px" }} value={nameDraft} onChange={e => setNameDraft(e.target.value)} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...a.btnPrimary, fontSize: "12px", padding: "9px 16px" }} onClick={saveName}>儲存</button>
                <button style={{ ...a.btnGhost, fontSize: "12px", padding: "9px 16px" }} onClick={() => setEditingName(false)}>取消</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 800, fontSize: "20px", color: ink, lineHeight: 1.3 }}>{student.name}</div>
              <div style={{ fontSize: "13px", color: inkSoft, marginTop: "3px" }}>統編 {student.phone}</div>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                {myPlanNames.length > 0 ? (
                  myPlanNames.map((n, i) => (
                    <span key={i} style={{ fontSize: "11px", fontWeight: 700, color: accent, background: "#FFF3EC", padding: "3px 10px", borderRadius: "999px" }}>
                      {n}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: inkSoft }}>尚未設定專案</span>
                )}
                <select
                  style={{ fontSize: "11px", border: `1px solid ${line}`, borderRadius: "999px", padding: "3px 8px", color: inkSoft, background: "#fff" }}
                  value={tagPlanId}
                  onChange={e => setTagPlanId(e.target.value)}
                  disabled={tagging}
                >
                  <option value="">+ 加入專案</option>
                  {plans.filter(p => !myPlanNames.includes(p.name)).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {tagPlanId && (
                  <button style={{ ...a.btnGhost, fontSize: "11px", padding: "3px 10px" }} onClick={addTag} disabled={tagging}>
                    {tagging ? "處理中..." : "確認"}
                  </button>
                )}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "10px" }}>
            {!editingName && (
              <button
                style={{ ...a.btnGhost, fontSize: "12px", padding: "8px 15px" }}
                onClick={() => { setNameDraft(student.name); setEditingName(true); }}
              >編輯</button>
            )}
            <button
              style={{ ...iconBtnStyle, width: "33px", height: "33px", borderRadius: "50%" }}
              onClick={onClose} title="關閉"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "9px", marginTop: "20px" }}>
          <div style={statBoxStyle}>
            <div style={{ fontSize: "11px", color: inkSoft, fontWeight: 600, marginBottom: "5px" }}>剩餘時數</div>
            <div style={{ fontSize: "25px", fontWeight: 800, color: accent, lineHeight: 1 }}>
              {fmtHours(student.remaining_hours)}<span style={{ fontSize: "12px", fontWeight: 700, marginLeft: "2px" }}>hr</span>
            </div>
          </div>
          <div style={statBoxStyle}>
            <div style={{ fontSize: "11px", color: inkSoft, fontWeight: 600, marginBottom: "5px" }}>累計購買</div>
            <div style={{ fontSize: "25px", fontWeight: 800, color: ink, lineHeight: 1 }}>
              {fmtHours(student.purchased_hours)}<span style={{ fontSize: "12px", fontWeight: 700, marginLeft: "2px" }}>hr</span>
            </div>
          </div>
          <div style={statBoxStyle}>
            <div style={{ fontSize: "11px", color: inkSoft, fontWeight: 600, marginBottom: "5px" }}>上課次數</div>
            <div style={{ fontSize: "25px", fontWeight: 800, color: ink, lineHeight: 1 }}>
              {student.attended_count}<span style={{ fontSize: "12px", fontWeight: 700, marginLeft: "2px" }}>次</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "22px", fontSize: "14px", fontWeight: 800, color: ink }}>上課紀錄</div>
        <div style={{ marginTop: "6px" }}>
          {checkins.map((c, i) => (
            <div key={c.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "9px",
              fontSize: "12px", color: ink, padding: "10px 9px",
              background: i % 2 === 0 ? "#E4E9EA" : "transparent", borderRadius: "8px",
            }}>
              <span style={{ fontWeight: 600 }}>{c.session_name || "課程"}</span>
              <span style={{ flexShrink: 0, color: danger, fontWeight: 700 }}>-{fmtHours(c.hours_deducted)} hr</span>
              <span style={{ flexShrink: 0, color: inkSoft, fontSize: "11px" }}>{fmtDateTime(c.checked_in_at)}</span>
            </div>
          ))}
          {checkins.length === 0 && <div style={{ fontSize: "12px", color: inkSoft, padding: "10px 9px" }}>尚無紀錄</div>}
        </div>

        <div style={{ marginTop: "18px", fontSize: "14px", fontWeight: 800, color: ink }}>時數異動</div>
        <div style={{ marginTop: "6px" }}>
          {adjustments.map((x, i) => (
            <div key={x.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "9px",
              fontSize: "12px", color: ink, padding: "10px 9px",
              background: i % 2 === 0 ? "#E4E9EA" : "transparent", borderRadius: "8px",
            }}>
              <span style={{ fontWeight: 600 }}>{x.reason}</span>
              <span style={{ flexShrink: 0, color: Number(x.amount) >= 0 ? good : danger, fontWeight: 700 }}>
                {Number(x.amount) >= 0 ? "+" : ""}{x.amount} hr
              </span>
              <span style={{ flexShrink: 0, color: inkSoft, fontSize: "11px" }}>{fmtDateTime(x.created_at)}</span>
            </div>
          ))}
          {adjustments.length === 0 && <div style={{ fontSize: "12px", color: inkSoft, padding: "10px 9px" }}>尚無紀錄</div>}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <button
            style={{ ...bigActionBtnStyle, marginTop: 0, color: student.is_active ? danger : good, borderColor: student.is_active ? danger : good }}
            onClick={toggleActive}
          >
            {student.is_active ? "停用此帳號" : "啟用此帳號"}
          </button>
          <button
            style={{ ...bigActionBtnStyle, marginTop: 0, color: "#fff", background: danger, borderColor: danger }}
            onClick={() => { setShowDeleteConfirm(v => !v); setDeleteInput(""); setDeleteErr(""); }}
          >
            刪除帳號
          </button>
        </div>

        {showDeleteConfirm && (
          <div style={{ marginTop: "12px", padding: "14px", borderRadius: "12px", border: `1px solid ${danger}`, background: "#E8DDD8" }}>
            <div style={{ fontSize: "13px", color: ink, marginBottom: "8px" }}>
              此操作無法復原。請輸入此帳號的統編 <b>{student.phone}</b> 以確認刪除：
            </div>
            <input
              style={{ ...a.input, marginBottom: "8px" }}
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="請輸入統編"
            />
            {deleteErr && <div style={{ fontSize: "12px", color: danger, marginBottom: "8px" }}>{deleteErr}</div>}
            <button
              style={{ ...bigActionBtnStyle, marginTop: 0, color: "#fff", background: danger, borderColor: danger, opacity: deleteInput.trim() === student.phone ? 1 : 0.4 }}
              onClick={confirmDelete}
              disabled={deleting || deleteInput.trim() !== student.phone}
            >
              {deleting ? "刪除中..." : "確認刪除帳號"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 時數調整 ────────────────────────────────────────────────────────────────
export function AdjustView() {
  const { students, adjustments, loading, reload } = useHoursData();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const list = [...students]
    .filter(s => !q.trim() || s.name.includes(q) || s.phone.includes(q))
    .sort((x, y) => x.name.localeCompare(y.name));
  const selected = students.find(s => s.id === selectedId) ?? null;
  const history = [...adjustments].sort((x, y) => (y.created_at || "").localeCompare(x.created_at || "")).slice(0, 20);
  const studentsById = new Map(students.map(s => [s.id, s]));

  const submit = async () => {
    if (!selected || !amount || !reason.trim()) return;
    await hoursApi.createAdjustment({ studentId: selected.id, amount: Number(amount), reason: reason.trim(), note: note.trim(), operator: "管理員" });
    setToast(`已${Number(amount) >= 0 ? "加" : "扣"} ${Math.abs(Number(amount))} hr`);
    setTimeout(() => setToast(""), 2600);
    setAmount(""); setReason(""); setNote("");
    setSelectedId(null);
    reload();
  };

  return (
    <div>
      <h2 style={h2Style}>時數調整</h2>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ ...a.card, flex: "1.3 1 420px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 6px" }}>手動加減時數</h3>
          <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "14px" }}>
            請先用統一編號或公司名稱搜尋要調整時數的學生，選好之後才能進行加減時數。
          </p>
          <input style={{ ...a.input, marginBottom: "14px" }} placeholder="輸入公司名稱或統一編號搜尋..." value={q} onChange={e => setQ(e.target.value)} />

          {selected && (
            <div style={{ background: accent, borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: ink }}>{selected.name}</div>
                  <div style={{ fontSize: "12px", color: ink }}>{selected.phone}・剩餘 {fmtHours(selected.remaining_hours)} hr</div>
                </div>
                <button
                  style={{ ...a.btnGhost, padding: "4px 10px", background: "#fff", color: accent, borderColor: "#fff" }}
                  onClick={() => setSelectedId(null)}
                >取消選擇</button>
              </div>
              <label style={{ ...a.label, color: ink }}>調整時數（正數為加時，負數為扣時）</label>
              <input type="number" style={a.input} value={amount} onChange={e => setAmount(e.target.value)} placeholder="例：5 或 -2" />
              <label style={{ ...a.label, color: ink }}>原因</label>
              <input style={a.input} value={reason} onChange={e => setReason(e.target.value)} placeholder="例：補購課程包" />
              <label style={{ ...a.label, color: ink }}>備註（選填）</label>
              <input style={a.input} value={note} onChange={e => setNote(e.target.value)} />
              <button style={{ ...a.btnPrimary, background: "#fff", color: accent }} onClick={submit}>確認調整</button>
              {toast && <span style={{ marginLeft: "12px", fontSize: "13px", color: ink, fontWeight: 700 }}>{toast}</span>}
            </div>
          )}

          <div style={{ maxHeight: "420px", overflow: "auto" }}>
            {list.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 4px", borderBottom: `1px solid ${line}`, cursor: "pointer",
                  background: selectedId === s.id ? "#FFF3EC" : "transparent",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px", color: ink }}>{s.name}</div>
                  <div style={{ fontSize: "11px", color: inkSoft }}>{s.phone}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "16px", color: ink }}>{fmtHours(s.remaining_hours)} hr</div>
              </div>
            ))}
            {list.length === 0 && <div style={emptyStyle}>沒有符合的學生</div>}
          </div>
        </div>

        <div style={{ ...a.card, flex: "1 1 320px", marginBottom: 0 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: ink, margin: "0 0 14px" }}>最近調整紀錄</h3>
          {history.length === 0 ? <div style={emptyStyle}>尚無異動紀錄</div> : history.map(x => {
            const isAdd = Number(x.amount) >= 0;
            return (
              <div key={x.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${line}` }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isAdd ? "#FBE0D2" : "#E8DDD8", color: isAdd ? good : danger, fontWeight: 800, fontSize: "13px",
                }}>
                  {isAdd ? "+" : "−"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", color: ink }}>
                    <b>{studentsById.get(x.student_id)?.name ?? "—"}</b> 手動{isAdd ? "加時" : "扣回"} {fmtHours(Math.abs(Number(x.amount)))} hr
                  </div>
                  <div style={{ fontSize: "11px", color: inkSoft, marginTop: "2px" }}>
                    原因：{x.reason}・{x.operator || "管理員"}操作・{fmtDateTime(x.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 查詢我的時數（學生自助預覽） ─────────────────────────────────────────────
export function SelfQueryView() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<HoursStudent | null | undefined>(undefined);
  const [checkins, setCheckins] = useState<HoursCheckin[]>([]);
  const [adjustments, setAdjustments] = useState<HoursAdjustment[]>([]);

  const runQuery = async () => {
    if (!phone.trim()) return;
    const student = await hoursApi.studentByPhone(phone.trim());
    setResult(student);
    if (student) {
      const [allCheckins, allAdjustments] = await Promise.all([hoursApi.listCheckins(), hoursApi.listAdjustments()]);
      setCheckins(allCheckins.filter(c => c.student_id === student.id).slice(0, 8));
      setAdjustments(allAdjustments.filter(x => x.student_id === student.id).slice(0, 8));
    }
  };

  return (
    <div>
      <h2 style={h2Style}>查詢我的時數</h2>
      <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "14px" }}>這是學員自己查詢剩餘時數與上課紀錄的畫面預覽，客戶端實際使用 /member.html。</p>
      <div style={{ ...a.card, maxWidth: "420px" }}>
        <label style={a.label}>電話號碼</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input style={{ ...a.input, marginBottom: 0 }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="請輸入電話" />
          <button style={a.btnPrimary} onClick={runQuery}>查詢</button>
        </div>
      </div>

      {result === null && <div style={{ ...a.card, ...emptyStyle }}>查無此電話的學員資料</div>}

      {result && (
        <div style={a.card}>
          <div style={{ fontWeight: 700, fontSize: "16px", color: ink }}>{result.name}</div>
          <div style={{ fontSize: "13px", color: ink, marginTop: "8px" }}>
            剩餘時數 <b>{fmtHours(result.remaining_hours)} hr</b>　累計上課 {result.attended_count} 堂
          </div>
          <div style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: inkSoft }}>最近上課紀錄</div>
          {checkins.map(c => (
            <div key={c.id} style={{ fontSize: "12px", color: ink, padding: "6px 0", borderBottom: `1px solid ${line}` }}>
              {c.session_name || "課程"}　-{fmtHours(c.hours_deducted)} hr
            </div>
          ))}
          <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: 700, color: inkSoft }}>最近時數異動</div>
          {adjustments.map(x => (
            <div key={x.id} style={{ fontSize: "12px", color: ink, padding: "6px 0", borderBottom: `1px solid ${line}` }}>
              {x.reason}　<span style={{ color: Number(x.amount) >= 0 ? good : danger }}>{Number(x.amount) >= 0 ? "+" : ""}{x.amount} hr</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

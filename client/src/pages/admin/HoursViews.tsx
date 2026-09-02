import { useEffect, useState } from "react";
import { BookOpen, CheckSquare, AlertTriangle, Clock3, TrendingUp, TrendingDown, LayoutGrid } from "lucide-react";
import { hoursApi, fmtHours, type HoursStudent, type HoursSession, type HoursRegistration, type HoursCheckin, type HoursAdjustment, type ImportRow } from "@/lib/hoursApi";
import { ink, inkSoft, accent, line, danger, good, adminStyles as a } from "@/lib/adminTheme";

const h2Style: React.CSSProperties = { fontWeight: 700, fontSize: "16px", color: ink, margin: "0 0 16px" };
const emptyStyle: React.CSSProperties = { textAlign: "center", padding: "32px", color: "#9CA3AF", fontSize: "13px" };

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
  if (now < start) return { label: "未開始", color: inkSoft, bg: "#EFF0E6" };
  if (now > end) return { label: "已結束", color: inkSoft, bg: "#EFF0E6" };
  return { label: "進行中", color: good, bg: "#DFF3E7" };
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
    <div style={{ background: "#F7F8F2", borderRadius: "12px", padding: "14px", flex: "1 1 45%", minWidth: "140px" }}>
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
          icon={<BookOpen size={17} strokeWidth={2} />} iconBg="#FFE3D6" iconColor={accent}
          label="今日課程" value={todaySessions.length} unit="場"
          badge={todaySessions[0] ? `最近一場 ${todaySessions[0].start_time.slice(0, 5)} 開始` : "今天沒有場次"} badgeColor="#F2F3EC"
        />
        <StatCard
          icon={<CheckSquare size={17} strokeWidth={2} />} iconBg="#DFF3E7" iconColor={good}
          label="今日報到人次" value={todayCheckins.length} unit="人次"
          badge={`${todayCheckins.length >= yesterdayCheckins.length ? "↗" : "↘"} ${Math.abs(todayCheckins.length - yesterdayCheckins.length)} 較昨日同時段`} badgeColor="#DFF3E7"
        />
        <StatCard
          icon={<AlertTriangle size={17} strokeWidth={2} />} iconBg="#F6ECD2" iconColor="#B17F2A"
          label="時數偏低學員" value={lowCount} unit="位"
          badge={lowCount > 0 ? `${lowHours.filter(s => Number(s.remaining_hours) <= 0).length} 位已用罄` : "目前都正常"} badgeColor="#F6ECD2"
        />
        <StatCard
          icon={<Clock3 size={17} strokeWidth={2} />} iconBg="#FBE2DB" iconColor={danger}
          label="本月扣除時數" value={fmtHours(monthHours)} unit="小時"
          badge={`${monthChangePct >= 0 ? "↗" : "↘"} ${Math.abs(monthChangePct)}% 較上月`} badgeColor="#FBE2DB"
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
              <span style={{ color: Number(s.remaining_hours) <= 0 ? danger : "#B17F2A", fontWeight: 700 }}>{fmtHours(s.remaining_hours)} hr</span>
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
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#DFF3E7", color: good, fontSize: "12px", fontWeight: 700 }}>正常</span>
            <span style={{ fontWeight: 700, color: ink }}>{activeCount - lowCount} 位</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#F6ECD2", color: "#B17F2A", fontSize: "12px", fontWeight: 700 }}>時數偏低</span>
            <span style={{ fontWeight: 700, color: ink }}>{lowCount} 位</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#EFF0E6", color: inkSoft, fontSize: "12px", fontWeight: 700 }}>已停用</span>
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
              background: step >= s.n ? ink : "#EFF0E6",
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
          <div style={{ background: "#F7F8F2", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
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

// ── 學生管理 ────────────────────────────────────────────────────────────────
export function StudentsView() {
  const { students, checkins, adjustments, loading, reload } = useHoursData();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const filtered = q.trim()
    ? students.filter(s => s.name.includes(q) || s.phone.includes(q))
    : students;
  const sorted = [...filtered].sort((x, y) => x.name.localeCompare(y.name));
  const selected = students.find(s => s.id === selectedId) ?? null;

  const toggleActive = (s: HoursStudent) => hoursApi.updateStudent(s.id, { is_active: !s.is_active }).then(reload);

  const saveName = async () => {
    if (!selected || !nameDraft.trim()) return;
    await hoursApi.updateStudent(selected.id, { name: nameDraft.trim() });
    setEditingName(false);
    reload();
  };

  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={h2Style}>學員管理（共 {students.length} 位）</h2>
        <div style={a.card}>
          <input style={{ ...a.input, maxWidth: "280px" }} placeholder="搜尋姓名或電話..." value={q} onChange={e => setQ(e.target.value)} />
          <table style={a.table}>
            <thead><tr><th style={a.th}>姓名</th><th style={a.th}>電話</th><th style={a.th}>剩餘時數</th><th style={a.th}>狀態</th></tr></thead>
            <tbody>
              {sorted.map(s => (
                <tr key={s.id} onClick={() => setSelectedId(s.id)} style={{ cursor: "pointer", background: selectedId === s.id ? "#FFF3EC" : "transparent" }}>
                  <td style={a.td}>{s.name}</td>
                  <td style={a.td}>{s.phone}</td>
                  <td style={a.td}>{fmtHours(s.remaining_hours)} hr</td>
                  <td style={a.td}>
                    <span style={{ color: s.is_active ? good : inkSoft, fontWeight: 600, fontSize: "12px" }}>
                      {s.is_active ? "啟用中" : "已停用"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <div style={emptyStyle}>沒有符合的學員</div>}
        </div>
      </div>

      {selected && (
        <div style={{ width: "340px", flexShrink: 0 }}>
          <div style={a.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {editingName ? (
                <div style={{ flex: 1 }}>
                  <input style={a.input} value={nameDraft} onChange={e => setNameDraft(e.target.value)} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={a.btnPrimary} onClick={saveName}>儲存</button>
                    <button style={a.btnGhost} onClick={() => setEditingName(false)}>取消</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: ink }}>{selected.name}</div>
                  <div style={{ fontSize: "12px", color: inkSoft }}>{selected.phone}</div>
                </div>
              )}
              {!editingName && (
                <button style={a.btnGhost} onClick={() => { setNameDraft(selected.name); setEditingName(true); }}>編輯</button>
              )}
            </div>
            <div style={{ marginTop: "14px", fontSize: "13px", color: ink }}>
              剩餘時數 <b>{fmtHours(selected.remaining_hours)} hr</b>　累計購買 {fmtHours(selected.purchased_hours)} hr　上課 {selected.attended_count} 次
            </div>
            <button
              style={{ ...a.btnGhost, marginTop: "10px", color: selected.is_active ? danger : good, borderColor: selected.is_active ? danger : good }}
              onClick={() => toggleActive(selected)}
            >
              {selected.is_active ? "停用此帳號" : "啟用此帳號"}
            </button>

            <div style={{ marginTop: "18px", fontSize: "12px", fontWeight: 700, color: inkSoft }}>上課紀錄</div>
            {checkins.filter(c => c.student_id === selected.id).slice(0, 6).map(c => (
              <div key={c.id} style={{ fontSize: "12px", color: ink, padding: "6px 0", borderBottom: `1px solid ${line}` }}>
                {c.session_name || "課程"}　-{fmtHours(c.hours_deducted)} hr　<span style={{ color: inkSoft }}>{fmtDateTime(c.checked_in_at)}</span>
              </div>
            ))}

            <div style={{ marginTop: "14px", fontSize: "12px", fontWeight: 700, color: inkSoft }}>時數異動</div>
            {adjustments.filter(x => x.student_id === selected.id).slice(0, 6).map(x => (
              <div key={x.id} style={{ fontSize: "12px", color: ink, padding: "6px 0", borderBottom: `1px solid ${line}` }}>
                {x.reason}　<span style={{ color: Number(x.amount) >= 0 ? good : danger }}>{Number(x.amount) >= 0 ? "+" : ""}{x.amount} hr</span>　<span style={{ color: inkSoft }}>{fmtDateTime(x.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
            <div style={{ background: "#F7F8F2", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: ink }}>{selected.name}</div>
                  <div style={{ fontSize: "12px", color: inkSoft }}>{selected.phone}・剩餘 {fmtHours(selected.remaining_hours)} hr</div>
                </div>
                <button style={{ ...a.btnGhost, padding: "4px 10px" }} onClick={() => setSelectedId(null)}>取消選擇</button>
              </div>
              <label style={a.label}>調整時數（正數為加時，負數為扣時）</label>
              <input type="number" style={a.input} value={amount} onChange={e => setAmount(e.target.value)} placeholder="例：5 或 -2" />
              <label style={a.label}>原因</label>
              <input style={a.input} value={reason} onChange={e => setReason(e.target.value)} placeholder="例：補購課程包" />
              <label style={a.label}>備註（選填）</label>
              <input style={a.input} value={note} onChange={e => setNote(e.target.value)} />
              <button style={a.btnPrimary} onClick={submit}>確認調整</button>
              {toast && <span style={{ marginLeft: "12px", fontSize: "13px", color: good }}>{toast}</span>}
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
                <div style={{ fontWeight: 700, fontSize: "14px", color: ink }}>{fmtHours(s.remaining_hours)} hr</div>
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
                  background: isAdd ? "#DFF3E7" : "#FBE2DB", color: isAdd ? good : danger, fontWeight: 800, fontSize: "13px",
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

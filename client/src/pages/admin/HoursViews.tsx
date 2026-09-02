import { useEffect, useState } from "react";
import { hoursApi, fmtHours, type HoursStudent, type HoursSession, type HoursRegistration, type HoursCheckin, type HoursAdjustment } from "@/lib/hoursApi";
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
export function DashboardView() {
  const { students, sessions, checkins, loading, reload } = useHoursData();
  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.session_date === today);
  const lowHours = students.filter(s => s.is_active && Number(s.remaining_hours) < 1.5).sort((x, y) => Number(x.remaining_hours) - Number(y.remaining_hours));
  const recentCheckins = [...checkins].filter(c => c.result === "success").sort((x, y) => (y.checked_in_at || "").localeCompare(x.checked_in_at || "")).slice(0, 8);
  const studentsById = new Map(students.map(s => [s.id, s]));

  const stat = (label: string, value: string | number) => (
    <div style={{ ...a.card, flex: 1, minWidth: "140px", marginBottom: 0, textAlign: "center" }}>
      <div style={{ fontSize: "26px", fontWeight: 800, color: accent }}>{value}</div>
      <div style={{ fontSize: "12px", color: inkSoft, marginTop: "4px" }}>{label}</div>
    </div>
  );

  return (
    <div>
      <h2 style={h2Style}>儀表板</h2>
      <div style={{ display: "flex", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
        {stat("學員總數", students.length)}
        {stat("啟用中學員", students.filter(s => s.is_active).length)}
        {stat("今日場次", todaySessions.length)}
        {stat("時數偏低學員", lowHours.length)}
      </div>

      <div style={a.card}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>時數偏低 / 已用罄</h3>
        {lowHours.length === 0 ? <div style={emptyStyle}>目前沒有時數偏低的學員</div> : (
          <table style={a.table}>
            <thead><tr><th style={a.th}>姓名</th><th style={a.th}>電話</th><th style={a.th}>剩餘時數</th></tr></thead>
            <tbody>
              {lowHours.map(s => (
                <tr key={s.id}>
                  <td style={a.td}>{s.name}</td>
                  <td style={a.td}>{s.phone}</td>
                  <td style={{ ...a.td, color: Number(s.remaining_hours) <= 0 ? danger : "#B17F2A", fontWeight: 700 }}>{fmtHours(s.remaining_hours)} hr</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={a.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: 0 }}>最近報到</h3>
          <button style={a.btnGhost} onClick={() => reload()}>重新整理</button>
        </div>
        {recentCheckins.length === 0 ? <div style={emptyStyle}>尚無報到紀錄</div> : (
          <table style={a.table}>
            <thead><tr><th style={a.th}>學員</th><th style={a.th}>課程</th><th style={a.th}>扣除時數</th><th style={a.th}>時間</th></tr></thead>
            <tbody>
              {recentCheckins.map(c => (
                <tr key={c.id}>
                  <td style={a.td}>{studentsById.get(c.student_id)?.name ?? "—"}</td>
                  <td style={a.td}>{c.session_name || "—"}</td>
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

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const todayStr = new Date().toISOString().slice(0, 10);
  const sorted = [...sessions].sort((x, y) => (x.session_date + x.start_time).localeCompare(y.session_date + y.start_time));

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ ...h2Style, margin: 0 }}>課程場次（共 {sessions.length} 場）</h2>
        <button style={a.btnPrimary} onClick={() => { setEditing(null); setShowForm(true); }}>＋ 新增場次</button>
      </div>

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
export function ImportRosterView() {
  const { sessions, loading, reload } = useHoursData();
  const [text, setText] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [purchasedHours, setPurchasedHours] = useState("10");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <div style={emptyStyle}>載入中...</div>;

  const runImport = async () => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setBusy(true);
    let created = 0, skipped = 0;
    for (const line of lines) {
      const parts = line.split(/[,\t，]/).map(p => p.trim());
      const name = parts[0];
      const phone = (parts[1] || "").replace(/[^0-9]/g, "");
      if (!name || !phone) { skipped++; continue; }
      try {
        const existing = await hoursApi.studentByPhone(phone);
        if (existing) { skipped++; continue; }
        await hoursApi.createStudent({
          name, phone,
          purchased_hours: Number(purchasedHours), remaining_hours: Number(purchasedHours),
          note: "名單匯入新增",
        });
        created++;
      } catch { skipped++; }
    }
    setBusy(false);
    setResult(`匯入完成：新增 ${created} 位，略過 ${skipped} 位（電話重複或格式錯誤）`);
    setText("");
    reload();
  };

  return (
    <div>
      <h2 style={h2Style}>匯入名單</h2>
      <div style={a.card}>
        <p style={{ fontSize: "13px", color: inkSoft, marginBottom: "12px" }}>
          每行一位學員，格式：姓名,電話（用逗號或 Tab 分隔）。系統會依電話判斷是否已存在，重複的電話會略過不重複新增。
        </p>
        <label style={a.label}>名單內容</label>
        <textarea
          style={{ ...a.input, minHeight: "160px", fontFamily: "monospace", fontSize: "13px" }}
          placeholder={"王小明,0912345678\n林小華,0922333444"}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <label style={a.label}>初始購買時數（套用到這批全部新學員）</label>
        <input type="number" style={{ ...a.input, width: "160px" }} value={purchasedHours} onChange={e => setPurchasedHours(e.target.value)} />
        <div>
          <label style={a.label}>（選填）同時報名場次</label>
          <select style={{ ...a.input, width: "auto", minWidth: "260px" }} value={sessionId} onChange={e => setSessionId(e.target.value)}>
            <option value="">不報名任何場次</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.name}（{s.session_date}）</option>)}
          </select>
        </div>
        <button style={a.btnPrimary} disabled={busy} onClick={runImport}>{busy ? "匯入中..." : "開始匯入"}</button>
        {result && <div style={{ marginTop: "12px", fontSize: "13px", color: ink }}>{result}</div>}
      </div>
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
        <h2 style={h2Style}>學生管理（共 {students.length} 位）</h2>
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

  const matches = q.trim() ? students.filter(s => s.name.includes(q) || s.phone.includes(q)) : [];
  const selected = students.find(s => s.id === selectedId) ?? null;
  const history = [...adjustments].sort((x, y) => (y.created_at || "").localeCompare(x.created_at || "")).slice(0, 15);
  const studentsById = new Map(students.map(s => [s.id, s]));

  const submit = async () => {
    if (!selected || !amount || !reason.trim()) return;
    await hoursApi.createAdjustment({ studentId: selected.id, amount: Number(amount), reason: reason.trim(), note: note.trim(), operator: "管理員" });
    setToast(`已${Number(amount) >= 0 ? "加" : "扣"} ${Math.abs(Number(amount))} hr`);
    setTimeout(() => setToast(""), 2600);
    setAmount(""); setReason(""); setNote("");
    reload();
  };

  return (
    <div>
      <h2 style={h2Style}>時數調整</h2>
      <div style={a.card}>
        <label style={a.label}>搜尋學員（姓名或電話）</label>
        <input style={a.input} value={selected ? `${selected.name}（${selected.phone}）` : q} onChange={e => { setQ(e.target.value); setSelectedId(null); }} />
        {!selected && matches.length > 0 && (
          <div style={{ border: `1px solid ${line}`, borderRadius: "8px", marginTop: "-10px", marginBottom: "14px" }}>
            {matches.slice(0, 6).map(s => (
              <div key={s.id} style={{ padding: "8px 12px", cursor: "pointer", fontSize: "13px", borderBottom: `1px solid ${line}` }} onClick={() => { setSelectedId(s.id); setQ(""); }}>
                {s.name}　{s.phone}　剩餘 {fmtHours(s.remaining_hours)} hr
              </div>
            ))}
          </div>
        )}
        {selected && (
          <>
            <div style={{ fontSize: "13px", color: ink, marginBottom: "12px" }}>目前剩餘 <b>{fmtHours(selected.remaining_hours)} hr</b></div>
            <label style={a.label}>調整時數（正數為加時，負數為扣時）</label>
            <input type="number" style={a.input} value={amount} onChange={e => setAmount(e.target.value)} placeholder="例：5 或 -2" />
            <label style={a.label}>原因</label>
            <input style={a.input} value={reason} onChange={e => setReason(e.target.value)} placeholder="例：補購課程包" />
            <label style={a.label}>備註（選填）</label>
            <input style={a.input} value={note} onChange={e => setNote(e.target.value)} />
            <button style={a.btnPrimary} onClick={submit}>確認調整</button>
            {toast && <span style={{ marginLeft: "12px", fontSize: "13px", color: good }}>{toast}</span>}
          </>
        )}
      </div>

      <div style={a.card}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: ink, margin: "0 0 12px" }}>最近異動紀錄</h3>
        {history.length === 0 ? <div style={emptyStyle}>尚無異動紀錄</div> : history.map(x => (
          <div key={x.id} style={{ fontSize: "13px", color: ink, padding: "8px 0", borderBottom: `1px solid ${line}` }}>
            <b>{studentsById.get(x.student_id)?.name ?? "—"}</b> {x.reason}
            <span style={{ color: Number(x.amount) >= 0 ? good : danger }}>{Number(x.amount) >= 0 ? "+" : ""}{x.amount} hr</span>
            <span style={{ color: inkSoft, marginLeft: "8px" }}>{fmtDateTime(x.created_at)}</span>
          </div>
        ))}
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

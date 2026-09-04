// Client for the /api/hours/* endpoints (server/hoursSheets.ts) — the Google
// Sheets backed student-hours system (course sessions, check-ins, adjustments).

export interface HoursStudent {
  id: string;
  name: string;
  phone: string;
  email: string;
  remaining_hours: number;
  purchased_hours: number;
  attended_count: number;
  is_active: boolean;
  note: string;
  joined_at: string;
  created_at: string;
  avatar_url?: string;
}

export interface HoursPlan {
  id: string;
  name: string;
  hours: number;
  created_at: string;
}

export interface HoursStudentPlan {
  id: string;
  student_id: string;
  plan_id: string;
  hours: number;
  created_at: string;
}

export interface HoursSession {
  id: string;
  name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  teacher: string;
  room: string;
  hours_per_checkin: number;
  capacity: number;
  is_open: boolean;
  created_at: string;
}

export interface HoursRegistration {
  id: string;
  student_id: string;
  session_id: string;
  seats_total: number;
  seats_checked_in: number;
  created_at: string;
}

export interface HoursCheckin {
  id: string;
  student_id: string;
  session_id: string;
  phone_used: string;
  result: string;
  hours_deducted: number;
  checked_in_at: string;
  session_name?: string;
}

export interface HoursAdjustment {
  id: string;
  student_id: string;
  amount: number;
  reason: string;
  note: string;
  operator: string;
  created_at: string;
}

const ADMIN_PASSWORD = "84204302";

async function call<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/hours${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": ADMIN_PASSWORD,
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && (data.detail || data.error)) || `HTTP ${res.status}`);
  }
  return data as T;
}

export const hoursApi = {
  listStudents: () => call<HoursStudent[]>("/students"),
  studentByPhone: (phone: string) => call<{ student: HoursStudent | null }>(`/students/by-phone/${encodeURIComponent(phone)}`).then(r => r.student),
  createStudent: (data: Partial<HoursStudent> & { name: string; phone: string }) => call<HoursStudent>("/students", { method: "POST", body: JSON.stringify(data) }),
  lookupCompany: (taxId: string) => call<{ taxId: string; name: string; representative: string; address: string; source: string }>(`/company-lookup/${encodeURIComponent(taxId)}`),
  updateStudent: (id: string, patch: Partial<HoursStudent>) => call<HoursStudent>(`/students/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteStudent: (id: string) => call<{ ok: boolean }>(`/students/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listPlans: () => call<HoursPlan[]>("/plans"),
  createPlan: (data: { name: string; hours: number }) => call<HoursPlan>("/plans", { method: "POST", body: JSON.stringify(data) }),
  updatePlan: (id: string, patch: Partial<{ name: string; hours: number }>) => call<HoursPlan>(`/plans/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deletePlan: (id: string) => call<{ ok: boolean }>(`/plans/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listStudentPlans: () => call<HoursStudentPlan[]>("/student-plans"),
  enrollStudents: (planId: string, rows: { taxId: string; name: string; note?: string }[]) =>
    call<{ created: number; updated: number; skipped: number; results: { taxId: string; status: string }[] }>(
      "/students/enroll", { method: "POST", body: JSON.stringify({ planId, rows }) }
    ),
  tagStudentPlan: (studentId: string, planId: string) =>
    call<{ ok: boolean; created?: boolean; tag?: HoursStudentPlan }>(
      `/students/${encodeURIComponent(studentId)}/tag-plan`, { method: "POST", body: JSON.stringify({ planId }) }
    ),

  listSessions: () => call<HoursSession[]>("/sessions"),
  createSession: (data: Omit<HoursSession, "id" | "created_at">) => call<HoursSession>("/sessions", { method: "POST", body: JSON.stringify(data) }),
  updateSession: (id: string, patch: Partial<HoursSession>) => call<HoursSession>(`/sessions/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) }),
  syncSessionsFromCourses: () => call<{ ok: boolean; count: number }>("/sessions/sync-from-courses", { method: "POST" }),

  listRegistrations: () => call<HoursRegistration[]>("/registrations"),
  listCheckins: () => call<HoursCheckin[]>("/checkins"),
  listAdjustments: () => call<HoursAdjustment[]>("/adjustments"),

  checkinAttempt: (phone: string, sessionId: string | null, hours: number) =>
    call<
      | { state: "notfound" }
      | { state: "notregistered"; student: HoursStudent }
      | { state: "duplicate"; student: HoursStudent; reg: HoursRegistration }
      | { state: "insufficient"; student: HoursStudent }
      | { state: "success"; student: HoursStudent }
    >("/checkin/attempt", { method: "POST", body: JSON.stringify({ phone, sessionId, hours }) }),

  checkinRegisterExisting: (studentId: string, sessionId: string, phoneUsed: string, hours: number) =>
    call<{ ok: boolean; reason?: string; student: HoursStudent }>("/checkin/register-existing", {
      method: "POST",
      body: JSON.stringify({ studentId, sessionId, phoneUsed, hours }),
    }),

  checkinRegisterNew: (payload: { name: string; phone: string; hours: number; note?: string; sessionId?: string | null; planLabel?: string; payment?: string }) =>
    call<HoursStudent>("/checkin/register-new", { method: "POST", body: JSON.stringify(payload) }),

  createAdjustment: (payload: { studentId: string; amount: number; reason: string; note?: string; operator?: string }) =>
    call<HoursStudent>("/adjustments", { method: "POST", body: JSON.stringify(payload) }),

  importPreview: (url: string) => call<{ rows: ImportRow[] }>("/import/preview", { method: "POST", body: JSON.stringify({ url }) }),
  importCommit: (rows: ImportRow[]) => call<{ created: number; updated: number }>("/import/commit", { method: "POST", body: JSON.stringify({ rows }) }),
};

export interface ImportRow {
  name: string;
  taxId: string;
  purchasedHours: number;
  note: string;
  email: string;
  courseName: string;
  expiresAt: string;
  error?: string;
}

export function fmtHours(n: number): string {
  return Number(n).toFixed(2).replace(/\.?0+$/, "") || "0";
}

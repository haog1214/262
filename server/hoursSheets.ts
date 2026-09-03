import { google } from "googleapis";

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
  // "senior" members never have hours checked or deducted, at self-enroll or
  // front-desk checkin — everything else about them works the same. Empty/
  // missing means "regular" (the default, pay-per-class-hours behavior).
  tier?: "regular" | "senior";
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

const STUDENT_HEADERS: (keyof HoursStudent)[] = [
  "id", "name", "phone", "email", "remaining_hours", "purchased_hours",
  "attended_count", "is_active", "note", "joined_at", "created_at", "avatar_url", "tier",
];
const SESSION_HEADERS: (keyof HoursSession)[] = [
  "id", "name", "session_date", "start_time", "end_time", "teacher", "room",
  "hours_per_checkin", "capacity", "is_open", "created_at",
];
const REGISTRATION_HEADERS: (keyof HoursRegistration)[] = [
  "id", "student_id", "session_id", "seats_total", "seats_checked_in", "created_at",
];
const CHECKIN_HEADERS: (keyof HoursCheckin)[] = [
  "id", "student_id", "session_id", "phone_used", "result", "hours_deducted", "checked_in_at",
];
const ADJUSTMENT_HEADERS: (keyof HoursAdjustment)[] = [
  "id", "student_id", "amount", "reason", "note", "operator", "created_at",
];

const NUMERIC_FIELDS = new Set([
  "remaining_hours", "purchased_hours", "attended_count",
  "hours_per_checkin", "capacity", "seats_total", "seats_checked_in", "hours_deducted", "amount",
]);
const BOOLEAN_FIELDS = new Set(["is_active", "is_open"]);

function getSheets() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!raw || !sheetId) throw new Error("Missing Google Sheets env vars");

  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

async function ensureTab(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  tabName: string
): Promise<void> {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const exists = meta.data.sheets?.some(s => s.properties?.title === tabName);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
      });
    }
  } catch {
    // ignore — write will surface the real error
  }
}

function coerce(field: string, raw: string): unknown {
  if (NUMERIC_FIELDS.has(field)) return raw === "" ? 0 : Number(raw);
  if (BOOLEAN_FIELDS.has(field)) return raw === "true";
  return raw ?? "";
}

async function readTable<T>(tab: string, headers: (keyof T)[]): Promise<T[]> {
  const { sheets, sheetId } = getSheets();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tab}!A:Z`,
    });
    const [headerRow, ...dataRows] = res.data.values ?? [];
    if (!dataRows?.length) return [];
    const cols = (headerRow ?? headers) as string[];
    return dataRows
      .filter(row => row.some(Boolean))
      .map(row => {
        const obj: Record<string, unknown> = {};
        cols.forEach((h, i) => {
          obj[h] = coerce(h, row[i] ?? "");
        });
        return obj as unknown as T;
      });
  } catch {
    return [];
  }
}

async function writeTable<T>(
  tab: string,
  headers: (keyof T)[],
  rows: T[]
): Promise<void> {
  const { sheets, sheetId } = getSheets();
  await ensureTab(sheets, sheetId, tab);
  const values = [
    headers,
    ...rows.map(r => headers.map(h => String((r as Record<string, unknown>)[h as string] ?? ""))),
  ];
  await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: `${tab}!A:Z` });
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tab}!A1`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

// ── Single global lock — every write goes through this so the read-modify-write
//    cycle against a whole sheet tab (there's no row-level locking in Sheets) can
//    never interleave with another write and silently lose or double-apply a change.
let chain: Promise<unknown> = Promise.resolve();
export function withHoursLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = chain.then(fn, fn);
  chain = result.catch(() => {});
  return result;
}

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
function nowIso(): string {
  return new Date().toISOString();
}

// ── Students ────────────────────────────────────────────────────────────────
export const readStudents = () => readTable<HoursStudent>("hours_students", STUDENT_HEADERS);
export const writeStudents = (rows: HoursStudent[]) => writeTable("hours_students", STUDENT_HEADERS, rows);

// NOTE on locking: every "Raw" function below assumes the caller already holds
// withHoursLock (composite atomic operations in index.ts take the lock once and
// call several Raw functions inside it). The unprefixed exports take the lock
// themselves, for simple single-step callers. Never call withHoursLock from
// inside a Raw function, and never call a non-Raw exported function from inside
// an already-locked block — both deadlock against the same lock.

async function createStudentRaw(data: Omit<HoursStudent, "id" | "created_at">): Promise<HoursStudent> {
  const rows = await readStudents();
  const row: HoursStudent = { ...data, id: newId(), created_at: nowIso() };
  rows.push(row);
  await writeStudents(rows);
  return row;
}
async function updateStudentRaw(id: string, patch: Partial<HoursStudent>): Promise<HoursStudent | null> {
  const rows = await readStudents();
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch };
  await writeStudents(rows);
  return rows[idx];
}
export const createStudent = (data: Omit<HoursStudent, "id" | "created_at">) => withHoursLock(() => createStudentRaw(data));
export const updateStudent = (id: string, patch: Partial<HoursStudent>) => withHoursLock(() => updateStudentRaw(id, patch));

// ── Sessions ────────────────────────────────────────────────────────────────
export const readSessions = () => readTable<HoursSession>("hours_sessions", SESSION_HEADERS);
export const writeSessions = (rows: HoursSession[]) => writeTable("hours_sessions", SESSION_HEADERS, rows);

async function createSessionRaw(data: Omit<HoursSession, "id" | "created_at">): Promise<HoursSession> {
  const rows = await readSessions();
  const row: HoursSession = { ...data, id: newId(), created_at: nowIso() };
  rows.push(row);
  await writeSessions(rows);
  return row;
}
async function updateSessionRaw(id: string, patch: Partial<HoursSession>): Promise<HoursSession | null> {
  const rows = await readSessions();
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch };
  await writeSessions(rows);
  return rows[idx];
}
export const createSession = (data: Omit<HoursSession, "id" | "created_at">) => withHoursLock(() => createSessionRaw(data));
export const updateSession = (id: string, patch: Partial<HoursSession>) => withHoursLock(() => updateSessionRaw(id, patch));

// ── Registrations ───────────────────────────────────────────────────────────
export const readRegistrations = () => readTable<HoursRegistration>("hours_registrations", REGISTRATION_HEADERS);
export const writeRegistrations = (rows: HoursRegistration[]) => writeTable("hours_registrations", REGISTRATION_HEADERS, rows);

async function createRegistrationRaw(data: Omit<HoursRegistration, "id" | "created_at">): Promise<HoursRegistration> {
  const rows = await readRegistrations();
  const row: HoursRegistration = { ...data, id: newId(), created_at: nowIso() };
  rows.push(row);
  await writeRegistrations(rows);
  return row;
}
async function updateRegistrationSeatsCheckedInRaw(id: string, seatsCheckedIn: number): Promise<void> {
  const rows = await readRegistrations();
  const idx = rows.findIndex(r => r.id === id);
  if (idx === -1) return;
  rows[idx] = { ...rows[idx], seats_checked_in: seatsCheckedIn };
  await writeRegistrations(rows);
}
export const createRegistration = (data: Omit<HoursRegistration, "id" | "created_at">) => withHoursLock(() => createRegistrationRaw(data));

// ── Checkins ────────────────────────────────────────────────────────────────
export const readCheckins = () => readTable<HoursCheckin>("hours_checkins", CHECKIN_HEADERS);
export const writeCheckins = (rows: HoursCheckin[]) => writeTable("hours_checkins", CHECKIN_HEADERS, rows);

async function createCheckinRaw(data: Omit<HoursCheckin, "id" | "checked_in_at">): Promise<HoursCheckin> {
  const rows = await readCheckins();
  const row: HoursCheckin = { ...data, id: newId(), checked_in_at: nowIso() };
  rows.push(row);
  await writeCheckins(rows);
  return row;
}
export const createCheckin = (data: Omit<HoursCheckin, "id" | "checked_in_at">) => withHoursLock(() => createCheckinRaw(data));

// ── Adjustments ─────────────────────────────────────────────────────────────
export const readAdjustments = () => readTable<HoursAdjustment>("hours_adjustments", ADJUSTMENT_HEADERS);
export const writeAdjustments = (rows: HoursAdjustment[]) => writeTable("hours_adjustments", ADJUSTMENT_HEADERS, rows);

async function createAdjustmentRaw(data: Omit<HoursAdjustment, "id" | "created_at">): Promise<HoursAdjustment> {
  const rows = await readAdjustments();
  const row: HoursAdjustment = { ...data, id: newId(), created_at: nowIso() };
  rows.push(row);
  await writeAdjustments(rows);
  return row;
}
export const createAdjustment = (data: Omit<HoursAdjustment, "id" | "created_at">) => withHoursLock(() => createAdjustmentRaw(data));

// Exposed for composite atomic operations in index.ts that need several of these
// Raw steps to happen under a single lock acquisition.
export const raw = {
  createStudent: createStudentRaw,
  updateStudent: updateStudentRaw,
  createSession: createSessionRaw,
  updateSession: updateSessionRaw,
  createRegistration: createRegistrationRaw,
  updateRegistrationSeatsCheckedIn: updateRegistrationSeatsCheckedInRaw,
  createCheckin: createCheckinRaw,
  createAdjustment: createAdjustmentRaw,
};

// Bridges a public website course booking into the front-desk hours system:
// creates the matching session if the admin hasn't synced it yet, creates the
// student account if this is their first booking (remaining hours = one
// session's worth, since a public booking is "pay for this one class"), and
// registers them for that session — so front-desk check-in recognizes them.
export async function ensureEnrollmentInHours(params: {
  phone: string;
  name: string;
  sessionId: string;
  sessionIfMissing: Omit<HoursSession, "id" | "created_at">;
}): Promise<void> {
  if (!params.phone) return;
  return withHoursLock(async () => {
    const sessions = await readSessions();
    if (!sessions.some(s => s.id === params.sessionId)) {
      sessions.push({ ...params.sessionIfMissing, id: params.sessionId, created_at: nowIso() });
      await writeSessions(sessions);
    }

    const students = await readStudents();
    let student = students.find(s => s.phone === params.phone);
    if (!student) {
      student = {
        id: newId(), name: params.name, phone: params.phone, email: "",
        remaining_hours: params.sessionIfMissing.hours_per_checkin,
        purchased_hours: params.sessionIfMissing.hours_per_checkin,
        attended_count: 0, is_active: true, note: "網站報名自動建立",
        joined_at: new Date().toISOString().slice(0, 10), created_at: nowIso(),
      };
      students.push(student);
      await writeStudents(students);
    }

    const regs = await readRegistrations();
    if (!regs.some(r => r.student_id === student!.id && r.session_id === params.sessionId)) {
      regs.push({ id: newId(), student_id: student.id, session_id: params.sessionId, seats_total: 1, seats_checked_in: 0, created_at: nowIso() });
      await writeRegistrations(regs);
    }
  });
}

// ── Seed (one-time migration from Supabase export) ────────────────────────────
export async function seedAll(data: {
  students?: HoursStudent[];
  sessions?: HoursSession[];
  registrations?: HoursRegistration[];
  checkins?: HoursCheckin[];
  adjustments?: HoursAdjustment[];
}): Promise<void> {
  return withHoursLock(async () => {
    await Promise.all([
      data.students ? writeStudents(data.students) : Promise.resolve(),
      data.sessions ? writeSessions(data.sessions) : Promise.resolve(),
      data.registrations ? writeRegistrations(data.registrations) : Promise.resolve(),
      data.checkins ? writeCheckins(data.checkins) : Promise.resolve(),
      data.adjustments ? writeAdjustments(data.adjustments) : Promise.resolve(),
    ]);
  });
}

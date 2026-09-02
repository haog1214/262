import "dotenv/config";
import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  readCoursesFromSheet,
  writeCoursesToSheet,
  readSchedulesFromSheet,
  writeSchedulesToSheet,
  readEnrollmentsFromSheet,
  writeEnrollmentsToSheet,
  readRegistrationsFromSheet,
} from "./sheets.js";
import { sendEnrollmentNotification } from "./email.js";
import { isBot, getBotHtml } from "./botRenderer.js";
import { uploadImageToDrive, driveIsConfigured } from "./drive.js";
import * as hours from "./hoursSheets.js";
import type { HoursStudent } from "./hoursSheets.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD = "84204302";
const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

async function startServer() {
  const app = express();
  const server = createServer(app);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.use(express.json());

  // ── Courses API ──────────────────────────────────────────────────────────
  app.get("/api/courses", async (_req, res) => {
    try {
      const data = await readCoursesFromSheet();
      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("GET /api/courses error:", err);
      res.status(500).json({ error: "Failed to read courses", detail: msg });
    }
  });

  app.post("/api/courses", async (req, res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await writeCoursesToSheet(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/courses error:", err);
      res.status(500).json({ error: "Failed to write courses" });
    }
  });

  // ── Image upload ─────────────────────────────────────────────────────────
  app.post(
    "/api/upload-image",
    express.raw({ type: "*/*", limit: "10mb" }),
    async (req, res) => {
      if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const filename = String(req.query.filename ?? "");
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: "No file data" });
      }
      const ext = path.extname(filename).toLowerCase() || ".jpg";
      if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
        return res.status(400).json({ error: "Unsupported file type" });
      }
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      if (driveIsConfigured()) {
        try {
          const url = await uploadImageToDrive(req.body, safeName, ext);
          return res.json({ url });
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err);
          console.error("Drive upload failed:", err);
          return res.status(500).json({ error: `Failed to upload image to Drive: ${detail}` });
        }
      }
      fs.writeFileSync(path.join(UPLOADS_DIR, safeName), req.body);
      res.json({ url: `/uploads/${safeName}` });
    }
  );

  // ── Schedules API ────────────────────────────────────────────────────────
  app.get("/api/schedules", async (_req, res) => {
    try {
      const data = await readSchedulesFromSheet();
      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: "Failed to read schedules", detail: msg });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await writeSchedulesToSheet(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/schedules error:", err);
      res.status(500).json({ error: "Failed to write schedules" });
    }
  });

  // ── Enrollments API ───────────────────────────────────────────────────────
  app.get("/api/enrollments", async (req, res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const data = await readEnrollmentsFromSheet();
      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: "Failed to read enrollments", detail: msg });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await writeEnrollmentsToSheet(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/enrollments error:", err);
      res.status(500).json({ error: "Failed to write enrollments" });
    }
  });

  // ── Registrations (from Apps Script sheet) ───────────────────────────────
  app.get("/api/registrations", async (_req, res) => {
    try {
      const data = await readRegistrationsFromSheet();
      res.json(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("GET /api/registrations error:", err);
      res.status(500).json({ error: "Failed to read registrations", detail: msg });
    }
  });

  app.get("/api/registrations/debug", async (_req, res) => {
    const sheetId = process.env.REGISTRATION_SHEET_ID ?? process.env.GOOGLE_SHEETS_ID ?? "(not set)";
    const tab = process.env.REGISTRATION_SHEET_TAB ?? "工作表1";
    try {
      const data = await readRegistrationsFromSheet();
      res.json({ ok: true, sheetId, tab, count: data.length, sample: data.slice(0, 2) });
    } catch (err) {
      res.json({ ok: false, sheetId, tab, error: err instanceof Error ? err.message : String(err) });
    }
  });

  // ── Enrollment Notification ───────────────────────────────────────────────
  app.post("/api/notify-enrollment", async (req, res) => {
    try {
      await sendEnrollmentNotification(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/notify-enrollment error:", err);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // ── Hours system (學員時數) — Google Sheets backed ─────────────────────────
  const requireHoursAdmin = (req: express.Request, res: express.Response): boolean => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Unauthorized" });
      return false;
    }
    return true;
  };

  app.get("/api/hours/students", async (_req, res) => {
    try {
      res.json(await hours.readStudents());
    } catch (err) {
      res.status(500).json({ error: "Failed to read students", detail: String(err) });
    }
  });

  app.get("/api/hours/students/by-phone/:phone", async (req, res) => {
    try {
      const students = await hours.readStudents();
      const student = students.find(s => s.phone === req.params.phone) ?? null;
      res.json({ student });
    } catch (err) {
      res.status(500).json({ error: "Failed to look up student", detail: String(err) });
    }
  });

  // Public, unauthenticated self-service — matches the old Supabase setup where the
  // member portal wrote directly with an anon key. Defaults are forced server-side
  // so a self-registration can't hand itself free hours.
  app.post("/api/hours/students/self-register", async (req, res) => {
    try {
      const { name, phone } = req.body as { name: string; phone: string };
      const created = await hours.createStudent({
        name, phone,
        email: "", remaining_hours: 0, purchased_hours: 0, attended_count: 0,
        is_active: true, joined_at: new Date().toISOString().slice(0, 10),
        note: "學員自行於 App 註冊",
      });
      res.json(created);
    } catch (err) {
      res.status(500).json({ error: "Self-registration failed", detail: String(err) });
    }
  });

  // Public — only the name field is accepted, so this can't be used to touch hours.
  app.patch("/api/hours/students/self/:id", async (req, res) => {
    try {
      const { name } = req.body as { name: string };
      const updated = await hours.updateStudent(req.params.id, { name });
      if (!updated) return res.status(404).json({ error: "Student not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update name", detail: String(err) });
    }
  });

  app.patch("/api/hours/students/:id", async (req, res) => {
    if (!requireHoursAdmin(req, res)) return;
    try {
      const updated = await hours.updateStudent(req.params.id, req.body as Partial<HoursStudent>);
      if (!updated) return res.status(404).json({ error: "Student not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update student", detail: String(err) });
    }
  });

  app.get("/api/hours/sessions", async (_req, res) => {
    try {
      res.json(await hours.readSessions());
    } catch (err) {
      res.status(500).json({ error: "Failed to read sessions", detail: String(err) });
    }
  });

  app.get("/api/hours/sessions/lookup", async (req, res) => {
    try {
      const { name, date, start } = req.query as { name?: string; date?: string; start?: string };
      const sessions = await hours.readSessions();
      const match = sessions.find(s =>
        s.name === name && s.session_date === date && (!start || s.start_time === start)
      ) ?? null;
      res.json({ session: match });
    } catch (err) {
      res.status(500).json({ error: "Failed to look up session", detail: String(err) });
    }
  });

  app.post("/api/hours/sessions", async (req, res) => {
    if (!requireHoursAdmin(req, res)) return;
    try {
      const created = await hours.createSession(req.body);
      res.json(created);
    } catch (err) {
      res.status(500).json({ error: "Failed to create session", detail: String(err) });
    }
  });

  app.patch("/api/hours/sessions/:id", async (req, res) => {
    if (!requireHoursAdmin(req, res)) return;
    try {
      const updated = await hours.updateSession(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Session not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update session", detail: String(err) });
    }
  });

  app.get("/api/hours/registrations", async (_req, res) => {
    try {
      res.json(await hours.readRegistrations());
    } catch (err) {
      res.status(500).json({ error: "Failed to read registrations", detail: String(err) });
    }
  });

  app.get("/api/hours/checkins", async (_req, res) => {
    try {
      const [checkins, sessions] = await Promise.all([hours.readCheckins(), hours.readSessions()]);
      const sessionNameById = new Map(sessions.map(s => [s.id, s.name]));
      res.json(checkins.map(c => ({ ...c, session_name: sessionNameById.get(c.session_id) ?? "" })));
    } catch (err) {
      res.status(500).json({ error: "Failed to read checkins", detail: String(err) });
    }
  });

  app.get("/api/hours/adjustments", async (_req, res) => {
    try {
      res.json(await hours.readAdjustments());
    } catch (err) {
      res.status(500).json({ error: "Failed to read adjustments", detail: String(err) });
    }
  });

  // Atomic: front-desk QR / phone check-in against an existing registration.
  app.post("/api/hours/checkin/attempt", async (req, res) => {
    try {
      const { phone, sessionId, hours: need } = req.body as { phone: string; sessionId: string | null; hours: number };
      const result = await hours.withHoursLock(async () => {
        const students = await hours.readStudents();
        const student = students.find(s => s.phone === phone);
        if (!student) return { state: "notfound" as const };
        if (!sessionId) return { state: "notregistered" as const, student };

        const regs = await hours.readRegistrations();
        const reg = regs.find(r => r.student_id === student.id && r.session_id === sessionId);
        if (!reg) return { state: "notregistered" as const, student };
        if (reg.seats_checked_in >= reg.seats_total) return { state: "duplicate" as const, student, reg };
        if (Number(student.remaining_hours) < Number(need)) return { state: "insufficient" as const, student };

        const after = Math.max(0, Number(student.remaining_hours) - Number(need));
        const [updatedStudent] = await Promise.all([
          hours.raw.updateStudent(student.id, { remaining_hours: after, attended_count: Number(student.attended_count) + 1 }),
          hours.raw.updateRegistrationSeatsCheckedIn(reg.id, reg.seats_checked_in + 1),
          hours.raw.createCheckin({ student_id: student.id, session_id: sessionId, phone_used: phone, result: "success", hours_deducted: Number(need) }),
        ]);
        return { state: "success" as const, student: updatedStudent };
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Check-in failed", detail: String(err) });
    }
  });

  // Atomic: register an already-known student into a session on the spot, then check them in.
  app.post("/api/hours/checkin/register-existing", async (req, res) => {
    try {
      const { studentId, sessionId, phoneUsed, hours: need } = req.body as {
        studentId: string; sessionId: string; phoneUsed: string; hours: number;
      };
      const result = await hours.withHoursLock(async () => {
        const students = await hours.readStudents();
        const student = students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");
        if (Number(student.remaining_hours) < Number(need)) {
          return { ok: false as const, reason: "insufficient", student };
        }
        const after = Math.max(0, Number(student.remaining_hours) - Number(need));
        await hours.raw.createRegistration({ student_id: studentId, session_id: sessionId, seats_total: 1, seats_checked_in: 1 });
        await hours.raw.createCheckin({ student_id: studentId, session_id: sessionId, phone_used: phoneUsed, result: "success", hours_deducted: Number(need) });
        const updatedStudent = await hours.raw.updateStudent(studentId, { remaining_hours: after, attended_count: Number(student.attended_count) + 1 });
        return { ok: true as const, student: updatedStudent };
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Registration failed", detail: String(err) });
    }
  });

  // Atomic: brand-new walk-in account, optionally checked into a session right away.
  app.post("/api/hours/checkin/register-new", async (req, res) => {
    try {
      const { name, phone, hours: need, note, sessionId, planLabel, payment } = req.body as {
        name: string; phone: string; hours: number; note?: string;
        sessionId?: string | null; planLabel?: string; payment?: string;
      };
      const result = await hours.withHoursLock(async () => {
        const student = await hours.raw.createStudent({
          name, phone,
          email: "", purchased_hours: Number(need), remaining_hours: 0, attended_count: 1,
          is_active: true, joined_at: new Date().toISOString().slice(0, 10),
          note: note ?? `現場報名・${planLabel ?? ""}・付款方式：${payment ?? ""}`,
        });
        await hours.raw.createAdjustment({
          student_id: student.id, amount: Number(need), reason: "現場報名購買時數",
          note: `${planLabel ?? ""}・${payment ?? ""}`, operator: "管理員",
        });
        if (sessionId) {
          await hours.raw.createCheckin({ student_id: student.id, session_id: sessionId, phone_used: phone, result: "success", hours_deducted: Number(need) });
          await hours.raw.createRegistration({ student_id: student.id, session_id: sessionId, seats_total: 1, seats_checked_in: 1 });
        }
        return student;
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Walk-in registration failed", detail: String(err) });
    }
  });

  // Atomic: manual hour adjustment (top-up or deduction) by an operator.
  app.post("/api/hours/adjustments", async (req, res) => {
    if (!requireHoursAdmin(req, res)) return;
    try {
      const { studentId, amount, reason, note, operator } = req.body as {
        studentId: string; amount: number; reason: string; note?: string; operator?: string;
      };
      const result = await hours.withHoursLock(async () => {
        const students = await hours.readStudents();
        const student = students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");
        const after = Math.max(0, Number(student.remaining_hours) + Number(amount));
        await hours.raw.createAdjustment({ student_id: studentId, amount: Number(amount), reason, note: note ?? "", operator: operator ?? "管理員" });
        return hours.raw.updateStudent(studentId, { remaining_hours: after });
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Adjustment failed", detail: String(err) });
    }
  });

  // One-time migration seed from the old Supabase data — safe to call again (overwrites tabs).
  app.post("/api/hours/_seed", async (req, res) => {
    if (!requireHoursAdmin(req, res)) return;
    try {
      await hours.seedAll(req.body);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Seed failed", detail: String(err) });
    }
  });

  // ── Static files ─────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    const ua = req.headers["user-agent"] ?? "";
    if (isBot(ua)) {
      return res.send(getBotHtml(req.path));
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3001);
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

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
          console.error("Drive upload failed:", err);
          return res.status(500).json({ error: "Failed to upload image to Drive" });
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

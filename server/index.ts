import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  readCoursesFromSheet,
  writeCoursesToSheet,
  readSchedulesFromSheet,
  writeSchedulesToSheet,
  readEnrollmentsFromSheet,
  writeEnrollmentsToSheet,
} from "./sheets.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD = "262@Admin";

async function startServer() {
  const app = express();
  const server = createServer(app);

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

  // ── Static files ─────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

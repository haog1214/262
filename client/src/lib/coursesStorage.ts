import { CoursesConfig, defaultCoursesConfig } from "@/data/defaultCourses";

const STORAGE_KEY = "262_courses_config";

// ── localStorage helpers ─────────────────────────────────────────────────────
export function getLocalCoursesConfig(): CoursesConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CoursesConfig;
  } catch {
    // ignore
  }
  return defaultCoursesConfig;
}

function setLocalCoursesConfig(config: CoursesConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetCoursesConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportCoursesConfig(): string {
  return JSON.stringify(getLocalCoursesConfig(), null, 2);
}

export function importCoursesConfig(json: string): boolean {
  try {
    const config = JSON.parse(json) as CoursesConfig;
    if (!config.courses || !Array.isArray(config.courses)) return false;
    setLocalCoursesConfig(config);
    return true;
  } catch {
    return false;
  }
}

// ── API helpers ──────────────────────────────────────────────────────────────
export async function fetchCoursesFromAPI(): Promise<CoursesConfig | null> {
  try {
    const res = await fetch("/api/courses");
    if (!res.ok) return null;
    const data = await res.json() as CoursesConfig;
    setLocalCoursesConfig(data);
    return data;
  } catch {
    return null;
  }
}

export async function saveCoursesToAPI(
  config: CoursesConfig
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "262@Admin",
      },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string };
      return { ok: false, error: body.error ?? `HTTP ${res.status}` };
    }
    setLocalCoursesConfig(config);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Combined get (API first, localStorage fallback) ──────────────────────────
export async function getCoursesConfig(): Promise<CoursesConfig> {
  const apiData = await fetchCoursesFromAPI();
  return apiData ?? getLocalCoursesConfig();
}

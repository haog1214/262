import { CoursesConfig, defaultCoursesConfig } from "@/data/defaultCourses";

const STORAGE_KEY = "262_courses_config";

export function getCoursesConfig(): CoursesConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CoursesConfig;
  } catch {
    // ignore parse errors
  }
  return defaultCoursesConfig;
}

export function saveCoursesConfig(config: CoursesConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetCoursesConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportCoursesConfig(): string {
  return JSON.stringify(getCoursesConfig(), null, 2);
}

export function importCoursesConfig(json: string): boolean {
  try {
    const config = JSON.parse(json) as CoursesConfig;
    if (!config.courses || !Array.isArray(config.courses)) return false;
    saveCoursesConfig(config);
    return true;
  } catch {
    return false;
  }
}

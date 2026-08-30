const ADMIN_HEADERS = {
  "Content-Type": "application/json",
  "x-admin-password": "84204302",
};

export interface Schedule {
  id: string;
  courseId: string;
  date: string;
  time: string;
  maxCapacity: string;
  status: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  scheduleId: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export async function fetchSchedules(): Promise<Schedule[]> {
  try {
    const res = await fetch("/api/schedules");
    if (!res.ok) return [];
    return (await res.json()) as Schedule[];
  } catch {
    return [];
  }
}

export async function saveSchedules(
  schedules: Schedule[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: ADMIN_HEADERS,
      body: JSON.stringify(schedules),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: body.error ?? `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function fetchEnrollments(): Promise<Enrollment[]> {
  try {
    const res = await fetch("/api/enrollments", {
      headers: { "x-admin-password": "84204302" },
    });
    if (!res.ok) return [];
    return (await res.json()) as Enrollment[];
  } catch {
    return [];
  }
}

export interface Registration {
  timestamp: string;
  course: string;
  sessionDate: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  taxId: string;
  referral: string;
  notes: string;
}

export async function fetchRegistrations(): Promise<Registration[]> {
  try {
    const res = await fetch("/api/registrations");
    if (!res.ok) return [];
    return (await res.json()) as Registration[];
  } catch {
    return [];
  }
}

export async function saveEnrollments(
  enrollments: Enrollment[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: ADMIN_HEADERS,
      body: JSON.stringify(enrollments),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: body.error ?? `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

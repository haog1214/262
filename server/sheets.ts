import { google } from "googleapis";

export interface Course {
  id: number;
  courseCode?: string;
  title: string;
  description: string;
  tools: string;
  originalPrice: string;
  discountPrice: string;
  badge: string;
  badgeColor: string;
  location?: string;
  outline?: { title: string; description: string }[];
  targetAudience?: string;
  backgroundImage: string;
  detailPath: string;
  status: string;
  published: boolean;
}

export interface CoursesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  courses: Course[];
}

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

const COURSE_HEADERS: (keyof Course)[] = [
  "id", "courseCode", "title", "description", "tools",
  "originalPrice", "discountPrice", "badge", "badgeColor", "location",
  "outline", "targetAudience",
  "backgroundImage", "detailPath", "status", "published",
];

const SCHEDULE_HEADERS: (keyof Schedule)[] = [
  "id", "courseId", "date", "time", "maxCapacity", "status",
];

const ENROLLMENT_HEADERS: (keyof Enrollment)[] = [
  "id", "courseId", "scheduleId", "name", "phone", "email", "notes",
];

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
        requestBody: {
          requests: [{ addSheet: { properties: { title: tabName } } }],
        },
      });
    }
  } catch {
    // ignore — write will surface the real error
  }
}

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

export async function readCoursesFromSheet(): Promise<CoursesConfig> {
  const { sheets, sheetId } = getSheets();

  const [metaRes, coursesRes] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "meta!A:B" }),
    sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "courses!A:P" }),
  ]);

  const meta: Record<string, string> = {};
  for (const row of metaRes.data.values ?? []) {
    if (row[0]) meta[row[0]] = row[1] ?? "";
  }

  const [headers, ...dataRows] = coursesRes.data.values ?? [];
  const courses: Course[] = (dataRows ?? [])
    .filter(row => row.some(Boolean))
    .map(row => {
      const obj: Record<string, string> = {};
      (headers ?? COURSE_HEADERS).forEach((h: string, i: number) => {
        obj[h] = row[i] ?? "";
      });
      let outline: { title: string; description: string }[] = [];
      try {
        outline = obj.outline ? JSON.parse(obj.outline) : [];
      } catch {
        outline = [];
      }
      return {
        ...obj,
        id: Number(obj.id),
        status: (obj.status as "open" | "full") || "open",
        published: obj.published === "true",
        outline,
      } as unknown as Course;
    });

  return {
    sectionTitle: meta["sectionTitle"] ?? "精選課程",
    sectionSubtitle: meta["sectionSubtitle"] ?? "選擇適合你的課程，用 AI 提升工作效率",
    courses,
  };
}

export async function writeCoursesToSheet(config: CoursesConfig): Promise<void> {
  const { sheets, sheetId } = getSheets();

  const metaValues = [
    ["sectionTitle", config.sectionTitle],
    ["sectionSubtitle", config.sectionSubtitle],
  ];

  const courseRows = [
    COURSE_HEADERS,
    ...config.courses.map(c => COURSE_HEADERS.map(h =>
      h === "outline" ? JSON.stringify(c.outline ?? []) : String(c[h] ?? "")
    )),
  ];

  await Promise.all([
    sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "meta!A1",
      valueInputOption: "RAW",
      requestBody: { values: metaValues },
    }),
    sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: "courses!A:Z" }).then(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "courses!A1",
        valueInputOption: "RAW",
        requestBody: { values: courseRows },
      })
    ),
  ]);
}

export async function readSchedulesFromSheet(): Promise<Schedule[]> {
  const { sheets, sheetId } = getSheets();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "schedules!A:F",
    });
    const [headers, ...dataRows] = res.data.values ?? [];
    if (!dataRows?.length) return [];
    return dataRows
      .filter(row => row.some(Boolean))
      .map(row => {
        const obj: Record<string, string> = {};
        (headers ?? SCHEDULE_HEADERS).forEach((h: string, i: number) => {
          obj[h] = row[i] ?? "";
        });
        return obj as unknown as Schedule;
      });
  } catch {
    return [];
  }
}

export async function writeSchedulesToSheet(schedules: Schedule[]): Promise<void> {
  const { sheets, sheetId } = getSheets();
  await ensureTab(sheets, sheetId, "schedules");
  const rows = [
    SCHEDULE_HEADERS,
    ...schedules.map(s => SCHEDULE_HEADERS.map(h => String(s[h] ?? ""))),
  ];
  await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: "schedules!A:Z" });
  if (rows.length > 1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "schedules!A1",
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });
  }
}

export async function readEnrollmentsFromSheet(): Promise<Enrollment[]> {
  const { sheets, sheetId } = getSheets();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "enrollments!A:G",
    });
    const [headers, ...dataRows] = res.data.values ?? [];
    if (!dataRows?.length) return [];
    return dataRows
      .filter(row => row.some(Boolean))
      .map(row => {
        const obj: Record<string, string> = {};
        (headers ?? ENROLLMENT_HEADERS).forEach((h: string, i: number) => {
          obj[h] = row[i] ?? "";
        });
        return obj as unknown as Enrollment;
      });
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

export async function readRegistrationsFromSheet(): Promise<Registration[]> {
  const { sheets, sheetId: defaultSheetId } = getSheets();
  // Support a separate Google Sheet for Apps Script registrations
  const sheetId = process.env.REGISTRATION_SHEET_ID ?? defaultSheetId;
  const tab = process.env.REGISTRATION_SHEET_TAB ?? "工作表1";
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tab}!A:J`,
    });
    const rows = res.data.values ?? [];
    // Find the header row by looking for "姓名" or "課程名稱"
    let headerIdx = rows.findIndex(r => r.some((c: string) => c === "姓名" || c === "課程名稱"));
    if (headerIdx === -1) headerIdx = 0;
    const dataRows = rows.slice(headerIdx + 1);
    return dataRows
      .filter(row => row.some(Boolean))
      .map(row => ({
        timestamp:   row[0] ?? "",
        course:      row[1] ?? "",
        sessionDate: row[2] ?? "",
        name:        row[3] ?? "",
        phone:       row[4] ?? "",
        email:       row[5] ?? "",
        company:     row[6] ?? "",
        taxId:       row[7] ?? "",
        referral:    row[8] ?? "",
        notes:       row[9] ?? "",
      }));
  } catch {
    return [];
  }
}

export async function writeEnrollmentsToSheet(enrollments: Enrollment[]): Promise<void> {
  const { sheets, sheetId } = getSheets();
  await ensureTab(sheets, sheetId, "enrollments");
  const rows = [
    ENROLLMENT_HEADERS,
    ...enrollments.map(e => ENROLLMENT_HEADERS.map(h => String(e[h] ?? ""))),
  ];
  await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range: "enrollments!A:Z" });
  if (rows.length > 1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "enrollments!A1",
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });
  }
}

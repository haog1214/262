import { google } from "googleapis";

export interface Course {
  id: number;
  title: string;
  description: string;
  tools: string;
  originalPrice: string;
  discountPrice: string;
  badge: string;
  badgeColor: string;
  backgroundImage: string;
  detailPath: string;
}

export interface CoursesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  courses: Course[];
}

const COURSE_HEADERS: (keyof Course)[] = [
  "id", "title", "description", "tools",
  "originalPrice", "discountPrice", "badge", "badgeColor",
  "backgroundImage", "detailPath",
];

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
    sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "courses!A:J" }),
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
      return { ...obj, id: Number(obj.id) } as unknown as Course;
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
    ...config.courses.map(c => COURSE_HEADERS.map(h => String(c[h] ?? ""))),
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

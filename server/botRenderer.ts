const BASE_URL = "https://www.262.yc311.com.tw";
const SITE_NAME = "傳啓資訊";
const DEFAULT_DESC = "台中 AI 實戰課程平台，提供 Gemini、AI 知識管理、AI 短影音、AI 生活應用、AI 簡報等課程，幫助你用 AI 提升工作效率。";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

interface PageMeta {
  title: string;
  description: string;
  image?: string;
}

const routeMeta: Record<string, PageMeta> = {
  "/": {
    title: `${SITE_NAME} | 台中 AI 實戰課程`,
    description: DEFAULT_DESC,
    image: DEFAULT_IMAGE,
  },
  "/course/gemini": {
    title: `讓你的 Gemini 再進化｜Google AI 全方位實戰應用 | ${SITE_NAME}`,
    description: "從 Gemini 基礎到進階應用，整合 Google 生態系、多媒體創作、NotebookLM 深度閱讀，打造個人 AI 工作流程。台中 AI 課程，立即報名。",
    image: `${BASE_URL}/${encodeURIComponent("讓你的Gemini再進化.jpg")}`,
  },
  "/course/ai-knowledge": {
    title: `資料太多都用不起來？AI 知識管理實戰課 | ${SITE_NAME}`,
    description: "用 AI 整理海量資料、建立知識庫、提升資訊處理效率。學會 NotebookLM、AI 摘要、知識圖譜等實戰技巧。台中 AI 課程，立即報名。",
    image: `${BASE_URL}/${encodeURIComponent("資料太多都用不起來.jpg")}`,
  },
  "/course/ai-video": {
    title: `零基礎也能做專業短片｜AI 短影音製作課 | ${SITE_NAME}`,
    description: "不需要拍攝設備，用 AI 工具製作吸睛短影音。學習腳本生成、AI 配音、字幕、剪輯一條龍，快速產出高品質內容。",
    image: `${BASE_URL}/${encodeURIComponent("零基礎也能做專業短片.jpg")}`,
  },
  "/course/ai-life": {
    title: `讓手機搞定大小事｜AI 生活應用實戰課 | ${SITE_NAME}`,
    description: "用 AI 讓手機成為你的萬能助手，學會語音指令、行程管理、智慧搜尋、自動化任務，讓 AI 幫你省時省力。",
    image: `${BASE_URL}/${encodeURIComponent("讓手機搞定大小事-2.jpg")}`,
  },
  "/course/ai-presentation": {
    title: `提升簡報的精美度｜AI 簡報製作實戰課 | ${SITE_NAME}`,
    description: "用 AI 打造高質感簡報，學習 AI 自動生成大綱、設計排版、配色建議，讓你的簡報脫穎而出。台中 AI 課程。",
    image: `${BASE_URL}/${encodeURIComponent("提升簡報的精美度.jpg")}`,
  },
  "/schedule": {
    title: `開課日期 | ${SITE_NAME}`,
    description: "傳啓資訊最新開課時間表，包含 Gemini、AI 知識管理、AI 短影音、AI 生活應用、AI 簡報等課程場次，台中西屯區實體小班教學。",
  },
  "/instructor": {
    title: `講師介紹 | ${SITE_NAME}`,
    description: "認識 傳啓資訊的 AI 課程講師，具備企業培訓、AI 工具應用、商業思維等豐富實戰經驗，帶你學以致用。",
    image: `${BASE_URL}/instructor-hao.jpg`,
  },
  "/faq": {
    title: `常見問題 FAQ | ${SITE_NAME}`,
    description: "傳啓資訊常見問題解答：上課設備需求、課程內容、報名流程、付款方式、退費政策、企業包班等，一次查清楚。",
  },
  "/about": {
    title: `關於我們 | ${SITE_NAME}`,
    description: "傳啓資訊致力於 AI 工具應用、數位行銷、企業內訓等培訓。台中西屯區，小班制實體課程。",
  },
  "/enroll": {
    title: `立即報名 | ${SITE_NAME}`,
    description: "立即報名 傳啓資訊 AI 實戰課程，Gemini、AI 短影音、AI 簡報、AI 生活應用等小班課程，台中西屯區實體上課。",
  },
};

const BOT_PATTERNS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  // NOTE: "line/" is intentionally NOT here — it matches LINE WebView's real user agent
  // (e.g. "...Line/14.1.0") and would serve bot HTML to actual LINE app users.
  // LINE link previews are handled by "facebookexternalhit" which LINE also sends for scraping.
  "linespider",      // LINE's dedicated crawler bot
  "googlebot",
  "bingbot",
  "duckduckbot",
  "applebot",
  "discordbot",
  "skypeuripreview",
  "pinterest",
  "crawler",
  "spider",
  "bot/",
];

export function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((p) => ua.includes(p));
}

export function getBotHtml(pathname: string): string {
  const meta = routeMeta[pathname] ?? {
    title: `${SITE_NAME} | 台中 AI 實戰課程`,
    description: DEFAULT_DESC,
    image: DEFAULT_IMAGE,
  };
  const image = meta.image ?? DEFAULT_IMAGE;
  const url = `${BASE_URL}${pathname}`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="zh_TW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  <p><a href="${BASE_URL}/enroll">立即報名</a></p>
  <p><a href="${BASE_URL}">回到首頁</a></p>
</body>
</html>`;
}

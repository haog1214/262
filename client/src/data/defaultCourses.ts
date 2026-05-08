export type BadgeColor = "pink" | "purple" | "green" | "gold" | "teal";

export interface Course {
  id: number;
  title: string;
  description: string;
  tools: string;
  originalPrice: string;
  discountPrice: string;
  badge: string;
  badgeColor: BadgeColor;
  backgroundImage: string;
  detailPath: string;
  status: "open" | "full";
}

export interface CoursesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  courses: Course[];
}

export const defaultCoursesConfig: CoursesConfig = {
  sectionTitle: "精選課程",
  sectionSubtitle: "選擇適合你的課程，用 AI 提升工作效率",
  courses: [
    {
      id: 1,
      title: "零基礎也能做專業短片",
      description:
        "本課程專為追求高效創作的學員設計，採用「全流程 AI 協作」模式。教學內容涵蓋從故事腳本構思、Banana AI 高質感繪圖、靜態圖片動態化，到最終的 AI 配音與剪輯合成。學員將在三小時內掌握 AI 影音創作的核心邏輯，並能獨立產出具專業水準的短影音內容。",
      tools: "從腳本到成品一次完成",
      originalPrice: "NT$ 6,000",
      discountPrice: "NT$ 4,000",
      badge: "6H特訓班",
      badgeColor: "pink",
      backgroundImage: "/零基礎也能做專業短片.jpg",
      detailPath: "/course/ai-video",
      status: "open",
    },
    {
      id: 2,
      title: "讓手機搞定大小事",
      description:
        "本課程專為科技小白與長輩朋友設計，採「漸進式」教學。從基礎的 ChatGPT、Gemini 安裝設定出發，學習精準提問技巧，再深入 Google 生態系整合，最後動手體驗 Banana AI 繪圖與影像動態化，讓一支手機成為你最強大的 AI 工具。",
      tools: "學會手機 AI 工具應用，搞定生活大小事",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      badge: "3H特訓班",
      badgeColor: "green",
      backgroundImage: "/讓手機搞定大小事-2.jpg",
      detailPath: "/course/ai-life",
      status: "open",
    },
    {
      id: 3,
      title: "Gemini讓工作快一倍",
      description:
        "本課程帶你掌握 Gemini 的核心功能，從基礎模型認知出發，深度對接 Google 工作術（郵件、文件、行事曆、地圖），進階解鎖 Nano Banana 影像藝術與 Veo 影片生成，最後透過自定義 Gem 打造個人化 AI 專家系統。",
      tools: "打造你的AI工作助手",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      badge: "3H特訓班",
      badgeColor: "gold",
      backgroundImage: "/讓你的Gemini再進化.jpg",
      detailPath: "/course/gemini",
      status: "open",
    },
    {
      id: 4,
      title: "資料太多卻用不起來",
      description:
        "本課程分為「核心觀念」、「核心操作」與「場景實戰」三大模組。透過 Google NotebookLM 這個 AI 知識管理神器，帶你從零基礎到能獨立建構專屬知識庫，讓海量的 PDF、網頁與筆記真正為你所用。",
      tools: "用AI整理PDF與筆記打造知識庫",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      badge: "3H特訓班",
      badgeColor: "purple",
      backgroundImage: "/資料太多都用不起來.jpg",
      detailPath: "/course/ai-knowledge",
      status: "open",
    },
    {
      id: 5,
      title: "簡報不用做到半夜",
      description:
        "本課程專為追求效率的職場人士設計，透過「邏輯構思、內容生成、自動排版」三大關鍵步驟，將原本需要數天的簡報製作時間縮短至 3 小時內。結合 ChatGPT × Gemini × Gamma 三大 AI 工具，不只教工具，更教你建立「AI 協作思維」。",
      tools: "AI幫你完成內容與排版",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      badge: "3H特訓班",
      badgeColor: "teal",
      backgroundImage: "/提升簡報的精美度.jpg",
      detailPath: "/course/ai-presentation",
      status: "open",
    },
  ],
};

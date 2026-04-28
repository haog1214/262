import CourseCard from "./CourseCard";

/**
 * Courses Section Component - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：三欄+二欄網格、充分空間、視覺層級清晰
 */
export default function CoursesSection() {
  const courses = [
    {
      id: 1,
      title: "零基礎也能做專業短片",
      description:
        "本課程專為追求高效創作的學員設計，採用「全流程 AI 協作」模式。教學內容涵蓋從故事腳本構思、Banana AI 高質感繪圖、靜態圖片動態化，到最終的 AI 配音與剪輯合成。學員將在三小時內掌握 AI 影音創作的核心邏輯，並能獨立產出具專業水準的短影音內容。",
      tools: "從腳本到成品一次完成",
      originalPrice: "NT$ 6,000",
      discountPrice: "NT$ 4,000",
      instructorImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      instructorName: "",
      badge: "6H特訓班",
      badgeColor: "pink" as const,
      backgroundImage:
        "/課程海報_工作區域1.webp",
      detailPath: "/course/ai-video",
    },
    {
      id: 2,
      title: "讓AI幫你省時間",
      description:
        "本課程專為科技小白與長輩朋友設計，採「漸進式」教學。從基礎的 ChatGPT、Gemini 安裝設定出發，學習精準提問技巧，再深入 Google 生態系整合，最後動手體驗 Banana AI 繪圖與影像動態化，讓一支手機成為你最強大的 AI 工具。",
      tools: "學會手機 AI 工具應用，掌定生活大小事",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      instructorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      instructorName: "",
      badge: "3H特訓班",
      badgeColor: "green" as const,
      backgroundImage:
        "/課程海報_工作區域1複本.webp",
      detailPath: "/course/ai-life",
    },
    {
      id: 3,
      title: "讓你的Gemini再進化",
      description:
        "本課程帶你掌握 Gemini 的核心功能，從基礎模型認知出發，深度對接 Google 工作術（郵件、文件、行事曆、地圖），進階解鎖 Nano Banana 影像藝術與 Veo 影片生成，最後透過自定義 Gem 打造個人化 AI 專家系統。",
      tools: "打造專屬 Gemini 工作系統",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      instructorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      instructorName: "",
      badge: "3H特訓班",
      badgeColor: "gold" as const,
      backgroundImage:
        "/課程海報_工作區域1複本4.webp",
      detailPath: "/course/gemini",
    },
    {
      id: 4,
      title: "資料太多都用不起來",
      description:
        "本課程分為「核心觀念」、「核心操作」與「場景實戰」三大模組。透過 Google NotebookLM 這個 AI 知識管理神器，帶你從零基礎到能獨立建構專屬知識庫，讓海量的 PDF、網頁與筆記真正為你所用。",
      tools: "用 AI 整理 PDF 與筆記，打造知識庫",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      instructorImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      instructorName: "",
      badge: "3H特訓班",
      badgeColor: "purple" as const,
      backgroundImage:
        "/課程海報_工作區域1複本2.webp",
      detailPath: "/course/ai-knowledge",
    },
    {
      id: 5,
      title: "提升簡報的精美度",
      description:
        "本課程專為追求效率的職場人士設計，透過「邏輯構思、內容生成、自動排版」三大關鍵步驟，將原本需要數天的簡報製作時間縮短至 3 小時內。結合 ChatGPT × Gemini × Gamma 三大 AI 工具，不只教工具，更教你建立「AI 協作思維」。",
      tools: "AI 幫你完成專業簡報",
      originalPrice: "NT$ 4,000",
      discountPrice: "NT$ 2,000",
      instructorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      instructorName: "",
      badge: "3H特訓班",
      badgeColor: "teal" as const,
      backgroundImage:
        "/課程海報_工作區域1複本3.webp",
      detailPath: "/course/ai-presentation",
    },
  ];

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="container">
        {/* 區域標題 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            精選課程
          </h2>
          <p className="text-lg text-foreground/60">
            選擇適合你的課程，用 AI 提升工作效率
          </p>
        </div>

        {/* 第一排：3個課程 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="animate-fade-in">
              <CourseCard {...course} />
            </div>
          ))}
        </div>

        {/* 第二排：2個課程 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.slice(3, 5).map((course) => (
            <div key={course.id} className="animate-fade-in">
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

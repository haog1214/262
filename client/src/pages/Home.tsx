import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import InstructorSection from "@/components/InstructorSection";
import PreparationSection from "@/components/PreparationSection";
import Footer from "@/components/Footer";

/**
 * Home Page - 262學院
 * 設計系統：現代漸層活力風格
 * 特點：完整課程展示、清晰信息流、視覺吸引力
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CoursesSection />
        <InstructorSection />
        <PreparationSection />
        {/* Google Map */}
        <div className="w-full">
          <div className="flex items-center gap-3 px-6 py-4" style={{ background: "#1B3A6B" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="font-bold text-white text-sm">上課地點</span>
            <a
              href="https://maps.app.goo.gl/xXbkG9SETJ4N21Do7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: "#D4AF37" }}
            >
              台中市西屯區河南路二段262號7樓3 →
            </a>
          </div>
          <iframe
            title="262培訓學院地圖"
            src="https://maps.google.com/maps?q=台中市西屯區河南路二段262號7樓3&output=embed&hl=zh-TW&z=17"
            width="100%"
            height="400"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

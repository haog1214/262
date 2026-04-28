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
      </main>
      <Footer />
    </div>
  );
}

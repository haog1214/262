import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import InstructorSection from "@/components/InstructorSection";
import PreparationSection from "@/components/PreparationSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "262學習基地",
  alternateName: "262Academy",
  url: "https://www.262.yc311.com.tw",
  logo: "https://www.262.yc311.com.tw/logo.png",
  description: "台中 AI 實戰課程平台，提供 Gemini、AI 知識管理、AI 短影音、AI 生活應用、AI 簡報等課程。",
  address: {
    "@type": "PostalAddress",
    streetAddress: "河南路二段262號7樓3",
    addressLocality: "西屯區",
    addressRegion: "台中市",
    addressCountry: "TW",
  },
  sameAs: ["https://www.facebook.com/262academy"],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "262學習基地",
  image: "https://www.262.yc311.com.tw/logo.png",
  url: "https://www.262.yc311.com.tw",
  address: {
    "@type": "PostalAddress",
    streetAddress: "河南路二段262號7樓3",
    addressLocality: "西屯區",
    addressRegion: "台中市",
    postalCode: "407",
    addressCountry: "TW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.1625,
    longitude: 120.6491,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        url="https://www.262.yc311.com.tw/"
        schema={[organizationSchema, localBusinessSchema]}
      />
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

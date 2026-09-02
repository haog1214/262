import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CourseVideoDetail from "./pages/CourseVideoDetail";
import CourseLifeDetail from "./pages/CourseLifeDetail";
import CourseKnowledgeDetail from "./pages/CourseKnowledgeDetail";
import CoursePresentationDetail from "./pages/CoursePresentationDetail";
import CourseGeminiDetail from "./pages/CourseGeminiDetail";
import EnrollPage from "./pages/EnrollPage";
import InstructorPage from "./pages/InstructorPage";
import SchedulePage from "./pages/SchedulePage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import UploadCoursePage from "./pages/UploadCoursePage";
import CourseDetailPage from "./pages/CourseDetailPage";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path={"/"} component={Home} />
<Route path={"/course/ai-video"} component={CourseVideoDetail} />
      <Route path={"/course/ai-life"} component={CourseLifeDetail} />
      <Route path={"/course/ai-knowledge"} component={CourseKnowledgeDetail} />
      <Route path={"/course/ai-presentation"} component={CoursePresentationDetail} />
      <Route path={"/course/gemini"} component={CourseGeminiDetail} />
      <Route path={"/enroll"} component={EnrollPage} />
      <Route path={"/instructor"} component={InstructorPage} />
      <Route path={"/schedule"} component={SchedulePage} />
      <Route path={"/faq"} component={FaqPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/manage-courses-262x"} component={AdminCoursesPage} />
      <Route path={"/upload-course-262x"} component={UploadCoursePage} />
      <Route path={"/course/:id"} component={CourseDetailPage} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

const btnStyle = (bg: string): React.CSSProperties => ({
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  backgroundColor: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  flexShrink: 0,
  transition: "transform 0.18s, opacity 0.18s",
});

function FloatingButtons() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* 會員選課 — mobile only, vertical text */}
      <a
        href="https://claude.ai/code/artifact/c9ea5aae-00c0-4212-b1a2-540d866a775f"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="會員選課"
        className="md:hidden flex items-center justify-center"
        style={{
          writingMode: "vertical-rl",
          backgroundColor: "#F37021",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "3px",
          width: "52px",
          padding: "10px 0",
          borderRadius: "12px",
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}
      >
        會員選課
      </a>

      {/* Gear group: hover on this area toggles social buttons */}
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Social buttons — expand upward on gear hover */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            overflow: "hidden",
            maxHeight: open ? "200px" : "0",
            opacity: open ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}
        >
          {/* Facebook */}
          <a
            href="https://www.facebook.com/262academy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            style={btnStyle("#1877F2")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </a>

          {/* Messenger */}
          <a
            href="https://m.me/1122858144238118"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
            style={btnStyle("#0084FF")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.56 6.963z"/>
            </svg>
          </a>

          {/* LINE */}
          <a
            href="https://lin.ee/tQIR0bi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LINE"
            style={btnStyle("#06C755")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.815 4.270 8.848 10.036 9.608.391.084.923.258 1.058.593.121.303.079.778.039 1.085l-.171 1.028c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.176 14.393 24 12.458 24 10.304zm-18.988 2.62a.235.235 0 01-.234.235H1.898a.235.235 0 01-.233-.235v-4.13a.235.235 0 01.233-.235h.489a.235.235 0 01.234.235v3.406h1.958a.235.235 0 01.234.235zm1.646 0a.235.235 0 01-.234.235h-.489a.235.235 0 01-.234-.235v-4.13a.235.235 0 01.234-.235h.489a.235.235 0 01.234.235zm4.847 0a.235.235 0 01-.234.235h-.488a.244.244 0 01-.19-.096l-1.893-2.557v2.418a.235.235 0 01-.234.235h-.489a.235.235 0 01-.234-.235v-4.13a.235.235 0 01.234-.235h.483c.001 0 .001 0 .003.001l.005.001.005.002.004.002.005.003.004.003.004.003.004.004.003.004.004.004.003.004 1.899 2.565V8.795a.235.235 0 01.233-.235h.489a.235.235 0 01.234.235zm3.85-3.66a.235.235 0 01-.234.235h-1.958v.698h1.958a.235.235 0 01.234.235v.489a.235.235 0 01-.234.234h-1.958v.699h1.958a.235.235 0 01.234.234v.489a.235.235 0 01-.234.235h-2.681a.235.235 0 01-.234-.235v-4.13a.235.235 0 01.233-.234h2.682a.235.235 0 01.234.234z"/>
            </svg>
          </a>
        </div>

        {/* Gear trigger */}
        <button
          aria-label="社群連結"
          style={{
            ...btnStyle("#6B7280"),
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            transition: "transform 0.3s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Scroll to top — separate from gear hover zone */}
      <button
        aria-label="回到頂部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          ...btnStyle("#374151"),
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider
          defaultTheme="light"
        >
          <TooltipProvider>
            <Toaster />
            <Router />
            <FloatingButtons />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

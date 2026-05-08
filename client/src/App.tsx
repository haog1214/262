import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
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

function FacebookButton() {
  return (
    <a
      href="https://www.facebook.com/262academy"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#1877F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(24,119,242,0.4)",
        zIndex: 9999,
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(24,119,242,0.55)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(24,119,242,0.4)";
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    </a>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FacebookButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

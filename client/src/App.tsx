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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

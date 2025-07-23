import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { HomePage } from "./features/home/HomePage";
import { WritePage } from "./features/write/WritePage";
import { InsightsPage } from "./features/insights/InsightsPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { TrackerPage } from "./features/tracker/TrackerPage";
import { OnboardingPage } from "./features/onboarding/OnboardingPage";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem("hasOnboarded") === "true";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect ensures we don't render the app until we've checked localStorage
    const onboarded = localStorage.getItem("hasOnboarded") === "true";
    setHasOnboarded(onboarded);
    setLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasOnboarded", "true");
    setHasOnboarded(true);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        {!hasOnboarded ? (
          <OnboardingPage onComplete={handleOnboardingComplete} />
        ) : (
          <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 pt-24 pb-24">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                  <Route path="/write" element={<PageWrapper><WritePage /></PageWrapper>} />
                  <Route path="/insights" element={<PageWrapper><InsightsPage /></PageWrapper>} />
                  <Route path="/tracker" element={<PageWrapper><TrackerPage /></PageWrapper>} />
                  <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </main>
            <BottomNav />
            <Toaster />
          </div>
        )}
      </Router>
    </ThemeProvider>
  );
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default App;

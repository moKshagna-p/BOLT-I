import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navigation from "./components/Navigation";
import ResourcesPage from "./components/ResourcesPage";
import AnalyticsPage from "./components/AnalyticsPage";
import LandingPage from "./components/LandingPage";
import PageTransition from "./components/PageTransition";

const AppContent = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "/";

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {showNavigation && <Navigation />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />
          <Route
            path="/analytics"
            element={
              <PageTransition>
                <AnalyticsPage />
              </PageTransition>
            }
          />
          <Route
            path="/resources"
            element={
              <PageTransition>
                <ResourcesPage />
              </PageTransition>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PageTransition>
                <div>Chatbot Page</div>
              </PageTransition>
            }
          />
          <Route
            path="/chat"
            element={
              <PageTransition>
                <div>Chat Page</div>
              </PageTransition>
            }
          />
          <Route
            path="/tinder"
            element={
              <PageTransition>
                <div>Tinder Interface</div>
              </PageTransition>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

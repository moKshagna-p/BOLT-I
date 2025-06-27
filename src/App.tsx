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
import ChatPage from "./components/ChatPage";
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
                <div className="pt-20 min-h-screen bg-[#121212] relative">
                  <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-100">
                      Chatbot
                    </h1>
                    <p className="mt-4 text-gray-400">Coming soon...</p>
                  </div>
                </div>
              </PageTransition>
            }
          />
          <Route
            path="/chat"
            element={
              <PageTransition>
                <ChatPage />
              </PageTransition>
            }
          />
          <Route
            path="/tinder"
            element={
              <PageTransition>
                <div className="pt-20 min-h-screen bg-[#121212] relative">
                  <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-100">
                      Tinder Interface
                    </h1>
                    <p className="mt-4 text-gray-400">Coming soon...</p>
                  </div>
                </div>
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

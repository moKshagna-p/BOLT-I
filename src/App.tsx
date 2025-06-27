import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import ResourcesPage from "./components/ResourcesPage";
import AnalyticsPage from "./components/AnalyticsPage";
import LandingPage from "./components/LandingPage";

const AppContent = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "/";

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/chatbot" element={<div>Chatbot Page</div>} />
        <Route path="/chat" element={<div>Chat Page</div>} />
        <Route path="/tinder" element={<div>Tinder Interface</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ResourcesPage from './components/ResourcesPage';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'resources':
        return <ResourcesPage />;
      default:
        return (
          <div className="pt-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TechFlow</h1>
              <p className="text-lg text-gray-600">Navigate to different sections using the menu above.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Navigation isScrolled={isScrolled} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
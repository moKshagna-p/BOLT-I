import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

interface NavigationProps {
  isScrolled: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isScrolled, currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Analytics', key: 'analytics' },
    { name: 'Chatbot', key: 'chatbot' },
    { name: 'Resources', key: 'resources' },
    { name: 'Chat', key: 'chat' },
    { name: 'Tinder-style interface', key: 'tinder' }
  ];

  const handleNavClick = (key: string) => {
    setCurrentPage(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <div className="relative">
              <Zap className="w-8 h-8 text-[#f59e0b] group-hover:text-[#d97706] transition-colors duration-200" />
            </div>
            <span className="text-2xl font-bold text-[#262626]">
              TechFlow
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.key)}
                className={`relative transition-colors duration-200 font-medium py-2 group ${
                  currentPage === item.key 
                    ? 'text-[#f59e0b]' 
                    : 'text-[#4b5563] hover:text-[#f59e0b]'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f59e0b] transition-all duration-300 ease-out ${
                  currentPage === item.key ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <button className="px-8 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:ring-offset-2">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#f9fafb] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:ring-offset-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#4b5563]" />
            ) : (
              <Menu className="w-6 h-6 text-[#4b5563]" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.key)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  currentPage === item.key
                    ? 'text-[#f59e0b] bg-[#fffbeb]'
                    : 'text-[#4b5563] hover:text-[#f59e0b] hover:bg-[#fffbeb]'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 px-4">
              <button className="w-full px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  Download, 
  FileText, 
  Code, 
  Users, 
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Tag,
  TrendingUp,
  DollarSign,
  Scale,
  Target,
  BarChart3,
  Lightbulb,
  Calendar,
  Award,
  Shield,
  Globe,
  ArrowUp,
  Play,
  FileDown,
  Calculator,
  Network,
  Briefcase,
  GraduationCap,
  Building2,
  PieChart,
  Zap,
  CheckCircle2
} from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('entrepreneurs');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Navigation bar height
      const sidebarOffset = 120; // Additional offset for better positioning
      const elementPosition = element.offsetTop - navHeight - sidebarOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll events with improved section detection
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      // Get all sections
      const sections = ['entrepreneurs', 'investors', 'insights', 'education', 'tools', 'networking', 'platform', 'legal'];
      const scrollPosition = window.scrollY + 300; // Increased offset for better detection
      
      let currentSection = 'entrepreneurs'; // Default section
      
      // Check each section to find which one is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop - 200; // Offset for header
          
          if (scrollPosition >= elementTop) {
            currentSection = sections[i];
            break;
          }
        }
      }
      
      // Special handling for when we're at the very bottom of the page
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      if (scrollTop + windowHeight >= documentHeight - 100) {
        currentSection = 'legal'; // Force legal section when near bottom
      }
      
      setActiveSection(currentSection);
    };

    // Initial call to set active section
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationSections = [
    { id: 'entrepreneurs', name: 'For Entrepreneurs', icon: Lightbulb, description: 'Startup fundamentals & growth' },
    { id: 'investors', name: 'For Investors', icon: TrendingUp, description: 'Investment strategies & tools' },
    { id: 'insights', name: 'Market Intelligence', icon: BarChart3, description: 'Industry data & trends' },
    { id: 'education', name: 'Educational Content', icon: GraduationCap, description: 'Learning resources' },
    { id: 'tools', name: 'Tools & Calculators', icon: Calculator, description: 'Financial modeling tools' },
    { id: 'networking', name: 'Networking & Community', icon: Network, description: 'Events & connections' },
    { id: 'platform', name: 'Platform Resources', icon: Zap, description: 'Platform guides & tutorials' },
    { id: 'legal', name: 'Legal & Compliance', icon: Shield, description: 'Regulatory guidance' }
  ];

  const entrepreneurResources = [
    {
      title: 'Startup Fundamentals Guide',
      description: 'Complete business plan templates, pitch deck frameworks, and market research methodologies',
      type: 'guide',
      icon: Building2,
      items: ['Business Plan Templates', 'Pitch Deck Templates', 'Market Research Guides'],
      downloadCount: '15.2K',
      rating: 4.9
    },
    {
      title: 'Legal Resources',
      description: 'Essential legal guidance for incorporation, equity distribution, and IP protection',
      type: 'legal',
      icon: Scale,
      items: ['Incorporation Guides', 'Equity Distribution', 'IP Basics'],
      downloadCount: '8.7K',
      rating: 4.8
    },
    {
      title: 'Funding Stages Explained',
      description: 'Comprehensive breakdown of pre-seed through Series C funding rounds',
      type: 'education',
      icon: DollarSign,
      items: ['Pre-seed Guide', 'Seed Funding', 'Series A-C Breakdown'],
      downloadCount: '12.1K',
      rating: 4.9
    },
    {
      title: 'Valuation Methods & Tools',
      description: 'Professional valuation frameworks and calculation methodologies',
      type: 'tool',
      icon: PieChart,
      items: ['DCF Models', 'Comparable Analysis', 'Risk Assessment'],
      downloadCount: '6.3K',
      rating: 4.7
    },
    {
      title: 'Due Diligence Checklist',
      description: 'Complete checklist of what investors will request during due diligence',
      type: 'checklist',
      icon: CheckCircle2,
      items: ['Financial Documents', 'Legal Requirements', 'Operational Metrics'],
      downloadCount: '9.8K',
      rating: 4.8
    },
    {
      title: 'Pitch Preparation Masterclass',
      description: 'Advanced storytelling techniques, financial projections, and demo best practices',
      type: 'video',
      icon: Play,
      items: ['Storytelling Framework', 'Financial Modeling', 'Demo Scripts'],
      downloadCount: '11.4K',
      rating: 4.9
    }
  ];

  const investorResources = [
    {
      title: 'Investment Due Diligence Framework',
      description: 'Systematic approach to evaluating startup investment opportunities',
      type: 'framework',
      icon: Target,
      items: ['Evaluation Criteria', 'Risk Assessment', 'Decision Matrix'],
      downloadCount: '7.2K',
      rating: 4.8
    },
    {
      title: 'Industry Analysis Reports',
      description: 'Comprehensive market trends and sector analysis reports',
      type: 'report',
      icon: BarChart3,
      items: ['Market Trends', 'Sector Analysis', 'Growth Projections'],
      downloadCount: '5.9K',
      rating: 4.7
    },
    {
      title: 'Portfolio Management Best Practices',
      description: 'Advanced strategies for managing and optimizing investment portfolios',
      type: 'guide',
      icon: Briefcase,
      items: ['Portfolio Strategy', 'Risk Management', 'Performance Tracking'],
      downloadCount: '4.1K',
      rating: 4.9
    },
    {
      title: 'Legal Investment Documents',
      description: 'Template library for investment agreements and legal documentation',
      type: 'template',
      icon: FileText,
      items: ['Term Sheets', 'Investment Agreements', 'Board Resolutions'],
      downloadCount: '3.8K',
      rating: 4.6
    }
  ];

  const educationalContent = [
    {
      title: 'Expert Webinar Library',
      description: 'Recorded sessions with industry leaders and successful entrepreneurs',
      type: 'video',
      icon: Video,
      count: '150+ Sessions',
      duration: '200+ Hours'
    },
    {
      title: 'Startup Success Podcast',
      description: 'Weekly interviews with founders, investors, and industry experts',
      type: 'audio',
      icon: Play,
      count: '75 Episodes',
      duration: '50+ Hours'
    },
    {
      title: 'Interactive Video Tutorials',
      description: 'Step-by-step platform tutorials and investment education',
      type: 'tutorial',
      icon: GraduationCap,
      count: '40+ Tutorials',
      duration: '15+ Hours'
    }
  ];

  const toolsAndCalculators = [
    {
      title: 'Startup Valuation Calculator',
      description: 'Advanced DCF and comparable company analysis tool',
      icon: Calculator,
      type: 'calculator'
    },
    {
      title: 'Equity Dilution Calculator',
      description: 'Model equity dilution across funding rounds',
      icon: PieChart,
      type: 'calculator'
    },
    {
      title: 'ROI Calculator for Investors',
      description: 'Calculate potential returns and risk-adjusted metrics',
      icon: TrendingUp,
      type: 'calculator'
    },
    {
      title: 'Burn Rate Calculator',
      description: 'Track cash burn and runway projections',
      icon: BarChart3,
      type: 'calculator'
    },
    {
      title: 'Market Size Calculator',
      description: 'TAM, SAM, and SOM analysis framework',
      icon: Target,
      type: 'calculator'
    },
    {
      title: 'Cap Table Management',
      description: 'Professional cap table modeling and scenario planning',
      icon: FileText,
      type: 'tool'
    }
  ];

  const ResourceCard = ({ resource, index }: { resource: any; index: number }) => {
    const Icon = resource.icon;
    
    return (
      <div 
        className="bg-white rounded-2xl border border-[#e5e7eb] p-6 hover:shadow-xl hover:border-[#f59e0b]/20 transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#fffbeb] rounded-xl">
            <Icon className="w-6 h-6 text-[#f59e0b]" />
          </div>
          {resource.rating && (
            <div className="flex items-center text-sm text-[#6b7280]">
              <Star className="w-4 h-4 mr-1 text-[#f59e0b] fill-current" />
              {resource.rating}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-[#262626] mb-2 group-hover:text-[#f59e0b] transition-colors duration-200">
          {resource.title}
        </h3>
        <p className="text-[#6b7280] text-sm mb-4 leading-relaxed">
          {resource.description}
        </p>
        
        {resource.items && (
          <div className="space-y-2 mb-4">
            {resource.items.slice(0, 3).map((item: string, idx: number) => (
              <div key={idx} className="flex items-center text-xs text-[#4b5563]">
                <CheckCircle2 className="w-3 h-3 mr-2 text-[#f59e0b]" />
                {item}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6]">
          {resource.downloadCount && (
            <div className="flex items-center text-xs text-[#6b7280]">
              <Download className="w-3 h-3 mr-1" />
              {resource.downloadCount} downloads
            </div>
          )}
          {resource.count && (
            <div className="text-xs text-[#6b7280]">
              {resource.count}
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#f59e0b] group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    );
  };

  const ToolCard = ({ tool, index }: { tool: any; index: number }) => {
    const Icon = tool.icon;
    
    return (
      <div 
        className="bg-white rounded-xl border border-[#e5e7eb] p-6 hover:shadow-lg hover:border-[#f59e0b]/20 transition-all duration-300 group cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center mb-3">
          <div className="p-2 bg-[#fffbeb] rounded-lg mr-3">
            <Icon className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <span className="text-xs bg-[#f3f4f6] text-[#6b7280] px-2 py-1 rounded-full">
            {tool.type}
          </span>
        </div>
        <h4 className="font-semibold text-[#262626] mb-2 group-hover:text-[#f59e0b] transition-colors duration-200">
          {tool.title}
        </h4>
        <p className="text-sm text-[#6b7280] leading-relaxed">
          {tool.description}
        </p>
      </div>
    );
  };

  return (
    <div className="pt-20 min-h-screen bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sticky Navigation Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#262626] mb-6">Navigate Resources</h3>
                <nav className="space-y-2">
                  {navigationSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-start px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-[#fffbeb] text-[#f59e0b] border border-[#f59e0b]/20'
                            : 'text-[#4b5563] hover:bg-[#f9fafb] hover:text-[#262626]'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-[#6b7280] mt-1">{section.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* For Entrepreneurs Section */}
            <section id="entrepreneurs" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <Lightbulb className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">For Entrepreneurs & Startups</h2>
                  <p className="text-[#6b7280] mt-2">Essential resources to build, fund, and scale your startup</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {entrepreneurResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))}
              </div>
            </section>

            {/* For Investors Section */}
            <section id="investors" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <TrendingUp className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">For Investors</h2>
                  <p className="text-[#6b7280] mt-2">Professional tools and insights for smart investment decisions</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {investorResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} index={index} />
                ))}
              </div>
            </section>

            {/* Market Intelligence Section */}
            <section id="insights" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <BarChart3 className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Industry Insights & Market Intelligence</h2>
                  <p className="text-[#6b7280] mt-2">Data-driven insights and market analysis</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <Award className="w-6 h-6 text-[#f59e0b] mr-3" />
                    <h3 className="text-xl font-semibold text-[#262626]">Success Statistics</h3>
                  </div>
                  <p className="text-[#6b7280] mb-4">Comprehensive analysis of startup success rates by industry, funding stage, and geography.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">SaaS Success Rate</span>
                      <span className="font-semibold text-[#f59e0b]">23%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">E-commerce Success Rate</span>
                      <span className="font-semibold text-[#f59e0b]">18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">FinTech Success Rate</span>
                      <span className="font-semibold text-[#f59e0b]">15%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <Globe className="w-6 h-6 text-[#f59e0b] mr-3" />
                    <h3 className="text-xl font-semibold text-[#262626]">Regional Ecosystems</h3>
                  </div>
                  <p className="text-[#6b7280] mb-4">In-depth analysis of startup ecosystems across major global markets.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">Silicon Valley</span>
                      <span className="font-semibold text-[#f59e0b]">$156B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">New York</span>
                      <span className="font-semibold text-[#f59e0b]">$42B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4b5563]">London</span>
                      <span className="font-semibold text-[#f59e0b]">$28B</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Educational Content Section */}
            <section id="education" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <GraduationCap className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Educational Content</h2>
                  <p className="text-[#6b7280] mt-2">Learn from industry experts and successful entrepreneurs</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {educationalContent.map((content, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-[#e5e7eb] p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="p-4 bg-[#fffbeb] rounded-xl mb-4 w-fit">
                      <content.icon className="w-8 h-8 text-[#f59e0b]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#262626] mb-2 group-hover:text-[#f59e0b] transition-colors duration-200">
                      {content.title}
                    </h3>
                    <p className="text-[#6b7280] mb-4">{content.description}</p>
                    <div className="flex justify-between text-sm text-[#4b5563]">
                      <span>{content.count}</span>
                      <span>{content.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools & Calculators Section */}
            <section id="tools" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <Calculator className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Tools & Calculators</h2>
                  <p className="text-[#6b7280] mt-2">Professional-grade tools for financial modeling and analysis</p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {toolsAndCalculators.map((tool, index) => (
                  <ToolCard key={index} tool={tool} index={index} />
                ))}
              </div>
            </section>

            {/* Networking & Community Section */}
            <section id="networking" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <Network className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Networking & Community</h2>
                  <p className="text-[#6b7280] mt-2">Connect with peers, mentors, and industry leaders</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8">
                  <Calendar className="w-8 h-8 text-[#f59e0b] mb-4" />
                  <h3 className="text-xl font-semibold text-[#262626] mb-2">Upcoming Events</h3>
                  <p className="text-[#6b7280] mb-4">Join pitch events, networking meetups, and industry conferences.</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                      <span className="text-[#4b5563]">Startup Pitch Night</span>
                      <span className="text-sm text-[#f59e0b] font-medium">Dec 15</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                      <span className="text-[#4b5563]">Investor Meetup</span>
                      <span className="text-sm text-[#f59e0b] font-medium">Dec 22</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8">
                  <Users className="w-8 h-8 text-[#f59e0b] mb-4" />
                  <h3 className="text-xl font-semibold text-[#262626] mb-2">Mentorship Program</h3>
                  <p className="text-[#6b7280] mb-4">Get matched with experienced entrepreneurs and investors.</p>
                  <div className="bg-[#fffbeb] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#f59e0b] mb-1">500+</div>
                    <div className="text-[#6b7280] text-sm">Active Mentors</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Resources Section */}
            <section id="platform" className="mb-20 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <Zap className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Platform-Specific Resources</h2>
                  <p className="text-[#6b7280] mt-2">Master our platform with comprehensive guides and tutorials</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[#262626] mb-4">Getting Started</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Platform Overview & Navigation
                      </div>
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Creating Your Startup Profile
                      </div>
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Investor Search & Outreach
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#262626] mb-4">Advanced Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Analytics Dashboard Guide
                      </div>
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Deal Room Management
                      </div>
                      <div className="flex items-center text-[#4b5563]">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-[#f59e0b]" />
                        Communication Best Practices
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Legal & Compliance Section */}
            <section id="legal" className="mb-32 scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[#fffbeb] rounded-xl mr-4">
                  <Shield className="w-8 h-8 text-[#f59e0b]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#262626]">Legal & Compliance</h2>
                  <p className="text-[#6b7280] mt-2">Navigate regulatory requirements and legal considerations</p>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                  <Scale className="w-6 h-6 text-[#f59e0b] mb-4" />
                  <h3 className="text-lg font-semibold text-[#262626] mb-2">Regulatory Guidelines</h3>
                  <p className="text-[#6b7280] mb-4">Comprehensive guides for different regulatory environments.</p>
                  <div className="space-y-2 text-sm">
                    <div className="text-[#4b5563]">• SEC Regulations (US)</div>
                    <div className="text-[#4b5563]">• FCA Guidelines (UK)</div>
                    <div className="text-[#4b5563]">• ESMA Rules (EU)</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                  <Globe className="w-6 h-6 text-[#f59e0b] mb-4" />
                  <h3 className="text-lg font-semibold text-[#262626] mb-2">International Considerations</h3>
                  <p className="text-[#6b7280] mb-4">Cross-border investment laws and compliance requirements.</p>
                  <div className="space-y-2 text-sm">
                    <div className="text-[#4b5563]">• Tax Implications</div>
                    <div className="text-[#4b5563]">• Currency Regulations</div>
                    <div className="text-[#4b5563]">• Reporting Requirements</div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-[#f59e0b] text-white rounded-full shadow-lg hover:bg-[#d97706] transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ResourcesPage;
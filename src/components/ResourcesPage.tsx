import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  Settings,
  LineChart,
} from "lucide-react";
import styled, { createGlobalStyle } from "styled-components";
import _ from "lodash";
import { Link } from "react-router-dom";

// Global styles
const GlobalStyle = createGlobalStyle`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: rgb(226, 232, 240);
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: -0.025em;
  }

  .section-description {
    color: rgb(203, 213, 225);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 600px;
    line-height: 1.6;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .resource-card {
    background: rgba(0, 0, 0, 0.75);
    border-radius: 1rem;
    border: 1px solid rgba(139, 92, 246, 0.2);
    padding: 1.5rem;
    backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .resource-card:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-0.25rem);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }
  
  .resource-card .resource-icon {
    color: rgb(192, 132, 252);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.8;
  }

  .resource-card:hover .resource-icon {
    color: rgb(216, 180, 254);
    transform: scale(1.1);
    opacity: 1;
  }
  
  .resource-card .resource-title {
    color: rgb(226, 232, 240);
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    letter-spacing: -0.025em;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .resource-card:hover .resource-title {
    color: rgb(216, 180, 254);
  }

  .resource-card .resource-description {
    color: rgb(203, 213, 225);
    font-size: 0.95rem;
    line-height: 1.6;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .resource-card .resource-stat {
    color: rgb(192, 132, 252);
    font-weight: 600;
    opacity: 0.9;
  }
  
  .metric-card {
    background: rgba(0, 0, 0, 0.75);
    border-radius: 0.75rem;
    border: 1px solid rgba(139, 92, 246, 0.2);
    padding: 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(12px);
    opacity: 0;
    transform: scale(0.9);
    animation: scaleIn 0.6s ease-out forwards;
  }
  
  .metric-card:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }

  .metric-card .metric-title {
    color: rgb(226, 232, 240);
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .metric-card:hover .metric-title {
    color: rgb(216, 180, 254);
  }

  .metric-card .metric-value {
    color: rgb(216, 180, 254);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .section-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .section-hidden {
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    background: rgb(18, 18, 18);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(107, 33, 168, 0.3) rgba(107, 33, 168, 0.1);
    scroll-behavior: smooth;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(107, 33, 168, 0.1);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(107, 33, 168, 0.3);
    border-radius: 10px;
    transition: background-color 0.3s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 33, 168, 0.4);
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const StyledSidebar = styled.aside`
  .nav-button {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(107, 33, 168, 0.2);
    margin-bottom: 0.5rem;
    border-radius: 0.75rem;
    transform: translateX(0);
    backdrop-filter: blur(12px);
    padding: 0.75rem 1rem;
    will-change: transform, background-color, border-color;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(107, 33, 168, 0.3);
    transform: translateX(0.25rem);
  }

  .nav-button.active {
    background: rgba(0, 0, 0, 0.95);
    border-color: rgba(107, 33, 168, 0.4);
    transform: translateX(0.5rem);
  }

  .nav-button .nav-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: rgb(192, 132, 252);
    opacity: 0.9;
    will-change: transform, color, opacity;
  }

  .nav-button:hover .nav-icon,
  .nav-button.active .nav-icon {
    color: rgb(216, 180, 254);
    opacity: 1;
  }

  .nav-button .nav-text {
    color: rgb(226, 232, 240);
    font-size: 0.95rem;
    font-weight: 500;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: color, opacity;
  }

  .nav-button:hover .nav-text,
  .nav-button.active .nav-text {
    color: rgb(216, 180, 254);
    opacity: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(107, 33, 168, 0.3) rgba(107, 33, 168, 0.1);
    scroll-behavior: smooth;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(107, 33, 168, 0.1);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(107, 33, 168, 0.3);
    border-radius: 10px;
    transition: background-color 0.3s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 33, 168, 0.4);
  }
`;

// Add styled nav component
const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(107, 33, 168, 0.2);
`;

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("entrepreneurs");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  // Enhanced scroll handling with Intersection Observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          setVisibleSections((prev) =>
            Array.from(new Set([...prev, sectionId]))
          );
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.35, // Increased threshold for better accuracy
      rootMargin: "-100px 0px -100px 0px",
    });

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Optimized scroll handling
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide back to top button
      setShowBackToTop(window.scrollY > 300);
    };

    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll to section with easing
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 96;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementPosition - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationSections = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: Lightbulb,
    },
    {
      id: "business-planning",
      name: "Business Planning",
      icon: Target,
    },
    {
      id: "funding",
      name: "Funding Resources",
      icon: DollarSign,
    },
    {
      id: "product-dev",
      name: "Product Development",
      icon: Code,
    },
    {
      id: "growth",
      name: "Growth & Marketing",
      icon: TrendingUp,
    },
    {
      id: "tools",
      name: "Tools & Resources",
      icon: Calculator,
    },
    {
      id: "education",
      name: "Learning Resources",
      icon: GraduationCap,
    },
    {
      id: "operations",
      name: "Operations",
      icon: Settings,
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      icon: Shield,
    },
    {
      id: "community",
      name: "Community",
      icon: Users,
    },
  ];

  const startupResources = [
    {
      title: "Startup Toolkit",
      description: "Essential tools and templates for launching your startup",
      type: "toolkit",
      icon: Briefcase,
      items: [
        "Business Plan Template",
        "Financial Model Template",
        "Pitch Deck Framework",
        "Market Research Guide",
      ],
      downloadCount: "25.3K",
      rating: 4.9,
    },
    {
      title: "Product Development Guide",
      description: "Best practices for building and launching your MVP",
      type: "guide",
      icon: Code,
      items: [
        "MVP Development Framework",
        "User Testing Templates",
        "Technical Architecture Guide",
      ],
      downloadCount: "18.7K",
      rating: 4.8,
    },
    {
      title: "Growth Marketing Playbook",
      description:
        "Proven strategies for sustainable growth and user acquisition",
      type: "playbook",
      icon: TrendingUp,
      items: [
        "Customer Acquisition Strategy",
        "Content Marketing Guide",
        "Analytics Setup Guide",
      ],
      downloadCount: "21.2K",
      rating: 4.9,
    },
    {
      title: "Funding Guide",
      description:
        "Complete guide to startup fundraising and investor relations",
      type: "guide",
      icon: DollarSign,
      items: [
        "Fundraising Strategy",
        "Investor Pitch Guide",
        "Term Sheet Guide",
      ],
      downloadCount: "19.8K",
      rating: 4.7,
    },
    {
      title: "Legal Essentials",
      description: "Key legal documents and compliance guidelines",
      type: "legal",
      icon: Shield,
      items: ["Incorporation Guide", "IP Protection", "Contracts Templates"],
      downloadCount: "15.4K",
      rating: 4.8,
    },
    {
      title: "Operations Manual",
      description: "Streamline your business operations and processes",
      type: "manual",
      icon: Settings,
      items: ["Process Templates", "Team Management", "Tools & Software Guide"],
      downloadCount: "12.9K",
      rating: 4.6,
    },
  ];

  const educationalContent = [
    {
      title: "Founder's Learning Path",
      description: "Curated courses and workshops for startup founders",
      type: "courses",
      icon: GraduationCap,
      count: "50+ Courses",
      duration: "100+ Hours",
    },
    {
      title: "Expert Webinar Series",
      description:
        "Live sessions with successful founders and industry experts",
      type: "webinars",
      icon: Video,
      count: "200+ Sessions",
      duration: "300+ Hours",
    },
    {
      title: "Startup Case Studies",
      description: "Real-world examples and lessons from successful startups",
      type: "case-studies",
      icon: FileText,
      count: "100+ Studies",
      duration: "50+ Hours",
    },
  ];

  const toolsAndCalculators = [
    {
      title: "Financial Modeling Tools",
      description:
        "Professional-grade financial planning and forecasting tools",
      icon: Calculator,
      type: "finance",
    },
    {
      title: "Market Size Calculator",
      description: "Calculate TAM, SAM, and SOM for your market",
      icon: PieChart,
      type: "market",
    },
    {
      title: "Runway Calculator",
      description: "Track burn rate and estimate runway",
      icon: TrendingUp,
      type: "finance",
    },
    {
      title: "Equity Calculator",
      description: "Model cap table and equity dilution",
      icon: Users,
      type: "finance",
    },
    {
      title: "Unit Economics",
      description: "Calculate CAC, LTV, and other key metrics",
      icon: BarChart3,
      type: "metrics",
    },
    {
      title: "Growth Metrics",
      description: "Track and forecast key growth metrics",
      icon: LineChart,
      type: "metrics",
    },
  ];

  const ResourceCard = ({
    resource,
    index,
  }: {
    resource: any;
    index: number;
  }) => {
    const Icon = resource.icon;
    return (
      <div
        className="resource-card group"
        style={{
          animationDelay: `${index * 100}ms`,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-purple-900/30 rounded-xl">
            <Icon className="resource-icon w-6 h-6 text-purple-300 transition-all duration-300" />
          </div>
          {resource.rating && (
            <div className="flex items-center text-sm text-purple-300">
              <Star className="w-4 h-4 mr-1 text-purple-400 fill-current" />
              <span className="font-semibold">{resource.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-purple-300 transition-colors">
          {resource.title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {resource.description}
        </p>

        {resource.items && (
          <div className="space-y-2 mb-4">
            {resource.items.map((item: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center text-sm text-gray-300"
              >
                <CheckCircle2 className="w-4 h-4 mr-2 text-purple-400" />
                {item}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
          {resource.downloadCount && (
            <div className="flex items-center text-sm text-purple-300">
              <Download className="w-4 h-4 mr-1" />
              {resource.downloadCount} downloads
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    );
  };

  const ToolCard = ({ tool, index }: { tool: any; index: number }) => {
    const Icon = tool.icon;
    return (
      <div
        className="metric-card"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center mb-3">
          <div className="p-2 bg-purple-900/30 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-purple-300" />
          </div>
          <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">
            {tool.type}
          </span>
        </div>
        <h4 className="metric-title">{tool.title}</h4>
        <p className="resource-description">{tool.description}</p>
      </div>
    );
  };

  // Additional resource sections data
  const businessPlanningResources = [
    {
      title: "Market Research Kit",
      description: "Comprehensive tools for market analysis and validation",
      type: "research",
      icon: Target,
      items: [
        "Industry Analysis Templates",
        "Competitor Research Framework",
        "Market Size Calculator",
      ],
      downloadCount: "18.2K",
      rating: 4.7,
    },
    {
      title: "Business Model Canvas",
      description: "Interactive templates for business model development",
      type: "planning",
      icon: PieChart,
      items: [
        "Value Proposition Canvas",
        "Revenue Model Templates",
        "Cost Structure Analysis",
      ],
      downloadCount: "22.1K",
      rating: 4.8,
    },
    {
      title: "Strategic Planning Tools",
      description: "Tools for long-term business strategy development",
      type: "strategy",
      icon: Target,
      items: [
        "SWOT Analysis Template",
        "OKR Framework",
        "Strategic Roadmap Builder",
      ],
      downloadCount: "16.9K",
      rating: 4.6,
    },
  ];

  const fundingResources = [
    {
      title: "Investor Pitch Kit",
      description: "Complete toolkit for fundraising preparation",
      type: "pitch",
      icon: DollarSign,
      items: [
        "Pitch Deck Templates",
        "Financial Projections",
        "Valuation Tools",
        "Term Sheet Guide",
      ],
      downloadCount: "28.4K",
      rating: 4.9,
    },
    {
      title: "Due Diligence Checklist",
      description: "Comprehensive checklist for investment readiness",
      type: "checklist",
      icon: CheckCircle2,
      items: ["Legal Documentation", "Financial Records", "IP Verification"],
      downloadCount: "15.7K",
      rating: 4.7,
    },
    {
      title: "Funding Options Guide",
      description: "Overview of different funding sources and strategies",
      type: "guide",
      icon: BookOpen,
      items: ["VC Funding Guide", "Angel Investment", "Crowdfunding Strategy"],
      downloadCount: "19.3K",
      rating: 4.8,
    },
  ];

  const productDevResources = [
    {
      title: "Technical Architecture",
      description: "Templates and guides for system architecture",
      type: "technical",
      icon: Code,
      items: [
        "Architecture Patterns",
        "Scalability Guide",
        "Security Best Practices",
      ],
      downloadCount: "23.1K",
      rating: 4.8,
    },
    {
      title: "UI/UX Design Kit",
      description: "Design resources and guidelines for product development",
      type: "design",
      icon: Lightbulb,
      items: ["Design System", "Component Library", "Usability Guidelines"],
      downloadCount: "26.8K",
      rating: 4.9,
    },
    {
      title: "Development Workflow",
      description: "Best practices for development and deployment",
      type: "workflow",
      icon: Settings,
      items: ["CI/CD Templates", "Code Review Guidelines", "Testing Framework"],
      downloadCount: "20.5K",
      rating: 4.7,
    },
  ];

  const growthResources = [
    {
      title: "Growth Marketing Toolkit",
      description: "Complete toolkit for growth and user acquisition",
      type: "marketing",
      icon: TrendingUp,
      items: [
        "Customer Acquisition Framework",
        "Growth Metrics Dashboard",
        "Marketing Channel Guide",
      ],
      downloadCount: "24.7K",
      rating: 4.8,
    },
    {
      title: "Content Strategy Kit",
      description: "Resources for content marketing and SEO",
      type: "content",
      icon: FileText,
      items: [
        "Content Calendar Template",
        "SEO Best Practices",
        "Social Media Strategy",
      ],
      downloadCount: "21.3K",
      rating: 4.7,
    },
    {
      title: "Analytics Dashboard",
      description: "Templates for tracking growth metrics",
      type: "analytics",
      icon: BarChart3,
      items: [
        "KPI Dashboard",
        "Conversion Funnel Analysis",
        "User Behavior Tracking",
      ],
      downloadCount: "19.8K",
      rating: 4.9,
    },
  ];

  const operationsResources = [
    {
      title: "Operations Playbook",
      description: "Comprehensive guide for business operations",
      type: "operations",
      icon: Settings,
      items: [
        "Process Documentation",
        "Team Management",
        "Resource Allocation",
      ],
      downloadCount: "17.5K",
      rating: 4.6,
    },
    {
      title: "HR & Culture Kit",
      description: "Tools for building great company culture",
      type: "culture",
      icon: Users,
      items: ["Hiring Templates", "Onboarding Checklist", "Culture Framework"],
      downloadCount: "16.2K",
      rating: 4.8,
    },
    {
      title: "Finance Management",
      description: "Financial planning and management tools",
      type: "finance",
      icon: DollarSign,
      items: [
        "Budget Templates",
        "Cash Flow Management",
        "Financial Reporting",
      ],
      downloadCount: "20.1K",
      rating: 4.7,
    },
  ];

  const communityResources = [
    {
      title: "Networking Guide",
      description: "Resources for building professional networks",
      type: "networking",
      icon: Users,
      items: [
        "Event Planning Kit",
        "Community Building Guide",
        "Partnership Strategy",
      ],
      downloadCount: "15.8K",
      rating: 4.7,
    },
    {
      title: "Mentorship Program",
      description: "Framework for mentorship and knowledge sharing",
      type: "mentorship",
      icon: GraduationCap,
      items: ["Mentor Matching System", "Knowledge Base", "Success Stories"],
      downloadCount: "14.3K",
      rating: 4.8,
    },
    {
      title: "Collaboration Tools",
      description: "Resources for team collaboration",
      type: "collaboration",
      icon: Network,
      items: [
        "Project Management Templates",
        "Communication Guidelines",
        "Remote Work Tools",
      ],
      downloadCount: "18.9K",
      rating: 4.6,
    },
  ];

  return (
    <>
      <StyledNav>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-semibold text-gray-100">
                  TechFlow
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/analytics"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Analytics
              </Link>
              <Link
                to="/chatbot"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Chatbot
              </Link>
              <Link to="/resources" className="text-purple-400 font-medium">
                Resources
              </Link>
              <Link
                to="/chat"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Chat
              </Link>
              <Link
                to="/tinder"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Tinder-style interface
              </Link>
            </div>
          </div>
        </div>
      </StyledNav>
      <div className="pt-20 min-h-screen bg-[#121212] relative overflow-hidden">
        {/* Main purple gradient beam */}
        <div
          className="absolute inset-0 rotate-45 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #6B21A8 50%, transparent 100%)",
            filter: "blur(80px)",
            transform: "translateY(-50%) rotate(-45deg) scale(2)",
          }}
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-[#121212]/50 backdrop-blur-[1px]" />

        {/* Content wrapper */}
        <div className="relative z-10">
          <GlobalStyle />
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Sticky Navigation Sidebar */}
              <StyledSidebar className="hidden lg:block w-72 flex-shrink-0">
                <div className="fixed w-72 pt-24 pb-8">
                  <div className="bg-[#121212]/80 rounded-xl border border-purple-900/20 p-4 shadow-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4 opacity-90 px-2">
                      Resource Categories
                    </h3>
                    <nav className="space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
                      {navigationSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`nav-button w-full flex items-center text-left ${
                              activeSection === section.id ? "active" : ""
                            }`}
                          >
                            <Icon className="nav-icon w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="nav-text">{section.name}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </StyledSidebar>

              {/* Main Content */}
              <main className="flex-1 space-y-20">
                {/* Getting Started Section */}
                <section id="getting-started" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Lightbulb className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Getting Started</h2>
                      <p className="section-description">
                        Essential resources and guides to help you start your
                        journey
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {startupResources.slice(0, 3).map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Business Planning Section */}
                <section id="business-planning" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Target className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Business Planning</h2>
                      <p className="section-description">
                        Strategic tools and frameworks for business development
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {businessPlanningResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Funding Section */}
                <section id="funding" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <DollarSign className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Funding Resources</h2>
                      <p className="section-description">
                        Essential tools and guides for startup fundraising
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {fundingResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Product Development Section */}
                <section id="product-dev" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Code className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Product Development</h2>
                      <p className="section-description">
                        Technical resources and best practices for building
                        great products
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {productDevResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Growth & Marketing Section */}
                <section id="growth" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <TrendingUp className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Growth & Marketing</h2>
                      <p className="section-description">
                        Tools and strategies for sustainable business growth
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {growthResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Tools & Resources Section */}
                <section id="tools" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Calculator className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Tools & Resources</h2>
                      <p className="section-description">
                        Professional tools to help you make informed decisions
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {toolsAndCalculators.map((tool, index) => (
                      <ToolCard key={index} tool={tool} index={index} />
                    ))}
                  </div>
                </section>

                {/* Learning Resources Section */}
                <section id="education" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <GraduationCap className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Learning Resources</h2>
                      <p className="section-description">
                        Expand your knowledge with our curated educational
                        content
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    {educationalContent.map((content, index) => (
                      <div
                        key={index}
                        className="resource-card group"
                        style={{
                          background: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="p-3 bg-purple-900/30 rounded-xl mb-4">
                          <content.icon className="w-6 h-6 text-purple-300 transition-all duration-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-purple-300 transition-colors">
                          {content.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {content.description}
                        </p>
                        <div className="flex justify-between text-sm mt-4 pt-4 border-t border-purple-900/30">
                          <span className="text-purple-300">
                            {content.count}
                          </span>
                          <span className="text-purple-300">
                            {content.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Operations Section */}
                <section id="operations" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Settings className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Operations</h2>
                      <p className="section-description">
                        Resources for efficient business operations and
                        management
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {operationsResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Legal & Compliance Section */}
                <section id="legal" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Shield className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Legal & Compliance</h2>
                      <p className="section-description">
                        Essential legal resources and compliance guides
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {startupResources.slice(4, 6).map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>

                {/* Community Section */}
                <section id="community" className="scroll-mt-32">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                      <Users className="w-8 h-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="section-title">Community</h2>
                      <p className="section-description">
                        Connect and grow with the startup community
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {communityResources.map((resource, index) => (
                      <ResourceCard
                        key={index}
                        resource={resource}
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-black/80 text-purple-300 rounded-full shadow-lg 
                     hover:bg-black hover:text-purple-400 transition-all duration-300 transform 
                     hover:scale-110 z-50 border border-purple-900/20"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
};

export default ResourcesPage;

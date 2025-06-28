import React, { useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  Filter,
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Link2,
  Calendar,
  FileText,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import styled from "styled-components";
import { motion } from "framer-motion";

const StyledChatPage = styled.div`
  .chat-container {
    background: rgba(18, 18, 18, 0.85);
    backdrop-filter: blur(20px);
    border: 1.5px solid rgba(139, 92, 246, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  }

  .chat-sidebar {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(16px);
    border-right: 1px solid rgba(139, 92, 246, 0.15);
  }

  .chat-list-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .chat-list-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
    transition: left 0.5s;
  }

  .chat-list-item:hover::before {
    left: 100%;
  }

  .chat-list-item:hover {
    background: rgba(139, 92, 246, 0.08);
    border-color: rgba(139, 92, 246, 0.25);
    transform: translateX(4px);
  }

  .chat-list-item.active {
    background: rgba(139, 92, 246, 0.12);
    border-color: rgba(139, 92, 246, 0.35);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
  }

  .message-input {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
  }

  .message-input:focus {
    border-color: rgba(139, 92, 246, 0.5);
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    background: rgba(0, 0, 0, 0.4);
  }

  .message-bubble {
    max-width: 75%;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .message-bubble.sent {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%);
    border: 1px solid rgba(139, 92, 246, 0.25);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
  }

  .message-bubble.received {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.15);
    backdrop-filter: blur(8px);
  }

  .message-bubble.sent::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
    border-radius: inherit;
    pointer-events: none;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.3) rgba(139, 92, 246, 0.1);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(139, 92, 246, 0.1);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.4);
  }

  .status-indicator {
    position: relative;
  }

  .status-indicator::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(18, 18, 18, 0.9);
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  }

  .status-indicator.offline::after {
    background: #6b7280;
    box-shadow: none;
  }

  .gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-card {
    background: rgba(18, 18, 18, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(139, 92, 246, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  }

  .pulse-animation {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: {
    type: "file" | "image" | "link";
    name: string;
    url: string;
  }[];
}

interface ChatContact {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  unread: number;
  tags: string[];
  investmentFocus?: string[];
  portfolioSize?: string;
  meetingStatus?: string;
  lastActive?: string;
}

const ChatPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number>(1);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi Sarah, thank you for connecting! I'd love to share more about our AI-powered platform.",
      sender: "me",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: 2,
      text: "Hello! I'm excited to learn more about your startup. Could you send over your pitch deck and some key metrics?",
      sender: "other",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: 3,
      text: "Of course! I've just prepared an updated deck with our latest traction metrics and growth projections.",
      sender: "me",
      timestamp: "10:33 AM",
      status: "read",
      attachments: [
        {
          type: "file",
          name: "Startup_Pitch_Deck_2024.pdf",
          url: "#",
        },
      ],
    },
    {
      id: 4,
      text: "Looking forward to reviewing your pitch deck. I'm particularly interested in your AI technology and market expansion plans.",
      sender: "other",
      timestamp: "10:35 AM",
      status: "delivered",
    },
  ]);

  const contacts: ChatContact[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Investment Partner",
      company: "Sequoia Capital",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "online",
      lastMessage: "Looking forward to reviewing your pitch deck",
      unread: 2,
      tags: ["VC", "Tech", "Series A"],
      investmentFocus: ["AI/ML", "Enterprise SaaS", "Deep Tech"],
      portfolioSize: "$2.5B AUM",
      meetingStatus: "Follow-up scheduled",
      lastActive: "2m ago",
    },
    {
      id: 2,
      name: "Michael Zhang",
      role: "Angel Investor",
      company: "Independent",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      status: "offline",
      lastMessage: "Great meeting you at the startup conference",
      unread: 0,
      tags: ["Angel", "SaaS", "Seed"],
      investmentFocus: ["B2B SaaS", "FinTech"],
      portfolioSize: "25+ investments",
      meetingStatus: "Initial call pending",
      lastActive: "2h ago",
    },
    {
      id: 3,
      name: "Jessica Williams",
      role: "Managing Director",
      company: "Andreessen Horowitz",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      status: "online",
      lastMessage: "Let's schedule a follow-up call next week",
      unread: 1,
      tags: ["VC", "AI/ML", "Series B"],
      investmentFocus: ["Consumer Tech", "AI/ML", "Web3"],
      portfolioSize: "$5B+ AUM",
      meetingStatus: "Due diligence",
      lastActive: "5m ago",
    },
    {
      id: 4,
      name: "David Park",
      role: "Principal",
      company: "Accel Partners",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      status: "online",
      lastMessage: "Your growth metrics are impressive",
      unread: 0,
      tags: ["VC", "Growth", "Series C"],
      investmentFocus: ["Growth Stage", "SaaS", "Marketplaces"],
      portfolioSize: "$3B AUM",
      meetingStatus: "Term sheet discussion",
      lastActive: "1m ago",
    },
    {
      id: 5,
      name: "Emma Thompson",
      role: "Investment Associate",
      company: "Lightspeed Venture Partners",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      status: "offline",
      lastMessage: "Can you share more about your tech stack?",
      unread: 3,
      tags: ["VC", "Tech", "Series A"],
      investmentFocus: ["Enterprise Tech", "DevTools", "Data"],
      portfolioSize: "$1.8B AUM",
      meetingStatus: "Technical review",
      lastActive: "1d ago",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  const handleFileAttachment = () => {
    // Simulate file input click
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newMessage: Message = {
          id: messages.length + 1,
          text: `Attached file: ${file.name}`,
          sender: "me",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sent",
          attachments: [
            {
              type: "file",
              name: file.name,
              url: "#",
            },
          ],
        };
        setMessages([...messages, newMessage]);
      }
    };
    input.click();
  };

  const handleVideoCall = (contact: ChatContact) => {
    alert(`Initiating video call with ${contact.name} from ${contact.company}`);
  };

  const handleAudioCall = (contact: ChatContact) => {
    alert(`Initiating audio call with ${contact.name} from ${contact.company}`);
  };

  const handleScheduleMeeting = (contact: ChatContact) => {
    alert(`Opening calendar to schedule meeting with ${contact.name}`);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "vc" && contact.tags.includes("VC")) ||
      (filter === "angel" && contact.tags.includes("Angel"));
    return matchesSearch && matchesFilter;
  });

  const activeContact = contacts.find((contact) => contact.id === activeChat);

  return (
    <StyledChatPage className="pt-16 min-h-screen bg-[#121212] relative">
      {/* Enhanced background effects */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 py-8">
        {/* Header with stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Investor Network</h1>
              <p className="text-gray-400">Connect with top investors and grow your startup</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass-card rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 font-medium">{contacts.length}</span>
                  <span className="text-gray-500 text-sm">Connections</span>
                </div>
              </div>
              <div className="glass-card rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 font-medium">{messages.length}</span>
                  <span className="text-gray-500 text-sm">Messages</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chat-container rounded-2xl overflow-hidden h-[calc(100vh-12rem)] flex"
        >
          {/* Enhanced Chat Sidebar */}
          <div className="chat-sidebar w-80 flex-shrink-0 flex flex-col">
            {/* Search and Filter */}
            <div className="p-6 border-b border-purple-900/20">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search investors..."
                  className="w-full bg-black/30 text-gray-200 placeholder-gray-400 rounded-xl pl-12 pr-4 py-3 text-sm border border-purple-900/20 focus:border-purple-500/40 focus:outline-none transition-all"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-4 py-2 text-sm rounded-xl transition-all font-medium ${
                    filter === "all"
                      ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-300 border border-purple-500/30"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10 border border-transparent"
                  }`}
                  onClick={() => handleFilterChange("all")}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  All
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-xl transition-all font-medium ${
                    filter === "vc"
                      ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-300 border border-purple-500/30"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10 border border-transparent"
                  }`}
                  onClick={() => handleFilterChange("vc")}
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  VC
                </button>
                <button
                  className={`px-4 py-2 text-sm rounded-xl transition-all font-medium ${
                    filter === "angel"
                      ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-300 border border-purple-500/30"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10 border border-transparent"
                  }`}
                  onClick={() => handleFilterChange("angel")}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Angel
                </button>
              </div>
            </div>

            {/* Enhanced Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`chat-list-item p-4 cursor-pointer rounded-xl mx-2 mb-2 ${
                    activeChat === contact.id ? "active" : ""
                  }`}
                  onClick={() => setActiveChat(contact.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative status-indicator">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className={`w-12 h-12 rounded-full border-2 ${
                          contact.status === "online" 
                            ? "border-green-500/30" 
                            : "border-gray-500/30"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                          contact.status === "online"
                            ? "bg-green-500 pulse-animation"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-200 truncate">
                          {contact.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {contact.unread > 0 && (
                            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {contact.unread}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {contact.lastActive}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-purple-300 font-medium mb-1">
                        {contact.role} • {contact.company}
                      </p>
                      <p className="text-xs text-gray-400 mb-2 truncate">
                        {contact.lastMessage}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {contact.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400">
                            +{contact.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        <span className="text-purple-300 font-medium">Status:</span>{" "}
                        {contact.meetingStatus}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Chat Main Area */}
          <div className="flex-1 flex flex-col">
            {/* Enhanced Chat Header */}
            {activeContact && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-b border-purple-900/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative status-indicator">
                      <img
                        src={activeContact.avatar}
                        alt={activeContact.name}
                        className={`w-14 h-14 rounded-full border-2 ${
                          activeContact.status === "online" 
                            ? "border-green-500/30" 
                            : "border-gray-500/30"
                        }`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-200 mb-1">
                        {activeContact.name}
                      </h2>
                      <p className="text-sm text-purple-300 font-medium">
                        {activeContact.role} • {activeContact.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleAudioCall(activeContact)}
                      className="p-3 hover:bg-purple-600/10 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                      title="Start audio call"
                    >
                      <Phone className="w-5 h-5 text-purple-300" />
                    </button>
                    <button
                      onClick={() => handleVideoCall(activeContact)}
                      className="p-3 hover:bg-purple-600/10 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                      title="Start video call"
                    >
                      <Video className="w-5 h-5 text-purple-300" />
                    </button>
                    <button
                      onClick={() => handleScheduleMeeting(activeContact)}
                      className="p-3 hover:bg-purple-600/10 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                      title="Schedule meeting"
                    >
                      <Calendar className="w-5 h-5 text-purple-300" />
                    </button>
                  </div>
                </div>
                {/* Enhanced contact info */}
                <div className="glass-card rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-medium">Investment Focus</span>
                      </div>
                      <p className="text-gray-300">
                        {activeContact.investmentFocus?.join(", ")}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-medium">Portfolio Size</span>
                      </div>
                      <p className="text-gray-300">
                        {activeContact.portfolioSize}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`message-bubble rounded-2xl px-5 py-3 ${
                      message.sender === "me" ? "sent" : "received"
                    }`}
                  >
                    <p className="text-gray-200 leading-relaxed">{message.text}</p>
                    {message.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className="mt-3 flex items-center space-x-3 p-3 bg-purple-900/20 rounded-xl cursor-pointer hover:bg-purple-900/30 transition-colors border border-purple-500/20"
                        onClick={() => window.open(attachment.url, "_blank")}
                      >
                        <FileText className="w-5 h-5 text-purple-300" />
                        <span className="text-sm text-purple-300 font-medium">
                          {attachment.name}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <span className="text-xs text-gray-400">
                        {message.timestamp}
                      </span>
                      {message.sender === "me" && (
                        <CheckCheck
                          className={`w-4 h-4 ${
                            message.status === "read"
                              ? "text-purple-400"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Message Input */}
            <div className="p-6 border-t border-purple-900/20">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <button
                  type="button"
                  onClick={handleFileAttachment}
                  className="p-3 hover:bg-purple-600/10 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-purple-300" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input flex-1 rounded-xl px-5 py-3 text-gray-200 placeholder-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 hover:bg-purple-600/10 rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-purple-300" />
                </button>
                <button
                  type="submit"
                  className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25"
                  title="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </StyledChatPage>
  );
};

export default ChatPage;

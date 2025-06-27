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
} from "lucide-react";
import styled from "styled-components";

const StyledChatPage = styled.div`
  .chat-container {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .chat-sidebar {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(139, 92, 246, 0.2);
  }

  .chat-list-item {
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .chat-list-item:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.2);
  }

  .chat-list-item.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
  }

  .message-input {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .message-input:focus {
    border-color: rgba(139, 92, 246, 0.4);
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }

  .message-bubble {
    max-width: 80%;
    animation: fadeIn 0.3s ease-out;
  }

  .message-bubble.sent {
    background: rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .message-bubble.received {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
      {/* Background gradient effects */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 py-8">
        <div className="chat-container rounded-2xl overflow-hidden h-[calc(100vh-8rem)] flex">
          {/* Chat Sidebar */}
          <div className="chat-sidebar w-80 flex-shrink-0 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-purple-900/20">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search conversations..."
                  className="w-full bg-black/20 text-gray-200 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm border border-purple-900/20 focus:border-purple-500/40 focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center mt-4 space-x-2">
                <button
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    filter === "all"
                      ? "bg-purple-600/20 text-purple-300"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10"
                  }`}
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    filter === "vc"
                      ? "bg-purple-600/20 text-purple-300"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10"
                  }`}
                  onClick={() => handleFilterChange("vc")}
                >
                  VC
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    filter === "angel"
                      ? "bg-purple-600/20 text-purple-300"
                      : "bg-black/20 text-gray-400 hover:bg-purple-600/10"
                  }`}
                  onClick={() => handleFilterChange("angel")}
                >
                  Angel
                </button>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`chat-list-item p-4 cursor-pointer ${
                    activeChat === contact.id ? "active" : ""
                  }`}
                  onClick={() => setActiveChat(contact.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                          contact.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-200 truncate">
                          {contact.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {contact.unread > 0 && (
                            <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {contact.unread}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {contact.lastActive}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-purple-300 mt-0.5">
                        {contact.role} • {contact.company}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {contact.lastMessage}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 text-purple-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        <span className="text-purple-300">Status:</span>{" "}
                        {contact.meetingStatus}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Main Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {activeContact && (
              <div className="p-4 border-b border-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeContact.avatar}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h2 className="text-gray-200 font-semibold">
                        {activeContact.name}
                      </h2>
                      <p className="text-sm text-purple-300">
                        {activeContact.role} • {activeContact.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleAudioCall(activeContact)}
                      className="p-2 hover:bg-purple-600/10 rounded-full transition-all"
                      title="Start audio call"
                    >
                      <Phone className="w-5 h-5 text-purple-300" />
                    </button>
                    <button
                      onClick={() => handleVideoCall(activeContact)}
                      className="p-2 hover:bg-purple-600/10 rounded-full transition-all"
                      title="Start video call"
                    >
                      <Video className="w-5 h-5 text-purple-300" />
                    </button>
                    <button
                      onClick={() => handleScheduleMeeting(activeContact)}
                      className="p-2 hover:bg-purple-600/10 rounded-full transition-all"
                      title="Schedule meeting"
                    >
                      <Calendar className="w-5 h-5 text-purple-300" />
                    </button>
                  </div>
                </div>
                {/* Additional contact info */}
                <div className="mt-3 p-2 bg-purple-900/10 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-purple-300">Investment Focus:</span>
                      <p className="text-gray-300">
                        {activeContact.investmentFocus?.join(", ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-purple-300">Portfolio Size:</span>
                      <p className="text-gray-300">
                        {activeContact.portfolioSize}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`message-bubble rounded-2xl px-4 py-2 ${
                      message.sender === "me" ? "sent" : "received"
                    }`}
                  >
                    <p className="text-gray-200">{message.text}</p>
                    {message.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className="mt-2 flex items-center space-x-2 p-2 bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-900/30 transition-colors"
                        onClick={() => window.open(attachment.url, "_blank")}
                      >
                        <FileText className="w-4 h-4 text-purple-300" />
                        <span className="text-sm text-purple-300">
                          {attachment.name}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-end mt-1 space-x-1">
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
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-purple-900/20">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <button
                  type="button"
                  onClick={handleFileAttachment}
                  className="p-2 hover:bg-purple-600/10 rounded-full transition-all"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-purple-300" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input flex-1 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-purple-600/10 rounded-full transition-all"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-purple-300" />
                </button>
                <button
                  type="submit"
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-all"
                  title="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StyledChatPage>
  );
};

export default ChatPage;

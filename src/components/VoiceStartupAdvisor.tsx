import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX, Database } from 'lucide-react';

// Type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface BusinessData {
  companyName: string;
  industry: string;
  stage: string;
  monthlyRevenue: number;
  burnRate: number;
  teamSize: number;
  customerCount: number;
  churnRate: number;
  cac: number;
  ltv: number;
  marketSize: number;
  lastUpdated: string;
}

interface VoiceStartupAdvisorProps {
  businessId?: string;
}

const VoiceStartupAdvisor: React.FC<VoiceStartupAdvisorProps> = ({ businessId = "demo-business-123" }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI startup advisor with voice capabilities powered by Eleven Labs. I have access to your business data and can provide personalized advice. You can type or speak to me!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load business data on component mount
    loadBusinessData();
  }, [businessId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load business data from MongoDB (simulated)
  const loadBusinessData = async () => {
    try {
      const response = await fetch(`/api/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessData(data);
      }
    } catch (error) {
      console.error('Failed to load business data:', error);
      // Demo data fallback
      setBusinessData({
        companyName: "TechStartup Inc",
        industry: "SaaS",
        stage: "Series A",
        monthlyRevenue: 45000,
        burnRate: 25000,
        teamSize: 12,
        customerCount: 1200,
        churnRate: 5.2,
        cac: 150,
        ltv: 2400,
        marketSize: 50000000,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // Enhanced Gemini API call with business context
  const callGeminiAPI = async (userMessage: string, businessContext: BusinessData | null) => {
    const response = await fetch('/api/gemini-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userMessage, 
        businessData: businessContext,
        businessId 
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.message;
  };

  // Eleven Labs Text-to-Speech
  const speakWithElevenLabs = async (text: string) => {
    if (!voiceEnabled) return;
    
    setIsLoadingAudio(true);
    setIsSpeaking(true);
    
    try {
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleSendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await callGeminiAPI(messageText, businessData);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages((prev: Message[]) => [...prev, botMessage]);
      
      // Speak the response using Eleven Labs if voice is enabled
      if (voiceEnabled) {
        await speakWithElevenLabs(botResponse);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      setVoiceEnabled(!voiceEnabled);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "How can I reduce my customer acquisition cost?",
    "What's the best strategy to improve my churn rate?",
    "When should I consider raising my next funding round?",
    "How can I optimize my pricing strategy?",
    "What metrics should I focus on for growth?"
  ];

  return (
    <div className="flex flex-col h-[700px] bg-gray-50 rounded-lg shadow-lg">
      {/* Hidden audio element for Eleven Labs playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">AI Startup Advisor</h3>
              <p className="text-xs text-blue-100">Powered by Gemini & Eleven Labs</p>
              {businessData && (
                <p className="text-sm text-blue-100">
                  Connected to {businessData.companyName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSpeaking}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                title="Stop speaking"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            {businessData && (
              <div className="flex items-center space-x-1 bg-blue-500 px-2 py-1 rounded text-xs">
                <Database className="w-3 h-3" />
                <span>Data Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Data Summary */}
      {businessData && (
        <div className="bg-white border-b p-3">
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Revenue: ${businessData.monthlyRevenue?.toLocaleString()}/mo
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              Burn: ${businessData.burnRate?.toLocaleString()}/mo
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Churn: {businessData.churnRate}%
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              CAC: ${businessData.cac}
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Team: {businessData.teamSize}
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border shadow-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Analyzing your business data...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(isSpeaking || isLoadingAudio) && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="bg-white border shadow-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  {isLoadingAudio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">Generating speech...</span>
                    </>
                  ) : (
                    <>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500">Speaking with Eleven Labs...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t bg-white">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(prompt)}
              className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors text-gray-700"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <textarea
            ref={chatInputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your business or speak to me..."
            className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            disabled={isLoading}
          />
          <div className="flex flex-col space-y-2">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStartupAdvisor;
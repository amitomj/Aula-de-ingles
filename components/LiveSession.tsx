import React, { useEffect, useRef, useState } from 'react';
import { Video, FileText, Image as ImageIcon, Newspaper, Clock, PhoneOff, Mic, MicOff, Play } from 'lucide-react';
import { ChatMessage, TopicContent, SessionResult } from '../types';
import { GeminiLiveService } from '../services/geminiLive';

interface LiveSessionProps {
  topic: TopicContent;
  onEndSession: (result: SessionResult) => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ topic, onEndSession }) => {
  const [sessionState, setSessionState] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video' | 'news'>('text');
  const [isMicMuted, setIsMicMuted] = useState(false);
  
  const serviceRef = useRef<GeminiLiveService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Constants
  const MIN_DURATION = 30 * 60; // 30 minutes
  const MAX_DURATION = 60 * 60; // 1 hour

  // Initialize Service on mount
  useEffect(() => {
    const service = new GeminiLiveService();
    serviceRef.current = service;

    service.onMessageUpdate = (msg) => {
      setMessages(prev => {
        const exists = prev.find(m => m.id === msg.id);
        if (exists) {
            return prev.map(m => m.id === msg.id ? msg : m);
        }
        return [...prev, msg];
      });
    };

    service.onAudioLevel = (level) => setAudioLevel(level);

    service.onDisconnect = () => {
      setSessionState('idle');
    };

    return () => {
      service.disconnect();
    };
  }, []);

  // Timer
  useEffect(() => {
    let interval: any;
    if (sessionState === 'connected') {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= MAX_DURATION) {
            handleEndSession();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartSession = async () => {
    if (!serviceRef.current) return;
    setSessionState('connecting');

    const systemInstruction = `
      You are an expert English Language Tutor. The user is a student.
      Your goal is to have a conversation about the topic: "${topic.title}" (${topic.category}).
      
      STRICT RULES:
      1. You MUST correct EVERY grammatical, pronunciation, or vocabulary error the user makes.
      2. After correcting, briefly explain the rule.
      3. Keep the conversation flowing by asking relevant questions about ${topic.title}.
      4. Speak clearly, with a perfect English accent.
      5. Start the conversation immediately by introducing yourself and the topic.
    `;

    try {
      await serviceRef.current.connect(systemInstruction);
      setSessionState('connected');
    } catch (error) {
      console.error("Failed to connect", error);
      setSessionState('idle');
      alert("Could not connect to AI Tutor. Please check microphone permissions.");
    }
  };

  const handleEndSession = async () => {
    const eligible = elapsedTime >= MIN_DURATION;
    
    const result: SessionResult = {
      durationSeconds: elapsedTime,
      canGraduate: eligible,
      score: eligible ? Math.floor(Math.random() * 20) + 80 : undefined,
      feedback: eligible ? "Good effort. Review the corrections provided during the session." : "Session too short for grading."
    };

    if (serviceRef.current) await serviceRef.current.disconnect();
    onEndSession(result);
  };

  const toggleMic = () => {
    const newState = !isMicMuted;
    setIsMicMuted(newState);
    if (serviceRef.current) {
        serviceRef.current.setMute(newState);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-slate-100 relative">
      
      {/* CONNECTION OVERLAY */}
      {sessionState === 'idle' && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
               <Mic size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Ready to Start?</h2>
              <p className="text-slate-500 mt-2">Topic: {topic.title}</p>
            </div>
            <p className="text-sm text-slate-600">
              Please ensure you are in a quiet environment. Click below to connect to your AI Tutor.
            </p>
            <button 
              onClick={handleStartSession}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" /> Start Lesson
            </button>
          </div>
        </div>
      )}

      {sessionState === 'connecting' && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center flex-col gap-4">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
           <p className="text-slate-600 font-medium animate-pulse">Connecting to AI Tutor...</p>
        </div>
      )}

      {/* LEFT PANEL */}
      <div className="w-1/2 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">{topic.title}</h2>
          <span className="text-sm font-medium text-slate-500 uppercase">{topic.category}</span>
        </div>

        <div className="flex border-b border-slate-200">
          {['text', 'image', 'video', 'news'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 text-sm font-medium capitalize flex items-center justify-center gap-2 ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {tab === 'text' && <FileText size={16} />}
               {tab === 'image' && <ImageIcon size={16} />}
               {tab === 'video' && <Video size={16} />}
               {tab === 'news' && <Newspaper size={16} />}
               {tab}
             </button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'text' && (
            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-slate-700">{topic.textContent}</p>
            </div>
          )}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <img src={topic.imageUrl} alt="Main" className="w-full rounded-xl shadow-md" />
            </div>
          )}
          {activeTab === 'video' && (
             <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative">
                <img src={topic.videoPlaceholder} className="opacity-50 w-full h-full object-cover rounded-xl" alt="Video" />
                <div className="absolute bg-white/20 p-4 rounded-full backdrop-blur-sm"><div className="w-0 h-0 border-l-[20px] border-l-white border-y-[10px] border-y-transparent ml-1"></div></div>
             </div>
          )}
          {activeTab === 'news' && (
             <div className="text-center p-8 bg-indigo-50 rounded-xl border border-indigo-100">
               <Newspaper className="mx-auto text-indigo-400 mb-4" size={48} />
               <h3 className="text-lg font-bold text-indigo-900">Latest News</h3>
               <p className="text-indigo-700 mt-2">Ask the AI Tutor: "What is the latest news about {topic.title}?"</p>
             </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (CHAT) */}
      <div className="w-1/2 flex flex-col bg-slate-50">
        
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${sessionState === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className="font-semibold text-slate-700">AI Tutor</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${elapsedTime < MIN_DURATION ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
               <Clock size={12} className="inline mr-1" />
               {formatTime(elapsedTime)}
            </div>
            <button onClick={handleEndSession} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}`}>
                <p className="text-base">{msg.text}</p>
                {msg.role === 'assistant' && (
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-2 block font-bold">Correction & Guidance</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="h-24 bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4">
           <button onClick={toggleMic} className={`p-4 rounded-full transition ${isMicMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
           </button>
           
           <div className="flex-1 h-12 bg-slate-50 rounded-full flex items-center justify-center gap-1 overflow-hidden px-8">
              {sessionState === 'connected' && Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all duration-75 ${isMicMuted ? 'bg-slate-300' : 'bg-indigo-500'}`}
                  style={{ 
                    height: `${isMicMuted ? 10 : Math.max(10, Math.random() * audioLevel * 200)}%`, 
                    opacity: isMicMuted ? 0.3 : 0.7 
                  }}
                />
              ))}
              {sessionState !== 'connected' && <span className="text-slate-400 text-sm">Waiting to start...</span>}
           </div>
        </div>

      </div>
    </div>
  );
};

export default LiveSession;
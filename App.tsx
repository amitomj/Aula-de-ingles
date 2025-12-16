import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Star, Zap, Clock, Home, Layout, 
  BarChart2, User, Library, Search, Bell, Settings, 
  ChevronRight, Play, CheckCircle, Lock, Download, Mail,
  Mic, Headphones, Edit3, Globe, FileText, Save, RefreshCw
} from 'lucide-react';
import { AppState, TopicCategory, TopicContent, SessionResult } from './types';
import LiveSession from './components/LiveSession';
import Flashcards from './components/Flashcards';
import DictionaryTool from './components/DictionaryTool';
import ConjugatorTool from './components/ConjugatorTool';
import TranslatorTool from './components/TranslatorTool';

// --- INITIAL DATA CONSTANTS ---

const INITIAL_USER = {
  name: 'Alex Johnson',
  level: 'B1 Intermediate',
  xp: 1250,
  streak: 5,
  avatar: 'https://i.pravatar.cc/150?u=alex',
  email: 'alex.johnson@example.com',
  plan: 'Standard'
};

const INITIAL_TOPICS: TopicContent[] = [
  // --- DAILY LIFE ---
  {
    id: 'dl1',
    category: TopicCategory.DAILY_LIFE,
    title: 'The Art of Small Talk',
    description: 'Master the nuances of casual conversation in social settings. Learn to break the ice, sustain dialogue, and exit conversations gracefully.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    textContent: 'Small talk is the cornerstone of social interaction in English-speaking cultures. In this lesson, we will cover:\n\n1. **Icebreakers**: "Lovely weather we\'re having, isn\'t it?" or "How do you know the host?"\n2. **The FORD Method**: Family, Occupation, Recreation, Dreams.\n3. **Active Listening**: Using phrases like "That\'s interesting," "Really?" and "Tell me more."\n4. **Exiting**: "It was great chatting with you, I need to find my friend."\n\nKey Vocabulary: acquaintance, mingle, rapport, awkward silence.',
    newsQuery: 'social psychology communication news',
    level: 'B1',
    progress: 0,
    totalSteps: 10
  },
  {
    id: 'dl2',
    category: TopicCategory.DAILY_LIFE,
    title: 'Grocery Shopping Essentials',
    description: 'Navigate the supermarket with confidence. From asking for produce to understanding weights, measures, and dietary restrictions.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    textContent: 'Shopping for food involves specific vocabulary. We will practice:\n\n- **Sections**: Produce, Dairy, Bakery, Deli, Frozen Foods.\n- **Quantities**: A loaf of bread, a bunch of bananas, a pint of milk.\n- **Dietary Needs**: Gluten-free, organic, dairy-free, vegan.\n- **Checkout**: "Do you have a loyalty card?" "Paper or plastic?"\n\nGrammar Focus: Countable vs. Uncountable nouns (much vs. many).',
    newsQuery: 'food prices inflation news',
    level: 'A2',
    progress: 0,
    totalSteps: 8
  },

  // --- BUSINESS ---
  {
    id: 'bus1',
    category: TopicCategory.BUSINESS,
    title: 'Mastering the Job Interview',
    description: 'Prepare for high-stakes interviews with professional answers to common questions like "Tell me about yourself" and "What are your weaknesses?"',
    imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    textContent: 'A successful interview requires clear, concise, and confident English. \n\n**The STAR Method** (Situation, Task, Action, Result) is essential for behavioral questions.\n\n**Key Phrases:**\n- "I have a proven track record in..."\n- "I am looking to leverage my skills in..."\n- "My greatest strength is my ability to..."\n\nWe will also cover salary negotiation and asking follow-up questions.',
    newsQuery: 'job market trends career advice',
    level: 'C1',
    progress: 0,
    totalSteps: 15
  },
  {
    id: 'bus2',
    category: TopicCategory.BUSINESS,
    title: 'Business Email Etiquette',
    description: 'Learn to write clear, professional, and effective emails. Understand the difference between formal and semi-formal registers.',
    imageUrl: 'https://images.unsplash.com/photo-1596524430615-b46476ddff6e?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    textContent: 'Your writing style reflects your professionalism. \n\n**Openings:** "Dear Mr. Smith," vs "Hi Team,"\n**Closings:** "Sincerely," "Best regards," "Cheers,"\n**Requests:** "Could you please..." instead of "I want..."\n\nVocabulary: attachment, cc/bcc, forward, regarding, urgent, deadline.',
    newsQuery: 'remote work communication tools',
    level: 'B2',
    progress: 0,
    totalSteps: 12
  },

  // --- TRAVEL ---
  {
    id: 'trv1',
    category: TopicCategory.TRAVEL,
    title: 'Airport & Flight Navigation',
    description: 'From check-in to baggage claim, learn the essential vocabulary to travel the world without getting lost.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=800',
    textContent: 'Airports can be stressful. This lesson covers:\n\n1. **Check-in**: Boarding pass, luggage allowance, carry-on.\n2. **Security**: "Remove your shoes," "Laptops out of the bag."\n3. **In-flight**: "Chicken or pasta?" "Fasten your seatbelt."\n4. **Arrival**: Customs, immigration, baggage claim, declaring goods.\n\nPhrasal Verbs: Take off, touch down, check in, drop off.',
    newsQuery: 'airline travel news',
    level: 'A2',
    progress: 0,
    totalSteps: 10
  },
  {
    id: 'trv2',
    category: TopicCategory.TRAVEL,
    title: 'Hotel Reservation & Check-in',
    description: 'Ensure a comfortable stay by mastering hotel interactions, from booking a room to requesting amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    textContent: 'Check-in procedures, asking for amenities, and check-out vocabulary.\n\n**Key Dialogues:**\n- "I have a reservation under the name..."\n- "Is breakfast included?"\n- "Could I have a late check-out?"\n- "The air conditioning isn\'t working."\n\nVocabulary: suite, vacancy, concierge, shuttle service, deposit.',
    newsQuery: 'hospitality industry trends',
    level: 'B1',
    progress: 0,
    totalSteps: 8
  },

  // --- TECHNOLOGY ---
  {
    id: 'tech1',
    category: TopicCategory.TECHNOLOGY,
    title: 'Artificial Intelligence & Ethics',
    description: 'Discuss the rapid advancement of AI, machine learning, and the ethical considerations shaping our future.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    textContent: 'AI is changing how we work and live. \n\n**Topics for Discussion:**\n- **Automation**: Will robots take our jobs?\n- **Bias**: How do we ensure algorithms are fair?\n- **Generative AI**: Creativity vs. Computation.\n\n**Vocabulary:** Neural networks, large language models, singularity, algorithm, data privacy, regulation.',
    newsQuery: 'artificial intelligence regulation news',
    level: 'C1',
    progress: 0,
    totalSteps: 14
  },
  {
    id: 'tech2',
    category: TopicCategory.TECHNOLOGY,
    title: 'Cybersecurity Basics',
    description: 'Understand the terminology of online safety, hacking, and data protection in the digital age.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1563206767-5b1d97299337?auto=format&fit=crop&q=80&w=800',
    textContent: 'Protecting digital assets is crucial. \n\n**Key Concepts:**\n- **Phishing**: Fraudulent emails.\n- **Malware**: Malicious software.\n- **Encryption**: Scrambling data for security.\n- **Two-Factor Authentication (2FA)**.\n\nDiscussion: The balance between privacy and security.',
    newsQuery: 'cybersecurity breaches news',
    level: 'B2',
    progress: 0,
    totalSteps: 10
  },

  // --- JUSTICE & LAW ---
  {
    id: 'law1',
    category: TopicCategory.JUSTICE_LAW,
    title: 'The Courtroom Process',
    description: 'Navigate the complex world of legal English, understanding the roles of the judge, jury, and counsel.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    textContent: 'Legal vocabulary is precise and formal. \n\n**Key Roles:** Judge, Jury, Plaintiff (accuser), Defendant (accused), Prosecutor, Defense Attorney.\n**Key Procedures:** Opening statement, cross-examination, objection (sustained/overruled), closing argument, verdict, sentencing.\n\nIdiom: "The jury is still out" (a decision hasn\'t been made yet).',
    newsQuery: 'supreme court decisions news',
    level: 'C2',
    progress: 0,
    totalSteps: 12
  },

  // --- POLITICS ---
  {
    id: 'pol1',
    category: TopicCategory.POLITICS,
    title: 'Electoral Systems & Democracy',
    description: 'Compare different voting systems, understand political campaigns, and discuss democratic values.',
    imageUrl: 'https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1529101091760-6149d3c80a9c?auto=format&fit=crop&q=80&w=800',
    textContent: 'Politics affects everyone. \n\n**Vocabulary:**\n- **Ballot**: The paper used to vote.\n- **Constituency**: The group of voters in a specified area.\n- **Incumbent**: The current holder of an office.\n- **Partisan**: Strongly supporting a specific party.\n\nDiscussion: First-past-the-post vs. Proportional Representation.',
    newsQuery: 'global election results',
    level: 'C1',
    progress: 0,
    totalSteps: 10
  },

  // --- HOBBIES ---
  {
    id: 'hob1',
    category: TopicCategory.HOBBIES,
    title: 'Digital Photography 101',
    description: 'Learn the technical and artistic vocabulary of photography to describe images and camera settings.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    videoPlaceholder: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&q=80&w=800',
    textContent: 'Taking a picture is easy; making art is hard. \n\n**The Exposure Triangle:**\n1. **Aperture**: Depth of field (blurred background).\n2. **Shutter Speed**: Motion blur vs. freezing action.\n3. **ISO**: Sensor sensitivity (grain/noise).\n\n**Composition:** Rule of thirds, leading lines, framing.',
    newsQuery: 'photography awards winners',
    level: 'B1',
    progress: 0,
    totalSteps: 8
  }
];

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [user, setUser] = useState(INITIAL_USER);
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<TopicContent | null>(null);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  
  // New Tool State
  const [activeTool, setActiveTool] = useState<'none' | 'dictionary' | 'conjugator' | 'translator' | 'flashcards'>('none');
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE LOGIC ---

  useEffect(() => {
    // Load data from local storage on mount
    const savedUser = localStorage.getItem('linguistai_user');
    const savedTopics = localStorage.getItem('linguistai_topics');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Auto-save whenever user or topics change, but only after initial load
    if (isLoaded) {
      localStorage.setItem('linguistai_user', JSON.stringify(user));
      localStorage.setItem('linguistai_topics', JSON.stringify(topics));
    }
  }, [user, topics, isLoaded]);

  const saveProgressManual = () => {
    localStorage.setItem('linguistai_user', JSON.stringify(user));
    localStorage.setItem('linguistai_topics', JSON.stringify(topics));
    alert("Progress saved successfully!");
  };

  const startSession = (topic: TopicContent) => {
    setSelectedTopic(topic);
    setAppState(AppState.SESSION);
  };

  const finishSession = (result: SessionResult) => {
    setLastResult(result);
    setAppState(AppState.SUMMARY);

    if (result.canGraduate && selectedTopic) {
      // Update User XP
      const xpGained = result.score ? Math.floor(result.score * 1.5) : 50;
      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpGained,
        // Simple mock level up logic
        level: prev.xp + xpGained > 2000 ? 'B2 Upper Intermediate' : prev.level
      }));

      // Update Topic Progress
      setTopics(prev => prev.map(t => {
        if (t.id === selectedTopic.id) {
          // Increment progress by 25% per session, capping at 100
          const newProgress = Math.min(100, (t.progress || 0) + 25);
          return { ...t, progress: newProgress };
        }
        return t;
      }));
    }
  };

  const backToDashboard = () => {
    setAppState(AppState.DASHBOARD);
    setSelectedTopic(null);
    setLastResult(null);
  };

  // --- COMPONENT: SIDEBAR ---
  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <BookOpen size={24} />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">EnglishMaster</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {[
          { icon: Home, label: 'Home', state: AppState.DASHBOARD },
          { icon: Layout, label: 'Courses', state: AppState.LESSONS },
          { icon: BarChart2, label: 'Progress', state: AppState.PROGRESS },
          { icon: Library, label: 'Resources', state: AppState.RESOURCES },
          { icon: User, label: 'Profile', state: AppState.PROFILE },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setAppState(item.state)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
              appState === item.state 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Upgrade Plan Button REMOVED as per request */}
      <div className="p-6 border-t border-slate-100 text-xs text-slate-400 text-center">
         v1.2.0 • Auto-save enabled
      </div>
    </aside>
  );

  // --- VIEW: DASHBOARD ---
  const DashboardView = () => {
    // Find active topic (first one started but not finished, or first available)
    const activeTopic = topics.find(t => (t.progress || 0) > 0 && (t.progress || 0) < 100) || topics[0];

    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500 mt-1">You're on a <span className="font-bold text-indigo-600">{user.streak}-day streak</span>. Keep up the momentum!</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={saveProgressManual} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-bold transition"
              title="Save Progress"
            >
              <Save size={16} /> Save
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search lessons..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Current Level</p>
              <h3 className="text-2xl font-bold text-slate-800">{user.level}</h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">+25% progress</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500"><BarChart2 size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total XP</p>
              <h3 className="text-2xl font-bold text-slate-800">{user.xp.toLocaleString()}</h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">+150 today</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500"><Zap size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Daily Streak</p>
              <h3 className="text-2xl font-bold text-slate-800">{user.streak} Days</h3>
              <span className="text-xs text-slate-400 mt-2 inline-block">Best: 12 days</span>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500"><Award size={24} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Lesson Card */}
            {activeTopic && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img src={activeTopic.imageUrl} alt="Lesson" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">CONTINUE LEARNING</div>
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeTopic.title}</h2>
                    <p className="text-slate-500 mb-6">{activeTopic.description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${activeTopic.progress || 0}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{activeTopic.progress || 0}% Completed</span>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => startSession(activeTopic)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2"
                      >
                        <Play size={18} fill="currentColor" /> {activeTopic.progress === 0 ? 'Start' : 'Resume'} Lesson
                      </button>
                    </div>
                </div>
              </div>
            )}

            {/* Recommended Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-start gap-4 cursor-pointer hover:bg-orange-100 transition">
                   <div className="bg-white p-3 rounded-full text-orange-500 shadow-sm"><Edit3 size={20} /></div>
                   <div>
                      <h4 className="font-bold text-slate-800">Mistake Review</h4>
                      <p className="text-sm text-slate-600 mt-1">Review 5 words you missed in the last session.</p>
                      <span className="text-xs font-bold text-orange-600 mt-3 block">High Priority</span>
                   </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4 cursor-pointer hover:bg-blue-100 transition">
                   <div className="bg-white p-3 rounded-full text-blue-500 shadow-sm"><Mic size={20} /></div>
                   <div>
                      <h4 className="font-bold text-slate-800">Speaking Practice</h4>
                      <p className="text-sm text-slate-600 mt-1">Join a 5 min conversation room.</p>
                      <span className="text-xs font-bold text-blue-600 mt-3 block">Live Now</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
             {/* Leaderboard */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2"><Award className="text-yellow-500" size={20} /> Silver League</h3>
                   <button className="text-xs text-indigo-600 font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                   {[
                     { name: 'Sarah M.', xp: '1,450 XP', img: 'https://i.pravatar.cc/150?u=1' },
                     { name: 'You', xp: `${user.xp} XP`, img: user.avatar, active: true },
                     { name: 'John D.', xp: '1,120 XP', img: 'https://i.pravatar.cc/150?u=3' },
                   ].map((u, i) => (
                     <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${u.active ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-slate-400 w-4">{i+1}</span>
                           <img src={u.img} alt={u.name} className="w-8 h-8 rounded-full" />
                           <span className={`text-sm font-semibold ${u.active ? 'text-indigo-900' : 'text-slate-700'}`}>{u.name}</span>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">{u.xp}</span>
                     </div>
                   ))}
                </div>
                <p className="text-xs text-slate-400 text-center mt-4">Top 10 promote to Gold League in 2 days.</p>
             </div>

             {/* Word of the Day */}
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Word of the Day</p>
                   <h3 className="text-3xl font-bold mb-1">Serendipity</h3>
                   <p className="text-indigo-200 italic mb-4 text-sm">/ˌser.ənˈdɪp.ə.ti/</p>
                   <p className="text-white/90 text-sm leading-relaxed mb-6">The occurrence and development of events by chance in a happy or beneficial way.</p>
                   <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-full py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                      <Headphones size={16} /> Listen
                   </button>
                </div>
                <Zap className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
             </div>
          </div>
        </div>
      </div>
    );
  };

  // --- VIEW: LESSONS ---
  const LessonsView = () => (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Course Library</h1>
            <p className="text-slate-500 text-sm">Explore professional content to boost your fluency.</p>
         </div>
         <div className="flex gap-8">
            <div className="text-center">
               <p className="text-xs text-slate-400 font-bold uppercase">XP Earned</p>
               <h3 className="text-xl font-bold text-slate-800">{user.xp}</h3>
            </div>
            <div className="text-center border-l border-slate-100 pl-8">
               <p className="text-xs text-slate-400 font-bold uppercase">Lessons</p>
               <h3 className="text-xl font-bold text-slate-800">{topics.filter(t => (t.progress || 0) > 0).length}/{topics.length}</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {topics.map(topic => (
            <div 
              key={topic.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={topic.imageUrl} 
                  alt={topic.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  {topic.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                   <Clock size={12} /> ~45 min
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{topic.title}</h3>
                   <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{topic.level}</span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{topic.description}</p>
                
                {/* Progress Bar */}
                {(topic.progress || 0) > 0 && (
                   <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                         <span>Progress</span>
                         <span>{topic.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 rounded-full" style={{ width: `${topic.progress}%` }}></div>
                      </div>
                   </div>
                )}

                <button 
                  onClick={() => startSession(topic)}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                    (topic.progress || 0) > 0 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-slate-50 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Play size={18} fill="currentColor" /> {(topic.progress || 0) > 0 ? 'Resume' : 'Start Lesson'}
                </button>
              </div>
            </div>
         ))}
      </div>
    </div>
  );

  // --- VIEW: PROGRESS ---
  const ProgressView = () => (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Learning Progress</h1>
            <p className="text-slate-500">Keep up the great work! You're getting closer to your fluency goals.</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm">+ Set New Goal</button>
       </div>

       {/* Top Stats */}
       <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Day Streak', val: user.streak, icon: '🔥', color: 'orange' },
            { label: 'Total XP', val: user.xp.toLocaleString(), icon: '⚡', color: 'yellow' },
            { label: 'Words', val: '850', icon: '📘', color: 'blue' },
            { label: 'Hours', val: '42h', icon: '🟣', color: 'purple' },
          ].map((s, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${s.color}-50 text-lg`}>{s.icon}</div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{s.val}</h3>
             </div>
          ))}
       </div>

       {/* Simple Persistence Notice */}
       <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-sm flex items-center gap-2">
          <CheckCircle size={16} /> Your progress is automatically saved to your browser.
       </div>
    </div>
  );

  // --- VIEW: PROFILE ---
  const ProfileView = () => (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
         <div className="relative">
            <img src={user.avatar} alt="Alex" className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white border-2 border-white hover:bg-blue-700">
               <Edit3 size={16} />
            </button>
         </div>
         <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">ONLINE</span>
            </div>
            <p className="text-slate-500 mb-4">Member since 2023 • {user.plan}</p>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden max-w-sm mx-auto md:mx-0">
               <div className="h-full bg-blue-600 w-[70%]"></div>
            </div>
            <p className="text-xs text-blue-600 font-bold mt-2">Level: {user.level}</p>
         </div>
         
         <div className="flex gap-4">
            <div className="text-center px-4">
               <h4 className="text-2xl font-bold text-slate-900">{user.streak}</h4>
               <span className="text-xs text-slate-500 font-bold uppercase">Day Streak</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200">
               <h4 className="text-2xl font-bold text-slate-900">1,240</h4>
               <span className="text-xs text-slate-500 font-bold uppercase">Words Learned</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200">
               <h4 className="text-2xl font-bold text-slate-900">45h</h4>
               <span className="text-xs text-slate-500 font-bold uppercase">Hours Total</span>
            </div>
         </div>
      </div>
      
      <div className="flex justify-end">
         <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-bold">
            <RefreshCw size={14} /> Reset All Progress (Debug)
         </button>
      </div>
    </div>
  );

  // --- VIEW: RESOURCES ---
  const ResourcesView = () => (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Banner */}
      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
         <div className="relative z-10 max-w-2xl mx-auto">
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Knowledge Hub</span>
            <h1 className="text-4xl font-bold mb-4">Resource Library</h1>
            <p className="text-slate-300 mb-8">Everything you need to master English, from grammar guides to cultural tips.</p>
            <div className="relative max-w-lg mx-auto">
               <input type="text" placeholder="What do you want to learn today?" className="w-full py-4 pl-6 pr-32 rounded-full text-slate-900 focus:outline-none" />
               <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-bold hover:bg-blue-700 transition">Search</button>
            </div>
         </div>
         {/* Abstract BG */}
         <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600 rounded-full blur-3xl"></div>
         </div>
      </div>

      {/* Quick Access */}
      <div>
         <h3 className="font-bold text-slate-900 mb-6">Quick Access</h3>
         <div className="grid grid-cols-4 gap-6">
            <div onClick={() => setActiveTool('dictionary')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition cursor-pointer group">
               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition"><BookOpen size={24} /></div>
               <h4 className="font-bold text-slate-800">Dictionary</h4>
            </div>
            <div onClick={() => setActiveTool('conjugator')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition cursor-pointer group">
               <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition"><Settings size={24} /></div>
               <h4 className="font-bold text-slate-800">Conjugator</h4>
            </div>
            <div onClick={() => setActiveTool('translator')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition cursor-pointer group">
               <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition"><Globe size={24} /></div>
               <h4 className="font-bold text-slate-800">Translator</h4>
            </div>
            <div onClick={() => setActiveTool('flashcards')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition cursor-pointer group">
               <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition"><Zap size={24} /></div>
               <h4 className="font-bold text-slate-800">Flashcards</h4>
            </div>
         </div>
      </div>
    </div>
  );

  // --- SUMMARY VIEW ---
  const SummaryView = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden text-center">
        <div className={`p-8 ${lastResult?.canGraduate ? 'bg-green-600' : 'bg-slate-700'} text-white`}>
          {lastResult?.canGraduate ? (
             <Award className="mx-auto mb-4 opacity-90" size={64} />
          ) : (
             <Clock className="mx-auto mb-4 opacity-90" size={64} />
          )}
          <h2 className="text-3xl font-bold mb-2">
            {lastResult?.canGraduate ? 'Lesson Complete!' : 'Lesson Incomplete'}
          </h2>
          <p className="text-white/80">
            {lastResult?.canGraduate ? 'You have successfully finished the session.' : 'Minimum 30 minutes required for grading.'}
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <span className="block text-slate-400 text-xs font-bold uppercase">Duration</span>
               <span className="text-2xl font-mono text-slate-800">
                 {Math.floor((lastResult?.durationSeconds || 0) / 60)}m
               </span>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <span className="block text-slate-400 text-xs font-bold uppercase">Score</span>
               <div className="flex items-center justify-center gap-1 text-2xl font-bold text-indigo-600">
                 {lastResult?.score ? (
                   <>
                     {lastResult.score}<span className="text-sm text-slate-400 font-normal">/100</span>
                   </>
                 ) : (
                   <span className="text-slate-400 text-lg">N/A</span>
                 )}
               </div>
             </div>
          </div>
          
          {lastResult?.canGraduate && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-left">
              <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                <Star size={16} className="fill-amber-600 text-amber-600" />
                Feedback
              </h4>
              <p className="text-amber-700 text-sm">{lastResult.feedback}</p>
            </div>
          )}

          <button 
            onClick={backToDashboard}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // --- RENDER MAIN LAYOUT ---
  if (appState === AppState.SESSION && selectedTopic) {
    return (
      <LiveSession 
        topic={selectedTopic} 
        onEndSession={finishSession}
      />
    );
  }

  if (appState === AppState.SUMMARY) {
    return <SummaryView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen scrollbar-hide">
        {appState === AppState.DASHBOARD && <DashboardView />}
        {appState === AppState.LESSONS && <LessonsView />}
        {appState === AppState.PROGRESS && <ProgressView />}
        {appState === AppState.PROFILE && <ProfileView />}
        {appState === AppState.RESOURCES && <ResourcesView />}
      </main>
      
      {/* Tool Overlays */}
      {activeTool === 'flashcards' && <Flashcards onClose={() => setActiveTool('none')} />}
      {activeTool === 'dictionary' && <DictionaryTool onClose={() => setActiveTool('none')} />}
      {activeTool === 'conjugator' && <ConjugatorTool onClose={() => setActiveTool('none')} />}
      {activeTool === 'translator' && <TranslatorTool onClose={() => setActiveTool('none')} />}
    </div>
  );
}

export default App;
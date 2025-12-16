import React, { useState } from 'react';
import { X, Search, Settings } from 'lucide-react';

interface ConjugatorToolProps {
  onClose: () => void;
}

const VERBS = [
  { 
    infinitive: 'to be', 
    simple_present: ['am', 'are', 'is', 'are', 'are', 'are'],
    simple_past: ['was', 'were', 'was', 'were', 'were', 'were'],
    future: ['will be']
  },
  { 
    infinitive: 'to have', 
    simple_present: ['have', 'have', 'has', 'have', 'have', 'have'],
    simple_past: ['had'],
    future: ['will have']
  },
  { 
    infinitive: 'to speak', 
    simple_present: ['speak', 'speak', 'speaks', 'speak', 'speak', 'speak'],
    simple_past: ['spoke'],
    future: ['will speak']
  },
  { 
    infinitive: 'to go', 
    simple_present: ['go', 'go', 'goes', 'go', 'go', 'go'],
    simple_past: ['went'],
    future: ['will go']
  },
  { 
    infinitive: 'to eat', 
    simple_present: ['eat', 'eat', 'eats', 'eat', 'eat', 'eat'],
    simple_past: ['ate'],
    future: ['will eat']
  },
];

const ConjugatorTool: React.FC<ConjugatorToolProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = VERBS.filter(v => v.infinitive.includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-lg font-bold">Verb Conjugator</h2>
          </div>
          <button onClick={onClose} className="hover:bg-purple-500 p-2 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search for a verb (e.g. 'to be')..." 
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               autoFocus
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {filtered.length > 0 ? (
             filtered.map((verb, idx) => (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-3 border-b border-slate-100">
                     <h3 className="text-lg font-bold text-slate-800 capitalize">{verb.infinitive}</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <span className="text-xs font-bold text-purple-600 uppercase mb-2 block">Simple Present</span>
                        <ul className="text-sm text-slate-600 space-y-1">
                           <li>I {verb.simple_present[0]}</li>
                           <li>You {verb.simple_present[1]}</li>
                           <li>He/She/It {verb.simple_present[2]}</li>
                           <li>We {verb.simple_present[3]}</li>
                           <li>You {verb.simple_present[4]}</li>
                           <li>They {verb.simple_present[5]}</li>
                        </ul>
                     </div>
                     <div>
                        <span className="text-xs font-bold text-purple-600 uppercase mb-2 block">Simple Past</span>
                         <ul className="text-sm text-slate-600 space-y-1">
                           {verb.simple_past.length === 1 ? (
                             <li>All subjects: {verb.simple_past[0]}</li>
                           ) : (
                             verb.simple_past.map((v, i) => <li key={i}>{v}</li>)
                           )}
                        </ul>
                     </div>
                     <div>
                        <span className="text-xs font-bold text-purple-600 uppercase mb-2 block">Future</span>
                        <p className="text-sm text-slate-600">All subjects: {verb.future[0]}</p>
                     </div>
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center text-slate-400 mt-10">
               <p>No verbs found for "{searchTerm}"</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ConjugatorTool;
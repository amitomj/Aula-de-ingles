import React, { useState } from 'react';
import { X, Search, BookOpen } from 'lucide-react';

interface DictionaryToolProps {
  onClose: () => void;
}

const DEFINITIONS = [
  { word: 'serendipity', type: 'noun', def: 'The occurrence and development of events by chance in a happy or beneficial way.' },
  { word: 'acquaintance', type: 'noun', def: 'A person one knows slightly, but who is not a close friend.' },
  { word: 'mingle', type: 'verb', def: 'Move freely around a place or at a social function, associating with others.' },
  { word: 'verdict', type: 'noun', def: 'A decision on a disputed issue in a civil or criminal case or an inquest.' },
  { word: 'algorithm', type: 'noun', def: 'A process or set of rules to be followed in calculations or other problem-solving operations.' },
  { word: 'ephemeral', type: 'adj', def: 'Lasting for a very short time.' },
  { word: 'resilience', type: 'noun', def: 'The capacity to withstand or to recover quickly from difficulties; toughness.' },
  { word: 'eloquent', type: 'adj', def: 'Fluent or persuasive in speaking or writing.' },
  { word: 'pragmatic', type: 'adj', def: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.' },
];

const DictionaryTool: React.FC<DictionaryToolProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = DEFINITIONS.filter(d => d.word.includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <h2 className="text-lg font-bold">Dictionary</h2>
          </div>
          <button onClick={onClose} className="hover:bg-blue-500 p-2 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search for a word..." 
               className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               autoFocus
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {filtered.length > 0 ? (
             filtered.map((item, idx) => (
               <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-blue-200 transition">
                  <div className="flex items-baseline justify-between mb-1">
                     <h3 className="text-xl font-bold text-slate-800 capitalize">{item.word}</h3>
                     <span className="text-xs font-bold text-slate-400 italic">{item.type}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.def}</p>
               </div>
             ))
           ) : (
             <div className="text-center text-slate-400 mt-10">
               <p>No definitions found for "{searchTerm}"</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryTool;
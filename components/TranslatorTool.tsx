import React, { useState } from 'react';
import { X, Globe, ArrowRight } from 'lucide-react';

interface TranslatorToolProps {
  onClose: () => void;
}

const TranslatorTool: React.FC<TranslatorToolProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    
    // Simulate API delay
    setTimeout(() => {
        // Simple mock translation simulation
        let translated = "Translation not available in offline demo.";
        if (inputText.toLowerCase().includes('hello')) translated = "Olá (Portuguese) / Hola (Spanish)";
        else if (inputText.toLowerCase().includes('good morning')) translated = "Bom dia (Portuguese) / Buenos días (Spanish)";
        else if (inputText.toLowerCase().includes('thank you')) translated = "Obrigado (Portuguese) / Gracias (Spanish)";
        else {
            translated = `[Simulated Translation to Portuguese]: ${inputText}`;
        }
        
        setOutputText(translated);
        setIsTranslating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
        <div className="bg-green-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <h2 className="text-lg font-bold">Quick Translator</h2>
          </div>
          <button onClick={onClose} className="hover:bg-green-500 p-2 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
           {/* Input */}
           <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between mb-4">
                 <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                 </select>
                 <button className="text-slate-400 hover:text-green-600" onClick={() => setInputText('')}>Clear</button>
              </div>
              <textarea 
                className="flex-1 w-full resize-none focus:outline-none text-lg text-slate-800 placeholder-slate-300"
                placeholder="Type text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
           </div>

           {/* Output */}
           <div className="flex-1 p-6 flex flex-col bg-slate-50">
              <div className="flex justify-between mb-4">
                 <select className="bg-transparent text-sm font-bold text-green-700 focus:outline-none cursor-pointer">
                    <option>Portuguese (Brazil)</option>
                    <option>Spanish</option>
                    <option>French</option>
                 </select>
              </div>
              <div className="flex-1">
                 {isTranslating ? (
                    <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    </div>
                 ) : (
                    <p className="text-lg text-slate-800">{outputText}</p>
                 )}
              </div>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end">
           <button 
             onClick={handleTranslate}
             disabled={!inputText || isTranslating}
             className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
           >
              Translate <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default TranslatorTool;
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X } from 'lucide-react';
import { Flashcard, TopicCategory } from '../types';

interface FlashcardsProps {
  onClose: () => void;
}

const MOCK_CARDS: Flashcard[] = [
  { id: '1', category: TopicCategory.DAILY_LIFE, front: 'Groceries', back: 'Food and other goods sold by a grocer or supermarket.' },
  { id: '2', category: TopicCategory.JUSTICE_LAW, front: 'Plaintiff', back: 'A person who brings a case against another in a court of law.' },
  { id: '3', category: TopicCategory.TECHNOLOGY, front: 'Algorithm', back: 'A process or set of rules to be followed in calculations or other problem-solving operations.' },
  { id: '4', category: TopicCategory.POLITICS, front: 'Ballot', back: 'A process of voting, in writing and typically in secret.' },
  { id: '5', category: TopicCategory.HOBBIES, front: 'Leisure', back: 'Use of free time for enjoyment.' },
  { id: '6', category: TopicCategory.JUSTICE_LAW, front: 'Verdict', back: 'A decision on a disputed issue in a civil or criminal case or an inquest.' },
];

const Flashcards: React.FC<FlashcardsProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % MOCK_CARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + MOCK_CARDS.length) % MOCK_CARDS.length);
  };

  const currentCard = MOCK_CARDS[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Vocabulary Flashcards</h2>
          <button onClick={onClose} className="hover:bg-indigo-500 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Card Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 perspective-1000">
          <div 
            className="relative w-full h-80 cursor-pointer group perspective"
            onClick={() => setIsFlipped(!isFlipped)}
          >
             <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front */}
                <div className="absolute w-full h-full bg-white border-2 border-indigo-100 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 backface-hidden">
                    <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-4">{currentCard.category}</span>
                    <h3 className="text-4xl font-bold text-slate-800 text-center">{currentCard.front}</h3>
                    <p className="absolute bottom-6 text-slate-400 text-sm">Tap to flip</p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full bg-indigo-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180">
                    <h3 className="text-2xl font-medium text-white text-center leading-relaxed">"{currentCard.back}"</h3>
                </div>

             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center">
            <button onClick={handlePrev} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <ArrowLeft size={20} /> Previous
            </button>
            <span className="font-mono text-slate-400">{currentIndex + 1} / {MOCK_CARDS.length}</span>
            <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg">
                Next <ArrowRight size={20} />
            </button>
        </div>
      </div>
      
      {/* 3D Transform styles utility helper for Tailwind */}
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;
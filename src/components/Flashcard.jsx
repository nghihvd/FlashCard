import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Flashcard = ({ card, onAssessment }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-md h-96 flip-card cursor-pointer mx-auto" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full glass-card flex flex-col items-center justify-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-sm font-medium text-primary mb-4 tracking-wider uppercase">Vựng tập</span>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">{card.word}</h2>
          <p className="mt-8 text-slate-400 text-sm italic">Click to flip</p>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full glass-card flex flex-col items-center justify-center backface-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <span className="text-sm font-medium text-primary mb-4 tracking-wider uppercase">Định nghĩa</span>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 text-center px-4">
            {card.definition}
          </h2>
          
          {onAssessment && (
            <div className="mt-12 flex gap-3" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => onAssessment('New')}
                className="px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
              >
                Chưa nhớ
              </button>
              <button 
                onClick={() => onAssessment('Familiar')}
                className="px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                Đã nhớ sơ
              </button>
              <button 
                onClick={() => onAssessment('Mastered')}
                className="px-4 py-2 rounded-full border border-green-200 bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition-colors"
              >
                Thuộc lòng
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;

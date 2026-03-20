import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak } from '../utils/speech';

const Card3D = ({ front, back, isFlipped, onFlip }) => {
  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(front.word);
  };

  return (
    <div 
      className={`flip-card w-full max-w-lg aspect-[4/5] cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      <div className="flip-card-inner">
        {/* Front Face */}
        <div className="flip-card-front">
          <div className="absolute top-8 left-8">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {front.pos || 'Word'}
            </span>
          </div>

          <button 
            onClick={handleSpeak}
            className="absolute top-8 right-8 p-3 rounded-2xl bg-primary/5 text-primary hover:bg-primary/20 transition-all hover:scale-110 active:scale-95 z-10"
            title="Nghe phát âm"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {front.word}
          </h2>
          <p className="mt-4 text-slate-500 font-medium italic">
            Tap to reveal definition
          </p>
          
          <div className="absolute bottom-12 w-12 h-1.5 bg-primary/20 rounded-full" />
        </div>

        {/* Back Face */}
        <div className="flip-card-back">
          <div className="absolute top-8 left-8">
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">
              Meaning
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            {back.definition}
          </h3>
          
          {back.related && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-purple-600 uppercase block mb-1">Related</span>
              <p className="text-sm text-slate-600">{back.related}</p>
            </div>
          )}
          
          <p className="mt-8 text-slate-400 text-sm italic">
            Tap to flip back
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card3D;

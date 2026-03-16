import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Eye, Play } from 'lucide-react';
import Card3D from './Card3D';

const ReviewSession = ({ cards, onAssessment }) => {
  const [step, setStep] = useState(1); // 1: Preview, 2: Practice, 3: Assessment
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Logic for moving to next card or finishing
      handleAssessment('pass');
    }
  };

  const handleAssessment = (status) => {
    onAssessment(currentCard.id, status === 'pass');
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep(1); // Back to preview for next card
      setIsFlipped(false);
    } else {
      // Completed session
      setStep(4); // Finished state
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tuyệt vời!</h2>
        <p className="text-slate-500">Bạn đã hoàn thành tất cả các thẻ hôm nay.</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={48} className="text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Hoàn thành bài học!</h2>
        <p className="text-slate-500">Dữ liệu của bạn đã được cập nhật.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20"
        >
          Tiếp tục
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-400">
            CARD {currentIndex + 1} OF {cards.length}
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase">
            Step {step}: {step === 1 ? 'Preview' : step === 2 ? 'Practice' : 'Review'}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full flex flex-col items-center"
        >
          <Card3D 
            front={{ word: currentCard.word, pos: currentCard.pos }}
            back={{ definition: currentCard.definition, related: currentCard.related }}
            isFlipped={isFlipped || step >= 2} 
            onFlip={() => step === 1 && setIsFlipped(!isFlipped)}
          />

          <div className="mt-12 flex gap-4 w-full max-w-lg">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play size={20} />
                Bắt đầu học
              </button>
            )}

            {step === 2 && (
              <button
                onClick={() => {
                  setIsFlipped(true);
                  setStep(3);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-[2rem] font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye size={20} />
                Xem kết quả
              </button>
            )}

            {step === 3 && (
              <>
                <button
                  onClick={() => handleAssessment('fail')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 text-red-500 rounded-3xl font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                >
                  <XCircle size={20} />
                  Quên
                </button>
                <button
                  onClick={() => handleAssessment('pass')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-500/10 text-green-500 rounded-3xl font-bold border border-green-500/20 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
                >
                  <CheckCircle2 size={20} />
                  Đã thuộc
                </button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReviewSession;

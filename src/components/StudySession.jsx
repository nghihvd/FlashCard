import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, RotateCcw } from 'lucide-react';
import Flashcard from './Flashcard';

const StudySession = ({ cards, onUpdateCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('preview'); // 'preview', 'quiz', 'assessment'
  const [quizInput, setQuizInput] = useState('');
  const [quizResult, setQuizResult] = useState(null); // 'correct', 'wrong', null

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setQuizResult(null);
      setQuizInput('');
    } else if (phase === 'preview') {
      setPhase('quiz');
      setCurrentIndex(0);
    } else if (phase === 'quiz') {
      setPhase('assessment');
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setQuizResult(null);
      setQuizInput('');
    }
  };

  const handleCheckQuiz = () => {
    if (quizInput.toLowerCase().trim() === currentCard.definition.toLowerCase().trim()) {
      setQuizResult('correct');
    } else {
      setQuizResult('wrong');
    }
  };

  const handleAssessment = (level) => {
    onUpdateCard(currentCard.id, { level, last_reviewed: new Date().toISOString() });
    handleNext();
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl">
        <Brain className="w-16 h-16 text-primary mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-slate-700">Chưa có thẻ nào hôm nay</h3>
        <p className="text-slate-400">Hãy thêm từ vựng mới để bắt đầu học!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Header / Progress */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">Phase: {phase}</h2>
            <p className="text-slate-500 text-sm">Reviewing your cards for today</p>
          </div>
          <span className="text-primary font-mono text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {phase === 'preview' && (
              <Flashcard card={currentCard} onAssessment={null} />
            )}

            {phase === 'quiz' && (
              <div className="glass-card max-w-md mx-auto aspect-[4/3] flex flex-col items-center justify-center gap-6">
                <span className="text-primary font-bold text-4xl mb-4">{currentCard.word}</span>
                <div className="w-full px-8">
                  <input
                    type="text"
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    placeholder="Nhập nghĩa của từ..."
                    className={`w-full p-4 glass rounded-xl border-2 transition-all outline-none text-center ${
                      quizResult === 'correct' ? 'border-green-400 bg-green-50' : 
                      quizResult === 'wrong' ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-primary'
                    }`}
                  />
                </div>
                {quizResult === null ? (
                  <button 
                    onClick={handleCheckQuiz}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className={`font-bold ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                      {quizResult === 'correct' ? 'Chính xác!' : 'Cố gắng lên!'}
                    </p>
                    <p className="text-sm text-slate-500">Đáp án: {currentCard.definition}</p>
                    <button onClick={handleNext} className="mt-2 text-primary font-bold hover:underline">Tiếp tục</button>
                  </div>
                )}
              </div>
            )}

            {phase === 'assessment' && (
              <Flashcard card={currentCard} onAssessment={handleAssessment} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="mt-12 flex justify-center items-center gap-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full glass hover:bg-white transition-all disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>

        <button 
          onClick={() => {
            setPhase('preview');
            setCurrentIndex(0);
          }}
          className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:bg-white transition-all text-sm font-semibold text-slate-600"
        >
          <RotateCcw className="w-4 h-4" /> Reset Phase
        </button>

        <button 
          onClick={handleNext}
          className="p-3 rounded-full glass hover:bg-white transition-all"
        >
          <ChevronRight className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </div>
  );
};

export default StudySession;

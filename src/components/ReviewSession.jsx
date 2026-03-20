import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Play, Home, ChevronLeft, ChevronRight, Check, X, ListCheck, Volume2 } from 'lucide-react';
import Card3D from './Card3D';
import { speak } from '../utils/speech';

const PHASES = [
  { id: 'flip-list', label: 'Xem lướt vựng' },
  { id: 'guess-meaning', label: 'Đoán định nghĩa' },
  { id: 'guess-word', label: 'Đoán từ vựng' },
  { id: 'assessment', label: 'Đánh giá ghi nhớ' }
];

const ReviewSession = ({ cards, onAssessment, onComplete, skipPreview }) => {
  const [phaseIndex, setPhaseIndex] = useState(skipPreview ? 1 : 0);
  const [currentQueue, setCurrentQueue] = useState([...cards]);
  const [totalInPhase, setTotalInPhase] = useState(cards.length);
  const [wrongCounts, setWrongCounts] = useState({}); // { id: count }
  
  // Phase 1 (Flip List) specifically needs separate index for navigation
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [checkResult, setCheckResult] = useState(null); // 'correct', 'wrong', null
  const [isCompleted, setIsCompleted] = useState(false);

  const currentPhase = PHASES[phaseIndex];
  const currentCard = currentPhase.id === 'flip-list' ? cards[previewIndex] : currentQueue[0];

  const nextCard = (isCorrect) => {
    if (isCorrect) {
      const remaining = currentQueue.slice(1);
      if (remaining.length === 0) {
        if (phaseIndex < PHASES.length - 1) {
          // Move to next phase
          const nextIdx = phaseIndex + 1;
          setPhaseIndex(nextIdx);
          setCurrentQueue([...cards]);
          setTotalInPhase(cards.length);
          setWrongCounts({});
          setIsFlipped(false);
          setUserInput('');
          setCheckResult(null);
        } else {
          setIsCompleted(true);
        }
      } else {
        setCurrentQueue(remaining);
        setIsFlipped(false);
        setUserInput('');
        setCheckResult(null);
      }
    } else {
      // Wrong answer
      const card = currentQueue[0];
      setWrongCounts(prev => ({
        ...prev,
        [card.id]: (prev[card.id] || 0) + 1
      }));
      
      // Move to end of queue
      const updatedQueue = [...currentQueue.slice(1), card];
      setCurrentQueue(updatedQueue);
      
      setUserInput('');
      setCheckResult(null);
      setIsFlipped(false);
    }
  };

  const handleAssessment = (status) => {
    onAssessment(currentCard.id, status === 'pass');
    nextCard(true);
  };

  const handleFlipListNext = () => {
    // Transition to Phase 2 (guess-meaning)
    const nextIdx = phaseIndex + 1;
    setPhaseIndex(nextIdx);
    setCurrentQueue([...cards]);
    setTotalInPhase(cards.length);
    setWrongCounts({});
    setIsFlipped(false);
    setUserInput('');
    setCheckResult(null);
  };

  const prevPreview = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
      setIsFlipped(false);
    }
  };

  const nextPreview = () => {
    if (previewIndex < cards.length - 1) {
      setPreviewIndex(previewIndex + 1);
      setIsFlipped(false);
    }
  };

  const checkGuess = () => {
    const target = currentPhase.id === 'guess-meaning' ? currentCard.definition : currentCard.word;
    
    const cleanInput = userInput.toLowerCase().replace(/\s+/g, '');
    const cleanTarget = target.toLowerCase().replace(/\s+/g, '');

    if (currentPhase.id === 'guess-meaning') {
      if (cleanTarget.includes(cleanInput) && cleanInput.length > 0) {
        setCheckResult('correct');
      } else {
        setCheckResult('wrong');
      }
    } else {
      if (cleanInput === cleanTarget) {
        setCheckResult('correct');
      } else {
        setCheckResult('wrong');
      }
    }
  };

  const nextSubPhase = () => {
    nextCard(checkResult === 'correct');
  };

  const getHint = () => {
    if (!currentCard) return '';
    const target = currentPhase.id === 'guess-meaning' ? currentCard.definition : currentCard.word;
    return target.length > 4 ? target.substring(0, 3) + '...' : target.substring(0, 1) + '...';
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Tuyệt vời!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Bạn đã hoàn thành hoặc không có thẻ nào trong chế độ này.</p>
        <button 
          onClick={() => onComplete && onComplete()}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={48} className="text-primary" />
        </motion.div>
        <h2 className="text-3xl font-black mb-3 text-slate-800 dark:text-white tracking-tight">Hoàn thành bài học!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Hành trình tuyệt vời, dữ liệu của bạn đã được cập nhật.</p>
        <div className="flex gap-4 mt-10">
          <button 
            onClick={() => onComplete && onComplete()}
            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <ListCheck size={22} />
            Làm bài kiểm tra mới
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Home size={22} />
            Về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (currentPhase.id === 'flip-list') {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto pb-10">
        <header className="text-center mb-8">
          <span className="px-5 py-2 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest mb-5 inline-block border border-primary/20">
            Phase 1/4: {currentPhase.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            {currentPhase.label}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium font-inter">Xem từng thẻ và lật để ghi nhớ trước khi sang lượt đoán.</p>
        </header>

        <div className="w-full flex flex-col items-center gap-8 px-4">
          <div className="relative w-full flex items-center justify-center md:px-12">
            {/* Arrow Navigation */}
            <div className="absolute left-0 z-10">
               <button 
                onClick={prevPreview}
                disabled={previewIndex === 0}
                className={`p-5 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700 transition-all ${previewIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-90 hover:text-primary'}`}
              >
                <ChevronLeft size={28} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full"
              >
                <Card3D 
                  front={{ word: currentCard.word, pos: currentCard.pos }}
                  back={{ definition: currentCard.definition, related: currentCard.related }}
                  isFlipped={isFlipped} 
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute right-0 z-10">
              <button 
                onClick={nextPreview}
                disabled={previewIndex === cards.length - 1}
                className={`p-5 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700 transition-all ${previewIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-90 hover:text-primary'}`}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 mt-6">
            <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-base font-black text-slate-500 font-mono shadow-inner">
              {previewIndex + 1} / {cards.length}
            </div>

            {previewIndex === cards.length - 1 && (
              <button
                  onClick={handleFlipListNext}
                  className="px-14 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-4 group"
                >
                  Bắt đầu kiểm tra
                  <ArrowRight size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase 2-4: Testing and Assessment
  const progressPercent = ((totalInPhase - currentQueue.length) / totalInPhase) * 100;
  
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Progress & Breadcrumbs */}
      <div className="w-full mb-12">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1.5">
              Giai đoạn {phaseIndex + 1}/{PHASES.length} • {currentPhase.label}
            </span>
            <div className="flex gap-2">
              {PHASES.map((p, idx) => (
                <div 
                  key={p.id}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${idx <= phaseIndex ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} 
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-black px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl font-mono shadow-sm">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${phaseIndex}-${currentCard.id}`}
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -50, rotateY: -10 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="w-full flex flex-col items-center"
        >
          {currentPhase.id === 'guess-meaning' || currentPhase.id === 'guess-word' ? (
            <div className="glass-card w-full p-10 flex flex-col items-center gap-10 border-2 border-primary/5">
              <div className="text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  {currentPhase.id === 'guess-meaning' ? 'Đoán định nghĩa' : 'Đoán từ vựng'}
                </span>
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                    {currentPhase.id === 'guess-meaning' ? currentCard.word : currentCard.definition}
                  </h2>
                  {currentPhase.id === 'guess-meaning' && (
                    <button 
                      onClick={() => speak(currentCard.word)}
                      className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm flex items-center justify-center"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full relative">
                <input
                  type="text"
                  autoFocus
                  value={userInput}
                  disabled={checkResult !== null}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (checkResult === null ? checkGuess() : nextSubPhase())}
                  placeholder={currentPhase.id === 'guess-meaning' ? "Nghĩa của từ này là gì?" : "Từ vựng này là gì?"}
                  className={`w-full p-6 glass rounded-3xl border-2 transition-all outline-none text-center text-xl font-bold shadow-lg ${
                    checkResult === 'correct' ? 'border-green-400 bg-green-50/20 text-green-600' : 
                    checkResult === 'wrong' ? 'border-red-400 bg-red-50/20 text-red-600' : 
                    'border-slate-200 dark:border-slate-700 focus:border-primary focus:shadow-primary/10'
                  }`}
                />
                {checkResult && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className={`absolute -top-4 -right-4 p-3 rounded-full shadow-xl ${checkResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {checkResult === 'correct' ? <Check size={20} /> : <X size={20} />}
                  </motion.div>
                )}
                {wrongCounts[currentCard.id] >= 3 && (
                   <div className="absolute -bottom-10 left-0 right-0 text-center animate-bounce">
                     <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-500/20">
                       Gợi ý: {getHint()}
                     </span>
                   </div>
                )}
              </div>

              {checkResult === null ? (
                <button 
                  onClick={checkGuess}
                  disabled={!userInput.trim()}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <div className="w-full flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl w-full border border-slate-100 dark:border-slate-700">
                     <p className="text-xs font-bold text-slate-400 uppercase mb-2">Đáp án đúng</p>
                     <p className="text-2xl font-black text-slate-800 dark:text-slate-100 italic">
                      {currentPhase.id === 'guess-meaning' ? currentCard.definition : currentCard.word}
                     </p>
                  </div>
                  <button 
                    onClick={nextSubPhase}
                    className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    Tiếp tục <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-full transform transition-transform hover:scale-[1.02]">
                <Card3D 
                  front={{ word: currentCard.word, pos: currentCard.pos }}
                  back={{ definition: currentCard.definition, related: currentCard.related }}
                  isFlipped={isFlipped} 
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              <div className="mt-12 flex flex-col gap-6 w-full">
                <div className="text-center mb-2">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đánh giá ghi nhớ</p>
                </div>
                <div className="flex gap-6">
                  <button
                    onClick={() => handleAssessment('fail')}
                    className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-8 bg-red-500/10 text-red-500 rounded-[2.5rem] font-black border-2 border-red-500/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl shadow-red-500/10 group"
                  >
                    <XCircle size={36} className="transition-transform group-hover:rotate-12 group-hover:scale-110" />
                    <span className="text-lg">Quên rồi</span>
                  </button>
                  <button
                    onClick={() => handleAssessment('pass')}
                    className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-8 bg-green-500/10 text-green-500 rounded-[2.5rem] font-black border-2 border-green-500/10 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-xl shadow-green-500/10 group"
                  >
                    <CheckCircle2 size={36} className="transition-transform group-hover:scale-125" />
                    <span className="text-lg">Đã thuộc</span>
                  </button>
                </div>
                <p className="text-center text-xs text-slate-400 font-bold italic animate-pulse">
                  {isFlipped ? "Chọn kết quả bên trên để chuyển từ tiếp theo" : "Nhấn vào thẻ để xem lại thông tin đầy đủ"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReviewSession;

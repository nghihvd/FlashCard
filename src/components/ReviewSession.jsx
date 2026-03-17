import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Eye, Play, Home, ChevronLeft, ChevronRight, Check, X, Brain, ListCheck } from 'lucide-react';
import Card3D from './Card3D';

const ReviewSession = ({ cards, onAssessment, onComplete, allCards }) => {
  const [phase, setPhase] = useState('flip-list'); // 'flip-list', 'fast-assessment', 'completed'
  const [subPhase, setSubPhase] = useState('guess-meaning'); // 'guess-meaning', 'guess-word', 'related-multiple-choice', 'assessment'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [checkResult, setCheckResult] = useState(null); // 'correct', 'wrong', null
  const [choices, setChoices] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState([]);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (subPhase === 'related-multiple-choice') {
      generateChoices();
    }
  }, [subPhase, currentIndex]);

  const generateChoices = () => {
    if (!currentCard.related) return;
    
    const correctOnes = currentCard.related.split(',').map(s => s.trim()).filter(Boolean);
    
    // Get distractors from other cards
    const otherRelated = (allCards || cards)
      .filter(c => c.id !== currentCard.id && c.related)
      .flatMap(c => c.related.split(',').map(s => s.trim()))
      .filter(s => !correctOnes.includes(s));
    
    // Unique distractors
    const uniqueDistractors = [...new Set(otherRelated)];
    
    // Pick 2-3 distractors
    const chosenDistractors = uniqueDistractors
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.max(2, 4 - correctOnes.length));
    
    // Combine and shuffle
    const allOptions = [...correctOnes, ...chosenDistractors]
      .sort(() => 0.5 - Math.random());
    
    setChoices(allOptions);
    setSelectedChoices([]);
  };

  const handleAssessment = (status) => {
    onAssessment(currentCard.id, status === 'pass');
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSubPhase('guess-meaning');
      setIsFlipped(false);
      setUserInput('');
      setCheckResult(null);
    } else {
      setPhase('completed');
    }
  };

  const nextPreview = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevPreview = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const startAssessment = () => {
    setPhase('fast-assessment');
    setCurrentIndex(0);
    setSubPhase('guess-meaning');
    setIsFlipped(false);
    setUserInput('');
    setCheckResult(null);
  };

  const checkGuess = () => {
    const target = subPhase === 'guess-meaning' ? currentCard.definition : currentCard.word;
    
    const cleanInput = userInput.toLowerCase().replace(/\s+/g, '');
    const cleanTarget = target.toLowerCase().replace(/\s+/g, '');

    if (subPhase === 'guess-meaning') {
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

  const checkMultipleChoice = () => {
    const correctOnes = currentCard.related.split(',').map(s => s.trim()).filter(Boolean);
    
    // Check if every selected choice is correct AND every correct choice is selected
    const allCorrectSelected = correctOnes.every(c => selectedChoices.includes(c));
    const noWrongSelected = selectedChoices.every(c => correctOnes.includes(c));
    
    if (allCorrectSelected && noWrongSelected) {
      setCheckResult('correct');
    } else {
      setCheckResult('wrong');
    }
  };

  const nextSubPhase = () => {
    if (subPhase === 'guess-meaning') {
      setSubPhase('guess-word');
    } else if (subPhase === 'guess-word') {
      if (currentCard.related && currentCard.related.trim()) {
        setSubPhase('related-multiple-choice');
      } else {
        setSubPhase('assessment');
      }
    } else if (subPhase === 'related-multiple-choice') {
      setSubPhase('assessment');
    }
    setUserInput('');
    setCheckResult(null);
  };

  const toggleChoice = (choice) => {
    if (checkResult) return;
    setSelectedChoices(prev => 
      prev.includes(choice) ? prev.filter(c => c !== choice) : [...prev, choice]
    );
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

  if (phase === 'completed') {
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

  if (phase === 'flip-list') {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto pb-10">
        <header className="text-center mb-8">
          <span className="px-5 py-2 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest mb-5 inline-block border border-primary/20">
            Phase 1: The Flip List
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            Xem lướt vựng
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium font-inter">Xem từng thẻ và lật để ghi nhớ trước khi kiểm tra.</p>
        </header>

        <div className="w-full flex flex-col items-center gap-8 px-4">
          <div className="relative w-full flex items-center justify-center md:px-12">
            {/* Navigation Arrows */}
            <div className="absolute left-0 z-10">
               <button 
                onClick={prevPreview}
                disabled={currentIndex === 0}
                className={`p-5 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700 transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-90 hover:text-primary'}`}
              >
                <ChevronLeft size={28} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
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
                disabled={currentIndex === cards.length - 1}
                className={`p-5 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700 transition-all ${currentIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-90 hover:text-primary'}`}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 mt-6">
            <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-base font-black text-slate-500 font-mono shadow-inner">
              {currentIndex + 1} / {cards.length}
            </div>

            {currentIndex === cards.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startAssessment}
                className="px-14 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-4 group"
              >
                <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors">
                  <Play size={24} className="fill-current" />
                </div>
                Bắt đầu kiểm tra
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Multi-Stage Assessment
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Progress & Breadcrumbs */}
      <div className="w-full mb-12">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1.5">Giai đoạn 2 • Kiểm tra</span>
            <div className="flex gap-2">
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${subPhase === 'guess-meaning' ? 'bg-primary' : 'bg-primary/20'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${subPhase === 'guess-word' || (subPhase !== 'guess-meaning' && subPhase !== 'assessment') ? 'bg-primary' : 'bg-primary/20'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${subPhase === 'related-multiple-choice' || subPhase === 'assessment' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-all duration-500 ${subPhase === 'assessment' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </div>
          </div>
          <span className="text-sm font-black px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl font-mono shadow-sm">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${subPhase}`}
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -50, rotateY: -10 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="w-full flex flex-col items-center"
        >
          {subPhase === 'guess-meaning' || subPhase === 'guess-word' ? (
            <div className="glass-card w-full p-10 flex flex-col items-center gap-10 border-2 border-primary/5">
              <div className="text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  {subPhase === 'guess-meaning' ? 'Đoán định nghĩa' : 'Đoán từ vựng'}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
                  {subPhase === 'guess-meaning' ? currentCard.word : currentCard.definition}
                </h2>
              </div>

              <div className="w-full relative">
                <input
                  type="text"
                  autoFocus
                  value={userInput}
                  disabled={checkResult !== null}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (checkResult === null ? checkGuess() : nextSubPhase())}
                  placeholder={subPhase === 'guess-meaning' ? "Nghĩa của từ này là gì?" : "Từ vựng này là gì?"}
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
                      {subPhase === 'guess-meaning' ? currentCard.definition : currentCard.word}
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
          ) : subPhase === 'related-multiple-choice' ? (
            <div className="glass-card w-full p-10 flex flex-col items-center gap-8 border-2 border-primary/5">
               <div className="text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center justify-center gap-2">
                  <ListCheck size={14} /> Kiểm tra từ vựng liên quan
                </span>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                  Từ đồng nghĩa / trái nghĩa của <span className="text-primary italic underline decoration-white/20">"{currentCard.word}"</span> là gì?
                </h2>
                <p className="text-slate-500 text-xs font-bold mt-3 uppercase tracking-widest">(Bạn có thể chọn nhiều đáp án)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {choices.map((choice, idx) => {
                  const isCorrectAnswer = currentCard.related.split(',').map(s => s.trim()).includes(choice);
                  const isSelected = selectedChoices.includes(choice);
                  
                  let buttonStyle = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-primary/30";
                  if (checkResult) {
                    if (isCorrectAnswer) {
                      buttonStyle = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20";
                    } else if (isSelected) {
                      buttonStyle = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20";
                    } else {
                      buttonStyle = "bg-slate-100 dark:bg-slate-800 border-transparent opacity-50";
                    }
                  } else if (isSelected) {
                    buttonStyle = "bg-primary border-primary text-white shadow-lg shadow-primary/20";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleChoice(choice)}
                      className={`p-5 rounded-[1.5rem] font-bold text-lg border-2 transition-all ${buttonStyle}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {checkResult === null ? (
                <button 
                  onClick={checkMultipleChoice}
                  disabled={selectedChoices.length === 0}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  Xác nhận lựa chọn
                </button>
              ) : (
                 <button 
                    onClick={nextSubPhase}
                    className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    Tiếp tục <ArrowRight size={20} />
                  </button>
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, RotateCcw, Check, X, ArrowRight } from 'lucide-react';
import Flashcard from './Flashcard';

const StudySession = ({ cards, allCards, onAssessment }) => {
  const [sessionPhase, setSessionPhase] = useState('preview-all'); // 'preview-all', 'learning', 'completed', 'quiz'
  const [learningStep, setLearningStep] = useState('practice-1'); // 'practice-1' (W->D), 'practice-2' (D->W), 'assessment'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizInput, setQuizInput] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [quizCards, setQuizCards] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizMode, setQuizMode] = useState('w-to-d'); // 'w-to-d' or 'd-to-w'

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl text-center">
        <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Bạn đã hoàn thành mục tiêu hôm nay!</h3>
        <p className="text-slate-500 max-w-md">Hãy quay lại vào ngày mai hoặc thêm từ mới để tiếp tục hành trình chinh phục ngôn ngữ.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNextInPreview = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionPhase('learning');
      setCurrentIndex(0);
      setLearningStep('practice-1');
    }
  };

  const handeNextStep = () => {
    if (learningStep === 'practice-1') {
      setLearningStep('practice-2');
      setQuizInput('');
      setQuizResult(null);
    } else if (learningStep === 'practice-2') {
      setLearningStep('assessment');
    } else if (learningStep === 'assessment') {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setLearningStep('practice-1');
        setQuizInput('');
        setQuizResult(null);
      } else {
        setSessionPhase('completed');
      }
    }
  };

  const startQuiz = () => {
    // Combine current cards with some random additional cards
    const currentIds = new Set(cards.map(c => c.id));
    const otherCards = allCards.filter(c => !currentIds.has(c.id));
    const randomOthers = otherCards.sort(() => 0.5 - Math.random()).slice(0, 3); // Grab 3 random old cards
    const mixedQuiz = [...cards, ...randomOthers].sort(() => 0.5 - Math.random());
    
    setQuizCards(mixedQuiz);
    setQuizIndex(0);
    setQuizMode(Math.random() > 0.5 ? 'w-to-d' : 'd-to-w');
    setQuizResult(null);
    setQuizInput('');
    setSessionPhase('quiz');
  };

  const handleNextInQuiz = () => {
    if (quizIndex < quizCards.length - 1) {
      setQuizIndex(quizIndex + 1);
      setQuizMode(Math.random() > 0.5 ? 'w-to-d' : 'd-to-w');
      setQuizInput('');
      setQuizResult(null);
    } else {
      setSessionPhase('completed');
    }
  };

  const handleCheckQuizMixed = () => {
    const userInput = quizInput.toLowerCase().trim();
    const currentQuizCard = quizCards[quizIndex];
    const target = (quizMode === 'w-to-d' ? currentQuizCard.definition : currentQuizCard.word).toLowerCase().trim();
    
    if (quizMode === 'w-to-d') {
      if (target.includes(userInput) && userInput.length > 1) {
        setQuizResult('correct');
      } else {
        setQuizResult('wrong');
      }
    } else {
      if (userInput === target) {
        setQuizResult('correct');
      } else {
        setQuizResult('wrong');
      }
    }
  };

  const handleCheckQuiz = () => {
    const userInput = quizInput.toLowerCase().trim();
    const target = (learningStep === 'practice-1' ? currentCard.definition : currentCard.word).toLowerCase().trim();

    // Nếu là đoán định nghĩa (practice-1), chỉ cần chứa từ khóa là được (contain)
    // Nếu là đoán từ vựng (practice-2), vẫn yêu cầu chính xác để đảm bảo nhớ đúng mặt chữ
    if (learningStep === 'practice-1') {
      if (target.includes(userInput) && userInput.length > 1) {
        setQuizResult('correct');
      } else {
        setQuizResult('wrong');
      }
    } else {
      if (userInput === target) {
        setQuizResult('correct');
      } else {
        setQuizResult('wrong');
      }
    }
  };

  const handleAssessmentResult = (status) => {
    onAssessment(currentCard.id, status);
    handeNextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* ProgressBar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-primary flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {sessionPhase === 'preview-all' ? 'Giai đoạn 1: Xem lướt' : `Giai đoạn 2: ${learningStep}`}
          </span>
          <span className="text-slate-400 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${sessionPhase}-${learningStep}-${currentIndex}-${quizIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {sessionPhase === 'completed' ? (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative p-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Brain className="w-16 h-16 text-yellow-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Tuyệt vời! Bạn đã hoàn thành!</h3>
                <p className="text-slate-500 max-w-md">Bạn đã ôn tập xong các từ vựng mục tiêu cho phiên học này.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <button 
                  onClick={() => {
                    setCurrentIndex(0);
                    setSessionPhase('preview-all');
                    setLearningStep('practice-1');
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <RotateCcw className="w-5 h-5" /> Học lại
                </button>
                <button 
                  onClick={startQuiz}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Brain className="w-5 h-5" /> Làm Quiz
                </button>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="text-slate-400 hover:text-primary text-sm font-medium transition-colors"
              >
                Kết thúc phiên học
              </button>
            </div>
          ) : sessionPhase === 'quiz' ? (
            <div className="max-w-md mx-auto">
              <div className="glass-card flex flex-col items-center justify-center gap-8 border-2 border-primary/20 p-8">
                <div className="text-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                    Quiz Thử Thách ({quizIndex + 1}/{quizCards.length})
                  </span>
                  <p className="text-slate-500 text-sm mb-2">
                    {quizMode === 'w-to-d' ? 'Dịch từ này sang Tiếng Việt:' : 'Từ vựng này là gì?'}
                  </p>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {quizMode === 'w-to-d' ? quizCards[quizIndex].word : quizCards[quizIndex].definition}
                  </h2>
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    autoFocus
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (quizResult === null ? handleCheckQuizMixed() : handleNextInQuiz())}
                    placeholder={quizMode === 'w-to-d' ? "Nhập nghĩa của từ..." : "Nhập từ vựng..."}
                    className={`w-full p-5 glass rounded-2xl border-2 transition-all outline-none text-center text-lg font-medium ${
                      quizResult === 'correct' ? 'border-green-400 bg-green-50/50' : 
                      quizResult === 'wrong' ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                </div>

                {quizResult === null ? (
                  <button 
                    onClick={handleCheckQuizMixed}
                    className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-black transition-all"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className={`p-3 rounded-full ${quizResult === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {quizResult === 'correct' ? <Check /> : <X />}
                    </div>
                    <div className="text-center">
                      <p className={`text-xl font-bold ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                        {quizResult === 'correct' ? 'Tuyệt vời!' : 'Hơi tiếc!'}
                      </p>
                      <p className="text-slate-500 mt-1">Đáp án đúng: <span className="text-slate-800 dark:text-slate-200 font-semibold">{quizMode === 'w-to-d' ? quizCards[quizIndex].definition : quizCards[quizIndex].word}</span></p>
                    </div>
                    <button onClick={handleNextInQuiz} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      Tiếp tục <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : sessionPhase === 'preview-all' ? (
            <div className="flex flex-col items-center gap-8">
              <Flashcard card={currentCard} />
              <button
                onClick={handleNextInPreview}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-all"
              >
                Tiếp theo <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {learningStep.startsWith('practice') ? (
                <div className="glass-card aspect-[4/3] flex flex-col items-center justify-center gap-8 border-2 border-primary/10">
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                      {learningStep === 'practice-1' ? 'Đoán định nghĩa' : 'Đoán từ vựng'}
                    </span>
                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
                      {learningStep === 'practice-1' ? currentCard.word : currentCard.definition}
                    </h2>
                  </div>

                  <div className="w-full px-6">
                    <input
                      type="text"
                      autoFocus
                      value={quizInput}
                      onChange={(e) => setQuizInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (quizResult === null ? handleCheckQuiz() : handeNextStep())}
                      placeholder="Nhập vào đây..."
                      className={`w-full p-5 glass rounded-2xl border-2 transition-all outline-none text-center text-lg font-medium ${quizResult === 'correct' ? 'border-green-400 bg-green-50/50' :
                          quizResult === 'wrong' ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-primary'
                        }`}
                    />
                  </div>

                  {quizResult === null ? (
                    <button
                      onClick={handleCheckQuiz}
                      className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-black transition-all"
                    >
                      Kiểm tra
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                      <div className={`p-2 rounded-full ${quizResult === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {quizResult === 'correct' ? <Check /> : <X />}
                      </div>
                      <div className="text-center">
                        <p className={`font-bold ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                          {quizResult === 'correct' ? 'Chính xác!' : 'Cần xem lại!'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Đáp án: <span className="text-slate-800 dark:text-slate-200 font-semibold">{learningStep === 'practice-1' ? currentCard.definition : currentCard.word}</span></p>
                      </div>
                      <button onClick={handeNextStep} className="mt-2 text-primary font-bold hover:underline flex items-center gap-1">
                        Tiếp tục <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-balance">Phiên học của thẻ này hoàn tất</h3>
                    <p className="text-slate-500 text-sm">Bạn cảm thấy mức độ ghi nhớ từ này như thế nào?</p>
                  </div>

                  <Flashcard card={currentCard} />

                  <div className="flex gap-4 w-full px-2">
                    <button
                      onClick={() => handleAssessmentResult('fail')}
                      className="flex-1 flex flex-col items-center gap-2 p-6 glass-card border-red-100 hover:bg-red-50 hover:border-red-200 hover:scale-[1.02] transition-all group"
                    >
                      <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-red-600">Quên rồi</span>
                      <span className="text-[10px] text-red-400 uppercase">Học lại vào mai</span>
                    </button>

                    <button
                      onClick={() => handleAssessmentResult('pass')}
                      className="flex-1 flex flex-col items-center gap-2 p-6 glass-card border-green-100 hover:bg-green-50 hover:border-green-200 hover:scale-[1.02] transition-all group"
                    >
                      <Check className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-green-600">Đã thuộc</span>
                      <span className="text-[10px] text-green-400 uppercase">Tăng Interval</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudySession;

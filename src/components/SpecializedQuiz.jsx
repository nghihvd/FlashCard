import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, Brain, RotateCcw, Home, Trophy } from 'lucide-react';

const SpecializedQuiz = ({ cards, allCards, mode, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (!currentCard || isFinished) return;
    
    // Generate type of question for this card
    // 0: Word -> Def, 1: Def -> Word, 2 (if available): Related
    let type = Math.floor(Math.random() * 2); 
    if (mode === 'related' || (currentCard.synonyms || currentCard.antonyms || currentCard.related)) {
      type = 2;
    }

    if (type === 2) {
      // Related Words Multiple Choice
      const synonyms = currentCard.synonyms ? currentCard.synonyms.split(',').map(s => s.trim()) : [];
      const antonyms = currentCard.antonyms ? currentCard.antonyms.split(',').map(s => s.trim()) : [];
      const related = currentCard.related ? currentCard.related.split(',').map(s => s.trim()) : [];
      const allCorrect = [...synonyms, ...antonyms, ...related];
      
      // Get distractors from other cards
      const otherWords = allCards
        .filter(c => c.id !== currentCard.id)
        .map(c => c.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      const options = [...allCorrect, ...otherWords]
        .sort(() => 0.5 - Math.random());
      
      setCurrentQuizData({
        type: 'multi',
        question: `Chọn tất cả từ liên quan, đồng nghĩa hoặc trái nghĩa của:`,
        target: currentCard.word,
        options,
        correctAnswers: allCorrect
      });
    } else {
      // Standard Input Quiz
      setCurrentQuizData({
        type: 'input',
        isWordToDef: type === 0,
        question: type === 0 ? 'Định nghĩa của từ này là gì?' : 'Từ vựng này là gì?',
        prompt: type === 0 ? currentCard.word : currentCard.definition,
        answer: type === 0 ? currentCard.definition : currentCard.word
      });
    }
    
    setQuizResult(null);
    setSelectedOptions([]);
    setUserInput('');
  }, [currentIndex, isFinished]);

  const handleToggleOption = (option) => {
    if (quizResult !== null) return;
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const checkAnswer = () => {
    if (currentQuizData.type === 'multi') {
      const correctSet = new Set(currentQuizData.correctAnswers);
      const selectedSet = new Set(selectedOptions);
      
      // Check if they match exactly
      const isCorrect = 
        currentQuizData.correctAnswers.every(a => selectedSet.has(a)) &&
        selectedOptions.every(s => correctSet.has(s)) &&
        selectedOptions.length > 0;
        
      if (isCorrect) {
        setQuizResult('correct');
        setScore(s => s + 1);
      } else {
        setQuizResult('wrong');
      }
    } else {
      const input = userInput.toLowerCase().trim();
      const target = currentQuizData.answer.toLowerCase().trim();
      
      if (currentQuizData.isWordToDef) {
        // Definition check (inclusive)
        if (target.includes(input) && input.length > 1) {
          setQuizResult('correct');
          setScore(s => s + 1);
        } else {
          setQuizResult('wrong');
        }
      } else {
        // Word check (exact)
        if (input === target) {
          setQuizResult('correct');
          setScore(s => s + 1);
        } else {
          setQuizResult('wrong');
        }
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl text-center space-y-8 max-w-lg mx-auto">
        <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-full">
          <Trophy className="w-12 h-12 text-green-500" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Quiz Hoàn Tất!</h3>
          <p className="text-slate-500">Bạn đã trả lời đúng {score}/{cards.length} câu hỏi.</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
           <button onClick={() => window.location.reload()} className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuizData) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Quiz Progress */}
      <div className="mb-8 flex justify-between items-center px-2">
        <span className="text-xs font-bold text-slate-400">Câu {currentIndex + 1} / {cards.length}</span>
        <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 border-2 border-primary/10"
        >
          <div className="text-center mb-8">
            <span className="text-primary font-bold text-sm tracking-widest uppercase block mb-2">{currentQuizData.question}</span>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white">{currentQuizData.target || currentQuizData.prompt}</h2>
          </div>

          <div className="space-y-4">
            {currentQuizData.type === 'multi' ? (
              <div className="grid grid-cols-2 gap-3">
                {currentQuizData.options.map((option, idx) => {
                  const isSelected = selectedOptions.includes(option);
                  const isCorrect = currentQuizData.correctAnswers.includes(option);
                  let style = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary/50";
                  
                  if (quizResult !== null) {
                    if (isCorrect) style = "bg-green-100 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-300";
                    else if (isSelected && !isCorrect) style = "bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300";
                  } else if (isSelected) {
                    style = "bg-primary/10 border-primary text-primary";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleOption(option)}
                      className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${style}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
               <div className="w-full">
                <input
                  type="text"
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (quizResult === null ? checkAnswer() : handleNext())}
                  placeholder={currentQuizData.isWordToDef ? "Nhập nghĩa của từ..." : "Nhập từ vựng..."}
                  className={`w-full p-5 glass rounded-2xl border-2 transition-all outline-none text-center text-lg font-medium ${
                    quizResult === 'correct' ? 'border-green-400 bg-green-50/50' : 
                    quizResult === 'wrong' ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-primary'
                  }`}
                  disabled={quizResult !== null}
                />
              </div>
            )}
          </div>

          {quizResult === null ? (
            <button
              onClick={checkAnswer}
              disabled={currentQuizData.type === 'multi' && selectedOptions.length === 0}
              className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50"
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in">
              <div className={`p-4 rounded-full ${quizResult === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {quizResult === 'correct' ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
              </div>
              <p className={`font-black text-xl ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                {quizResult === 'correct' ? 'CHÍNH XÁC!' : 'SAI MẤT RỒI!'}
              </p>
              {quizResult === 'wrong' && (
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Đáp án đúng:</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{currentQuizData.answer || currentQuizData.correctAnswers.join(', ')}</p>
                </div>
              )}
              <button 
                onClick={handleNext}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                Tiếp tục <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SpecializedQuiz;

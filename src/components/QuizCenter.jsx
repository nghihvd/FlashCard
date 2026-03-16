import React from 'react';
import { Brain, Star, Clock, Trophy, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizCenter = ({ cards, onStartQuiz }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const newCardsToday = cards.filter(c => c.last_reviewed === today || c.level === 'new');
  const learnedCards = cards.filter(c => c.level !== 'new');

  const quizModes = [
    {
      id: 'daily',
      title: 'Ôn tập hôm nay',
      description: 'Củng cố các từ vừa học hoặc mới thêm trong ngày.',
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      count: newCardsToday.length,
      color: 'bg-orange-50 dark:bg-orange-950/30',
      borderColor: 'border-orange-100 dark:border-orange-900/50',
      action: () => onStartQuiz(newCardsToday, 'daily')
    },
    {
      id: 'mastery',
      title: 'Thử thách tổng hợp',
      description: 'Làm Quiz với tất cả các từ trong kho để không bị quên.',
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      count: learnedCards.length,
      color: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderColor: 'border-yellow-100 dark:border-yellow-900/50',
      action: () => onStartQuiz(cards, 'mastery')
    },
    {
      id: 'related',
      title: 'Bậc thầy liên quan',
      description: 'Chọn đúng các từ đồng nghĩa, trái nghĩa để ghi nhớ sâu.',
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      count: cards.filter(c => c.synonyms || c.antonyms).length,
      color: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
      action: () => onStartQuiz(cards.filter(c => c.synonyms || c.antonyms), 'related')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">Trung tâm Quiz</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Chọn một chế độ để kiểm tra kiến thức của bạn. Luyện tập đều đặn là chìa khóa của sự thông thạo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizModes.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={mode.action}
            disabled={mode.count === 0}
            className={`flex flex-col text-left p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${mode.borderColor} ${mode.color} ${mode.count === 0 ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:shadow-primary/5'}`}
          >
            <div className="mb-6 p-3 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm">
              {mode.icon}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{mode.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">{mode.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="px-3 py-1 bg-white/80 dark:bg-slate-900/80 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                {mode.count} thẻ
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>

            {mode.count === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 dark:bg-black/10 backdrop-none">
                 <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Chưa có dữ liệu</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuizCenter;

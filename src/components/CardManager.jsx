import React, { useState } from 'react';
import { Trash2, Edit2, Search, Book, Volume2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { speak } from '../utils/speech';
import Card3D from './Card3D';
import { motion, AnimatePresence } from 'framer-motion';

const CardManager = ({ cards, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(false);

  const filteredCards = cards.filter(card => 
    card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPreview = () => {
    if (previewIndex < cards.length - 1) {
      setPreviewIndex(previewIndex + 1);
      setIsPreviewFlipped(false);
    }
  };

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
      setIsPreviewFlipped(false);
    }
  };

  const currentPreviewCard = cards[previewIndex];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Section: Quick Review / Preview */}
      {cards.length > 0 && (
        <section className="mb-20 flex flex-col items-center">
          <header className="text-center mb-10">
            <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest mb-4 inline-block border border-primary/20">
              Chế độ học nhanh
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight">Thẻ ghi nhớ hôm nay</h2>
          </header>

          <div className="w-full max-w-2xl relative flex items-center justify-center gap-6">
            <button 
              onClick={handlePrevPreview}
              disabled={previewIndex === 0}
              className={`p-4 bg-white/5 border border-white/10 rounded-full text-white transition-all ${previewIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary hover:border-primary shadow-xl hover:scale-110 active:scale-95'}`}
            >
              <ChevronLeft size={32} />
            </button>

            <div className="w-full">
               <AnimatePresence mode="wait">
                <motion.div
                  key={previewIndex}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card3D 
                    front={{ word: currentPreviewCard.word, pos: currentPreviewCard.pos }}
                    back={{ definition: currentPreviewCard.definition, related: currentPreviewCard.related }}
                    isFlipped={isPreviewFlipped}
                    onFlip={() => setIsPreviewFlipped(!isPreviewFlipped)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button 
              onClick={handleNextPreview}
              disabled={previewIndex === cards.length - 1}
              className={`p-4 bg-white/5 border border-white/10 rounded-full text-white transition-all ${previewIndex === cards.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-primary hover:border-primary shadow-xl hover:scale-110 active:scale-95'}`}
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-black text-sm">
              {previewIndex + 1} / {cards.length}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Section: Full List */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-t border-white/5 pt-20">
        <div>
          <span className="px-5 py-2 bg-purple-500/10 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest mb-4 inline-block border border-purple-500/20">
            Thư viện tích lũy
          </span>
          <h2 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter">
            Danh sách vựng
          </h2>
          <p className="text-slate-400 mt-3 font-medium text-lg">Quản lý và tra cứu tất cả {cards.length} từ vựng bạn đã thêm.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold placeholder:text-slate-500 text-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCards.map((card) => (
          <div key={card.id} className="glass-card p-8 group flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    card.level === 'mastered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    card.level === 'familiar' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {card.level}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => speak(card.word)}
                    className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                    title="Phát âm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(card)}
                      className="p-3 bg-white/10 text-slate-300 rounded-2xl hover:text-white hover:bg-white/20 transition-all font-bold"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(card.id)}
                      className="p-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{card.word}</h3>
              {card.pos && (
                <span className="text-xs font-bold text-slate-500 italic mb-4 block">
                  ({card.pos})
                </span>
              )}
              <p className="text-slate-400 text-base leading-relaxed font-medium line-clamp-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                {card.definition}
              </p>
            </div>

            <div className="pt-5 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-500 font-black uppercase tracking-widest">
              <span>{card.interval || 0} days</span>
              <span>Next: {card.nextReview || 'Soon'}</span>
            </div>
          </div>
        ))}
        
        {filteredCards.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <p className="text-slate-400 font-bold">Không tìm thấy từ vựng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardManager;

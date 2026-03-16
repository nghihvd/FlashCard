import React from 'react';
import { Trash2, Edit2, Search, Book, Volume2 } from 'lucide-react';
import { speak } from '../utils/speech';

const CardManager = ({ cards, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCards = cards.filter(card => 
    card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Book className="text-purple-400 w-8 h-8" />
            Thư viện từ vựng
          </h2>
          <p className="text-slate-400 mt-1">Quản lý và ôn tập tất cả các từ của bạn ({cards.length})</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group flex flex-col justify-between hover:scale-[1.02] transition-all shadow-xl">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    card.level === 'mastered' ? 'bg-green-100 text-green-600' :
                    card.level === 'familiar' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {card.level}
                  </span>
                  {card.pos && (
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      ({card.pos})
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => speak(card.word)}
                    className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-primary transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(card)}
                    className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(card.id)}
                    className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{card.word}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{card.definition}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Interval: {card.interval} ngày</span>
              <span>Hẹn: {card.next_review}</span>
            </div>
          </div>
        ))}
        
        {filteredCards.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <p className="text-slate-400">Không tìm thấy từ vựng nào khớp với tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardManager;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Layers, Save } from 'lucide-react';

const AddCardModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    pos: '',
    related: '',
    synonyms: '',
    antonyms: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        word: initialData.word || '',
        definition: initialData.definition || '',
        pos: initialData.pos || '',
        related: initialData.related || '',
        synonyms: initialData.synonyms || '',
        antonyms: initialData.antonyms || '',
      });
    } else {
      setFormData({ word: '', definition: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.word || !formData.definition) return;
    onAdd(formData);
    setFormData({ word: '', definition: '', pos: '', related: '', synonyms: '', antonyms: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] relative z-10 p-8 lg:p-12 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl">
                {initialData ? <Save className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {initialData ? 'Cập nhật từ vựng' : 'Thêm từ mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                    Từ vựng (Word)
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.word}
                      onChange={(e) => setFormData({...formData, word: e.target.value})}
                      placeholder="Ví dụ: Serendipity"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Từ loại
                    </label>
                    <input
                      type="text"
                      value={formData.pos}
                      onChange={(e) => setFormData({...formData, pos: e.target.value})}
                      placeholder="n, v, adj..."
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Ghi chú
                    </label>
                    <textarea
                      value={formData.related}
                      onChange={(e) => setFormData({...formData, related: e.target.value})}
                      placeholder="fruit, red..."
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600 resize-none h-28"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Đồng nghĩa
                    </label>
                    <textarea
                      value={formData.synonyms}
                      onChange={(e) => setFormData({...formData, synonyms: e.target.value})}
                      placeholder="comma separated..."
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600 resize-none h-28"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Trái nghĩa
                    </label>
                    <textarea
                      value={formData.antonyms}
                      onChange={(e) => setFormData({...formData, antonyms: e.target.value})}
                      placeholder="comma separated..."
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600 resize-none h-28"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                    Định nghĩa (Definition)
                  </label>
                  <div className="relative group h-full">
                    <Layers className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <textarea
                      required
                      value={formData.definition}
                      onChange={(e) => setFormData({...formData, definition: e.target.value})}
                      placeholder="Nhập nghĩa hoặc dịch..."
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium resize-none h-[220px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all active:scale-[0.98] mt-auto"
                >
                  {initialData ? 'CẬP NHẬT NGAY' : 'LƯU VÀO GOOGLE SHEETS'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCardModal;

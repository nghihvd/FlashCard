import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Layers, Save } from 'lucide-react';

const AddCardModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        word: initialData.word || '',
        definition: initialData.definition || '',
      });
    } else {
      setFormData({ word: '', definition: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.word || !formData.definition) return;
    onAdd(formData);
    setFormData({ word: '', definition: '' });
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
            className="w-full max-w-md glass-card relative z-10 !p-8"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                  Từ vựng (Word)
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.word}
                    onChange={(e) => setFormData({...formData, word: e.target.value})}
                    placeholder="Ví dụ: Serendipity"
                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                  Định nghĩa (Definition)
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    required
                    rows="3"
                    value={formData.definition}
                    onChange={(e) => setFormData({...formData, definition: e.target.value})}
                    placeholder="Nhập nghĩa hoặc dịch..."
                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-[0.98] mt-4"
              >
                {initialData ? 'Cập nhật ngay' : 'Lưu vào Google Sheets'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCardModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Layers, Save, Tag, Folder } from 'lucide-react';

const AddDocModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    category_1: '',
    category_2: '',
    tags: '',
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    onAdd(formData);
    setFormData({ title: '', category_1: '', category_2: '', tags: '', content: '' });
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
            className="w-full max-w-2xl glass-card relative z-10 !p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Thêm tài liệu mới
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                  Tiêu đề tài liệu
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ví dụ: Hướng dẫn học React"
                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                    Danh mục chính (Category 1)
                  </label>
                  <div className="relative">
                    <Folder className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.category_1}
                      onChange={(e) => setFormData({...formData, category_1: e.target.value})}
                      placeholder="Ví dụ: Công nghệ"
                      className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                    Danh mục phụ (Category 2)
                  </label>
                  <input
                    type="text"
                    value={formData.category_2}
                    onChange={(e) => setFormData({...formData, category_2: e.target.value})}
                    placeholder="Ví dụ: Frontend"
                    className="w-full px-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                  Thẻ (Tags)
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="cách nhau bằng dấu phẩy..."
                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 px-1">
                  Nội dung (Markdown hỗ trợ)
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    required
                    rows="8"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Sử dụng Markdown để trình bày..."
                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-[0.98] mt-4"
              >
                Lưu tài liệu vào Google Sheets
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddDocModal;

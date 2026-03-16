import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BookOpen, Layers, Save, Tag, Folder } from 'lucide-react';

const AddDocModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category_1: '',
    category_2: '',
    tags: '',
    content: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category_1: initialData.category_1 || '',
        category_2: initialData.category_2 || '',
        tags: initialData.tags || '',
        content: initialData.content || '',
      });
    } else {
      setFormData({ title: '', category_1: '', category_2: '', tags: '', content: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    onAdd(formData);
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
            className="w-full max-w-5xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] relative z-10 p-8 lg:p-12 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                {initialData ? 'Cập nhật tài liệu' : 'Thêm tài liệu mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                    Tiêu đề tài liệu
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ví dụ: Hướng dẫn học React"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Danh mục chính (Cổ điển, v.v.)
                    </label>
                    <div className="relative group">
                      <Folder className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.category_1}
                        onChange={(e) => setFormData({...formData, category_1: e.target.value})}
                        placeholder="Danh mục 1..."
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                      Danh mục phụ
                    </label>
                    <input
                      type="text"
                      value={formData.category_2}
                      onChange={(e) => setFormData({...formData, category_2: e.target.value})}
                      placeholder="Danh mục 2..."
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                    Thẻ (Tags)
                  </label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="tag1, tag2..."
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  {initialData ? 'CẬP NHẬT NGAY' : 'LƯU TÀI LIỆU'}
                </button>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">
                  Nội dung (Markdown hỗ trợ)
                </label>
                <div className="relative group flex-1">
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Sử dụng Markdown để trình bày..."
                    className="w-full p-6 bg-white/5 border border-white/10 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium resize-none min-h-[400px] h-full"
                  />
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddDocModal;

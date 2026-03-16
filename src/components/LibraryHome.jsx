import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronRight, 
  Folder, 
  FileText, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MarkdownReader = ({ content, title }) => {
  if (!content) return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="text-slate-400" />
      </div>
      <p className="text-slate-500 font-medium">Chọn một tài liệu để bắt đầu học</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {title}
        </h1>
      </header>
      
      <div className="prose prose-slate dark:prose-invert max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
        prose-strong:text-slate-800 dark:prose-strong:text-slate-200
        prose-li:text-slate-600 dark:prose-li:text-slate-400
        prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800
        prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:p-2
        prose-td:p-2 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-800"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

const LibraryHome = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Parse category tree
  const categoryTree = useMemo(() => {
    const tree = {};
    documents.forEach(doc => {
      const c1 = doc.category_1 || 'General';
      const c2 = doc.category_2 || 'Others';
      
      if (!tree[c1]) tree[c1] = {};
      if (!tree[c1][c2]) tree[c1][c2] = [];
      
      tree[c1][c2].push(doc);
    });
    return tree;
  }, [documents]);

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredDocs = searchTerm 
    ? documents.filter(doc => 
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center justify-between glass-card p-4 mb-4">
        <span className="font-bold flex items-center gap-2">
          <BookOpen size={18} /> Thư viện
        </span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:inset-auto
        w-full lg:w-80 h-full lg:h-auto
        transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full bg-slate-50/90 dark:bg-slate-950/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-6 lg:p-0">
          <div className="glass-card flex flex-col h-[70vh] lg:h-[calc(100vh-16rem)] overflow-hidden">
            {/* Search */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tree Section */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {searchTerm && (
                <div className="mb-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Kết quả tìm kiếm</h4>
                  <div className="flex flex-col gap-1">
                    {filteredDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsSidebarOpen(false);
                        }}
                        className={`text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                          selectedDoc?.id === doc.id ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <FileText size={16} opacity={0.7} />
                        <span className="text-sm font-medium truncate">{doc.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!searchTerm && Object.entries(categoryTree).map(([c1, c2s]) => (
                <div key={c1} className="mb-4">
                  <button
                    onClick={() => toggleCategory(c1)}
                    className="w-full flex items-center justify-between text-left p-2 hover:text-primary transition-colors font-bold text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Folder size={16} className="text-primary" /> {c1}
                    </span>
                    <ChevronRight size={14} className={`transition-transform ${expandedCategories[c1] ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategories[c1] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4 pl-4 border-l border-slate-200 dark:border-slate-800"
                      >
                        {Object.entries(c2s).map(([c2, docs]) => (
                          <div key={c2} className="mt-2">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 mt-1">{c2}</h5>
                            <div className="flex flex-col gap-1">
                              {docs.map(doc => (
                                <button
                                  key={doc.id}
                                  onClick={() => {
                                    setSelectedDoc(doc);
                                    setIsSidebarOpen(false);
                                  }}
                                  className={`text-left p-2.5 rounded-xl flex items-center gap-2 transition-all ${
                                    selectedDoc?.id === doc.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  <FileText size={14} />
                                  <span className="text-sm font-medium truncate">{doc.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Reader Area */}
      <section className="flex-1 min-w-0">
        <div className="glass-card min-h-[60vh]">
          <MarkdownReader content={selectedDoc?.content} title={selectedDoc?.title} />
        </div>
      </section>
    </div>
  );
};

export default LibraryHome;

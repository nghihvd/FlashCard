import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Github } from 'lucide-react';

const Layout = ({ children, activeView, setView }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-inter transition-colors duration-300">
      {/* Background blobs for premium feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-8 pb-32 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation for Mobile & Desktop (Floating Style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <nav className="glass border border-white/20 dark:border-slate-700/50 rounded-2xl p-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setView('study')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeView === 'study' 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap size={20} />
            <span className="text-xs font-medium">Flashcard</span>
          </button>

          <button
            onClick={() => setView('library')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeView === 'library' 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen size={20} />
            <span className="text-xs font-medium">Tài liệu</span>
          </button>
          
          <button
            onClick={() => window.open('https://docs.google.com/spreadsheets/d/1O1u-A9N6T_kS8S_V0I9W2K7S-X-G0eU7-G_Y-Qyv8-A/edit', '_blank')}
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Github size={20} />
            <span className="text-xs font-medium">Sheets</span>
          </button>

        </nav>
      </div>
    </div>
  );
};

export default Layout;

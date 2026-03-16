import React from 'react';
import { Plus, Brain, Settings, Sun, Moon, Library, PlayCircle, HelpCircle } from 'lucide-react';

const Navbar = ({ onAddClick, darkMode, toggleDarkMode, view, setView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-3xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hidden sm:block">
            FlashCard Pro
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setView('study')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                view === 'study' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden md:inline">Học tập</span>
            </button>
            <button
              onClick={() => setView('quiz')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                view === 'quiz' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Quiz Center</span>
            </button>
            <button
              onClick={() => setView('library')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                view === 'library' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              <Library className="w-4 h-4" />
              <span className="hidden md:inline">Thư viện</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline text-sm">Thêm từ</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

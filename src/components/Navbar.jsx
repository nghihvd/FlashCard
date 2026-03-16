import React from 'react';
import { Sun, Moon, Plus } from 'lucide-react';

const Navbar = ({ onAddClick, darkMode, toggleDarkMode }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="container mx-auto max-w-6xl flex justify-between items-center bg-white/10 dark:bg-slate-900/10 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl px-6 py-3 shadow-lg pointer-events-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent italic">
            FlashLearn
          </h1>
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {view === 'study' ? 'Học tập' : 'Thư viện'}
          </span>
        </div>

        
        <div className="flex items-center gap-2">
          <button
            onClick={onAddClick}
            className="p-2 mr-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

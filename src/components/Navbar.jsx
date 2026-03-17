import React from 'react';
import { Sun, Moon, Plus, Brain, PlayCircle, HelpCircle, Library as LibraryIcon } from 'lucide-react';

const Navbar = ({ onAddClick, darkMode, toggleDarkMode, view, setView }) => {
  const tabs = [
    { id: 'study', label: 'Học tập', icon: <LibraryIcon size={18} /> },
    { id: 'quiz', label: 'Kiểm tra', icon: <PlayCircle size={18} /> },
    { id: 'documents', label: 'Tài liệu', icon: <Brain size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="container mx-auto max-w-6xl flex justify-between items-center bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
        {/* Left: Branding */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('study')}>
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            FlashCard <span className="text-purple-400">Pro</span>
          </h1>
        </div>

        {/* Right: Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 mr-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  view === tab.id
                    ? 'bg-white/10 text-purple-400 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={view === tab.id ? 'text-purple-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <button
              onClick={onAddClick}
              className="p-2.5 rounded-2xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              title="Thêm mới"
            >
              <Plus size={20} />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

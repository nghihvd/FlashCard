import React, { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, HelpCircle, Brain, ListCheck } from 'lucide-react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ReviewSession from './components/ReviewSession';
import CardManager from './components/CardManager';
import LibraryHome from './components/LibraryHome';
import AddCardModal from './components/AddCardModal';
import AddDocModal from './components/AddDocModal';
import { fetchCards, fetchLibrary, updateCard, addCard, deleteCard } from './api/sheets';
import { calculateNextReview } from './utils/srs';

function App() {
  const [cards, setCards] = useState([]);
  const [library, setLibrary] = useState([]);
  const [view, setView] = useState('study'); 
  const [loading, setLoading] = useState(true);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sessionType, setSessionType] = useState('due'); 
  const [quizMode, setQuizMode] = useState(null); 

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    setLoading(true);
    try {
      const [cardsData, libraryData] = await Promise.allSettled([
        fetchCards(),
        fetchLibrary()
      ]);
      
      const normalizedCards = cardsData.status === 'fulfilled' ? (cardsData.value || []) : [];
      const normalizedLibrary = libraryData.status === 'fulfilled' ? (libraryData.value || []) : [];

      setCards(Array.isArray(normalizedCards) ? normalizedCards : []);
      setLibrary(Array.isArray(normalizedLibrary) ? normalizedLibrary : []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const dueCards = cards.filter(card => !card.nextReview || card.nextReview <= today);
  
  const handleAssessment = async (id, isKnown) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    const updates = calculateNextReview(card.level, isKnown);
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    await updateCard(id, updates);
  };

  const handleStartQuiz = (mode) => {
    setQuizMode(mode);
  };

  const getQuizCards = () => {
    if (quizMode === 'today') return dueCards;
    if (quizMode === 'mock') return [...cards].sort(() => 0.5 - Math.random()).slice(0, 20);
    if (quizMode === 'related') return cards.filter(c => c.related && c.related.trim()).sort(() => 0.5 - Math.random());
    return [];
  };

  const handleAddCard = async (formData) => {
    if (editingCard) {
      setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...formData } : c));
      await updateCard(editingCard.id, formData);
      setEditingCard(null);
    } else {
      const newCard = { ...formData, id: Date.now().toString(), level: 'new', nextReview: today, lastReviewed: '' };
      setCards(prev => [...prev, newCard]);
      await addCard(newCard);
    }
    setIsCardModalOpen(false);
  };

  const handleAddDoc = async (formData) => {
    if (editingDoc) {
      setLibrary(prev => prev.map(doc => doc.id === editingDoc.id ? { ...doc, ...formData } : doc));
      await updateCard(editingDoc.id, formData, 'Library');
      setEditingDoc(null);
    } else {
      const newDoc = { ...formData, id: Date.now().toString() };
      setLibrary(prev => [...prev, newDoc]);
      await addCard(newDoc, 'Library');
    }
    setIsDocModalOpen(false);
  };

  const handleDeleteDoc = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setLibrary(prev => prev.filter(doc => doc.id !== id));
      await deleteCard(id, 'Library');
    }
  };

  const handleEditDoc = (doc) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  return (
    <Layout activeView={view} setView={setView}>
      <Navbar 
        onAddClick={() => {
          if (view === 'study' || view === 'quiz') {
            setEditingCard(null);
            setIsCardModalOpen(true);
          } else {
            setEditingDoc(null);
            setIsDocModalOpen(true);
          }
        }}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        view={view}
        setView={(newView) => { setView(newView); setQuizMode(null); }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-16">
          {view === 'study' ? (
              <CardManager 
                cards={cards} 
                onEdit={(card) => { setEditingCard(card); setIsCardModalOpen(true); }}
                onDelete={async (id) => {
                  if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
                    setCards(prev => prev.filter(c => c.id !== id));
                    await deleteCard(id);
                  }
                }}
              />
          ) : view === 'quiz' ? (
            quizMode ? (
              <ReviewSession 
                key={quizMode}
                cards={getQuizCards()} 
                allCards={cards}
                onAssessment={handleAssessment} 
                onComplete={() => setQuizMode(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white">
                <header className="text-center mb-16 px-4">
                   <h2 className="text-5xl font-black mb-4 tracking-tighter">Trung tâm Kiểm tra</h2>
                   <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">Chọn chế độ kiểm tra để bắt đầu ôn tập.</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6 relative z-10">
                  <button 
                    onClick={() => handleStartQuiz('today')}
                    className="group flex flex-col items-start p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/5 hover:border-primary transition-all shadow-2xl hover:bg-white/10"
                  >
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/20">
                      <PlayCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-white">Kiểm tra hôm nay</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Ôn tập các từ vựng đến hạn dựa trên thuật toán SRS. ({dueCards.length} từ)</p>
                    <div className="mt-auto flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest opacity-70 group-hover:opacity-100">
                      Bắt đầu ngay <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button 
                    onClick={() => handleStartQuiz('related')}
                    className="group flex flex-col items-start p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/5 hover:border-green-500 transition-all shadow-2xl hover:bg-white/10"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-8 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all shadow-xl shadow-green-500/20">
                      <ListCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-white">Từ liên quan</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Chuyên biệt cho từ đồng nghĩa & trái nghĩa để mở rộng vốn từ.</p>
                    <div className="mt-auto flex items-center gap-3 text-green-400 font-black text-xs uppercase tracking-widest opacity-70 group-hover:opacity-100">
                      Luyện tập liên kết <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button 
                    onClick={() => handleStartQuiz('mock')}
                    className="group flex flex-col items-start p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/5 hover:border-purple-500 transition-all shadow-2xl hover:bg-white/10"
                  >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl shadow-purple-500/20">
                      <HelpCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-white">Kiểm tra tổng hợp</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Kiểm tra ngẫu nhiên 20 từ bất kỳ trong toàn bộ thư viện.</p>
                    <div className="mt-auto flex items-center gap-3 text-purple-400 font-black text-xs uppercase tracking-widest opacity-70 group-hover:opacity-100">
                      Thử thách ngẫu nhiên <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            )
          ) : (
            <LibraryHome documents={library} onEdit={handleEditDoc} onDelete={handleDeleteDoc} />
          )}
        </div>
      )}

      <AddCardModal 
        isOpen={isCardModalOpen} 
        onClose={() => setIsCardModalOpen(false)} 
        onAdd={handleAddCard} 
        initialData={editingCard} 
      />
      
      <AddDocModal 
        isOpen={isDocModalOpen} 
        onClose={() => { setIsDocModalOpen(false); setEditingDoc(null); }} 
        onAdd={handleAddDoc} 
        initialData={editingDoc} 
      />
    </Layout>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ReviewSession from './components/ReviewSession';
import LibraryHome from './components/LibraryHome';
import QuizCenter from './components/QuizCenter';
import CardManager from './components/CardManager';
import AddCardModal from './components/AddCardModal';
import AddDocModal from './components/AddDocModal';
import { fetchCards, fetchLibrary, updateCard, addCard, deleteCard } from './api/sheets';
import { calculateNextReview } from './utils/srs';

function App() {
  const [cards, setCards] = useState([]);
  const [library, setLibrary] = useState([]);
  const [view, setView] = useState('study'); // 'study', 'library'
  const [loading, setLoading] = useState(true);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

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
      setCards([]);
      setLibrary([]);
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
    
    // Optimistic update
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    
    // Persist to SheetDB
    await updateCard(id, updates);
  };

  const handleAddCard = async (formData) => {
    const newCard = {
      ...formData,
      id: Date.now().toString(),
      level: 'new',
      nextReview: today,
      lastReviewed: ''
    };
    setCards(prev => [...prev, newCard]);
    await addCard(newCard);
    setIsCardModalOpen(false);
  };

  const handleAddDoc = async (formData) => {
    if (editingDoc) {
      // Update
      setLibrary(prev => prev.map(doc => doc.id === editingDoc.id ? { ...doc, ...formData } : doc));
      await updateCard(editingDoc.id, formData, 'Library');
      setEditingDoc(null);
    } else {
      // Add
      const newDoc = {
        ...formData,
        id: Date.now().toString(),
      };
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
          if (view === 'study' || view === 'library') {
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
        setView={setView}
      />

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-20">
          {view === 'study' ? (
            <ReviewSession 
              cards={dueCards} 
              onAssessment={handleAssessment} 
            />
          ) : view === 'quiz' ? (
            <QuizCenter cards={cards} onStartQuiz={(quizCards) => {
              // For now, let's just show them in study view or implement a specific quiz runner
              setView('study');
            }} />
          ) : view === 'library' ? (
            <CardManager 
              cards={cards} 
              onEditCard={(card) => {
                setEditingCard(card);
                setIsCardModalOpen(true);
              }}
            />
          ) : (
            <LibraryHome 
              documents={library} 
              onEdit={handleEditDoc}
              onDelete={handleDeleteDoc}
            />
          )}
        </div>
      )}

      <AddCardModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onAdd={handleAddCard}
      />

      <AddDocModal 
        isOpen={isDocModalOpen}
        onClose={() => {
          setIsDocModalOpen(false);
          setEditingDoc(null);
        }}
        onAdd={handleAddDoc}
        initialData={editingDoc}
      />
    </Layout>
  );
}

export default App;



import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudySession from './components/StudySession';
import AddCardModal from './components/AddCardModal';
import { fetchCards, addCard, updateCard } from './api/sheets';

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const data = await fetchCards();
      if (data && data.length > 0) {
        // Normalize fields that might be missing from SheetDB
        const normalizedData = data.map(card => ({
          ...card,
          level: card.level || 'new',
          interval: parseInt(card.interval) || 0,
          last_reviewed: card.last_reviewed || '',
          next_review: card.next_review || today,
        }));
        setCards(normalizedData);
      }
      setLoading(false);
    };

    loadCards();
  }, []);

  // Daily Queue Logic
  const dueCards = cards
    .filter(card => !card.next_review || card.next_review <= today)
    .sort((a, b) => {
      const priority = { new: 1, familiar: 2, mastered: 3 };
      return priority[a.level] - priority[b.level];
    });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddCard = async (newCard) => {
    const cardWithData = { 
      ...newCard, 
      id: Date.now().toString(), 
      level: 'new',
      interval: 0,
      last_reviewed: '',
      next_review: today
    };
    setCards([...cards, cardWithData]);
    await addCard(cardWithData);
  };

  const handleAssessment = async (id, status) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    let newLevel = card.level;
    let newInterval = card.interval;
    const now = new Date();

    if (status === 'pass') {
      if (card.level === 'new') {
        newLevel = 'familiar';
        newInterval = 3;
      } else if (card.level === 'familiar') {
        newLevel = 'mastered';
        newInterval = 30;
      } else if (card.level === 'mastered') {
        newLevel = 'mastered';
        newInterval = Math.min(card.interval * 2, 90);
      }
    } else {
      newLevel = 'new';
      newInterval = 1;
    }

    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + newInterval);
    
    const updates = {
      level: newLevel,
      interval: newInterval,
      last_reviewed: now.toISOString().split('T')[0],
      next_review: nextReviewDate.toISOString().split('T')[0]
    };

    setCards(cards.map(c => c.id === id ? { ...c, ...updates } : c));
    await updateCard(id, updates);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-12 font-inter">
      <Navbar 
        onAddClick={() => setIsModalOpen(true)} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="container mx-auto px-4 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <StudySession 
            cards={dueCards} 
            onAssessment={handleAssessment} 
          />
        )}
      </main>

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCard}
      />

      {/* Background blobs for aesthetics */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}

export default App;

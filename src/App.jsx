import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudySession from './components/StudySession';
import AddCardModal from './components/AddCardModal';
import { fetchCards, addCard, updateCard } from './api/sheets';

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const data = await fetchCards();
      if (data && data.length > 0) {
        setCards(data);
      }
      setLoading(false);
    };

    loadCards();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddCard = async (newCard) => {
    const cardWithId = { ...newCard, id: Date.now().toString(), level: 'New' };
    setCards([...cards, cardWithId]);
    await addCard(cardWithId);
  };

  const handleUpdateCard = async (id, updates) => {
    setCards(cards.map(card => card.id === id ? { ...card, ...updates } : card));
    await updateCard(id, updates);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-12 font-inter">
      <Navbar 
        onAddClick={() => setIsModalOpen(true)} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="container mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <StudySession 
            cards={cards} 
            onUpdateCard={handleUpdateCard} 
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

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudySession from './components/StudySession';
import AddCardModal from './components/AddCardModal';
import { fetchCards, addCard, updateCard } from './api/sheets';

// Mock data in case API is not configured yet
const MOCK_CARDS = [
  { id: '1', word: 'Persistence', definition: 'Sự kiên trì, bền bỉ', level: 'New' },
  { id: '2', word: 'Eloquent', definition: 'Hùng hồn, có khả năng diễn đạt tốt', level: 'Familiar' },
  { id: '3', word: 'Meticulous', definition: 'Tỉ mỉ, kỹ càng', level: 'New' },
  { id: '4', word: 'Resilient', definition: 'Có khả năng phục hồi nhanh, kiên cường', level: 'Mastered' },
];

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const data = await fetchCards();
      if (data && data.length > 0) {
        setCards(data);
      } else {
        // Use mock data if API fails or is not configured
        setCards(MOCK_CARDS);
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

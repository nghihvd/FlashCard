const API_URL = 'https://sheetdb.io/api/v1/zqnnmsp3w4ctg';

/**
 * Fetch all cards from SheetDB
 */
export const fetchCards = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
};

/**
 * Update a card's level or details via SheetDB
 */
export const updateCard = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/id/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: updatedData })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating card:', error);
    return null;
  }
};

/**
 * Add a new card to SheetDB
 */
export const addCard = async (cardData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [cardData] })
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding card:', error);
    return null;
  }
};

/**
 * Delete a card from SheetDB
 */
export const deleteCard = async (id) => {
  try {
    const response = await fetch(`${API_URL}/id/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting card:', error);
    return null;
  }
};

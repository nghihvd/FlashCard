const API_URL = 'https://sheetdb.io/api/v1/vdu36mxnhq5um';

/**
 * Fetch data from a specific sheet
 */
export const fetchFromSheet = async (sheetName) => {
  try {
    const url = sheetName ? `${API_URL}?sheet=${sheetName}` : API_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from sheet ${sheetName || 'default'}:`, error);
    return [];
  }
};

/**
 * Fetch all cards from SheetDB (Default sheet)
 */
export const fetchCards = async () => {
  return await fetchFromSheet();
};


/**
 * Fetch library documents from SheetDB
 */
export const fetchLibrary = async () => {
  return await fetchFromSheet('Library');
};

/**
 * Update a card's level or details via SheetDB
 */
export const updateCard = async (id, updatedData, sheetName) => {
  try {
    const url = sheetName 
      ? `${API_URL}/id/${id}?sheet=${sheetName}` 
      : `${API_URL}/id/${id}`;
      
    const response = await fetch(url, {
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
export const addCard = async (cardData, sheetName) => {
  try {
    const url = sheetName ? `${API_URL}?sheet=${sheetName}` : API_URL;
    const response = await fetch(url, {
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
export const deleteCard = async (id, sheetName) => {
  try {
    const url = sheetName 
      ? `${API_URL}/id/${id}?sheet=${sheetName}` 
      : `${API_URL}/id/${id}`;

    const response = await fetch(url, {
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



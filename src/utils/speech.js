/**
 * Utility for Text-to-Speech using Web Speech API
 */
export const speak = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};

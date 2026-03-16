/**
 * Spaced Repetition System (SRS) Logic
 * Levels: New -> Familiar -> Mastered
 */

export const calculateNextReview = (currentLevel, isKnown) => {
  const now = new Date();
  let nextLevel = currentLevel;
  let daysToAdd = 0;

  if (isKnown) {
    switch (currentLevel?.toLowerCase()) {
      case 'new':
        nextLevel = 'familiar';
        daysToAdd = 3;
        break;
      case 'familiar':
        nextLevel = 'mastered';
        daysToAdd = 7;
        break;
      case 'mastered':
        nextLevel = 'mastered';
        daysToAdd = 30;
        break;
      default:
        nextLevel = 'familiar';
        daysToAdd = 3;
    }
  } else {
    // If forgotten, reset to 'new' and review tomorrow
    nextLevel = 'new';
    daysToAdd = 1;
  }

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + daysToAdd);

  return {
    level: nextLevel,
    nextReview: nextReviewDate.toISOString().split('T')[0],
    lastReviewed: now.toISOString().split('T')[0]
  };
};

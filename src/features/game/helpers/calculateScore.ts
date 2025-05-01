// Helper function to calculate score
export const calculateScore = (rating: string, difficulty: string) => {
  let points = 0;

  // Add points based on rating
  if (rating === "PERFECT") points += 100;
  else if (rating === "GOOD") points += 75;
  else if (rating === "OK") points += 50;
  else if (rating === "MISS") return points;
  
  return points;
};
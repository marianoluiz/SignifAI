/**
 * Helper function that calculates the score based on the player's rating.
 * 
 * Scoring:
 * - "PERFECT": Adds 100 points.
 * - "GOOD": Adds 75 points.
 * - "OK": Adds 50 points.
 * - "MISS": Adds 0 points (returns immediately).
 * 
 * @param rating - The player's rating for the current action (e.g., "PERFECT", "GOOD", "OK", "MISS").
 * @param difficulty - The difficulty level of the game (currently unused in this function).
 * @returns The calculated score as a number.
 */
export const calculateScore = (rating: string, _difficulty: string) => {
  let points = 0;

  // Add points based on rating
  if (rating === "PERFECT") points += 100;
  else if (rating === "GOOD") points += 75;
  else if (rating === "OK") points += 50;
  else if (rating === "MISS") return points;
  
  return points;
};
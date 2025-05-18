/**
 * Calculates the rating based on the player's current position relative to the perfect zone.
 * 
 * Ratings:
 * - "PERFECT": If the distance from the perfect zone is within 15 units.
 * - "GOOD": If the distance is within 31 units but greater than 15.
 * - "OK": If the distance is within 199 units but greater than 31.
 * - "MISS": If the distance exceeds 199 units.
 * 
 * @param currentPosition - The player's current position (e.g., hand position or input position).
 * @param perfectZoneX - The X-coordinate of the perfect zone.
 * @returns A string representing the rating: "PERFECT", "GOOD", "OK", or "MISS".
 */
export const calculateRating = (currentPosition: number, perfectZoneX: number, deviceType: string): string => {
  const distanceFromPerfect = Math.abs(currentPosition - perfectZoneX);

  const perfectThreshold = 15;
  const goodThreshold = 31;
  // if not mobile, set 127
  const okThreshold = deviceType !== "mobile" ? 127 : 95;

  if (distanceFromPerfect <= perfectThreshold) {
    return "PERFECT";
  } else if (distanceFromPerfect <= goodThreshold) {
    return "GOOD";
  } else if (distanceFromPerfect <= okThreshold) {
    return "OK";
  } else {
    return "MISS";
  }
};
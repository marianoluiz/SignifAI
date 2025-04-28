export const calculateRating = (currentPosition: number, perfectZoneX: number): string => {
  const distanceFromPerfect = Math.abs(currentPosition - perfectZoneX);

  const perfectThreshold = 7.5;
  const goodThreshold = 25.5;
  const okThreshold = 43.5;

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
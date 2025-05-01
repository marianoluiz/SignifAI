export const calculateRating = (currentPosition: number, perfectZoneX: number): string => {
  const distanceFromPerfect = Math.abs(currentPosition - perfectZoneX);

  const perfectThreshold = 15;
  const goodThreshold = 31;
  const okThreshold = 199;

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
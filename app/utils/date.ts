export default function isOlderThan24Hours(date: string) {
  const currentTime = Date.now();
  const dateToCheck = new Date(date);
  const timeToCheck = dateToCheck.getTime();

  const isOlderThan24Hours = currentTime - timeToCheck >= 24 * 60 * 60 * 1000;
  return isOlderThan24Hours;
}

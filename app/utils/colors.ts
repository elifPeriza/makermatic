export default function isValidHSL(val: string) {
  const hslRegex = /^hsl\((\d{1,3}),\s?(\d{1,3}%),\s?(\d{1,3}%)\)$/;
  const match = hslRegex.exec(val);

  if (!match) {
    return false;
  }

  const hue = parseInt(match[1], 10);
  const saturation = parseInt(match[2], 10);
  const lightness = parseInt(match[3], 10);

  return (
    hue >= 0 &&
    hue <= 360 &&
    saturation >= 0 &&
    saturation <= 80 &&
    lightness >= 0 &&
    lightness <= 100
  );
}

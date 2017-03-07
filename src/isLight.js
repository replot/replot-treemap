export default function isLight (hexColor) {
  const thresholdValue = parseInt("777777", 16)
  if (hexColor.length === 7) {
    let colorValue = parseInt(hexColor.slice(1), 16)
    if (colorValue > thresholdValue) {
      return true
    }
  }
  return false
}

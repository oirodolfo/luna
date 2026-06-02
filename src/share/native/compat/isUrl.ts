export default function isUrl(value) {
  try {
    new URL(String(value))
    return true
  } catch {
    return false
  }
}

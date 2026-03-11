export function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString()
}

export function previewText(text: string, max = 140) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '...'
}

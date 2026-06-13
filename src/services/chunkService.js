export function chunkText(text, maxLength = 500) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence + " ";
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

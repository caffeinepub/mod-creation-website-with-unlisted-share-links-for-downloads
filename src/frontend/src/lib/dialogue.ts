export function ensureQuoted(text: string): string {
  if (!text) return '""';
  
  const trimmed = text.trim();
  
  // Already quoted
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed;
  }
  
  // Add quotes
  return `"${trimmed}"`;
}

export function stripQuotes(text: string): string {
  if (!text) return '';
  
  const trimmed = text.trim();
  
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed.slice(1, -1);
  }
  
  return trimmed;
}

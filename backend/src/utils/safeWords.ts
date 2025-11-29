// Safety filter for harmful content
export const HARMFUL_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
  'violence', 'hurt others', 'revenge', 'illegal', 'drugs'
];

export function containsHarmfulContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HARMFUL_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

export function getSafetyMessage(): string {
  return "I sense you're going through a difficult time. Your feelings are valid, and you deserve support. Please consider reaching out to a mental health professional, trusted friend, or crisis helpline. The Oracle is here for guidance, but human connection and professional help are invaluable during challenging moments.";
}
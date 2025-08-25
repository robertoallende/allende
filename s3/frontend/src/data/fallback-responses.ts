/**
 * Fallback Response System
 * Simple array of random responses when user input doesn't match any content rules
 */

// Simple list of fallback responses - replace with your own content
export const fallbackResponses: string[] = [
  "Noted. I can give a quick summary, a deeper dive, or an example—just say the word.",
  "I'm here to help with facts, examples, or step-by-step guidance whenever you're ready.",
  "If you'd like, I can suggest next steps or share a concise tip related to your message.",
  "Message received. I can draft something, explain a concept, or brainstorm options.",
  "Happy to assist—prefer a brief answer, a detailed breakdown, or a practical checklist.",
  "Thanks for that. I can adapt the tone: casual, technical, or executive-ready.",
  "I can generate a small demo, sample text, or a set of bullet points based on your input.",
  "Understood. I'll keep things clear and actionable unless you say otherwise.",
  "I can stay high-level or jump into specifics; just indicate your preference.",
  "If context would help, I can infer assumptions and proceed, then adjust based on your feedback.",
  "Got it. Let's keep the conversation moving forward.",
  "Understood. Let's take this one step at a time.",
  "I hear you. Let's see where this goes.",
  "Alright. We can build on that if you'd like.",
  "Message received. Ready to adapt if you want to shift gears.",
  "Noted. Let's keep things simple for now.",
  "Okay. We can explore that further together.",
  "Acknowledged. Let's focus on the next move.",
  "Sure thing. Let's refine or expand on that idea.",
  "Alright, I'm ready to continue whenever you are.",
  "Got it, let's keep the flow going.",
  "Noted. Ready for the next step.",
  "Alright, let's roll with that.",
  "Understood. We can pivot if you need to.",
  "Okay, that makes sense. Let's continue.",
  "I'm following you. Keep going.",
  "Alright, message received loud and clear.",
  "I'm here. Let's keep building on that.",
  "Gotcha. Ready for whatever comes next. And you?",
  "Alright, that works for me. Does it work for you?",
  "Cool. Let's stay on track.",
  "Noted. I'm here to keep the conversation smooth.",
  "Alright, acknowledged.",
  "Okay, keeping that in mind as we continue.",
  "All good. Let's carry on.",
  "Understood. Let's keep it moving.",
  "Noted. Let's see where this takes us.",
  "I see — and what's your take on it?",
  "This conversation totally reminds me of Groundhog Day. Have you seen that movie?"
];

// Track recently used responses to avoid repetition
let recentlyUsed: number[] = [];
const maxRecentTracking = 5;

/**
 * Get a random fallback response, avoiding recently used ones
 */
export function getRandomFallbackResponse(): string {
  // Filter out recently used indices
  const availableIndices = fallbackResponses
    .map((_, index) => index)
    .filter(index => !recentlyUsed.includes(index));

  // If all responses have been used recently, reset tracking
  const indicesToChooseFrom = availableIndices.length > 0 
    ? availableIndices 
    : fallbackResponses.map((_, index) => index);

  // Random selection
  const randomIndex = indicesToChooseFrom[Math.floor(Math.random() * indicesToChooseFrom.length)];
  
  // Update tracking
  recentlyUsed.unshift(randomIndex);
  if (recentlyUsed.length > maxRecentTracking) {
    recentlyUsed = recentlyUsed.slice(0, maxRecentTracking);
  }

  return fallbackResponses[randomIndex];
}

/**
 * Reset the tracking (useful for testing)
 */
export function resetFallbackTracking(): void {
  recentlyUsed = [];
}

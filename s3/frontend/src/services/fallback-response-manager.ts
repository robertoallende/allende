/**
 * Fallback Response Manager
 * Simple wrapper around the fallback responses array with analytics tracking
 */

import { getRandomFallbackResponse, resetFallbackTracking } from '@/data/fallback-responses';
import { trackFallbackResponse } from '@/lib/analytics';

/**
 * Get a random fallback response with analytics tracking
 */
export function getFallbackResponse(userMessage?: string): string {
  const response = getRandomFallbackResponse();
  
  // Track fallback response usage
  if (userMessage) {
    trackFallbackResponse(userMessage, response);
  }
  
  return response;
}

/**
 * Reset tracking (useful for testing)
 */
export function resetTracking(): void {
  resetFallbackTracking();
}

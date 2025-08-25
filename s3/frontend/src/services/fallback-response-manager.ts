/**
 * Fallback Response Manager
 * Simple wrapper around the fallback responses array
 */

import { getRandomFallbackResponse, resetFallbackTracking } from '@/data/fallback-responses';

/**
 * Get a random fallback response
 */
export function getFallbackResponse(): string {
  return getRandomFallbackResponse();
}

/**
 * Reset tracking (useful for testing)
 */
export function resetTracking(): void {
  resetFallbackTracking();
}

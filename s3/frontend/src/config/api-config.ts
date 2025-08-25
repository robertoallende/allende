/**
 * API Configuration
 * Manages API endpoints and configuration for different environments
 */

export const apiConfig = {
  // Email API endpoint
  emailEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 
    'https://f70cyrmiqh.execute-api.us-east-1.amazonaws.com/prod/submit',
  
  // Request timeout in milliseconds
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    exponentialBackoff: true,
  },
  
  // Development mode
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API version (for future use)
  version: 'v1',
} as const;

/**
 * Validate API configuration
 */
export function validateApiConfig(): void {
  if (!apiConfig.emailEndpoint) {
    throw new Error('API endpoint is not configured. Please set NEXT_PUBLIC_API_ENDPOINT environment variable.');
  }

  if (!apiConfig.emailEndpoint.startsWith('https://')) {
    throw new Error('API endpoint must use HTTPS protocol.');
  }

  if (apiConfig.timeout < 1000 || apiConfig.timeout > 60000) {
    throw new Error('API timeout must be between 1 and 60 seconds.');
  }
}

/**
 * Get API endpoint for email submissions
 */
export function getEmailApiEndpoint(): string {
  return apiConfig.emailEndpoint;
}

/**
 * Check if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  return apiConfig.isDevelopment;
}

// Validate configuration on import
if (typeof window !== 'undefined') {
  // Only validate in browser environment
  try {
    validateApiConfig();
  } catch (error) {
    console.error('API Configuration Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

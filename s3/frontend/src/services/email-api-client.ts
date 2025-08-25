/**
 * Email API Client Service
 * Handles HTTP communication with the backend API for email submissions
 */

export interface EmailSubmissionRequest {
  name: string;
  email: string;
  message: string;
  verificationPassed: boolean;
  timestamp: string;
}

export interface EmailSubmissionSuccess {
  message: string;
  requestId: string;
}

export interface EmailSubmissionError {
  error: string;
  code?: string;
  requestId?: string;
}

export type EmailSubmissionResult = EmailSubmissionSuccess | EmailSubmissionError;

export class EmailApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'EmailApiError';
  }
}

export class EmailApiClient {
  private readonly endpoint: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 
      'https://f70cyrmiqh.execute-api.us-east-1.amazonaws.com/prod/submit';
    this.timeout = 30000; // 30 seconds
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Submit email to backend API with retry logic
   */
  async submitEmail(submission: EmailSubmissionRequest): Promise<EmailSubmissionSuccess> {
    let lastError: EmailApiError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.makeRequest(submission);
        
        // If we get here, the request was successful
        if ('message' in result && 'requestId' in result) {
          return result as EmailSubmissionSuccess;
        } else {
          // Unexpected response format
          throw new EmailApiError('Invalid response format from server');
        }
      } catch (error) {
        lastError = error instanceof EmailApiError ? error : 
          new EmailApiError('Network error occurred');

        // Don't retry validation errors (4xx except 429)
        if (lastError.statusCode && lastError.statusCode >= 400 && 
            lastError.statusCode < 500 && lastError.statusCode !== 429) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          throw lastError;
        }

        // Wait before retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Make HTTP request to API endpoint
   */
  private async makeRequest(submission: EmailSubmissionRequest): Promise<EmailSubmissionResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let responseData: EmailSubmissionResult;
      try {
        responseData = await response.json();
      } catch {
        throw new EmailApiError(
          'Invalid response from server',
          response.status
        );
      }

      // Handle success response
      if (response.ok) {
        return responseData as EmailSubmissionSuccess;
      }

      // Handle error response
      const errorData = responseData as EmailSubmissionError;
      const errorMessage = errorData.error || 'Unknown error occurred';
      throw new EmailApiError(
        errorMessage,
        response.status,
        errorData.code,
        errorData.requestId
      );

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new EmailApiError('Request timed out. Please try again.');
      }

      if (error instanceof EmailApiError) {
        throw error;
      }

      // Network or other errors
      throw new EmailApiError('Network error. Please check your connection.');
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyErrorMessage(error: EmailApiError): string {
    // Network errors
    if (!error.statusCode) {
      return "Connection failed. Please check your internet and try again.";
    }

    // API errors
    switch (error.statusCode) {
      case 400:
        // Use specific error message from API for validation errors
        if (error.message.includes('Name is required')) {
          return "Please provide your name.";
        }
        if (error.message.includes('Email is required')) {
          return "Please provide your email address.";
        }
        if (error.message.includes('Invalid email format')) {
          return "Please check your email address format.";
        }
        if (error.message.includes('Message is required')) {
          return "Please provide a message.";
        }
        if (error.message.includes('Human verification required')) {
          return "Please complete the verification question.";
        }
        return "Please check your information and try again.";

      case 429:
        return "You're sending messages too quickly. Please wait a moment and try again.";

      case 500:
      case 502:
      case 503:
        return "Server error occurred. Please try again in a few minutes.";

      default:
        return "Something went wrong. Please try again.";
    }
  }
}

/**
 * TypeScript types for Email API integration
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

export interface EmailApiConfig {
  endpoint: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

export interface EmailConversationMetadata {
  isEmailConversation?: boolean;
  emailAction?: 'SEND_EMAIL' | 'RETRY_EMAIL';
  emailSent?: boolean;
  emailError?: boolean;
}

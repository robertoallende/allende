import { VerificationQuestion, getRandomQuestion, validateAnswer } from '@/data/verification-questions';
import { EmailApiClient, EmailApiError, EmailSubmissionRequest } from './email-api-client';

export type EmailConversationStep = 
  | 'collecting_name'      // Step 1: "What's your name?"
  | 'collecting_email'     // Step 2: "What's your email?"
  | 'collecting_message'   // Step 3: "What would you like to tell him?"
  | 'verifying_human'      // Step 4: Random verification question
  | 'sending'              // Step 5: Sending email via API
  | 'complete' 
  | 'error'                // Error state for retry
  | null;

export interface EmailConversationState {
  step: EmailConversationStep;
  userName?: string;        // Collected first
  userEmail?: string;       // Collected second
  userMessage?: string;     // Collected third
  currentQuestion?: VerificationQuestion;
  usedQuestionIds: string[];
  lastError?: string;       // For retry scenarios
  retryCount?: number;      // Track retry attempts
}

// Global state for email conversation (simple approach for now)
let emailConversationState: EmailConversationState = {
  step: null,
  usedQuestionIds: []
};

// Initialize API client
const apiClient = new EmailApiClient();

export function isEmailTrigger(message: string): boolean {
  const emailTriggers = [
    /send.*email.*roberto/i,
    /contact.*roberto/i,
    /email.*roberto/i,
    /reach.*out.*roberto/i,
    /get.*in.*touch.*roberto/i
  ];
  
  return emailTriggers.some(pattern => pattern.test(message));
}

export function startEmailConversation(): string {
  emailConversationState = {
    step: 'collecting_name',  // Start with name collection
    usedQuestionIds: [],
    retryCount: 0
  };
  
  return "I'd be happy to help you send Roberto an email! What's your name so Roberto knows who's reaching out?";
}

function isValidName(name: string): boolean {
  const trimmedName = name.trim();
  
  // Basic validation rules
  if (trimmedName.length < 2) return false;
  if (trimmedName.length > 100) return false;
  
  // Allow letters, spaces, hyphens, apostrophes (international names)
  const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/;
  return nameRegex.test(trimmedName);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Send email via API
 */
async function sendEmailToRoberto(state: EmailConversationState): Promise<{ success: boolean; message: string }> {
  if (!state.userName || !state.userEmail || !state.userMessage) {
    return {
      success: false,
      message: "Missing required information. Please start over."
    };
  }

  const emailSubmission: EmailSubmissionRequest = {
    name: state.userName,
    email: state.userEmail,
    message: state.userMessage,
    verificationPassed: true,
    timestamp: new Date().toISOString()
  };

  try {
    await apiClient.submitEmail(emailSubmission);
    
    return {
      success: true,
      message: `Your message has been sent to Roberto! He typically responds within 24-48 hours to ${state.userEmail}.

Thank you for reaching out!`
    };
  } catch (error) {
    const apiError = error as EmailApiError;
    const userMessage = EmailApiClient.getUserFriendlyErrorMessage(apiError);
    
    return {
      success: false,
      message: userMessage
    };
  }
}

export async function handleEmailMessage(message: string): Promise<{ response: string; action?: 'SEND_EMAIL' | 'RETRY_EMAIL' }> {
  const state = emailConversationState;
  
  // Handle retry scenarios
  if (state.step === 'error') {
    const retryTriggers = /^(yes|y|retry|try again|send)$/i;
    const cancelTriggers = /^(no|n|cancel|stop)$/i;
    
    if (retryTriggers.test(message.trim())) {
      // User wants to retry
      emailConversationState = {
        ...state,
        step: 'sending',
        retryCount: (state.retryCount || 0) + 1
      };
      
      return {
        response: "Retrying to send your message to Roberto...",
        action: 'RETRY_EMAIL'
      };
    } else if (cancelTriggers.test(message.trim())) {
      // User wants to cancel
      resetEmailConversation();
      return {
        response: "No problem! Feel free to ask me anything else or try sending an email later."
      };
    } else {
      // Invalid response
      return {
        response: "Would you like me to try sending your message again? Just say 'yes' to retry or 'no' to cancel."
      };
    }
  }
  
  switch (state.step) {
    case 'collecting_name':
      const name = message.trim();
      
      if (!isValidName(name)) {
        return {
          response: "Could you please provide your full name? Just your first and last name would be perfect."
        };
      }
      
      // Store name and move to email collection
      emailConversationState = {
        ...state,
        step: 'collecting_email',
        userName: name
      };
      
      return {
        response: `Nice to meet you, ${name}! What's your email address so Roberto can reply to you?`
      };
    
    case 'collecting_email':
      const email = message.trim();
      
      if (!isValidEmail(email)) {
        return {
          response: "That doesn't look like a valid email address. Could you please provide a valid email so Roberto can reply?"
        };
      }
      
      // Store email and move to message collection
      emailConversationState = {
        ...state,
        step: 'collecting_message',
        userEmail: email
      };
      
      return {
        response: "Perfect! What would you like to tell Roberto?"
      };
    
    case 'collecting_message':
      // Store message and move to verification
      const question = getRandomQuestion(state.usedQuestionIds);
      emailConversationState = {
        ...state,
        step: 'verifying_human',
        userMessage: message.trim(),
        currentQuestion: question,
        usedQuestionIds: [...state.usedQuestionIds, question.id]
      };
      
      return {
        response: `Great message! Just need to verify you're human first. ${question.question}`
      };
    
    case 'verifying_human':
      if (!state.currentQuestion) {
        // Fallback - shouldn't happen
        return { response: "Something went wrong. Let's start over." };
      }
      
      const isCorrect = validateAnswer(state.currentQuestion, message);
      
      if (isCorrect) {
        // Correct answer - show loading message first, then send email
        emailConversationState = {
          ...state,
          step: 'sending'
        };
        
        return {
          response: "You're absolutely right! Sending your message to Roberto...",
          action: 'SEND_EMAIL'
        };
      } else {
        // Wrong answer - try different question
        const newQuestion = getRandomQuestion(state.usedQuestionIds);
        emailConversationState = {
          ...state,
          currentQuestion: newQuestion,
          usedQuestionIds: [...state.usedQuestionIds, newQuestion.id]
        };
        
        return {
          response: `That's not quite right, but no worries! Let me try a different question. ${newQuestion.question}`
        };
      }
    
    default:
      return { response: "I'm not sure what happened. Let's start over." };
  }
}

/**
 * Process email sending and return result
 */
export async function processEmailSending(): Promise<string> {
  const state = emailConversationState;
  
  if (state.step !== 'sending') {
    return "Email sending process called at wrong time.";
  }

  const result = await sendEmailToRoberto(state);
  
  if (result.success) {
    // Success - mark as complete
    emailConversationState = {
      ...state,
      step: 'complete'
    };
    return result.message;
  } else {
    // Error - offer retry
    emailConversationState = {
      ...state,
      step: 'error',
      lastError: result.message
    };
    
    const retryCount = state.retryCount || 0;
    if (retryCount < 2) {
      return `${result.message}

Would you like me to try sending your message again?`;
    } else {
      return `${result.message}

I've tried several times but couldn't send your message. You can try again later or reach out to Roberto directly at his website.`;
    }
  }
}

export function getEmailConversationState(): EmailConversationState {
  return emailConversationState;
}

export function resetEmailConversation(): void {
  emailConversationState = {
    step: null,
    usedQuestionIds: []
  };
}

export function isInEmailConversation(): boolean {
  return emailConversationState.step !== null && 
         emailConversationState.step !== 'complete';
}
